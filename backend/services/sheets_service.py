import os
import json
import gspread
from google.oauth2.service_account import Credentials


async def fetch_sheet_data() -> list[dict]:
    creds_json = os.getenv("GOOGLE_SHEETS_CREDENTIALS", "{}")
    sheet_url = os.getenv("GOOGLE_SHEET_URL", "")

    if not sheet_url or creds_json == "{}":
        raise ValueError("Google Sheets credentials or URL not configured")

    creds_data = json.loads(creds_json)
    creds = Credentials.from_service_account_info(
        creds_data,
        scopes=[
            "https://spreadsheets.google.com/feeds",
            "https://www.googleapis.com/auth/drive",
        ],
    )
    gc = gspread.authorize(creds)
    sheet = gc.open_by_url(sheet_url).sheet1
    return sheet.get_all_records()
