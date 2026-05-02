from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    full_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Skill Schemas
class SkillCreate(BaseModel):
    name: str
    proficiency: float = 0
    level: str

class SkillUpdate(BaseModel):
    proficiency: Optional[float] = None
    hours_spent: Optional[float] = None
    level: Optional[str] = None

class SkillResponse(BaseModel):
    id: str
    name: str
    proficiency: float
    hours_spent: float
    level: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Roadmap Schemas
class RoadmapPhaseCreate(BaseModel):
    phase_number: int
    name: str
    description: str
    duration_months: int
    skills: str

class RoadmapCreate(BaseModel):
    target_role: str
    duration_months: int
    primary_interests: str

class RoadmapResponse(BaseModel):
    id: str
    target_role: str
    duration_months: int
    primary_interests: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Resume Schemas
class ResumeCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    content: str

class ResumeAnalyze(BaseModel):
    text: str

class ResumeSuggestions(BaseModel):
    suggestions: List[str]
    score: float

# Interview Schemas
class InterviewQuestion(BaseModel):
    question: str
    difficulty: str
    hint: str

class InterviewAnswer(BaseModel):
    question: str
    answer: str
    difficulty: str

class InterviewFeedback(BaseModel):
    confidence: float
    pace: str
    keywords: List[str]
    suggestions: str

# Skill Tracker Schemas
class SkillTrackerSubmit(BaseModel):
    skill_name: str
    description: str
    what_went_right: str
    what_went_wrong: str

class SkillTrackerResponse(BaseModel):
    id: str
    skill_name: str
    description: str
    what_went_right: str
    what_went_wrong: str
    ai_evaluation: Optional[str]
    ai_suggestions: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Technology Schemas
class TechnologyResponse(BaseModel):
    id: str
    name: str
    category: str
    popularity: int
    description: str
    learning_path: str
    trending_score: float
    year: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# AI Mentor Schemas
class AIMentorQuestion(BaseModel):
    question: str

class AIMentorResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None
