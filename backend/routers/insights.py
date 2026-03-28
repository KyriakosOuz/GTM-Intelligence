from fastapi import APIRouter
from services.pinecone_service import query_similar
from services.claude_service import generate_insights

router = APIRouter()


@router.get("/insights")
async def get_insights():
    try:
        records = await query_similar("pipeline overview deals revenue status", top_k=30)
        insights = await generate_insights(records)
        return {"success": True, "data": insights, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}
