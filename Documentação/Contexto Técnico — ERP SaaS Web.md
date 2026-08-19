# Contexto do Projeto — ERP SaaS Web

## 1. Objetivo

Estamos planejando construir um ERP moderno, 100% web, disponibilizado como SaaS (Software as a Service).

O sistema deve ser preparado para:

- Multi-tenancy.
- Múltiplas empresas e filiais.
- Crescimento gradual de usuários e clientes.
- Segurança e isolamento entre tenants.
- Integrações externas.
- Processamento assíncrono.
- Módulos fiscais, financeiros, estoque, vendas, compras etc.
- Alta disponibilidade conforme o produto crescer.
- Observabilidade.
- Evolução futura para arquitetura distribuída sem precisar reescrever o sistema.

A prioridade é construir uma arquitetura sólida, mas sem adicionar complexidade prematuramente.

---

# 2. Princípio arquitetural principal

A recomendação inicial é utilizar:

**Modular Monolith + Event-Driven Architecture**

Não começar com dezenas de microserviços.

A ideia é ter um único backend inicialmente, porém organizado internamente por domínios/módulos bem definidos.

Exemplo:

```text
ERP
├── Auth
├── Empresa
├── Usuário
├── Parceiro
├── Produto
├── Estoque
├── Compras
├── Vendas
├── Financeiro
├── Fiscal
├── Contabilidade
├── Faturamento
└── Shared
```

Cada módulo deve possuir baixo acoplamento e interfaces claras.

No futuro, caso determinado módulo precise escalar ou evoluir de forma independente, ele poderá ser extraído para um serviço separado.

---

# 3. Stack tecnológica proposta

## Backend

- Java 21+
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Bean Validation
- Flyway
- REST API

## Frontend

- React
- TypeScript
- Vite
- TanStack Query
- React Hook Form
- Zod
- Design System próprio
- shadcn/ui pode ser considerado

## Banco de dados

- PostgreSQL

## Cache

- Redis

## Mensageria

- RabbitMQ inicialmente
- Kafka somente caso os requisitos de escala/event streaming justifiquem

## Arquivos

Object Storage compatível com S3:

- AWS S3
- Cloudflare R2
- Azure Blob Storage
- Google Cloud Storage

## Containers

- Docker

## Orquestração

- Kubernetes quando a complexidade/escala justificar
- Não transformar Kubernetes em requisito desnecessário para o MVP

## CI/CD

- GitHub Actions
- Docker Registry
- Helm
- Kubernetes

## Infraestrutura como código

- Terraform

## Observabilidade

- OpenTelemetry
- Prometheus
- Grafana
- Loki

## Testes

- JUnit
- Testcontainers
- testes de integração
- testes de contrato quando necessário

## BI / Analytics

- Power BI ou Metabase
- Data Warehouse separado do banco transacional quando houver necessidade

## ETL

- Python
- Airflow, caso a complexidade dos pipelines justifique

---

# 4. Arquitetura de alto nível

A arquitetura inicial esperada:

```text
                        USUÁRIO
                           │
                           ▼
                    Browser / Web
                           │
                         HTTPS
                           │
                           ▼
                    CDN / WAF
                           │
                           ▼
                 Load Balancer / Ingress
                           │
                           ▼
                  ┌──────────────────┐
                  │   ERP Backend    │
                  │  Modular Monolith│
                  └────────┬─────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        PostgreSQL       Redis       RabbitMQ
             │                           │
             │                           ▼
             │                        Workers
             │
             ▼
       Object Storage
          (S3/R2)
```

Posteriormente:

```text
                       API Gateway
                           │
             ┌─────────────┼──────────────┐
             │             │              │
             ▼             ▼              ▼
          ERP API       Auth Service    Fiscal Service
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
    Vendas Estoque Financeiro
       │     │       │
       └─────┼───────┘
             ▼
          Events
             │
       RabbitMQ/Kafka
```

---

# 5. Multi-tenancy

O sistema será SaaS e deverá suportar múltiplos clientes.

A estratégia inicial recomendada é:

**Shared Database + Shared Schema + tenant_id**

Exemplo:

```text
PostgreSQL
│
├── Tenant A
├── Tenant B
├── Tenant C
└── Tenant D
```

As tabelas de negócio deverão possuir:

```text
tenant_id UUID NOT NULL
```

Exemplo:

```sql
CREATE TABLE produto (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);
```

O tenant não deve ser confiado ao frontend.

O tenant deve ser obtido a partir do contexto autenticado:

```text
JWT
 ↓
tenant_id
 ↓
Backend
 ↓
Application Context
 ↓
Database Query
```

Evitar APIs onde o cliente consiga simplesmente informar:

```text
?tenant_id=123
```

e controlar o próprio tenant.

---

# 6. Row Level Security

Avaliar utilização de PostgreSQL Row Level Security (RLS).

Objetivo:

Adicionar uma segunda camada de proteção para impedir que dados de um tenant sejam acessados por outro.

Arquitetura:

```text
Usuário
   ↓
JWT
   ↓
Backend
   ↓
PostgreSQL
   ↓
RLS
   ↓
Dados permitidos para o tenant
```

A aplicação continua responsável pela autorização, mas o banco pode atuar como camada adicional de isolamento.

---

# 7. Estratégia de crescimento de tenancy

Não é necessário obrigar todos os clientes a possuírem um banco separado.

Estratégia evolutiva:

### Inicial

```text
PostgreSQL Cluster
├── Tenant A
├── Tenant B
├── Tenant C
└── Tenant D
```

### Clientes maiores

```text
Cluster principal
├── Tenant A
├── Tenant B
└── Tenant C

Banco dedicado
└── Tenant X

Banco dedicado
└── Tenant Y
```

A aplicação deve ser projetada para permitir essa evolução futuramente.

---

# 8. Organização do backend

O backend deve ser organizado por domínio, e não apenas por camada técnica.

Evitar:

```text
controllers/
services/
repositories/
entities/
```

com todos os módulos misturados.

Preferir:

```text
erp/
├── auth/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── api/
│
├── vendas/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── api/
│
├── estoque/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── api/
│
├── financeiro/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── api/
│
└── shared/
```

O objetivo é aproximar a arquitetura do domínio do ERP.

---

# 9. Domínios principais

O ERP deverá inicialmente considerar os seguintes domínios:

```text
Empresa
Filial
Usuário
Permissões
Parceiros
Clientes
Fornecedores
Produtos
Serviços
Estoque
Compras
Vendas
Financeiro
Fiscal
Faturamento
Contabilidade
Comissões
Integrações
Relatórios
Auditoria
```

A divisão final dos bounded contexts deve ser definida após levantamento do domínio.

---

# 10. Domínio inicial sugerido

Um relacionamento conceitual inicial:

```text
                    EMPRESA
                       │
                    FILIAIS
                       │
         ┌─────────────┼─────────────┐
         │             │             │
      CLIENTES      PRODUTOS      USUÁRIOS
         │             │
         │             │
         └──────┬──────┘
                │
              VENDAS
                │
       ┌────────┼────────┐
       │        │        │
    ESTOQUE  FINANCEIRO  FISCAL
```

Esse modelo é apenas inicial e deve ser refinado antes da implementação.

---

# 11. Eventos de domínio

O ERP deverá utilizar eventos para desacoplar processos.

Exemplo:

```text
VendaConfirmada
       │
       ├── Atualizar estoque
       ├── Gerar financeiro
       ├── Calcular comissão
       ├── Solicitar emissão fiscal
       ├── Registrar auditoria
       └── Enviar notificação
```

A venda não deve necessariamente conhecer todos esses processos.

Exemplo conceitual:

```text
Venda
 ↓
Evento: VendaConfirmada
 ↓
Message Broker
 ↓
Consumers
```

---

# 12. Processamento assíncrono

Processamentos demorados não devem ficar presos à requisição HTTP.

Exemplos:

- Importação de XML.
- Processamento fiscal.
- Geração de relatórios.
- Integrações bancárias.
- Sincronização de estoque.
- Envio de e-mails.
- Processamento de documentos.
- Jobs financeiros.

Modelo:

```text
POST /importacoes

      ↓

"Importação iniciada"

      ↓

RabbitMQ

      ↓

Worker

      ↓

Processamento

      ↓

Status atualizado
```

---

# 13. Redis

Redis poderá ser utilizado para:

- Cache.
- Rate limiting.
- Locks distribuídos.
- Dados temporários.
- Cache de consultas.
- Controle de sessões quando necessário.

Não utilizar Redis como fonte primária de dados do ERP.

---

# 14. API

A API inicial será REST.

Exemplo:

```http
GET    /api/v1/produtos
POST   /api/v1/produtos
GET    /api/v1/produtos/{id}
PUT    /api/v1/produtos/{id}
DELETE /api/v1/produtos/{id}
```

Utilizar versionamento:

```text
/api/v1
/api/v2
```

quando necessário.

GraphQL não é requisito inicial.

---

# 15. Autenticação e autorização

Utilizar:

- OAuth2
- OpenID Connect
- JWT
- MFA
- RBAC
- Rate limiting

Modelo:

```text
Usuário
   ↓
Perfis
   ↓
Permissões
```

Permissões devem ser granulares.

Exemplo:

```text
VENDA_VISUALIZAR
VENDA_CRIAR
VENDA_ALTERAR
VENDA_CANCELAR

ESTOQUE_VISUALIZAR
ESTOQUE_MOVIMENTAR

FINANCEIRO_VISUALIZAR
FINANCEIRO_BAIXAR

PRODUTO_VISUALIZAR
PRODUTO_CRIAR
PRODUTO_ALTERAR
```

Também considerar escopo por:

```text
Empresa
Filial
Departamento
```

quando aplicável.

---

# 16. Auditoria

ERP deve possuir trilha de auditoria.

Modelo conceitual:

```text
auditoria
---------------------------------
id
tenant_id
usuario_id
data
entidade
entidade_id
acao
dados_anteriores
dados_novos
ip
```

Exemplo:

```text
Usuário: usuário X
Entidade: Pedido
ID: 98231
Ação: ALTERAÇÃO
Campo: condição_pagamento
Antes: 30 dias
Depois: 45 dias
```

A auditoria deve ser considerada requisito funcional, não apenas recurso técnico.

---

# 17. Documentos e arquivos

Não armazenar arquivos grandes diretamente no PostgreSQL.

Exemplos:

- XML
- PDF
- DANFE
- Boletos
- Contratos
- Anexos

Utilizar Object Storage.

Banco guarda metadados:

```text
id
tenant_id
bucket
path
nome
mime_type
tamanho
hash
created_at
```

---

# 18. Fiscal

O módulo fiscal deve ser tratado como um domínio importante e relativamente isolado.

Estrutura conceitual:

```text
fiscal/
├── nfe/
├── nfce/
├── nfse/
├── cte/
├── mdfe/
├── tributacao/
├── regras/
└── integracoes/
```

Integrações externas não devem contaminar o domínio principal do ERP.

Modelo:

```text
ERP
 ↓
Fiscal Domain
 ↓
Fiscal Integration
 ↓
SEFAZ / Prefeitura / Provider
```

O sistema deve ser preparado para mudanças frequentes de regras fiscais.

---

# 19. Relatórios e BI

O banco transacional não deve ser sobrecarregado com consultas analíticas extremamente pesadas.

Arquitetura futura:

```text
ERP
 │
 ▼
PostgreSQL OLTP
 │
 ▼
ETL / ELT
 │
 ▼
Data Warehouse
 │
 ├── Power BI
 └── Metabase
```

Relatórios operacionais podem continuar no PostgreSQL.

Analytics pesado deve ser separado conforme a necessidade.

---

# 20. Observabilidade

Observabilidade deve existir desde o início.

### Logs

Loki

### Métricas

Prometheus

### Dashboards

Grafana

### Tracing

OpenTelemetry

Fluxo esperado:

```text
HTTP Request
    ↓
API
    ↓
Service
    ↓
PostgreSQL
    ↓
RabbitMQ
    ↓
Worker
```

Deve ser possível rastrear uma operação através de correlation/request IDs.

---

# 21. Infraestrutura

A infraestrutura deve evoluir por etapas.

## MVP

Pode ser:

```text
Cloud
├── Load Balancer
├── Application
├── PostgreSQL
├── Redis
├── RabbitMQ
└── Object Storage
```

Tudo pode inicialmente estar em uma infraestrutura relativamente simples.

## Crescimento

Evoluir para:

```text
Cloud
│
├── CDN / WAF
├── Load Balancer
│
├── Kubernetes
│   ├── API
│   ├── Workers
│   ├── Scheduler
│   └── Auth
│
├── PostgreSQL
├── Redis
├── RabbitMQ
├── Object Storage
└── Observability
```

Kubernetes não deve ser adotado apenas por "moda". A adoção deve ser justificada pela necessidade operacional.

---

# 22. CI/CD

Pipeline esperado:

```text
Developer
   ↓
GitHub
   ↓
Pull Request
   ↓
Lint
   ↓
Unit Tests
   ↓
Integration Tests
   ↓
Build
   ↓
Docker Image
   ↓
Container Registry
   ↓
Deploy
```

Deploy deve ser automatizado.

---

# 23. Migração de banco

Utilizar Flyway.

Todas as alterações de banco devem ser versionadas.

Exemplo:

```text
V001__create_empresa.sql
V002__create_filial.sql
V003__create_usuario.sql
V004__create_produto.sql
V005__create_cliente.sql
```

Evitar alterações manuais não versionadas em ambientes compartilhados.

---

# 24. Testes

Estratégia:

```text
Unit Tests
     ↓
Integration Tests
     ↓
Contract Tests
     ↓
E2E Tests
```

Testcontainers pode ser utilizado para executar:

```text
PostgreSQL
Redis
RabbitMQ
```

durante testes de integração.

---

# 25. Princípios importantes

O projeto deve priorizar:

1. Simplicidade.
2. Separação clara de domínios.
3. Segurança multi-tenant.
4. Consistência transacional.
5. Auditabilidade.
6. Observabilidade.
7. Evolução incremental.
8. Baixo acoplamento.
9. Automação de infraestrutura.
10. Capacidade de escalar sem reescrever o sistema.

Evitar:

- Microserviços prematuros.
- Kubernetes sem necessidade.
- Complexidade excessiva.
- Frontend acessando banco diretamente.
- Tenant definido pelo frontend.
- Arquivos grandes dentro do banco.
- Processamentos pesados dentro de requests HTTP.
- Relatórios analíticos pesados no banco OLTP.
- Regras de negócio espalhadas pelo frontend.

---

# 26. Estratégia de evolução

### Fase 1 — Fundação

```text
React
+
Spring Boot
+
PostgreSQL
```

Implementar:

- Auth
- Tenant
- Empresa
- Usuários
- Permissões
- Auditoria

### Fase 2 — Core ERP

Implementar:

- Parceiros
- Produtos
- Estoque
- Compras
- Vendas
- Financeiro

### Fase 3 — Integrações

Implementar:

- Fiscal
- Bancos
- E-commerce
- APIs externas
- Webhooks

### Fase 4 — Escala

Adicionar conforme necessidade:

- Redis
- RabbitMQ
- Workers
- Kubernetes
- Observabilidade avançada
- Data Warehouse

### Fase 5 — Distribuição

Somente se necessário:

```text
Modular Monolith
       ↓
Separação de módulos
       ↓
Serviços independentes
       ↓
Microservices
```

---

# 27. Decisões que ainda precisam ser discutidas

Antes de iniciar o desenvolvimento definitivo, analisar:

1. Modelo exato de multi-tenancy.
2. Uso de PostgreSQL RLS.
3. Estratégia de identificação dos tenants.
4. Modelo de Empresa x Filial.
5. Bounded Contexts.
6. Modelo de permissões.
7. Estratégia de autenticação.
8. Estratégia de versionamento da API.
9. Estratégia de eventos.
10. RabbitMQ vs Kafka.
11. Estratégia de cache.
12. Estratégia de documentos.
13. Estratégia fiscal.
14. Estratégia de relatórios.
15. Cloud provider.
16. Kubernetes desde o início ou posteriormente.
17. Disaster Recovery.
18. Backup.
19. Alta disponibilidade.
20. SLA.
21. Estratégia de billing do SaaS.
22. Limites por plano.
23. Onboarding de novos tenants.
24. Provisionamento automático.
25. Monitoramento por tenant.

---

# 28. Próximo passo recomendado

Antes de escrever código, produzir:

## Documento de arquitetura

Contendo:

```text
1. Context Map
2. Bounded Contexts
3. Modelo de tenancy
4. ERD inicial
5. Modelo de autorização
6. Fluxos principais
7. Eventos de domínio
8. Contratos de API
9. Estratégia de infraestrutura
10. Estratégia de observabilidade
```

Depois criar o **modelo de dados inicial** para:

```text
Tenant
Empresa
Filial
Usuário
Perfil
Permissão
Parceiro
Cliente
Fornecedor
Produto
Estoque
Pedido
Venda
Financeiro
Documento Fiscal
Auditoria
```

A partir desse modelo, definir os primeiros endpoints e casos de uso.

---

# 29. Regra geral para decisões técnicas

Não assumir que uma tecnologia é necessária apenas porque é popular.

Para cada componente, responder:

```text
Qual problema isso resolve?
Qual complexidade adiciona?
Qual custo adiciona?
Precisamos disso agora?
Podemos adicionar posteriormente?
```

A arquitetura deve ser **evolutiva**, não maximalista.

O objetivo não é criar a infraestrutura mais complexa possível.

O objetivo é criar um ERP SaaS que consiga começar pequeno, manter velocidade de desenvolvimento e evoluir para uma plataforma grande sem precisar ser reescrito.

---

# 30. Papel esperado do Claude

Ao analisar este projeto, o Claude deve atuar como um arquiteto de software sênior.

Deve:

- Questionar decisões arquiteturais quando houver alternativas melhores.
- Identificar riscos.
- Evitar overengineering.
- Considerar requisitos específicos de ERP brasileiro.
- Priorizar consistência e integridade dos dados.
- Considerar multi-tenancy desde o início.
- Avaliar segurança.
- Avaliar escalabilidade.
- Propor modelos de domínio.
- Propor ERDs.
- Propor APIs.
- Avaliar decisões de infraestrutura.
- Identificar pontos que precisam ser definidos antes da implementação.
- Explicar trade-offs.
- Não assumir que a arquitetura proposta acima é definitiva.

Importante:

**A arquitetura acima é uma hipótese inicial, não uma especificação imutável.**

O Claude deve revisar criticamente essas decisões e propor alterações quando houver justificativa técnica.