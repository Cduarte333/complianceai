# PRD — ComplianceAI: Motor de Conformidade Regulatória Automatizada
**Versão:** 1.0 | **Data:** Junho 2026 | **Status:** Draft — Milestone 1

---

## 1. Visão Geral

### 1.1 As 3 Ideias Propostas

| # | Nome | Problema Resolvido | Disposição de Pagamento |
|---|------|-------------------|------------------------|
| **1** | **ComplianceAI** | Automação de checklist de conformidade regulatória (LGPD, SOC2, ISO 27001) | ⭐⭐⭐⭐⭐ Alta — risco jurídico direto |
| 2 | DocuTech | Geração automática de documentação técnica a partir de código (OpenAPI, ADRs) | ⭐⭐⭐⭐ Alta — produtividade de engenharia |
| 3 | PolicyBot | Motor de regras comportamentais para análise de risco de crédito/sinistros | ⭐⭐⭐⭐ Alta — setor financeiro/seguros |

### 1.2 Ideia Selecionada: ComplianceAI

**Proposta de Valor:** SaaS serverless que automatiza a geração, rastreamento e evidenciação de controles de conformidade regulatória (LGPD, SOC 2, ISO 27001, BACEN), reduzindo de 3–6 meses de trabalho manual de consultoria para um processo contínuo e auditável em horas.

**Dor do Cliente (B2B):** Empresas de médio porte gastam entre R$ 80.000 e R$ 300.000/ano em consultorias de compliance e ainda enfrentam multas e auditorias. O processo é manual, disperso em planilhas e altamente sujeito a erros humanos.

**ICP (Ideal Customer Profile):**
- Fintechs e SaaS B2B em estágio de crescimento (50–500 funcionários)
- Empresas buscando certificação SOC 2 Type II ou conformidade LGPD
- Times de engenharia e segurança sem equipe dedicada de GRC (Governança, Risco e Conformidade)

---

## 2. Arquitetura de Alto Nível

### 2.1 Princípios de Design

- **Clean Architecture** com separação clara de camadas (Domain → Application → Infrastructure)
- **Serverless-first** para custo operacional próximo de zero no MVP
- **Event-driven** para rastreabilidade e auditoria nativa
- **API-first** para integrações nativas com ferramentas do cliente (GitHub, Jira, AWS, etc.)

### 2.2 Stack Tecnológica Recomendada

#### Frontend
| Componente | Tecnologia | Justificativa |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + edge rendering, excelente DX |
| Estilo | Tailwind CSS + shadcn/ui | Velocidade de UI, consistência |
| Estado | Zustand + React Query | Leve, sem boilerplate |
| Deploy | Vercel | Zero config, edge functions nativas |

#### Backend (Serverless)
| Componente | Tecnologia | Justificativa |
|---|---|---|
| Runtime | AWS Lambda (Node.js 20) | Custo por execução, auto-scaling |
| API Gateway | AWS API Gateway v2 (HTTP) | WebSocket + REST unificados |
| Orquestração | AWS Step Functions | Workflows de compliance auditáveis |
| Fila | AWS SQS + EventBridge | Desacoplamento assíncrono |
| IA/LLM | Anthropic Claude API (claude-sonnet-4-6) | Análise de documentos + geração de controles |

#### Dados
| Componente | Tecnologia | Justificativa |
|---|---|---|
| Banco principal | PostgreSQL via Supabase | Auth nativo, Row Level Security, realtime |
| Cache | Upstash Redis (serverless) | TTL por tenant, baixo custo |
| Documentos | AWS S3 + CloudFront | Armazenamento de evidências e relatórios |
| Busca | pgvector (Supabase) | RAG sobre documentos de compliance |

#### Observabilidade
| Componente | Tecnologia |
|---|---|
| Logs | AWS CloudWatch + Axiom |
| Traces | AWS X-Ray |
| Alertas | PagerDuty (tier pago) / Email (MVP) |

### 2.3 Fluxo de Dados

```
[Cliente/Integração]
        │
        ▼
[API Gateway HTTP] ──── Auth (JWT/Supabase) ────▶ [Rate Limiter - Upstash]
        │
        ▼
[Lambda: Ingestion]
  - Recebe documentos, configs, eventos de integração
  - Valida schema e enfileira
        │
        ▼
[SQS Queue] ──▶ [EventBridge: Roteador de Eventos]
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
   [Lambda:       [Lambda:       [Lambda:
    Analyzer]      Evidence]     Report Gen]
   (Claude API)   (Coleta       (PDF/JSON)
   Análise de     evidências    Geração de
   gaps de        automáticas)  relatórios]
   controles
          │             │              │
          └─────────────▼──────────────┘
                 [PostgreSQL via Supabase]
                  - compliance_controls
                  - evidence_items
                  - audit_logs
                  - tenant_configs
                        │
                        ▼
               [S3: Relatórios e Evidências]
                        │
                        ▼
              [Frontend Next.js / Vercel]
              Dashboard + Audit Trail UI
```

### 2.4 Modelo de Domínio (Entidades Centrais)

```
Tenant
  ├── ComplianceFramework (LGPD, SOC2, ISO27001...)
  │     └── Control (controle específico)
  │           ├── ControlStatus (compliant / gap / in_progress)
  │           └── Evidence (documentos, screenshots, logs)
  └── AuditLog (trilha imutável de todas as ações)
```

---

## 3. Estratégia de Monetização

### 3.1 Modelo SaaS Tierizado (USD/mês)

| Tier | Preço | Limite | Público-Alvo |
|---|---|---|---|
| **Starter** | $99/mês | 1 framework, 3 usuários, 50 controles | Early adopters, startups early-stage |
| **Growth** | $399/mês | 3 frameworks, 10 usuários, 300 controles | Fintechs e SaaS em crescimento |
| **Scale** | $999/mês | Ilimitado + white-label API + SLA 99.9% | PMEs reguladas, plataformas |
| **Enterprise** | Custom | SSO, On-premise, auditoria dedicada | Bancos, seguradoras, gov |

### 3.2 Métricas de Viabilidade (MVP)

| Métrica | Meta 12 meses |
|---|---|
| MRR alvo | $15.000 |
| Clientes necessários | ~25 no Growth ou ~150 no Starter |
| CAC estimado | $800–1.500 (outbound/PLG) |
| LTV estimado (Growth) | $14.364 (3 anos) |
| Custo operacional AWS/mês | <$200 até 50 clientes ativos |

### 3.3 Go-to-Market

1. **Fase 1 (M1–M3):** Founders como SDR. Outreach direto para CTOs/CISOs de fintechs. Oferta de pilot gratuito de 30 dias.
2. **Fase 2 (M4–M6):** Product-Led Growth — self-serve com trial de 14 dias no Starter. Content SEO sobre LGPD/SOC2.
3. **Fase 3 (M7–M12):** Parcerias com consultorias de TI e escritórios de advocacia especializados em LGPD.

---

## 4. Milestone 1 — MVP (KISS)

**Objetivo:** Entregar valor real ao primeiro cliente pagante em 6–8 semanas.

**Princípio:** Uma coisa feita muito bem > dez coisas feitas pela metade.

### 4.1 Escopo do M1 (Framework: LGPD — 10 controles essenciais)

#### Semana 1–2: Infraestrutura Base
- [ ] Setup Supabase (PostgreSQL + Auth + Storage)
- [ ] Setup AWS (Lambda + API Gateway + SQS) via Terraform/SST
- [ ] CI/CD com GitHub Actions → Vercel + AWS
- [ ] Schema do banco: `tenants`, `controls`, `evidence_items`, `audit_logs`

#### Semana 3–4: Core Engine
- [ ] Lambda de ingestão: recebe documentos PDF/texto via multipart
- [ ] Integração Claude API: prompt de análise de gaps por controle LGPD
- [ ] Pipeline assíncrono: SQS → Lambda Analyzer → Supabase
- [ ] API REST: `POST /documents`, `GET /controls`, `GET /reports`

#### Semana 5–6: Frontend MVP
- [ ] Login/Auth com Supabase (magic link)
- [ ] Dashboard: lista de controles com status (✅ Conforme / ⚠️ Gap / 🔄 Em progresso)
- [ ] Upload de documentos com preview de análise
- [ ] Página de relatório exportável em PDF

#### Semana 7–8: Hardening e Onboarding
- [ ] Webhook de integração (GitHub, Jira — apenas leitura)
- [ ] Fluxo de onboarding guiado (wizard 3 passos)
- [ ] Documentação da API (OpenAPI 3.1 auto-gerada)
- [ ] Primeiro cliente beta com feedback estruturado

### 4.2 O Que NÃO Está no M1

> Fora de escopo para evitar scope creep:

- ❌ Suporte a múltiplos frameworks (SOC2, ISO 27001) — M2
- ❌ Integrações de escrita (criar tickets automaticamente) — M2
- ❌ Relatórios white-label — M3
- ❌ SSO Enterprise (SAML) — M3
- ❌ Mobile app — backlog

### 4.3 Critérios de Aceitação do M1

| Critério | Métrica |
|---|---|
| Análise de documento | < 90 segundos para retornar gaps identificados |
| Disponibilidade | 99.5% uptime (CloudWatch) |
| Segurança | Dados multi-tenant isolados por RLS no Supabase |
| Auditabilidade | 100% das ações logadas com timestamp + user_id |
| Primeiro cliente | 1 cliente pagante ou LOI assinado |

### 4.4 Estimativa de Esforço (Time Solo ou Duo)

| Fase | Esforço |
|---|---|
| Infraestrutura | 3–4 dias |
| Backend core | 6–8 dias |
| Frontend MVP | 5–6 dias |
| Testes + QA | 2–3 dias |
| Onboarding + Docs | 2 dias |
| **Total** | **~4–5 semanas (full-time)** |

---

## 5. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Custo inesperado da Claude API | Médio | Alto | Cache de respostas via Redis + prompts otimizados |
| Cold start Lambda em análises longas | Médio | Médio | Provisioned concurrency para Lambda crítico + timeout 29s |
| Complexidade regulatória mal mapeada | Alto | Alto | Parceria com 1 consultor de compliance no M1 |
| Churn por falta de valor percebido | Médio | Alto | Onboarding hands-on nos primeiros 3 clientes |

---

## 6. Próximos Passos Imediatos

1. **Esta semana:** Validar ICP com 5 entrevistas de 20 min com CTOs/CISOs de fintechs
2. **Semana 2:** Setup do ambiente (`supabase init`, `sst init`, `npx create-next-app`)
3. **Semana 3:** Primeiro prompt de análise de controle LGPD funcionando end-to-end (mesmo que feio)
4. **Semana 4:** Demo gravada de 3 minutos para prospecção

---

*Documento gerado como PRD inicial. Revisão recomendada após entrevistas de validação com clientes.*
