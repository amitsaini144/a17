from httpx import AsyncClient

from app.core.timing import RequestTimings


def parse_server_timing(value: str) -> dict[str, dict[str, str]]:
    """`db;dur=1.2;desc="3 queries", total;dur=4.5` → {"db": {"dur": "1.2", ...}, ...}."""
    metrics: dict[str, dict[str, str]] = {}
    for entry in value.split(","):
        name, *params = (part.strip() for part in entry.split(";"))
        metrics[name] = {k: v.strip('"') for k, v in (p.split("=", 1) for p in params)}
    return metrics


async def test_request_without_queries_reports_no_db_time(client: AsyncClient) -> None:
    response = await client.get("/api/v1/health")

    metrics = parse_server_timing(response.headers["server-timing"])
    assert metrics["db"] == {"dur": "0.0", "desc": "0 queries"}
    assert float(metrics["total"]["dur"]) >= float(metrics["app"]["dur"]) >= 0


async def test_database_queries_are_counted_and_timed(client: AsyncClient) -> None:
    response = await client.get("/api/v1/health/ready")

    metrics = parse_server_timing(response.headers["server-timing"])
    # Not an exact count: the test session's SAVEPOINT is a statement too.
    assert int(metrics["db"]["desc"].split()[0]) >= 1
    assert float(metrics["db"]["dur"]) > 0
    assert float(metrics["total"]["dur"]) >= float(metrics["db"]["dur"])


async def test_timings_do_not_leak_between_requests(client: AsyncClient) -> None:
    await client.get("/api/v1/health/ready")
    response = await client.get("/api/v1/health")

    metrics = parse_server_timing(response.headers["server-timing"])
    assert metrics["db"]["desc"] == "0 queries"


def test_header_excludes_database_time_from_app_time() -> None:
    timings = RequestTimings(db_connect_ms=30.0, db_query_ms=50.0, db_queries=2)

    metrics = parse_server_timing(timings.header_value(total_ms=100.0))

    assert metrics["db"] == {"dur": "50.0", "desc": "2 queries"}
    assert metrics["db-conn"]["dur"] == "30.0"
    assert metrics["app"] == {"dur": "20.0"}
    assert metrics["total"] == {"dur": "100.0"}
