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
                    "text": f"*GTM Intelligence — {today}*\nNo stalled deals today. Pipeline is healthy!"
                }
            }
        ]

    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "GTM Intelligence — Stalled Deals Alert"
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

        try:
            value_formatted = f"${float(value):,.0f}"
        except (ValueError, TypeError):
            value_formatted = str(value)

        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": (
                    f"*{company}* — {value_formatted}\n"
                    f"Owner: {owner} | Last contact: {last_contact}\n"
                    f"{notes}"
                )
            }
        })
        blocks.append({"type": "divider"})

    blocks.append({
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "_Open GTM Intelligence dashboard to take action_"
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
                    f"*Daily Pipeline Report Sent* — {today}\n"
                    f"Pipeline: *{total_pipeline}* | "
                    f"Stalled deals: *{stalled_count}*\n"
                    f"Check your email for the full report."
                )
            }
        }
    ]
