FROM node:20-alpine AS base
RUN corepack enable pnpm
WORKDIR /app

# ─── Development ─────────────────────────────────────────
FROM base AS development
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm db:generate
CMD ["pnpm", "dev"]

# ─── Builder ─────────────────────────────────────────────
FROM base AS builder
COPY package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm db:generate
RUN pnpm build

# ─── Production ──────────────────────────────────────────
FROM node:20-alpine AS production
RUN corepack enable pnpm
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
