# models.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None
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
    role: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    is_onboarded: bool
    country: Optional[str] = None
    phone: Optional[str] = None
    one_liner: Optional[str] = None
    primary_skill: Optional[str] = None
    portfolio_url: Optional[str] = None
    avatar_url: Optional[str] = None
    auth_provider: str

class SendOTPRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class RoleUpdate(BaseModel):
    role: str = Field(..., pattern="^(customer|worker)$")

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    one_liner: Optional[str] = None
    primary_skill: Optional[str] = None
    portfolio_url: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    is_onboarded: Optional[bool] = None