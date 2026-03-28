from datetime import datetime
from fastapi import APIRouter
from services.sheets_service import fetch_sheet_data
from services.pinecone_service import upsert_records

router = APIRouter()

last_sync_time = None


@router.post("/sync")
async def sync_sheet():
    global last_sync_time
    try:
        records = await fetch_sheet_data()
        count = await upsert_records(records)
        last_sync_time = datetime.utcnow().isoformat()
        return {"success": True, "data": {"records_synced": count, "synced_at": last_sync_time}, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}


@router.get("/sync/status")
async def sync_status():
    return {
        "success": True,
        "data": {"last_sync": last_sync_time},
        "error": None,
    }
