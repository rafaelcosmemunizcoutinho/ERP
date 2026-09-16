#!/usr/bin/env node
/**
 * Três armadilhas de shell deste repositório, impedidas em vez de escritas.
 *
 * Todas as três estão no AGENTS.md — e duas delas já custaram trabalho perdido.
 * Documento que descreve armadilha não impede ninguém de cair nela; este hook
 * impede.
 *
 * 1. `npm` no HOST usa o `node_modules` errado. Ele vive num volume Docker, não
 *    na pasta — então o comando roda, resolve pacote de outro lugar, e o
 *    resultado não é o que o CI vai ver.
 * 2. Commit na `main`. Invariante 14: branch sempre a partir de `main`
 *    atualizada, nunca commitar nela.
 * 3. Heredoc com `$$`. O shell expande, o SQL da função PL/pgSQL chega
 *    truncado, e "já custou uma execução perdida".
 *
 * Nunca derruba a sessão: qualquer erro sai como permitido.
 */

import { execFileSync } from 'node:child_process'

const ESCOTILHA = 'ERP_PERMITIR_COMANDO_FORA_DO_PADRAO'

function responder(decisao, motivo) {
  if (decisao !== 'allow') {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: decisao,
          permissionDecisionReason: motivo,
        },
      })
    )
  }
  process.exit(0)
}

const permitir = () => responder('allow')

/** O ramo de agora, ou `null` se não for repositório. */
function ramo() {
  try {
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

let entrada = ''
process.stdin.on('data', (p) => {
  entrada += p
})

process.stdin.on('end', () => {
  try {
    if (process.env[ESCOTILHA]) permitir()

    const cmd = JSON.parse(entrada || '{}')?.tool_input?.command
    if (typeof cmd !== 'string' || cmd.length === 0) permitir()

    // ---- 1. npm no host --------------------------------------------------
    //
    // Só os verbos que dependem do `node_modules`. `npm --version` e `npm view`
    // não mordem ninguém e passam.
    const npmQuePrecisaDoContainer = /(^|[;&|]\s*)npm\s+(run|test|install|ci|exec)\b/
    const jaEstaNoContainer = /docker\s+compose\s+(exec|run)/

    if (npmQuePrecisaDoContainer.test(cmd) && !jaEstaNoContainer.test(cmd)) {
      responder(
        'deny',
        [
          '`npm` no HOST usa o `node_modules` ERRADO — ele vive num volume Docker, não na',
          'pasta. O comando roda, resolve pacote de outro lugar, e o resultado não é o que',
          'o CI vai ver.',
          '',
          'Rode dentro do container:',
          '',
          '  docker compose exec app npm run <script>',
          '',
          'E se nada estiver de pé: `docker compose up` (o `app` só inicia depois que o',
          '`migrate` conclui).',
          '',
          'Ver AGENTS.md § Build & Run.',
        ].join('\n')
      )
    }

    // ---- 2. commit na main ----------------------------------------------
    if (/(^|[;&|]\s*)git\s+commit\b/.test(cmd)) {
      const atual = ramo()
      if (atual === 'main') {
        responder(
          'deny',
          [
            'Commit na `main` — invariante 14: *branch sempre a partir de `main` atualizada,',
            'nunca commitar nela*.',
            '',
            '  git fetch origin main',
            '  git checkout -b <tipo>/<assunto> origin/main',
            '',
            'E o PR é pequeno e de um assunto só: convenção e feature no mesmo PR fica',
            'irrevisável — já foi separado uma vez por esse motivo (AGENTS.md § PR & Branch).',
          ].join('\n')
        )
      }
    }

    // ---- 3. heredoc com $$ -----------------------------------------------
    //
    // `ask` e não `deny`: o caso legítimo existe (heredoc com aspas no
    // delimitador não expande), e aqui o que falta é a pessoa olhar.
    if (/<<[-']?\s*\w+/.test(cmd) && cmd.includes('$$')) {
      responder(
        'ask',
        [
          'Heredoc com `$$` no conteúdo. O shell expande, e o SQL da função PL/pgSQL chega',
          'TRUNCADO ao arquivo — já custou uma execução perdida (AGENTS.md § Armadilhas).',
          '',
          'Escreva o arquivo direto em vez de mandar por heredoc. Se o delimitador estiver',
          "entre aspas (<<'EOF'), não há expansão e este aviso é falso positivo.",
        ].join('\n')
      )
    }

    permitir()
  } catch {
    permitir()
  }
})
