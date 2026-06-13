---
name: new-crud
description: Scaffolda um recurso vertical completo no event-client (QInstante) — app Next.js 16 ÚNICO que consome API externa em :4000 via axios. Do tipo/DTO ao service, registro no client, hooks react-query e UI (lista + form com Yup). Use quando o usuário pedir "criar um CRUD de X", "adicionar o recurso X de ponta a ponta", "tela de listagem + cadastro de X". Segue o padrão do recurso `event`/`plan`.
---

# Recurso vertical completo (event-client)

Orquestra um recurso de ponta a ponta seguindo os recursos de referência **`event`** e **`plan`**. Antes de começar, leia o `CLAUDE.md` da raiz — ele tem a arquitetura em camadas e as armadilhas.

> ⚠️ Este **não** é o monorepo `next-forge`. **Não** existe `apps/api`, `packages/sdk`, Zod, Firestore nem i18n. O backend de domínio é **externo** (`:4000`); aqui você só cria o **contrato no service + o consumo no front**. Validação de formulário é **Yup**. Textos vão em **pt-BR direto no JSX**.

## 0. Alinhe o recurso com o usuário

- Nome singular/plural e o caminho base no backend (ex.: `/plan`).
- Campos + tipos (refletem o DTO) e operações necessárias (list/create/get/update/delete).
- Frente onde a UI vai morar: `(painel)` (organizador, client autenticado) ou `(event)` (convidado, `eventClient`)?
- Confirme com o backend quais endpoints `:4000` já existem para o recurso.

> Abra os recursos `event` e `plan` e use como template em cada camada. Replique a estrutura, troque nomes/campos.

## 1. DTO (`src/shared/types/dtos/<dominio>/`)

- `XDTO extends BaseDTO` (`id/createdAt/updatedAt/deletedAt` já vêm do base).
- Enums como `XStatusEnum`. Reexporte no `index.ts` do domínio e no `dtos/index.ts`.

## 2. Service (`src/lib/services/<dominio>/`)

Espelhe `services/plan/` (arquivos `service.ts` + `types.ts` + `schema.ts` + `index.ts` com `export *`):

- **`types.ts`**: `CreateXRequest`, `UpdateXRequest`, `FindXByIdResponse`, etc. Listagem retorna `PaginatedResponse<XDTO>`.
- **`schema.ts`** (se houver formulário): schema **Yup** + tipo inferido (`yup.InferType`).
- **`service.ts`**:

    ```ts
    export default class XService extends BaseService {
        private readonly baseUrl = '/x';
        constructor(private readonly client: AxiosInstance) {
            super();
        }

        async listPaginated(dto: ListPaginatedXRequest): Promise<PaginatedResponse<XDTO>> {
            const { data } = await this.client.get<PaginatedResponse<XDTO>>(
                `${this.baseUrl}?${this.buildQueryProperties(dto)}`,
            );
            return { data: data.data, meta: data.meta };
        }
        async findById(id: string): Promise<FindXByIdResponse> {
            const { data } = await this.client.get<FindXByIdResponse>(`${this.baseUrl}/${id}`);
            return data;
        }
        // create/update/delete análogos
    }
    ```

    Para upload de arquivo use `formDataFromObject(dto)` + `headers: { 'Content-Type': undefined }` (ver `EventService.create`).

## 3. Registrar o service no client (`src/lib/clients/`)

- `client.ts`: campo `readonly xService: XService;` + `this.xService = new XService(this.client)` no construtor.
- `event.ts`: registre **também** se o recurso for acessado na frente `(event)`.

## 4. Hooks react-query (`src/shared/hooks/`)

Sempre via **`useApi()`** (nunca importe `client`/`eventClient` direto). Espelhe `useFindEventById.ts` e `useEventCrud.ts`:

- **`useFindXById.ts`**: exporta `FIND_X_BY_ID` (constante) + `useQuery` com `enabled: !!id`.
- **`useXCrud.ts`**: mutations `create`/`update`/`delete` via `useMutation`; no `onSuccess` chama `successAlert(...)` e `queryClient.invalidateQueries({ queryKey: [LIST_X_QUERY_KEY] })`; no `onError` chama `errorAlert(handleClientError(error))` (via `useAlert`). Listagem paginada como hook interno `useListPaginatedX(dto)` com `placeholderData: previousData => previousData`.
- Reexporte no `hooks/index.ts`.

## 5. UI (na frente correta)

Sob a rota certa, usando pastas entre parênteses (`(pages)`/`(components)`/`(hooks)`/`(store)`):

- **Lista**: `Table` de `components/ui/table` (`createColumn<XDTO>()`), com filtros e `usePagination`.
- **Form**: `useForm({ resolver: yupResolver(xSchema) })` → `<FormProvider>` → `<form onSubmit={handleSubmit(onSubmit)}>` → `<FormContainer>` com `HookFormInput/Select/Switch/DatePicker/...` e `FormFooter` dentro do `<form>`.
- **Dark mode**: toda classe nova com `cn(...)` e variantes `dark:` usando tokens do tema (`soft-gold`, `matte-black`, etc).
- **Textos** em pt-BR direto no JSX.

## 6. Fechamento

- `pnpm lint` (e `pnpm exec tsc --noEmit` se quiser checar tipos). Não há testes para rodar.
- **Validação visual (obrigatória — toca UI)**: com a skill **`agent-browser`**, suba `pnpm dev` e percorra lista/criar/editar/excluir; tire screenshots e cheque layout, estados de erro/vazio, **responsivo mobile-first** e **tema claro/escuro**.
- Considere o agente **`code-reviewer`** sobre o diff.

## Mapa do recurso de referência (`plan` / `event`)

```
src/shared/types/dtos/billing/plan.ts          # XDTO + enums
src/lib/services/plan/{types,schema,service,index}.ts   # contrato + chamadas axios
src/lib/clients/client.ts (e event.ts)          # registro do service
src/shared/hooks/useFindPlanById.ts             # query por id
src/shared/hooks/usePlanCrud.ts                 # mutations + lista paginada
src/app/(painel)/(private)/painel/(pages)/planos/...    # UI (lista + form)
```

## Checklist final

- [ ] Front chama a API **só** via `useApi()` + hook react-query; sem `fetch`/axios cru nem URL hardcoded.
- [ ] Service `extends BaseService`, registrado no(s) client(s) certo(s).
- [ ] DTO estende `BaseDTO`; validação de form em **Yup** (não Zod).
- [ ] Hooks seguem `useFindXById` + `useXCrud`; mutations com `invalidateQueries` + `useAlert`.
- [ ] Design system usado (`HookForm*`/`Table`/`FormContainer`/`cn`); **dark mode** em tudo.
- [ ] Textos em pt-BR no JSX. `pnpm lint` passa.
