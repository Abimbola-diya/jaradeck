from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.database import supabase


router = APIRouter()


class WaitlistSignup(BaseModel):
    name: str
    contactSelected: List[str]
    contacts: Dict[str, str]
    role: str
    roleOther: Optional[str] = ""
    tasksSelected: List[str]
    tasksOther: Optional[str] = ""
    frequency: str


@router.post("/api/waitlist")
def join_waitlist(signup: WaitlistSignup):
    data = {
        "name": signup.name,
        "contact_selected": signup.contactSelected,
        "contacts": signup.contacts,
        "role": signup.role,
        "role_other": signup.roleOther,
        "tasks_selected": signup.tasksSelected,
        "tasks_other": signup.tasksOther,
        "frequency": signup.frequency,
    }

    try:
        supabase.table("waitlist_submissions").insert(data).execute()

        return {
            "message": "Successfully joined the JaraDeck waitlist. Welcome aboard!",
            "already_exists": False,
        }

    except Exception as e:
        if "duplicate key value" in str(e).lower() or "already exists" in str(e).lower():
            return {
                "message": "You are already on the waitlist!",
                "already_exists": True,
            }

        raise HTTPException(status_code=400, detail=str(e))