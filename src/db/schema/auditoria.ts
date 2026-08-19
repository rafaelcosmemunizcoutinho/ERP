import { pgTable, uuid, varchar, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { tenant } from './tenant'

export const auditoria = pgTable('auditoria', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenant.id, { onDelete: 'cascade' }),
  usuarioId: uuid('usuario_id'),
  entidade: varchar('entidade', { length: 60 }).notNull(),
  entidadeId: varchar('entidade_id', { length: 64 }).notNull(),
  acao: varchar('acao', { length: 20 }).notNull(),
  dadosAnteriores: jsonb('dados_anteriores'),
  dadosNovos: jsonb('dados_novos'),
  ip: varchar('ip', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (t) => [
  index('auditoria_tenant_entidade_idx').on(t.tenantId, t.entidade, t.entidadeId),
  index('auditoria_tenant_data_idx').on(t.tenantId, t.createdAt)
])
