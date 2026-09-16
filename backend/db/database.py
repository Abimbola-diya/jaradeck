from supabase import create_client, Client
from core.config import settings
import psycopg2

if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
    raise RuntimeError(
        "Missing required environment variables: SUPABASE_URL and SUPABASE_ANON_KEY must be set."
    )

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)


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
            -- ────────────────────────────────────────────────────────────────
            -- CORE AUTH / ONBOARDING TABLES
            -- ────────────────────────────────────────────────────────────────
            CREATE TABLE IF NOT EXISTS waitlist_submissions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                name TEXT NOT NULL,
                contact_selected JSONB NOT NULL,
                contacts JSONB NOT NULL,
                role TEXT NOT NULL,
                role_other TEXT,
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
                first_name TEXT,
                last_name TEXT,
                full_name TEXT,
                role TEXT,
                country TEXT,
                phone TEXT,
                auth_provider TEXT DEFAULT 'local',
                is_verified BOOLEAN NOT NULL DEFAULT FALSE,
                failed_otp_attempts INTEGER NOT NULL DEFAULT 0,
                otp_locked_until TIMESTAMP WITH TIME ZONE,
                avatar_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Safely migrate existing deployments
            ALTER TABLE users ALTER COLUMN role DROP NOT NULL;
            ALTER TABLE users ALTER COLUMN full_name DROP NOT NULL;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_otp_attempts INTEGER NOT NULL DEFAULT 0;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_locked_until TIMESTAMP WITH TIME ZONE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

            CREATE TABLE IF NOT EXISTS otp_codes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                email TEXT NOT NULL,
                code TEXT NOT NULL,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                used BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- ────────────────────────────────────────────────────────────────
            -- PROJECTS
            --   Lifecycle: pending → active → completed | cancelled
            --   worker_id is NULL until admin assigns the job to a worker.
            --   A worker can have many active projects simultaneously.
            -- ────────────────────────────────────────────────────────────────
            CREATE TABLE IF NOT EXISTS projects (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title TEXT NOT NULL,
                description TEXT,
                category TEXT,
                status TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
                customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                worker_id UUID REFERENCES users(id) ON DELETE SET NULL,
                budget NUMERIC(12, 2),
                amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
                started_at TIMESTAMP WITH TIME ZONE,
                deadline_at TIMESTAMP WITH TIME ZONE,
                completed_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- ────────────────────────────────────────────────────────────────
            -- PROJECT MESSAGES — per-project chat thread (client ↔ worker)
            -- ────────────────────────────────────────────────────────────────
            CREATE TABLE IF NOT EXISTS project_messages (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                is_read BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- ────────────────────────────────────────────────────────────────
            -- PROJECT REVIEWS — client rates worker after completion
            --   Enforced unique: one review per project per reviewer
            -- ────────────────────────────────────────────────────────────────
            CREATE TABLE IF NOT EXISTS project_reviews (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
                comment TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE (project_id, reviewer_id)
            );

            -- ────────────────────────────────────────────────────────────────
            -- WORKER WALLETS — one row per worker (auto-created on first
            --   project completion). Tracks internal Jaradeck credit balance.
            -- ────────────────────────────────────────────────────────────────
            CREATE TABLE IF NOT EXISTS worker_wallets (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                worker_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
                total_earned NUMERIC(12, 2) NOT NULL DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- ────────────────────────────────────────────────────────────────
            -- WALLET TRANSACTIONS — immutable ledger row for every money event
            --   type: 'credit' (project paid out) | 'debit' | 'withdrawal'
            -- ────────────────────────────────────────────────────────────────
            CREATE TABLE IF NOT EXISTS wallet_transactions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                wallet_id UUID NOT NULL REFERENCES worker_wallets(id) ON DELETE CASCADE,
                project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
                type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'withdrawal')),
                amount NUMERIC(12, 2) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- ────────────────────────────────────────────────────────────────
            -- INDEXES — auth
            -- ────────────────────────────────────────────────────────────────
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
            CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id ON otp_codes(user_id);

            -- ────────────────────────────────────────────────────────────────
            -- INDEXES — project domain (high-cardinality query paths)
            -- ────────────────────────────────────────────────────────────────
            CREATE INDEX IF NOT EXISTS idx_projects_worker_id ON projects(worker_id);
            CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
            CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
            CREATE INDEX IF NOT EXISTS idx_projects_worker_status ON projects(worker_id, status);
            CREATE INDEX IF NOT EXISTS idx_projects_deadline ON projects(deadline_at);
            CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON project_messages(project_id);
            CREATE INDEX IF NOT EXISTS idx_project_messages_sender_id ON project_messages(sender_id);
            CREATE INDEX IF NOT EXISTS idx_project_reviews_worker_id ON project_reviews(worker_id);
            CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
            CREATE INDEX IF NOT EXISTS idx_wallet_transactions_project_id ON wallet_transactions(project_id);
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("Successfully created/verified all Jaradeck database tables and indexes!")
    except Exception as e:
        print(f"DATABASE INITIALIZATION FAILED ERROR: {e}")
