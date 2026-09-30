from app.core.config import get_settings


def public_url(key: str) -> str:
    """Build the public URL for a stored asset key, e.g. `images/phone/iphoneRed.png`."""
    base = get_settings().assets_base_url.rstrip("/")
    return f"{base}/{key.lstrip('/')}"
