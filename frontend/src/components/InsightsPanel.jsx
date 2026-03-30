import { useState, useEffect } from 'react'
import { getInsights } from '../services/api'

export default function InsightsPanel() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInsights = async () => {
    setLoading(true)
    const res = await getInsights()
    if (res.success) {
      setInsights(Array.isArray(res.data) ? res.data : [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="section-label">AI Insights</h3>
        <button
          className="text-zinc-400 hover:text-crimson transition-colors disabled:opacity-50"
          onClick={fetchInsights}
          disabled={loading}
          title="Refresh insights"
        >
          <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : ''}`}>refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-zinc-100 rounded animate-pulse" style={{ width: `${85 - i * 10}%` }} />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {insights.map((insight, i) => (
            <li key={i} className="text-sm text-zinc-600 leading-relaxed">
              {insight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
