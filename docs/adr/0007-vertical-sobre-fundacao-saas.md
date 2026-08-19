# ADR-0007 — Vertical de varejo alimentar sobre fundação SaaS

**Status:** aceito · **Data:** 2026-08-19

## Contexto

O Contexto Técnico descreve uma **plataforma** ERP horizontal: contabilidade, comissões, faturamento, serviços, e-commerce, fiscal completo, billing de assinatura. O pedido descreve um **produto**: gestão para pequenos comércios.

Nenhuma das 30 seções daquele documento menciona lote, validade, FEFO, conversão fardo↔unidade, venda por peso ou plano de contas — que são exatamente o coração do produto.

## Decisão

Vertical de varejo alimentar (padaria, hortifrúti, mercearia, adega), construído sobre a fundação genérica do documento: multi-tenancy, RLS, RBAC granular, auditoria e organização por domínio.

## Convenções herdadas

De `maria-repo/maria-hub-ui`: Atomic Design com fronteira de domínio, quádrupla por componente, vocabulário de tokens Material, tema por classe `.dark`, cobertura 100% escopada, páginas finas, ts-standard, knip.

De `maria-repo/api`: rota fina sem regra de negócio, `<feature>_svc` com uma função pública por arquivo, exceções tipadas com status e mensagem, casos obrigatórios por endpoint, migrations expand → contract.

**Divergência registrada:** o `api` proíbe qualquer comentário. Aqui a proibição vale, com uma exceção estreita e nomeada — armadilha de segurança, onde remover a linha causa falha silenciosa (`NOBYPASSRLS`, `FORCE RLS`, `SET LOCAL`).

## Consequências

Plataforma horizontal continua possível depois: a fundação já é multi-tenant. O que se abre mão hoje é da generalidade prematura — e do custo de anos que ela traria.
