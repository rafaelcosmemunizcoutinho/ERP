import { sql } from 'drizzle-orm'
import { comTenant } from '@/db/client'

export type Categoria = Record<string, unknown> & {
  id: string
  nome: string
  perecivel: boolean
  dias_alerta_critico: number | null
  dias_alerta_atencao: number | null
  ordem: number
  ativo: boolean
  produtos: number
}

export async function listarCategorias (tenantId: string): Promise<Categoria[]> {
  return await comTenant(tenantId, async (tx) =>
    await tx.execute<Categoria>(sql`
      SELECT c.id, c.nome, c.perecivel, c.dias_alerta_critico, c.dias_alerta_atencao,
             c.ordem, c.ativo,
             (SELECT count(*)::int FROM produto p WHERE p.categoria_id = c.id) AS produtos
      FROM categoria c
      ORDER BY c.ordem, lower(c.nome)
    `)
  )
}
