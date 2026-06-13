# SeanB

Plataforma de listagem e reserva de barcos. Monorepo com frontend Next.js, backend NestJS e pacote compartilhado de contratos (Zod).

> Base visual derivada do template TripFinder (RedQ). A aplicação evoluiu com API própria, Prisma e `@seanb/shared`.

## Pacotes

| Pacote | Nome npm | Descrição |
|--------|----------|-----------|
| `packages/boat` | `@seanb/boat` | Frontend (Next.js 15, React 19, Tailwind) |
| `packages/api` | `api` | Backend REST (NestJS 11, Fastify, Prisma 7) |
| `packages/shared` | `@seanb/shared` | Schemas Zod, tipos e mappers front ↔ API |

Orquestração: **Yarn Workspaces** + **Turborepo**.

## Pré-requisitos

- Node.js 18+ (recomendado 20+)
- Yarn 1.x
- Docker (PostgreSQL local)

## Setup rápido

```bash
# 1. Dependências
yarn

# 2. Banco de dados
docker-compose up -d

# 3. Variáveis de ambiente
cp packages/api/.env.example packages/api/.env
cp packages/boat/.env.example packages/boat/.env.local

# 4. Prisma (primeira vez)
cd packages/api
npx prisma generate
npx prisma migrate dev
npx prisma db seed
cd ../..
```

## Comandos

```bash
# Frontend (http://localhost:3000)
yarn dev:boat

# API (http://localhost:3333)
yarn dev:api

# Ambos em paralelo
yarn dev

# Build de produção
yarn build
yarn start:boat   # frontend
```

## Configuração

### Frontend (`packages/boat/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=sua-chave-opcional
```

### API (`packages/api/.env`)

```env
DATABASE_URL="postgresql://tripfinder:tripfinder_secret@localhost:5433/tripfinder"
PORT=3333
JWT_SECRET=trocar-em-producao
```

> As credenciais `tripfinder` no Postgres são do `docker-compose.yml` — nome do banco, não do projeto npm.

### Usuários de teste (após seed)

| Email | Senha |
|-------|-------|
| `fabio@example.com` | `password123` |
| `maria@example.com` | `password123` |

## Documentação adicional

- [BACKEND_SETUP.md](./BACKEND_SETUP.md) — backend, Prisma, roadmap da API
- [packages/boat/DOCUMENTATION.md](./packages/boat/DOCUMENTATION.md) — estrutura do frontend

## Stack

- **Frontend:** Next.js, TypeScript, Tailwind, Zustand, next-intl (pt/en)
- **Backend:** NestJS, Fastify, JWT, PostgreSQL
- **Shared:** Zod (validação única entre front e API)
