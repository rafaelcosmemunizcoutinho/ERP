-- =============================================================================
-- 0001 - Fundacao: tenant, empresa, usuario, permissoes, auditoria
-- =============================================================================

CREATE TABLE tenant (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        varchar(120) NOT NULL,
  segmento    varchar(30)  NOT NULL DEFAULT 'outro',
  ativo       boolean      NOT NULL DEFAULT true,
  created_at  timestamptz  NOT NULL DEFAULT now(),
  updated_at  timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT tenant_segmento_ck
    CHECK (segmento IN ('padaria','hortifruti','mercearia','adega','outro'))
);

CREATE TABLE empresa (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES tenant(id) ON DELETE RESTRICT,
  razao_social       varchar(160) NOT NULL,
  nome_fantasia      varchar(160),
  cnpj               varchar(14),
  inscricao_estadual varchar(20),
  uf                 varchar(2),
  aliquota_simples   numeric(5,2) NOT NULL DEFAULT 0,
  ativo              boolean      NOT NULL DEFAULT true,
  created_at         timestamptz  NOT NULL DEFAULT now(),
  updated_at         timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX empresa_tenant_idx ON empresa (tenant_id);
CREATE UNIQUE INDEX empresa_cnpj_uq ON empresa (cnpj) WHERE cnpj IS NOT NULL;

CREATE TABLE usuario (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenant(id) ON DELETE RESTRICT,
  nome            varchar(120) NOT NULL,
  email           varchar(160) NOT NULL,
  senha_hash      varchar(255) NOT NULL,
  mfa_secret      varchar(64),
  mfa_ativo       boolean      NOT NULL DEFAULT false,
  ativo           boolean      NOT NULL DEFAULT true,
  ultimo_login_em timestamptz,
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now()
);
-- E-mail unico POR TENANT: a mesma pessoa pode ser dona de duas empresas.
CREATE UNIQUE INDEX usuario_tenant_email_uq ON usuario (tenant_id, lower(email));

-- Catalogo global de permissoes (DOMINIO_ACAO). Nao pertence a tenant.
CREATE TABLE permissao (
  codigo    varchar(60) PRIMARY KEY,
  dominio   varchar(30)  NOT NULL,
  descricao varchar(200) NOT NULL
);

CREATE TABLE papel (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid REFERENCES tenant(id) ON DELETE CASCADE,
  codigo     varchar(40) NOT NULL,
  nome       varchar(80) NOT NULL,
  do_sistema boolean NOT NULL DEFAULT false
);
-- Papeis do sistema (tenant_id nulo) sao unicos pelo codigo;
-- papeis proprios do tenant sao unicos dentro dele.
CREATE UNIQUE INDEX papel_sistema_codigo_uq ON papel (codigo) WHERE tenant_id IS NULL;
CREATE UNIQUE INDEX papel_tenant_codigo_uq  ON papel (tenant_id, codigo) WHERE tenant_id IS NOT NULL;

CREATE TABLE papel_permissao (
  papel_id         uuid        NOT NULL REFERENCES papel(id) ON DELETE CASCADE,
  permissao_codigo varchar(60) NOT NULL REFERENCES permissao(codigo) ON DELETE CASCADE,
  PRIMARY KEY (papel_id, permissao_codigo)
);

CREATE TABLE usuario_papel (
  usuario_id uuid NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  papel_id   uuid NOT NULL REFERENCES papel(id)   ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, papel_id)
);

CREATE TABLE auditoria (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  usuario_id       uuid,
  entidade         varchar(60) NOT NULL,
  entidade_id      varchar(64) NOT NULL,
  acao             varchar(20) NOT NULL,
  dados_anteriores jsonb,
  dados_novos      jsonb,
  ip               varchar(45),
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT auditoria_acao_ck
    CHECK (acao IN ('CRIACAO','ALTERACAO','EXCLUSAO','LOGIN','LIBERACAO'))
);
CREATE INDEX auditoria_tenant_entidade_idx ON auditoria (tenant_id, entidade, entidade_id);
CREATE INDEX auditoria_tenant_data_idx     ON auditoria (tenant_id, created_at DESC);
