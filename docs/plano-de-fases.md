# Plano de fases

Entrega incremental, com revisão sua ao fim de cada fase antes de começar a seguinte.

**Definição de pronto** (vale para todas as fases): regras críticas cobertas por teste unitário · teste de integração com PostgreSQL real, incluindo isolamento entre tenants · fluxo principal coberto por E2E · lint, tipos e testes passando no CI · migrations versionadas · documentação atualizada.

---

## Fase 1 — Fundação ✅ *concluída*

Base multi-tenant sobre a qual todo o resto se apoia.

- [x] Ambiente 100% em containers (`docker compose up`)
- [x] PostgreSQL 17 + runner de migrations em SQL versionado
- [x] `tenant`, `empresa`, `usuario`, `papel`, `permissao`, `auditoria`
- [x] Row Level Security com papel de aplicação `NOBYPASSRLS`
- [x] Catálogo de 28 permissões granulares e 5 papéis do sistema
- [x] Healthcheck e página de status do ambiente
- [x] Design system: tokens verificados em contraste, Atomic Design, Storybook
- [x] Login com sessão JWT carregando `tenant_id`, senha Argon2, MFA TOTP opcional
- [x] Onboarding self-service com templates por segmento
- [x] Guarda de página por permissão
- [x] Registro de auditoria na criação da empresa
- [x] Auditoria automática por trigger no PostgreSQL (antes/depois, sem depender de ninguém lembrar)
- [x] PWA instalável e alternador de tema com script anti-flash

**Entregável:** uma empresa se cadastra, escolhe o segmento, recebe o plano de contas e as categorias do template, e faz login com controle de permissão e auditoria funcionando.

---

## Fase 2 — Cadastros

- Parceiro unificado PF/PJ (cliente e/ou fornecedor) com endereço, contatos e limite de crédito
- Categorias e departamentos, com faixas de validade por categoria
- Unidades de medida e fatores de conversão (fardo/caixa ↔ unidade)
- Produto: código interno, EAN/GTIN, pesável ou unitário, preço, estoque mínimo, campos fiscais preparados (NCM, CFOP, CST, CEST)
- Leitura de código de barras e de etiqueta EAN-13 pesável
- Importação de cadastros por planilha

**Entregável:** catálogo completo cadastrado e pesquisável por código de barras.

---

## Fase 3 — Estoque

- Lote com data de fabricação e validade; saldo por lote
- Movimentação com FEFO na sugestão de saída
- Fracionamento (caixa → granel) com transferência de custo
- Custo médio ponderado recalculado a cada entrada
- Quarentena automática de lote vencido, com liberação sob permissão
- Perda com motivo categorizado, lançando despesa no plano de contas
- Consulta de saldo, kardex e rastreio por lote

**Entregável:** o estoque reflete a realidade e sabe o que vence quando. É a fase que viabiliza o alerta de vencimento.

---

## Fase 4 — Vendas e caixa

- Sessão de caixa: abertura com fundo de troco, fechamento com contagem por forma de pagamento, apuração de sobra/falta
- Sangria e suprimento
- Venda balcão com leitor de código, produto pesável e venda anônima
- Desconto com alçada por papel
- Pagamento à vista (dinheiro, PIX, cartão) e fiado com verificação de limite de crédito
- Baixa de estoque por FEFO na mesma transação da venda
- Estoque negativo permitido com aviso e pendência de acerto
- Cancelamento com estorno e devolução parcial
- Comprovante imprimível

**Entregável:** a loja consegue operar o dia inteiro pelo sistema.

---

## Fase 5 — Compras e financeiro

- Entrada de compra gerando lote, custo e contas a pagar
- Plano de contas configurável e centro de custo
- Contas a pagar e a receber com parcelas, vencimento e baixa (inclusive parcial)
- Contas recorrentes (aluguel, energia, salário)
- Painel "contas a pagar no dia" e posição de inadimplência
- Alíquota do Simples Nacional por empresa

**Entregável:** o financeiro fecha e o dono sabe o que vence hoje.

---

## Fase 6 — Análise e alertas

- DRE por competência e caixa, montado a partir do plano de contas
- Sazonalidade e ranking de vendas por mês, semana e dia da semana, com comparativo ano-a-ano
- Margem e lucratividade por produto, categoria e cliente
- Curva ABC de produtos e clientes; estoque parado
- Previsão de demanda e sugestão de compra (média móvel + sazonalidade + lead time + estoque de segurança)
- Índice de perda por produto e categoria
- Central de notificações in-app e push PWA
- Exportação Excel/PDF e relatórios agendados

**Entregável:** os quatro pedidos originais atendidos — alerta de vencimento, o que vende mais em cada época, DRE e contas a pagar no dia.

---

## Fase 7 — Produção e operação

- Deploy em PaaS gerenciado com PostgreSQL gerenciado e PITR
- Logs estruturados com correlation ID
- Rotina de backup verificada com restauração testada
- Exportação para o contador
- Documentação de usuário

---

## Depois, se justificar

Nada abaixo entra sem necessidade demonstrada — a arquitetura deixa a porta aberta, e a decisão fica para quando o problema aparecer:

Redis (cache, rate limit, lock) · fila e workers para processamento pesado · emissão de NFC-e via provedor terceiro · importação de XML de compra · filial e múltiplos depósitos · inventário cíclico · conciliação bancária e OFX · billing de assinatura · API pública e webhooks · tela de PDV em modo quiosque · ficha técnica de produção · vasilhame retornável · data warehouse.

Ver [`decisoes.md`](decisoes.md) para o motivo de cada exclusão.
