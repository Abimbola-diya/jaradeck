import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env", override=True)
load_dotenv(dotenv_path=".env", override=True)

class Settings:
    PROJECT_NAME: str = "JaraDeck API"
    VERSION: str = "1.0.0"
    
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL") or os.getenv("DIRECT_URL") or ""
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")

    # Brevo Transactional Email
    BREVO_API_KEY: str = os.getenv("BREVO_API_KEY", "")
    OTP_SENDER_EMAIL: str = os.getenv("OTP_SENDER_EMAIL", "noreply@jaradeck.com")
    OTP_SENDER_NAME: str = os.getenv("OTP_SENDER_NAME", "Jaradeck")
    OTP_EXPIRY_MINUTES: int = 10
    OTP_MAX_RESENDS_PER_HOUR: int = 3
    OTP_MAX_ATTEMPTS: int = 5

settings = Settings()
