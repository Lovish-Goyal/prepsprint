from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from schemas.schemas import InterviewQuestion, InterviewAnswer, InterviewFeedback
from services.ai_service import AIService
from bson import ObjectId
from datetime import datetime
import json

router = APIRouter(prefix="/api/interview", tags=["interview"])

async def get_current_user(db = Depends(get_db)):
    user = await db.users.find_one({})
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user["id"] = str(user["_id"])
    return user

@router.get("/questions")
async def get_interview_questions(
    difficulty: str = "medium",
    current_user: dict = Depends(get_current_user)
):
    """Generate interview questions using AI"""
    result = AIService.generate_interview_questions(difficulty=difficulty)
    return result

@router.post("/feedback")
async def submit_interview_feedback(
    interview_data: InterviewAnswer,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Analyze interview answer and provide feedback"""
    result = AIService.analyze_interview_answer(
        question=interview_data.question,
        answer=interview_data.answer
    )
    
    # Save session to database
    now = datetime.utcnow()
    session_data = {
        "user_id": str(current_user["id"]),
        "question": interview_data.question,
        "answer": interview_data.answer,
        "difficulty": interview_data.difficulty,
        "confidence": 85.0,  # Mock value
        "pace": "Good (140 wpm)",
        "keywords": "Resilience, Solution-oriented, Debugging",
        "created_at": now
    }
    
    await db.interviews.insert_one(session_data)
    
    return {
        "feedback": result.get("feedback", ""),
        "confidence": 85,
        "pace": "Good (140 wpm)",
        "keywords": ["Resilience", "Solution-oriented", "Debugging"]
    }

@router.get("/history")
async def get_interview_history(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get user's interview history"""
    cursor = db.interviews.find({"user_id": str(current_user["id"])}).sort("created_at", -1)
    sessions = await cursor.to_list(length=100)
    
    return {
        "total_sessions": len(sessions),
        "sessions": [
            {
                "id": str(s["_id"]),
                "question": s.get("question"),
                "difficulty": s.get("difficulty"),
                "confidence": s.get("confidence"),
                "created_at": s.get("created_at")
            }
            for s in sessions
        ]
    }
