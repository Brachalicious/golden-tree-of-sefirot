# Golden Tree of Sefirot — PRD

## Original Problem Statement
"open my tree of life app" — repo: https://github.com/Brachalicious/golden-tree-of-sefirot

## Architecture
- **Frontend** (`/app/frontend`): static site served by `serve` on port 3000.
  Public assets live in `/app/frontend/public` (index.html, style.css, script.js,
  chatbot.js, sefirotInsights.js, sacredTexts.js, tree images, logo).
- **Backend** (`/app/backend`): FastAPI (uvicorn) on port 8001, exposes `/api/*`.
  - `POST /api/gemini` → Gemini-shaped `{candidates:[{content:{parts:[{text}]}}]}`
  - `POST /api/chatgpt` → `{message}` fallback
  - `GET /api/health`
  - Both LLM endpoints use `emergentintegrations.LlmChat` with the Universal LLM key.
- **Models**: Gemini `gemini-2.5-flash` (primary), OpenAI `gpt-4o` (fallback).
- **Ingress**: `/api/*` → backend:8001, everything else → frontend:3000.

## What's been implemented (2026-01)
- Cloned upstream repo and ported the two Netlify functions (`/.netlify/functions/gemini`
  and `/.netlify/functions/chatgpt`) into FastAPI endpoints at `/api/gemini`
  and `/api/chatgpt`.
- Frontend `index.html` updated to call the new `/api/*` paths.
- Kabbalistic Rebbe system prompt preserved (Sefirot diagnosis, Sefaria citations,
  HTML-formatted conversational responses).
- Both endpoints verified end-to-end via curl.

## Core Requirements
- Interactive Tree of Life with 10 clickable Sefirot + 22 Hebrew letter paths.
- Mystic Guide chat: rule-based diagnosis + LLM fallback (Gemini → OpenAI).
- Citations link out to Sefaria.

## Backlog / Future
- P1: Add persistent chat history (Mongo) per session.
- P2: Add audio narration of Sefirot teachings.
- P2: Daily mussar / mood-tracking journal tied to Sefirot.
- P2: Share-card generator for individual Sefirah readings.
