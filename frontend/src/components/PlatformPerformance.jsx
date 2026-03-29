import { useState, useEffect } from 'react'
import { getStats } from '../services/api'

const fallbackStats = {
  totalGrowth: '84.2%',
  revenue: '+12%',
  leads: '342',
  winRate: '44%',
}

function LoadingSkeleton() {
  return (
    <div className="col-span-12 lg:col-span-4 bg-crimson p-6 rounded-2xl text-white shadow-lg shadow-rose-500/10">
      <h3 className="section-label text-white/60 mb-8">Platform Performance</h3>
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-end">
          <div>
            <div className="h-2.5 bg-white/20 rounded w-20 mb-2"></div>
            <div className="h-8 bg-white/20 rounded w-24"></div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
        </div>
        <div className="h-20 flex items-end gap-2">
          <div className="flex-1 bg-white/10 rounded-sm h-1/2"></div>
          <div className="flex-1 bg-white/10 rounded-sm h-3/4"></div>
          <div className="flex-1 bg-white/10 rounded-sm h-1/3"></div>
          <div className="flex-1 bg-white/10 rounded-sm h-full"></div>
          <div className="flex-1 bg-white/10 rounded-sm h-2/3"></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 p-3 rounded-lg">
              <div className="h-2 bg-white/10 rounded w-12 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-10"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PlatformPerformance() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getStats()
        if (result.success && result.data) {
          const d = result.data
          setStats({
            totalGrowth: d.win_rate != null ? `${d.win_rate}%` : fallbackStats.totalGrowth,
            revenue: '+12%',
            leads: d.total_deals != null ? String(d.total_deals) : fallbackStats.leads,
            winRate: d.win_rate != null ? `${d.win_rate}%` : fallbackStats.winRate,
          })
        } else {
          setStats(fallbackStats)
        }
      } catch {
        setStats(fallbackStats)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSkeleton />

  const displayStats = stats || fallbackStats

  return (
    <div className="col-span-12 lg:col-span-4 bg-crimson p-6 rounded-2xl text-white shadow-lg shadow-rose-500/10">
      <h3 className="section-label text-white/60 mb-8">Platform Performance</h3>
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-white/70 uppercase">Total Growth</p>
            <p className="large-number text-white">{displayStats.totalGrowth}</p>
          </div>
          <span className="material-symbols-outlined bg-white/20 p-2 rounded-full">trending_up</span>
        </div>
        <div className="h-20 flex items-end gap-2">
          <div className="flex-1 bg-white/20 rounded-sm h-1/2"></div>
          <div className="flex-1 bg-white/40 rounded-sm h-3/4"></div>
          <div className="flex-1 bg-white/20 rounded-sm h-1/3"></div>
          <div className="flex-1 bg-white/60 rounded-sm h-full"></div>
          <div className="flex-1 bg-white/20 rounded-sm h-2/3"></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-[9px] font-bold opacity-60 uppercase">Revenue</p>
            <p className="text-sm font-bold">{displayStats.revenue}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-[9px] font-bold opacity-60 uppercase">Leads</p>
            <p className="text-sm font-bold">{displayStats.leads}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-[9px] font-bold opacity-60 uppercase">Win/Rate</p>
            <p className="text-sm font-bold">{displayStats.winRate}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
