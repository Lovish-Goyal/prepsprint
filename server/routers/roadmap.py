from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from schemas.schemas import RoadmapCreate, RoadmapResponse
from services.ai_service import AIService
import json
from datetime import datetime
from bson import ObjectId
from utils.helpers import serialize_mongo_doc

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])

async def get_current_user(db = Depends(get_db)):
    # Simple placeholder for authentication
    user = await db.users.find_one({})
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

@router.get("/")
async def get_roadmap(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Fetch the current architectural blueprint for the user"""
    roadmap = await db.roadmaps.find_one({"user_id": str(current_user["_id"])})
    if not roadmap:
        return None
    
    return serialize_mongo_doc(roadmap)

@router.post("/")
async def create_dynamic_roadmap(
    roadmap_data: RoadmapCreate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Generate and persist a professional engineering roadmap using AI"""
    user_id = str(current_user["_id"])
    
    # Generate roadmap phases via AI
    ai_result = AIService.generate_roadmap(
        roadmap_data.target_role, 
        roadmap_data.primary_interests
    )
    
    if ai_result.get("status") == "error":
        raise HTTPException(
            status_code=500, 
            detail=f"AI Roadmap Generation Failed: {ai_result.get('error')}"
        )
    
    try:
        roadmap_content = json.loads(ai_result["roadmap"])
        phases = roadmap_content.get("phases", [])
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to parse AI response: {str(e)}"
        )

    # Persist the roadmap
    new_roadmap = {
        "user_id": user_id,
        "target_role": roadmap_data.target_role,
        "duration_months": roadmap_data.duration_months,
        "primary_interests": roadmap_data.primary_interests,
        "phases": phases,
        "created_at": datetime.utcnow()
    }
    
    # Remove existing roadmap for clean update
    await db.roadmaps.delete_many({"user_id": user_id})
    result = await db.roadmaps.insert_one(new_roadmap)
    
    new_roadmap["id"] = str(result.inserted_id)
    if "_id" in new_roadmap:
        del new_roadmap["_id"]
    return new_roadmap
