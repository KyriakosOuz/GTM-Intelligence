<div align="center">

# GTM Intelligence

### The AI-Powered CRM Dashboard for B2B Sales Teams

**Ask questions about your pipeline in plain English. Get answers backed by real data.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Claude API](https://img.shields.io/badge/Claude_API-Sonnet_4-D97757?style=flat-square&logo=anthropic&logoColor=white)](https://anthropic.com)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-000?style=flat-square)](https://pinecone.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

<div align="center">
<img src="frontend/public/dashboard-preview.png" alt="GTM Intelligence Dashboard" width="800" />
<br />
<sub>Live dashboard with AI chat assistant pinned at bottom</sub>
</div>

---

## What is GTM Intelligence?

GTM Intelligence turns your CRM data into a conversational AI experience. Instead of digging through spreadsheets and filters, your sales team simply **asks questions** and gets instant, accurate answers powered by RAG (Retrieval-Augmented Generation).

**The problem:** Sales managers waste hours manually slicing pipeline data to find stalled deals, compare rep performance, or prep for weekly reviews.

**The solution:** Upload your CRM data once. Ask anything. The AI retrieves the relevant records from a vector database and generates answers grounded in your actual data — no hallucinations.

---

## Key Features

### AI Chat Assistant
A conversational interface pinned at the bottom of the dashboard. Ask natural language questions like:
- *"Which leads haven't been contacted in 30 days?"*
- *"Who is our top performer this month?"*
- *"Summarize the pipeline from Dribbble leads"*
- *"What is the total value of stalled deals?"*

The assistant automatically detects broad vs. specific queries and adjusts how much data it retrieves to give accurate answers.

### Visual Pipeline Dashboard
Seven KPI cards, source breakdown charts, team leaderboard, pipeline velocity by rep, sales trend lines — all in a single view designed with the **Crimson Catalyst** design system.

### One-Click Reports
Hit the `/report` endpoint and get a full markdown pipeline report with Executive Summary, Top Deals, Risk Areas, and Recommendations — all generated from your live data.

### AI-Generated Insights
The `/insights` endpoint analyzes your full pipeline and returns 4 actionable insights without you asking a specific question.

### Google Sheets Sync
Connect a Google Sheet as your CRM source. New records sync into the vector database automatically.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│         Tailwind CSS  ·  Recharts  ·  Vite              │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────────┐
│                  FastAPI Backend                         │
│                                                         │
│  POST /chat ──────► Pinecone Query ──► Claude RAG       │
│  POST /upload ────► CSV Parse ──► Cohere Embed ──► Upsert│
│  POST /sync ──────► Google Sheets ──► Embed ──► Upsert  │
│  GET  /insights ──► Full Pipeline ──► Claude Analysis    │
│  GET  /report ────► Full Pipeline ──► Claude Report      │
│  GET  /health                                           │
└────────┬───────────────────┬────────────────────────────┘
         │                   │
    ┌────▼────┐       ┌──────▼──────┐
    │Pinecone │       │  Claude API │
    │(Vectors)│       │ (Sonnet 4)  │
    └─────────┘       └─────────────┘
         ▲
    ┌────┴────┐
    │ Cohere  │
    │(Embeds) │
    └─────────┘
```

### How RAG Works Here

1. **Upload** — CRM records (CSV or Google Sheet) are converted to text, embedded via Cohere (`embed-english-v3.0`, 1024 dimensions), and stored in Pinecone.
2. **Query** — When a user asks a question, the query is embedded and Pinecone returns the most semantically similar records.
3. **Generate** — The retrieved records are passed as context to Claude, which answers based on actual data — not training knowledge.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 19 + Tailwind CSS 4 | Component-based UI with utility-first styling |
| **Backend** | Python FastAPI | Async-first, fast, auto-generated API docs |
| **AI Model** | Claude Sonnet 4 | Best-in-class reasoning for data analysis |
| **Vector DB** | Pinecone | Managed vector search, free tier available |
| **Embeddings** | Cohere `embed-english-v3.0` | Free tier, 1024 dimensions, high quality |
| **Sheets Sync** | gspread + Google Auth | Direct Google Sheets integration |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- API keys: [Anthropic](https://console.anthropic.com), [Pinecone](https://pinecone.io), [Cohere](https://cohere.com)

### 1. Clone & Install

```bash
git clone https://github.com/KyriakosOuz/GTM-Intelligence.git
cd GTM-Intelligence

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && pip install -r requirements.txt && cd ..
```

### 2. Configure Environment

```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=gtm-intelligence
COHERE_API_KEY=...
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
```

> **Pinecone Index:** Create an index named `gtm-intelligence` with **1024 dimensions** and **cosine** metric.

### 3. Load Demo Data

```bash
# Start backend first
cd backend && uvicorn main:app --port 8000

# Upload the demo CSV (in another terminal)
curl -X POST http://localhost:8000/upload \
  -F "file=@data/demo_crm.csv"
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend && uvicorn main:app --port 8000

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** and start asking questions.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/chat` | Send a question, get a RAG-powered answer |
| `POST` | `/upload` | Upload CSV, embed records into Pinecone |
| `POST` | `/sync` | Sync Google Sheet into Pinecone |
| `GET` | `/sync/status` | Last sync timestamp |
| `GET` | `/insights` | 4 AI-generated pipeline insights |
| `GET` | `/report` | Full AI-written pipeline report (markdown) |

All endpoints return: `{ "success": bool, "data": any, "error": string | null }`

---

## Project Structure

```
GTM-Intelligence/
├── frontend/
│   ├── src/
│   │   ├── components/     # 11 dashboard components
│   │   ├── hooks/          # useChat.js — chat state management
│   │   ├── services/       # api.js — all API calls
│   │   └── App.jsx         # Main layout
│   └── .env
├── backend/
│   ├── main.py             # FastAPI entry + CORS
│   ├── routers/            # chat, upload, sync, insights, report
│   ├── services/           # pinecone, claude, sheets
│   └── .env
└── data/
    └── demo_crm.csv        # 26 realistic B2B records
```

---

## Demo Data

The app ships with 26 realistic B2B CRM records for demo purposes:

- **Pipeline value:** $528,976.82
- **Sales reps:** Armin A., Eren Y., Mikasa A., Levi R., Sasha B.
- **Statuses:** Active, Stalled, Closed Won, Closed Lost, New
- **Sources:** Dribbble, Instagram, Behance, Google, LinkedIn
- **Industries:** SaaS, Logistics, Healthcare, EdTech, Cloud Services, and more

---

## Design System — The Crimson Catalyst

| Token | Value |
|-------|-------|
| Primary Accent | `#E8175D` |
| Background | `#FAFAFA` |
| Card Surface | `#FFFFFF` |
| Dark Card | `#1A1A2E` |
| Headlines | Manrope 700 |
| Body | Inter 400 |
| Border Radius | 16px |

The UI was designed in Google Stitch and follows an editorial, data-dense aesthetic inspired by Linear — crimson accents against expansive white space.

---

## License

MIT

---

<div align="center">
<sub>Built with Claude API + Pinecone + Cohere — zero hallucinations, real data answers.</sub>
</div>
