from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from database import get_db
from schemas.schemas import SkillTrackerSubmit, SkillTrackerResponse
from services.ai_service import AIService
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/skill-tracker", tags=["skill-tracker"])

from utils.auth import get_current_user

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
        
        ai_evaluation_res = AIService.analyze_interview_answer(
            submission.description,
            evaluation_prompt
        )
        ai_evaluation = ai_evaluation_res.get("feedback", "") if isinstance(ai_evaluation_res, dict) else str(ai_evaluation_res)
        
        # Generate personalized suggestions
        ai_suggestions_res = AIService.generate_career_suggestions(
            skills=[submission.skill_name],
            experience=submission.description
        )
        ai_suggestions = ai_suggestions_res.get("suggestions", "") if isinstance(ai_suggestions_res, dict) else str(ai_suggestions_res)
        
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
        if "_id" in new_entry:
            del new_entry["_id"]
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
