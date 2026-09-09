from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None  # Optional Since using OTP
    role: str = Field(default="pending", pattern="^(pending|customer|worker)$")
    country: Optional[str] = None
    phone: Optional[str] = None

class OnboardingCompletion(BaseModel):
    role: str = Field(..., pattern="^(customer|worker)$")
    country: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLogin(BaseModel):
    credential: str
    role: Optional[str] = None  # Required only if it's a new user and we need their role

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    is_onboarded: bool
    country: Optional[str] = None
    phone: Optional[str] = None
    auth_provider: str

from pydantic import BaseModel, EmailStr, Field


class SendOTPRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict