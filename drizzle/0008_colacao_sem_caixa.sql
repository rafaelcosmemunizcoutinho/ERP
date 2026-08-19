-- =============================================================================
-- 0008 - Colacao insensivel a caixa para nomes e codigos
-- =============================================================================
-- ARMADILHA: o banco nasce com --locale=C, escolhido para relatorio e ordenacao
-- ficarem iguais em qualquer maquina. O efeito colateral e que lower() so dobra
-- caixa em ASCII:
--
--     lower('PÃES') = 'pÃes'    -- o Ã sobrevive
--
-- Num sistema em portugues isso deixa "PÃES" e "pães" conviverem como
-- registros distintos, e o indice unico que deveria impedir duplicata nao
-- impede nada. Tres indices dependiam disso.
--
-- A colacao ICU 'und-u-ks-level2' compara ignorando caixa e respeitando
-- acento - "Pães" colide com "pães", mas nao com "Paes", que e outra palavra.
-- =============================================================================

DROP COLLATION IF EXISTS teste_ci;

CREATE COLLATION sem_caixa (
  provider = icu,
  locale = 'und-u-ks-level2',
  deterministic = false
);

DROP INDEX categoria_tenant_nome_uq;
CREATE UNIQUE INDEX categoria_tenant_nome_uq
  ON categoria (tenant_id, nome COLLATE sem_caixa);

DROP INDEX produto_tenant_codigo_uq;
CREATE UNIQUE INDEX produto_tenant_codigo_uq
  ON produto (tenant_id, codigo COLLATE sem_caixa);

DROP INDEX usuario_tenant_email_uq;
CREATE UNIQUE INDEX usuario_tenant_email_uq
  ON usuario (tenant_id, email COLLATE sem_caixa);

-- A busca de login precisa comparar do mesmo jeito que o indice, senao ela
-- nao usa o indice e volta a divergir do que a unicidade garante.
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
  WHERE u.email COLLATE sem_caixa = p_email
    AND u.ativo
    AND t.ativo
$funcao$;
