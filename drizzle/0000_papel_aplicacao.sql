-- =============================================================================
-- 0000 - Papel de aplicacao
-- =============================================================================
-- O RLS do PostgreSQL NAO se aplica a superusuarios. O usuario dono do banco
-- (POSTGRES_USER) e superusuario e roda as migrations; a aplicacao precisa
-- conectar com um papel SEM privilegio de bypass, senao o isolamento entre
-- tenants existe no papel mas nao na pratica.
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'erp_app') THEN
    CREATE ROLE erp_app LOGIN PASSWORD 'erp_app' NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO erp_app;

-- Tudo que for criado daqui em diante ja nasce acessivel ao papel da aplicacao.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO erp_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO erp_app;
