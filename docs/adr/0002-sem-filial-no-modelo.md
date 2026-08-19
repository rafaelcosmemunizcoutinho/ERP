# ADR-0002 — Hierarquia Tenant → Empresa, sem filial

**Status:** aceito · **Data:** 2026-08-19

## Contexto

O documento de Contexto Técnico exige modelo Empresa × Filial. O porte alvo é comércio de bairro com um ponto de venda.

## Decisão

Hierarquia `Tenant → Empresa`. Sem entidade de filial e sem `filial_id` nas tabelas de movimentação.

## Consequências

**Risco aceito conscientemente, e é o mais caro do projeto.** Padaria ou mercearia que abre a segunda loja é cenário comum. Introduzir filial depois exige migração de todas as tabelas de movimentação com dados em produção.

A alternativa avaliada — `filial_id` presente no schema desde já, com uma filial padrão invisível na interface — custava quase nada agora e foi descartada em favor do modelo mais enxuto.

**Gatilho de revisão:** o primeiro tenant que pedir uma segunda loja. A partir daí o custo só cresce.
