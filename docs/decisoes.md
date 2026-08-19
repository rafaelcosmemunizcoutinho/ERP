# Decisões de arquitetura e escopo

Registro das decisões fechadas antes do início do desenvolvimento, com a justificativa de cada uma e o que foi deliberadamente deixado de fora.

**Produto:** ERP SaaS multi-tenant para pequenos comércios do varejo alimentar — padaria, hortifrúti, mercearia, adega e afins.

---

## 1. Produto e escopo

| # | Decisão | Justificativa |
|---|---|---|
| 1.1 | ERP **vertical de varejo alimentar**, sobre fundação SaaS genérica | O documento de Contexto Técnico descrevia uma plataforma ERP horizontal (contabilidade, comissões, faturamento, serviços, e-commerce). Plataforma horizontal é projeto de time e de anos; o vertical é entregável e pode virar plataforma depois sem reescrita |
| 1.2 | Bebidas é **um** segmento, não **o** segmento | O produto atende padaria, hortifrúti, mercearia e adega — segmentos com regras diferentes de validade, unidade e produção |
| 1.3 | Porte alvo: até 5.000 SKUs, ~500 vendas/dia, 3-10 usuários por tenant | Calibra índices, paginação e estratégia de relatório. Cabe no OLTP com views materializadas, sem data warehouse |

**Fora de escopo:** contabilidade, comissões, faturamento, serviços, e-commerce, API pública, webhooks, vasilhame/casco retornável, múltiplos depósitos, inventário cíclico, rota/romaneio, ficha técnica de produção.

---

## 2. Multi-tenancy e segurança

| # | Decisão | Justificativa |
|---|---|---|
| 2.1 | **Shared database + shared schema + `tenant_id`** | Estratégia do documento de referência. Simples de operar e permite migrar um tenant grande para banco dedicado no futuro |
| 2.2 | **Row Level Security** como segunda camada | Se uma consulta esquecer o filtro de tenant, o banco não devolve a linha. Defesa em profundidade |
| 2.3 | Aplicação conecta com papel **`erp_app`** (`NOBYPASSRLS`) | RLS **não se aplica a superusuários**. Conectar com o dono do banco tornaria o isolamento decorativo |
| 2.4 | `FORCE ROW LEVEL SECURITY` em todas as tabelas com política | Sem isso, o dono da tabela ignora as próprias políticas |
| 2.5 | Tenant derivado do **JWT no servidor**, nunca do cliente | Evita a classe inteira de falhas em que o cliente escolhe o próprio tenant |
| 2.6 | Contexto via `SET LOCAL` dentro da transação | Não vaza entre requisições que compartilham conexão do pool |
| 2.7 | Hierarquia **Tenant → Empresa**, sem filial | Decisão do produto. ⚠️ **Risco assumido:** introduzir filial depois exige migração de todas as tabelas de movimentação |
| 2.8 | Auth próprio (Auth.js), e-mail + senha com Argon2, **MFA TOTP opcional** | Sem custo por usuário e sem dependência externa. Atende o essencial de OAuth2/OIDC/MFA do documento |
| 2.9 | RBAC granular `DOMINIO_ACAO` + trilha de auditoria com antes/depois | Auditoria é requisito **funcional**, não recurso técnico |

---

## 3. Stack técnica

| # | Decisão | Alternativa descartada | Justificativa |
|---|---|---|---|
| 3.1 | **Next.js 15 + TypeScript** full-stack | Java 21 + Spring Boot + React/Vite (proposta do documento) | Um repositório, velocidade para equipe pequena, forte em dashboards e PWA. Spring seria a escolha certa para a plataforma horizontal, que não é o produto |
| 3.2 | **PostgreSQL 17** | MySQL (legado) | RLS nativo é a base do isolamento multi-tenant |
| 3.3 | **Drizzle ORM** | Prisma | SQL-first e tipado, com controle da conexão exigido pelo RLS. Melhor para DRE e curva ABC |
| 3.4 | **Migrations em SQL versionado** | DSL gerada | Espírito do Flyway citado no documento. Políticas de RLS, índices parciais e views não cabem bem em abstração |
| 3.5 | Infra **mínima**, com interfaces prontas para crescer | Redis + RabbitMQ + K8s + OTel + Terraform desde o início | O próprio documento (§25, §29) alerta contra complexidade prematura enquanto lista stack maximalista. Contradição resolvida a favor do princípio |
| 3.6 | Eventos de domínio **in-process com tabela outbox** | Message broker | Preserva o desacoplamento da §11 sem custo operacional. Handlers já existem quando a fila entrar — muda só o transporte |
| 3.7 | Venda, baixa de estoque e título financeiro **na mesma transação** | Consistência eventual | Um ERP de caixa não tolera divergência entre o que foi vendido e o que foi baixado |
| 3.8 | Hospedagem em **PaaS gerenciado** + PostgreSQL gerenciado com PITR | VPS própria; AWS + Terraform | O sistema guarda o financeiro de terceiros. Backup e recuperação inclusos valem mais que economia de infraestrutura |

---

## 4. Estoque

| # | Decisão | Justificativa |
|---|---|---|
| 4.1 | **Lote com validade + FEFO** | Único jeito de alertar vencimento de verdade. Saída sugere o lote que vence primeiro |
| 4.2 | **Quarentena automática** ao vencer | Lote vencido sai do saldo disponível e exige decisão explícita: perda, devolução ao fornecedor ou liberação |
| 4.3 | Faixas de alerta **por categoria** | Pão vence em 1 dia, verdura em 3, industrializado em meses. Faixa única não serve |
| 4.4 | **Unidades múltiplas** (fardo/caixa ↔ unidade) com fator de conversão | Estoque guardado na menor unidade |
| 4.5 | **Produto pesável** com preço por kg e estoque fracionário | Hortifrúti, padaria e frios vendem por peso |
| 4.6 | Leitura de **etiqueta EAN-13 pesável** (prefixo 2) | O operador bipa a etiqueta da balança e o sistema extrai produto e peso. Custo baixo, ganho alto |
| 4.7 | **Fracionamento simples** (caixa 20 kg → 20 kg granel) | Resolve hortifrúti e frios com transferência de custo, sem módulo industrial |
| 4.8 | **Custo médio ponderado** | Padrão de mercado e mais estável para o CMV do DRE |
| 4.9 | **Perda com motivo categorizado** → despesa no plano de contas | Vencimento, avaria, quebra, furto, consumo interno. Perecível gera perda diária e ela precisa aparecer no resultado |
| 4.10 | Estoque negativo **permitido com aviso** + pendência de acerto | No varejo alimentar o saldo raramente bate. Travar o caixa com cliente na fila é causa comum de abandono de ERP |

**Fora de escopo:** vasilhame/casco retornável, múltiplos depósitos, transferência entre depósitos, inventário cíclico, ficha técnica/receita, ordem de produção.

⚠️ **Imprecisão consciente:** sem ficha técnica, o custo do pão fabricado não deriva do custo da farinha — a padaria informa o custo manualmente. O CMV desse segmento fica aproximado.

---

## 5. Vendas e caixa

| # | Decisão | Justificativa |
|---|---|---|
| 5.1 | **Venda balcão direta**, uma etapa | Baixa estoque na hora. Sem pedido, separação, faturamento ou entrega |
| 5.2 | **Preço único + desconto com alçada** | Operador desconta até o limite do seu papel; acima disso exige liberação registrada em auditoria |
| 5.3 | Pagamento **à vista** (dinheiro, PIX, cartão) e **fiado a prazo** | Fiado gera título em contas a receber com vencimento |
| 5.4 | **Limite de crédito** por cliente, com aviso e bloqueio de inadimplente | Era requisito do documento original e nunca foi implementado no legado |
| 5.5 | **Venda anônima** permitida (consumidor não identificado), só à vista | O legado usava um cliente fantasma chamado "anonimo" — aqui é modelado corretamente |
| 5.6 | **Cancelamento com estorno** e **devolução parcial** | Estorna estoque no lote de origem, estorna o título e registra motivo em auditoria |
| 5.7 | **Sessão de caixa**: abertura com fundo de troco, fechamento com contagem por forma de pagamento, apuração de sobra/falta | Trava venda com caixa fechado. Base de qualquer varejo |
| 5.8 | **Sangria e suprimento** lançados no financeiro e na auditoria | Ponto clássico de desvio |

**Fora de escopo:** pagamento dividido em múltiplas formas, carnê/parcelamento próprio, tela de PDV dedicada em modo quiosque, múltiplos caixas simultâneos, tabelas de preço, preço por faixa de quantidade, promoções, comissão de vendedor.

---

## 6. Compras e financeiro

| # | Decisão | Justificativa |
|---|---|---|
| 6.1 | **Entrada direta** de compra → lote + contas a pagar | Sem pedido de compra nem conferência de recebimento |
| 6.2 | **Plano de contas configurável + centro de custo** | Único jeito de servir empresas diferentes num SaaS. DRE montado a partir da árvore de contas |
| 6.3 | DRE por **competência e caixa** | Regimes diferentes respondem perguntas diferentes |
| 6.4 | **Simples Nacional** com alíquota efetiva configurável por empresa | Cobre a esmagadora maioria do pequeno comércio, sem modelar apuração tributária completa |
| 6.5 | Contas a pagar e a receber com **parcelas, vencimento e baixa** | "Contas a pagar no dia" exige título com vencimento — o legado só tinha um saldo agregado |
| 6.6 | **Exportação para o contador** | O que pequeno comércio realmente usa, em vez de módulo contábil completo |

**Fora de escopo:** conciliação bancária, importação OFX, geração de boleto/PIX, integração bancária, cotação e pedido de compra, importação de XML de NF-e do fornecedor.

---

## 7. Fiscal

| # | Decisão | Justificativa |
|---|---|---|
| 7.1 | Modelo **preparado** (NCM, CFOP, CST, CEST, unidade tributável), **sem emissão** | Evita retrabalho de migração quando a emissão entrar |
| 7.2 | Sem integração SEFAZ, sem certificado digital | Emissão própria é um projeto dentro do projeto |

⚠️ **Risco regulatório assumido:** comércio que vende a consumidor final normalmente precisa emitir NFC-e por obrigação legal. A decisão presume que o comerciante mantém a solução fiscal que já usa. Quando a emissão entrar, o caminho recomendado é via provedor terceiro (gateway), não implementação própria.

**Fora de escopo:** NF-e, NFC-e, NFS-e, CT-e, MDF-e, SPED.

---

## 8. Análise e alertas

| # | Decisão | Justificativa |
|---|---|---|
| 8.1 | **Sazonalidade e ranking** por mês, semana e dia da semana, com comparativo ano-a-ano | Pedido explícito: "o que vende mais em determinada época" |
| 8.2 | **Margem e lucratividade** por produto, categoria e cliente | Usa o custo médio ponderado. Mostra o que vende muito e lucra pouco |
| 8.3 | **Curva ABC** de produtos e clientes | Prioriza compra e atenção comercial |
| 8.4 | **Previsão por média móvel + sazonalidade + lead time + estoque de segurança** | Explicável e auditável, roda em SQL. O comerciante entende de onde saiu o número — modelo estatístico vira caixa-preta |
| 8.5 | Relatórios direto no OLTP com **views materializadas** | O porte alvo não justifica data warehouse (§19 do documento) |
| 8.6 | Alertas **in-app** (sino + dashboard) e **push PWA** | Sem custo por mensagem e sem dependência externa |
| 8.7 | Exportação Excel/PDF + **relatórios agendados** | DRE do mês disponível automaticamente na central de notificações |

**Alertas previstos:** vencimento próximo (faixa por categoria), lote em quarentena, estoque baixo e ruptura, conta a pagar vencendo hoje e atrasada, cliente inadimplente ou acima do limite, índice de perda acima do aceitável, caixa aberto sem fechamento.

**Fora de escopo:** e-mail, WhatsApp, modelo estatístico (Holt-Winters/ARIMA), data warehouse, Power BI/Metabase.

---

## 9. Produto e onboarding

| # | Decisão | Justificativa |
|---|---|---|
| 9.1 | **Onboarding self-service** que provisiona o tenant | Cria empresa, usuário dono, plano de contas e categorias |
| 9.2 | **Templates por segmento** (padaria, hortifrúti, mercearia, adega) | Semeia categorias, unidades, faixas de validade e plano de contas adequados. Tudo editável depois |
| 9.3 | Modelo prevê plano e limites, **sem billing** no MVP | A cobrança pode entrar sem alterar o modelo de dados |
| 9.4 | **Parceiro unificado** PF/PJ com papéis de cliente e/ou fornecedor | Não duplica quem é os dois. Necessário para o modelo ficar de fato preparado para fiscal |
| 9.5 | Interface **desktop-first**, responsiva, PWA instalável, tema claro/escuro | Usada no balcão; o gerente consulta no celular |
| 9.6 | **Leitor de código de barras** (EAN/GTIN) e comprovante imprimível | Leitor USB funciona como teclado — custo baixo, ganho alto |

---

## 10. Qualidade

| # | Decisão |
|---|---|
| 10.1 | Testes unitários das regras críticas: FEFO, custo médio, DRE, limite de crédito, conversão de unidade, EAN pesável |
| 10.2 | Testes de integração com PostgreSQL real em container, incluindo **teste de vazamento entre tenants** |
| 10.3 | Testes E2E dos fluxos principais (Playwright) |
| 10.4 | CI no GitHub Actions bloqueando merge com lint, tipos e testes |
| 10.5 | Entrega por fases, com revisão a cada fase antes da seguinte |

---

## Riscos assumidos

| Risco | Impacto se ocorrer | Mitigação |
|---|---|---|
| Ausência de filial no modelo | Migração de todas as tabelas de movimentação | Nenhuma. Decisão consciente do produto |
| Sem emissão de NFC-e | Comerciante pode precisar de solução fiscal paralela | Modelo já preparado; entrada via provedor terceiro |
| Sem ficha técnica de produção | CMV aproximado no segmento padaria | Custo informado manualmente |
| Estoque negativo permitido | Saldo pode divergir do físico | Pendência de acerto + alerta ao gerente |
| Sem tela de PDV dedicada | Venda mais lenta em horário de pico | Atalhos de teclado e leitor de código na tela padrão |
