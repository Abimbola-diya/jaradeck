# routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from db.database import supabase
from db.models import ProfileUpdate, UserResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@router.patch("/profile", response_model=UserResponse)
async def update_profile(
    payload: ProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update."
        )

    try:
        result = (
            supabase.table("users")
            .update(update_data)
            .eq("id", current_user["id"])
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
            
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")