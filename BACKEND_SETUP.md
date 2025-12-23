# 🚀 Guia de Setup do Backend NestJS no Monorepo

## ✅ Recomendação: **ADICIONAR NO MONOREPO**

A estrutura atual usa **Lerna + Yarn Workspaces**, que é perfeita para incluir o backend NestJS.

---

## 📁 Estrutura Recomendada

```
tripfinder/
├── packages/
│   ├── boat/          (Frontend - já existe)
│   └── api/           (Backend NestJS - NOVO) ✨
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── boats/
│       │   ├── auth/
│       │   ├── users/
│       │   └── ...
│       ├── package.json
│       ├── tsconfig.json
│       ├── nest-cli.json
│       └── .env
├── package.json       (root - já existe)
├── lerna.json         (já existe)
└── yarn.lock
```

---

## 🔧 Passo a Passo para Implementação

### 1. Criar o projeto NestJS dentro do monorepo

```bash
# No diretório packages/
cd packages
npx @nestjs/cli new api
# Ou criar manualmente a estrutura
```

### 2. Configurar o package.json do backend

```json
{
  "name": "@tripfinder/api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "nest start",
    "dev": "nest start --watch",
    "build": "nest build",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@types/node": "^20.3.1",
    "typescript": "^5.1.3"
  }
}
```

### 3. Atualizar scripts do package.json raiz

Adicionar ao `package.json` raiz:

```json
{
  "scripts": {
    // ... scripts existentes
    "start:api": "yarn workspace @tripfinder/api run dev",
    "build:api": "yarn workspace @tripfinder/api run build",
    "start:all": "concurrently \"yarn start:api\" \"yarn start:boat\""
  },
  "devDependencies": {
    // ... dependências existentes
    "concurrently": "^8.2.0"  // Para rodar front e back juntos
  }
}
```

### 4. Compartilhar tipos TypeScript (Opcional mas Recomendado)

Criar um package compartilhado para tipos:

```
packages/
└── shared/
    └── types/
        ├── boat.types.ts
        ├── user.types.ts
        └── index.ts
```

E referenciar nos package.json:

```json
{
  "dependencies": {
    "@tripfinder/shared": "workspace:*"
  }
}
```

---

## ⚙️ Configuração de Ambiente

### Variáveis de Ambiente (.env no backend)

```env
# packages/api/.env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/tripfinder
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Atualizar api-endpoints.ts no frontend

```typescript
// packages/boat/src/config/api-endpoints.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  TOP_DESTINATIONS: `${API_BASE_URL}/api/destinations`,
  BOATS: `${API_BASE_URL}/api/boats`,
  TOP_BOATS: `${API_BASE_URL}/api/boats/top`,
  NEW_BOATS: `${API_BASE_URL}/api/boats/new`,
  TESTIMONIALS: `${API_BASE_URL}/api/testimonials`,
  LISTING_DETAILS: (slug: string) => `${API_BASE_URL}/api/boats/${slug}`,
  RELATED_BOATS: (slug: string) => `${API_BASE_URL}/api/boats/${slug}/related`,
  REVIEWS: (slug: string) => `${API_BASE_URL}/api/boats/${slug}/reviews`,
};
```

---

## 📦 Vantagens desta Abordagem

✅ **Code Sharing**: Compartilhar tipos TypeScript entre frontend e backend  
✅ **Desenvolvimento Simplificado**: Um único `yarn install` instala tudo  
✅ **Versionamento Coordenado**: Mudanças na API sincronizadas com o frontend  
✅ **CI/CD Unificado**: Build e deploy de todo o projeto junto  
✅ **Refatoração Segura**: IDEs ajudam a encontrar usos em todo o monorepo  

---

## 🔄 Quando Manter Separado?

Só considere projeto separado se:

❌ Equipes completamente diferentes trabalhando isoladamente  
❌ Deploy em servidores/plataformas completamente diferentes  
❌ Ciclos de release independentes  
❌ Não há necessidade de compartilhar código  

**Para o seu caso (projeto comprado, desenvolvimento próprio): NÃO recomendado separar!**

---

## 🚀 Comandos Úteis Após Setup

```bash
# Instalar todas as dependências (raiz + todos os packages)
yarn

# Rodar backend apenas
yarn start:api

# Rodar frontend boat apenas
yarn start:boat

# Rodar ambos simultaneamente (com concurrently)
yarn start:all

# Build de produção de tudo
yarn build:api
yarn build:boat

# Lint em tudo
yarn lint:boat
# (adicionar yarn lint:api depois)
```

---

## 📝 Próximos Passos Recomendados

1. ✅ Criar estrutura básica do NestJS
2. ✅ Configurar banco de dados (PostgreSQL recomendado)
3. ✅ Criar módulos principais:
   - `boats` - CRUD de barcos
   - `auth` - Autenticação (JWT)
   - `users` - Gestão de usuários
   - `reviews` - Sistema de avaliações
   - `reservations` - Sistema de reservas
4. ✅ Integrar com o frontend (substituir dados estáticos)
5. ✅ Configurar CORS para permitir comunicação frontend ↔ backend

---

## 💡 Dica Extra

Considere usar **Nx** no futuro se o projeto crescer muito. Nx oferece:
- Caching inteligente de builds
- Graph de dependências
- Testes afetados apenas por mudanças relevantes
- Melhor performance em monorepos grandes

Mas para começar, Lerna + Yarn Workspaces é perfeito! 🎯

