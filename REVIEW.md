# GTM Intelligence — Post-Build Review & QA

## What This File Does
This is a quality assurance checklist to run AFTER the
initial build is complete. It audits every part of the
app before the interview demo.

## Instructions for Claude Code
Read CLAUDE.md first, then go through every section below
in order. Fix any issues found before moving to the next
section. Report results for each section.

---

## SECTION 1 — File Structure Audit
Verify this exact structure exists and no files are missing:

```
GTM-Intelligence/
├── CLAUDE.md                        ✓ or ✗
├── INITIAL_PROMPT.md                ✓ or ✗
├── frontend/
│   ├── src/
│   │   ├── components/              ✓ or ✗
│   │   ├── hooks/useChat.js         ✓ or ✗
│   │   ├── services/api.js          ✓ or ✗
│   │   └── App.jsx                  ✓ or ✗
│   ├── .env                         ✓ or ✗
│   └── package.json                 ✓ or ✗
├── backend/
│   ├── main.py                      ✓ or ✗
│   ├── routers/chat.py              ✓ or ✗
│   ├── routers/upload.py            ✓ or ✗
│   ├── routers/sync.py              ✓ or ✗
│   ├── routers/insights.py          ✓ or ✗
│   ├── routers/report.py            ✓ or ✗
│   ├── services/pinecone_service.py ✓ or ✗
│   ├── services/claude_service.py   ✓ or ✗
│   ├── services/sheets_service.py   ✓ or ✗
│   ├── requirements.txt             ✓ or ✗
│   └── .env                        ✓ or ✗
└── data/
    └── demo_crm.csv                 ✓ or ✗
```

Report any missing files and create them if needed.

---

## SECTION 2 — Environment Variables Check
Verify backend/.env contains all required keys:
- ANTHROPIC_API_KEY (not empty)
- PINECONE_API_KEY (not empty)
- PINECONE_INDEX_NAME=gtm-intelligence
- COHERE_API_KEY (not empty)

Verify frontend/.env contains:
- VITE_API_URL=http://localhost:8000

Do NOT print the actual key values — just confirm present/missing.

---

## SECTION 3 — Demo CRM Data Check
Open data/demo_crm.csv and verify:
- [ ] Has at least 25 rows
- [ ] Has all required columns:
      company, contact, email, status, deal_value,
      last_contact, owner, source, industry, notes
- [ ] Has all 5 sales reps:
      Armin A., Eren Y., Mikasa A., Levi R., Sasha B.
- [ ] Has these sources: Dribbble, Instagram, Behance, Google
- [ ] Has mixed statuses: Active, Stalled, Closed Won, Closed Lost
- [ ] At least 5 rows have last_contact older than 30 days
      (critical for demo query)
- [ ] Top deal is Rolf Inc. at $42,300

If any check fails, fix the CSV before continuing.

---

## SECTION 4 — Frontend Build Check
```bash
cd frontend
npm install
npm run build
```
- [ ] Build completes with zero errors
- [ ] No missing imports or undefined components
- [ ] No TypeScript/ESLint errors that break the build

If build fails, fix all errors before continuing.

---

## SECTION 5 — Frontend Visual Check
```bash
cd frontend
npm run dev
```
Open localhost:5173 and verify:
- [ ] Dashboard loads without blank screen
- [ ] Sidebar visible with icons
- [ ] All 7 stat cards visible in top row
- [ ] Pipeline Velocity section visible
- [ ] Source Breakdown table visible
- [ ] Deals Amount chart visible
- [ ] Platform Performance card visible (crimson background)
- [ ] Team Leaderboard with 5 reps visible
- [ ] Sales Dynamic line chart visible
- [ ] Chat bar pinned at bottom of screen
- [ ] Chat bar shows "GTM AI Assistant" and "Powered by Claude"
- [ ] Primary color is crimson #E8175D (not blue, not purple)
- [ ] Background is white/near-white #FAFAFA
- [ ] No layout overlap or broken sections

If any visual issue found, fix the relevant component.

---

## SECTION 6 — Backend Startup Check
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- [ ] Server starts without errors
- [ ] No missing package errors
- [ ] No import errors

Test health endpoint:
```bash
curl http://localhost:8000/health
```
Expected: {"status": "ok"}

---

## SECTION 7 — API Endpoint Check
With backend running, test each endpoint:

```bash
# Health
curl http://localhost:8000/health

# Insights
curl http://localhost:8000/insights

# Sync status
curl http://localhost:8000/sync/status

# Upload demo CSV
curl -X POST http://localhost:8000/upload \
  -F "file=@data/demo_crm.csv"

# Chat test
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello", "history": []}'
```

Expected for each:
- [ ] Returns JSON (not HTML error page)
- [ ] Has "success" field in response
- [ ] No 500 errors

---

## SECTION 8 — Pinecone Connection Check
After running the upload curl command above:
- [ ] Upload returns success: true
- [ ] Returns count of embedded records
- [ ] No Pinecone dimension mismatch errors
      (if dimension error → index must be 1024 not 1536)

---

## SECTION 9 — Demo Query Check
This is the most critical section.
With data uploaded to Pinecone, test all 4 demo queries:

```bash
# Query 1
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Which leads have not been contacted in 30 days?", "history": []}'

# Query 2
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Who is our top performer this month?", "history": []}'

# Query 3
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Summarize the pipeline from Dribbble leads", "history": []}'

# Query 4
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the total value of stalled deals?", "history": []}'
```

For each query verify:
- [ ] Returns a real answer (not empty, not error)
- [ ] Answer references specific company names or numbers
- [ ] Answer is under 4 sentences
- [ ] No hallucinated data that contradicts the CSV

---

## SECTION 10 — Chat UI Integration Check
With both frontend and backend running:
- [ ] Type a message in the chat bar on the dashboard
- [ ] Chat panel expands upward when first message sent
- [ ] User message appears right-aligned in crimson bubble
- [ ] AI response appears left-aligned in gray bubble
- [ ] "Powered by Claude" text visible in chat panel
- [ ] Loading state visible while waiting for response
- [ ] Second message works correctly
- [ ] Chat history maintained in the session

---

## SECTION 11 — Report Generation Check
```bash
curl http://localhost:8000/report
```
- [ ] Returns a markdown-formatted pipeline report
- [ ] Report mentions specific numbers from the demo data
- [ ] Report has clear sections (summary, top deals, recommendations)
- [ ] Response time under 15 seconds

---

## SECTION 12 — Final Pre-Demo Checklist
Run through this manually before the interview:

### Content
- [ ] Company name shows "GTM Intelligence" in sidebar
- [ ] Subtitle shows "The Crimson Catalyst"
- [ ] All stat numbers match demo_crm.csv totals
- [ ] Team leaderboard shows correct order by revenue

### Performance
- [ ] Dashboard loads in under 3 seconds
- [ ] Chat response arrives in under 8 seconds
- [ ] No console errors in browser dev tools

### Polish
- [ ] No lorem ipsum text anywhere
- [ ] No placeholder images broken
- [ ] All buttons are clickable
- [ ] Chat input has correct placeholder text:
      "Ask anything about your pipeline..."

---

## SECTION 13 — Interview Talking Points Verification
Make sure you can answer these questions:

Q: "What tech stack did you use?"
A: React + FastAPI + Claude API + Pinecone + Cohere embeddings

Q: "How does the AI chat work?"
A: RAG — CRM data embedded as vectors in Pinecone,
   questions retrieve relevant records, Claude answers
   based on actual data

Q: "What is the automation layer?"
A: Google Sheets webhook syncs new CRM records into
   Pinecone automatically every 24 hours

Q: "Why Pinecone over a regular database?"
A: Semantic search — finds conceptually related records
   even if the exact words don't match

Q: "How long did this take to build?"
A: Core RAG pipeline in 1 day, full dashboard in 3-4 days

---

## Summary Report Template
After running all sections, report back in this format:

```
SECTION 1 — File Structure:     PASS / FAIL (X issues fixed)
SECTION 2 — Environment:        PASS / FAIL
SECTION 3 — Demo Data:          PASS / FAIL
SECTION 4 — Frontend Build:     PASS / FAIL
SECTION 5 — Visual Check:       PASS / FAIL
SECTION 6 — Backend Startup:    PASS / FAIL
SECTION 7 — API Endpoints:      PASS / FAIL
SECTION 8 — Pinecone:           PASS / FAIL
SECTION 9 — Demo Queries:       PASS / FAIL
SECTION 10 — Chat UI:           PASS / FAIL
SECTION 11 — Report Gen:        PASS / FAIL
SECTION 12 — Pre-Demo Polish:   PASS / FAIL

OVERALL STATUS: READY FOR DEMO / NEEDS FIXES
```
