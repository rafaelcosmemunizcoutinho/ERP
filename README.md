# ERP Web

ERP SaaS multi-tenant para **pequenos comércios do varejo alimentar** — padaria, hortifrúti, mercearia, adega e afins.

Substitui o sistema WinForms legado, preservado em [`legacy/`](legacy/) apenas como referência histórica.

> **Estado atual:** Fase 1 (fundação) instalada — multi-tenancy com Row Level Security, catálogo de permissões e trilha de auditoria. As demais fases estão em [`docs/plano-de-fases.md`](docs/plano-de-fases.md).

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Subir o projeto](#subir-o-projeto)
- [O que sobe](#o-que-sobe)
- [Comandos do dia a dia](#comandos-do-dia-a-dia)
- [Banco de dados e migrations](#banco-de-dados-e-migrations)
- [Multi-tenancy e RLS](#multi-tenancy-e-rls)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Solução de problemas](#solução-de-problemas)
- [Stack](#stack)

---

## Pré-requisitos

**Apenas o Docker.** Não é preciso Node.js, npm nem PostgreSQL instalados na máquina — tudo roda em container, inclusive as ferramentas de desenvolvimento.

| Requisito | Versão mínima | Verificar com |
|---|---|---|
| Docker Engine | 24+ | `docker --version` |
| Docker Compose | v2+ | `docker compose version` |

No Windows, use **Docker Desktop com backend WSL 2**. Clone o repositório dentro do sistema de arquivos do Windows ou do WSL, mas não misture os dois — bind mount atravessando a fronteira fica lento.

---

## Subir o projeto

```bash
git clone <url-do-repositorio> erp
cd erp
docker compose up
```

É isso. Na primeira vez o Docker baixa as imagens, instala as dependências e aplica as migrations — leva alguns minutos. Nas próximas, sobe em segundos.

Quando aparecer `✓ Ready`, abra:

| Endereço | O que é |
|---|---|
| <http://localhost:3000> | Aplicação |
| <http://localhost:3000/api/health> | Healthcheck (JSON) |

A página inicial mostra o estado do ambiente. Se estiver tudo certo você verá **Banco conectado**, com 4 migrations aplicadas, 5 papéis do sistema e 28 permissões catalogadas.

Verificação rápida por linha de comando:

```bash
curl http://localhost:3000/api/health
# {"status":"ok","banco":"up","versao":"0.1.0"}
```

Para rodar em segundo plano, use `docker compose up -d` e acompanhe com `docker compose logs -f app`.

---

## O que sobe

```
┌──────────────────────────────────────────────────────────┐
│  docker compose up                                       │
└──────────────────────────────────────────────────────────┘
        │
        ├── db        PostgreSQL 17          host :5433 → 5432
        │             (aguarda ficar healthy antes de seguir)
        │
        ├── migrate   aplica drizzle/*.sql   roda uma vez e encerra
        │             (usa o DONO do banco)
        │
        └── app       Next.js 15 (dev)       host :3000 → 3000
                      (hot reload; usa o papel erp_app)
```

O `app` só inicia depois que o `migrate` termina com sucesso — não existe janela em que a aplicação suba contra um schema desatualizado.

### Ferramentas opcionais

```bash
docker compose --profile tools up -d
```

| Endereço | O que é |
|---|---|
| <http://localhost:4983> | Drizzle Studio — navegar e editar o schema |
| <http://localhost:8081> | pgweb — cliente SQL no navegador |

---

## Comandos do dia a dia

Todos rodam dentro dos containers. Nada é executado na sua máquina.

| Ação | Comando |
|---|---|
| Subir | `docker compose up` |
| Subir em segundo plano | `docker compose up -d` |
| Ver logs da aplicação | `docker compose logs -f app` |
| Parar | `docker compose down` |
| Parar e **apagar o banco** | `docker compose down -v` |
| Reconstruir após mudar dependências | `docker compose up --build` |
| Abrir um shell no container | `docker compose exec app sh` |
| Rodar qualquer script npm | `docker compose exec app npm run <script>` |
| Abrir o psql | `docker compose exec db psql -U erp -d erp` |

### Instalar uma dependência nova

```bash
docker compose exec app npm install <pacote>
docker compose restart app
```

O `node_modules` vive num volume Docker, não na sua pasta — é o que evita conflito entre binários compilados para Windows e para Linux, e o que torna o rebuild rápido.

---

## Banco de dados e migrations

Migrations são **arquivos SQL numerados** em [`drizzle/`](drizzle/), aplicados em ordem, uma única vez cada, dentro de uma transação. O controle fica na tabela `_migration`.

Optamos por SQL legível em vez de DSL gerada: um ERP acumula políticas de RLS, índices parciais, views e funções que não cabem bem numa camada de abstração — e o SQL versionado é auditável por qualquer pessoa que abra o arquivo.

```
drizzle/
├── 0000_papel_aplicacao.sql   cria o papel erp_app (NOBYPASSRLS)
├── 0001_fundacao.sql          tenant, empresa, usuario, papel, permissao, auditoria
├── 0002_rls.sql               políticas de Row Level Security
└── 0003_permissoes.sql        catálogo de permissões e papéis do sistema
```

| Ação | Comando |
|---|---|
| Aplicar migrations pendentes | `docker compose run --rm migrate` |
| Ver o que já foi aplicado | `docker compose exec db psql -U erp -d erp -c "SELECT * FROM _migration"` |
| Recriar o banco do zero | `docker compose down -v && docker compose up` |

Para criar uma migration, adicione um arquivo com o próximo número em `drizzle/` e rode `docker compose run --rm migrate`. **Nunca edite uma migration já aplicada** — crie a próxima.

---

## Multi-tenancy e RLS

O isolamento entre empresas tem **duas camadas independentes**.

**1. Aplicação.** Toda operação de negócio roda dentro de `comTenant()`, em [`src/db/client.ts`](src/db/client.ts). O `tenant_id` vem da sessão autenticada no servidor — nunca de query string, parâmetro de rota ou header enviado pelo cliente.

**2. Banco.** Cada tabela tem política de Row Level Security lendo `app.tenant_id`, definido por `SET LOCAL` dentro da transação. Se uma consulta esquecer o filtro, o banco simplesmente não devolve a linha.

Duas decisões fazem a segunda camada valer de fato:

- `FORCE ROW LEVEL SECURITY` — sem isso, o dono da tabela ignoraria as próprias políticas.
- A aplicação conecta com o papel **`erp_app`**, criado com `NOBYPASSRLS`. Se conectasse com o dono do banco, o PostgreSQL ignoraria o RLS e o isolamento existiria só no papel.

`SET LOCAL` vale apenas dentro da transação, então o contexto não vaza entre requisições que compartilham a mesma conexão do pool.

### Comprovando o isolamento

```bash
# Cria duas empresas (como dono do banco, que ignora RLS)
docker compose exec -T db psql -U erp -d erp -c \
  "INSERT INTO tenant (id, nome, segmento) VALUES
     ('11111111-1111-1111-1111-111111111111','Padaria do Ze','padaria'),
     ('22222222-2222-2222-2222-222222222222','Hortifruti da Ana','hortifruti');"

# Como a aplicação, SEM contexto de tenant → 0 linhas
docker compose exec -T db psql -U erp_app -d erp -tA -c "SELECT count(*) FROM tenant;"

# Como a aplicação, COM contexto → apenas a empresa do contexto
docker compose exec -T db psql -U erp_app -d erp -tA -c \
  "BEGIN; SELECT set_config('app.tenant_id','11111111-1111-1111-1111-111111111111',true);
   SELECT nome FROM tenant; COMMIT;"

# Limpa
docker compose exec -T db psql -U erp -d erp -c \
  "DELETE FROM tenant WHERE nome IN ('Padaria do Ze','Hortifruti da Ana');"
```

Esse comportamento é coberto por teste de integração automatizado — vazamento entre tenants quebra o build.

---

## Variáveis de ambiente

**Não é preciso criar `.env` para desenvolver** — todos os valores têm padrão no `docker-compose.yml`. Crie apenas se quiser mudar portas ou credenciais:

```bash
cp .env.example .env
```

| Variável | Padrão | Para que serve |
|---|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | `erp` | Dono do banco; usado pelas migrations |
| `APP_DB_PASSWORD` | `erp_app` | Senha do papel da aplicação (`NOBYPASSRLS`) |
| `DB_PORT` | `5433` | Porta do Postgres no host. `5433` evita conflito com um Postgres já instalado |
| `APP_PORT` | `3000` | Porta da aplicação no host |
| `AUTH_SECRET` | valor de dev | Assinatura das sessões |
| `STUDIO_PORT` / `PGWEB_PORT` | `4983` / `8081` | Ferramentas do profile `tools` |

Gerar um segredo de verdade para produção:

```bash
docker compose exec app node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Os padrões deste arquivo servem **apenas para desenvolvimento local**. Em produção, `AUTH_SECRET` e `APP_DB_PASSWORD` vêm do gerenciador de segredos do provedor.

---

## Estrutura do projeto

```
erp/
├── docker-compose.yml     ambiente completo de desenvolvimento
├── Dockerfile             multi-stage: deps → dev → builder → runner
├── drizzle/               migrations em SQL, versionadas
├── src/
│   ├── app/               rotas Next.js (App Router)
│   │   └── api/health/    healthcheck
│   ├── db/
│   │   ├── client.ts      conexão + comTenant() (contexto de RLS)
│   │   ├── migrate.ts     runner de migrations
│   │   └── schema/        schema Drizzle por domínio
│   └── modules/           domínios de negócio (a partir da Fase 2)
├── docs/                  arquitetura, ADRs e plano de fases
├── Documentação/          requisitos e contexto técnico originais
└── legacy/                sistema WinForms substituído (referência)
```

O backend é organizado **por domínio**, não por camada técnica — cada módulo com `domain/`, `application/`, `infrastructure/` e `api/` próprios, mantendo baixo acoplamento para que um módulo possa ser extraído no futuro sem reescrita.

---

## Testes

```bash
docker compose exec app npm run test        # regras de negócio
docker compose exec app npm run test:e2e    # fluxos ponta a ponta
docker compose exec app npm run typecheck   # verificação de tipos
```

Os testes de integração sobem um PostgreSQL real em container e validam, entre outras coisas, que **um tenant não enxerga o dado de outro**. Lint, tipos e testes rodam no CI e bloqueiam merge.

---

## Solução de problemas

**A porta 3000 já está em uso**
Defina `APP_PORT=3001` no `.env` e rode `docker compose up` de novo.

**A porta do Postgres conflita com uma instalação local**
O padrão já é `5433` justamente para evitar isso. Se ainda conflitar, mude `DB_PORT` no `.env`.

**Hot reload não pega minhas alterações**
No Windows e no macOS, o bind mount nem sempre propaga eventos de arquivo. A imagem de desenvolvimento já liga o polling (`WATCHPACK_POLLING`). Se persistir, `docker compose restart app`.

**"Banco indisponível" na página inicial**
O `migrate` provavelmente falhou. Veja o motivo com `docker compose logs migrate`.

**Instalei um pacote e o container não enxerga**
O `node_modules` está num volume. Rode `docker compose exec app npm install` (dentro do container) e depois `docker compose restart app`.

**Quero começar do zero**
`docker compose down -v && docker compose up --build`. O `-v` apaga o volume do banco — **todos os dados locais são perdidos**.

**Erro de permissão em arquivo no Linux**
O container roda como root em desenvolvimento. Se arquivos criados por ele ficarem inacessíveis, ajuste com `sudo chown -R $USER:$USER .`.

---

## Stack

| Camada | Tecnologia | Por quê |
|---|---|---|
| Aplicação | Next.js 15 + TypeScript | Full-stack num só repositório; forte em dashboards e PWA |
| Banco | PostgreSQL 17 | RLS nativo — a base do isolamento multi-tenant |
| Acesso a dados | Drizzle ORM | SQL-first e tipado; controle fino da conexão, exigido pelo RLS |
| Migrations | SQL versionado | Auditável; suporta políticas, índices parciais e views |
| Containers | Docker + Compose | Ambiente idêntico em qualquer máquina |
| Testes | Vitest + Playwright | Regras de negócio e fluxos ponta a ponta |

As decisões de arquitetura e seus motivos estão registradas em [`docs/`](docs/).

---

## Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/plano-de-fases.md`](docs/plano-de-fases.md) | O que entra em cada fase e em que ordem |
| [`docs/decisoes.md`](docs/decisoes.md) | Decisões fechadas e suas justificativas |
| [`Documentação/Contexto Técnico — ERP SaaS Web.md`](Documentação/) | Documento de arquitetura de referência |
