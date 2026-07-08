from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from schemas.schemas import RoadmapCreate, RoadmapResponse
from services.ai_service import AIService
import json
from datetime import datetime
from bson import ObjectId
from utils.helpers import serialize_mongo_doc

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])

from utils.auth import get_current_user

@router.get("/")
async def get_roadmap(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Fetch the current architectural blueprint for the user"""
    roadmap = await db.roadmaps.find_one({"user_id": str(current_user["id"])})
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
    user_id = str(current_user["id"])
    
    # ── Input career and tech stack validation ──────────────────────────────
    valid_roles_keywords = [
        "qa", "quality", "test", "sdet", "tester", "frontend", "front-end", "front end", 
        "ui developer", "ui engineer", "web developer", "backend", "back-end", "back end", 
        "server-side", "api developer", "full stack", "fullstack", "full-stack", "mern", 
        "mean", "devops", "dev ops", "sre", "site reliability", "platform engineer", 
        "infrastructure", "cloud engineer", "cloud architect", "data scientist", "data science", 
        "ml engineer", "machine learning", "ai engineer", "artificial intelligence", 
        "deep learning", "mobile", "android", "ios", "flutter", "react native", "app developer", 
        "data engineer", "data engineering", "etl", "data pipeline", "cybersecurity", 
        "security analyst", "pentester", "penetration", "infosec", "soc analyst", "sde", 
        "software engineer", "software developer", "programmer", "engineer", "developer",
        "product manager", "scrum master", "database administrator", "dba", "solutions architect"
    ]
    
    valid_techs_keywords = [
        "html", "css", "javascript", "js", "typescript", "ts", "react", "vue", "angular", 
        "svelte", "next", "nextjs", "nuxt", "tailwind", "sass", "scss", "webpack", "vite", 
        "git", "figma", "node", "nodejs", "graphql", "redux", "jest", "cypress", "storybook",
        "python", "java", "go", "golang", "rust", "c#", "php", "ruby", "sql", "postgresql", 
        "mysql", "mongodb", "redis", "docker", "kubernetes", "rest", "grpc", "kafka", 
        "rabbitmq", "django", "flask", "fastapi", "spring", "express", "nestjs", "linux", 
        "bash", "shell", "terraform", "ansible", "jenkins", "aws", "gcp", "azure", 
        "prometheus", "grafana", "nginx", "helm", "argocd", "r", "tensorflow", "pytorch", 
        "keras", "scikit-learn", "pandas", "numpy", "matplotlib", "jupyter", "spark", 
        "hadoop", "mlflow", "airflow", "tableau", "power bi", "kotlin", "swift", "dart", 
        "firebase", "sqlite", "xcode", "android studio", "swiftui", "jetpack compose", 
        "snowflake", "dbt", "scala", "wireshark", "nmap", "burp suite", "metasploit", 
        "splunk", "kali", "c++"
    ]
    
    target_role_lower = roadmap_data.target_role.lower().strip()
    primary_interests_lower = roadmap_data.primary_interests.lower().strip()
    
    role_valid = any(kw in target_role_lower for kw in valid_roles_keywords)
    tech_valid = any(kw in primary_interests_lower for kw in valid_techs_keywords)
    
    if not role_valid or not tech_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unrecognized Job Role or Technology Stack. Please specify a standard technology role (e.g. 'Frontend Developer', 'DevOps Engineer') and a valid technology stack (e.g. 'React', 'Python', 'AWS')."
        )
    
    # Generate roadmap phases via AI
    ai_result = AIService.generate_roadmap(
        roadmap_data.target_role, 
        roadmap_data.primary_interests,
        roadmap_data.target_level
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
        import traceback
        print("=" * 60)
        print("ERROR: AI ROADMAP RESPONSE PARSING FAILED!")
        print("Raw AI response content was:")
        print(ai_result.get("roadmap"))
        print("-" * 60)
        print("Parse Exception details:")
        traceback.print_exc()
        print("=" * 60)
        fallback_roadmap = AIService._generate_dynamic_local_roadmap(
            roadmap_data.target_role, 
            roadmap_data.primary_interests,
            roadmap_data.target_level
        )
        roadmap_content = json.loads(fallback_roadmap)
        phases = roadmap_content.get("phases", [])
        ai_result["warning"] = "AI Response Malformed: Using offline dynamic blueprint fallback."

    # Persist the roadmap
    new_roadmap = {
        "user_id": user_id,
        "target_role": roadmap_data.target_role,
        "target_level": roadmap_data.target_level,
        "primary_interests": roadmap_data.primary_interests,
        "phases": phases,
        "created_at": datetime.utcnow()
    }
    if ai_result.get("warning"):
        new_roadmap["warning"] = ai_result["warning"]
    
    # Remove existing roadmap for clean update
    await db.roadmaps.delete_many({"user_id": user_id})
    result = await db.roadmaps.insert_one(new_roadmap)
    
    new_roadmap["id"] = str(result.inserted_id)
    if "_id" in new_roadmap:
        del new_roadmap["_id"]
    return new_roadmap
