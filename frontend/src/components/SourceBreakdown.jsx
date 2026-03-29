import { useState, useEffect } from 'react'
import { getLeads } from '../services/api'

const SOURCE_ICONS = {
  Dribbble: 'language',
  Instagram: 'camera',
  Behance: 'brush',
  Google: 'search',
  LinkedIn: 'work',
  Twitter: 'tag',
  Facebook: 'group',
  Referral: 'people',
  Email: 'mail',
  Direct: 'open_in_new',
  Organic: 'eco',
  Paid: 'payments',
  Other: 'more_horiz',
}

const fallbackSources = [
  { name: 'Dribbble', amount: '$124,500', width: '72%', icon: 'language' },
  { name: 'Instagram', amount: '$82,000', width: '48%', icon: 'camera' },
  { name: 'Behance', amount: '$64,000', width: '35%', icon: 'brush' },
  { name: 'Google', amount: '$37,000', width: '22%', icon: 'search' },
]

function LoadingSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-8">
        <h3 className="section-label">Source Breakdown</h3>
        <span className="material-symbols-outlined text-zinc-300">more_horiz</span>
      </div>
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-zinc-100"></div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <div className="h-3 bg-zinc-200 rounded w-20"></div>
                <div className="h-3 bg-zinc-200 rounded w-16"></div>
              </div>
              <div className="h-1.5 bg-zinc-50 rounded-full">
                <div className="h-full bg-zinc-200 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SourceBreakdown() {
  const [sources, setSources] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getLeads()
        if (result.success && result.data) {
          const grouped = {}
          result.data.forEach((lead) => {
            const source = lead.source || 'Other'
            if (!grouped[source]) grouped[source] = 0
            grouped[source] += lead.deal_value || 0
          })

          const sorted = Object.entries(grouped)
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total)

          const maxValue = sorted[0]?.total || 1

          const mapped = sorted.map((s) => ({
            name: s.name,
            amount: `$${s.total.toLocaleString()}`,
            width: `${Math.round((s.total / maxValue) * 100)}%`,
            icon: SOURCE_ICONS[s.name] || 'category',
          }))

          setSources(mapped)
        } else {
          setSources(fallbackSources)
        }
      } catch {
        setSources(fallbackSources)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSkeleton />

  const displaySources = sources || fallbackSources

  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-8">
        <h3 className="section-label">Source Breakdown</h3>
        <span className="material-symbols-outlined text-zinc-300">more_horiz</span>
      </div>
      <div className="space-y-6">
        {displaySources.map((s) => (
          <div key={s.name} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400">
              <span className="material-symbols-outlined text-lg">{s.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-body-main font-bold">{s.name}</span>
                <span className="text-body-main font-semibold">{s.amount}</span>
              </div>
              <div className="h-1.5 bg-zinc-50 rounded-full">
                <div className="h-full bg-zinc-900 rounded-full" style={{ width: s.width }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
