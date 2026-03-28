# GTM Intelligence — Master Project Instructions

## What Is This Project?
GTM Intelligence is a B2B SaaS CRM dashboard with an embedded
AI chat assistant. It is built as a portfolio piece to demonstrate
AI implementation skills for a job interview at Compound Growth
Marketing in Athens, Greece.

The app allows a marketing/sales team to:
- View their CRM pipeline data in a visual dashboard
- Ask plain English questions about their data via AI chat
- Get automatic AI-generated insights from their pipeline
- Sync data automatically from Google Sheets
- Generate AI-written pipeline reports in one click

## Tech Stack
| Layer        | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React + Tailwind CSS (from Stitch)  |
| Backend     | Python FastAPI                      |
| AI Model    | Claude API (claude-sonnet-4-20250514)|
| Vector DB   | Pinecone                            |
| Embeddings  | Cohere embed-english-v3.0 (free)    |
| Sheets Sync | gspread + Google Sheets API         |
| Deployment  | Vercel (frontend) + Cloud Run (backend)|

## Why Cohere for Embeddings?
Cohere has a free tier with no credit card required.
It replaces OpenAI embeddings — same quality, zero cost.
Pinecone index dimensions must be set to 1024 for Cohere.

## Project File Structure
```
GTM-Intelligence/
├── CLAUDE.md                    ← Master instructions (this file)
├── INITIAL_PROMPT.md            ← First build instructions
├── .claude/
│   └── skills/                  ← All skill files live here
├── frontend/
│   ├── src/
│   │   ├── components/          ← Stitch exported components
│   │   ├── hooks/
│   │   │   └── useChat.js       ← All chat state lives here
│   │   ├── services/
│   │   │   └── api.js           ← ALL API calls live here only
│   │   └── App.jsx
│   ├── .env                     ← VITE_API_URL only
│   └── package.json
├── backend/
│   ├── main.py                  ← FastAPI entry point
│   ├── routers/
│   │   ├── chat.py              ← POST /chat
│   │   ├── upload.py            ← POST /upload
│   │   ├── sync.py              ← POST /sync, GET /sync/status
│   │   ├── insights.py          ← GET /insights
│   │   └── report.py            ← GET /report
│   ├── services/
│   │   ├── pinecone_service.py  ← Pinecone + Cohere embeddings
│   │   ├── claude_service.py    ← Claude API calls
│   │   └── sheets_service.py    ← Google Sheets sync
│   ├── requirements.txt
│   └── .env                     ← All secret keys live here
└── data/
    └── demo_crm.csv             ← Fake CRM data for demo
```

## Environment Variables

### frontend/.env
```
VITE_API_URL=http://localhost:8000
```

### backend/.env
```
ANTHROPIC_API_KEY=your_key_here
PINECONE_API_KEY=your_key_here
PINECONE_INDEX_NAME=gtm-intelligence
COHERE_API_KEY=your_key_here
GOOGLE_SHEETS_CREDENTIALS={}
GOOGLE_SHEET_URL=your_sheet_url_here
```

## Pinecone Index Settings
- Index name: gtm-intelligence
- Dimensions: 1024 (Cohere embed-english-v3.0)
- Metric: cosine
- Cloud: AWS us-east-1 (free tier)

## API Endpoint Reference
| Method | Endpoint       | What It Does                        |
|--------|---------------|-------------------------------------|
| POST   | /chat         | RAG query → Claude answer           |
| POST   | /upload       | CSV → embed → Pinecone upsert       |
| POST   | /sync         | Google Sheet → Pinecone upsert      |
| GET    | /sync/status  | Returns last sync timestamp         |
| GET    | /insights     | Claude generates 4 pipeline insights|
| GET    | /report       | Claude writes full pipeline report  |
| GET    | /health       | Returns {"status": "ok"}            |

## Standard API Response Format
EVERY endpoint must return this exact structure:
```python
# Success
{"success": True, "data": <any>, "error": None}

# Failure
{"success": False, "data": None, "error": "message"}
```

## Demo Data
The app uses realistic fake B2B CRM data for the interview demo.

Sales reps: Armin A., Eren Y., Mikasa A., Levi R., Sasha B.
Companies: Rolf Inc., Cargo2go, Cloudzr, Idioma, Syllables +20 more
Pipeline value: $528,976.82
Top deal: $42,300 (Rolf Inc.)
Sources: Dribbble, Instagram, Behance, Google, LinkedIn

CSV columns:
company, contact, email, status, deal_value, last_contact,
owner, source, industry, notes

Statuses: Active, Stalled, Closed Won, Closed Lost, New

IMPORTANT: Some rows must have last_contact older than 30 days
so the demo query "which leads haven't been contacted in 30 days"
returns real results.

## Design Rules — NEVER CHANGE THESE
The UI was designed in Google Stitch and is locked.
- Primary accent: #E8175D (crimson)
- Background: #FAFAFA
- Card background: #FFFFFF
- Font: Inter
- Border radius: 16px
- NEVER rewrite Stitch components from scratch
- NEVER change colors, spacing or typography
- ONLY add logic and API connections on top

## Coding Rules — ALWAYS FOLLOW THESE
- Read relevant SKILL.md files before writing any code
- NEVER hardcode API keys — always use .env + python-dotenv
- ALWAYS wrap API calls in try/catch or try/except
- ALWAYS add CORS middleware to FastAPI
- Use async/await throughout FastAPI
- All frontend API calls go in services/api.js ONLY
- All chat state goes in hooks/useChat.js ONLY
- Run and test each task before moving to the next

## Interview Demo Script
When demoing this to Compound Growth Marketing:
1. Show the dashboard — live stats, charts, team leaderboard
2. Type in chat: "Which leads haven't been contacted in 30 days?"
3. Type in chat: "Who is our top performer this month?"
4. Type in chat: "Summarize pipeline from Dribbble leads"
5. Click Generate Report → show AI-written summary
6. Show sync status panel — explain the automation angle
7. Explain RAG architecture verbally:
   "CRM data is embedded into Pinecone as vectors.
    When you ask a question, it finds the most relevant
    records and passes them to Claude as context.
    Claude answers based on real data — not hallucinations."

## How to Get Free API Keys
- Anthropic: console.anthropic.com (you may already have this)
- Pinecone: pinecone.io → free tier, no credit card
- Cohere: cohere.com → free tier, no credit card
