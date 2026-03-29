import { useState, useEffect } from 'react'
import { getStats } from '../services/api'

const FALLBACK = {
  total_revenue: 528976.82,
  total_deals: 26,
  top_sales_count: 72,
  best_deal: { company: 'Rolf Inc.', value: 42300 },
  win_rate: 44,
  avg_velocity_days: 12,
  pipeline_value: 528000,
}

function Skeleton() {
  return <div className="h-5 w-16 bg-zinc-100 rounded animate-pulse mt-1" />
}

export default function StatsRow() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const res = await getStats()
      setStats(res.success ? res.data : FALLBACK)
      setLoading(false)
    }
    fetch()
  }, [])

  const s = stats || FALLBACK
  const formatRev = (v) => v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${Math.round(v)}`

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Total Revenue</h3>
        <div className="flex items-baseline gap-1 mt-1">
          {loading ? <Skeleton /> : <span className="text-xl font-bold text-zinc-900">{formatRev(s.total_revenue)}</span>}
          <span className="text-[10px] text-crimson font-bold">+12%</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Top Sales</h3>
        {loading ? <Skeleton /> : <div className="text-xl font-bold text-zinc-900 mt-1">{s.top_sales_count}</div>}
      </div>
      <div className="bg-dark-navy p-4 rounded-2xl card-shadow flex flex-col justify-between overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="section-label text-zinc-400">Best Deal</h3>
          {loading ? <Skeleton /> : (
            <>
              <div className="text-lg font-bold text-white mt-1">${s.best_deal.value.toLocaleString()}</div>
              <p className="text-[10px] text-zinc-500 truncate">{s.best_deal.company}</p>
            </>
          )}
        </div>
        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-crimson/20 blur-xl rounded-full"></div>
      </div>
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Deals</h3>
        {loading ? <Skeleton /> : <div className="text-xl font-bold text-zinc-900 mt-1">{s.total_deals}</div>}
      </div>
      <div className="bg-white p-4 rounded-2xl card-shadow border-2 border-crimson/30">
        <h3 className="section-label text-crimson">Value</h3>
        {loading ? <Skeleton /> : <div className="text-xl font-bold text-zinc-900 mt-1">{formatRev(s.pipeline_value)}</div>}
      </div>
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Win Rate</h3>
        {loading ? <Skeleton /> : <div className="text-xl font-bold text-zinc-900 mt-1">{s.win_rate}%</div>}
      </div>
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Velocity</h3>
        {loading ? <Skeleton /> : <div className="text-xl font-bold text-zinc-900 mt-1">{s.avg_velocity_days}d</div>}
      </div>
    </div>
  )
}
