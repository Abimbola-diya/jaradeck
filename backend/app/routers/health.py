from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.services.user_service import get_or_create_user

router = APIRouter()


@router.get("/")
def read_root():
    return {
        "status": "online",
        "message": "JaraDeck API is running smoothly.",
        "version": "1.0.0",
    }


@router.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JaraDeck API",
    }


@router.get("/api/health/protected")
def protected_health(current_user=Depends(get_current_user)):
    return {
        "status": "authenticated",
        "user_id": str(current_user["id"]),
"email": current_user["email"],
    }


@router.get("/api/me")
def get_me(current_user=Depends(get_current_user)):
    user = get_or_create_user(current_user)

    return {
        "user": user,
    }