# GradConnect

An alumni-student networking platform: profiles, messaging, mentorship meetings, community discussions, events, interview prep, fundraising, and a leaderboard.

## Structure

- `GradConnect-backend/` — Node.js/Express + MongoDB API
- `alumni-network-glow-1/` — React + Vite + TypeScript frontend

## Local development

**Backend**
```bash
cd GradConnect-backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```

**Frontend**
```bash
cd alumni-network-glow-1
npm install
npm run dev
```

## Deployment

See `render.yaml` for the service topology (Node web service for the backend, static site for the frontend).
