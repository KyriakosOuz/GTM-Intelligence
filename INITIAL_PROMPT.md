# GTM Intelligence — Initial Build Prompt

## Context
You are building GTM Intelligence, a B2B SaaS CRM dashboard
with an embedded AI chat assistant powered by Claude API +
Pinecone RAG. This is a portfolio project for a job interview
at Compound Growth Marketing (Athens, Greece).

## Your First Job
Read these files BEFORE writing any code:
1. CLAUDE.md (project rules and architecture)
2. .claude/skills/frontend-design/SKILL.md
3. .claude/skills/frontend-patterns/SKILL.md
4. .claude/skills/react-components/SKILL.md
5. .claude/skills/ui-ux-pro-max/SKILL.md
6. .claude/skills/backend-patterns/SKILL.md
7. .claude/skills/api-design/SKILL.md

## What Has Been Done Already
- UI designed in Google Stitch (exported as zip — attached)
- Design style: clean white SaaS, crimson accent #E8175D
- All dashboard sections designed and approved
- AI chat bar "GTM AI Assistant — Powered by Claude" is pinned
  at the bottom of the dashboard

## Your Tasks — Do These In Order

### TASK 1 — Unzip and Audit Stitch Export
- Unzip the Stitch export zip file
- List every component file found
- Identify the main App/Dashboard component
- Identify the chat bar component
- Note all hardcoded data that will need to be dynamic
- DO NOT modify any existing Stitch code yet

### TASK 2 — Set Up Project Structure
Create this exact structure:
```
GTM-Intelligence/
├── CLAUDE.md
├── INITIAL_PROMPT.md
├── frontend/              ← move Stitch code here
│   ├── src/
│   │   ├── components/    ← Stitch components go here
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   ├── .env
│   └── package.json
├── backend/
│   ├── main.py
│   ├── routers/
│   │   ├── chat.py
│   │   ├── upload.py
│   │   ├── sync.py
│   │   ├── insights.py
│   │   └── report.py
│   ├── services/
│   │   ├── pinecone_service.py
│   │   ├── claude_service.py
│   │   └── sheets_service.py
│   ├── requirements.txt
│   └── .env
└── data/
    └── demo_crm.csv       ← fake CRM data for demo
```

### TASK 3 — Create Demo CRM Data
Create data/demo_crm.csv with realistic B2B GTM data:
- 25 rows minimum
- Columns: company, contact, email, status, deal_value,
  last_contact, owner, source, industry, notes
- Sales reps: Armin A., Eren Y., Mikasa A., Levi R., Sasha B.
- Companies: Rolf Inc., Cargo2go, Cloudzr, Idioma, Syllables,
  and 20 more realistic B2B company names
- Statuses: Active, Stalled, Closed Won, Closed Lost, New
- Sources: Dribbble, Instagram, Behance, Google, LinkedIn
- Some contacts with last_contact older than 30 days
  (needed for demo queries)

### TASK 4 — Frontend Setup
- Install dependencies: npm install axios recharts lucide-react
- Create frontend/.env:
  VITE_API_URL=http://localhost:8000
- Create frontend/src/services/api.js (full API service)
- Create frontend/src/hooks/useChat.js (full chat hook)
- Wire the chat bar component to useChat hook
- Run frontend: confirm it loads on localhost:5173

### TASK 5 — Backend Setup
- Create backend/.env with placeholder keys
- Create backend/requirements.txt
- Create backend/main.py (FastAPI with CORS)
- Create all router files with proper endpoints
- Create all service files
- Run backend: confirm it starts on localhost:8000
- Test /health endpoint returns {"status": "ok"}

### TASK 6 — Connect Frontend to Backend
- Test the /chat endpoint from the chat bar UI
- Verify chat messages send and receive responses
- Test the /upload endpoint with demo_crm.csv
- Confirm data embeds into Pinecone successfully

### TASK 7 — Demo Data in Pinecone
- Upload demo_crm.csv via the /upload endpoint
- Confirm all 25 records are embedded
- Test these exact demo queries in the chat:
  1. "Which leads haven't been contacted in 30 days?"
  2. "Who is our top performer this month?"
  3. "Summarize the pipeline from Dribbble leads"
  4. "What is the total value of stalled deals?"

## Critical Rules
- NEVER change colors, spacing or layout from Stitch design
- NEVER hardcode API keys — use .env files only
- ALWAYS handle errors with try/catch
- ALWAYS return { success, data, error } from all endpoints
- Keep all API calls in services/api.js only
- Keep all chat state in hooks/useChat.js only

## Design Tokens (DO NOT CHANGE)
- Primary accent: #E8175D
- Background: #FAFAFA
- Card background: #FFFFFF
- Font: Inter
- Border radius: 16px

## Demo Environment Variables Needed
Backend .env needs these keys filled in before TASK 6:
- ANTHROPIC_API_KEY
- PINECONE_API_KEY
- PINECONE_INDEX_NAME=gtm-intelligence
- OPENAI_API_KEY

## Success Criteria
The build is complete when:
✅ Frontend runs on localhost:5173
✅ Backend runs on localhost:8000
✅ Chat bar sends messages and gets Claude responses
✅ Demo CRM data is embedded in Pinecone
✅ All 4 demo queries return accurate answers
✅ Dashboard looks identical to the Stitch design
