#!/usr/bin/env node
/**
 * Migration que já existe não se edita — cria-se a próxima.
 *
 * `drizzle/` é SQL numerado, aplicado uma vez cada, em transação, e registrado
 * em `_migration`. Editar um arquivo já aplicado não reaplica nada: o banco de
 * quem já rodou fica diferente do banco de quem rodar depois, **sem erro**.
 * (AGENTS.md § Banco.)
 *
 * É `ask`, não `deny`, e o motivo é honesto: o hook não tem como saber se ESTA
 * migration já foi aplicada em algum lugar — saber exigiria consultar
 * `_migration` num banco que pode nem estar de pé. Editar uma que nasceu nesta
 * mesma sessão e nunca rodou é legítimo. Então ele pergunta, com o critério na
 * mão, em vez de bloquear pela metade.
 *
 * Arquivo NOVO passa direto: criar a próxima é exatamente o caminho certo.
 */

import { existsSync } from 'node:fs'
import { resolve, sep } from 'node:path'

/**
 * Caminho nativo, inclusive quando vem em forma POSIX no Windows.
 *
 * Git Bash e afins entregam `/d/repo/x`. No Windows, `resolve()` lê isso como
 * "raiz da unidade atual" e devolve `D:\d\repo\x` — que não existe. O guarda
 * então não acha o arquivo e **passa em silêncio**, que é a pior falha possível
 * para um guarda. Converter antes é uma linha; descobrir depois custa o defeito
 * que ele existia para impedir.
 */
function caminhoNativo(bruto) {
  if (process.platform === 'win32') {
    const posix = /^\/([a-zA-Z])\/(.*)$/.exec(bruto)
    if (posix) return resolve(`${posix[1]}:\\${posix[2]}`)
  }
  return resolve(bruto)
}

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

let entrada = ''
process.stdin.on('data', (p) => {
  entrada += p
})

process.stdin.on('end', () => {
  try {
    const alvo = JSON.parse(entrada || '{}')?.tool_input?.file_path
    if (typeof alvo !== 'string' || alvo.length === 0) permitir()

    const caminho = caminhoNativo(alvo)
    const ehMigration = caminho.includes(`${sep}drizzle${sep}`) && caminho.endsWith('.sql')
    if (!ehMigration) permitir()

    // Arquivo que ainda não existe é a próxima migration: caminho certo.
    if (!existsSync(caminho)) permitir()

    responder(
      'ask',
      [
        'Este arquivo de migration JÁ EXISTE.',
        '',
        '`drizzle/` é SQL numerado, aplicado uma vez cada e registrado em `_migration`.',
        'Editar um arquivo já aplicado NÃO reaplica nada: o banco de quem já rodou fica',
        'diferente do de quem rodar depois, **sem erro nenhum**.',
        '',
        'O caminho é criar a PRÓXIMA migration (AGENTS.md § Banco).',
        '',
        'Se esta nasceu agora e nunca foi aplicada, editar é legítimo — este hook não',
        'consegue distinguir os dois casos sem consultar o banco, por isso pergunta.',
      ].join('\n')
    )
  } catch {
    permitir()
  }
})
