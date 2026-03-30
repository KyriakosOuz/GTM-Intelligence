import { useState, useEffect } from 'react'
import { getLeads } from '../services/api'

const fallbackBars = [
  { height: 'h-2/3', color: 'bg-zinc-50' },
  { height: 'h-3/4', color: 'bg-crimson' },
  { height: 'h-1/2', color: 'bg-zinc-50' },
  { height: 'h-full', color: 'bg-zinc-50' },
  { height: 'h-2/3', color: 'bg-zinc-50' },
  { height: 'h-3/4', color: 'bg-zinc-50' },
  { height: 'h-1/2', color: 'bg-crimson' },
]

const fallbackLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function LoadingSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-8">
        <h3 className="section-label">Deals Amount</h3>
        <div className="flex bg-zinc-50 p-1 rounded-lg">
          <button className="px-3 py-1 text-[10px] font-bold bg-white shadow-sm rounded-md text-zinc-900">Revenue</button>
          <button className="px-3 py-1 text-[10px] font-bold text-zinc-500">Leads</button>
          <button className="px-3 py-1 text-[10px] font-bold text-zinc-500">W/L</button>
        </div>
      </div>
      <div className="flex items-end gap-3 h-40 pt-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex-1 bg-zinc-100 rounded-t-lg" style={{ height: `${30 + Math.random() * 50}%` }}></div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-2.5 bg-zinc-100 rounded w-6 animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}

export default function DealsAmount() {
  const [bars, setBars] = useState(null)
  const [labels, setLabels] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getLeads()
        if (result.success && result.data && result.data.length > 0) {
          const grouped = {}
          result.data.forEach((lead) => {
            const key = lead.status || lead.source || 'Other'
            if (!grouped[key]) grouped[key] = 0
            grouped[key] += lead.deal_value || 0
          })

          const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1])
          const maxValue = entries[0]?.[1] || 1
          const topIndex = 0
          const secondHighestIdx = entries.length > 2 ? Math.floor(entries.length / 2) : -1

          const dynamicBars = entries.map(([, value], index) => {
            const pct = Math.max(10, Math.round((value / maxValue) * 100))
            const isHighlight = index === topIndex || index === secondHighestIdx
            return {
              heightStyle: `${pct}%`,
              color: isHighlight ? 'bg-crimson' : 'bg-zinc-50',
            }
          })

          const dynamicLabels = entries.map(([name]) => {
            return name.length > 4 ? name.slice(0, 4) : name
          })

          setBars(dynamicBars)
          setLabels(dynamicLabels)
        } else {
          setBars(null)
          setLabels(null)
        }
      } catch {
        setBars(null)
        setLabels(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSkeleton />

  const useDynamic = bars && labels
  const displayLabels = useDynamic ? labels : fallbackLabels

  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-8">
        <h3 className="section-label">Deals Amount</h3>
        <div className="flex bg-zinc-50 p-1 rounded-lg">
          <button className="px-3 py-1 text-[10px] font-bold bg-white shadow-sm rounded-md text-zinc-900">Revenue</button>
          <button className="px-3 py-1 text-[10px] font-bold text-zinc-500">Leads</button>
          <button className="px-3 py-1 text-[10px] font-bold text-zinc-500">W/L</button>
        </div>
      </div>
      <div className="flex items-end gap-3 h-40 pt-4">
        {useDynamic
          ? bars.map((bar, i) => (
              <div key={i} className={`flex-1 ${bar.color} rounded-t-lg`} style={{ height: bar.heightStyle }}></div>
            ))
          : fallbackBars.map((bar, i) => (
              <div key={i} className={`flex-1 ${bar.color} rounded-t-lg ${bar.height}`}></div>
            ))
        }
      </div>
      <div className="flex justify-between mt-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
        {displayLabels.map((d) => <span key={d}>{d}</span>)}
      </div>
    </div>
  )
}
