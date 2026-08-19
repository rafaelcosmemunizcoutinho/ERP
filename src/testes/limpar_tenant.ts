import { sql } from 'drizzle-orm'
import { comTenant } from '@/db/client'

// Ordem importa: as FKs de empresa e usuario sao ON DELETE RESTRICT de
// proposito, e conta_contabil aponta para si mesma. Filho sai antes do pai,
// folha antes da raiz. Sob RLS, DELETE sem contexto e um no-op silencioso -
// por isso tudo roda dentro de comTenant.
async function limparTenant (tenantId: string): Promise<void> {
  await comTenant(tenantId, async (tx) => {
    await tx.execute(sql`DELETE FROM produto_codigo_barras`)
    await tx.execute(sql`DELETE FROM produto`)
    await tx.execute(sql`DELETE FROM parceiro`)
    await tx.execute(sql`DELETE FROM usuario_papel WHERE usuario_id IN (SELECT id FROM usuario)`)
    await tx.execute(sql`DELETE FROM auditoria`)
    await tx.execute(sql`DELETE FROM categoria`)
    await tx.execute(sql`DELETE FROM conta_contabil WHERE pai_id IS NOT NULL`)
    await tx.execute(sql`DELETE FROM conta_contabil`)
    await tx.execute(sql`DELETE FROM usuario`)
    await tx.execute(sql`DELETE FROM empresa`)
    await tx.execute(sql`DELETE FROM tenant WHERE id = ${tenantId}::uuid`)
  })
}

export async function limparTenants (tenantIds: string[]): Promise<void> {
  for (const tenantId of tenantIds) await limparTenant(tenantId)
}
