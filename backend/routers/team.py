from collections import defaultdict
from fastapi import APIRouter
from services.pinecone_service import query_similar

router = APIRouter()


@router.get("/team")
async def get_team():
    try:
        records = await query_similar("all sales reps team members pipeline", top_k=100)

        by_owner = defaultdict(list)
        for r in records:
            owner = r.get("owner", "Unknown")
            by_owner[owner].append(r)

        team = []
        for name, deals in by_owner.items():
            revenues = []
            won_count = 0
            lost_count = 0
            for d in deals:
                try:
                    revenues.append(float(d.get("deal_value", 0)))
                except (ValueError, TypeError):
                    revenues.append(0)
                status = d.get("status", "")
                if status == "Closed Won":
                    won_count += 1
                elif status == "Closed Lost":
                    lost_count += 1

            total_rev = sum(revenues)
            lead_count = len(deals)
            avg_deal = total_rev / lead_count if lead_count else 0
            closed_total = won_count + lost_count
            win_rate = round(won_count / closed_total * 100) if closed_total else 0

            team.append({
                "name": name,
                "total_revenue": round(total_rev, 2),
                "lead_count": lead_count,
                "avg_deal_value": round(avg_deal, 2),
                "win_rate": win_rate,
            })

        team.sort(key=lambda x: x["total_revenue"], reverse=True)
        return {"success": True, "data": team, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}
