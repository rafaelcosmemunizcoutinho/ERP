-- =============================================================================
-- 0003 - Catalogo de permissoes e papeis do sistema
-- =============================================================================
-- Permissoes granulares no formato DOMINIO_ACAO, conforme a secao 15 do
-- documento Contexto Tecnico.
-- =============================================================================

INSERT INTO permissao (codigo, dominio, descricao) VALUES
  ('PRODUTO_VISUALIZAR',          'produto',    'Consultar produtos'),
  ('PRODUTO_CRIAR',               'produto',    'Cadastrar produtos'),
  ('PRODUTO_ALTERAR',             'produto',    'Alterar produtos'),
  ('ESTOQUE_VISUALIZAR',          'estoque',    'Consultar saldos e lotes'),
  ('ESTOQUE_MOVIMENTAR',          'estoque',    'Entradas e fracionamento'),
  ('ESTOQUE_PERDA',               'estoque',    'Lancar perda de estoque'),
  ('ESTOQUE_LIBERAR_VENCIDO',     'estoque',    'Liberar lote em quarentena'),
  ('VENDA_VISUALIZAR',            'venda',      'Consultar vendas'),
  ('VENDA_CRIAR',                 'venda',      'Registrar venda'),
  ('VENDA_CANCELAR',              'venda',      'Cancelar venda com estorno'),
  ('VENDA_DEVOLVER',              'venda',      'Registrar devolucao de itens'),
  ('VENDA_DESCONTO_ACIMA_LIMITE', 'venda',      'Conceder desconto acima do limite'),
  ('COMPRA_VISUALIZAR',           'compra',     'Consultar compras'),
  ('COMPRA_CRIAR',                'compra',     'Registrar entrada de compra'),
  ('CAIXA_ABRIR',                 'caixa',      'Abrir sessao de caixa'),
  ('CAIXA_FECHAR',                'caixa',      'Fechar e conferir caixa'),
  ('CAIXA_SANGRIA',               'caixa',      'Sangria e suprimento'),
  ('FINANCEIRO_VISUALIZAR',       'financeiro', 'Consultar titulos'),
  ('FINANCEIRO_LANCAR',           'financeiro', 'Lancar contas a pagar e receber'),
  ('FINANCEIRO_BAIXAR',           'financeiro', 'Dar baixa em titulos'),
  ('RELATORIO_DRE',               'relatorio',  'Visualizar DRE'),
  ('RELATORIO_ANALITICO',         'relatorio',  'Sazonalidade, curva ABC e previsao'),
  ('PARCEIRO_VISUALIZAR',         'parceiro',   'Consultar clientes e fornecedores'),
  ('PARCEIRO_CRIAR',              'parceiro',   'Cadastrar clientes e fornecedores'),
  ('PARCEIRO_CREDITO',            'parceiro',   'Definir limite de credito'),
  ('USUARIO_GERENCIAR',           'usuario',    'Gerenciar usuarios e papeis'),
  ('AUDITORIA_VISUALIZAR',        'auditoria',  'Consultar trilha de auditoria'),
  ('EMPRESA_CONFIGURAR',          'empresa',    'Configurar parametros da empresa');

INSERT INTO papel (codigo, nome, do_sistema) VALUES
  ('DONO',       'Dono',       true),
  ('GERENTE',    'Gerente',    true),
  ('FINANCEIRO', 'Financeiro', true),
  ('VENDEDOR',   'Vendedor',   true),
  ('ESTOQUISTA', 'Estoquista', true);

-- DONO: todas as permissoes.
INSERT INTO papel_permissao (papel_id, permissao_codigo)
SELECT p.id, pe.codigo
FROM papel p CROSS JOIN permissao pe
WHERE p.tenant_id IS NULL AND p.codigo = 'DONO';

-- GERENTE: tudo, menos gestao de usuarios e configuracao da empresa.
INSERT INTO papel_permissao (papel_id, permissao_codigo)
SELECT p.id, pe.codigo
FROM papel p CROSS JOIN permissao pe
WHERE p.tenant_id IS NULL AND p.codigo = 'GERENTE'
  AND pe.codigo NOT IN ('USUARIO_GERENCIAR', 'EMPRESA_CONFIGURAR');

-- FINANCEIRO: financeiro, relatorios, parceiros e fechamento de caixa.
INSERT INTO papel_permissao (papel_id, permissao_codigo)
SELECT p.id, pe.codigo
FROM papel p CROSS JOIN permissao pe
WHERE p.tenant_id IS NULL AND p.codigo = 'FINANCEIRO'
  AND (pe.dominio IN ('financeiro', 'relatorio', 'parceiro')
       OR pe.codigo = 'CAIXA_FECHAR');

-- VENDEDOR: operacao de balcao. Sem cancelar venda e sem ver custo.
INSERT INTO papel_permissao (papel_id, permissao_codigo)
SELECT p.id, pe.codigo
FROM papel p CROSS JOIN permissao pe
WHERE p.tenant_id IS NULL AND p.codigo = 'VENDEDOR'
  AND pe.codigo IN ('PRODUTO_VISUALIZAR', 'ESTOQUE_VISUALIZAR', 'VENDA_VISUALIZAR',
                    'VENDA_CRIAR', 'PARCEIRO_VISUALIZAR', 'PARCEIRO_CRIAR',
                    'CAIXA_ABRIR', 'CAIXA_FECHAR');

-- ESTOQUISTA: produto, estoque e entrada de compra.
INSERT INTO papel_permissao (papel_id, permissao_codigo)
SELECT p.id, pe.codigo
FROM papel p CROSS JOIN permissao pe
WHERE p.tenant_id IS NULL AND p.codigo = 'ESTOQUISTA'
  AND pe.codigo IN ('PRODUTO_VISUALIZAR', 'PRODUTO_CRIAR', 'PRODUTO_ALTERAR',
                    'ESTOQUE_VISUALIZAR', 'ESTOQUE_MOVIMENTAR', 'ESTOQUE_PERDA',
                    'COMPRA_VISUALIZAR', 'COMPRA_CRIAR');
