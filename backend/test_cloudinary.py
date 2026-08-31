import pytest
from core.cloudinary_client import upload_avatar, delete_media
from core.config import settings

def test_cloudinary_config_loaded():
    assert settings.CLOUDINARY_CLOUD_NAME == "f7jln1n3"
    assert settings.CLOUDINARY_API_KEY == "135983336557933"
    assert settings.CLOUDINARY_API_SECRET != ""

def test_cloudinary_avatar_upload_and_delete():
    # 1x1 white pixel GIF base64 string
    sample_base64 = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    
    result = upload_avatar(sample_base64, public_id="test_avatar_sample")
    assert result is not None
    assert "secure_url" in result
    assert "res.cloudinary.com" in result["secure_url"]
    assert result["public_id"] == "jaradeck/avatars/test_avatar_sample"

    # Clean up asset after upload test
    deleted = delete_media("jaradeck/avatars/test_avatar_sample")
    assert deleted is True
