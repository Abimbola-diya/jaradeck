from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def read_root():
    return {
        "status": "online",
        "message": "JaraDeck API is running smoothly.",
        "version": "1.0.0",
    }


@router.get("/health")
@router.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JaraDeck API",
    }