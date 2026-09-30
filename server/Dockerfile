# ---- build: resolve and install dependencies with uv ----
FROM python:3.13-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:0.12 /uv /bin/uv
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy UV_PYTHON_DOWNLOADS=never
WORKDIR /app

# Dependencies first, so this layer is cached until pyproject.toml/uv.lock change.
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY . .
RUN uv sync --frozen --no-dev

# ---- runtime: slim image, non-root user ----
FROM python:3.13-slim AS runtime
RUN useradd --create-home --uid 1000 app
WORKDIR /app
COPY --from=builder --chown=app:app /app /app
ENV PATH="/app/.venv/bin:$PATH" PYTHONUNBUFFERED=1
USER app
EXPOSE 8000

# Apply pending migrations, then serve. Hosts like Render inject $PORT; default to 8000.
CMD ["sh", "-c", "alembic upgrade head && exec fastapi run src/app/main.py --host 0.0.0.0 --port ${PORT:-8000}"]
