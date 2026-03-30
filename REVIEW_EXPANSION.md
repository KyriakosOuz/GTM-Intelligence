# GTM Intelligence — Expansion QA Review

## Instructions for Claude Code
Read CLAUDE.md before starting.
Go through every section in order.
Fix any issues found before moving to the next section.
Report PASS or FAIL for each section with details.

---

## SECTION 1 — Routing & Navigation Audit

Test every sidebar nav item:

```bash
# Frontend must be running on localhost:5173
cd frontend && npm run dev
```

Visit each route and verify it loads without blank screen or error:

- [ ] http://localhost:5173/ — Dashboard page
- [ ] http://localhost:5173/deals — Deals page
- [ ] http://localhost:5173/intelligence — Intelligence page
- [ ] http://localhost:5173/network — Network page
- [ ] http://localhost:5173/reports — Reports page
- [ ] http://localhost:5173/settings — Settings page

For each page verify:
- [ ] Sidebar visible and correct icon highlighted in crimson
- [ ] Topbar visible with search bar
- [ ] Page title correct in topbar
- [ ] No 404 or blank white screen
- [ ] No console errors in browser dev tools
- [ ] Clicking browser back/forward works correctly

Report any broken routes and fix them.

---

## SECTION 2 — Dashboard Page Audit

Visit http://localhost:5173/

- [ ] All 7 stat cards visible and showing real data from backend
- [ ] Stats match demo_crm.csv totals (not hardcoded)
- [ ] Pipeline Velocity section visible with 4 reps
- [ ] AI Insights panel visible with 3-4 bullet points
- [ ] Source Breakdown table visible
- [ ] Deals Amount chart visible
- [ ] Platform Performance card visible (crimson background)
- [ ] Team Leaderboard visible with 5 reps
- [ ] Sales Dynamic chart visible
- [ ] Chat bar visible at bottom
- [ ] Chat bar NOT visible on other pages

Test stats accuracy:
- [ ] Total Revenue shows ~$528k
- [ ] Best Deal shows Rolf Inc. $42,300
- [ ] Win Rate shows 44%

Test AI Insights panel:
- [ ] Loads without error
- [ ] Shows real insights referencing actual data
- [ ] Refresh button works (calls /insights again)

---

## SECTION 3 — Deals Page Audit

Visit http://localhost:5173/deals

- [ ] Page loads without error
- [ ] Table shows all 26 CRM records
- [ ] All columns visible:
      Company, Contact, Status, Deal Value,
      Last Contact, Owner, Source, Industry
- [ ] Status badges are color-coded:
      Active = green
      Stalled = orange
      Closed Won = blue
      Closed Lost = red
      New = gray
- [ ] Search bar filters records in real time
- [ ] Clicking a column header sorts the table
- [ ] Clicking a row expands to show full notes
- [ ] No empty rows or undefined values
- [ ] Deal values formatted as currency ($42,300 not 42300)
- [ ] Dates formatted correctly (not raw ISO strings)

Test search:
- [ ] Type "Rolf" → only Rolf Inc. row visible
- [ ] Type "Eren" → only Eren Y. deals visible
- [ ] Clear search → all 26 rows visible again

Test sort:
- [ ] Click Deal Value → sorts highest to lowest
- [ ] Click Company → sorts alphabetically
- [ ] Click Last Contact → sorts by date

---

## SECTION 4 — Intelligence Page Audit

Visit http://localhost:5173/intelligence

- [ ] Page loads without error
- [ ] Empty state shows 4 suggested question chips
- [ ] Input field visible at bottom
- [ ] "Powered by Claude + Pinecone" text visible

Test suggested questions:
- [ ] Click "Which leads haven't been contacted in 30 days?"
      → fills input and sends automatically
      → real answer appears with company names
- [ ] Click "Who is our top performer this month?"
      → real answer with rep name and numbers
- [ ] Click "What is the total value of stalled deals?"
      → real dollar amount in answer
- [ ] Click "Summarize pipeline from Dribbble leads"
      → mentions Dribbble source records

Test manual chat:
- [ ] Type custom question and press Enter → sends
- [ ] User message appears right-aligned in crimson bubble
- [ ] AI message appears left-aligned in gray bubble
- [ ] Timestamp visible on each message
- [ ] Loading indicator visible while waiting
- [ ] Input disabled while loading
- [ ] Input clears after sending
- [ ] Auto-scrolls to latest message

Test conversation memory:
- [ ] Ask: "Who is our top performer?"
- [ ] Then ask: "What deals do they own?"
      → Claude should remember the previous rep name
      → Answer should reference same rep without re-asking

Test error handling:
- [ ] Stop backend server
- [ ] Send a message
      → Should show friendly error bubble (not crash)
- [ ] Restart backend
- [ ] Send again → should work normally

Test "Clear conversation" button:
- [ ] Clears all messages
- [ ] Shows suggested questions again
- [ ] New message starts fresh conversation

---

## SECTION 5 — Network Page Audit

Visit http://localhost:5173/network

- [ ] Page loads without error
- [ ] 5 rep cards visible:
      Armin A., Eren Y., Mikasa A., Levi R., Sasha B.
- [ ] Each card shows:
      Name, Avatar initials, Revenue, Leads,
      KPI score, Win Rate, Badges
- [ ] Cards sorted by revenue (Armin A. first)
- [ ] Top performer card has crimson accent
- [ ] Team totals bar visible at top:
      Total Revenue, Total Leads, Avg KPI, Avg Win Rate
- [ ] Numbers match demo_crm.csv data
- [ ] No undefined or NaN values

Verify rep stats roughly match:
- [ ] Armin A. revenue ~$209k
- [ ] Eren Y. revenue ~$142k
- [ ] Mikasa A. revenue ~$98k
- [ ] Levi R. revenue ~$79k
- [ ] Sasha B. revenue ~$52k

---

## SECTION 6 — Reports Page Audit

Visit http://localhost:5173/reports

- [ ] Page loads without error
- [ ] "Generate Pipeline Report" button visible (crimson)
- [ ] Empty state message visible before generation
- [ ] Clicking button shows loading spinner
- [ ] Report appears within 30 seconds
- [ ] Report contains these sections:
      Executive Summary
      Top Opportunities
      Stalled Deals Alert
      Team Performance
      Recommended Next Actions
- [ ] Report references real company names
- [ ] Report references real dollar amounts (~$528k total)
- [ ] "Copy Report" button works
- [ ] "Download as .txt" button downloads file
- [ ] Timestamp shows when report was generated
- [ ] Generating a second report replaces the first

Verify report accuracy:
- [ ] Total pipeline value close to $528k
- [ ] Stalled deals mention Polaris Shipping, Maplewood,
      Idioma specifically
- [ ] Top deals mention Rolf Inc. $42,300

---

## SECTION 7 — Settings Page Audit

Visit http://localhost:5173/settings

- [ ] Page loads without error
- [ ] Upload CSV section visible
- [ ] Drag and drop zone visible
- [ ] Click to browse also works
- [ ] Only accepts .csv files
      (try uploading a .jpg → should show error)
- [ ] Sync Status section visible
- [ ] Last sync timestamp displayed
- [ ] "Sync Now" button visible
- [ ] Pinecone Status section visible
- [ ] API Keys section visible (no actual key values shown)

Test upload flow end to end:
1. [ ] Click upload zone → file picker opens
2. [ ] Select data/demo_crm.csv
3. [ ] File name appears in upload zone
4. [ ] Click Upload / Submit
5. [ ] "Uploading..." spinner appears
6. [ ] Success message: "✅ Successfully embedded 26 records"
7. [ ] No error messages

Test error cases:
- [ ] Try uploading empty CSV → should show error
- [ ] Try uploading CSV missing required columns → error message

Test Sync Now button:
- [ ] Click "Sync Now"
- [ ] Loading state appears
- [ ] Success or error message appears
- [ ] Timestamp updates

---

## SECTION 8 — Backend Endpoints Audit

With backend running on :8000, test all endpoints:

```bash
# Health
curl http://localhost:8000/health
# Expected: {"status":"ok"}

# Stats
curl http://localhost:8000/stats
# Expected: total_revenue ~528976, total_deals: 26

# Leads
curl http://localhost:8000/leads
# Expected: array of 26 records

# Team
curl http://localhost:8000/team
# Expected: 5 reps with aggregated stats

# Insights
curl http://localhost:8000/insights
# Expected: array of 4 insight strings

# Report
curl http://localhost:8000/report
# Expected: markdown string with real data

# Sync status
curl http://localhost:8000/sync/status
# Expected: last_sync timestamp or null

# Chat - specific query
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "who hasnt been contacted in 30 days", "history": []}'
# Expected: answer naming specific companies

# Chat - broad query (must use top_k=26)
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "give me a full pipeline report", "history": []}'
# Expected: mentions ~$528k total pipeline

# Upload
curl -X POST http://localhost:8000/upload \
  -F "file=@data/demo_crm.csv"
# Expected: {"success":true,"data":{"embedded":26}}
```

For each endpoint verify:
- [ ] Returns JSON (not HTML)
- [ ] Has "success" field
- [ ] No 500 errors
- [ ] Response time under 10s (except /report which can be 30s)

---

## SECTION 9 — Chat Accuracy Audit

Run all 6 demo queries and verify answers:

```bash
# Query 1 — Stalled leads
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Which leads havent been contacted in 30 days", "history": []}'
```
- [ ] Names at least 2 specific companies
- [ ] Includes deal values
- [ ] Mentions owners

```bash
# Query 2 — Top performer
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Who is our top performer this month", "history": []}'
```
- [ ] Names Armin A. or Eren Y.
- [ ] Includes revenue figure

```bash
# Query 3 — Dribbble pipeline
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Summarize pipeline from Dribbble leads", "history": []}'
```
- [ ] Mentions Dribbble source
- [ ] Names specific companies from Dribbble

```bash
# Query 4 — Stalled value
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the total value of stalled deals", "history": []}'
```
- [ ] Returns dollar amount (~$75k)
- [ ] Lists stalled company names

```bash
# Query 5 — Full report
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Give me a full pipeline report", "history": []}'
```
- [ ] Mentions total pipeline ~$528k
- [ ] Has multiple sections

```bash
# Query 6 — Conversation memory test
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What deals does Armin own", "history": [{"role":"user","content":"who is top performer"},{"role":"assistant","content":"Armin A. leads with $209k"}]}'
```
- [ ] References Armin A. deals
- [ ] Shows conversation context was used

---

## SECTION 10 — Full Demo Flow Test

Simulate the exact interview demo from start to finish:

**Step 1 — Open dashboard**
- [ ] Dashboard loads in under 3 seconds
- [ ] All sections visible without scrolling issues
- [ ] Stats show real data

**Step 2 — Click chat bar**
- [ ] Expands smoothly
- [ ] Input field focused automatically
- [ ] Placeholder text: "Ask anything about your pipeline..."

**Step 3 — Type demo query 1**
Type: "Which leads haven't been contacted in 30 days?"
- [ ] Loading indicator appears
- [ ] Answer arrives in under 8 seconds
- [ ] Answer names specific companies with values

**Step 4 — Type demo query 2**
Type: "Who is our top performer this month?"
- [ ] Conversation continues in same panel
- [ ] Answer references previous context (if asked follow-up)
- [ ] Specific rep named with revenue

**Step 5 — Navigate to Intelligence page**
- [ ] Click Intelligence icon in sidebar
- [ ] Page loads with full chat history OR fresh start
- [ ] Suggested questions visible if fresh

**Step 6 — Navigate to Reports page**
- [ ] Click Reports in sidebar
- [ ] Click "Generate Pipeline Report"
- [ ] Loading state visible
- [ ] Report appears with real data
- [ ] Report mentions ~$528k pipeline value

**Step 7 — Navigate to Deals page**
- [ ] All 26 records visible
- [ ] Search for "Rolf" → finds Rolf Inc.
- [ ] Status badge colors correct

**Step 8 — Navigate to Settings**
- [ ] Upload zone visible
- [ ] Upload demo_crm.csv
- [ ] Success message appears

**Step 9 — Navigate back to Dashboard**
- [ ] Dashboard still working
- [ ] Chat bar still visible at bottom
- [ ] Stats still accurate

---

## SECTION 11 — Performance & Polish Audit

Performance:
- [ ] Dashboard initial load under 3 seconds
- [ ] Page navigation under 1 second
- [ ] Chat response under 8 seconds
- [ ] Report generation under 30 seconds
- [ ] No memory leaks (navigate between pages repeatedly)

Visual polish:
- [ ] Primary color is crimson #E8175D throughout all pages
- [ ] No blue default browser colors anywhere
- [ ] No broken images or icons
- [ ] No lorem ipsum text on any page
- [ ] Consistent font (Inter) on all pages
- [ ] Consistent border radius (16px) on all cards
- [ ] Sidebar same width on all pages
- [ ] Topbar same height on all pages
- [ ] Active nav item highlighted correctly on each page

Mobile check (resize browser to 768px):
- [ ] No horizontal scroll bar
- [ ] Content readable (not cut off)
- [ ] Chat bar still accessible

Browser console check:
- [ ] Zero errors in console on Dashboard
- [ ] Zero errors on Deals page
- [ ] Zero errors on Intelligence page
- [ ] Zero errors on Reports page

---

## SECTION 12 — Interview Readiness Final Check

Run these manually and confirm:

- [ ] Can demo the app without touching terminal during interview
      (both servers already running in background)
- [ ] All 4 demo queries return impressive answers
- [ ] Report generation produces real data
- [ ] App looks professional at 1440px width (typical laptop)
- [ ] No error messages visible on first load
- [ ] "GTM Intelligence" and "The Crimson Catalyst" branding correct
- [ ] "Powered by Claude" visible in chat panel
- [ ] You can explain RAG in 2 sentences confidently

Talking points verified:
- [ ] Stack: React + FastAPI + Claude + Pinecone + Cohere
- [ ] RAG explanation ready
- [ ] Automation angle ready (Google Sheets sync)
- [ ] Built in: 3-4 days (honest answer for interview)

---

## Summary Report Template

```
SECTION 1  — Routing & Navigation:    PASS / FAIL (X issues fixed)
SECTION 2  — Dashboard Page:          PASS / FAIL
SECTION 3  — Deals Page:              PASS / FAIL
SECTION 4  — Intelligence Page:       PASS / FAIL
SECTION 5  — Network Page:            PASS / FAIL
SECTION 6  — Reports Page:            PASS / FAIL
SECTION 7  — Settings Page:           PASS / FAIL
SECTION 8  — Backend Endpoints:       PASS / FAIL
SECTION 9  — Chat Accuracy:           PASS / FAIL
SECTION 10 — Full Demo Flow:          PASS / FAIL
SECTION 11 — Performance & Polish:    PASS / FAIL
SECTION 12 — Interview Readiness:     PASS / FAIL

OVERALL STATUS: READY FOR INTERVIEW / NEEDS FIXES

Issues Fixed During Review: X
Remaining Issues: X
Estimated Fix Time: X minutes
```
