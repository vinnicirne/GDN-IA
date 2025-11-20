# Arquitetura NewsGen IA & SEO

## Visão Geral
O NewsGen é uma plataforma SaaS para geração de notícias automáticas utilizando IA Generativa (Gemini).

## Estrutura (Monorepo)

### Apps
- **apps/web**: Aplicação Frontend principal (React + Vite). Dashboard, Gerador e Editor.
- **apps/mobile**: App Mobile para consumo e gestão rápida (React Native).
- **apps/admin**: Painel administrativo para gestão de usuários e assinaturas.

### Packages
- **packages/api**: Backend Serverless / API Gateway.
- **packages/services**: Lógica de negócios reutilizável (Gemini Wrapper, Article Service).
- **packages/db**: Definições de banco de dados (Supabase), tipos e cliente compartilhado.
- **packages/workers**: Workers para processamento em segundo plano (Geração de texto longa, TTS).
- **packages/ui**: Biblioteca de componentes compartilhada.

### Infra
- **infra/terraform**: Definição de infraestrutura como código (GCP).

### Scripts
- **scripts/ingest**: Scripts de coleta de dados (Google Trends, RSS).

## Fluxo de Dados
1. **Ingest**: Coleta tendências.
2. **Planner**: Define pautas.
3. **Generation**: Gemini gera rascunho.
4. **Review**: Usuário edita/aprova no `apps/web`.
5. **TTS**: Geração de áudio via Gemini TTS.
6. **Publish**: Webhook para CMS ou API externa.
