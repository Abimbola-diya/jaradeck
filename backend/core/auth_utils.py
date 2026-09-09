import os
import random

from datetime import datetime, timedelta, timezone
import jwt

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


def generate_otp() -> str:
    """Generates a secure 6-digit numeric OTP."""
    return f"{random.randint(0, 999999):06d}"


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Generates a signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def send_otp_email(email: str, code: str) -> None:
    """
    Sends the OTP email.
    Replace print with your provider (Nodemailer, SendGrid, Resend, AWS SES, etc.).
    """
    print(f"[EMAIL SERVICE] Sending OTP {code} to {email}")