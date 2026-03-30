import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { icon: 'dashboard', to: '/', label: 'Dashboard', fill: true },
  { icon: 'payments', to: '/deals', label: 'Deals' },
  { icon: 'insights', to: '/intelligence', label: 'Intelligence' },
  { icon: 'group', to: '/network', label: 'Network' },
  { icon: 'assessment', to: '/reports', label: 'Reports' },
  { icon: 'settings', to: '/settings', label: 'Settings' },
]

const shortcuts = [
  { keys: ['D'], label: 'Dashboard' },
  { keys: ['E'], label: 'Deals' },
  { keys: ['I'], label: 'Intelligence' },
  { keys: ['N'], label: 'Network' },
  { keys: ['R'], label: 'Reports' },
  { keys: ['S'], label: 'Settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(false)
  const helpRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (helpRef.current && !helpRef.current.contains(e.target)) setShowHelp(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <aside className="fixed left-0 top-0 h-full w-[72px] flex flex-col items-center py-8 z-50 bg-white border-r border-zinc-100">
      <div className="mb-10">
        <img src="/favicon.svg" alt="GTM Intelligence" className="w-8 h-8" />
      </div>
      <nav className="flex flex-col gap-8">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `relative group ${isActive ? 'text-crimson' : 'text-zinc-400 hover:text-zinc-600'}`
            }
            title={item.label}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-1 h-6 bg-crimson rounded-r-full" />
                )}
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive && item.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-6">
        {/* Help — shows quick guide popover */}
        <div className="relative" ref={helpRef}>
          <button
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
            onClick={() => setShowHelp(!showHelp)}
            title="Help & Shortcuts"
          >
            <span className="material-symbols-outlined text-2xl">help</span>
          </button>
          {showHelp && (
            <div className="absolute left-full ml-3 bottom-0 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 p-4 z-50">
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Quick Guide</h4>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-zinc-600"><strong className="text-zinc-900">AI Chat</strong> — Ask any pipeline question from the chat bar</p>
                <p className="text-xs text-zinc-600"><strong className="text-zinc-900">Reports</strong> — Generate AI pipeline reports in one click</p>
                <p className="text-xs text-zinc-600"><strong className="text-zinc-900">Automation</strong> — Daily email + Slack reports at 9 AM</p>
                <p className="text-xs text-zinc-600"><strong className="text-zinc-900">Export</strong> — Download CRM data as CSV from top bar</p>
              </div>
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Pages</h4>
              <div className="space-y-1.5">
                {shortcuts.map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-600">{s.label}</span>
                    <kbd className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded text-[10px] font-mono">{s.keys[0]}</kbd>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-100">
                <p className="text-[10px] text-zinc-400">GTM Intelligence v1.0 — Powered by Claude</p>
              </div>
            </div>
          )}
        </div>

        {/* Archive — go to My Reports */}
        <button
          className="text-zinc-400 hover:text-zinc-600 transition-colors"
          onClick={() => navigate('/my-reports')}
          title="My Reports"
        >
          <span className="material-symbols-outlined text-2xl">archive</span>
        </button>
      </div>
    </aside>
  )
}
