from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import random

app = FastAPI(
    title="JaraDeck API",
    description="Backend services for JaraDeck - The Trusted Execution Platform",
    version="1.0.0"
)

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

@app.post("/api/waitlist")
def join_waitlist(signup: WaitlistSignup):
    email_lower = signup.email.lower()
    if email_lower in [x["email"] for x in waitlist_db]:
        return {"message": "You are already on the waitlist! We will keep you updated.", "already_exists": True}
    
    waitlist_db.append({"email": email_lower})
    return {"message": "Successfully joined the JaraDeck waitlist. Welcome aboard!", "already_exists": False}

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
