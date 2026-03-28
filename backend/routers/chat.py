from fastapi import APIRouter
from pydantic import BaseModel
from services.pinecone_service import query_similar
from services.claude_service import chat_with_context

router = APIRouter()

BROAD_KEYWORDS = {"report", "summary", "total", "all deals", "pipeline", "overview", "full"}


def is_broad_query(message: str) -> bool:
    lower = message.lower()
    return any(kw in lower for kw in BROAD_KEYWORDS)


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat(req: ChatRequest):
    try:
        top_k = 26 if is_broad_query(req.message) else 5
        context = await query_similar(req.message, top_k=top_k)
        answer = await chat_with_context(req.message, context)
        return {"success": True, "data": answer, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}
