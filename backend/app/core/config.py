import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")


SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("DIRECT_URL")


if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError(
        "Missing required environment variables: "
        "SUPABASE_URL and SUPABASE_ANON_KEY must be set."
    )