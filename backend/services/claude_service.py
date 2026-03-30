import os
import anthropic

client = None


def _init():
    global client
    if client is None:
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


async def chat_with_context(query: str, context: list[dict], history: list = None) -> str:
    _init()
    context_text = "\n\n".join(
        " | ".join(f"{k}: {v}" for k, v in record.items() if not k.startswith("_"))
        for record in context
    )

    messages = []
    if history:
        for msg in history[-6:]:
            messages.append({
                "role": msg["role"],
                "content": msg["content"],
            })

    messages.append({
        "role": "user",
        "content": f"CRM Data:\n{context_text}\n\nQuestion: {query}",
    })

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system="You are a GTM Intelligence assistant for a B2B CRM. Answer questions about the sales pipeline based on the provided CRM data. Be concise, specific, and reference actual data points. Format currency values and dates clearly.",
        messages=messages,
    )
    return message.content[0].text


async def generate_insights(records: list[dict]) -> list[str]:
    _init()
    context_text = "\n".join(
        " | ".join(f"{k}: {v}" for k, v in record.items() if not k.startswith("_"))
        for record in records
    )

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system="You are a GTM Intelligence assistant. Generate exactly 4 actionable pipeline insights from the CRM data. Each insight should be 1-2 sentences. Return them as a numbered list.",
        messages=[
            {
                "role": "user",
                "content": f"Generate 4 pipeline insights from this CRM data:\n{context_text}",
            }
        ],
    )
    text = message.content[0].text
    return [line.strip() for line in text.strip().split("\n") if line.strip()]


async def generate_report(records: list[dict]) -> str:
    _init()
    context_text = "\n".join(
        " | ".join(f"{k}: {v}" for k, v in record.items() if not k.startswith("_"))
        for record in records
    )

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1500,
        system="You are a senior GTM analyst. Generate a professional pipeline health report in markdown format with these sections:\n## Executive Summary\n## Top Opportunities (list top 5 deals)\n## Stalled Deals Alert (deals with no contact 30+ days)\n## Team Performance Summary\n## Recommended Next Actions\n\nUse specific names, numbers and dates from the data. Be direct and actionable. Under 500 words total.",
        messages=[
            {
                "role": "user",
                "content": f"Write a pipeline report from this CRM data:\n{context_text}",
            }
        ],
    )
    return message.content[0].text
