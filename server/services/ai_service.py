import os
import json
from openai import OpenAI
from datetime import datetime

# Initialize OpenAI client with OpenRouter support
API_KEY = os.getenv('OPENAI_API_KEY', 'your_openai_api_key_here')
IS_MOCK = API_KEY == 'your_openai_api_key_here' or not API_KEY

# Determine if this is an OpenRouter key
IS_OPENROUTER = API_KEY.startswith("sk-or-")

if not IS_MOCK:
    if IS_OPENROUTER:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=API_KEY,
            default_headers={
                "HTTP-Referer": "http://localhost:3000", # Optional, for OpenRouter rankings
                "X-Title": "PrepSprint Career Planner", # Optional, for OpenRouter rankings
            }
        )
        DEFAULT_MODEL = "qwen/qwen-2.5-72b-instruct"
    else:
        client = OpenAI(api_key=API_KEY)
        DEFAULT_MODEL = "gpt-3.5-turbo"
else:
    client = None
    DEFAULT_MODEL = "mock-mode"

class AIService:
    @staticmethod
    def _clean_json_response(text: str) -> str:
        """Removes markdown code block formatting if present."""
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    @staticmethod
    def _get_mock_response(method: str, **kwargs) -> dict:
        """Mock responses for development when API key is missing."""
        if method == "analyze_skill_gaps":
            target_role = kwargs.get("target_role", "Engineer")
            return {
                "status": "success",
                "analysis": json.dumps({
                    "gaps": [
                        {"name": "System Design", "importance": "High", "desc": f"Advanced architectural patterns for {target_role}."},
                        {"name": "Cloud Native Protocols", "importance": "Medium", "desc": "Kubernetes and distributed state management."},
                        {"name": "Security Architecture", "importance": "High", "desc": "Zero-trust networking and IAM policies."}
                    ],
                    "suggestions": [
                        {"name": "Deeper Microservices study", "type": "Architecture"},
                        {"name": "AWS/GCP Professional Certs", "type": "Cloud"}
                    ],
                    "direction": f"Focus on high-level orchestration and state consistency as you scale toward senior {target_role} performance."
                })
            }
        
        if method == "generate_roadmap":
            target_role = kwargs.get("target_role", "Engineer")
            return {
                "status": "success",
                "roadmap": json.dumps({
                    "phases": [
                        {
                            "name": "Phase 1: Foundation",
                            "description": f"Master core competencies for {target_role}.",
                            "duration_months": 3,
                            "skills": "Core Logic, Data Structures, Git"
                        },
                        {
                            "name": "Phase 2: Specialization",
                            "description": "Deep dive into domain-specific technologies.",
                            "duration_months": 4,
                            "skills": "Advanced Frameworks, Testing, Docker"
                        },
                        {
                            "name": "Phase 3: Production",
                            "description": "Ready for high-availability engineering.",
                            "duration_months": 5,
                            "skills": "System Design, CI/CD, Observability"
                        }
                    ]
                })
            }
            
        if method == "analyze_resume":
            return {
                "status": "success",
                "feedback": "This is a mock feedback. Your resume shows strong potential in structural logic but could benefit from more quantitative impact metrics in your experience section."
            }
            
        if method == "generate_interview_questions":
            return {
                "status": "success",
                "questions": json.dumps([
                    {"question": "How do you handle consistency in distributed systems?", "hint": "Think about CAP theorem."},
                    {"question": "Explain the difference between JWT and Session tokens.", "hint": "Stateful vs Stateless."}
                ])
            }
            
        if method == "ask_mentor":
            return {
                "status": "success",
                "answer": "This is a mock answer from your AI mentor. I can recommend you focus on backend scalability. \n- Focus on databases\n- Focus on caching\n- Focus on load balancing"
            }
            
        if method == "ask_mentor":
            return {
                "status": "success",
                "answer": "This is a mock answer from your AI mentor. I can recommend you focus on backend scalability. \n- Focus on databases\n- Focus on caching\n- Focus on load balancing"
            }
            
        return {"status": "error", "error": "Mock mode: Unsupported AI method"}

    @staticmethod
    def analyze_resume(resume_text: str) -> dict:
        """Analyze resume using AI"""
        if IS_MOCK:
            return AIService._get_mock_response("analyze_resume")
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a professional resume reviewer. Provide constructive feedback and suggestions for improvement."},
                    {"role": "user", "content": f"Please review this resume and provide suggestions for improvement:\n\n{resume_text}"}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return {"feedback": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return {"error": str(e), "status": "error"}

    @staticmethod
    def generate_interview_questions(difficulty: str = "medium", count: int = 3) -> list:
        """Generate interview questions using AI"""
        if IS_MOCK:
            return AIService._get_mock_response("generate_interview_questions")
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert interview coach. Generate challenging but fair interview questions. Format result as JSON array of objects with 'question' and 'hint' fields."},
                    {"role": "user", "content": f"Generate {count} {difficulty} level technical interview questions for a Software Engineer role."}
                ],
                temperature=0.8,
                max_tokens=800
            )
            return {"questions": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return {"error": str(e), "status": "error"}

    @staticmethod
    def analyze_interview_answer(question: str, answer: str) -> dict:
        """Analyze interview answer and provide feedback"""
        if IS_MOCK:
            return {"feedback": "Mock feedback: Strong technical explanation, slightly improve clarity.", "status": "success"}
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert interview coach providing constructive feedback on candidate answers."},
                    {"role": "user", "content": f"Question: {question}\n\nAnswer: {answer}\n\nProvide feedback on clarity, relevance, and technical accuracy."}
                ],
                temperature=0.7,
                max_tokens=400
            )
            return {"feedback": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return {"error": str(e), "status": "error"}

    @staticmethod
    def generate_career_suggestions(skills: list, experience: str) -> dict:
        """Generate career path suggestions based on skills and experience"""
        if IS_MOCK:
            return {"suggestions": "Mock: Staff Engineer, Solutions Architect.", "status": "success"}
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a career counselor specializing in tech careers."},
                    {"role": "user", "content": f"Based on these skills: {', '.join(skills)} and experience: {experience}, what are the best career paths and next steps?"}
                ],
                temperature=0.8,
                max_tokens=600
            )
            return {"suggestions": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return {"error": str(e), "status": "error"}

    @staticmethod
    def generate_roadmap(target_role: str, interests: str) -> dict:
        """Generate a structured career roadmap using AI"""
        if IS_MOCK:
            return AIService._get_mock_response("generate_roadmap", target_role=target_role)
        try:
            response_format = { "type": "json_object" } if not IS_OPENROUTER else None
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a professional career architect. Generate a structured JSON roadmap for a technical role. Include 3 phases: Foundation, Specialization, and Production. Each phase must have: name, description, duration_months, and skills (comma separated). Format strictly as a JSON object with a 'phases' array."},
                    {"role": "user", "content": f"Generate a detailed engineering roadmap for the role of: {target_role}. My interests are: {interests}."}
                ],
                temperature=0.7,
                max_tokens=1000,
                response_format=response_format
            )
            return {"roadmap": AIService._clean_json_response(response.choices[0].message.content), "status": "success"}
        except Exception as e:
            return {"error": str(e), "status": "error"}

    @staticmethod
    def analyze_skill_gaps(current_skills: list, target_role: str) -> dict:
        """Analyze technical gaps between current skills and target role using AI"""
        if IS_MOCK:
            return AIService._get_mock_response("analyze_skill_gaps", target_role=target_role)
        try:
            response_format = { "type": "json_object" } if not IS_OPENROUTER else None
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a senior technical talent architect. Analyze skill gaps for a specific engineering role. Provide results in structured JSON. Include: 'gaps' (array of objects with name, importance, desc), 'suggestions' (array of objects with name, type), and 'direction' (string)."},
                    {"role": "user", "content": f"Target Role: {target_role}. Current Skills: {', '.join(current_skills)}. Identify top critical gaps and provide strategic direction."}
                ],
                temperature=0.7,
                max_tokens=1000,
                response_format=response_format
            )
            return {"analysis": AIService._clean_json_response(response.choices[0].message.content), "status": "success"}
        except Exception as e:
            return {"error": str(e), "status": "error"}

    @staticmethod
    def ask_mentor(question: str) -> dict:
        """Answer general career/tech questions as an AI Mentor"""
        if IS_MOCK:
            return AIService._get_mock_response("ask_mentor")
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a senior tech lead and career mentor. Answer the user's question clearly. If possible, provide 3 actionable bullet points at the end starting with '-'."},
                    {"role": "user", "content": question}
                ],
                temperature=0.8,
                max_tokens=600
            )
            return {"answer": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return {"error": str(e), "status": "error"}

