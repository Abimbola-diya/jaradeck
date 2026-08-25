from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import init_db
from app.routers import applications, health, waitlist


app = FastAPI(
    title="JaraDeck API",
    description="Backend services for JaraDeck - The Trusted Execution Platform",
    version="1.0.0",
)


@app.on_event("startup")
def startup_event():
    init_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health.router)
app.include_router(waitlist.router)
app.include_router(applications.router)