from fastapi import APIRouter
from pydantic import BaseModel
from services.pinecone_service import query_similar, delete_all_vectors

router = APIRouter()


@router.get("/leads")
async def get_leads():
    try:
        records = await query_similar("all companies deals contacts pipeline", top_k=100)
        cleaned = []
        for r in records:
            row = {k: v for k, v in r.items() if not k.startswith("_")}
            cleaned.append(row)
        return {"success": True, "data": cleaned, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}


class ClearRequest(BaseModel):
    confirm: bool = False


@router.post("/leads/clear")
async def clear_leads(req: ClearRequest):
    if not req.confirm:
        return {"success": False, "data": None, "error": "Must send {\"confirm\": true} to clear all data"}
    try:
        count = await delete_all_vectors()
        return {"success": True, "data": {"deleted": count}, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}
