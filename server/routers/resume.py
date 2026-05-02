from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from schemas.schemas import ResumeCreate, ResumeAnalyze, ResumeSuggestions
from services.ai_service import AIService
from bson import ObjectId
from utils.helpers import serialize_mongo_doc

router = APIRouter(prefix="/api/resume", tags=["resume"])

async def get_current_user(db = Depends(get_db)):
    # In a real app, extract user_id from JWT token
    # For now, we'll fetch a default user or the first user found
    user = await db.users.find_one({})
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return serialize_mongo_doc(user)

@router.get("/")
async def get_my_resume(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Fetch the user's current resume"""
    resume = await db.resumes.find_one({"user_id": str(current_user["_id"])})
    if not resume:
        return None
    
    resume["id"] = str(resume["_id"])
    return resume

@router.post("/analyze")
async def analyze_resume(
    resume_data: ResumeAnalyze,
):
    """Analyze resume text using AI"""
    result = AIService.analyze_resume(resume_data.text)
    return result

@router.post("/")
async def create_or_update_resume(
    resume_data: ResumeCreate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Create or update a professional user resume"""
    user_id = str(current_user["_id"])
    
    resume_dict = resume_data.dict()
    resume_dict["user_id"] = user_id
    resume_dict["updated_at"] = ObjectId().generation_time
    
    existing = await db.resumes.find_one({"user_id": user_id})
    
    if existing:
        await db.resumes.update_one(
            {"user_id": user_id},
            {"$set": resume_dict}
        )
        resume_dict["id"] = str(existing["_id"])
    else:
        result = await db.resumes.insert_one(resume_dict)
        resume_dict["id"] = str(result.inserted_id)
    
    return resume_dict
