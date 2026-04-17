.PHONY: dev down install db-migrate db-studio test lint

dev:
	docker compose up -d
	pnpm --filter backend dev & pnpm --filter frontend dev

down:
	docker compose down

install:
	pnpm install

db-migrate:
	pnpm --filter backend db:migrate

db-studio:
	pnpm --filter backend db:studio

test:
	pnpm -r test

lint:
	pnpm -r lint
