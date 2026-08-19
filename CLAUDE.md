# CLAUDE.md — `erp-web`

> Mapa do repositório. Passou de ~120 linhas, extraia para `docs/`. Detalhe de decisão vive em `docs/decisoes.md` e `docs/adr/`; o operacional durável vive em [`AGENTS.md`](AGENTS.md).

## O que é

ERP SaaS multi-tenant para **pequenos comércios do varejo alimentar** — padaria, hortifrúti, mercearia, adega. Substitui um WinForms .NET 6 local, preservado em `legacy/` como referência.

Porte alvo por tenant: até 5.000 SKUs, ~500 vendas/dia, 3-10 usuários.

## Stack canônica

Next.js 15 (App Router) · TypeScript · PostgreSQL 17 · Drizzle ORM · Tailwind v4 · Vitest + RTL · Storybook · Docker Compose.

Tudo roda em container. Nada é instalado no host além do Docker.

## Estrutura

```
src/app/          rotas (App Router). Páginas FINAS: gate + tela da feature, sem regra de negócio
src/ui/           design system — foundations · atoms · molecules (genéricos, sem domínio)
src/modules/      domínios de negócio — <dominio>/{components,hooks,api,lib,<feature>_svc}
src/db/           client (comTenant), migrate, schema por domínio
src/i18n/         dicionários por namespace; nenhuma string solta no JSX
src/lib/          utilitários compartilhados
drizzle/          migrations em SQL numerado, aplicadas em transação
docs/             decisoes.md · plano-de-fases.md · adr/
legacy/           WinForms substituído
```

## Comandos

| Ação | Comando |
|---|---|
| Subir tudo | `docker compose up` |
| Migrations | `docker compose run --rm migrate` |
| Testes | `docker compose exec app npm test` |
| Cobertura (gate) | `docker compose exec app npm run test:coverage` |
| Tipos | `docker compose exec app npm run typecheck` |
| Lint | `docker compose exec app npm run lint` |
| Código morto | `docker compose exec app npm run lint:dead` |
| Storybook | `docker compose exec app npm run storybook` → :6006 |
| Ferramentas de banco | `docker compose --profile tools up -d` → pgweb :8081 |

## Invariantes (não-negociáveis)

1. **Nenhuma consulta de negócio fora de `comTenant()`.** O `tenant_id` vem da sessão autenticada no servidor — nunca de query string, rota ou header do cliente.
2. **RLS é a segunda camada e depende de dois detalhes.** A aplicação conecta com o papel `erp_app` (`NOBYPASSRLS`) e toda tabela com política tem `FORCE ROW LEVEL SECURITY`. Sem qualquer um dos dois, o isolamento vira decoração — RLS não se aplica a superusuário, e o dono da tabela ignora as próprias políticas. Teste de integração cobre o vazamento entre tenants.
3. **Sem comentário no código.** Nome e tipo explicam. A **única** exceção é armadilha de segurança, onde remover a linha causa falha silenciosa — marcada com `ARMADILHA DE SEGURANCA`. Migrations de RLS mantêm o porquê no SQL.
4. **Atomic Design com fronteira de domínio.** Atoms e molecules em `src/ui`, genéricos, sem regra de negócio. Componente que conhece venda, lote ou DRE vive em `src/modules/<dominio>/components`. **Antes de criar UI, reutilize `src/ui`.**
5. **Componente novo nasce com a quádrupla** — `x.tsx` + `x.test.tsx` + `x.stories.tsx` + `x.mdx`. Sem story e doc, o Atomic Design vira só nome de pasta.
6. **Rota com menos de 20 linhas e zero regra de negócio.** Delega para `<feature>_svc`. Cada arquivo de service tem **uma** função pública (`criar*`, `obter*`, `atualizar*`); helpers levam prefixo `_`. Services conversam por chamada de service, nunca por import cruzado de schema.
7. **Nunca lançar `Error` genérico.** Exceção própria com `status` e `mensagem`, convertida em resposta por um tratador único. Em teste, nunca comparar mensagem com string literal — use a classe.
8. **Cobertura global 100%**, com `include` do vitest escopado só ao que já tem teste, crescendo arquivo a arquivo. Um `include` amplo travaria o primeiro PR sem chance de merge. `src/app/**` fica fora — por isso as páginas são finas.
9. **Paleta é contrato, não gosto.** Tokens em `src/ui/theme.css`, vocabulário Material (`surface` / `on-surface` / `*-container`), tema escuro pela classe `.dark`. `src/ui/theme.test.ts` cobra AA em todos os pares nos dois temas. **O acento nunca é verde, âmbar ou vermelho** — essas três carregam significado operacional.
10. **Estado nunca é comunicado só por cor** — cor + ícone/ponto + rótulo, sempre.
11. **Nenhuma string solta no JSX.** Tudo passa por `t()`. Um único locale carregado (pt-BR), estrutura pronta para o segundo.
12. **Migrations em produção: expand → contract.** Toda mudança de schema em duas etapas compatíveis, para a versão anterior não quebrar durante o deploy.
13. **Branch sempre a partir de `main` atualizada.** Nunca commitar na `main`.

## Ponteiros

| Assunto | Onde |
|---|---|
| Decisões fechadas e o porquê | `docs/decisoes.md` |
| Ordem de entrega | `docs/plano-de-fases.md` |
| Decisões com trade-off registrado | `docs/adr/` |
| Como rodar e resolver problemas | `README.md` |
| Operacional para agentes | `AGENTS.md` |
| Origem das convenções | ADR-0007 |
