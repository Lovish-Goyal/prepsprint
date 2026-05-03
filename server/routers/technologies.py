from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from database import get_db
from schemas.schemas import TechnologyResponse
from bson import ObjectId
from datetime import datetime
from utils.helpers import serialize_mongo_doc, serialize_mongo_list

router = APIRouter(prefix="/api/technologies", tags=["technologies"])

async def get_current_user(db = Depends(get_db)):
    user = await db.users.find_one({})
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# Expanded high-fidelity technical dataset
TRENDING_STACKS = [
    {"name": "AI/Machine Learning", "category": "AI & Data", "popularity": 98, "description": "Core intelligence for standard apps.", "learning_path": "Math → Python → PyTorch", "trending_score": 9.9},
    {"name": "LLM Engineering", "category": "AI & Data", "popularity": 96, "description": "Next-gen context management.", "learning_path": "NLP → LangChain → RAG", "trending_score": 9.8},
    {"name": "Rust Systems", "category": "Backend", "popularity": 88, "description": "Memory-safe high-performance systems.", "learning_path": "C++ → Ownership → Tokio", "trending_score": 9.5},
    {"name": "Go Microservices", "category": "Backend", "popularity": 92, "description": "Scalable cloud-native services.", "learning_path": "Go Basics → Concurrency → gRPC", "trending_score": 9.4},
    {"name": "Next.js / React", "category": "Frontend", "popularity": 95, "description": "The standard for modern web apps.", "learning_path": "JS → React → Server Components", "trending_score": 9.2},
    {"name": "TypeScript Architect", "category": "Frontend", "popularity": 94, "description": "Type-safe engineering across the stack.", "learning_path": "JS → Advanced TS → Design Patterns", "trending_score": 9.1},
    {"name": "Kubernetes Orchestration", "category": "DevOps", "popularity": 90, "description": "Cloud-native infrastructure scale.", "learning_path": "Docker → YAML → Helm → GitOps", "trending_score": 9.6},
    {"name": "Terraform (IaC)", "category": "DevOps", "popularity": 85, "description": "Infrastructure as Code protocols.", "learning_path": "Cloud → HCL → Module Design", "trending_score": 8.9},
    {"name": "Cloud Security / Zero Trust", "category": "Security", "popularity": 82, "description": "Modern perimeter-less security.", "learning_path": "Networking → IAM → OIDC → CSPM", "trending_score": 9.3},
    {"name": "Penetration Testing", "category": "Security", "popularity": 78, "description": "Advanced offensive security analysis.", "learning_path": "Linux → BurpSuite → OWASP → OSCP", "trending_score": 8.7},
    {"name": "Flutter Multi-Platform", "category": "Mobile", "popularity": 80, "description": "High-performance hybrid mobile UI.", "learning_path": "Dart → Widgets → GetX → Native Plugins", "trending_score": 8.5},
    {"name": "Swift/iOS Native", "category": "Mobile", "popularity": 75, "description": "Elite iOS software engineering.", "learning_path": "Swift → SwiftUI → Combine → CoreData", "trending_score": 8.4},
    {"name": "PostgreSQL Mastery", "category": "Database", "popularity": 93, "description": "The relational engine for engineers.", "learning_path": "SQL → Indexing → PL/pgSQL → GIS", "trending_score": 9.0},
    {"name": "MongoDB (NoSQL)", "category": "Database", "popularity": 89, "description": "Document-driven schema-less scale.", "learning_path": "JSON → CRUD → Aggregation → Atlas", "trending_score": 8.8},
    {"name": "WebAssembly (Wasm)", "category": "Emerging", "popularity": 65, "description": "Near-native performance in browser.", "learning_path": "C/Rust → WebAssembly → Emscripten", "trending_score": 8.3},
    {"name": "Quantum Computing", "category": "Emerging", "popularity": 55, "description": "The logic of the next trillion years.", "learning_path": "Linear Algebra → Qiskit → Algorithms", "trending_score": 8.1},
    {"name": "Solidity (Web3)", "category": "Emerging", "popularity": 70, "description": "Smart contract logic for Ethereum.", "learning_path": "Blockchain → EVM → Solidity → HardHat", "trending_score": 7.9},
    {"name": "ArgoCD / GitOps", "category": "DevOps", "popularity": 82, "description": "Continuous delivery for Kubernetes.", "learning_path": "K8s → Git → Sync Policies", "trending_score": 8.6},
    {"name": "GraphQL API Design", "category": "Backend", "popularity": 84, "description": "Efficient query languages for APIs.", "learning_path": "REST → Schema Design → Resolvers", "trending_score": 8.5},
    {"name": "Three.js / WebGL", "category": "Frontend", "popularity": 72, "description": "3D visual architecture in the web.", "learning_path": "Geometry → Shaders → React-Three-Fiber", "trending_score": 8.2}
]

@router.get("/")
async def get_technologies(
    category: Optional[str] = None,
    db = Depends(get_db)
):
    """Fetch the full catalog of trending technologies for 2026"""
    # Initialize if less than 20
    count = await db.technologies.count_documents({"year": 2026})
    if count < 20:
        await db.technologies.delete_many({"year": 2026})
        await db.technologies.insert_many([{**t, "year": 2026, "created_at": datetime.utcnow()} for t in TRENDING_STACKS])
    
    query = {"year": 2026}
    if category and category != "All":
        query["category"] = category
        
    cursor = db.technologies.find(query).sort("trending_score", -1)
    techs = await cursor.to_list(length=100)
    
    return serialize_mongo_list(techs)

@router.get("/categories")
async def get_technology_categories(db = Depends(get_db)):
    """Fetch distinct architectural categories available in the protocol"""
    categories = await db.technologies.distinct("category", {"year": 2026})
    return sorted(categories)

@router.get("/{tech_id}")
async def get_technology_details(tech_id: str, db = Depends(get_db)):
    """Fetch deep-dive information for a specific technological primitive"""
    tech = await db.technologies.find_one({"_id": ObjectId(tech_id)})
    if not tech:
        raise HTTPException(status_code=404, detail="Technology not found")
    
    return serialize_mongo_doc(tech)
