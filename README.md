# PrepSprint

PrepSprint is a full-stack career acceleration and skill development platform. It features an AI-powered resume builder, personalized career roadmap generator, tech stack guidance catalog, and individual skill trackers.

---

## Workspace Layout

The application codebase is structured as follows:

- **`client`**: Frontend user interface built using Next.js, React, and Tailwind CSS.
- **`server`**: Backend REST API built using FastAPI, connecting asynchronously to a MongoDB instance via Motor, and leveraging OpenAI/OpenRouter APIs for intelligent suggestions.

```
prepsprint/
├── client/                 # Next.js Frontend
│   ├── app/                # App router pages
│   ├── components/         # Shared UI components
│   └── lib/                # API client & authentication context
│
└── server/                 # FastAPI Backend
    ├── routers/            # Endpoint handlers
    ├── schemas/            # Request/Response validation schemas
    ├── services/           # AI services integrations
    └── utils/              # Email client utilities, helpers
```

---

## Key Features

- **Interactive Dashboard**: Consolidated overview of career progress and recommended tech stacks.
- **AI Career Roadmap Builder**: Tailored roadmap recommendations based on target roles and tech interests.
- **Interview Coach**: AI-powered mock interviews with performance feedback.
- **ATS Resume Builder**: Form-driven builder with live preview, AI-driven content analysis, and PDF exports.
- **Skill Progress Tracker**: Interactive journals to document daily learning achievements.

---

## Technology Stack

### Frontend
- Next.js (App Router)
- React
- Axios (HTTP client)
- Tailwind CSS (Vanilla styling)
- Lucide React (Icons)

### Backend
- FastAPI (Python REST framework)
- Uvicorn (ASGI server)
- MongoDB / Motor (Async database driver)
- Pydantic (Data validation)

---

## License

Proprietary. Developed by Techversoft Innovations. All rights reserved.