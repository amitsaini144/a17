"""Password hashing and token primitives. No HTTP or database concerns live here."""

import asyncio
import hashlib
import secrets
from datetime import datetime, timedelta

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

# argon2id with OWASP's lower-memory profile (19 MiB, 2 passes) instead of the library default
# (64 MiB): the API runs on a 512 MB instance, and each concurrent hash holds that memory.
_hasher = PasswordHasher(time_cost=2, memory_cost=19 * 1024, parallelism=1)

# Hashing is deliberately slow CPU work: run it off the event loop, and cap how many run at once
# so a burst of logins can't exhaust memory or starve other requests.
_hashing_slots = asyncio.Semaphore(4)

# Verified against when the account doesn't exist, so a login for an unknown email takes as long
# as one for a known email and response times don't reveal which emails are registered.
_DUMMY_HASH = _hasher.hash(secrets.token_urlsafe(16))

_JWT_ALGORITHM = "HS256"


async def hash_password(password: str) -> str:
    async with _hashing_slots:
        return await asyncio.to_thread(_hasher.hash, password)


async def verify_password(password_hash: str | None, password: str) -> bool:
    """Check `password` against `password_hash`; `None` (no such user) always fails."""

    def verify() -> bool:
        try:
            return _hasher.verify(password_hash or _DUMMY_HASH, password) and bool(password_hash)
        except (VerificationError, InvalidHashError):
            return False

    async with _hashing_slots:
        return await asyncio.to_thread(verify)


def password_needs_rehash(password_hash: str) -> bool:
    """True when the hash was made with older parameters and should be upgraded on login."""
    return _hasher.check_needs_rehash(password_hash)


def create_access_token(*, subject: str, secret: str, issued_at: datetime, ttl: timedelta) -> str:
    claims = {"sub": subject, "iat": issued_at, "exp": issued_at + ttl}
    return jwt.encode(claims, secret, algorithm=_JWT_ALGORITHM)


def decode_access_token(token: str, *, secret: str) -> str | None:
    """Return the token's subject, or `None` if it is malformed, tampered with or expired."""
    try:
        claims = jwt.decode(
            token, secret, algorithms=[_JWT_ALGORITHM], options={"require": ["sub", "exp", "iat"]}
        )
    except jwt.InvalidTokenError:
        return None
    subject = claims["sub"]
    return subject if isinstance(subject, str) else None


def generate_refresh_token() -> str:
    return secrets.token_urlsafe(32)


def hash_refresh_token(token: str) -> str:
    """SHA-256 is enough here (unlike for passwords): the token is 256 bits of randomness, so it
    can't be brute-forced, and a fast hash keeps the lookup by hash cheap."""
    return hashlib.sha256(token.encode()).hexdigest()
