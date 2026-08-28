from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    country: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLogin(BaseModel):
    credential: Optional[str] = None
    access_token: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None  # 'customer' or 'worker'

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    auth_provider: str
    is_verified: Optional[bool] = False

# OTP Verification models
class OTPVerify(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)

class ResendOTP(BaseModel):
    email: EmailStr

class RegisterResponse(BaseModel):
    message: str
    email: str
