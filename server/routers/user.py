from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from schemas.schemas import UserResponse
from bson import ObjectId
from utils.helpers import serialize_mongo_doc
from datetime import datetime, UTC
from utils.auth import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/user", tags=["user"])

class UserUpdate(BaseModel):
    name: str
    email: str
    image: Optional[str] = None
    bio: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    try:
        update_data = {
            "name": user_update.name,
            "full_name": user_update.name,
            "email": user_update.email,
            "bio": user_update.bio or ""
        }
        if user_update.image is not None:
            update_data["image"] = user_update.image
            
        await db.users.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_data}
        )
        
        # Return updated user
        updated_user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
        return serialize_mongo_doc(updated_user)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.post("/change-password")
async def change_password(
    data: PasswordChange,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    from routers.auth import verify_password, get_password_hash
    if not verify_password(data.current_password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    new_hashed = get_password_hash(data.new_password)
    await db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": {"hashed_password": new_hashed}}
    )
    return {"message": "Password changed successfully"}

@router.delete("/delete-account")
async def delete_account(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    user_id = ObjectId(current_user["id"])
    user_id_str = current_user["id"]
    
    # Delete user's associated data
    await db.users.delete_one({"_id": user_id})
    await db.skills.delete_many({"user_id": user_id_str})
    await db.roadmaps.delete_many({"user_id": user_id_str})
    await db.resumes.delete_many({"user_id": user_id_str})
    await db.interviews.delete_many({"user_id": user_id_str})
    await db.skill_tracking.delete_many({"user_id": user_id_str})
    await db.mentor_sessions.delete_many({"user_id": user_id_str})
    
    return {"message": "Account deleted successfully"}
