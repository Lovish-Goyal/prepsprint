import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, user, skills, roadmap, resume, interview, ai_mentor, skill_tracker, technologies

app = FastAPI(
    title="PrepSprint API",
    description="AI-powered career development platform API",
    version="1.0.0"
)

# Add CORS middleware
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(skills.router)
app.include_router(roadmap.router)
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(ai_mentor.router)
app.include_router(skill_tracker.router)
app.include_router(technologies.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to PrepSprint API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
