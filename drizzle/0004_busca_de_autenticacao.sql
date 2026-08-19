-- =============================================================================
-- 0004 - Busca de autenticacao
-- =============================================================================
-- ARMADILHA DE SEGURANCA: esta e a UNICA funcao do sistema que atravessa o RLS.
--
-- O login e um ovo-e-galinha: para achar o usuario e preciso o tenant_id, que
-- so se descobre achando o usuario. SECURITY DEFINER resolve, mas o escopo
-- precisa ser minimo, senao vira porta de saida para qualquer dado.
--
-- Por isso ela:
--   - recebe SOMENTE o e-mail, nunca um filtro livre;
--   - devolve SOMENTE os campos que autenticam (nada de telefone, endereco,
--     nem qualquer dado de negocio);
--   - ignora usuario inativo;
--   - tem search_path fixo, para nao ser sequestrada por um schema plantado.
--
-- Depois que a senha e conferida, TODA consulta seguinte volta a passar por
-- comTenant(). Ampliar o retorno desta funcao e ampliar a superficie de ataque.
-- =============================================================================

CREATE OR REPLACE FUNCTION auth_buscar_por_email(p_email text)
RETURNS TABLE (
  id         uuid,
  tenant_id  uuid,
  nome       varchar,
  email      varchar,
  senha_hash varchar,
  mfa_ativo  boolean,
  mfa_secret varchar,
  empresa    varchar
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $funcao$
  SELECT u.id, u.tenant_id, u.nome, u.email, u.senha_hash,
         u.mfa_ativo, u.mfa_secret,
         coalesce(e.nome_fantasia, e.razao_social, t.nome)
  FROM usuario u
  JOIN tenant t ON t.id = u.tenant_id
  LEFT JOIN empresa e ON e.tenant_id = u.tenant_id AND e.ativo
  WHERE lower(u.email) = lower(p_email)
    AND u.ativo
    AND t.ativo
$funcao$;

REVOKE ALL ON FUNCTION auth_buscar_por_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION auth_buscar_por_email(text) TO erp_app;

-- Permissoes efetivas do usuario, ja dentro do contexto do tenant.
CREATE OR REPLACE FUNCTION auth_permissoes(p_usuario uuid)
RETURNS TABLE (codigo varchar)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $funcao$
  SELECT DISTINCT pp.permissao_codigo
  FROM usuario_papel up
  JOIN papel_permissao pp ON pp.papel_id = up.papel_id
  WHERE up.usuario_id = p_usuario
$funcao$;

REVOKE ALL ON FUNCTION auth_permissoes(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION auth_permissoes(uuid) TO erp_app;
