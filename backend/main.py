from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import chat, upload, sync, insights, report, leads, team, stats, automation


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(title="GTM Intelligence API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
app.include_router(automation.router, prefix="/automation", tags=["automation"])


@app.get("/health")
async def health():
    return {"status": "ok"}
