# Zenora (StudyBuddy)

This repository contains a study assistant with a frontend (Vite + React + Tailwind) and a backend (Express + MongoDB + optional Gemini AI integration).

## Quick start

1. Install dependencies

```powershell
cd 'C:\Users\shraj\OneDrive\Desktop\Zenora'
npm install
cd studybuddy-frontend
npm install
cd ..\studybuddy-backend
npm install
```

2. Configure environment (backend)

Copy `studybuddy-backend/.env.example` to `studybuddy-backend/.env` and fill values if needed.

```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
MONGODB_URI=mongodb://localhost:27017/studybuddy
PORT=5000
```

If `GEMINI_API_KEY` is not set, the backend will use a local fallback mock model for development.

3. Start servers

Start backend:

```powershell
cd studybuddy-backend
npm run dev
```

Start frontend:

```powershell
cd studybuddy-frontend
npm run dev
```

Or from repository root (runs both concurrently):

```powershell
cd 'C:\Users\shraj\OneDrive\Desktop\Zenora'
npm run dev
```

## API quick tests (PowerShell)

```powershell
Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -Method GET
Invoke-RestMethod -Uri 'http://localhost:5000/api/chat' -Method POST -ContentType 'application/json' -Body (@{ question='What is 2+2?'; userId='guest' } | ConvertTo-Json)
```

## Troubleshooting

- If you see `Invalid hook call` errors or React hook issues, the most common cause is multiple React copies. I added `dedupe: ['react','react-dom']` to `studybuddy-frontend/vite.config.js` to force a single React instance.
- If the frontend complains about `style jsx` or similar, styled-jsx is not configured — the codebase uses Tailwind and PostCSS; inline CSS blocks using `@apply` may cause warnings unless processed by your build pipeline. I removed unsupported `jsx` attributes from style tags.
- Provide any Vite or Node terminal logs if something still fails and I'll patch quickly.

If you want, I can start the frontend here, reproduce any Vite errors, and fix them.
