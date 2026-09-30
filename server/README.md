# a17 server

FastAPI backend for the a17 store: Python 3.12+, SQLAlchemy 2.0 (async), PostgreSQL, Alembic, managed with [uv](https://docs.astral.sh/uv/).

## Run locally

```bash
# from repo root: start Postgres
docker compose up -d db

# from server/
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run fastapi dev src/app/main.py
```

- API: http://localhost:8000/api/v1
- Interactive docs: http://localhost:8000/docs
- Health: `GET /api/v1/health` (liveness), `GET /api/v1/health/ready` (checks the database)

## Quality checks

```bash
uv run ruff check . && uv run ruff format --check .
uv run mypy src
uv run pytest
```
