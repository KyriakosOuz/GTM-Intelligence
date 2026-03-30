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
- Receive daily automated email + Slack reports every morning

## Tech Stack
| Layer         | Technology                           |
|--------------|--------------------------------------|
| Frontend     | React + Tailwind CSS (from Stitch)   |
| Backend      | Python FastAPI                       |
| AI Model     | Claude API (claude-sonnet-4-20250514)|
| Vector DB    | Pinecone                             |
| Embeddings   | Cohere embed-english-v3.0 (free)     |
| Email        | Gmail SMTP                           |
| Alerts       | Slack Incoming Webhooks              |
| Scheduler    | Python schedule library              |
| Sheets Sync  | gspread + Google Sheets API (optional)|
| Deployment   | Vercel (frontend) + Cloud Run (backend)|

## Project File Structure
```
GTM-Intelligence/
├── CLAUDE.md                    ← Master instructions (this file)
├── INITIAL_PROMPT.md            ← First build instructions
├── EXPANSION.md                 ← Multi-page expansion build
├── AUTOMATION.md                ← Daily email + Slack automation
├── REVIEW.md                    ← Base app QA checklist
├── REVIEW_EXPANSION.md          ← Expansion QA checklist
├── .claude/
│   └── skills/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Deals.jsx
│   │   │   ├── Intelligence.jsx
│   │   │   ├── Network.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Settings.jsx
│   │   ├── hooks/useChat.js
│   │   ├── services/api.js
│   │   └── App.jsx
│   ├── .env
│   └── package.json
├── backend/
│   ├── main.py
│   ├── scheduler.py
│   ├── routers/
│   │   ├── chat.py
│   │   ├── upload.py
│   │   ├── sync.py
│   │   ├── insights.py
│   │   ├── report.py
│   │   ├── leads.py
│   │   ├── team.py
│   │   ├── stats.py
│   │   └── automation.py
│   ├── services/
│   │   ├── pinecone_service.py
│   │   ├── claude_service.py
│   │   ├── sheets_service.py
│   │   ├── email_service.py
│   │   └── slack_service.py
│   ├── requirements.txt
│   └── .env
└── data/
    ├── demo_crm.csv
    ├── test_saas_pipeline.csv
    ├── test_marketing_agencies.csv
    ├── test_ecommerce.csv
    ├── test_fintech.csv
    └── test_mixed_industries.csv
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
GMAIL_ADDRESS=kyriakos.ouzounis@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
REPORT_EMAIL_TO=kyriakos.ouzounis@gmail.com
SLACK_WEBHOOK_URL=your_webhook_url_here
REPORT_HOUR=9
REPORT_MINUTE=0
GOOGLE_SHEETS_CREDENTIALS=
GOOGLE_SHEET_URL=
```

## Pinecone Index Settings
- Index name: gtm-intelligence
- Dimensions: 1024 (Cohere embed-english-v3.0)
- Metric: cosine
- Cloud: AWS us-east-1 (free tier)

## API Endpoint Reference
| Method | Endpoint             | What It Does                        |
|--------|---------------------|-------------------------------------|
| GET    | /health             | Returns {"status": "ok"}            |
| POST   | /chat               | RAG query → Claude answer           |
| POST   | /upload             | CSV → embed → Pinecone upsert       |
| POST   | /sync               | Google Sheet → Pinecone upsert      |
| GET    | /sync/status        | Returns last sync timestamp         |
| GET    | /insights           | Claude generates 4 pipeline insights|
| GET    | /report             | Claude writes full pipeline report  |
| GET    | /leads              | Returns all CRM records             |
| GET    | /team               | Returns team stats by rep           |
| GET    | /stats              | Returns aggregated pipeline stats   |
| POST   | /automation/trigger | Manually runs daily automation now  |
| GET    | /automation/status  | Returns scheduler status + next run |

## Standard API Response Format
```python
{"success": True, "data": <any>, "error": None}
{"success": False, "data": None, "error": "message"}
```

## Daily Automation Flow
Every day at 9:00 AM (and on manual trigger):
```
1. get_all_records() from Pinecone
2. generate_report() via Claude API
3. get_stalled_leads() → last_contact > 30 days ago
4. send_email() → HTML report to kyriakos.ouzounis@gmail.com
5. send_slack_message() → stalled deals alert
6. send_slack_message() → report sent notification
```

## Pages Reference
| Route          | Page          | What It Shows                      |
|---------------|---------------|------------------------------------|
| /             | Dashboard     | Full dashboard + chat bar          |
| /deals        | Deals         | Sortable CRM data table            |
| /intelligence | Intelligence  | Full-page AI chat                  |
| /network      | Network       | Team performance cards             |
| /reports      | Reports       | AI report generation               |
| /settings     | Settings      | CSV upload + automation panel      |

## Demo Data
- Sales reps: Armin A., Eren Y., Mikasa A., Levi R., Sasha B.
- Pipeline value: $528,976.82
- Top deal: $42,300 (Rolf Inc.)
- Total records: 26 in Pinecone
- Stalled leads: Polaris Shipping, Maplewood Partners, Idioma

## Design Rules — NEVER CHANGE
- Primary accent: #E8175D (crimson)
- Background: #FAFAFA
- Card background: #FFFFFF
- Font: Inter
- Border radius: 16px
- NEVER rewrite Stitch components from scratch
- NEVER change colors, spacing or typography

## Coding Rules — ALWAYS FOLLOW
- Read relevant SKILL.md files before writing any code
- NEVER hardcode API keys — always use .env
- ALWAYS wrap API calls in try/catch or try/except
- ALWAYS add CORS middleware to FastAPI
- Use async/await throughout FastAPI
- All API calls in services/api.js ONLY
- All chat state in hooks/useChat.js ONLY
- Scheduler runs in background daemon thread

## How to Run
```bash
# Terminal 1 — Backend
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend && npm run dev

# Browser
http://localhost:5173
```

## Interview Demo Script

### Part 1 — Dashboard (2 min)
Show all stat cards, scroll to leaderboard and chart.

### Part 2 — AI Chat (2 min)
Type in chat:
1. "Which leads haven't been contacted in 30 days?"
2. "Who is our top performer this month?"

Say: "It answers based on real CRM data. Data is embedded
as vectors in Pinecone, questions trigger similarity search,
Claude answers with actual records as context."

### Part 3 — Reports Page (1 min)
Click Generate Report → show AI-written markdown report.

### Part 4 — Automation Live Demo (2 min)
Go to Settings → Automation Panel → click Run Now.
Switch to Gmail → refresh → show branded email arriving live.
Show Slack notification.

Say: "This runs automatically every morning at 9am.
Zero manual work."

### Part 5 — Tech Stack (1 min)
"React + FastAPI + Claude API + Pinecone + Cohere + Gmail + Slack.
Built in 4 days using Claude Code."

## Talking Points

Q: How does AI chat work?
A: RAG — data embedded in Pinecone, questions find relevant
   records, Claude answers based on real data.

Q: What is the automation?
A: Python scheduler runs at 9am daily, generates Claude report,
   emails it and sends Slack stalled deal alerts.

Q: Why Pinecone?
A: Semantic search — finds conceptually related records
   even without exact keyword matches.

Q: Can it connect to HubSpot/Salesforce?
A: Yes — add a sync endpoint pulling from their API.
   Same embedding pipeline, different data source.

Q: How long to build?
A: 4 days using Claude Code to accelerate development.
