import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import logging
from core.config import settings

logger = logging.getLogger(__name__)

# Configure Cloudinary securely from settings
def init_cloudinary():
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )

init_cloudinary()


def upload_avatar(file_source, public_id: str = None) -> dict:
    """
    Uploads a profile picture / avatar to Cloudinary.
    - Accepts file bytes, base64 data string, or URL.
    - Applies auto format, auto quality, and square face-gravity crop.
    - Returns dict with secure_url, public_id, format, width, height.
    """
    options = {
        "folder": "jaradeck/avatars",
        "resource_type": "image",
        "transformation": [
            {"width": 500, "height": 500, "crop": "fill", "gravity": "face"},
            {"fetch_format": "auto", "quality": "auto"}
        ]
    }
    
    if public_id:
        options["public_id"] = public_id
        options["overwrite"] = True

    try:
        result = cloudinary.uploader.upload(file_source, **options)
        return {
            "secure_url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height"),
            "bytes": result.get("bytes")
        }
    except Exception as e:
        logger.error(f"Cloudinary avatar upload failed: {str(e)}")
        raise e


def upload_document(file_source, folder: str = "jaradeck/documents", public_id: str = None) -> dict:
    """
    Uploads document assets or general media files to Cloudinary.
    """
    options = {
        "folder": folder,
        "resource_type": "auto"
    }
    
    if public_id:
        options["public_id"] = public_id
        options["overwrite"] = True

    try:
        result = cloudinary.uploader.upload(file_source, **options)
        return {
            "secure_url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "bytes": result.get("bytes")
        }
    except Exception as e:
        logger.error(f"Cloudinary document upload failed: {str(e)}")
        raise e


def delete_media(public_id: str) -> bool:
    """
    Deletes an asset from Cloudinary using its public_id.
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception as e:
        logger.error(f"Failed to delete Cloudinary media {public_id}: {str(e)}")
        return False
