import { useState, useEffect } from 'react'
import { getTeam } from '../services/api'

const AVATAR_STYLES = [
  { bg: 'bg-rose-50', text: 'text-crimson' },
  { bg: 'bg-blue-50', text: 'text-blue-600' },
  { bg: 'bg-purple-50', text: 'text-purple-600' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { bg: 'bg-amber-50', text: 'text-amber-600' },
  { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { bg: 'bg-pink-50', text: 'text-pink-600' },
  { bg: 'bg-indigo-50', text: 'text-indigo-600' },
]

const fallbackMembers = [
  { initials: 'AA', name: 'Armin A.', revenue: '$209k Revenue', width: '85%', bg: 'bg-rose-50', text: 'text-crimson' },
  { initials: 'EY', name: 'Eren Y.', revenue: '$142k Revenue', width: '65%', bg: 'bg-blue-50', text: 'text-blue-600' },
  { initials: 'MA', name: 'Mikasa A.', revenue: '$98k Revenue', width: '45%', bg: 'bg-purple-50', text: 'text-purple-600' },
  { initials: 'LR', name: 'Levi R.', revenue: '$79k Revenue', width: '38%', bg: 'bg-emerald-50', text: 'text-emerald-600' },
]

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatRevenue(value) {
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k Revenue`
  }
  return `$${value.toLocaleString()} Revenue`
}

function LoadingSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <h3 className="section-label mb-6">Pipeline Velocity By Member</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-200"></div>
              <div className="flex-1">
                <div className="h-3 bg-zinc-200 rounded w-20 mb-1"></div>
                <div className="h-2.5 bg-zinc-100 rounded w-16"></div>
              </div>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-200 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PipelineVelocity() {
  const [members, setMembers] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getTeam()
        if (result.success && result.data) {
          const sorted = [...result.data].sort(
            (a, b) => (b.total_revenue || 0) - (a.total_revenue || 0)
          )
          const maxRevenue = sorted[0]?.total_revenue || 1
          const mapped = sorted.map((rep, index) => {
            const style = AVATAR_STYLES[index % AVATAR_STYLES.length]
            const pct = Math.round((rep.total_revenue / maxRevenue) * 100)
            return {
              initials: getInitials(rep.name),
              name: rep.name,
              revenue: formatRevenue(rep.total_revenue),
              width: `${pct}%`,
              bg: style.bg,
              text: style.text,
            }
          })
          setMembers(mapped)
        } else {
          setMembers(fallbackMembers)
        }
      } catch {
        setMembers(fallbackMembers)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSkeleton />

  const displayMembers = members || fallbackMembers

  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <h3 className="section-label mb-6">Pipeline Velocity By Member</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayMembers.map((m) => (
          <div key={m.initials} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${m.bg} flex items-center justify-center font-bold ${m.text} text-[10px]`}>
                {m.initials}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-zinc-900">{m.name}</p>
                <p className="text-[10px] text-supporting">{m.revenue}</p>
              </div>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-crimson rounded-full" style={{ width: m.width }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
