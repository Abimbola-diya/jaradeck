from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
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
    token_type: str
    user: dict

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    country: Optional[str] = None
    phone: Optional[str] = None
    auth_provider: str
