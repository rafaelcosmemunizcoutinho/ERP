# ADR-0005 — Infraestrutura mínima com portas abertas

**Status:** aceito · **Data:** 2026-08-19 · **Supera:** §3 e §21 do Contexto Técnico

## Contexto

O Contexto Técnico lista Redis, RabbitMQ, workers, Object Storage, OpenTelemetry, Prometheus, Grafana, Loki, Terraform, Helm e Kubernetes. O mesmo documento, em §25 e §29, manda evitar complexidade prematura e perguntar "precisamos disso agora?".

**O documento contradiz o próprio princípio.**

## Decisão

Resolvido a favor do princípio. PostgreSQL + aplicação + tarefas agendadas + Docker + CI. Nada mais.

Eventos de domínio existem, mas **in-process com tabela outbox**: `VendaConfirmada` dispara baixa de estoque, geração de financeiro e auditoria por um despachante interno, na mesma transação.

## Consequências

Venda, baixa de estoque e título financeiro são atômicos. Um ERP de caixa não tolera divergência entre o que foi vendido e o que foi baixado — consistência eventual aqui seria um defeito, não um trade-off.

Quando a fila entrar, os handlers já existem e muda só o transporte. Redis, broker e observabilidade completa entram quando houver problema demonstrado, não antes.
