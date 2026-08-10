import os
import psycopg2
from dotenv import load_dotenv

# Load env variables from root .env
load_dotenv(dotenv_path="../.env")

DATABASE_URL = os.getenv("DIRECT_URL")

def create_tables():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    print("Creating waitlist_submissions table...")
    cur.execute("""
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
    """)

    print("Creating newsletter_subscribers table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            email TEXT UNIQUE NOT NULL
        );
    """)

    conn.commit()
    cur.close()
    conn.close()
    print("Tables created successfully.")

if __name__ == "__main__":
    create_tables()
