# CLAUDE.md — event-client (Qinstante)

Guia para o Claude trabalhar bem neste repositório. Leia antes de editar. É a **fonte de verdade** das convenções; o que estiver em conflito aqui vence suposições vindas de outros projetos.

> ⚠️ **Atenção, LLM:** este repo **NÃO é o monorepo `next-forge`**. Vários skills/agents foram herdados de outro projeto (`next-boilerplate`) e descrevem uma arquitetura que **não existe aqui** (monorepo `apps/api` + `packages/sdk`, Zod, Firestore, i18n em 3 idiomas, Biome/Ultracite, Turbo, Vitest). **Ignore tudo isso.** Veja a seção [Skills & Agents](#skills--agents-o-que-se-aplica) para o que de fato vale.

---

## 1. O produto

**Qinstante** é uma aplicação **mobile-first** (browser, não app nativo) para **eventos sociais** — o foco hoje é casamento. A ideia central é registrar **"memórias"** (fotos) de forma simples e intuitiva: o organizador cria um evento e compartilha um **link/QR code**; os convidados acessam **sem cadastro** e enviam fotos, que aparecem numa galeria coletiva e podem ser apresentadas ao vivo.

A aplicação tem **3 frentes** (3 route groups em `src/app/`):

| Frente         | Rota base                         | Público                               | Prioridade                                                                            |
| -------------- | --------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| **`(home)`**   | `/`                               | Visitantes (captação)                 | **SEO** alto, copy de conversão (casamento)                                           |
| **`(painel)`** | `/painel`, `/entrar`, `/cadastro` | Usuário logado (organizador/admin)    | UX administrativa; SEO **não** importa (rotas privadas)                               |
| **`(event)`**  | `/evento/[slug]`                  | Convidados via link/QR (sem cadastro) | **Performance** acima de tudo (rede ruim, aparelho fraco, muitos acessos simultâneos) |

**Invariantes do produto** (valem em TODA tela):

- **Mobile-first.** Desenhe para celular; o desktop é o caso secundário (deve funcionar, não ser o foco).
- **Dark mode obrigatório.** Toda tela e todo componente novo precisa funcionar em claro **e** escuro. Veja [§9](#9-dark-mode-obrigatório).
- **Idioma: pt-BR apenas.** Não há i18n. Textos vão direto em português no JSX (veja [§14](#14-i18n-não-existe)).

---

## 2. Stack & comandos

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript 5** (strict).
- **Gerenciador: pnpm 10.15.1** · **Node 22.13.0** (`.nvmrc`). A versão do pnpm é fixada em `packageManager` no `package.json` (fonte única, usada também pelo CI). **Não use `npm`/`yarn`** — só `pnpm-lock.yaml` (`package-lock.json`/`yarn.lock` estão no `.gitignore`).
- App **único** (não é monorepo). Sem `apps/*`, sem `packages/*`, sem `turbo`.

```bash
pnpm install          # instala deps
pnpm dev              # next dev (porta 3000)
pnpm build            # next build (valida o projeto inteiro)
pnpm start            # produção
pnpm lint             # eslint src
pnpm typecheck        # tsc --noEmit (checagem de tipos)
```

**Não existe** (não invente comandos): ❌ `test` (zero testes, sem Vitest/Jest) · ❌ `biome` / `ultracite` (usamos ESLint + Prettier) · ❌ `pnpm --filter` / `turbo` (app único).

**CI** (`.github/workflows/`): `pnpm build`, `pnpm lint` e `pnpm typecheck` rodam em push/PR para `main` (a versão do pnpm vem do `packageManager`). Husky roda `lint-staged` (`eslint --fix` + `prettier --write`) no pre-commit e **commitlint** (Conventional Commits) no commit-msg.

---

## 3. Arquitetura de dados (a espinha dorsal)

O front **não tem backend próprio de domínio**. Ele consome uma **API externa em `:4000`** (`NEXT_PUBLIC_API_URL`). O fluxo é sempre em camadas:

```
Componente  →  hook (react-query)  →  service (classe)  →  axios client  →  API externa :4000
   (UI)         useApi() + useX        EventService etc.    client / eventClient
```

**Detalhe-chave — base URL dupla** (`src/lib/clients/client.ts`):

```ts
// frontend usa proxy, backend chama direto
const apiUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_URL : '/api/v1';
const baseURL = typeof window === 'undefined' ? `${apiUrl}/v1` : apiUrl;
```

- **No browser** as chamadas vão para `/api/v1/...` → caem na rota catch-all `src/app/api/v1/[...path]/route.ts`, que **faz proxy** para `:4000/v1/...`. Isso mantém os tokens fora do JS do cliente e evita CORS.
- **No servidor** (SSR / server actions) o client chama `:4000/v1` direto.

**Dois clients** (`src/lib/clients/`):

- `client.ts` (default `client`) → rotas autenticadas. Anexa `Authorization: Bearer <accessToken>` + header `refresh-token`. Em **401** limpa cookies e dispara `window` event `auth:session-expired`.
- `event.ts` (`eventClient`) → rotas de convidado. Anexa header `event-token`.

**Seleção do client** — sempre via o hook `useApi()` (`src/shared/hooks/useApi.ts`), que escolhe `client` vs `eventClient` pelo contexto da rota (`/evento/*` → `eventClient`; resto → `client`). **Não importe `client`/`eventClient` direto em componentes** — use `useApi()`.

**Services** (`src/lib/services/<dominio>/`): uma classe por domínio (`auth`, `event`, `memory`, `plan`, `user`, `webhook`), registrada no construtor de `client.ts`. Padrão:

```ts
export default class EventService extends BaseService {
    private readonly baseUrl = '/event';
    constructor(private readonly client: AxiosInstance) {
        super();
    }

    async findById(id: string): Promise<FindEventByIdResponse> {
        const { data } = await this.client.get<FindEventByIdResponse>(`${this.baseUrl}/${id}`);
        return data;
    }
}
```

`BaseService.buildQueryProperties()` monta query strings de paginação. Tipos Request/Response ficam em `services/<dominio>/types.ts`; schemas Yup (quando há) em `schema.ts`.

**React Query** (`src/shared/context/QueryContext.tsx`): `refetchOnWindowFocus: false`, `retry: false` por padrão. Hooks de dados vivem em `src/shared/hooks/use*.ts`. Convenção de query key = constante string exportada + args: `[FIND_EVENT_BY_ID, id]`. Mutations chamam `queryClient.invalidateQueries({ queryKey: [...] })` no `onSuccess` e usam `useAlert()` para toast de sucesso/erro (`handleClientError(error)`).

**DTOs** (`src/shared/types/dtos/`): todos estendem `BaseDTO` (`id/createdAt/updatedAt/deletedAt`). Sufixos: `XxxDTO` para entidades, `XxxEnum` para enums. Tipos utilitários (`PaginatedResponse<T>`, `UpdateRequest<T>`, `PaginationRequest`) em `types/utils/`.

---

## 4. Estrutura de pastas

```
src/
├── app/                      # App Router (rotas + páginas)
│   ├── (home)/               # landing page  → /
│   ├── (painel)/             # área logada   → /painel, /entrar, /cadastro
│   ├── (event)/              # área convidado → /evento/[slug]
│   ├── api/v1/
│   │   ├── [...path]/        # PROXY catch-all para a API :4000
│   │   └── webhook/process-payment/   # webhook Stripe
│   ├── layout.tsx            # providers globais (Query, Sidebar, ClientLayout, fonts, Toast)
│   └── clientLayout.tsx      # antd ConfigProvider + tema (light/dark)
├── lib/
│   ├── clients/              # client.ts (auth) + event.ts (convidado)
│   └── services/<dominio>/   # service.ts + types.ts + (schema.ts) + index.ts
├── shared/
│   ├── actions/              # server actions ('use server') — pouco usado, ex: fetchEventBySlug com unstable_cache
│   ├── components/
│   │   ├── ui/               # design system (button, modal, card, table, badge, themeToggleButton…)
│   │   ├── form/             # inputs base (envolvem antd) — input, select, switch, datePicker…
│   │   └── hookForm/         # HookForm* = wrapper de form/ com <Controller> do RHF
│   ├── context/              # EventContext, QueryContext, SidebarContext (React Context, não Zustand)
│   ├── store/                # Zustand: useAuth, useMemory, useTheme
│   ├── hooks/                # useApi, useAlert, use<Recurso>… (react-query)
│   ├── seo/                  # createMetadata()
│   ├── types/dtos/           # DTOs por domínio
│   └── utils/helpers/        # cn, cookies, token, formattedError, formatNumber…
└── proxy.ts                  # middleware de borda do Next 16 (proteção de rota — ver §6)
```

**Convenção de pastas entre parênteses** (importantíssima — é o padrão de organização do repo):

- `(home)` / `(painel)` / `(event)` → **route groups** do Next: agrupam sem aparecer na URL.
- `(private)` / `(public)` → separação de rotas protegidas vs abertas.
- `(pages)` → páginas de fato. `(components)` → componentes locais daquela rota. `(hooks)` → hooks locais. `(store)` → estado/contexto local daquela árvore.
- Tudo entre `()` **não vira segmento de URL**. Componentes/hooks usados em mais de uma frente vão para `src/shared/`.

---

## 5. As 3 frentes — onde mexer

### `(home)` — landing (`src/app/(home)/`)

Página única focada em conversão de casamento (`components/Home.tsx`: hero, mockups, "como funciona", FAQ, footer). **SEO é prioridade**: metadata via `createMetadata()`, entra em `sitemap.ts` e `robots.ts`. Para mexer em copy/CTA/SEO daqui, considere os skills `copywriting`, `seo-audit`, `ai-seo`.

### `(painel)` — área do organizador (`src/app/(painel)/(private)/painel/`)

- `/painel` — dashboard (próximo evento + atalhos).
- `/painel/eventos` — lista (tabela + filtros + paginação).
- `/painel/eventos/cadastrar` e `/.../[id]/editar` — formulário de evento (`(components)/EventForm`).
- `/.../[id]/detalhes` — galeria de memórias do evento (infinite scroll, seleção, download, ocultar, slideshow).
- `/.../[id]/acessos` — geração de QR code / link de compartilhamento.
- `/.../[id]/apresentar` — modo apresentação (slideshow fullscreen, abre em nova janela).
- `/.../[id]/confirmar-pagamento` — checkout Stripe.
- `/painel/planos` e `/painel/planos/[id]/editar` — planos.
- Rotas públicas da frente: `/entrar`, `/cadastro` (`(painel)/(public)/`).
- **SEO não importa** aqui (privado). Foco em UX clara e formulários.

### `(event)` — experiência do convidado (`src/app/(event)/(private)/evento/[slug]/`)

- `/evento/[slug]` — entrada: tira/seleciona foto e envia (`PhotoSelector`, `MemoryPreview`, `CameraButton`).
- `/evento/[slug]/fotos` — galeria das memórias (infinite scroll, `ProgressiveImage`, `MemoryModal`, navbar mobile inferior).
- **Performance é a prioridade #1.** Convidados podem estar em rede ruim e aparelho modesto, em grande número. Minimize JS, prefira imagens otimizadas/progressivas, evite re-renders. Consulte os skills `vercel-react-best-practices` e `web-design-guidelines`. SEO importa para o slug do evento (metadata dinâmica em `generateMetadata`), mas **usabilidade/performance vêm primeiro**.

---

## 6. Autenticação & tokens

Três tokens, todos JWT em **cookies** (helpers em `src/shared/utils/helpers/cookies.ts` e `token.ts`):

- **`accessToken`** — sessão do organizador (Bearer).
- **`refreshToken`** — renovação (header `refresh-token`).
- **`eventToken`** — acesso do convidado a um evento (header `event-token`).

`token.ts`: `getTokenPayload<T>()` decodifica o payload do JWT (`split('.')[1]` → `atob` → JSON); `isTokenExpired()` usa buffer de 5 min. `crypto-js` (`NEXT_PUBLIC_TOKEN_CRYPTO`) é usado para cifrar valores no cliente.

**Login do organizador** → `useAuth` (Zustand, `src/shared/store/useAuth.ts`): `signIn()` chama `authService.signIn`, grava cookies, seta `user`. `AuthInitializer` (`src/shared/components/auth/AuthInitializer.tsx`) envolve o `(painel)`, restaura sessão no mount, mostra `LoadingScreen`, e escuta `auth:logout` / `auth:session-expired` para redirecionar a `/entrar`.

**Acesso do convidado** → `EventContext` (`src/shared/context/EventContext.tsx`, React Context, **não** Zustand): lê `?t=<token>` da URL, chama `signInByToken`, grava `eventToken` em cookie, valida o evento. Se o evento já terminou, redireciona para `/evento/[slug]/fotos`.

> ⚠️ **`src/proxy.ts` É o middleware de borda ativo.** No **Next.js 16 o `middleware.ts` foi renomeado para `proxy.ts`** — o arquivo é detectado por convenção (não precisa ser importado) e roda em toda request que casa com `config.matcher` (o build confirma: `ƒ Proxy (Middleware)`). Ele faz a proteção de rota na borda: redireciona não-autenticado de rota privada → `/entrar`, e autenticado em `/entrar`/`/cadastro` → `/painel`; rotas públicas (`/`, `/evento/*`) passam direto. O `AuthInitializer` (client) **complementa** isso restaurando a sessão e tratando `auth:logout`/`auth:session-expired`. `src/app/(event)/middleware.ts` está desabilitado (só retorna `NextResponse.next()`) — esse não roda.

---

## 7. Estado (Zustand + Context)

**Zustand** (`src/shared/store/`, com `immer` + `persist` + `subscribeWithSelector`):

- `useAuth` — usuário, flags de auth, `signIn/signUp/signOut/initializeAuth`.
- `useMemory` — fluxo de foto do convidado: `image`, preview, mensagem, **compressão** (`compressImage`, máx 1920px) e validação. Persiste só `maxFileSize`/`compressionQuality`.
- `useTheme` — `theme: 'light' | 'dark'` + `toggleTheme()` (aplica/remove a classe `dark` em `document.documentElement`). Persiste o tema.

**React Context** (`src/shared/context/`): `EventContext` (auth do convidado), `QueryContext` (react-query), `SidebarContext` (estado do menu do painel). Contexto **local** de árvore de rota vai numa pasta `(store)`, ex.: `eventos/(store)/useEventPage.tsx`.

Regra prática: **estado global de app → Zustand**; **estado de uma subárvore de rotas → Context numa pasta `(store)`**.

---

## 8. UI & Design System

- **`cn()`** (`src/shared/utils/helpers/cn.ts`) = `twMerge(clsx(...))`. Use SEMPRE para compor classes Tailwind (resolve conflito de precedência).
- **`src/shared/components/ui/`** — primitivos do design system. Muitos **envolvem o antd** adicionando estilo Tailwind + dark mode + variantes (ex.: `button` tem `primary`/`secondary`; `table` exporta `createColumn<T>()`). **Prefira esses componentes a usar antd cru** numa tela.
- **Formulários** = `react-hook-form` + **Yup** (`@hookform/resolvers/yup`):
    - `form/` = inputs base (envolvem antd, recebem `label`/`error`).
    - `hookForm/` = `HookForm*` envolvem o input base num `<Controller>` do RHF e extraem `fieldState.error`.
    - Página: `useForm({ resolver: yupResolver(schema) })` → `<FormProvider>` → `<form onSubmit={handleSubmit(onSubmit)}>` → `<FormContainer>` com `<HookFormInput name="..." />`, `<HookFormSelect/>`, etc. Veja `EventForm` e `cadastrar/page.tsx` como referência.
- **antd** é tematizado em `src/app/clientLayout.tsx` via `ConfigProvider` (algorithm dark/default conforme `useTheme`, `colorPrimary: '#CBA135'`, locale `pt_BR`, `dayjs.locale('pt-br')`).

---

## 9. Dark mode (obrigatório)

`darkMode: ['class']` no `tailwind.config.js`. O `useTheme` (Zustand) alterna a classe `dark` no `<html>`; o antd troca de algorithm via `ConfigProvider`. **Todo componente novo deve declarar as variantes `dark:`** usando os tokens do tema (não cores hardcoded soltas):

```tsx
className={cn('bg-white text-matte-black dark:bg-matte-black dark:text-white/90', className)}
```

Inclua o `themeToggleButton` onde fizer sentido (já presente no header do painel e na navbar mobile do evento). Ao revisar uma tela, **confira claro e escuro** (o agent-browser consegue alternar tema).

---

## 10. Tailwind v4 — tokens

Config em `tailwind.config.js` + variáveis em `src/app/globals.css` (`@theme`). Paleta da marca: **`soft-gold` (#CBA135)**, `snow-white`, `champagne`, `matte-black`, escalas `gray`/`brand` (stops 25–950), variantes `-dark`. Breakpoints custom mobile-first: `2xsm` (375px), `xsm` (425px), `3xl` (2000px). Fontes: `sans` (Montserrat/Outfit), `playfair`, `nanum-brush`, `cursive`. **Use os tokens existentes** em vez de cores cruas (`#fff`, `gray-200` aleatório).

---

## 11. SEO

`createMetadata()` (`src/shared/seo/metadata.ts`) gera o `Metadata` do Next (título `… | Qinstante`, OpenGraph 1200×630, Twitter card, locale `pt_BR`). `sitemap.ts` e `robots.ts` na raiz de `app/`. **Quem se importa com SEO:** `(home)` (alto) e `/evento/[slug]` (metadata dinâmica). `(painel)` é privado — sem indexação. Para trabalho sério de SEO/conteúdo, use os skills `seo-audit` / `ai-seo` / `copywriting`.

---

## 12. Uploads & imagens

- Upload via **antd `<Upload>`** (`form/inputUpload`), **não** react-dropzone (apesar de estar no `package.json`). `customRequest` evita POST automático; o arquivo vai no submit do form.
- No fluxo do convidado, `useMemory.compressImage()` reduz dimensão/qualidade antes de enviar.
- `next.config.ts`: `serverActions.bodySizeLimit: '50mb'`. `images.remotePatterns` libera os buckets S3 `event-mvp.s3...` e `acapra.s3...`. Use `next/image` com esses hosts.

---

## 13. Pagamentos (Stripe)

Server-side / orientado pelo backend. O checkout redireciona para a página segura do Stripe (`confirmar-pagamento/page.tsx`). O webhook chega em `src/app/api/v1/webhook/process-payment/route.ts`, que adiciona `x-api-secret` (`NEXT_API_SECRET`) e repassa para `webhookService.processPayment` → backend `:4000`. Tipos em `types/dtos/billing/` (`PaymentDTO`, `PaymentStatusEnum`, `PlanDTO`). **Não há `@repo/payments`** — toda a lógica de cobrança vive no backend externo.

---

## 14. i18n (não existe)

**Não há internacionalização.** App 100% **pt-BR**. Não há `next-intl`, `@repo/internationalization`, segmento `[locale]`, nem chaves de tradução. **Textos de UI vão direto em português no JSX.** Não tente criar/sincronizar arquivos de tradução.

---

## 15. Convenções de código

Prettier (`prettier.config.js`) + ESLint 9 flat (`eslint.config.mjs`):

- **Indentação: 4 espaços** · aspas **simples** · **ponto e vírgula** sim · `trailingComma: 'all'` · `printWidth: 112` · `arrowParens: 'avoid'` (`x => x`, sem parênteses em arg único) · `bracketSpacing: true`.
- `no-console` é **erro** exceto `warn`/`error`/`info`. `@typescript-eslint/no-explicit-any` está **off** (any é tolerado, mas evite quando der).
- Nomes: componentes/classes `PascalCase`; arquivos de componente em pasta própria `index.tsx`; hooks `useX`; services `XxxService`; DTOs `XxxDTO`; enums `XxxEnum`; query keys `CONSTANTE_STRING`.
- Commits: **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`…), validados por commitlint. Husky roda `eslint --fix` + `prettier --write` no staged.
- Antes de finalizar uma mudança grande: `pnpm lint` + `pnpm typecheck` (e `pnpm build` se mexeu em algo estrutural). Não há testes para rodar. Veja a [Rotina de conclusão](#rotina-de-conclusão-definition-of-done).

---

## 16. Receita: adicionar uma feature de dados ponta a ponta

Seguindo o padrão real do repo (ex.: recurso `event`):

1. **Tipos** em `src/lib/services/<dominio>/types.ts` (`Create…Request`/`…Response`). Schema Yup em `schema.ts` se houver formulário.
2. **Service** em `src/lib/services/<dominio>/service.ts` — classe `extends BaseService`, métodos tipados chamando `this.client.<verbo><T>(url)`.
3. **Registrar** o service no construtor de `src/lib/clients/client.ts` (e/ou `event.ts` se for fluxo de convidado).
4. **DTO** em `src/shared/types/dtos/<dominio>/` (estende `BaseDTO`).
5. **Hook** em `src/shared/hooks/` — `useQuery`/`useMutation` via `useApi()`; query key constante; `invalidateQueries` + `useAlert` nas mutations.
6. **UI** na frente correta (`(painel)`/`(event)`), em `(components)`/`(pages)`, usando `HookForm*` + `FormContainer` + componentes de `ui/`, com variantes `dark:`.
7. Texto em pt-BR direto no JSX. `pnpm lint` no fim.

---

## Rotina de conclusão (Definition of Done)

**Ao terminar qualquer mudança que toque código ou UI, antes de considerar o trabalho "pronto" e antes de commit/PR, acione o agente `code-reviewer`.** Ele é parte obrigatória do fluxo e faz duas coisas:

1. **Revisão de código** do diff segundo as convenções deste `CLAUDE.md` (camadas, `useApi()`, Yup, design system, pt-BR, etc.), reportando achados por severidade — sem aplicar fixes.
2. **Teste da aplicação com `agent-browser`** quando o diff toca front-end: sobe `pnpm dev`, percorre os fluxos alterados em viewport mobile e desktop, tira screenshots e valida layout/estados.

> 🌗 **Teste de tema obrigatório:** o `code-reviewer` deve, via `agent-browser`, **alternar entre tema claro e escuro** em cada tela tocada — acionando o `themeToggleButton`, conferindo que o toggle troca de fato, que **persiste após reload**, e que não há contraste quebrado/cor hardcoded vazando em nenhum dos temas. Screenshots dos **dois** temas devem constar no relatório. O detalhamento da etapa está no próprio agente (`.claude/agents/code-reviewer.md`).

Fluxo recomendado: implementar → `pnpm lint` + `pnpm typecheck` → **agente `code-reviewer`** (código + agent-browser + troca de tema) → corrigir achados bloqueantes → commit (Conventional Commits). Se o `agent-browser` não estiver disponível, o agente deve sinalizar que a validação visual/tema não pôde ser feita (não tratar como aprovada).

---

## 17. Armadilhas comuns

- ❌ Assumir monorepo (`pnpm --filter`, `apps/api`, `packages/sdk`). É **app único**.
- ❌ Usar Zod. Aqui é **Yup**.
- ❌ Rodar/instalar Biome/Ultracite/Vitest. É **ESLint + Prettier**, **sem testes**.
- ❌ Importar `client`/`eventClient` direto num componente. Use **`useApi()`**.
- ❌ Esquecer `dark:` num componente novo. Dark mode é obrigatório.
- ❌ Criar arquivos de i18n. App é pt-BR puro.
- ❌ Procurar `src/middleware.ts`. No Next 16 o middleware é o `src/proxy.ts` (renomeado) e **está ativo** (ver §6).
- ❌ Editar e supor que o hook formatou com Biome — o hook foi **corrigido** para Prettier+ESLint (ver `.claude/hooks/format-edited-file.sh`).
- ❌ Pesar JS/imagens na frente `(event)`. É a mais sensível a performance.

---

## Skills & Agents: o que se aplica

Vários itens em `.claude/` vieram do monorepo `next-boilerplate` e **descrevem arquitetura inexistente aqui**. Triagem:

**✅ Úteis neste repo** (genéricos): `brainstorming`, `frontend-design`, `ui-ux-pro-max`, `web-design-guidelines`, `vercel-react-best-practices` (ótimo para a frente `(event)`), `seo-audit` / `ai-seo` / `copywriting` (para a `(home)`), `agent-browser` (QA visual + checar dark mode), e os skills do plugin `firebase` (caso passe a usar Firebase).

**🔧 Adaptados para este repo:**

- `new-crud` — **reescrito** para o vertical real (DTO → service → client → hook react-query → página/form com Yup). Use a versão local.
- Agent `code-reviewer` — **reescrito** para as convenções deste repo.

**🗑️ Removidos** (descreviam o monorepo e foram apagados de `.claude/skills/` para não confundir LLMs futuras):

- `i18n-sync` — não há i18n; app é pt-BR puro.
- `new-api-route` — não se cria rota REST aqui; a API é externa (`:4000`). O que existe é só o proxy + webhook. Adicionar endpoint = "adicionar método no service" (§16).
- `payments-flow` — descrevia `@repo/payments`; aqui o Stripe é server-side via backend externo (§13).

**⚠️ Mantido, mas ainda não aplicável hoje:**

- `write-tests` — **não há infra de testes** (sem Vitest/Jest, zero `*.test.*`). O skill foi mantido para quando testes forem introduzidos, mas o conteúdo atual ainda assume o stack do monorepo. **Antes de usá-lo, crie a infra de testes e adapte o skill** ao stack deste repo.
