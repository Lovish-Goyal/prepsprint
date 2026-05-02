# PrepSprint - Backend (FastAPI)

## Overview

PrepSprint Backend is a robust FastAPI server providing AI-powered APIs for career development, skill tracking, resume analysis, and interview preparation.

## Features

- 🔐 User authentication and authorization
- 🧠 AI-powered resume analysis using OpenAI
- 🤖 Intelligent interview question generation
- 📊 Skill tracking and analytics
- 🗺️ Career roadmap generation
- 📚 Interview feedback system
- 🔄 CORS enabled for frontend integration

## Project Structure

```
server/
├── main.py                      # FastAPI application entry point
├── database.py                  # Database configuration
├── requirements.txt             # Python dependencies
├── routers/
│   ├── auth.py                  # Authentication routes
│   ├── user.py                  # User profile routes
│   ├── skills.py                # Skill management routes
│   ├── roadmap.py               # Roadmap routes
│   ├── resume.py                # Resume management routes
│   └── interview.py             # Interview practice routes
├── models/
│   └── models.py                # SQLAlchemy ORM models
├── schemas/
│   └── schemas.py               # Pydantic schemas
├── services/
│   └── ai_service.py            # AI integration service
├── utils/
│   └── helpers.py               # Utility functions
└── .env.example                 # Environment variables template
```

## Getting Started

### Prerequisites

- Python 3.9+
- pip

### Installation

```bash
cd server
pip install -r requirements.txt
```

### Environment Setup

Create `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./prepsprint.db
ENVIRONMENT=development
```

### Running the Server

```bash
python main.py
# or
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## Database Models

### User

- id (Primary Key)
- email (Unique)
- username (Unique)
- hashed_password
- full_name
- created_at

### Skill

- id (Primary Key)
- user_id (Foreign Key)
- name
- proficiency (0-100)
- hours_spent
- level
- created_at

### Roadmap

- id (Primary Key)
- user_id (Foreign Key)
- target_role
- duration_months
- primary_interests
- created_at
- updated_at

### RoadmapPhase

- id (Primary Key)
- roadmap_id (Foreign Key)
- phase_number
- name
- description
- duration_months
- skills
- status
- progress

### Resume

- id (Primary Key)
- user_id (Foreign Key)
- full_name
- email
- phone
- content
- created_at
- updated_at

### InterviewSession

- id (Primary Key)
- user_id (Foreign Key)
- question
- answer
- difficulty
- confidence
- pace
- keywords
- created_at

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User

- `GET /api/user/profile` - Get user profile

### Skills

- `GET /api/skills` - Get all user skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill

### Roadmap

- `GET /api/roadmap` - Get user roadmap
- `POST /api/roadmap` - Create roadmap
- `PUT /api/roadmap/{id}` - Update roadmap

### Resume

- `POST /api/resume/analyze` - Analyze resume with AI
- `GET /api/resume/{id}/suggestions` - Get AI suggestions for resume
- `POST /api/resume` - Create/update resume

### Interview

- `GET /api/interview/questions` - Get interview questions
- `POST /api/interview/feedback` - Submit answer and get feedback
- `GET /api/interview/history` - Get interview history

## AI Services

### OpenAI Integration

The `AIService` class provides AI-powered features:

#### Resume Analysis

```python
AIService.analyze_resume(resume_text: str) -> dict
```

Analyzes resume and provides improvement suggestions.

#### Interview Questions

```python
AIService.generate_interview_questions(difficulty: str) -> list
```

Generates interview questions based on difficulty level.

#### Interview Feedback

```python
AIService.analyze_interview_answer(question: str, answer: str) -> dict
```

Analyzes interview answer and provides constructive feedback.

#### Career Suggestions

```python
AIService.generate_career_suggestions(skills: list, experience: str) -> dict
```

Suggests career paths based on skills and experience.

## Authentication

Current implementation uses mock authentication. For production:

1. Implement JWT token generation
2. Add token validation middleware
3. Store tokens securely
4. Implement refresh token mechanism

## CORS Configuration

CORS is enabled for:

- `http://localhost:3000`
- `http://localhost:3001`

Update in `main.py` for production URLs.

## Database

- SQLite by default (`test.db`)
- Supports PostgreSQL (set DATABASE_URL)
- Uses SQLAlchemy ORM

### Creating Database Tables

Tables are automatically created on startup due to:

```python
Base.metadata.create_all(bind=engine)
```

## Error Handling

- HTTP exceptions for common errors
- Validation via Pydantic schemas
- Detailed error messages in responses

## Security Considerations

- Passwords hashed with bcrypt
- CORS middleware for XSS protection
- Input validation with Pydantic
- Database query parameterization

## Performance

- Dependency injection for database sessions
- Efficient query patterns
- OpenAI API caching opportunities
- Database indexing on frequently queried fields

## Future Enhancements

- JWT token authentication
- Rate limiting
- Caching layer (Redis)
- Websocket support for real-time updates
- File upload handling
- Advanced analytics
- Email notifications
- Database migration system (Alembic)

## Testing

Create `test_main.py` for API testing:

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
```

## Troubleshooting

### OpenAI API Errors

- Verify API key is set in `.env`
- Check OpenAI account has credits
- Monitor API usage

### Database Issues

- Delete existing `.db` file to reset
- Check database URL in `.env`

### CORS Issues

- Verify frontend URL is in `allow_origins`
- Check preflight requests are being handled

## Deployment

Prepare for production:

1. Use PostgreSQL instead of SQLite
2. Implement JWT authentication
3. Set up proper error logging
4. Configure environment variables
5. Use production ASGI server (Gunicorn + Uvicorn)
6. Enable HTTPS
7. Set up database backups
