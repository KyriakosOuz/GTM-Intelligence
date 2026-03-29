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

const BADGE_MAP = {
  'Armin A.': '\u{1F947}\u{1F525}',
  'Eren Y.': '\u2B50',
  'Mikasa A.': '\u{1F6E1}\uFE0F',
  'Levi R.': '\u26A1',
  'Sasha B.': '\u{1F356}',
}

const RANK_BADGES = ['\u{1F947}\u{1F525}', '\u2B50', '\u{1F6E1}\uFE0F', '\u26A1', '\u{1F356}', '\u{1F3AF}', '\u{1F4A1}', '\u{1F680}']

const fallbackReps = [
  { initials: 'AA', name: 'Armin A.', revenue: '$209,633', leads: 41, kpi: '0.92', kpiColor: 'bg-emerald-50 text-emerald-600', wl: '88%', badge: '\u{1F947}\u{1F525}', bg: 'bg-rose-50', text: 'text-crimson' },
  { initials: 'EY', name: 'Eren Y.', revenue: '$142,000', leads: 29, kpi: '0.72', kpiColor: 'bg-emerald-50 text-emerald-600', wl: '74%', badge: '\u2B50', bg: 'bg-blue-50', text: 'text-blue-600' },
  { initials: 'MA', name: 'Mikasa A.', revenue: '$98,400', leads: 24, kpi: '0.76', kpiColor: 'bg-zinc-50 text-zinc-500', wl: '62%', badge: '\u{1F6E1}\uFE0F', bg: 'bg-purple-50', text: 'text-purple-600' },
  { initials: 'LR', name: 'Levi R.', revenue: '$79,150', leads: 18, kpi: '0.71', kpiColor: 'bg-zinc-50 text-zinc-500', wl: '58%', badge: '\u26A1', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { initials: 'SB', name: 'Sasha B.', revenue: '$52,300', leads: 15, kpi: '0.65', kpiColor: 'bg-zinc-50 text-zinc-500', wl: '51%', badge: '\u{1F356}', bg: 'bg-amber-50', text: 'text-amber-600' },
]

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function LoadingSkeleton() {
  return (
    <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl card-shadow">
      <h3 className="section-label mb-6">Team Leaderboard</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-zinc-50 section-label">
            <tr>
              <th className="pb-4 font-bold">Sales Rep</th>
              <th className="pb-4 font-bold">Revenue</th>
              <th className="pb-4 font-bold">Leads</th>
              <th className="pb-4 font-bold">KPI</th>
              <th className="pb-4 font-bold">W/L</th>
              <th className="pb-4 font-bold">Badges</th>
            </tr>
          </thead>
          <tbody className="text-sm text-body-main">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className={`animate-pulse ${i > 1 ? 'border-t border-zinc-50' : ''}`}>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-200"></div>
                    <div className="h-3 bg-zinc-200 rounded w-20"></div>
                  </div>
                </td>
                <td className="py-4"><div className="h-3 bg-zinc-200 rounded w-16"></div></td>
                <td className="py-4"><div className="h-3 bg-zinc-200 rounded w-8"></div></td>
                <td className="py-4"><div className="h-5 bg-zinc-100 rounded-full w-10"></div></td>
                <td className="py-4"><div className="h-3 bg-zinc-200 rounded w-10"></div></td>
                <td className="py-4"><div className="h-3 bg-zinc-200 rounded w-6"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function TeamLeaderboard() {
  const [reps, setReps] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getTeam()
        if (result.success && result.data) {
          const sorted = [...result.data].sort(
            (a, b) => (b.total_revenue || 0) - (a.total_revenue || 0)
          )
          const mapped = sorted.map((rep, index) => {
            const style = AVATAR_STYLES[index % AVATAR_STYLES.length]
            const winRate = rep.win_rate || 0
            const kpiValue = rep.avg_deal_value
              ? (rep.avg_deal_value / 10000).toFixed(2)
              : (winRate / 100).toFixed(2)
            const isHighKpi = parseFloat(kpiValue) >= 0.72

            return {
              initials: getInitials(rep.name),
              name: rep.name,
              revenue: `$${(rep.total_revenue || 0).toLocaleString()}`,
              leads: rep.lead_count || 0,
              kpi: kpiValue,
              kpiColor: isHighKpi
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-zinc-50 text-zinc-500',
              wl: `${winRate}%`,
              badge: BADGE_MAP[rep.name] || RANK_BADGES[index % RANK_BADGES.length],
              bg: style.bg,
              text: style.text,
            }
          })
          setReps(mapped)
        } else {
          setReps(fallbackReps)
        }
      } catch {
        setReps(fallbackReps)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSkeleton />

  const displayReps = reps || fallbackReps

  return (
    <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl card-shadow">
      <h3 className="section-label mb-6">Team Leaderboard</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-zinc-50 section-label">
            <tr>
              <th className="pb-4 font-bold">Sales Rep</th>
              <th className="pb-4 font-bold">Revenue</th>
              <th className="pb-4 font-bold">Leads</th>
              <th className="pb-4 font-bold">KPI</th>
              <th className="pb-4 font-bold">W/L</th>
              <th className="pb-4 font-bold">Badges</th>
            </tr>
          </thead>
          <tbody className="text-sm text-body-main">
            {displayReps.map((rep, i) => (
              <tr key={rep.initials + i} className={`group hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-50' : ''}`}>
                <td className="py-4 font-bold">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${rep.bg} flex items-center justify-center font-bold ${rep.text} text-xs`}>
                      {rep.initials}
                    </div>
                    {rep.name}
                  </div>
                </td>
                <td className="py-4 font-semibold">{rep.revenue}</td>
                <td className="py-4">{rep.leads}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 ${rep.kpiColor} text-[10px] font-bold rounded-full`}>{rep.kpi}</span>
                </td>
                <td className="py-4 font-medium">{rep.wl}</td>
                <td className="py-4">{rep.badge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
