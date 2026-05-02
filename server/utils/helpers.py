def get_password_hash(password):
    """Hash password using bcrypt"""
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    """Verify password against hash"""
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.verify(plain_password, hashed_password)

def generate_mock_questions() -> list:
    """Generate mock interview questions"""
    return [
        {
            "id": 1,
            "question": "Tell me about a time you faced a difficult technical challenge.",
            "difficulty": "medium",
            "hint": "Focus on the STAR method: Situation, Task, Action, and Result."
        },
        {
            "id": 2,
            "question": "How do you approach learning new technologies?",
            "difficulty": "easy",
            "hint": "Discuss your learning strategy and give examples."
        },
        {
            "id": 3,
            "question": "Describe a time when you had to work with a difficult team member.",
            "difficulty": "hard",
            "hint": "Focus on resolution and personal growth."
        }
    ]

def serialize_mongo_doc(doc: dict) -> dict:
    """
    Standardize a MongoDB document for FastAPI JSON serialization.
    - Converts `_id` (ObjectId) to `id` (string).
    - Removes the original `_id` field to prevent serialization errors.
    """
    if doc is None:
        return None
    
    # Ensure current state is modified correctly
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

def serialize_mongo_list(docs: list) -> list:
    """
    Standardize a list of MongoDB documents.
    """
    return [serialize_mongo_doc(doc) for doc in docs]
