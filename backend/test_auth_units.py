import pytest
from db.models import UserRegister, GoogleLogin, UserResponse, strip_sensitive_fields

def test_user_register_first_last_name():
    """Verify UserRegister accepts first_name and last_name."""
    user = UserRegister(
        email="lagbaja@example.com",
        first_name="Lagbaja",
        last_name="Tamedo",
        full_name="Lagbaja Tamedo"
    )
    assert user.first_name == "Lagbaja"
    assert user.last_name == "Tamedo"
    assert user.full_name == "Lagbaja Tamedo"
    assert user.email == "lagbaja@example.com"

def test_google_login_model():
    """Verify GoogleLogin model supports first_name and last_name."""
    guser = GoogleLogin(
        email="googleuser@example.com",
        first_name="Emmanuel",
        last_name="Diya",
        full_name="Emmanuel Diya",
        credential="fake_token"
    )
    assert guser.first_name == "Emmanuel"
    assert guser.last_name == "Diya"
    assert guser.credential == "fake_token"

def test_user_response_model():
    """Verify UserResponse serializes first_name, last_name, and full_name correctly."""
    resp = UserResponse(
        id="123e4567-e89b-12d3-a456-426614174000",
        email="test@example.com",
        first_name="Jane",
        last_name="Doe",
        full_name="Jane Doe",
        auth_provider="local",
        is_verified=True
    )
    assert resp.first_name == "Jane"
    assert resp.last_name == "Doe"
    assert resp.full_name == "Jane Doe"
    assert resp.is_verified is True

def test_strip_sensitive_fields():
    """Verify sensitive fields like password_hash and failed_otp_attempts are stripped."""
    raw_user = {
        "id": "abc-123",
        "email": "user@test.com",
        "first_name": "John",
        "last_name": "Smith",
        "full_name": "John Smith",
        "password_hash": "$2b$12$hashedpassword",
        "failed_otp_attempts": 3,
        "otp_locked_until": "2026-08-30T22:00:00Z"
    }
    cleaned = strip_sensitive_fields(raw_user)
    assert "password_hash" not in cleaned
    assert "failed_otp_attempts" not in cleaned
    assert "otp_locked_until" not in cleaned
    assert cleaned["first_name"] == "John"
    assert cleaned["last_name"] == "Smith"
    assert cleaned["full_name"] == "John Smith"
