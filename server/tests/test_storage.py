import pytest

from app.core.config import get_settings
from app.storage.service import public_url

# The base URL starts empty in every test (see `root_relative_asset_urls` in conftest.py).


def test_public_url_is_root_relative_without_base() -> None:
    assert public_url("images/phone/red.png") == "/images/phone/red.png"


def test_public_url_joins_base_without_double_slash(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(get_settings(), "assets_base_url", "https://cdn.example.com/")

    assert public_url("/images/phone/red.png") == "https://cdn.example.com/images/phone/red.png"
