export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[72px] flex flex-col items-center py-8 z-50 bg-white border-r border-zinc-100">
      <div className="mb-10 text-crimson">
        <span className="material-symbols-outlined text-3xl font-bold">rocket_launch</span>
      </div>
      <nav className="flex flex-col gap-8">
        <a className="text-crimson" href="#">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
        </a>
        <a className="text-zinc-400 hover:text-zinc-600" href="#">
          <span className="material-symbols-outlined text-2xl">payments</span>
        </a>
        <a className="text-zinc-400 hover:text-zinc-600" href="#">
          <span className="material-symbols-outlined text-2xl">insights</span>
        </a>
        <a className="text-zinc-400 hover:text-zinc-600" href="#">
          <span className="material-symbols-outlined text-2xl">group</span>
        </a>
        <a className="text-zinc-400 hover:text-zinc-600" href="#">
          <span className="material-symbols-outlined text-2xl">assessment</span>
        </a>
        <a className="text-zinc-400 hover:text-zinc-600" href="#">
          <span className="material-symbols-outlined text-2xl">settings</span>
        </a>
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
