from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str | None = None
    role: str = "customer"
    phone: str | None = None
    avatar_url: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None