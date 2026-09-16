from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal

# ──────────────────────────────────────────────────────────────────────────────
# Security helpers
# ──────────────────────────────────────────────────────────────────────────────

SENSITIVE_USER_FIELDS = {
    "password_hash", "failed_otp_attempts", "otp_locked_until",
}

def strip_sensitive_fields(user: dict) -> dict:
    """Return a copy of the user dict with sensitive fields removed."""
    return {k: v for k, v in user.items() if k not in SENSITIVE_USER_FIELDS}


# ──────────────────────────────────────────────────────────────────────────────
# Auth models
# ──────────────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    password: Optional[str] = Field(None, min_length=6)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleLogin(BaseModel):
    credential: Optional[str] = None
    access_token: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    picture: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[str] = None  # 'customer' | 'worker'


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    auth_provider: str
    is_verified: Optional[bool] = False
    avatar_url: Optional[str] = None
    picture: Optional[str] = None


class OTPVerify(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)


class ResendOTP(BaseModel):
    email: EmailStr


class RegisterResponse(BaseModel):
    message: str
    email: str


# ──────────────────────────────────────────────────────────────────────────────
# Slim client profile embedded in project responses
# ──────────────────────────────────────────────────────────────────────────────

class SlimUser(BaseModel):
    id: str
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None


# ──────────────────────────────────────────────────────────────────────────────
# Project models
# ──────────────────────────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    """Posted by a customer (or admin on their behalf) to open a new job."""
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    budget: Optional[Decimal] = Field(None, ge=0)
    deadline_at: Optional[datetime] = None


class ProjectAssign(BaseModel):
    """Admin endpoint: assign a worker to a pending project."""
    worker_id: str


class ProjectStatusUpdate(BaseModel):
    """Move a project through its lifecycle."""
    status: str = Field(..., pattern="^(pending|active|completed|cancelled)$")


class ProjectResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    status: str
    budget: Optional[Decimal] = None
    amount_paid: Decimal = Decimal("0")
    started_at: Optional[datetime] = None
    deadline_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    # Embedded related data
    customer: Optional[SlimUser] = None
    worker: Optional[SlimUser] = None
    unread_messages: Optional[int] = 0


class WorkerActivityStats(BaseModel):
    """Aggregated stats for the worker's Overall Activity section."""
    total_projects: int = 0
    active_projects: int = 0
    completed_projects: int = 0
    cancelled_projects: int = 0
    completion_rate: float = 0.0   # percentage 0–100
    average_rating: Optional[float] = None
    total_reviews: int = 0


class WorkerDashboardResponse(BaseModel):
    """Single response for GET /api/worker/dashboard — powers the home tab."""
    active_projects: List[ProjectResponse] = []
    activity: WorkerActivityStats
    recent_completed: List[ProjectResponse] = []


# ──────────────────────────────────────────────────────────────────────────────
# Project message (chat) models
# ──────────────────────────────────────────────────────────────────────────────

class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)


class MessageResponse(BaseModel):
    id: str
    project_id: str
    sender_id: str
    content: str
    is_read: bool
    created_at: Optional[datetime] = None
    sender: Optional[SlimUser] = None


# ──────────────────────────────────────────────────────────────────────────────
# Review models
# ──────────────────────────────────────────────────────────────────────────────

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: str
    project_id: str
    worker_id: str
    rating: int
    comment: Optional[str] = None
    created_at: Optional[datetime] = None
    reviewer: Optional[SlimUser] = None


# ──────────────────────────────────────────────────────────────────────────────
# Wallet models
# ──────────────────────────────────────────────────────────────────────────────

class TransactionResponse(BaseModel):
    id: str
    type: str        # 'credit' | 'debit' | 'withdrawal'
    amount: Decimal
    description: Optional[str] = None
    project_id: Optional[str] = None
    created_at: Optional[datetime] = None


class WalletResponse(BaseModel):
    id: str
    worker_id: str
    balance: Decimal
    total_earned: Decimal
    recent_transactions: List[TransactionResponse] = []
