from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import logging

from core.cloudinary_client import upload_avatar, upload_document, delete_media

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/media", tags=["Media & Cloudinary Storage"])

class Base64UploadRequest(BaseModel):
    image_data: str  # Data URL or base64 string
    public_id: Optional[str] = None

@router.post("/upload-avatar")
async def upload_avatar_endpoint(
    file: Optional[UploadFile] = File(None),
    image_data: Optional[str] = Form(None)
):
    """
    Uploads a profile picture avatar to Cloudinary.
    Supports either multipart File upload or base64 Data URL string.
    Applies auto-format (WebP), auto-quality compression, and face-gravity cropping.
    """
    try:
        source = None
        if file:
            contents = await file.read()
            source = contents
        elif image_data:
            source = image_data
        else:
            raise HTTPException(status_code=400, detail="No file or image_data provided.")

        result = upload_avatar(source)
        return {
            "status": "success",
            "message": "Avatar uploaded successfully to Cloudinary.",
            "data": result
        }
    except Exception as e:
        logger.error(f"Avatar upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

@router.post("/upload-document")
async def upload_document_endpoint(
    file: UploadFile = File(...),
    folder: str = Form("jaradeck/documents")
):
    """
    Uploads document/file assets to Cloudinary.
    """
    try:
        contents = await file.read()
        result = upload_document(contents, folder=folder)
        return {
            "status": "success",
            "message": "Document uploaded successfully to Cloudinary.",
            "data": result
        }
    except Exception as e:
        logger.error(f"Document upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {str(e)}")

@router.delete("/delete")
async def delete_media_endpoint(public_id: str):
    """
    Deletes an asset from Cloudinary using its public_id.
    """
    success = delete_media(public_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete asset from Cloudinary.")
    return {"status": "success", "message": f"Asset {public_id} deleted successfully."}
