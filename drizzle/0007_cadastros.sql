-- =============================================================================
-- 0007 - Cadastros: parceiro, produto e codigo de barras
-- =============================================================================

-- Como a balanca do setor monta a etiqueta pesavel. Varia por loja e por
-- fabricante, entao e configuracao da empresa, nao constante do sistema.
ALTER TABLE empresa
  ADD COLUMN etiqueta_balanca_prefixo varchar(1) NOT NULL DEFAULT '2',
  ADD COLUMN etiqueta_balanca_conteudo varchar(6) NOT NULL DEFAULT 'peso',
  ADD CONSTRAINT empresa_etiqueta_conteudo_ck
    CHECK (etiqueta_balanca_conteudo IN ('peso', 'valor'));

-- =============================================================================
-- Parceiro: cliente e/ou fornecedor na MESMA tabela.
-- Quem compra e vende para voce e uma pessoa so; duplicar o cadastro faz o
-- limite de credito e o historico se separarem sem ninguem perceber.
-- =============================================================================
CREATE TABLE parceiro (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  tipo               varchar(2)   NOT NULL,
  nome               varchar(160) NOT NULL,
  apelido            varchar(120),
  documento          varchar(14),
  inscricao_estadual varchar(20),
  email              varchar(160),
  telefone           varchar(20),
  cep                varchar(8),
  logradouro         varchar(160),
  numero             varchar(20),
  complemento        varchar(80),
  bairro             varchar(80),
  municipio          varchar(80),
  uf                 varchar(2),
  eh_cliente         boolean NOT NULL DEFAULT true,
  eh_fornecedor      boolean NOT NULL DEFAULT false,
  limite_credito     numeric(12,2) NOT NULL DEFAULT 0,
  observacoes        text,
  ativo              boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT parceiro_tipo_ck CHECK (tipo IN ('PF', 'PJ')),
  CONSTRAINT parceiro_documento_tamanho_ck CHECK (
    documento IS NULL
    OR (tipo = 'PF' AND length(documento) = 11)
    OR (tipo = 'PJ' AND length(documento) = 14)
  ),
  CONSTRAINT parceiro_papel_ck CHECK (eh_cliente OR eh_fornecedor),
  CONSTRAINT parceiro_limite_ck CHECK (limite_credito >= 0)
);
CREATE UNIQUE INDEX parceiro_tenant_documento_uq
  ON parceiro (tenant_id, documento) WHERE documento IS NOT NULL;
CREATE INDEX parceiro_tenant_nome_idx ON parceiro (tenant_id, lower(nome));
CREATE INDEX parceiro_tenant_cliente_idx ON parceiro (tenant_id) WHERE eh_cliente AND ativo;
CREATE INDEX parceiro_tenant_fornecedor_idx ON parceiro (tenant_id) WHERE eh_fornecedor AND ativo;

-- =============================================================================
-- Produto
-- =============================================================================
CREATE TABLE produto (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  categoria_id       uuid NOT NULL REFERENCES categoria(id) ON DELETE RESTRICT,
  codigo             varchar(20)  NOT NULL,
  nome               varchar(160) NOT NULL,
  marca              varchar(80),
  tipo               varchar(10)  NOT NULL DEFAULT 'unitario',
  -- Estoque SEMPRE na menor unidade: UN para unitario, KG para pesavel.
  unidade_estoque    varchar(6)   NOT NULL DEFAULT 'UN',
  -- Unidade em que se COMPRA (FD, CX). fator = quantas unidades_estoque cabem.
  unidade_compra     varchar(6),
  fator_conversao    numeric(12,4),
  preco_venda        numeric(12,2) NOT NULL DEFAULT 0,
  custo_medio        numeric(12,4) NOT NULL DEFAULT 0,
  estoque_minimo     numeric(12,3) NOT NULL DEFAULT 0,
  -- Preparado para fiscal (ADR-0003), sem emissao.
  ncm                varchar(8),
  cest               varchar(7),
  cfop_padrao        varchar(4),
  cst_padrao         varchar(3),
  unidade_tributavel varchar(6),
  ativo              boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT produto_tipo_ck CHECK (tipo IN ('unitario', 'pesavel')),
  CONSTRAINT produto_unidade_pesavel_ck CHECK (
    (tipo = 'pesavel' AND unidade_estoque = 'KG') OR tipo = 'unitario'
  ),
  -- Unidade de compra so faz sentido com fator, e vice-versa.
  CONSTRAINT produto_conversao_ck CHECK (
    (unidade_compra IS NULL AND fator_conversao IS NULL)
    OR (unidade_compra IS NOT NULL AND fator_conversao > 0)
  ),
  CONSTRAINT produto_preco_ck CHECK (preco_venda >= 0 AND custo_medio >= 0),
  CONSTRAINT produto_estoque_minimo_ck CHECK (estoque_minimo >= 0)
);
CREATE UNIQUE INDEX produto_tenant_codigo_uq ON produto (tenant_id, upper(codigo));
CREATE INDEX produto_tenant_nome_idx ON produto (tenant_id, lower(nome));
CREATE INDEX produto_tenant_categoria_idx ON produto (tenant_id, categoria_id);

-- =============================================================================
-- Codigo de barras: um produto pode ter varios.
-- O EAN da unidade e o EAN do fardo apontam para o MESMO produto, com
-- quantidades diferentes - bipar o fardo lanca 12 unidades, nao 1.
-- =============================================================================
CREATE TABLE produto_codigo_barras (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  produto_id uuid NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
  codigo     varchar(14) NOT NULL,
  quantidade numeric(12,4) NOT NULL DEFAULT 1,
  principal  boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT codigo_barras_quantidade_ck CHECK (quantidade > 0)
);
CREATE UNIQUE INDEX codigo_barras_tenant_codigo_uq ON produto_codigo_barras (tenant_id, codigo);
CREATE INDEX codigo_barras_produto_idx ON produto_codigo_barras (produto_id);
-- Um unico codigo principal por produto.
CREATE UNIQUE INDEX codigo_barras_principal_uq
  ON produto_codigo_barras (produto_id) WHERE principal;

-- =============================================================================
-- RLS
-- =============================================================================
ALTER TABLE parceiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE parceiro FORCE  ROW LEVEL SECURITY;
CREATE POLICY parceiro_isolamento ON parceiro
  USING (tenant_id = app_tenant_id()) WITH CHECK (tenant_id = app_tenant_id());

ALTER TABLE produto ENABLE ROW LEVEL SECURITY;
ALTER TABLE produto FORCE  ROW LEVEL SECURITY;
CREATE POLICY produto_isolamento ON produto
  USING (tenant_id = app_tenant_id()) WITH CHECK (tenant_id = app_tenant_id());

ALTER TABLE produto_codigo_barras ENABLE ROW LEVEL SECURITY;
ALTER TABLE produto_codigo_barras FORCE  ROW LEVEL SECURITY;
CREATE POLICY codigo_barras_isolamento ON produto_codigo_barras
  USING (tenant_id = app_tenant_id()) WITH CHECK (tenant_id = app_tenant_id());

GRANT SELECT, INSERT, UPDATE, DELETE
  ON parceiro, produto, produto_codigo_barras TO erp_app;

-- Tabela de negocio nova liga o trigger de auditoria (invariante 3).
CREATE TRIGGER auditar_parceiro
  AFTER INSERT OR UPDATE OR DELETE ON parceiro
  FOR EACH ROW EXECUTE FUNCTION fn_auditar();

CREATE TRIGGER auditar_produto
  AFTER INSERT OR UPDATE OR DELETE ON produto
  FOR EACH ROW EXECUTE FUNCTION fn_auditar();

CREATE TRIGGER auditar_produto_codigo_barras
  AFTER INSERT OR UPDATE OR DELETE ON produto_codigo_barras
  FOR EACH ROW EXECUTE FUNCTION fn_auditar();
