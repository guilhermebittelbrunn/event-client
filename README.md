# QInstante — event-client

Aplicação web **mobile-first** para eventos sociais (foco em casamento): o organizador cria um evento e compartilha um **link/QR code**; os convidados acessam **sem cadastro** e enviam fotos ("memórias") para uma galeria coletiva, que pode ser apresentada ao vivo.

App **único** Next.js 16 (App Router) que consome uma **API externa** (`:4000`). Três frentes: `(home)` (landing/SEO), `(painel)` (área do organizador) e `(event)` (experiência do convidado).

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 + antd · React Query · Zustand · React Hook Form + Yup · axios · Stripe. Linguagem: **pt-BR**. Tema claro/escuro em todas as telas.

## Pré-requisitos

- **Node 22.13.0** (`.nvmrc` — use `nvm use`)
- **pnpm 10.15.1** (fixado em `packageManager`; com Corepack: `corepack enable`)

## Como rodar

```bash
pnpm install
cp .env.example .env   # ajuste NEXT_PUBLIC_API_URL etc.
pnpm dev               # http://localhost:3000
```

Requer o backend rodando em `NEXT_PUBLIC_API_URL` (padrão `http://localhost:4000`).

## Scripts

| Comando          | O que faz                          |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Servidor de desenvolvimento        |
| `pnpm build`     | Build de produção                  |
| `pnpm start`     | Servidor de produção               |
| `pnpm lint`      | ESLint em `src`                    |
| `pnpm typecheck` | `tsc --noEmit` (checagem de tipos) |

Não há suíte de testes no momento.

## Documentação

A arquitetura completa, convenções e padrões estão em **[CLAUDE.md](CLAUDE.md)** — leia antes de contribuir (vale para humanos e para o Claude Code). Cobre o fluxo de dados em camadas, autenticação/tokens, as 3 frentes, design system, dark mode, SEO e armadilhas comuns.
