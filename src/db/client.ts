import { drizzle } from 'drizzle-orm/postgres-js'
import { sql as raw } from 'drizzle-orm'
import postgres from 'postgres'
import * as schema from './schema'

const url = process.env.DATABASE_URL

if (url === undefined || url === '') {
  throw new Error('DATABASE_URL nao definida.')
}

const conexao = postgres(url, { max: 10, onnotice: () => {} })

export const db = drizzle(conexao, { schema })

type Transacao = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type Contexto = string | { tenantId: string, usuarioId?: string }

/**
 * ARMADILHA DE SEGURANCA: nenhuma consulta de negocio pode rodar fora daqui.
 * `set_config(..., true)` e local a transacao, o que impede o contexto de
 * vazar entre requisicoes que compartilham a mesma conexao do pool.
 * As politicas de RLS em drizzle/0002_rls.sql leem app.tenant_id, e os
 * triggers de auditoria em drizzle/0006 leem app.usuario_id para saber o autor.
 */
export async function comTenant<T> (
  contexto: Contexto,
  fn: (tx: Transacao) => Promise<T>
): Promise<T> {
  const { tenantId, usuarioId } =
    typeof contexto === 'string' ? { tenantId: contexto, usuarioId: undefined } : contexto

  return await db.transaction(async (tx) => {
    await tx.execute(raw`SELECT set_config('app.tenant_id', ${tenantId}, true)`)
    await tx.execute(raw`SELECT set_config('app.usuario_id', ${usuarioId ?? ''}, true)`)
    return await fn(tx)
  })
}

export async function verificarBanco (): Promise<boolean> {
  try {
    await conexao`SELECT 1`
    return true
  } catch {
    return false
  }
}
