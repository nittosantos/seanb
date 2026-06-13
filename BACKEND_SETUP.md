# Guia de Setup do Backend — SeanB

## Estado atual

- **NestJS 11** + **Fastify**
- **Prisma 7** + **PostgreSQL 16**
- **Validação:** Zod via `@seanb/shared` (não usa mais class-validator)
- **Docker:** container `seanb-postgres`, porta **5433**
- **API:** porta **3333**

---

## Estrutura do monorepo

```
seanb/
├── packages/
│   ├── boat/              @seanb/boat — Frontend Next.js
│   ├── api/               api — Backend NestJS
│   └── shared/            @seanb/shared — Schemas Zod + mappers
│       ├── src/schemas/   auth, listings, reservations, users, …
│       ├── src/mappers/   form → payload da API
│       └── dist/          build TypeScript (gerado)
├── docker-compose.yml
├── package.json           Turbo + Yarn Workspaces
└── yarn.lock
```

---

## Configuração de ambiente

### API

```bash
cp packages/api/.env.example packages/api/.env
```

```env
DATABASE_URL="postgresql://tripfinder:tripfinder_secret@localhost:5433/tripfinder"
PORT=3333
JWT_SECRET=super-secret-change-in-production
```

| Variável | Desenvolvimento |
|----------|-----------------|
| `DATABASE_URL` | `postgresql://tripfinder:tripfinder_secret@localhost:5433/tripfinder` |
| `PORT` | `3333` |
| `JWT_SECRET` | trocar em produção |

### Frontend

```bash
cp packages/boat/.env.example packages/boat/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Docker (PostgreSQL)

| Campo | Valor |
|-------|-------|
| Usuário | `tripfinder` |
| Senha | `tripfinder_secret` |
| Banco | `tripfinder` |
| Container | `seanb-postgres` |
| Porta (host) | `5433` |

```bash
docker-compose up -d
```

---

## Comandos

```bash
# Raiz do monorepo
yarn                          # instalar deps
yarn dev:api                  # API em watch (builda @seanb/shared antes)
yarn dev:boat                 # frontend
yarn dev                      # ambos

# Prisma (packages/api)
cd packages/api
npx prisma generate           # obrigatório após clone
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

O script `dev`/`build` da API já executa `yarn workspace @seanb/shared build` automaticamente.

---

## `@seanb/shared` — contrato front ↔ API

Schemas Zod compartilhados. A API valida com `ZodBody` / `ZodQuery`; o frontend importa os mesmos schemas (ou `.extend()` para i18n/campos de UI).

```
packages/shared/src/
├── schemas/
│   auth.ts          login, register, forgotPassword
│   listings.ts      create, update, query, editListingForm
│   reservations.ts  create, update
│   users.ts         updateProfile, changePassword, personalInfoForm
│   add-listing.ts   wizard steps
│   booking.ts       bookingForm
│   reviews.ts       createReview (API planejada)
│   feedback.ts      contactHost, reportListing (API planejada)
│   payments.ts      addPaymentMethod (API planejada)
│   responses/       tipos de saída da API (AuthResponse, ListingCard, …)
├── mappers/         transformações form → payload API
└── enums.ts         UserRole, ReservationStatus
```

Exemplo na API:

```typescript
import { loginSchema, type LoginInput } from '@seanb/shared';
import { ZodBody } from '../common/pipes/zod-validation.pipe';

@Post('login')
login(@ZodBody(loginSchema) dto: LoginInput) { … }
```

Exemplo no frontend:

```typescript
import { loginSchema } from '@seanb/shared';

const formSchema = loginSchema.extend({ remember: z.boolean() });
```

---

## Modelo de dados

### User (roles)

| Role | Alugar | Publicar barcos |
|------|--------|-----------------|
| GUEST | ✅ | ❌ |
| HOST | ✅ | ✅ |
| ADMIN | ✅ | ✅ |

### Entidades principais

- **User** — auth, perfil, role, plano (HOST)
- **Plan** — Lite, Pro, Ultimate
- **Listing** — anúncio de barco
- **Reservation** — reserva (guest ↔ listing)
- **Review** — avaliação de listing

---

## Roadmap

### Fase 1: Base ✅
- [x] NestJS + Fastify + Prisma + PostgreSQL
- [x] Schema + migrations + seed
- [x] `@seanb/shared` com Zod

### Fase 2: Auth ✅
- [x] Register, login, `/auth/me` (JWT)
- [x] Integração no frontend
- [ ] OAuth social
- [ ] Forgot password (schema pronto; API pendente)

### Fase 3: Listings ✅ (parcial)
- [x] CRUD + filtros + integração front
- [x] Add-listing wizard
- [ ] Upload real de imagens

### Fase 4: Reservas ✅ (parcial)
- [x] CRUD reservas + booking form + calendário
- [ ] Pagamentos

### Fase 5: Extras
- [ ] Reviews API (`createReviewSchema` já no shared)
- [ ] Chat/Inbox (WebSockets)
- [ ] E-mails transacionais
- [ ] Upload S3/Cloudinary

---

## Integração frontend

| Arquivo | Função |
|---------|--------|
| `packages/boat/src/config/api-endpoints.ts` | URLs da API |
| `packages/boat/src/lib/api-client.ts` | HTTP + JWT |
| `packages/boat/src/lib/*-api.ts` | Chamadas por domínio |
| `@seanb/shared` | Schemas e tipos compartilhados |

Usuários de teste: `fabio@example.com` / `maria@example.com` — senha `password123`

---

## Stack

| Tecnologia | Versão |
|------------|--------|
| NestJS | 11 |
| Fastify | via @nestjs/platform-fastify |
| Prisma | 7 |
| PostgreSQL | 16 |
| Zod | 3.x (`@seanb/shared`) |
| TypeScript | 5.x |
