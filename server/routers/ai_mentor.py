from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from schemas.schemas import AIMentorQuestion, AIMentorResponse
from services.ai_service import AIService
from bson import ObjectId
from utils.helpers import serialize_mongo_doc
from datetime import datetime

router = APIRouter(prefix="/api/ai-mentor", tags=["ai-mentor"])

from utils.auth import get_current_user

@router.get("/sessions")
async def get_sessions(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get all chat sessions for the current user
    """
    try:
        cursor = db.mentor_sessions.find({"user_id": current_user["id"]}).sort("updated_at", -1)
        sessions = []
        async for doc in cursor:
            sessions.append(serialize_mongo_doc(doc))
        return sessions
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch sessions: {str(e)}"
        )

@router.post("/sessions")
async def create_session(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Create a new chat session
    """
    try:
        new_session = {
            "user_id": current_user["id"],
            "title": f"Session - {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
            "messages": [
                {
                    "id": 1,
                    "text": "Hi! I'm your AI Career Mentor. I can help you with career guidance, resume tips, or any skill-related questions. What would you like to know?",
                    "sender": "bot",
                    "timestamp": datetime.utcnow().isoformat()
                }
            ],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        res = await db.mentor_sessions.insert_one(new_session)
        new_session["_id"] = str(res.inserted_id)
        return serialize_mongo_doc(new_session)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create session: {str(e)}"
        )

@router.post("/sessions/{session_id}/message")
async def add_message(
    session_id: str,
    mentor_request: AIMentorQuestion,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Add a user message to a session, generate AI response, and persist both
    """
    if not mentor_request.question or len(mentor_request.question.strip()) == 0:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        # Find session
        session = await db.mentor_sessions.find_one({"_id": ObjectId(session_id), "user_id": current_user["id"]})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Format history messages for AI context (excluding the system message)
        history = []
        for msg in session.get("messages", []):
            history.append({
                "sender": msg.get("sender"),
                "text": msg.get("text")
            })
        
        # Use AI service to generate response with history context
        ai_result = AIService.ask_mentor_with_history(history, mentor_request.question)
        if ai_result.get("status") == "error":
            raise Exception(ai_result.get("error"))
            
        response_text = ai_result.get("answer", "")
        
        # Parse main response and suggestions using separator
        if '===Suggestions===' in response_text:
            parts = response_text.split('===Suggestions===')
            main_response = parts[0].strip()
            suggestions = []
            for line in parts[1].split('\n'):
                line_str = line.strip().lstrip('-').lstrip('*').lstrip('•').strip()
                if line_str:
                    suggestions.append(line_str)
        else:
            # Fallback logic to only extract suggestions if they are at the very end
            lines = response_text.split('\n')
            main_lines = []
            suggestions = []
            in_suggestions = False
            for line in reversed(lines):
                stripped = line.strip()
                if not stripped:
                    continue
                if stripped.startswith('-') and len(suggestions) < 3 and not in_suggestions:
                    suggestions.insert(0, stripped.lstrip('- ').strip())
                else:
                    in_suggestions = True
                    main_lines.insert(0, line)
            main_response = '\n'.join(main_lines).strip()
            
        clean_bot_response = main_response or response_text
        
        # Create user and bot messages
        user_msg = {
            "id": len(session["messages"]) + 1,
            "text": mentor_request.question,
            "sender": "user",
            "timestamp": datetime.utcnow().isoformat()
        }
        bot_msg = {
            "id": len(session["messages"]) + 2,
            "text": clean_bot_response,
            "sender": "bot",
            "suggestions": suggestions or None,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Update in DB
        updated_messages = session["messages"] + [user_msg, bot_msg]
        
        # Dynamically set title based on user's first question
        title = session.get("title", "")
        if title.startswith("Session - ") and len(session["messages"]) == 1:
            title = mentor_request.question[:30] + ("..." if len(mentor_request.question) > 30 else "")
        
        await db.mentor_sessions.update_one(
            {"_id": ObjectId(session_id)},
            {
                "$set": {
                    "messages": updated_messages,
                    "title": title,
                    "updated_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        return {
            "response": clean_bot_response,
            "suggestions": suggestions or None,
            "messages": updated_messages
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(e)}"
        )

@router.post("/", response_model=AIMentorResponse)
async def ask_mentor(
    mentor_request: AIMentorQuestion,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Legacy static endpoint (retained for backward compatibility, with traceback logging)
    """
    if not mentor_request.question or len(mentor_request.question.strip()) == 0:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        ai_result = AIService.ask_mentor(mentor_request.question)
        if ai_result.get("status") == "error":
            raise Exception(ai_result.get("error"))
            
        response_text = ai_result.get("answer", "")
        
        # Parse main response and suggestions using separator
        if '===Suggestions===' in response_text:
            parts = response_text.split('===Suggestions===')
            main_response = parts[0].strip()
            suggestions = []
            for line in parts[1].split('\n'):
                line_str = line.strip().lstrip('-').lstrip('*').lstrip('•').strip()
                if line_str:
                    suggestions.append(line_str)
        else:
            # Fallback logic to only extract suggestions if they are at the very end
            lines = response_text.split('\n')
            main_lines = []
            suggestions = []
            in_suggestions = False
            for line in reversed(lines):
                stripped = line.strip()
                if not stripped:
                    continue
                if stripped.startswith('-') and len(suggestions) < 3 and not in_suggestions:
                    suggestions.insert(0, stripped.lstrip('- ').strip())
                else:
                    in_suggestions = True
                    main_lines.insert(0, line)
            main_response = '\n'.join(main_lines).strip()
            
        return AIMentorResponse(
            response=main_response or response_text,
            suggestions=suggestions or None
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(e)}"
        )
