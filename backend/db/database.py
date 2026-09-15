import psycopg2
from supabase import create_client, Client
from core.config import settings

# Enforce required environment variables for administrative access
if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
    raise RuntimeError(
        "Missing required environment variables: SUPABASE_URL and SUPABASE_KEY must be set."
    )

# Use SUPABASE_KEY (service_role secret key) to bypass Row-Level Security
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def init_db():
    db_url = settings.DATABASE_URL
    if not db_url:
        print("No DATABASE_URL found in environment! Skipping database initialization.")
        return

    if "sslmode" not in db_url:
        if "?" in db_url:
            db_url += "&sslmode=require"
        else:
            db_url += "?sslmode=require"
            
    try:
        print("Connecting to Supabase PostgreSQL...")
        conn = psycopg2.connect(db_url, sslmode="require", connect_timeout=15)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS waitlist_submissions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                name TEXT NOT NULL,
                contact_selected JSONB NOT NULL,
                contacts JSONB NOT NULL,
                role TEXT NOT NULL DEFAULT 'pending',
                one_liner TEXT,
                avatar_url TEXT,
                tasks_selected JSONB NOT NULL,
                tasks_other TEXT,
                frequency TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                email TEXT UNIQUE NOT NULL
            );
            CREATE TABLE IF NOT EXISTS talent_applications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                name TEXT NOT NULL,
                university TEXT,
                level TEXT,
                phone TEXT,
                email TEXT NOT NULL,
                selected_skills JSONB,
                selected_sub_skills JSONB,
                proof_links JSONB,
                paying_experience TEXT,
                fit_answer TEXT
            );
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'pending',
                country TEXT,
                phone TEXT,
                is_onboarded BOOLEAN DEFAULT FALSE,
                auth_provider TEXT DEFAULT 'local',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("Successfully created/verified Supabase database tables on startup!")
    except Exception as e:
        print(f"DATABASE INITIALIZATION FAILED ERROR: {e}")