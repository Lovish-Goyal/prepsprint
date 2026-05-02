from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from schemas.schemas import UserResponse
from bson import ObjectId
from utils.helpers import serialize_mongo_doc

router = APIRouter(prefix="/api/user", tags=["user"])

from datetime import datetime, UTC

# Mock current user - in production, use JWT token
async def get_current_user(db = Depends(get_db)):
    user = await db.users.find_one({})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    if "created_at" not in user:
        user["created_at"] = datetime.now(UTC)
    return serialize_mongo_doc(user)

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user
