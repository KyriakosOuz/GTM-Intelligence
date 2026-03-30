import { NavLink } from 'react-router-dom'

const navItems = [
  { icon: 'dashboard', to: '/', label: 'Dashboard', fill: true },
  { icon: 'payments', to: '/deals', label: 'Deals' },
  { icon: 'insights', to: '/intelligence', label: 'Intelligence' },
  { icon: 'group', to: '/network', label: 'Network' },
  { icon: 'assessment', to: '/reports', label: 'Reports' },
  { icon: 'settings', to: '/settings', label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[72px] flex flex-col items-center py-8 z-50 bg-white border-r border-zinc-100">
      <div className="mb-10 text-crimson">
        <span className="material-symbols-outlined text-3xl font-bold">rocket_launch</span>
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
        <a className="text-zinc-400 hover:text-zinc-600" href="#">
          <span className="material-symbols-outlined text-2xl">help</span>
        </a>
        <a className="text-zinc-400 hover:text-zinc-600" href="#">
          <span className="material-symbols-outlined text-2xl">archive</span>
        </a>
      </div>
    </aside>
  )
}
