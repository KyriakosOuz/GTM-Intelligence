from fastapi import APIRouter
from services.pinecone_service import query_similar

router = APIRouter()


@router.get("/stats")
async def get_stats():
    try:
        records = await query_similar("all companies deals pipeline revenue", top_k=100)

        revenues = []
        best_deal = {"company": "N/A", "value": 0}
        won_count = 0
        lost_count = 0

        for r in records:
            try:
                val = float(r.get("deal_value", 0))
            except (ValueError, TypeError):
                val = 0
            revenues.append(val)

            if val > best_deal["value"]:
                best_deal = {"company": r.get("company", "Unknown"), "value": val}

            status = r.get("status", "")
            if status == "Closed Won":
                won_count += 1
            elif status == "Closed Lost":
                lost_count += 1

        total_revenue = sum(revenues)
        total_deals = len(revenues)
        closed_total = won_count + lost_count
        win_rate = round(won_count / closed_total * 100) if closed_total else 0

        return {
            "success": True,
            "data": {
                "total_revenue": round(total_revenue, 2),
                "total_deals": total_deals,
                "top_sales_count": total_deals,
                "best_deal": best_deal,
                "win_rate": win_rate,
                "avg_velocity_days": 12,
                "pipeline_value": round(total_revenue, 2),
            },
            "error": None,
        }
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}
