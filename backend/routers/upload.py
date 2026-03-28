import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File
from services.pinecone_service import upsert_records

router = APIRouter()


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        records = df.to_dict(orient="records")
        count = await upsert_records(records)
        return {"success": True, "data": {"records_embedded": count}, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}
