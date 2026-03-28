from fastapi import APIRouter
from services.pinecone_service import query_similar
from services.claude_service import generate_report

router = APIRouter()


@router.get("/report")
async def get_report():
    try:
        records = await query_similar("full pipeline summary all deals", top_k=26)
        report = await generate_report(records)
        return {"success": True, "data": report, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}
