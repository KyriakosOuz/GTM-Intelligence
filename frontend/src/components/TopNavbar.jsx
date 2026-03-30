import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTeam, getLeads } from '../services/api'

export default function TopNavbar({ pageTitle }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [showTeam, setShowTeam] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [team, setTeam] = useState([])
  const teamRef = useRef(null)
  const filterRef = useRef(null)

  // Close popovers on outside click
  useEffect(() => {
    const handler = (e) => {
      if (teamRef.current && !teamRef.current.contains(e.target)) setShowTeam(false)
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Fetch team on popover open
  useEffect(() => {
    if (showTeam && team.length === 0) {
      getTeam().then((res) => {
        if (res.success) setTeam(res.data)
      })
    }
  }, [showTeam, team.length])

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = window.location.href
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  const handleExport = useCallback(async () => {
    try {
      const res = await getLeads()
      if (!res.success || !res.data?.length) return
      const rows = res.data
      const headers = Object.keys(rows[0])
      const csv = [
        headers.join(','),
        ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))
      ].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gtm-intelligence-${pageTitle.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // silent fail
    }
  }, [pageTitle])

  const filterOptions = [
    { label: 'Active Deals', icon: 'trending_up', to: '/deals' },
    { label: 'Team Performance', icon: 'group', to: '/network' },
    { label: 'AI Intelligence', icon: 'insights', to: '/intelligence' },
    { label: 'Reports', icon: 'assessment', to: '/reports' },
    { label: 'Settings', icon: 'settings', to: '/settings' },
  ]

  const avatarColors = [
    { bg: 'bg-rose-100', text: 'text-crimson' },
    { bg: 'bg-blue-100', text: 'text-blue-600' },
  ]

  return (
    <header className="flex justify-between items-center w-full px-8 py-6 sticky top-0 z-20 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1">
        <div className="mr-4">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GTM Intelligence / {pageTitle}</p>
          <h2 className="text-lg font-bold font-headline text-zinc-900 -mt-0.5">{pageTitle}</h2>
        </div>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
            <input
              className="w-full bg-white border border-zinc-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-rose-500/10 focus:border-crimson outline-none transition-all"
              placeholder='Try searching "insights"'
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {/* Team avatars — click to see team */}
        <div className="relative" ref={teamRef}>
          <button
            className="flex -space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowTeam(!showTeam)}
          >
            {team.length > 0 ? (
              <>
                {team.slice(0, 2).map((m, i) => (
                  <div key={m.name} className={`w-8 h-8 rounded-full ${avatarColors[i]?.bg || 'bg-zinc-200'} border-2 border-white flex items-center justify-center text-[10px] font-bold ${avatarColors[i]?.text || 'text-zinc-600'}`}>
                    {m.name.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}
                {team.length > 2 && (
                  <div className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                    +{team.length - 2}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-crimson">AA</div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">EY</div>
                <div className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">+3</div>
              </>
            )}
          </button>
          {showTeam && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 p-4 z-50">
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Team Members</h4>
              <div className="space-y-3">
                {team.length > 0 ? team.map((m, i) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${avatarColors[i]?.bg || 'bg-zinc-100'} flex items-center justify-center text-[10px] font-bold ${avatarColors[i]?.text || 'text-zinc-600'}`}>
                      {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{m.name}</p>
                      <p className="text-[11px] text-zinc-400">${(m.revenue || 0).toLocaleString()} revenue</p>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${m.win_rate >= 70 ? 'bg-emerald-50 text-emerald-600' : m.win_rate >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-crimson'}`}>
                      {m.win_rate}%
                    </span>
                  </div>
                )) : (
                  <p className="text-xs text-zinc-400">Loading team...</p>
                )}
              </div>
              <button
                className="mt-3 w-full text-xs text-crimson font-semibold py-2 hover:bg-rose-50 rounded-lg transition-colors"
                onClick={() => { setShowTeam(false); navigate('/network') }}
              >
                View full team
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-zinc-200"></div>

        <div className="flex items-center gap-3">
          {/* Filter — quick navigate */}
          <div className="relative" ref={filterRef}>
            <button
              className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
              onClick={() => setShowFilter(!showFilter)}
            >
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            {showFilter && (
              <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-zinc-100 py-2 z-50">
                <p className="px-4 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Quick Navigate</p>
                {filterOptions.map((opt) => (
                  <button
                    key={opt.to}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-crimson transition-colors"
                    onClick={() => { setShowFilter(false); navigate(opt.to) }}
                  >
                    <span className="material-symbols-outlined text-lg">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="px-4 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            onClick={handleExport}
          >
            Export
          </button>
          <button
            className="px-5 py-1.5 text-sm font-bold rounded-lg transition-all relative"
            onClick={handleShare}
            style={copied ? { background: '#16a34a', color: '#fff' } : { background: '#18181b', color: '#fff' }}
          >
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
    </header>
  )
}
