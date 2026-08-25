from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class ApplicationBase(BaseModel):
    title: str
    description: str
    budget: Decimal | None = None
    deadline: datetime | None = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    budget: Decimal | None = None
    deadline: datetime | None = None
    status: str | None = None


class Application(ApplicationBase):
    id: UUID
    customer_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime