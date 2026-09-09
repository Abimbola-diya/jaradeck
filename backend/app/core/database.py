import os

import psycopg2
from supabase import Client, create_client

from app.core.config import (
    DATABASE_URL,
    SUPABASE_ANON_KEY,
    SUPABASE_URL,
)


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
)


def init_db():
    db_url = DATABASE_URL

    if not db_url:
        print(
            "No DATABASE_URL found in environment! "
            "Skipping database initialization."
        )
        return

    if "db.yjzfotmjkziehsqvxito.supabase.co" in db_url:
        db_url = db_url.replace(
            "db.yjzfotmjkziehsqvxito.supabase.co:5432",
            "aws-0-eu-west-2.pooler.supabase.com:6543",
        )
        db_url = db_url.replace(
            "db.yjzfotmjkziehsqvxito.supabase.co",
            "aws-0-eu-west-2.pooler.supabase.com:6543",
        )

        if "postgres.yjzfotmjkziehsqvxito" not in db_url:
            db_url = db_url.replace(
                "postgres:",
                "postgres.yjzfotmjkziehsqvxito:",
            )

    if "sslmode" not in db_url:
        if "?" in db_url:
            db_url += "&sslmode=require"
        else:
            db_url += "?sslmode=require"

    try:
        print(
            "Connecting to Supabase PostgreSQL at "
            f"{db_url.split('@')[-1]}..."
        )

        conn = psycopg2.connect(
            db_url,
            sslmode="require",
            connect_timeout=15,
        )

        cur = conn.cursor()

        cur.execute(
            """
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
                id UUID PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT,
                role TEXT NOT NULL DEFAULT 'customer',
                phone TEXT,
                avatar_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

                CONSTRAINT users_role_check
                    CHECK (role IN ('customer', 'worker', 'admin'))
            );

            CREATE TABLE IF NOT EXISTS applications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                customer_id UUID NOT NULL
                    REFERENCES users(id) ON DELETE CASCADE,

                title TEXT NOT NULL,
                description TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'open',
                budget NUMERIC(12, 2),
                deadline TIMESTAMP WITH TIME ZONE,

                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

                CONSTRAINT applications_status_check
                    CHECK (
                        status IN (
                            'open',
                            'in_progress',
                            'completed',
                            'cancelled'
                        )
                    )
            );
            """
        )

        conn.commit()
        cur.close()
        conn.close()

        print(
            "Successfully created/verified Supabase database "
            "tables on startup!"
        )

    except Exception as e:
        print(f"DATABASE INITIALIZATION FAILED ERROR: {e}")