/**
 * Runner de migrations.
 *
 * Aplica os arquivos .sql de ./drizzle em ordem lexicografica, uma vez cada,
 * registrando o que ja rodou na tabela _migration. Cada arquivo roda dentro de
 * uma transacao: ou aplica inteiro, ou nao aplica nada.
 *
 * Roda com o usuario DONO do banco (DATABASE_ADMIN_URL), nao com o papel da
 * aplicacao - migrations precisam criar papeis, politicas e tabelas.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import postgres from 'postgres'

const url = process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL

if (!url) {
  console.error('[migrate] Defina DATABASE_ADMIN_URL ou DATABASE_URL.')
  process.exit(1)
}

const dir = join(process.cwd(), 'drizzle')
const sql = postgres(url, { max: 1, onnotice: () => {} })

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS _migration (
      nome        text PRIMARY KEY,
      aplicada_em timestamptz NOT NULL DEFAULT now()
    )
  `

  const aplicadas = new Set(
    (await sql<{ nome: string }[]>`SELECT nome FROM _migration`).map((r) => r.nome),
  )

  const arquivos = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  const pendentes = arquivos.filter((f) => !aplicadas.has(f))

  if (pendentes.length === 0) {
    console.log(`[migrate] Nada a fazer - ${arquivos.length} migration(s) ja aplicada(s).`)
    return
  }

  for (const arquivo of pendentes) {
    const conteudo = readFileSync(join(dir, arquivo), 'utf8')
    process.stdout.write(`[migrate] aplicando ${arquivo} ... `)
    await sql.begin(async (tx) => {
      await tx.unsafe(conteudo)
      await tx`INSERT INTO _migration (nome) VALUES (${arquivo})`
    })
    console.log('ok')
  }

  console.log(`[migrate] ${pendentes.length} migration(s) aplicada(s).`)
}

main()
  .then(() => sql.end())
  .then(() => process.exit(0))
  .catch(async (erro) => {
    console.error('\n[migrate] FALHOU:', erro instanceof Error ? erro.message : erro)
    await sql.end()
    process.exit(1)
  })
