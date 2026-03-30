import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/reports', label: 'Reports', icon: 'folder_open' },
  { to: '/deals', label: 'Shared with me', icon: 'share' },
  { to: '/my-reports', label: 'My Reports', icon: 'description' },
]

export default function NavPanel() {
  const navigate = useNavigate()

  return (
    <aside className="fixed left-[72px] top-0 h-full w-[200px] bg-surface-container-low border-r border-zinc-100 py-8 px-6 z-40">
      <div className="mb-10">
        <h1 className="text-sm font-headline font-bold text-zinc-900 leading-tight">GTM Intelligence</h1>
        <p className="text-[9px] font-bold text-zinc-400 mt-0.5 uppercase tracking-widest">The Crimson Catalyst</p>
      </div>
      <div>
        <h3 className="section-label mb-4">Nav Tree</h3>
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <li key={label}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 text-sm px-2 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'text-crimson bg-rose-50 font-semibold'
                      : 'text-zinc-500 font-medium hover:text-zinc-900 hover:bg-zinc-50',
                  ].join(' ')
                }
              >
                <span className="material-symbols-outlined text-sm">{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-8 left-0 w-full px-6">
        <button
          className="w-full bg-crimson text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-95"
          onClick={() => navigate('/reports')}
        >
          New Report
        </button>
      </div>
    </aside>
  )
}
