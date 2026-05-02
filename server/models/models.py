from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    skills = relationship("Skill", back_populates="user")
    roadmap = relationship("Roadmap", back_populates="user")
    resume = relationship("Resume", back_populates="user")

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    proficiency = Column(Float, default=0)
    hours_spent = Column(Float, default=0)
    level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="skills")

class Roadmap(Base):
    __tablename__ = "roadmaps"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    target_role = Column(String)
    duration_months = Column(Integer)
    primary_interests = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="roadmap")
    phases = relationship("RoadmapPhase", back_populates="roadmap")

class RoadmapPhase(Base):
    __tablename__ = "roadmap_phases"
    
    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"))
    phase_number = Column(Integer)
    name = Column(String)
    description = Column(Text)
    duration_months = Column(Integer)
    skills = Column(Text)
    status = Column(String, default="pending")
    progress = Column(Float, default=0)
    
    roadmap = relationship("Roadmap", back_populates="phases")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(String)
    email = Column(String)
    phone = Column(String)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="resume")

class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question = Column(Text)
    answer = Column(Text)
    difficulty = Column(String)
    confidence = Column(Float)
    pace = Column(String)
    keywords = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class SkillTracker(Base):
    __tablename__ = "skill_tracker"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_name = Column(String, index=True)
    description = Column(Text)
    what_went_right = Column(Text)
    what_went_wrong = Column(Text)
    ai_evaluation = Column(Text)
    ai_suggestions = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Technology(Base):
    __tablename__ = "technologies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String, index=True)
    popularity = Column(Integer, default=0)
    description = Column(Text)
    learning_path = Column(Text)
    trending_score = Column(Float, default=0)
    year = Column(Integer, default=2026)
    created_at = Column(DateTime, default=datetime.utcnow)
