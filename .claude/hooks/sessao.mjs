#!/usr/bin/env node
/**
 * O que a sessão precisa saber antes de agir — e só isso.
 *
 * Três linhas fixas apontando o que governa este repositório, mais um aviso por
 * problema REAL encontrado. Árvore sã custa pouco; árvore com problema custa o
 * que o problema vale.
 *
 * TUDO É MEDIDO, nada é afirmado — nenhuma lista escrita à mão, que sairia de
 * sincronia sem ninguém perceber.
 *
 * Nunca derruba a sessão: qualquer erro sai calado.
 */

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

function sair(texto) {
  if (texto) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: texto },
      })
    )
  }
  process.exit(0)
}

function raizDoRepo(partida) {
  let dir = resolve(partida)
  for (let i = 0; i < 64; i += 1) {
    if (existsSync(join(dir, '.git'))) return dir
    const acima = dirname(dir)
    if (acima === dir) return null
    dir = acima
  }
  return null
}

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

try {
  const raiz = raizDoRepo(process.cwd())
  if (!raiz) sair('')

  const linhas = [
    'erp-web — antes de agir:',
    '· invariantes e mapa → CLAUDE.md (14 não-negociáveis)',
    '· operacional (build, banco, PR, armadilhas) → AGENTS.md',
    '· TUDO roda no container: `docker compose exec app npm run <script>`',
    '  npm no host usa o node_modules errado — ele vive num volume Docker.',
  ]

  const atual = ramo()
  if (atual === 'main') {
    linhas.push(
      '',
      'ATENÇÃO: você está na `main`. Invariante 14 — nunca commitar nela.',
      '  git fetch origin main && git checkout -b <tipo>/<assunto> origin/main'
    )
  }

  // `.env` é declarado por `.env.example`; sem ele o compose sobe sem as
  // variáveis e a falha aparece longe da causa.
  if (existsSync(join(raiz, '.env.example')) && !existsSync(join(raiz, '.env'))) {
    linhas.push('', 'Sem `.env` na raiz. Copie de `.env.example` antes de `docker compose up`.')
  }

  linhas.push(
    '',
    'E a que mais cobra pedágio: sob RLS, esquecer o contexto de tenant NÃO dá erro —',
    'dá silêncio. Ao ver "0 linhas" onde deveria haver dado, suspeite do contexto antes',
    'de suspeitar da consulta. Toda leitura ou escrita de negócio passa por comTenant().'
  )

  sair(linhas.join('\n'))
} catch {
  sair('')
}
