from fastapi import APIRouter
from scheduler import run_now
import threading

router = APIRouter()


@router.post("/trigger")
async def trigger_automation():
    """Manually trigger the daily automation immediately."""
    try:
        thread = threading.Thread(target=run_now, daemon=True)
        thread.start()
        return {
            "success": True,
            "data": {
                "message": "Automation triggered. Check email and Slack in ~30 seconds.",
                "email": "kyriakos.ouzounis@gmail.com"
            },
            "error": None
        }
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}


@router.get("/status")
async def automation_status():
    """Check automation schedule status."""
    import schedule
    jobs = schedule.get_jobs()
    return {
        "success": True,
        "data": {
            "jobs": len(jobs),
            "next_run": str(jobs[0].next_run) if jobs else None,
            "schedule": "Daily at 09:00"
        },
        "error": None
    }
