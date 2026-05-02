# PrepSprint - Frontend (Next.js)

## Overview

PrepSprint Frontend is a modern, AI-powered career development platform built with Next.js, React, and Tailwind CSS.

## Features

- 📊 Interactive Dashboard with skill tracking
- 🗺️ Career Roadmap Builder
- 📈 Future Scope Analysis with market insights
- 🎤 AI-powered Interview Practice
- 📚 Skill Tracker with progress visualization
- 📄 AI-assisted Resume Builder

## Project Structure

```
app/
├── app/                         # Next.js App Router
│   ├── dashboard/page.js        # Dashboard page
│   ├── roadmap/page.js          # Career roadmap page
│   ├── scope/page.js            # Future scope analysis
│   ├── interview/page.js        # Interview practice
│   ├── skills/page.js           # Skill tracker
│   ├── resume/page.js           # Resume builder
│   ├── settings/page.js         # Settings page
│   ├── layout.js                # Root layout
│   └── globals.css              # Global styles
├── components/                  # Reusable components
│   ├── Sidebar.js
│   ├── Navbar.js
│   ├── ProgressRing.js
│   ├── LearningChart.js
│   ├── CareerPathCard.js
│   └── ...
├── lib/                         # Utilities
│   ├── api.js                   # API client
│   └── auth.js                  # Auth context
└── public/                      # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Key Features Implementation

### Dashboard

- Skill completion progress rings
- Learning analytics chart
- Recommended career paths
- Continue learning section

### Career Roadmap

- Phase-based roadmap visualization
- Milestone tracking
- Skill prerequisites
- Progress indicators

### Interview Practice

- AI-generated questions
- Real-time feedback analysis
- STAR method guidance
- Performance metrics

### Resume Builder

- Form-based resume editor
- Live preview panel
- AI-powered suggestions
- PDF export functionality

## API Integration

All components connect to the FastAPI backend at `http://localhost:8000/api`.

### Available Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `GET /api/skills` - Get user skills
- `POST /api/skills` - Create skill
- `GET /api/roadmap` - Get roadmap
- `POST /api/roadmap` - Create roadmap
- `POST /api/resume/analyze` - Analyze resume with AI
- `GET /api/interview/questions` - Get interview questions
- `POST /api/interview/feedback` - Get feedback on answer

## Styling

Uses Tailwind CSS with custom theme colors:

- Primary: Purple (#6366f1)
- Secondary: Indigo (#8b5cf6)
- Accent: Pink (#ec4899)

## Error Handling

- API errors are caught and displayed to users
- Loading states prevent duplicate submissions
- Validation happens on both client and server

## Performance

- Next.js automatic code splitting
- Optimized images
- Responsive design for all devices

## Future Enhancements

- User authentication with JWT
- Real-time notifications
- Advanced analytics
- Mobile app
- Dark mode support
