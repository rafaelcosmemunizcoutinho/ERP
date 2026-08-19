# ADR-0004 — Next.js + TypeScript em vez de Java + Spring Boot

**Status:** aceito · **Data:** 2026-08-19 · **Supera:** §3 do Contexto Técnico

## Contexto

O documento de Contexto Técnico propõe Java 21 + Spring Boot no backend e React + Vite no front, com Flyway, JPA e JUnit.

## Decisão

Next.js 15 full-stack com TypeScript, PostgreSQL e Drizzle.

## Razão

Spring **não é a escolha errada** — é a escolha certa para o produto que aquele documento descreve: uma plataforma ERP horizontal, com fiscal pesado, time grande e vida longa. O produto real é um vertical de varejo alimentar, construído por uma pessoa com apoio de agente.

Escolher a stack antes de escolher o produto foi a inversão que gerou o conflito. Resolvido o produto (ADR-0007), a stack seguiu.

## Consequências

Divergência assumida do ecossistema Java do documento. Em troca, um repositório só, um idioma só, e velocidade em dashboards e PWA — que é o grosso deste produto.

Migrations continuam em **SQL numerado e legível**, preservando o espírito do Flyway: política de RLS, índice parcial e view não cabem bem numa DSL gerada.
