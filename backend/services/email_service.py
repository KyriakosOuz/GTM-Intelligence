import resend
import os
from datetime import datetime


def send_email(subject: str, body_html: str, body_text: str = None):
    """Send email via Resend API."""
    resend.api_key = os.getenv("RESEND_API_KEY")
    recipient = os.getenv("REPORT_EMAIL_TO")
    from_address = os.getenv("RESEND_FROM", "GTM Intelligence <onboarding@resend.dev>")

    if not all([resend.api_key, recipient]):
        print("[Email] Missing RESEND_API_KEY or REPORT_EMAIL_TO in .env")
        return False

    try:
        params = {
            "from": from_address,
            "to": [recipient],
            "subject": subject,
            "html": body_html,
        }
        if body_text:
            params["text"] = body_text

        r = resend.Emails.send(params)
        print(f"[Email] Sent successfully to {recipient} (id: {r['id']})")
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
          GTM Intelligence
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
