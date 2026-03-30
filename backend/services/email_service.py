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
