# AGENTS.md — `erp-web`

> Operacional durável. Lido por todo agente antes de trabalhar. O mapa e os invariantes estão em [`CLAUDE.md`](CLAUDE.md) — **onde este arquivo for silencioso, vale o `CLAUDE.md`**.

## Build & Run

Tudo em container. `docker compose up` sobe banco, migrations e aplicação; o `app` só inicia depois que o `migrate` conclui com sucesso.

Comando roda **dentro** do container: `docker compose exec app npm run <script>`. Rodar `npm` no host usa o `node_modules` errado — ele vive num volume Docker, não na pasta.

## Validação

Ordem que pega mais erro por minuto gasto:

```
npm run typecheck      # contrato quebrado
npm test               # regra de negócio
npm run test:coverage  # gate de 100% na lista escopada
npm run lint           # ts-standard + jsx-a11y
npm run lint:dead      # knip
```

**Instalou dependência que ainda ninguém usa?** O `knip` falha o CI, e está certo — dependência entra no PR que a exercita, não antes. Já aconteceu: 9 pacotes de autenticação instalados um PR cedo demais.

**Ampliou cobertura?** Adicione o arquivo ao `include` do `vitest.config.ts` no mesmo PR. O gate é 100% sobre a lista, não sobre `src/**` — um `include` amplo trava o merge e um arquivo esquecido esvazia o gate em silêncio.

## Banco

- Migrations são SQL numerado em `drizzle/`, aplicadas uma vez cada, em transação, registradas em `_migration`.
- **Nunca edite migration já aplicada** — crie a próxima.
- Recriar do zero: `docker compose down -v && docker compose up`. O `-v` apaga o volume; todos os dados locais somem.
- Migrations rodam com o **dono** do banco (`DATABASE_ADMIN_URL`); a aplicação conecta com `erp_app` (`DATABASE_URL`). Essa separação é o que faz o RLS valer — ver invariante 2 do `CLAUDE.md`.

### Comprovando o isolamento entre tenants

```bash
docker compose exec -T db psql -U erp_app -d erp -tA -c "SELECT count(*) FROM tenant;"
# 0 — sem contexto de tenant o banco nao devolve nada

docker compose exec -T db psql -U erp_app -d erp -tA -c \
  "BEGIN; SELECT set_config('app.tenant_id','<uuid>',true); SELECT nome FROM tenant; COMMIT;"
# apenas o tenant do contexto
```

Se a primeira consulta devolver linhas, o isolamento quebrou. Trate como incidente, não como bug de tela.

## Front-end

- **Reutilize `src/ui` antes de criar.** Componente novo nasce classificado (atom / molecule) e com a quádrupla completa.
- Cor só sai de token. Hex literal no JSX ou no Tailwind não passa em revisão — a paleta é verificada em contraste por `src/ui/theme.test.ts`, e um literal escapa do teste.
- Tema escuro é a classe `.dark` no `<html>`, não `prefers-color-scheme`. O Storybook alterna pelo seletor **Tema** na barra.
- String visível passa por `t()`. Chave inexistente estoura em tempo de compilação e em runtime, de propósito.

## PR & Branch

- Branch sempre a partir de `main` atualizada; nunca commitar na `main`.
- PR pequeno e de um assunto só. Alinhamento de convenção e feature no mesmo PR fica irrevisável — já foi separado uma vez por esse motivo.
- Commit e push só quando pedido.

## Armadilhas conhecidas

**Tailwind v4 não força mais `cursor: pointer`** em `<button>` — o preflight da v3 forçava. O reset está em `src/app/globals.css`; ele cobre `button` e `[role="button"]`, e **não** alcança outros papéis ARIA clicáveis. Nesses casos, `cursor-pointer` explícito no componente.

**Heredoc de shell quebra com SQL que usa `$$`.** Ao criar migration com função PL/pgSQL, escreva o arquivo direto em vez de mandar por heredoc — já custou uma execução perdida.

**`npm install` no container avisa sobre scripts bloqueados.** É esperado: `@node-rs/*` resolve binário pré-compilado em tempo de require e não precisa de postinstall.
