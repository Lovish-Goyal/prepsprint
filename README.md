# PrepSprint - Full-Stack Career Development Platform

Welcome to **PrepSprint**! This is a comprehensive, AI-powered career development platform that helps professionals track skills, build career roadmaps, prepare for interviews, and develop their resumes with AI assistance.

## 🎯 Overview

PrepSprint consists of:

- **Frontend**: Modern Next.js application with React and Tailwind CSS
- **Backend**: FastAPI server with AI integration (OpenAI)
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL support

## 📋 Project Structure

```
prepsprint/
├── app/                    # Next.js Frontend
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── lib/              # Utilities (API client, auth)
│   ├── package.json
│   └── README.md
│
├── server/                # FastAPI Backend
│   ├── routers/          # API route handlers
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic & AI
│   ├── utils/            # Helper functions
│   ├── main.py           # FastAPI app entry
│   ├── database.py
│   ├── requirements.txt
│   └── README.md
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- OpenAI API key (for AI features)

### 1. Frontend Setup (Next.js)

```bash
cd app
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 2. Backend Setup (FastAPI)

```bash
cd server
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your OpenAI API key to .env

python main.py
```

Backend runs at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## 🎨 Frontend Features

### 📊 Dashboard

- Skill completion tracking with progress rings
- Learning analytics and weekly activity charts
- Recommended career paths
- Continue learning section with course progress

### 🗺️ Career Roadmap Builder

- Phase-based roadmap visualization
- Milestone tracking and progress indicators
- Skill prerequisites display
- Timeline management

### 📈 Future Scope Analysis

- Industry demand projections
- Salary trajectory visualization
- Global opportunity hubs
- Skill saturation analysis

### 🎤 Interview Practice (AI-Powered)

- AI-generated interview questions
- Real-time performance analysis
- Confidence and pace tracking
- Keyword detection
- STAR method guidance

### 📚 Skill Tracker

- Individual skill proficiency tracking
- Weekly activity breakdown
- Achievement badges
- Monthly goal tracking

### 📄 Resume Builder (AI-Powered)

- Form-based resume editor
- Live preview panel
- AI suggestions for improvement
- PDF export functionality
- Content analysis

## 🧠 AI Features

All AI features use OpenAI's GPT-3.5-turbo model:

1. **Resume Analysis**: Get detailed feedback on resume quality and suggestions
2. **Interview Questions**: Generate contextual interview questions
3. **Interview Feedback**: Analyze answers and provide constructive feedback
4. **Career Suggestions**: Get personalized career path recommendations

## 🔌 API Endpoints

### Authentication

```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
```

### User Profile

```
GET  /api/user/profile     - Get user profile
```

### Skills

```
GET  /api/skills           - Get all user skills
POST /api/skills           - Create new skill
PUT  /api/skills/{id}      - Update skill
DEL  /api/skills/{id}      - Delete skill
```

### Roadmap

```
GET  /api/roadmap          - Get user roadmap
POST /api/roadmap          - Create roadmap
PUT  /api/roadmap/{id}     - Update roadmap
```

### Resume (AI-Powered)

```
POST /api/resume/analyze   - Analyze resume with AI
GET  /api/resume/{id}/suggestions - Get AI suggestions
POST /api/resume           - Create/update resume
```

### Interview (AI-Powered)

```
GET  /api/interview/questions    - Get interview questions
POST /api/interview/feedback     - Get feedback on answer
GET  /api/interview/history      - Get interview history
```

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend

- **Framework**: FastAPI
- **Server**: Uvicorn
- **ORM**: SQLAlchemy
- **Database**: SQLite (dev), PostgreSQL (production)
- **Validation**: Pydantic
- **Auth**: JWT tokens (optional)
- **AI**: OpenAI API

## 🔐 Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (.env)

```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=sqlite:///./prepsprint.db
ENVIRONMENT=development
```

## 💻 Development Workflow

### Running Both Frontend and Backend

**Terminal 1 - Backend**:

```bash
cd server
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

**Terminal 2 - Frontend**:

```bash
cd app
npm run dev
```

Then visit: `http://localhost:3000`

### Database Migrations

Tables are automatically created on startup. To reset:

1. Delete `prepsprint.db` file
2. Restart backend

## 📝 Project Features

### User-Centric Dashboard

- At-a-glance career progress
- Personalized recommendations
- Learning insights

### AI-Powered Assistance

- Resume optimization suggestions
- Intelligent interview practice
- Career path recommendations

### Comprehensive Tracking

- Skill proficiency monitoring
- Learning hours analytics
- Achievement system

### Career Planning

- Structured roadmap creation
- Phase-based progression
- Market analysis insights

## 🎨 Design System

The platform follows a modern SaaS design:

- **Color Scheme**: Purple/indigo gradient with pink accents
- **Typography**: Clean, modern sans-serif
- **Spacing**: 8px baseline grid
- **Components**: Rounded cards, smooth transitions
- **Responsive**: Mobile-first design

### Color Palette

- Primary: #6366f1 (Purple)
- Secondary: #8b5cf6 (Indigo)
- Accent: #ec4899 (Pink)
- Background: #f8f9fa
- Text: #0f172a

## 📱 Responsive Design

All pages are fully responsive:

- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd app
npm run build
# Deploy to Vercel
```

### Backend (Heroku/Railway/AWS)

```bash
cd server
# Set environment variables on your platform
# Deploy with Gunicorn + Uvicorn
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

## 🐛 Troubleshooting

### Frontend won't connect to backend

- Ensure backend is running on `http://localhost:8000`
- Check CORS is enabled in FastAPI
- Verify `NEXT_PUBLIC_API_URL` is correct

### OpenAI API errors

- Verify API key is set in `.env`
- Check account has sufficient credits
- Review rate limiting

### Database issues

- Delete `prepsprint.db` and restart
- Check DATABASE_URL setting
- Verify SQLAlchemy installation

## 📄 License

This project is proprietary.

## 🙋 Support

For issues or questions, please check:

1. `app/README.md` for frontend-specific issues
2. `server/README.md` for backend-specific issues
3. API documentation at `http://localhost:8000/docs`

---

**Happy coding!** 🚀

Built with ❤️ for career development professionals.
#   p r e p s p r i n t  
 