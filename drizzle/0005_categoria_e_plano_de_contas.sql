-- =============================================================================
-- 0005 - Categoria e plano de contas
-- =============================================================================
-- Semeadas pelo template de segmento no onboarding, e editaveis depois.
-- A faixa de alerta de vencimento vive na CATEGORIA, nao numa configuracao
-- global: pao vence em 1 dia, verdura em 3, industrializado em meses.
-- =============================================================================

CREATE TABLE categoria (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  nome                varchar(80) NOT NULL,
  perecivel           boolean NOT NULL DEFAULT false,
  dias_alerta_critico integer,
  dias_alerta_atencao integer,
  ordem               integer NOT NULL DEFAULT 0,
  ativo               boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categoria_faixas_ck CHECK (
    (dias_alerta_critico IS NULL AND dias_alerta_atencao IS NULL)
    OR (dias_alerta_critico > 0 AND dias_alerta_atencao > dias_alerta_critico)
  ),
  CONSTRAINT categoria_perecivel_tem_faixa_ck CHECK (
    NOT perecivel OR dias_alerta_critico IS NOT NULL
  )
);
CREATE UNIQUE INDEX categoria_tenant_nome_uq ON categoria (tenant_id, lower(nome));

CREATE TABLE conta_contabil (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  pai_id     uuid REFERENCES conta_contabil(id) ON DELETE RESTRICT,
  codigo     varchar(20) NOT NULL,
  nome       varchar(120) NOT NULL,
  natureza   varchar(10) NOT NULL,
  grupo_dre  varchar(30) NOT NULL,
  lancavel   boolean NOT NULL DEFAULT true,
  ativo      boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT conta_natureza_ck CHECK (natureza IN ('receita', 'despesa')),
  CONSTRAINT conta_grupo_dre_ck CHECK (grupo_dre IN (
    'receita_bruta', 'deducoes', 'cmv', 'despesa_operacional',
    'despesa_pessoal', 'despesa_administrativa', 'despesa_financeira',
    'outras_receitas', 'perdas'
  ))
);
CREATE UNIQUE INDEX conta_tenant_codigo_uq ON conta_contabil (tenant_id, codigo);
CREATE INDEX conta_tenant_pai_idx ON conta_contabil (tenant_id, pai_id);

ALTER TABLE categoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE categoria FORCE  ROW LEVEL SECURITY;
CREATE POLICY categoria_isolamento ON categoria
  USING (tenant_id = app_tenant_id())
  WITH CHECK (tenant_id = app_tenant_id());

ALTER TABLE conta_contabil ENABLE ROW LEVEL SECURITY;
ALTER TABLE conta_contabil FORCE  ROW LEVEL SECURITY;
CREATE POLICY conta_contabil_isolamento ON conta_contabil
  USING (tenant_id = app_tenant_id())
  WITH CHECK (tenant_id = app_tenant_id());

GRANT SELECT, INSERT, UPDATE, DELETE ON categoria, conta_contabil TO erp_app;
