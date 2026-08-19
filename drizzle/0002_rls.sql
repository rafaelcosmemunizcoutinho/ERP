-- =============================================================================
-- 0002 - Row Level Security (isolamento entre tenants)
-- =============================================================================
-- Segunda camada de defesa: mesmo que uma consulta da aplicacao esqueca o
-- filtro de tenant, o banco nao devolve a linha.
--
-- A aplicacao define o tenant da transacao com:
--     SET LOCAL app.tenant_id = '<uuid>';
--
-- FORCE ROW LEVEL SECURITY faz a politica valer inclusive para o dono da
-- tabela. O papel erp_app foi criado com NOBYPASSRLS na migration 0000.
-- =============================================================================

CREATE OR REPLACE FUNCTION app_tenant_id() RETURNS uuid
LANGUAGE sql STABLE AS 'SELECT NULLIF(current_setting(''app.tenant_id'', true), '''')::uuid';

-- tenant: o proprio registro so e visivel para si mesmo
ALTER TABLE tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant FORCE  ROW LEVEL SECURITY;
CREATE POLICY tenant_isolamento ON tenant
  USING (id = app_tenant_id())
  WITH CHECK (id = app_tenant_id());

-- Tabelas com tenant_id direto
ALTER TABLE empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresa FORCE  ROW LEVEL SECURITY;
CREATE POLICY empresa_isolamento ON empresa
  USING (tenant_id = app_tenant_id())
  WITH CHECK (tenant_id = app_tenant_id());

ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario FORCE  ROW LEVEL SECURITY;
CREATE POLICY usuario_isolamento ON usuario
  USING (tenant_id = app_tenant_id())
  WITH CHECK (tenant_id = app_tenant_id());

ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria FORCE  ROW LEVEL SECURITY;
CREATE POLICY auditoria_isolamento ON auditoria
  USING (tenant_id = app_tenant_id())
  WITH CHECK (tenant_id = app_tenant_id());

-- papel: papeis do sistema (tenant_id IS NULL) sao visiveis a todos os tenants,
-- mas so podem ser criados/alterados por migration - nunca pela aplicacao.
ALTER TABLE papel ENABLE ROW LEVEL SECURITY;
ALTER TABLE papel FORCE  ROW LEVEL SECURITY;
CREATE POLICY papel_leitura ON papel FOR SELECT
  USING (tenant_id IS NULL OR tenant_id = app_tenant_id());
CREATE POLICY papel_escrita ON papel FOR ALL
  USING (tenant_id = app_tenant_id())
  WITH CHECK (tenant_id = app_tenant_id());

-- Tabelas de ligacao: o isolamento vem da entidade dona.
ALTER TABLE papel_permissao ENABLE ROW LEVEL SECURITY;
ALTER TABLE papel_permissao FORCE  ROW LEVEL SECURITY;
CREATE POLICY papel_permissao_isolamento ON papel_permissao
  USING (EXISTS (SELECT 1 FROM papel p WHERE p.id = papel_id
                 AND (p.tenant_id IS NULL OR p.tenant_id = app_tenant_id())));

ALTER TABLE usuario_papel ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_papel FORCE  ROW LEVEL SECURITY;
CREATE POLICY usuario_papel_isolamento ON usuario_papel
  USING (EXISTS (SELECT 1 FROM usuario u WHERE u.id = usuario_id
                 AND u.tenant_id = app_tenant_id()))
  WITH CHECK (EXISTS (SELECT 1 FROM usuario u WHERE u.id = usuario_id
                 AND u.tenant_id = app_tenant_id()));

-- Catalogo global de permissoes: leitura livre, escrita apenas por migration.
-- Sem RLS de proposito - nao contem dado de tenant.
GRANT SELECT ON permissao TO erp_app;

-- Garante o acesso do papel da aplicacao as tabelas ja criadas.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO erp_app;
