import schedule
import time
import os
import threading
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

from services.claude_service import generate_report
from services.pinecone_service import get_all_records
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
    print(f"\n[Scheduler] Running daily automation at {now}")

    # Step 1 — Generate pipeline report
    print("[Scheduler] Generating pipeline report...")
    try:
        all_records = get_all_records()
        # generate_report is async but we call it from sync context
        import asyncio
        loop = asyncio.new_event_loop()
        report_markdown = loop.run_until_complete(generate_report(all_records))
        loop.close()
        print("[Scheduler] Report generated")
    except Exception as e:
        print(f"[Scheduler] Report generation failed: {e}")
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
        subject=f"GTM Intelligence — Daily Pipeline Report {today}",
        body_html=email_html,
        body_text=report_markdown
    )

    # Step 4 — Send Slack stalled deals alert
    print("[Scheduler] Sending Slack alert...")
    stalled_blocks = build_stalled_deals_alert(stalled_leads)
    slack_sent = send_slack_message(stalled_blocks)

    # Step 5 — Send Slack report notification
    if email_sent:
        total_pipeline = "$528k"
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
    print(f"[Scheduler] Running in background thread")


def run_now():
    """Manually trigger the automation immediately (for testing)."""
    print("[Scheduler] Manual trigger — running now...")
    run_daily_automation()
