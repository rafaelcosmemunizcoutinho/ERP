import { sql } from 'drizzle-orm'
import { comTenant } from '@/db/client'

export type Resumo = Record<string, unknown> & {
  empresa: string
  segmento: string
  categorias: number
  contas: number
}

export async function carregarResumo (tenantId: string): Promise<Resumo> {
  return await comTenant(tenantId, async (tx) => {
    const [linha] = await tx.execute<Resumo>(sql`
      SELECT
        coalesce(
          (SELECT coalesce(e.nome_fantasia, e.razao_social) FROM empresa e WHERE e.ativo LIMIT 1),
          (SELECT t.nome FROM tenant t LIMIT 1)
        ) AS empresa,
        (SELECT t.segmento FROM tenant t LIMIT 1) AS segmento,
        (SELECT count(*)::int FROM categoria WHERE ativo) AS categorias,
        (SELECT count(*)::int FROM conta_contabil WHERE ativo) AS contas
    `)
    return linha
  })
}
