# a17

Full-stack e-commerce demo store for tech products.

| Folder | Stack |
|---|---|
| [`ui/`](ui/) | Next.js 14 (App Router), TypeScript, Tailwind CSS, framer-motion |
| [`server/`](server/) | FastAPI, SQLAlchemy 2.0 (async), PostgreSQL, Alembic, uv |

Planned integrations: Stripe Checkout (payments), AWS S3 + CloudFront (product images).

## Architecture

```
browser ──► Next.js (ui) ──/api/*──► FastAPI (server) ──► PostgreSQL
               │  rewrite proxy
               └─ static assets (/images/*; CloudFront in production)
```

The browser only talks to the Next.js origin; `/api/*` is proxied to FastAPI, so API calls
(and, later, auth cookies) are same-origin. The API stores image **keys** and returns public URLs
built from `ASSETS_BASE_URL`.

## Run locally

Prerequisites: Node 24, Yarn, Python 3.12+, [uv](https://docs.astral.sh/uv/), PostgreSQL 17
(a local install, or Docker via `docker compose up -d db`).

**1. Database** (once) — as a Postgres superuser:

```sql
CREATE ROLE a17 WITH LOGIN PASSWORD 'a17';
CREATE DATABASE a17 OWNER a17;
CREATE DATABASE a17_test OWNER a17;   -- used by the test suite
```

Using Docker instead? `docker compose up -d db` creates the role and `a17` database for you.

**2. Backend** → http://localhost:8000/docs

```bash
cd server
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run python -m app.seed        # loads the product catalog (safe to re-run)
uv run fastapi dev src/app/main.py
```

**3. Frontend** → http://localhost:3000 (API also reachable at http://localhost:3000/api/v1/...)

```bash
cd ui
yarn install
yarn dev
```

On Windows, if port 3000 fails with `EACCES`, it is reserved by the OS: use `yarn dev -p 3500`.

The frontend's API types (`ui/src/lib/api/schema.d.ts`) are generated from the backend's OpenAPI
schema. After changing an API response, regenerate them with the backend running:
`cd ui && yarn gen:api`.

## Deployment

| Part | Host | Config |
|---|---|---|
| Frontend | Vercel (root directory `ui`, Node 24) | env `API_URL` = backend URL |
| Backend | Render (Docker, free plan) | [`render.yaml`](render.yaml); env `DATABASE_URL` (secret) |
| Database | Neon Postgres | connection string pasted as-is into `DATABASE_URL` |

The backend container runs `alembic upgrade head` on every start, so deploys apply migrations
automatically. Render's health check (`/api/v1/health/ready`) keeps a new version from going live
if it can't reach the database.
