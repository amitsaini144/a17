from pydantic import BaseModel


class Page[T](BaseModel):
    """Offset-paginated collection."""

    items: list[T]
    total: int
    limit: int
    offset: int
