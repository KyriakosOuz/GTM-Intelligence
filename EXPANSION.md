# GTM Intelligence — Full App Expansion Prompt

## Instructions for Claude Code
Read CLAUDE.md before starting.
Complete every section in order.
Do not skip sections.
Test each section before moving to the next.
Report results after each section completes.

---

## SECTION 1 — Multi-Page Routing

Install react-router-dom:
```bash
cd frontend && npm install react-router-dom
```

Create these pages in frontend/src/pages/:

### pages/Dashboard.jsx
The current dashboard view (move existing content here).
Keep all existing components exactly as they are.
Chat bar only visible on this page.

### pages/Deals.jsx
Full CRM data table page.
- Fetch data from GET /leads endpoint (create this endpoint)
- Show all 26 records in a sortable table
- Columns: Company, Contact, Status, Deal Value,
  Last Contact, Owner, Source, Industry
- Color-coded status badges:
  Active = green (#10B981)
  Stalled = orange (#F59E0B)
  Closed Won = blue (#3B82F6)
  Closed Lost = red (#EF4444)
  New = gray (#6B7280)
- Search bar to filter by company or contact name
- Sort by clicking column headers
- Click a row to expand and show full notes

### pages/Intelligence.jsx
Full-page AI chat interface.
- Full conversation history visible
- Large input area at bottom
- Each message shows timestamp
- User messages: right-aligned, crimson background
- AI messages: left-aligned, gray background, bot avatar
- "Clear conversation" button top right
- Suggested questions shown when chat is empty:
  "Which leads haven't been contacted in 30 days?"
  "Who is our top performer this month?"
  "What is the total value of stalled deals?"
  "Summarize pipeline from Dribbble leads"
  "Generate a pipeline health summary"
- Calls POST /chat endpoint
- Shows "Powered by Claude + Pinecone" at bottom

### pages/Network.jsx
Team performance page.
- One card per sales rep (5 total)
- Each card shows:
  Name, Avatar initials, Revenue, Leads, KPI score,
  Win Rate, Badges (emoji)
- Cards sorted by revenue descending
- Crimson accent on top performer card
- Total team stats bar at top:
  Total Revenue, Total Leads, Average KPI, Average Win Rate

### pages/Reports.jsx
AI report generation page.
- "Generate Pipeline Report" button (crimson, large)
- Calls GET /report endpoint when clicked
- Shows loading spinner while generating
- Displays rendered markdown report in clean card
- Report sections: Executive Summary, Top Opportunities,
  Stalled Deals Alert, Team Performance, Recommendations
- "Copy Report" button
- "Download as .txt" button
- Last generated timestamp shown

### pages/Settings.jsx
Data management page.
- Upload CSV section:
  Drag and drop zone OR file picker
  Accepts .csv files only
  Shows upload progress
  Calls POST /upload endpoint
  Shows success message with record count
  Shows error message if upload fails
- Sync Status section:
  Last sync timestamp
  "Sync Now" button → calls POST /sync
  Status indicator (green = synced, red = error)
- Pinecone Status section:
  Shows index name: gtm-intelligence
  Shows record count if available
  "Clear All Data" button (with confirmation dialog)
- API Keys section (display only, no edit):
  Shows which keys are configured (present/missing)
  Never shows actual key values

Wire sidebar navigation:
- Dashboard icon → /
- Deals icon → /deals
- Intelligence icon → /intelligence
- Network icon → /network
- Reports icon → /reports
- Settings icon → /settings

Keep sidebar and topbar visible on all pages.
Active nav item highlighted in crimson.

---

## SECTION 2 — Backend New Endpoints

Add these endpoints to the FastAPI backend:

### GET /leads
Returns all CRM records from Pinecone as structured data.
```python
@router.get("")
async def get_leads():
    # Query Pinecone for all records
    # Return as list of dicts
    return {"success": True, "data": records}
```

### GET /report
Generates a full markdown pipeline report using Claude.
System prompt for Claude:
```
You are a senior GTM analyst. Generate a professional
pipeline health report in markdown format with these sections:
## Executive Summary
## Top Opportunities (list top 5 deals)
## Stalled Deals Alert (deals with no contact 30+ days)
## Team Performance Summary
## Recommended Next Actions

Use specific names, numbers and dates from the data.
Be direct and actionable. Under 500 words total.
```

### GET /team
Returns aggregated team stats by sales rep.
Group Pinecone records by owner field.
Return: name, total_revenue, lead_count, avg_deal_value

### POST /leads/clear
Deletes all vectors from Pinecone index.
Requires confirmation: body must contain {"confirm": true}

---

## SECTION 3 — Upload Flow (Full End to End)

Make the upload flow completely seamless:

### Frontend Upload Component
In Settings page, the upload zone must:
1. Accept drag and drop OR click to browse
2. Show file name after selection
3. Show "Uploading..." with spinner on submit
4. Call POST /upload with the file
5. Show "✅ Successfully embedded X records" on success
6. Show "❌ Upload failed: [error message]" on failure
7. Automatically trigger GET /insights after successful upload
   to refresh the AI insights panel

### Backend Upload Improvements
In backend/routers/upload.py:
1. Validate file is .csv before processing
2. Validate required columns exist:
   company, contact, status, deal_value, last_contact,
   owner, source
3. Return detailed error if columns missing
4. Handle encoding issues (UTF-8 with fallback to latin-1)
5. After embedding, return:
   {
     "success": true,
     "data": {
       "embedded": 26,
       "skipped": 0,
       "errors": [],
       "timestamp": "2026-03-29T..."
     }
   }

---

## SECTION 4 — Chat Flow (Full End to End)

### Frontend Chat Improvements

In both Dashboard chat panel AND Intelligence page:

1. Input handling:
   - Press Enter to send (Shift+Enter for new line)
   - Disable input while loading
   - Clear input after sending
   - Auto-scroll to latest message

2. Message display:
   - User messages: right-aligned, crimson pill
   - AI messages: left-aligned, gray background
   - Show avatar initials for user (KY for Kyriakos)
   - Show bot icon for AI messages
   - Show timestamp on each message (HH:MM format)
   - Show "GTM AI is thinking..." with animated dots
     while waiting for response

3. Error handling:
   - If API call fails show:
     "Sorry, I couldn't reach the AI. Is the backend running?"
   - Red error bubble, not gray

4. Conversation memory:
   - Pass full history array to each /chat call
   - So Claude remembers context within the session
   - Example: user can ask "tell me more about that deal"

5. Suggested questions (Intelligence page only):
   Show 4 clickable suggestion chips when chat is empty.
   Clicking a chip fills the input and sends immediately.

### Backend Chat Improvements

In backend/routers/chat.py:
1. Accept conversation history:
   ```python
   class ChatRequest(BaseModel):
       message: str
       history: list = []
       max_context_records: int = 5
   ```

2. Pass history to Claude:
   ```python
   messages = []
   # Add history
   for msg in req.history[-6:]:  # Last 6 messages
       messages.append({
           "role": msg["role"],
           "content": msg["content"]
       })
   # Add current question with context
   messages.append({
       "role": "user",
       "content": f"Context:\n{context}\n\nQuestion: {req.message}"
   })
   ```

3. Return sources with answer:
   ```python
   return {
     "success": True,
     "data": {
       "answer": answer,
       "sources": [r.get("company") for r in context_records],
       "record_count": len(context_records)
     }
   }
   ```

4. Show sources below AI message in UI:
   Small gray text: "Based on: Rolf Inc., Cargo2go, Cloudzr"

---

## SECTION 5 — Dashboard Live Data

Connect dashboard stat cards to real backend data.

### New endpoint: GET /stats
Returns aggregated stats from Pinecone records:
```python
{
  "total_revenue": 528976.82,
  "total_deals": 26,
  "top_sales_count": 72,
  "best_deal": {"company": "Rolf Inc.", "value": 42300},
  "win_rate": 44,
  "avg_velocity_days": 12,
  "pipeline_value": 528000
}
```

### Frontend Stats Connection
In Dashboard.jsx:
- On mount, call GET /stats
- Replace hardcoded values with API response
- Show loading skeleton while fetching
- Keep hardcoded values as fallback if API fails

### AI Insights Panel
Add a small "AI Insights" section between
PipelineVelocity and SourceBreakdown:
- On mount call GET /insights
- Show 3-4 bullet points from Claude
- Refresh button (⟳) top right of panel
- Loading skeleton while fetching
- Example insights:
  "⚠️ 5 leads stalled for 30+ days — $75,400 at risk"
  "🏆 Armin A. leads with $209k — 31% of total pipeline"
  "📈 Dribbble is top source at $124k (24% of pipeline)"

---

## SECTION 6 — Polish & Demo Readiness

### Loading States
Every page that fetches data must show:
- Skeleton loaders (gray animated bars) while loading
- Never show empty white space

### Error States  
Every page must handle:
- Backend offline: "Backend not running. Start with:
  cd backend && uvicorn main:app --port 8000"
- No data: "No data yet. Upload a CSV in Settings."
- API error: Show the error message from the response

### Empty States
- Deals page with no data: Show upload prompt with button
  linking to Settings page
- Intelligence page first load: Show suggested questions
- Reports page: Show "No report generated yet" message

### Navigation Active States
- Current page highlighted in sidebar with crimson
- Page title shown in topbar
- Breadcrumb: GTM Intelligence > [Page Name]

### Small UI Fixes
1. Make "New Report" button in sidebar go to /reports page
2. Make "Export" button in topbar download current page data as CSV
3. Make search bar in topbar filter across all pages
4. Add tooltip on sidebar icons showing page name on hover

---

## SECTION 7 — Final Integration Test

After all sections complete, run this full flow test:

### Test Flow 1 — Fresh Upload
1. Go to Settings page
2. Upload data/demo_crm.csv
3. Verify success message shows "26 records embedded"
4. Go to Deals page — verify all 26 rows visible
5. Go to Dashboard — verify stats match CSV totals
6. Go to Intelligence — verify chat works with data

### Test Flow 2 — Full Demo Flow
Simulate the exact interview demo:
1. Open Dashboard — all sections visible ✓
2. Scroll down — leaderboard and chart visible ✓
3. Click chat bar — expands smoothly ✓
4. Type: "Which leads haven't been contacted in 30 days?"
   → Verify real company names in answer ✓
5. Type: "Who is our top performer this month?"
   → Verify Armin A. or Eren Y. named with numbers ✓
6. Go to Reports page → click Generate Report
   → Verify markdown report appears with real data ✓
7. Go to Deals page → verify full CRM table ✓
8. Go to Intelligence → click a suggested question
   → Verify answer appears correctly ✓

### Test Flow 3 — Error Handling
1. Stop the backend server
2. Try to send a chat message
   → Should show friendly error, not crash ✓
3. Restart backend
4. Try again → should work ✓

---

## Success Criteria
The expansion is complete when:

✅ All 6 pages load without errors
✅ Sidebar navigation works for all pages
✅ Upload flow works end to end in Settings page
✅ Chat works on both Dashboard and Intelligence pages
✅ Conversation history maintained within session
✅ Reports page generates real AI report
✅ Deals page shows all CRM records with filters
✅ Network page shows all 5 team members
✅ Dashboard stats connected to backend data
✅ AI Insights panel shows on Dashboard
✅ All loading and error states handled
✅ Full demo flow runs without any errors

## Final Output
When complete, show:
1. List of all pages created
2. List of all new endpoints created
3. Screenshot description of each page
4. Confirmed demo flow results
5. How to run: both terminal commands
