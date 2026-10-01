from typing import Annotated

from pydantic import AfterValidator, BaseModel, EmailStr, Field

PASSWORD_MIN_LENGTH = 8
# Long passphrases are welcome; the cap only bounds the work of hashing a hostile input.
PASSWORD_MAX_LENGTH = 128


def _normalize_email(email: str) -> str:
    return email.strip().lower()


Email = Annotated[EmailStr, AfterValidator(_normalize_email)]


class RegisterRequest(BaseModel):
    email: Email
    # Length is the only rule (NIST SP 800-63B): composition rules don't make passwords stronger.
    password: str = Field(min_length=PASSWORD_MIN_LENGTH, max_length=PASSWORD_MAX_LENGTH)


class LoginRequest(BaseModel):
    email: Email
    # No minimum: an old, shorter password must still get the generic "invalid" answer.
    password: str = Field(min_length=1, max_length=PASSWORD_MAX_LENGTH)


class UserRead(BaseModel):
    email: str
