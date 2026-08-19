/**
 * Cliente de banco.
 *
 * Regra de ouro do multi-tenant: NENHUMA consulta de negocio roda fora de
 * `comTenant()`. O tenant vem da sessao autenticada no servidor - nunca de
 * parametro de rota, query string ou header enviado pelo cliente.
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql as raw } from 'drizzle-orm'
import postgres from 'postgres'
import * as schema from './schema'

const url = process.env.DATABASE_URL

if (!url) {
  throw new Error('DATABASE_URL nao definida.')
}

// max: 10 e suficiente para o porte alvo (ate ~500 vendas/dia por tenant).
const conexao = postgres(url, { max: 10, onnotice: () => {} })

export const db = drizzle(conexao, { schema })

/**
 * Executa uma unidade de trabalho no contexto de um tenant.
 *
 * `SET LOCAL` vale apenas dentro da transacao, entao o vazamento de contexto
 * entre requisicoes que compartilham a mesma conexao do pool e impossivel.
 * As politicas de RLS criadas em drizzle/0002_rls.sql leem esse valor.
 */
export async function comTenant<T>(
  tenantId: string,
  fn: (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(raw`SELECT set_config('app.tenant_id', ${tenantId}, true)`)
    return fn(tx)
  })
}

/** Ping simples usado pelo healthcheck. */
export async function verificarBanco(): Promise<boolean> {
  try {
    await conexao`SELECT 1`
    return true
  } catch {
    return false
  }
}
