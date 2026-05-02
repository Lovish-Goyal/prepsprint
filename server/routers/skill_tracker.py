from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from database import get_db
from schemas.schemas import SkillTrackerSubmit, SkillTrackerResponse
from services.ai_service import AIService
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/skill-tracker", tags=["skill-tracker"])

async def get_current_user(db = Depends(get_db)):
    user = await db.users.find_one({})
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user["id"] = str(user["_id"])
    return user

def format_tracker(doc):
    if not doc: return None
    doc["id"] = str(doc["_id"])
    return doc

@router.post("/", response_model=SkillTrackerResponse)
async def submit_skill_tracking(
    submission: SkillTrackerSubmit,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Submit a skill tracking entry with evaluation and suggestions
    """
    if not submission.skill_name or not submission.description:
        raise HTTPException(
            status_code=400,
            detail="Skill name and description are required"
        )
    
    try:
        # Generate AI evaluation and suggestions
        evaluation_prompt = f"""
        Skill/Task: {submission.skill_name}
        Description: {submission.description}
        What went right: {submission.what_went_right}
        What went wrong: {submission.what_went_wrong}
        
        Please provide constructive evaluation and suggestions for improvement.
        """
        
        ai_evaluation = AIService.analyze_interview_answer(
            submission.description,
            evaluation_prompt
        )
        
        # Generate personalized suggestions
        suggestions_prompt = f"Based on this skill tracking ({submission.skill_name}), suggest next steps for improvement."
        ai_suggestions = AIService.generate_career_suggestions(suggestions_prompt)
        
        # Create tracking entry
        now = datetime.utcnow()
        new_entry = {
            "user_id": str(current_user["id"]),
            "skill_name": submission.skill_name,
            "description": submission.description,
            "what_went_right": submission.what_went_right,
            "what_went_wrong": submission.what_went_wrong,
            "ai_evaluation": ai_evaluation,
            "ai_suggestions": ai_suggestions,
            "created_at": now,
            "updated_at": now
        }
        
        result = await db.skill_tracking.insert_one(new_entry)
        new_entry["id"] = str(result.inserted_id)
        return new_entry
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process skill tracking: {str(e)}"
        )

@router.get("/history", response_model=List[SkillTrackerResponse])
async def get_tracking_history(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Retrieve all skill tracking submissions for the current user
    """
    cursor = db.skill_tracking.find({"user_id": str(current_user["id"])}).sort("created_at", -1)
    submissions = await cursor.to_list(length=100)
    return [format_tracker(s) for s in submissions]

@router.get("/{tracker_id}", response_model=SkillTrackerResponse)
async def get_tracking_entry(
    tracker_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get a specific skill tracking entry with AI feedback
    """
    try:
        entry = await db.skill_tracking.find_one({
            "_id": ObjectId(tracker_id),
            "user_id": str(current_user["id"])
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid tracker ID")
    
    if not entry:
        raise HTTPException(
            status_code=404,
            detail="Skill tracking entry not found"
        )
    
    return format_tracker(entry)
