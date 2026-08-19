import { pgTable, uuid, varchar, timestamp, boolean, primaryKey, index } from 'drizzle-orm/pg-core'
import { tenant } from './tenant'

/** Usuario do sistema. Sempre pertence a exatamente um tenant. */
export const usuario = pgTable('usuario', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenant.id, { onDelete: 'restrict' }),
  nome: varchar('nome', { length: 120 }).notNull(),
  email: varchar('email', { length: 160 }).notNull(),
  senhaHash: varchar('senha_hash', { length: 255 }).notNull(),
  /** TOTP opcional - decisao registrada em docs/adr/0006 */
  mfaSecret: varchar('mfa_secret', { length: 64 }),
  mfaAtivo: boolean('mfa_ativo').notNull().default(false),
  ativo: boolean('ativo').notNull().default(true),
  ultimoLoginEm: timestamp('ultimo_login_em', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  // E-mail e unico por tenant, nao globalmente: duas empresas podem ter o mesmo dono.
  index('usuario_tenant_email_uq').on(t.tenantId, t.email),
])

/**
 * Permissao granular no formato DOMINIO_ACAO (VENDA_CANCELAR, FINANCEIRO_BAIXAR).
 * Catalogo global do produto - nao pertence a tenant.
 */
export const permissao = pgTable('permissao', {
  codigo: varchar('codigo', { length: 60 }).primaryKey(),
  dominio: varchar('dominio', { length: 30 }).notNull(),
  descricao: varchar('descricao', { length: 200 }).notNull(),
})

/** Papel = conjunto de permissoes. Papeis do sistema tem tenant_id nulo. */
export const papel = pgTable('papel', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenant.id, { onDelete: 'cascade' }),
  codigo: varchar('codigo', { length: 40 }).notNull(),
  nome: varchar('nome', { length: 80 }).notNull(),
  doSistema: boolean('do_sistema').notNull().default(false),
})

export const papelPermissao = pgTable('papel_permissao', {
  papelId: uuid('papel_id').notNull().references(() => papel.id, { onDelete: 'cascade' }),
  permissaoCodigo: varchar('permissao_codigo', { length: 60 }).notNull().references(() => permissao.codigo, { onDelete: 'cascade' }),
}, (t) => [primaryKey({ columns: [t.papelId, t.permissaoCodigo] })])

export const usuarioPapel = pgTable('usuario_papel', {
  usuarioId: uuid('usuario_id').notNull().references(() => usuario.id, { onDelete: 'cascade' }),
  papelId: uuid('papel_id').notNull().references(() => papel.id, { onDelete: 'cascade' }),
}, (t) => [primaryKey({ columns: [t.usuarioId, t.papelId] })])
