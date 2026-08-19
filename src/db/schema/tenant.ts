import { pgTable, uuid, varchar, timestamp, boolean, numeric } from 'drizzle-orm/pg-core'

/**
 * Tenant = uma assinatura do SaaS.
 * Toda tabela de negocio carrega tenant_id e e protegida por Row Level Security.
 * O tenant NUNCA vem do frontend - e derivado do JWT no servidor.
 */
export const tenant = pgTable('tenant', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 120 }).notNull(),
  /** padaria | hortifruti | mercearia | adega | outro - dirige o template de onboarding */
  segmento: varchar('segmento', { length: 30 }).notNull().default('outro'),
  ativo: boolean('ativo').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/**
 * Empresa = o CNPJ que opera dentro do tenant.
 * Decisao registrada em docs/adr/0004: sem filial no modelo inicial.
 */
export const empresa = pgTable('empresa', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenant.id, { onDelete: 'restrict' }),
  razaoSocial: varchar('razao_social', { length: 160 }).notNull(),
  nomeFantasia: varchar('nome_fantasia', { length: 160 }),
  cnpj: varchar('cnpj', { length: 14 }),
  inscricaoEstadual: varchar('inscricao_estadual', { length: 20 }),
  uf: varchar('uf', { length: 2 }),
  /** Aliquota efetiva do Simples Nacional, usada como deducao no DRE */
  aliquotaSimples: numeric('aliquota_simples', { precision: 5, scale: 2 }).notNull().default('0'),
  ativo: boolean('ativo').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
