-- =============================================================================
-- 0006 - Auditoria automatica por trigger
-- =============================================================================
-- ARMADILHA DE SEGURANCA: a auditoria NAO pode depender de alguem lembrar de
-- chamar um helper. Um helper esquecido nao audita e nao reclama - o mesmo
-- silencio que o RLS produz quando o contexto de tenant e esquecido.
--
-- O trigger registra o antes e o depois de toda alteracao nas tabelas
-- auditadas, capturando o autor de current_setting('app.usuario_id'), que a
-- aplicacao define junto com o tenant em comTenant().
--
-- Ao adicionar uma tabela de negocio nova, ligue o trigger nela. A lista de
-- tabelas auditadas e conferida por teste de integracao.
-- =============================================================================

CREATE OR REPLACE FUNCTION app_usuario_id() RETURNS uuid
LANGUAGE sql STABLE AS 'SELECT NULLIF(current_setting(''app.usuario_id'', true), '''')::uuid';

CREATE OR REPLACE FUNCTION fn_auditar() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $auditar$
DECLARE
  v_tenant    uuid;
  v_acao      varchar(20);
  v_anteriores jsonb;
  v_novos      jsonb;
  v_id         text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_acao := 'CRIACAO';
    v_novos := to_jsonb(NEW);
    v_tenant := NEW.tenant_id;
    v_id := NEW.id::text;
  ELSIF TG_OP = 'UPDATE' THEN
    v_acao := 'ALTERACAO';
    v_anteriores := to_jsonb(OLD);
    v_novos := to_jsonb(NEW);
    v_tenant := NEW.tenant_id;
    v_id := NEW.id::text;

    -- Registrar apenas o que mudou de fato: um UPDATE que nao altera nada
    -- polui a trilha e esconde a alteracao real no meio do ruido.
    SELECT jsonb_object_agg(chave, valor) INTO v_novos
    FROM jsonb_each(to_jsonb(NEW)) AS n(chave, valor)
    WHERE to_jsonb(OLD) -> chave IS DISTINCT FROM valor;

    IF v_novos IS NULL THEN
      RETURN NEW;
    END IF;

    SELECT jsonb_object_agg(chave, to_jsonb(OLD) -> chave) INTO v_anteriores
    FROM jsonb_each(v_novos) AS n(chave, valor);
  ELSE
    v_acao := 'EXCLUSAO';
    v_anteriores := to_jsonb(OLD);
    v_tenant := OLD.tenant_id;
    v_id := OLD.id::text;
  END IF;

  -- Nunca guardar hash de senha nem segredo de MFA na trilha.
  v_anteriores := v_anteriores - 'senha_hash' - 'mfa_secret';
  v_novos := v_novos - 'senha_hash' - 'mfa_secret';

  INSERT INTO auditoria (tenant_id, usuario_id, entidade, entidade_id, acao,
                         dados_anteriores, dados_novos)
  VALUES (v_tenant, app_usuario_id(), TG_TABLE_NAME, v_id, v_acao,
          v_anteriores, v_novos);

  RETURN COALESCE(NEW, OLD);
END;
$auditar$;

REVOKE ALL ON FUNCTION fn_auditar() FROM PUBLIC;

CREATE TRIGGER auditar_empresa
  AFTER INSERT OR UPDATE OR DELETE ON empresa
  FOR EACH ROW EXECUTE FUNCTION fn_auditar();

CREATE TRIGGER auditar_categoria
  AFTER INSERT OR UPDATE OR DELETE ON categoria
  FOR EACH ROW EXECUTE FUNCTION fn_auditar();

CREATE TRIGGER auditar_conta_contabil
  AFTER INSERT OR UPDATE OR DELETE ON conta_contabil
  FOR EACH ROW EXECUTE FUNCTION fn_auditar();

CREATE TRIGGER auditar_usuario_criacao_exclusao
  AFTER INSERT OR DELETE ON usuario
  FOR EACH ROW EXECUTE FUNCTION fn_auditar();

-- O ultimo login e escrito a cada entrada e nao e alteracao de negocio.
-- Auditar isso encheria a trilha e enterraria o que importa, entao a
-- condicao mora na clausula WHEN do proprio trigger.
CREATE TRIGGER auditar_usuario_alteracao
  AFTER UPDATE ON usuario
  FOR EACH ROW
  WHEN (
    to_jsonb(NEW) - 'ultimo_login_em' - 'updated_at'
    IS DISTINCT FROM
    to_jsonb(OLD) - 'ultimo_login_em' - 'updated_at'
  )
  EXECUTE FUNCTION fn_auditar();
