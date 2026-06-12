# 🚀 Guia de Setup do Backend NestJS no Monorepo

## ✅ Estado Atual

O backend está configurado com:
- **NestJS 11** + **Fastify** (não Express)
- **Prisma 7** + **PostgreSQL**
- **Docker** para o banco (container `seanb-postgres`, porta 5433)
- API rodando na **porta 3333**

---

## 📁 Estrutura Atual

```
SeanB/
├── packages/
│   ├── boat/          (Frontend Next.js)
│   └── api/           (Backend NestJS)
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── prisma.config.ts
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── prisma/
│       │   │   ├── prisma.module.ts
│       │   │   └── prisma.service.ts
│       │   └── ...
│       └── package.json
├── package.json       (root - Turbo + Yarn Workspaces)
└── yarn.lock
```

---

## ⚙️ Configuração de Ambiente

### Variáveis de Ambiente

Copie o exemplo e ajuste apenas se necessário:

```bash
cp packages/api/.env.example packages/api/.env
```

```env
# packages/api/.env
DATABASE_URL="postgresql://tripfinder:tripfinder_secret@localhost:5433/tripfinder"
PORT=3333
JWT_SECRET=super-secret-change-in-production
```

| Variável       | Valor (desenvolvimento)                                      |
|----------------|--------------------------------------------------------------|
| `DATABASE_URL` | `postgresql://tripfinder:tripfinder_secret@localhost:5433/tripfinder` |
| `PORT`         | `3333`                                                       |
| `JWT_SECRET`   | trocar em produção                                           |

### Docker (PostgreSQL)

Credenciais alinhadas com `docker-compose.yml`:

| Campo    | Valor              |
|----------|--------------------|
| Usuário  | `tripfinder`       |
| Senha    | `tripfinder_secret`|
| Banco    | `tripfinder`       |
| Container| `seanb-postgres`   |
| Porta    | `5433` (host)      |

```bash
# Recomendado: subir via docker-compose (na raiz do monorepo)
docker-compose up -d

# Alternativa manual (mesmas credenciais do compose)
docker run -d --name seanb-postgres \
  -e POSTGRES_USER=tripfinder \
  -e POSTGRES_PASSWORD=tripfinder_secret \
  -e POSTGRES_DB=tripfinder \
  -p 5433:5432 \
  postgres:16-alpine
```

---

## 🚀 Comandos

```bash
# Instalar dependências
yarn

# Rodar API
yarn dev:api

# Rodar frontend
yarn dev:boat

# Rodar ambos (Turbo executa em paralelo)
yarn dev

# Prisma (dentro de packages/api)
cd packages/api
npx prisma migrate dev    # Rodar migrations
npx prisma generate       # Gerar client
npx prisma studio         # UI do banco
```

---

## 📊 Modelo de Dados (Planejado)

### User (com roles)

| Role   | Pode alugar | Pode publicar barcos |
|--------|-------------|----------------------|
| GUEST  | ✅          | ❌                   |
| HOST   | ✅          | ✅                   |
| ADMIN  | ✅          | ✅                   |

**Host pode alugar** barcos de outros (como Guest). Um único usuário, dois papéis conforme o contexto.

### Entidades

```
User
├── id, email, name, avatar, ...
├── role: GUEST | HOST | ADMIN
├── planId (FK) → só para HOST
└── createdAt, updatedAt

Plan (planos para Hosts)
├── id, name (Lite, Pro, Ultimate)
├── maxListings, priceMonthly, priceYearly
└── features

Listing (barco/anúncio)
├── id, slug, title, description, price
├── userId (owner, deve ser HOST)
├── location, coordinates, images
├── equipment, specifications
└── ...

Reservation
├── id, listingId, guestId, hostId
├── checkIn, checkOut, totalPrice
├── status: PENDING | CONFIRMED | CANCELLED | COMPLETED
└── ...

Review
├── id, listingId, userId
├── rating, comment, date
└── ...
```

---

## 📝 Roadmap de Implementação

### Fase 1: Base ✅
- [x] NestJS + Fastify
- [x] Prisma + PostgreSQL
- [x] Schema completo (User, Plan, Listing, Reservation, Review)
- [x] db push (schema aplicado)
- [x] Seed (planos, usuários, listings, reviews)

### Fase 2: Auth ✅
- [x] POST `/auth/register`
- [x] POST `/auth/login` → JWT
- [x] GET `/auth/me` (protegido)
- [x] JWT Guard e estratégia
- [x] ValidationPipe + CORS
- [x] Integrar frontend (sign-in, sign-up, sessão JWT)
- [ ] OAuth social (Facebook/Google/Apple) — desabilitado no front até implementar

### Fase 3: Listings ✅ (parcial)
- [x] GET `/listings` (listar, filtros)
- [x] GET `/listings/:slug` (detalhe + reviews)
- [x] POST `/listings` (só HOST/ADMIN)
- [x] PATCH/DELETE `/listings/:id` (dono ou ADMIN)
- [x] Integrar frontend (home, explore, detalhe, wishlist, perfil)
- [ ] Integrar add-listing wizard com POST `/listings`
- [ ] Upload real de imagens (hoje URLs locais)

### Fase 4: Reservas
- [ ] POST `/reservations`
- [ ] GET `/reservations` (minhas reservas)
- [ ] PATCH `/reservations/:id` (cancelar, etc.)
- [ ] Integrar frontend

### Fase 5: Extras
- [ ] Reviews (API dedicada)
- [ ] Chat/Inbox — **WebSockets** (ver nota abaixo)
- [ ] Pagamentos (Stripe ou similar)
- [ ] E-mails transacionais (reset de senha, confirmação de reserva)
- [ ] Upload de imagens (S3/Cloudinary)

#### Chat em produção (planejado)

O inbox do frontend hoje usa dados estáticos. Para produção, a abordagem recomendada:

1. **NestJS Gateway** (`@nestjs/websockets` + Socket.IO ou `ws`)
2. **Modelos Prisma**: `Conversation`, `Message` (participantes, `listingId` opcional)
3. **Autenticação WS**: validar JWT no handshake (`auth.token` no Socket.IO)
4. **Persistência**: salvar mensagens no PostgreSQL; WS só para tempo real
5. **Fallback**: polling ou SSE se WS estiver bloqueado em alguma rede

Alternativa gerenciada (menos código): Pusher, Ably ou Supabase Realtime — avaliar custo vs controle.

---

## 🔗 Integração Frontend

### Auth (implementado)

- `packages/boat/src/config/api-endpoints.ts` — URLs da API
- `packages/boat/src/lib/api-client.ts` — cliente HTTP com JWT
- `packages/boat/src/lib/auth-api.ts` — login, register, me
- `packages/boat/src/stores/auth-store.ts` — sessão persistida (Zustand)

```bash
# packages/boat/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Usuários de teste (após `prisma db seed`): `fabio@example.com` / `maria@example.com` — senha `password123`

---

## 📦 Stack Técnica

| Tecnologia | Versão |
|------------|--------|
| NestJS     | 11     |
| Fastify    | via @nestjs/platform-fastify |
| Prisma     | 7      |
| PostgreSQL | 16     |
| TypeScript | 5.x    |

---

## 💡 Dica

Considere **Nx** no futuro se o projeto crescer muito. Para começar, Turbo + Yarn Workspaces é suficiente.
