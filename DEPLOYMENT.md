# GTM Intelligence — Full Deployment Guide

## What This Does
Deploys the complete GTM Intelligence app to production:
- Frontend → Vercel (already done)
- Backend → Railway (free tier, no credit card)
- Connects them together
- Adds all environment variables
- Verifies everything works end to end

## Read CLAUDE.md before starting.
## Complete every section in order.
## Report results after each section.

---

## SECTION 1 — Check Current Status

```bash
# Check if Vercel CLI is installed
vercel --version

# Check if Railway CLI is installed  
railway --version

# Check current backend .env has all keys
cat backend/.env
```

Report:
- [ ] Vercel CLI version
- [ ] Railway CLI installed or not
- [ ] All .env keys present

---

## SECTION 2 — Prepare Backend for Deployment

### Create backend/Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port
EXPOSE 8080

# Start server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Create backend/.dockerignore
```
__pycache__
*.pyc
*.pyo
.env
.env.local
venv
.venv
*.egg-info
.git
.gitignore
```

### Create backend/railway.json
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "port": 8080,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### Update backend/main.py CORS for production
Make sure CORS allows all origins for now:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Verify requirements.txt has all packages
Make sure these are all present:
```
fastapi
uvicorn
python-dotenv
pinecone
cohere
anthropic
gspread
google-auth
pandas
python-multipart
schedule
requests
```

Run locally to confirm no errors:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000
curl http://localhost:8000/health
```

- [ ] Health check returns {"status": "ok"}
- [ ] No import errors

---

## SECTION 3 — Deploy Backend to Railway

### Install Railway CLI
```bash
npm install -g @railway/cli
```

### Login to Railway
```bash
railway login
```
This opens a browser — log in with GitHub.

### Initialize Railway Project
```bash
cd backend
railway init
```
When prompted:
- Create new project: YES
- Project name: gtm-intelligence-backend

### Deploy to Railway
```bash
railway up
```

Wait for deployment to complete (2-3 minutes).

### Get the Backend URL
```bash
railway domain
```

If no domain yet, create one:
```bash
railway domain create
```

The URL will look like:
```
https://gtm-intelligence-backend.up.railway.app
```

Save this URL — you need it for the next sections.

- [ ] Deployment successful
- [ ] Got public Railway URL

---

## SECTION 4 — Add Environment Variables to Railway

Add ALL backend .env variables to Railway.
Do NOT skip any — the app will crash without them.

```bash
# Add each variable one by one
railway variables set ANTHROPIC_API_KEY=your_value
railway variables set PINECONE_API_KEY=your_value
railway variables set PINECONE_INDEX_NAME=gtm-intelligence
railway variables set COHERE_API_KEY=your_value
railway variables set GMAIL_ADDRESS=kyriakos.ouzounis@gmail.com
railway variables set GMAIL_APP_PASSWORD=your_value
railway variables set REPORT_EMAIL_TO=kyriakos.ouzounis@gmail.com
railway variables set SLACK_WEBHOOK_URL=your_value
railway variables set REPORT_HOUR=9
railway variables set REPORT_MINUTE=0
railway variables set GOOGLE_SHEETS_CREDENTIALS=
railway variables set GOOGLE_SHEET_URL=
```

Read the actual values from backend/.env and use them.

### Redeploy after adding variables
```bash
railway up
```

### Verify backend is live with all keys
```bash
# Replace with your actual Railway URL
curl https://your-railway-url.up.railway.app/health
```

Expected: {"status": "ok"}

```bash
# Test insights endpoint (requires Pinecone + Cohere + Anthropic)
curl https://your-railway-url.up.railway.app/insights
```

Expected: {"success": true, "data": [...]}

- [ ] /health returns ok
- [ ] /insights returns real data
- [ ] No 500 errors

---

## SECTION 5 — Connect Frontend to Backend on Vercel

### Update VITE_API_URL in Vercel
```bash
cd frontend

# Remove old localhost URL
vercel env rm VITE_API_URL production

# Add new Railway URL
vercel env add VITE_API_URL production
# When prompted enter: https://your-railway-url.up.railway.app
```

### Redeploy Frontend
```bash
vercel --prod
```

Wait for deployment (1-2 minutes).
Get the new Vercel URL from the output.

- [ ] Frontend redeployed successfully
- [ ] Got new Vercel production URL

---

## SECTION 6 — Verify Full Production App

### Test frontend loads
Open the Vercel URL in browser:
- [ ] Dashboard loads without blank screen
- [ ] No CORS errors in browser console
- [ ] Stat cards visible
- [ ] Chat bar visible at bottom

### Test API connection from frontend
In the browser console (F12 → Console):
```javascript
fetch('https://your-railway-url.up.railway.app/health')
  .then(r => r.json())
  .then(console.log)
```
- [ ] Returns {"status": "ok"} in console
- [ ] No CORS errors

### Test chat in production
Type in the chat bar:
"Who is our top performer?"
- [ ] Loading indicator appears
- [ ] Real answer arrives (not error message)
- [ ] Answer mentions specific rep names

### Test report generation
Navigate to Reports page → Generate Report:
- [ ] Report generates successfully
- [ ] Contains real pipeline data
- [ ] No timeout errors

### Test automation trigger
Navigate to Settings → Run Now:
- [ ] Automation triggers successfully
- [ ] Email arrives at kyriakos.ouzounis@gmail.com
- [ ] Slack notification received

---

## SECTION 7 — Production URLs

After all sections complete, save these URLs:

```
Frontend (Vercel):
https://frontend-seven-ecru-39.vercel.app

Backend (Railway):
https://your-railway-url.up.railway.app

API Docs (FastAPI auto-generated):
https://your-railway-url.up.railway.app/docs
```

The /docs URL is a bonus — FastAPI automatically generates
interactive API documentation. Great to show in the interview!

---

## SECTION 8 — Custom Domain (Optional but Impressive)

If you want gtmintelligence.app or similar:

```bash
# Add custom domain to Vercel
vercel domains add yourdomain.com

# Add custom domain to Railway backend
railway domain create --custom yourdomain.com
```

Skip this if you don't have a domain ready.

---

## SECTION 9 — Performance Check

Test production performance:

### Frontend load time
Open Chrome → F12 → Network tab → reload page
- [ ] Page loads under 5 seconds
- [ ] No failed network requests (red items)

### API response times
```bash
# Time the chat endpoint
time curl -X POST https://your-railway-url.up.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "who is top performer", "history": []}'
```
- [ ] Chat responds under 10 seconds
- [ ] No timeout errors

### Check Railway logs for errors
```bash
railway logs
```
- [ ] No repeated errors
- [ ] Scheduler started successfully
- [ ] No missing package errors

---

## SECTION 10 — Pre-Interview Production Checklist

Run through this the morning of the interview:

### URLs to have open
- [ ] https://frontend-seven-ecru-39.vercel.app (main app)
- [ ] Gmail inbox (for automation demo)
- [ ] Slack channel (for stalled deals alert)
- [ ] https://your-railway-url.up.railway.app/docs (API docs, bonus)

### App checks
- [ ] Dashboard loads correctly
- [ ] Chat responds with real data
- [ ] All 6 pages navigate correctly
- [ ] Run Now button triggers email successfully

### Backup plan
If production has issues during interview:
```bash
# Start local version immediately
cd backend && uvicorn main:app --port 8000
cd frontend && npm run dev
# Open http://localhost:5173
```
Always have local version ready as backup.

---

## SECTION 11 — Share App with CGM Before Interview

Consider sending the Vercel URL to CGM before the interview:

Message template:
"Hi, looking forward to our meeting. 
I built a live demo of GTM Intelligence you can explore:
https://frontend-seven-ecru-39.vercel.app

It's an AI-powered CRM dashboard built with Claude API 
and Pinecone RAG. Happy to walk you through it together."

This shows initiative and gives them time to explore.

---

## Success Criteria

Deployment is complete when:
✅ Frontend live on Vercel
✅ Backend live on Railway  
✅ /health endpoint returns ok in production
✅ Chat works in production with real answers
✅ Report generation works in production
✅ Automation email arrives from production
✅ Slack notification arrives from production
✅ No CORS errors in browser console
✅ All 6 pages load correctly in production
✅ Local backup version also working

## Final Output
When complete, provide:
1. Frontend URL (Vercel)
2. Backend URL (Railway)
3. API docs URL
4. Confirmation all endpoints working
5. Screenshot description of live app
