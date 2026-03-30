# GTM Intelligence — Daily Automation Build

## What This Builds
A daily automation system that runs every day at 9:00 AM and:
1. Generates a full AI pipeline report via Claude
2. Emails it to kyriakos.ouzounis@gmail.com via Gmail SMTP
3. Checks for stalled leads (30+ days no contact)
4. Sends a Slack alert listing stalled deals with owners

## Instructions for Claude Code
Read CLAUDE.md before starting.
Complete every section in order.
Test each section before moving to the next.

---

## SECTION 1 — Install Dependencies

```bash
cd backend
pip install schedule python-dotenv requests
```

Add to requirements.txt:
```
schedule==1.2.1
requests==2.31.0
```

---

## SECTION 2 — Environment Variables

Add these to backend/.env:

```
# Gmail SMTP Settings
GMAIL_ADDRESS=kyriakos.ouzounis@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password_here

# Report Recipients
REPORT_EMAIL_TO=kyriakos.ouzounis@gmail.com

# Slack Webhook (get from Slack app settings)
SLACK_WEBHOOK_URL=your_slack_webhook_url_here

# Automation Schedule (24hr format)
REPORT_HOUR=9
REPORT_MINUTE=0
```

### How to Get Gmail App Password
Gmail requires an App Password (not your regular password):
1. Go to myaccount.google.com
2. Security → 2-Step Verification (must be enabled)
3. Security → App Passwords
4. Select app: Mail, Select device: Mac
5. Copy the 16-character password
6. Paste as GMAIL_APP_PASSWORD in .env

### How to Get Slack Webhook URL
1. Go to api.slack.com/apps
2. Create New App → From scratch
3. Name: "GTM Intelligence"
4. Select your Slack workspace
5. Incoming Webhooks → Activate
6. Add New Webhook to Workspace
7. Select channel (e.g. #gtm-alerts)
8. Copy Webhook URL
9. Paste as SLACK_WEBHOOK_URL in .env

---

## SECTION 3 — Email Service

Create backend/services/email_service.py:

```python
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

def send_email(subject: str, body_html: str, body_text: str = None):
    """Send email via Gmail SMTP."""
    gmail_address = os.getenv("GMAIL_ADDRESS")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD")
    recipient = os.getenv("REPORT_EMAIL_TO")

    if not all([gmail_address, gmail_password, recipient]):
        print("[Email] Missing email credentials in .env")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"GTM Intelligence <{gmail_address}>"
        msg["To"] = recipient

        # Plain text fallback
        if body_text:
            msg.attach(MIMEText(body_text, "plain"))

        # HTML version
        msg.attach(MIMEText(body_html, "html"))

        # Connect and send
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(gmail_address, gmail_password)
            server.sendmail(gmail_address, recipient, msg.as_string())

        print(f"[Email] Sent successfully to {recipient}")
        return True

    except Exception as e:
        print(f"[Email] Failed: {e}")
        return False


def format_report_email(report_markdown: str) -> str:
    """Convert markdown report to HTML email."""
    today = datetime.now().strftime("%B %d, %Y")

    # Convert basic markdown to HTML
    lines = report_markdown.split('\n')
    html_lines = []
    for line in lines:
        if line.startswith('## '):
            html_lines.append(f'<h2 style="color:#E8175D">{line[3:]}</h2>')
        elif line.startswith('# '):
            html_lines.append(f'<h1 style="color:#E8175D">{line[2:]}</h1>')
        elif line.startswith('- **'):
            html_lines.append(f'<li>{line[2:]}</li>')
        elif line.startswith('- '):
            html_lines.append(f'<li>{line[2:]}</li>')
        elif line.startswith('**') and line.endswith('**'):
            html_lines.append(f'<strong>{line[2:-2]}</strong><br>')
        elif line.strip() == '':
            html_lines.append('<br>')
        else:
            html_lines.append(f'<p>{line}</p>')

    body = '\n'.join(html_lines)

    return f"""
    <html>
    <body style="font-family: Inter, Arial, sans-serif; 
                 max-width: 680px; 
                 margin: 0 auto; 
                 padding: 20px;
                 background: #FAFAFA;">

      <!-- Header -->
      <div style="background: #E8175D; 
                  padding: 24px; 
                  border-radius: 12px;
                  margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">
          🚀 GTM Intelligence
        </h1>
        <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0 0;">
          Daily Pipeline Report — {today}
        </p>
      </div>

      <!-- Report Body -->
      <div style="background: white; 
                  padding: 24px; 
                  border-radius: 12px;
                  border: 1px solid #E5E7EB;">
        {body}
      </div>

      <!-- Footer -->
      <div style="text-align: center; 
                  padding: 16px;
                  color: #9CA3AF;
                  font-size: 12px;">
        Powered by Claude AI + Pinecone RAG<br>
        GTM Intelligence — The Crimson Catalyst
      </div>

    </body>
    </html>
    """
```

---

## SECTION 4 — Slack Service

Create backend/services/slack_service.py:

```python
import requests
import os
from datetime import datetime

def send_slack_message(blocks: list) -> bool:
    """Send message to Slack via webhook."""
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")

    if not webhook_url or webhook_url == "your_slack_webhook_url_here":
        print("[Slack] No webhook URL configured")
        return False

    try:
        response = requests.post(
            webhook_url,
            json={"blocks": blocks},
            timeout=10
        )
        if response.status_code == 200:
            print("[Slack] Message sent successfully")
            return True
        else:
            print(f"[Slack] Failed: {response.status_code} {response.text}")
            return False
    except Exception as e:
        print(f"[Slack] Error: {e}")
        return False


def build_stalled_deals_alert(stalled_leads: list) -> list:
    """Build Slack block message for stalled deals."""
    today = datetime.now().strftime("%B %d, %Y")

    if not stalled_leads:
        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"✅ *GTM Intelligence — {today}*\nNo stalled deals today. Pipeline is healthy!"
                }
            }
        ]

    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": f"⚠️ GTM Intelligence — Stalled Deals Alert"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*{today}* — {len(stalled_leads)} deal(s) need immediate attention:"
            }
        },
        {"type": "divider"}
    ]

    for lead in stalled_leads[:5]:  # Max 5 in Slack
        company = lead.get('company', 'Unknown')
        owner = lead.get('owner', 'Unknown')
        value = lead.get('deal_value', 0)
        last_contact = lead.get('last_contact', 'Unknown')
        notes = lead.get('notes', '')[:80]

        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": (
                    f"*{company}* — ${value:,.0f}\n"
                    f"👤 Owner: {owner} | 📅 Last contact: {last_contact}\n"
                    f"📝 {notes}"
                )
            }
        })
        blocks.append({"type": "divider"})

    blocks.append({
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": f"_Open GTM Intelligence dashboard to take action →_"
        }
    })

    return blocks


def build_report_notification(total_pipeline: str, 
                               stalled_count: int) -> list:
    """Build Slack notification that daily report was sent."""
    today = datetime.now().strftime("%B %d, %Y")
    return [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": (
                    f"📊 *Daily Pipeline Report Sent* — {today}\n"
                    f"Pipeline: *{total_pipeline}* | "
                    f"Stalled deals: *{stalled_count}*\n"
                    f"Check your email for the full report."
                )
            }
        }
    ]
```

---

## SECTION 5 — Automation Scheduler

Create backend/scheduler.py:

```python
import schedule
import time
import os
import threading
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

from services.claude_service import generate_report, answer_with_context
from services.pinecone_service import query_index, get_all_records
from services.email_service import (
    send_email, 
    format_report_email
)
from services.slack_service import (
    send_slack_message,
    build_stalled_deals_alert,
    build_report_notification
)


def get_stalled_leads(days: int = 30) -> list:
    """Find leads not contacted in X days."""
    try:
        all_records = get_all_records()
        stalled = []
        cutoff = datetime.now() - timedelta(days=days)

        for record in all_records:
            last_contact_str = record.get('last_contact', '')
            if not last_contact_str:
                continue
            try:
                last_contact = datetime.strptime(
                    last_contact_str, '%Y-%m-%d'
                )
                if last_contact < cutoff:
                    stalled.append(record)
            except ValueError:
                continue

        # Sort by last contact (oldest first)
        stalled.sort(
            key=lambda x: x.get('last_contact', ''),
            reverse=False
        )
        return stalled

    except Exception as e:
        print(f"[Scheduler] Error getting stalled leads: {e}")
        return []


def run_daily_automation():
    """Main daily automation job."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[Scheduler] ⏰ Running daily automation at {now}")

    # Step 1 — Generate pipeline report
    print("[Scheduler] Generating pipeline report...")
    try:
        all_records = get_all_records()
        report_markdown = generate_report(all_records)
        print("[Scheduler] ✅ Report generated")
    except Exception as e:
        print(f"[Scheduler] ❌ Report generation failed: {e}")
        report_markdown = "Report generation failed. Please check the logs."

    # Step 2 — Find stalled leads
    print("[Scheduler] Checking stalled leads...")
    stalled_leads = get_stalled_leads(days=30)
    print(f"[Scheduler] Found {len(stalled_leads)} stalled leads")

    # Step 3 — Send email report
    print("[Scheduler] Sending email report...")
    today = datetime.now().strftime("%B %d, %Y")
    email_html = format_report_email(report_markdown)
    email_sent = send_email(
        subject=f"📊 GTM Intelligence — Daily Pipeline Report {today}",
        body_html=email_html,
        body_text=report_markdown
    )

    # Step 4 — Send Slack stalled deals alert
    print("[Scheduler] Sending Slack alert...")
    stalled_blocks = build_stalled_deals_alert(stalled_leads)
    slack_sent = send_slack_message(stalled_blocks)

    # Step 5 — Send Slack report notification
    if email_sent:
        total_pipeline = "$528k"  # Will be dynamic
        notif_blocks = build_report_notification(
            total_pipeline=total_pipeline,
            stalled_count=len(stalled_leads)
        )
        send_slack_message(notif_blocks)

    # Summary
    print(f"[Scheduler] Daily automation complete:")
    print(f"  Email sent: {email_sent}")
    print(f"  Slack sent: {slack_sent}")
    print(f"  Stalled leads: {len(stalled_leads)}")
    print(f"  Report length: {len(report_markdown)} chars\n")


def start_scheduler():
    """Start the daily scheduler in a background thread."""
    hour = int(os.getenv("REPORT_HOUR", "9"))
    minute = int(os.getenv("REPORT_MINUTE", "0"))
    schedule_time = f"{hour:02d}:{minute:02d}"

    print(f"[Scheduler] Starting — daily report at {schedule_time}")
    schedule.every().day.at(schedule_time).do(run_daily_automation)

    def run_loop():
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

    thread = threading.Thread(target=run_loop, daemon=True)
    thread.start()
    print(f"[Scheduler] ✅ Running in background thread")


def run_now():
    """Manually trigger the automation immediately (for testing)."""
    print("[Scheduler] Manual trigger — running now...")
    run_daily_automation()
```

---

## SECTION 6 — Add Scheduler to FastAPI

Update backend/services/pinecone_service.py to add get_all_records():

```python
def get_all_records(limit: int = 100) -> list[dict]:
    """Fetch all records from Pinecone."""
    try:
        # Query with a neutral vector to get all records
        dummy_vector = [0.0] * 1024
        results = index.query(
            vector=dummy_vector,
            top_k=limit,
            include_metadata=True
        )
        return [match.metadata for match in results.matches
                if match.metadata]
    except Exception as e:
        print(f"[Pinecone] Error fetching all records: {e}")
        return []
```

Update backend/services/claude_service.py to add generate_report():

```python
def generate_report(all_records: list[dict]) -> str:
    """Generate full pipeline report from all records."""
    records_text = "\n".join([str(r) for r in all_records[:50]])

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1500,
        system="""You are a senior GTM analyst writing a daily 
        pipeline report. Be specific with names and numbers.
        Use markdown formatting.""",
        messages=[{
            "role": "user",
            "content": f"""Write a daily pipeline report from 
            this CRM data:

{records_text}

Include these sections:
## Executive Summary
## Top Opportunities (top 5 by value)
## Stalled Deals Alert (no contact 30+ days)
## Team Performance
## Recommended Actions for Today

Use real names, values and dates. Be direct and actionable."""
        }]
    )
    return response.content[0].text
```

Update backend/main.py to start the scheduler on boot:

```python
from contextlib import asynccontextmanager
from scheduler import start_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start scheduler when app boots
    start_scheduler()
    yield

app = FastAPI(title="GTM Intelligence API", lifespan=lifespan)
```

---

## SECTION 7 — Manual Trigger Endpoint

Add to backend/routers/ a new file automation.py:

```python
from fastapi import APIRouter
from scheduler import run_now
import threading

router = APIRouter()

@router.post("/trigger")
async def trigger_automation():
    """Manually trigger the daily automation immediately."""
    try:
        thread = threading.Thread(target=run_now, daemon=True)
        thread.start()
        return {
            "success": True,
            "data": {
                "message": "Automation triggered. Check email and Slack in ~30 seconds.",
                "email": "kyriakos.ouzounis@gmail.com"
            }
        }
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}

@router.get("/status")
async def automation_status():
    """Check automation schedule status."""
    import schedule
    jobs = schedule.get_jobs()
    return {
        "success": True,
        "data": {
            "jobs": len(jobs),
            "next_run": str(jobs[0].next_run) if jobs else None,
            "schedule": "Daily at 09:00"
        }
    }
```

Add to backend/main.py:
```python
from routers import automation
app.include_router(
    automation.router, 
    prefix="/automation", 
    tags=["automation"]
)
```

---

## SECTION 8 — Frontend Automation Panel

Add an Automation Status panel to the Settings page:

```jsx
// AutomationPanel component
// Shows:
// - Next scheduled run time
// - Last run timestamp  
// - Last email sent to
// - Last Slack message sent
// - "Run Now" button → calls POST /automation/trigger
// - Green pulsing dot when scheduler is active
```

The "Run Now" button is your demo magic:
- Click it during interview
- Wait 30 seconds
- Show them the email arriving in real time
- Show the Slack notification

---

## SECTION 9 — Test the Full Automation

### Test 1 — Manual trigger via API
```bash
curl -X POST http://localhost:8000/automation/trigger
```
Wait 30 seconds then check:
- [ ] Email received at kyriakos.ouzounis@gmail.com
- [ ] Email has crimson header branding
- [ ] Email contains real pipeline data
- [ ] Slack message received in your channel
- [ ] Slack shows stalled deals with owner names

### Test 2 — Check automation status
```bash
curl http://localhost:8000/automation/status
```
- [ ] Returns next_run timestamp
- [ ] Shows "Daily at 09:00"

### Test 3 — Verify email content
Check the email and confirm:
- [ ] Subject: "📊 GTM Intelligence — Daily Pipeline Report [date]"
- [ ] From: GTM Intelligence
- [ ] Crimson header with branding
- [ ] Real company names in report
- [ ] Real dollar amounts
- [ ] Stalled deals section present

### Test 4 — Verify Slack content
Check Slack channel and confirm:
- [ ] Header shows date
- [ ] Each stalled deal shows company, owner, value
- [ ] Last contact date shown
- [ ] Deal notes shown (first 80 chars)

---

## SECTION 10 — Demo Script for Interview

When demoing the automation to CGM:

1. Open Settings page → show Automation Panel
   *"The system runs automatically every day at 9am"*

2. Click "Run Now" button
   *"I can also trigger it manually — let me show you live"*

3. Open your Gmail in another tab
   *"In about 30 seconds we should see the email arrive..."*

4. Wait 30 seconds → refresh Gmail
   *"There it is — a full AI-generated pipeline report,
   delivered automatically, every morning."*

5. Show the Slack notification
   *"The sales team also gets a Slack alert for any deals
   that haven't been touched in 30 days — so nothing
   falls through the cracks."*

6. Say:
   *"This is what we mean by GTM automation — the AI
   monitors your pipeline 24/7, generates reports
   automatically, and alerts your team before deals go cold.
   Zero manual work."*

---

## Success Criteria
Automation is complete when:
✅ Backend starts scheduler automatically on boot
✅ POST /automation/trigger sends email within 30 seconds
✅ Email arrives at kyriakos.ouzounis@gmail.com with branding
✅ Slack message appears with stalled deals
✅ GET /automation/status returns next run time
✅ Settings page shows automation panel with Run Now button
✅ Full live demo works in under 2 minutes
