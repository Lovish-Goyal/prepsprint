from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from schemas.schemas import AIMentorQuestion, AIMentorResponse
from services.ai_service import AIService
from bson import ObjectId
from utils.helpers import serialize_mongo_doc

router = APIRouter(prefix="/api/ai-mentor", tags=["ai-mentor"])

async def get_current_user(db = Depends(get_db)):
    user = await db.users.find_one({})
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return serialize_mongo_doc(user)

@router.post("/", response_model=AIMentorResponse)
async def ask_mentor(
    mentor_request: AIMentorQuestion,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get AI mentor response to career, resume, or skill-related questions
    """
    if not mentor_request.question or len(mentor_request.question.strip()) == 0:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        # Use AI service to generate response
        ai_result = AIService.ask_mentor(mentor_request.question)
        if ai_result.get("status") == "error":
            raise Exception(ai_result.get("error"))
            
        response_text = ai_result.get("answer", "")
        
        # Extract main response and suggestions from the AI output
        lines = response_text.split('\n')
        main_response = '\n'.join([line for line in lines if not line.strip().startswith('-')])
        suggestions = [line.strip('- ') for line in lines if line.strip().startswith('-')][:3]
        
        return AIMentorResponse(
            response=main_response.strip() or response_text,
            suggestions=suggestions or None
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(e)}"
        )
