import { useState, useEffect, useMemo } from 'react'
import { getLeads } from '../services/api'

const RANGES = [
  { label: '4W', weeks: 4 },
  { label: '8W', weeks: 8 },
  { label: '12W', weeks: 12 },
  { label: 'All', weeks: null },
]

// Weekly target growth rate (dollars per week)
const WEEKLY_TARGET_GROWTH = 12000

function getWeekNumber(date) {
  const d = new Date(date)
  const start = new Date(d.getFullYear(), 0, 1)
  const diff = d - start
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
}

function getWeekKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-W${String(getWeekNumber(d)).padStart(2, '0')}`
}

function getWeekLabel(weekKey) {
  const parts = weekKey.split('-W')
  return `W${parseInt(parts[1], 10)}`
}

function buildPath(points, width, height, padding) {
  if (points.length === 0) return ''
  const xStep = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0
  const coords = points.map((y, i) => ({
    x: padding + i * xStep,
    y: padding + (1 - y) * (height - padding * 2),
  }))

  let d = `M${coords[0].x} ${coords[0].y}`
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1]
    const curr = coords[i]
    const cpx = (prev.x + curr.x) / 2
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
}

function buildMarkers(points, width, height, padding) {
  if (points.length === 0) return []
  const xStep = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0
  // Place markers at ~1/3 and ~2/3 through the data
  const indices = []
  if (points.length >= 3) {
    indices.push(Math.floor(points.length / 3))
    indices.push(Math.floor((points.length * 2) / 3))
  } else if (points.length === 2) {
    indices.push(1)
  }

  return indices.map((i) => ({
    cx: padding + i * xStep,
    cy: padding + (1 - points[i]) * (height - padding * 2),
  }))
}

function LoadingSkeleton() {
  return (
    <div className="bg-white p-8 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-8">
        <h3 className="section-label">Sales Dynamic</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-crimson"></div>
            <span className="section-label">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300"></div>
            <span className="section-label">Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
            <span className="section-label">Past</span>
          </div>
        </div>
      </div>
      <div className="relative h-56 w-full animate-pulse">
        <div className="w-full h-full bg-zinc-50 rounded-xl"></div>
      </div>
    </div>
  )
}

// Fallback static data matching original design
const fallbackWeeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11']

export default function SalesDynamic() {
  const [leads, setLeads] = useState(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('12W')

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getLeads()
        if (result.success && result.data?.length > 0) {
          setLeads(result.data)
        }
      } catch {
        // fallback to static
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const chartData = useMemo(() => {
    if (!leads) return null

    // Group deals by week
    const weeklyMap = {}
    leads.forEach((lead) => {
      if (!lead.last_contact || !lead.deal_value) return
      const key = getWeekKey(lead.last_contact)
      if (!weeklyMap[key]) weeklyMap[key] = 0
      weeklyMap[key] += lead.deal_value
    })

    // Sort weeks chronologically
    const allWeeks = Object.keys(weeklyMap).sort()
    if (allWeeks.length === 0) return null

    // Apply range filter
    const selectedRange = RANGES.find((r) => r.label === range)
    const visibleWeeks = selectedRange?.weeks
      ? allWeeks.slice(-selectedRange.weeks)
      : allWeeks

    if (visibleWeeks.length === 0) return null

    // Current: cumulative deal values per week
    const weeklyValues = visibleWeeks.map((w) => weeklyMap[w] || 0)
    const cumulative = []
    weeklyValues.reduce((sum, val) => {
      sum += val
      cumulative.push(sum)
      return sum
    }, 0)

    const maxVal = Math.max(...cumulative, 1)

    // Normalize to 0-1 range
    const currentNorm = cumulative.map((v) => v / maxVal)

    // Target: linear growth line
    const targetNorm = visibleWeeks.map((_, i) => {
      const targetVal = WEEKLY_TARGET_GROWTH * (i + 1)
      return Math.min(targetVal / maxVal, 1)
    })

    // Past: shift current data down by ~20% to simulate previous period
    const pastNorm = currentNorm.map((v) => Math.max(0, v * 0.65))

    const labels = visibleWeeks.map(getWeekLabel)

    return { currentNorm, targetNorm, pastNorm, labels }
  }, [leads, range])

  if (loading) return <LoadingSkeleton />

  const useDynamic = chartData !== null
  const W = 1000
  const H = 200
  const P = 20

  return (
    <div className="bg-white p-8 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h3 className="section-label">Sales Dynamic</h3>
          <div className="flex bg-zinc-50 p-1 rounded-lg">
            {RANGES.map((r) => (
              <button
                key={r.label}
                onClick={() => setRange(r.label)}
                className={[
                  'px-3 py-1 text-[10px] font-bold rounded-md transition-all',
                  range === r.label
                    ? 'bg-white shadow-sm text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-600',
                ].join(' ')}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-crimson"></div>
            <span className="section-label">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300"></div>
            <span className="section-label">Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
            <span className="section-label">Past</span>
          </div>
        </div>
      </div>
      <div className="relative h-56 w-full">
        {useDynamic ? (
          <>
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${W} ${H}`}>
              {/* Grid lines */}
              <line stroke="#F9FAFB" strokeWidth="1" x1="0" x2={W} y1="50" y2="50" />
              <line stroke="#F9FAFB" strokeWidth="1" x1="0" x2={W} y1="100" y2="100" />
              <line stroke="#F9FAFB" strokeWidth="1" x1="0" x2={W} y1="150" y2="150" />
              {/* Target (dashed green) */}
              <path
                d={buildPath(chartData.targetNorm, W, H, P)}
                fill="none"
                stroke="#6fdc98"
                strokeDasharray="8,4"
                strokeWidth="3"
              />
              {/* Past (gray) */}
              <path
                d={buildPath(chartData.pastNorm, W, H, P)}
                fill="none"
                stroke="#e2e2e2"
                strokeWidth="2"
              />
              {/* Current (crimson) */}
              <path
                d={buildPath(chartData.currentNorm, W, H, P)}
                fill="none"
                stroke="#E8175D"
                strokeWidth="4"
              />
              {/* Markers on current line */}
              {buildMarkers(chartData.currentNorm, W, H, P).map((m, i) => (
                <circle key={i} cx={m.cx} cy={m.cy} fill="#E8175D" r="6" />
              ))}
            </svg>
            <div className="flex justify-between mt-6 section-label">
              {chartData.labels.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
          </>
        ) : (
          <>
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <line stroke="#F9FAFB" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50" />
              <line stroke="#F9FAFB" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100" />
              <line stroke="#F9FAFB" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150" />
              <path d="M0 160 Q 250 140, 500 100 T 1000 40" fill="none" stroke="#6fdc98" strokeDasharray="8,4" strokeWidth="3" />
              <path d="M0 180 Q 250 160, 500 150 T 1000 140" fill="none" stroke="#e2e2e2" strokeWidth="2" />
              <path d="M0 170 Q 150 150, 300 100 T 600 80 T 1000 20" fill="none" stroke="#E8175D" strokeWidth="4" />
              <circle cx="300" cy="100" fill="#E8175D" r="6" />
              <circle cx="600" cy="80" fill="#E8175D" r="6" />
            </svg>
            <div className="flex justify-between mt-6 section-label">
              {fallbackWeeks.map((w) => <span key={w}>{w}</span>)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
