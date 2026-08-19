# ADR-0003 — Modelo fiscal preparado, sem emissão

**Status:** aceito · **Data:** 2026-08-19

## Contexto

Comércio que vende a consumidor final normalmente precisa emitir NFC-e por obrigação legal. Emissão própria envolve certificado digital, assinatura de XML, comunicação com a SEFAZ, contingência e invalidação — um projeto dentro do projeto.

## Decisão

O modelo de dados nasce com NCM, CFOP, CST, CEST e unidade tributável. **Nenhuma emissão** é implementada.

## Consequências

**Risco regulatório assumido.** A decisão presume que o comerciante mantém a solução fiscal que já usa. O sistema não substitui essa obrigação, e isso precisa ser dito com clareza a quem contrata.

Quando a emissão entrar, o caminho é **provedor terceiro** (gateway), não implementação própria. Ter os campos fiscais desde já evita migração de todo o catálogo depois.

Fora de escopo permanente até revisão: NFS-e (exige venda de serviço), CT-e e MDF-e (exigem frota própria emitindo conhecimento de transporte).
