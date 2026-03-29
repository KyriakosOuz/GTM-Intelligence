from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import chat, upload, sync, insights, report, leads, team, stats

app = FastAPI(title="GTM Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(upload.router)
app.include_router(sync.router)
app.include_router(insights.router)
app.include_router(report.router)
app.include_router(leads.router)
app.include_router(team.router)
app.include_router(stats.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
