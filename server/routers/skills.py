import json
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from database import get_db
from schemas.schemas import SkillCreate, SkillResponse, SkillUpdate
from services.ai_service import AIService
from bson import ObjectId
from bson import ObjectId
from datetime import datetime
from utils.helpers import serialize_mongo_doc, serialize_mongo_list

router = APIRouter(prefix="/api/skills", tags=["skills"])

from utils.auth import get_current_user

@router.post("/analyze")
async def analyze_skill_gaps(
    payload: dict,
):
    """Perform a deep-dive AI analysis of skill gaps based on resume and job description"""
    target_role      = payload.get("target_role", "Software Engineer")
    current_skills   = payload.get("current_skills", [])
    resume_text      = payload.get("resume_text", "")
    job_description  = payload.get("job_description", "")
    experience_years = payload.get("experience_years", "0-1")

    ai_result = AIService.analyze_skill_gaps(
        current_skills,
        target_role,
        resume_text=resume_text,
        job_description=job_description,
        experience_years=experience_years,
    )

    if ai_result.get("status") == "error":
        raise HTTPException(status_code=500, detail=ai_result.get("error"))

    try:
        analysis = json.loads(ai_result["analysis"])
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to parse AI response: " + str(e))


@router.get("/")
async def get_skills(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
# ...
    """Fetch all skills for the current user"""
    skills_cursor = db.skills.find({"user_id": str(current_user["id"])})
    skills = await skills_cursor.to_list(length=100)
    return serialize_mongo_list(skills)

@router.post("/")
async def create_skill(
    skill_data: SkillCreate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Add a new skill to the user profile"""
    skill_dict = skill_data.dict()
    skill_dict["user_id"] = str(current_user["id"])
    skill_dict["created_at"] = datetime.utcnow()
    
    result = await db.skills.insert_one(skill_dict)
    skill_dict["id"] = str(result.inserted_id)
    if "_id" in skill_dict:
        del skill_dict["_id"]
    return skill_dict

@router.put("/{skill_id}")
async def update_skill(
    skill_id: str,
    skill_data: SkillUpdate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Update proficiency or level of an existing skill"""
    update_data = skill_data.dict(exclude_unset=True)
    
    result = await db.skills.update_one(
        {"_id": ObjectId(skill_id), "user_id": str(current_user["id"])},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return {"message": "Skill updated successfully"}

@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: str,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Remove a skill from the user profile"""
    result = await db.skills.delete_one(
        {"_id": ObjectId(skill_id), "user_id": str(current_user["id"])}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return {"message": "Skill deleted successfully"}
