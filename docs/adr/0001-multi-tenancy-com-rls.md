# ADR-0001 — Multi-tenancy por schema compartilhado com Row Level Security

**Status:** aceito · **Data:** 2026-08-19

## Contexto

O produto é um SaaS que guarda o financeiro de empresas diferentes no mesmo banco. Vazamento entre tenants não é bug de tela: é incidente de dados de terceiros.

## Decisão

Schema compartilhado com `tenant_id` em toda tabela de negócio, e Row Level Security como segunda camada.

A aplicação define o contexto com `set_config('app.tenant_id', ..., true)` dentro da transação. Duas condições fazem a camada valer:

- A aplicação conecta com o papel `erp_app`, criado com `NOBYPASSRLS`. **RLS não se aplica a superusuário** — conectar com o dono do banco faria o PostgreSQL ignorar todas as políticas.
- Toda tabela com política tem `FORCE ROW LEVEL SECURITY`, senão o dono da tabela passa por cima dela.

## Alternativas descartadas

**Schema por tenant** — isolamento mais forte, mas migração passa a ser N vezes e o número de schemas vira limite operacional no porte alvo.

**Banco por tenant** — inviável no preço-alvo de um comércio de bairro. Fica disponível como evolução para um tenant grande, sem mudar o código.

**Só filtro na aplicação** — uma consulta que esquece o `WHERE` vaza dados. Não há revisão que garanta isso em centenas de consultas.

## Consequências

`SET LOCAL` é local à transação, então o contexto não vaza entre requisições que compartilham conexão do pool. Em troca, **nenhuma consulta de negócio pode rodar fora de `comTenant()`** — é o custo da garantia, e vira invariante.
