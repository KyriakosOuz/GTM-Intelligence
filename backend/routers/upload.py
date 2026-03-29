import io
from datetime import datetime, timezone
import pandas as pd
from fastapi import APIRouter, UploadFile, File
from services.pinecone_service import upsert_records

router = APIRouter()

REQUIRED_COLUMNS = {"company", "contact", "status", "deal_value", "last_contact", "owner", "source"}


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".csv"):
            return {"success": False, "data": None, "error": "Only .csv files are accepted"}

        contents = await file.read()

        try:
            df = pd.read_csv(io.BytesIO(contents), encoding="utf-8")
        except UnicodeDecodeError:
            df = pd.read_csv(io.BytesIO(contents), encoding="latin-1")

        missing = REQUIRED_COLUMNS - set(df.columns)
        if missing:
            return {
                "success": False,
                "data": None,
                "error": f"Missing required columns: {', '.join(sorted(missing))}",
            }

        records = df.to_dict(orient="records")
        count = await upsert_records(records)

        return {
            "success": True,
            "data": {
                "embedded": count,
                "skipped": 0,
                "errors": [],
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
            "error": None,
        }
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}
