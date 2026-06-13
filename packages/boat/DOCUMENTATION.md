# Documentação do frontend — @seanb/boat

## Introdução

Frontend do SeanB: listagem, reserva e gestão de anúncios de barcos. Consome a API NestJS (`packages/api`) e valida formulários com schemas de `@seanb/shared`.

Parte do layout veio do template TripFinder; fluxos principais (auth, listings, reservas) usam a API real.

## Requisitos

- Node.js 18+
- Yarn 1.x
- API + Postgres rodando localmente (ver [BACKEND_SETUP.md](../../BACKEND_SETUP.md))

## Configuração

```bash
# na raiz seanb/
cp packages/boat/.env.example packages/boat/.env.local
```

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL da API (padrão `http://localhost:3333`) |
| `NEXT_PUBLIC_GOOGLE_MAP_API_KEY` | Google Maps (opcional) |

## Executar

```bash
yarn dev:boat    # só frontend
yarn dev         # frontend + API
```

## Estrutura de pastas

| Pasta | Conteúdo |
|-------|----------|
| `src/app/[locale]/` | Páginas e layouts (i18n) |
| `src/components/` | Componentes de UI e features |
| `src/components/ui/` | Componentes reutilizáveis |
| `src/lib/` | Clientes API, mappers locais |
| `src/stores/` | Zustand (auth, listing, modals, …) |
| `src/hooks/` | Data fetching e utilitários React |
| `src/config/` | Rotas, endpoints, constantes |
| `src/types/` | Tipos de UI (view models) |
| `public/` | Assets estáticos e JSON legado (home) |

## Customização

- Metadados do site: `src/app/layout.tsx`
- Tailwind: `tailwind.config.js`
- Rotas: `src/config/routes.ts`
- Endpoints: `src/config/api-endpoints.ts`

## Schemas compartilhados

Formulários que falam com a API importam schemas de `@seanb/shared`:

```typescript
import { loginSchema } from '@seanb/shared';

const formSchema = loginSchema.extend({
  remember: z.boolean(), // campo só de UI
});
```

Campos exclusivos de tela (confirmPassword, acceptPolicy, etc.) ficam no `.extend()` do componente; regras da API ficam no shared.
