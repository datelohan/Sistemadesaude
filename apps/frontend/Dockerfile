FROM node:20-alpine AS base
RUN corepack enable pnpm
WORKDIR /app

# ─── Development ─────────────────────────────────────────
FROM base AS development
COPY package.json ./
RUN pnpm install
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev"]

# ─── Builder ─────────────────────────────────────────────
FROM base AS builder
COPY package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ─── Production ──────────────────────────────────────────
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
