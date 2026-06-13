# @seanb/boat

Frontend do **SeanB** — plataforma de listagem e reserva de barcos.

## Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS, Headless UI
- Zustand, react-hook-form, Zod
- next-intl (pt/en)
- Contratos compartilhados: `@seanb/shared`

## Setup

Na **raiz do monorepo** (`seanb/`):

```bash
yarn
cp packages/boat/.env.example packages/boat/.env.local
yarn dev:boat
```

Abre em [http://localhost:3000](http://localhost:3000).

### `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=sua-chave-opcional
```

A API precisa estar rodando (`yarn dev:api`) para fluxos autenticados e dados reais.

## Scripts (via raiz)

```bash
yarn dev:boat      # desenvolvimento
yarn build:boat    # build de produção
yarn start:boat    # servir build
yarn lint:boat
```

## Estrutura

- `src/app/[locale]/` — páginas (App Router + i18n)
- `src/components/` — UI e features
- `src/lib/` — clientes HTTP (`auth-api`, `listings-api`, …)
- `src/stores/` — estado global (Zustand)
- `src/config/` — rotas, endpoints, constantes

Detalhes em [DOCUMENTATION.md](./DOCUMENTATION.md).
