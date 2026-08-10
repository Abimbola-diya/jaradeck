from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
import random
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv(dotenv_path="../.env")
load_dotenv(dotenv_path=".env")

DEFAULT_SUPABASE_URL = "https://yjzfotmjkziehsqvxito.supabase.co"
DEFAULT_SUPABASE_KEY = "sb_publishable_N3Oec4Tjne6yjnxnY9iEsQ_ewLUH6Ga"
DEFAULT_DATABASE_URL = "postgresql://postgres:abimbola%402007db@db.yjzfotmjkziehsqvxito.supabase.co:5432/postgres?sslmode=require"

url: str = os.getenv("SUPABASE_URL") or DEFAULT_SUPABASE_URL
key: str = os.getenv("SUPABASE_ANON_KEY") or DEFAULT_SUPABASE_KEY
supabase: Client = create_client(url, key)

def init_db():
    db_url = os.getenv("DIRECT_URL") or os.getenv("DATABASE_URL") or DEFAULT_DATABASE_URL
    if "sslmode" not in db_url:
        if "?" in db_url:
            db_url += "&sslmode=require"
        else:
            db_url += "?sslmode=require"
            
    try:
        import psycopg2
        print(f"Connecting to Supabase PostgreSQL at {db_url.split('@')[-1]}...")
        conn = psycopg2.connect(db_url, sslmode="require", connect_timeout=15)
        cur = conn.cursor()
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
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                email TEXT UNIQUE NOT NULL
            );
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("Successfully created/verified Supabase database tables on startup!")
    except Exception as e:
        print(f"DATABASE INITIALIZATION FAILED ERROR: {e}")

app = FastAPI(
    title="JaraDeck API",
    description="Backend services for JaraDeck - The Trusted Execution Platform",
    version="1.0.0"
)

@app.on_event("startup")
def startup_event():
    init_db()

# Enable CORS for the Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory "databases" for simulation
waitlist_db = []
task_requests_db = []

# Vetted students pool for matching simulation
STUDENTS_POOL = [
    {
        "name": "Sarah O.",
        "university": "University of Ibadan",
        "major": "Computer Science",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        "skills": ["Web Development", "UI/UX Design", "React", "HTML/CSS"],
        "tasks_completed": 14,
        "satisfaction_rate": "100%",
        "bio": "Specializes in building responsive landing pages and interactive dashboards."
    },
    {
        "name": "David K.",
        "university": "Covenant University",
        "major": "Mechanical Engineering",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "skills": ["Video Editing", "Motion Graphics", "Premiere Pro", "After Effects"],
        "tasks_completed": 27,
        "satisfaction_rate": "98.5%",
        "bio": "Produces high-retention short-form video edits for TikTok, Reels, and YouTube."
    },
    {
        "name": "Amina B.",
        "university": "University of Lagos",
        "major": "Mass Communication",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        "skills": ["Copywriting", "SEO Writing", "Social Media Management", "Newsletters"],
        "tasks_completed": 19,
        "satisfaction_rate": "100%",
        "bio": "Writes engaging, high-conversion copy for SaaS landing pages and newsletter campaigns."
    },
    {
        "name": "Emmanuel C.",
        "university": "Federal University of Technology, Minna",
        "major": "Information Technology",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        "skills": ["Data Entry", "Competitor Research", "Excel/Sheets", "Lead Generation"],
        "tasks_completed": 33,
        "satisfaction_rate": "97%",
        "bio": "Fast, detailed, and highly organized virtual assistant for data and admin tasks."
    },
    {
        "name": "Tobi A.",
        "university": "Obafemi Awolowo University",
        "major": "Fine & Applied Arts",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
        "skills": ["Graphic Design", "Brand Identity", "Figma", "Illustrator"],
        "tasks_completed": 22,
        "satisfaction_rate": "100%",
        "bio": "Crafts unique logos, digital assets, and brand design systems for modern start-ups."
    }
]

# Request Schemas
class WaitlistSignup(BaseModel):
    name: str
    contactSelected: List[str]
    contacts: Dict[str, str]
    role: str
    roleOther: Optional[str] = ""
    tasksSelected: List[str]
    tasksOther: Optional[str] = ""
    frequency: str

class NewsletterSignup(BaseModel):
    email: EmailStr

class TaskRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    task_description: str = Field(..., min_length=10, max_length=1000)
    category: str
    budget: Optional[float] = None

class MatchQuery(BaseModel):
    description: str

# Endpoints
@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "JaraDeck API is running smoothly.",
        "version": "1.0.0"
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JaraDeck API"
    }

@app.post("/api/waitlist")
def join_waitlist(signup: WaitlistSignup):
    data = {
        "name": signup.name,
        "contact_selected": signup.contactSelected,
        "contacts": signup.contacts,
        "role": signup.role,
        "role_other": signup.roleOther,
        "tasks_selected": signup.tasksSelected,
        "tasks_other": signup.tasksOther,
        "frequency": signup.frequency
    }
    try:
        response = supabase.table("waitlist_submissions").insert(data).execute()
        return {"message": "Successfully joined the JaraDeck waitlist. Welcome aboard!", "already_exists": False}
    except Exception as e:
        if "duplicate key value" in str(e).lower() or "already exists" in str(e).lower():
            return {"message": "You are already on the waitlist!", "already_exists": True}
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/newsletter")
def join_newsletter(signup: NewsletterSignup):
    email_lower = signup.email.lower()
    try:
        response = supabase.table("newsletter_subscribers").insert({"email": email_lower}).execute()
        return {"message": "Successfully subscribed to the newsletter."}
    except Exception as e:
        if "duplicate key value" in str(e).lower():
            return {"message": "Already subscribed."}
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/request-task")
def submit_task_request(request: TaskRequest):
    new_request = request.model_dump()
    new_request["id"] = len(task_requests_db) + 1
    task_requests_db.append(new_request)
    return {
        "success": True,
        "message": "Task request received! We are matching you with a vetted student.",
        "request_id": new_request["id"]
    }

@app.post("/api/match")
def simulate_match(query: MatchQuery):
    desc = query.description.lower()
    
    # Simple semantic keyword matching for simulation
    matched_student = None
    if "video" in desc or "edit" in desc or "motion" in desc or "youtube" in desc or "tiktok" in desc:
        matched_student = STUDENTS_POOL[1] # David K. (Video Editing)
    elif "code" in desc or "web" in desc or "site" in desc or "react" in desc or "html" in desc or "css" in desc:
        matched_student = STUDENTS_POOL[0] # Sarah O. (Web Development)
    elif "write" in desc or "copy" in desc or "blog" in desc or "text" in desc or "article" in desc or "email" in desc:
        matched_student = STUDENTS_POOL[2] # Amina B. (Copywriting)
    elif "design" in desc or "logo" in desc or "figma" in desc or "graphic" in desc or "flyer" in desc:
        matched_student = STUDENTS_POOL[4] # Tobi A. (Graphic Design)
    else:
        # Default or admin task matching
        matched_student = STUDENTS_POOL[3] # Emmanuel C. (Data Entry / Research)
    
    # Add a random match confidence rating
    confidence = round(random.uniform(94.5, 99.9), 1)
    
    return {
        "success": True,
        "student": matched_student,
        "match_confidence": f"{confidence}%",
        "estimated_start": "Within 2 hours"
    }

@app.get("/api/students")
def get_students():
    # Return vetted pool
    return STUDENTS_POOL

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running smoothly!"}
