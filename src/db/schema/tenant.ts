import { pgTable, uuid, varchar, timestamp, boolean, numeric } from 'drizzle-orm/pg-core'

export const tenant = pgTable('tenant', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 120 }).notNull(),
  segmento: varchar('segmento', { length: 30 }).notNull().default('outro'),
  ativo: boolean('ativo').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const empresa = pgTable('empresa', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenant.id, { onDelete: 'restrict' }),
  razaoSocial: varchar('razao_social', { length: 160 }).notNull(),
  nomeFantasia: varchar('nome_fantasia', { length: 160 }),
  cnpj: varchar('cnpj', { length: 14 }),
  inscricaoEstadual: varchar('inscricao_estadual', { length: 20 }),
  uf: varchar('uf', { length: 2 }),
  aliquotaSimples: numeric('aliquota_simples', { precision: 5, scale: 2 }).notNull().default('0'),
  ativo: boolean('ativo').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
