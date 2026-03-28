export default function TopNavbar() {
  return (
    <header className="flex justify-between items-center w-full px-8 py-6 sticky top-0 z-20 bg-background/80 backdrop-blur-md">
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
      <div className="flex items-center gap-6">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-crimson">AA</div>
          <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">EY</div>
          <div className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">+3</div>
        </div>
        <div className="h-6 w-[1px] bg-zinc-200"></div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className="px-4 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">Export</button>
          <button className="px-5 py-1.5 text-sm font-bold bg-zinc-900 text-white rounded-lg transition-all hover:bg-zinc-800">Share</button>
        </div>
      </div>
    </header>
  )
}
