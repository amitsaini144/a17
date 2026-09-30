import pytest

from app.core.config import get_settings
from app.storage.service import public_url


@pytest.fixture
def assets_base_url(monkeypatch: pytest.MonkeyPatch) -> pytest.MonkeyPatch:
    monkeypatch.setattr(get_settings(), "assets_base_url", "")
    return monkeypatch


def test_public_url_is_root_relative_without_base(assets_base_url: pytest.MonkeyPatch) -> None:
    assert public_url("images/phone/red.png") == "/images/phone/red.png"


def test_public_url_joins_base_without_double_slash(assets_base_url: pytest.MonkeyPatch) -> None:
    assets_base_url.setattr(get_settings(), "assets_base_url", "https://cdn.example.com/")

    assert public_url("/images/phone/red.png") == "https://cdn.example.com/images/phone/red.png"
