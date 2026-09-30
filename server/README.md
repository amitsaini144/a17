# a17 server

FastAPI backend for the a17 store: Python 3.12+, SQLAlchemy 2.0 (async), PostgreSQL, Alembic, managed with [uv](https://docs.astral.sh/uv/).

## Run locally

Requires a running PostgreSQL with the `a17` role and databases (see the [root README](../README.md)).

```bash
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run python -m app.seed
uv run fastapi dev src/app/main.py
```

- API: http://localhost:8000/api/v1
- Interactive docs: http://localhost:8000/docs
- Health: `GET /api/v1/health` (liveness), `GET /api/v1/health/ready` (checks the database)

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/categories` | All categories |
| GET | `/api/v1/categories/{slug}` | Category with its feature highlights |
| GET | `/api/v1/products` | Paginated products. Query: `category`, `featured`, `q`, `limit`, `offset` |
| GET | `/api/v1/products/{slug}` | Product detail with gallery |
| GET | `/api/v1/products/{slug}/related` | Related products (same category first). Query: `limit` |

Money is returned as integer `price_cents` plus `currency`.

## Layout

```
src/app/
  core/       config, database, logging, exceptions
  shared/     base model mixins, pagination schema
  storage/    asset key → public URL
  catalog/    models · schemas · repository · service · router
  seed/       idempotent seed (`python -m app.seed`) from catalog.json
alembic/      migrations
tests/        pytest (real PostgreSQL)
```

Each feature follows **router → service → repository**: routers handle HTTP only, services hold
business rules and return Pydantic schemas, repositories own all database queries.

## Database migrations

```bash
uv run alembic revision --autogenerate -m "describe change"   # review the generated file!
uv run alembic upgrade head
uv run alembic check                                            # models and migrations in sync?
```

## Quality checks

```bash
uv run ruff check . && uv run ruff format --check .
uv run mypy src
uv run pytest
```

Tests use a separate database, `postgresql+asyncpg://a17:a17@localhost:5432/a17_test` by default
(override with the `TEST_DATABASE_URL` environment variable). Its schema is recreated on every run,
so the suite refuses to run unless the database name ends with `_test`.
