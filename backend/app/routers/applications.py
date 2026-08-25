from typing import Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.database import supabase


router = APIRouter()


class TalentApplication(BaseModel):
    formData: Dict[str, str]
    selectedSkills: List[str]
    selectedSubSkills: List[str]
    proofLinks: Dict[str, str]
    payingExperience: str
    fitAnswer: str


@router.post("/api/apply")
def submit_talent_application(application: TalentApplication):
    data = {
        "name": application.formData.get("name", "").strip().title(),
        "university": application.formData.get("university", ""),
        "level": application.formData.get("level", ""),
        "phone": application.formData.get("phone", ""),
        "email": application.formData.get("email", ""),
        "selected_skills": application.selectedSkills,
        "selected_sub_skills": application.selectedSubSkills,
        "proof_links": application.proofLinks,
        "paying_experience": application.payingExperience,
        "fit_answer": application.fitAnswer,
    }

    try:
        supabase.table("talent_applications").insert(data).execute()

        return {
            "success": True,
            "message": "Application submitted successfully!",
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))