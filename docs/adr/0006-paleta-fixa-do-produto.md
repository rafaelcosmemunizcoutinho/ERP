# ADR-0006 — Paleta única do produto, sem personalização por tenant

**Status:** aceito · **Data:** 2026-08-19

## Contexto

A expectativa inicial era que cada cliente pudesse editar as cores do sistema.

## Decisão

Paleta única, definida pelo produto. Nenhuma personalização visual por tenant — nem logo, nem cor de destaque.

## Razão

Cor semântica carrega informação operacional: verde é "em dia", âmbar é "vence em breve", vermelho é "vencido ou bloqueado". Paleta editável por quem não é designer produz contraste reprovado, tema escuro quebrado e — o pior — alerta semântico sem função. Um sistema pintado de vermelho perde o alerta de lote vencido.

**O acento nunca é verde, âmbar ou vermelho.** Por isso a marca é azul-tinta (`#2a4bc4`): distante das três matizes semânticas em mais de 60 graus, verificado por teste.

## Consequências

Todos os pares superfície/texto são verificados contra WCAG AA (4,5:1) e todos os limites de controle contra 1.4.11 (3:1), nos dois temas, por `src/ui/theme.test.ts`. Mexer num hex sem refazer a conta quebra o build.

O par `on-warning-container` sobre `warning-container` passa em 5,99:1 no tema claro — o mais apertado da paleta, e o primeiro a quebrar se alguém mexer no âmbar.

Se personalização virar requisito comercial, o caminho é logo mais **uma** cor de destaque com contraste derivado automaticamente — nunca paleta aberta.
