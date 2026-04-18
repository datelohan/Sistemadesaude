.PHONY: dev infra down install db-migrate db-seed db-studio test lint

# Sobe infra (MySQL, MinIO, etc.) + backend + frontend no host
dev: infra
	pnpm --filter backend dev & pnpm --filter frontend dev

# Só infra Docker (MySQL, MinIO, ElasticMQ, MailHog, Adminer)
infra:
	docker compose up -d

down:
	docker compose down

install:
	pnpm install

db-migrate:
	pnpm --filter backend db:migrate

db-seed:
	pnpm --filter backend db:seed

db-setup: db-migrate db-seed

db-studio:
	pnpm --filter backend db:studio

test:
	pnpm -r test

lint:
	eslint apps packages
