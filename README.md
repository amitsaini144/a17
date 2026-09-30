# a17

Full-stack e-commerce demo store for tech products.

| Folder | Stack |
|---|---|
| [`ui/`](ui/) | Next.js 14 (App Router), TypeScript, Tailwind CSS, framer-motion |
| [`server/`](server/) | FastAPI, SQLAlchemy 2.0 (async), PostgreSQL, Alembic, uv |

Planned integrations: Stripe Checkout (payments), AWS S3 + CloudFront (product images).

## Run locally

Prerequisites: Node 20+, Yarn, Python 3.12+, [uv](https://docs.astral.sh/uv/), Docker.

```bash
# 1. Database
docker compose up -d db

# 2. Backend  → http://localhost:8000/docs
cd server
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run fastapi dev src/app/main.py

# 3. Frontend → http://localhost:3000
cd ui
yarn install
yarn dev
```
