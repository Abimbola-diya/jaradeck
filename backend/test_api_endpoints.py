import pytest
from fastapi.testclient import TestClient
from main import app
from core.email import generate_otp

client = TestClient(app)

def test_generate_otp_length():
    """Verify generate_otp creates 6-digit numeric codes."""
    code = generate_otp(6)
    assert len(code) == 6
    assert code.isdigit()

def test_health_check_endpoint():
    """Verify API root / health check returns 200 OK."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_register_invalid_email_format():
    """Verify /api/auth/register rejects invalid email formats with 422 Unprocessable Entity."""
    payload = {
        "first_name": "Lagbaja",
        "last_name": "Tamedo",
        "email": "invalid-email-no-at-sign"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 422

def test_verify_otp_invalid_code_length():
    """Verify /api/auth/verify-otp rejects code that is not exactly 6 digits."""
    payload = {
        "email": "test@example.com",
        "code": "123"
    }
    response = client.post("/api/auth/verify-otp", json=payload)
    assert response.status_code == 422
