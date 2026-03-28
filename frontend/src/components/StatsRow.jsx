export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {/* Total Pipeline Revenue */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Total Revenue</h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-bold text-zinc-900">$528k</span>
          <span className="text-[10px] text-crimson font-bold">+12%</span>
        </div>
      </div>
      {/* Top Sales */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Top Sales</h3>
        <div className="text-xl font-bold text-zinc-900 mt-1">72</div>
      </div>
      {/* Best Deal (Dark) */}
      <div className="bg-dark-navy p-4 rounded-2xl card-shadow flex flex-col justify-between overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="section-label text-zinc-400">Best Deal</h3>
          <div className="text-lg font-bold text-white mt-1">$42,300</div>
          <p className="text-[10px] text-zinc-500 truncate">Rolf Inc.</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-crimson/20 blur-xl rounded-full"></div>
      </div>
      {/* Deals */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Deals</h3>
        <div className="text-xl font-bold text-zinc-900 mt-1">256</div>
      </div>
      {/* Value (Pink Border) */}
      <div className="bg-white p-4 rounded-2xl card-shadow border-2 border-crimson/30">
        <h3 className="section-label text-crimson">Value</h3>
        <div className="text-xl font-bold text-zinc-900 mt-1">528k</div>
      </div>
      {/* Win Rate */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Win Rate</h3>
        <div className="text-xl font-bold text-zinc-900 mt-1">44%</div>
      </div>
      {/* Velocity */}
      <div className="bg-white p-4 rounded-2xl card-shadow border border-zinc-50">
        <h3 className="section-label">Velocity</h3>
        <div className="text-xl font-bold text-zinc-900 mt-1">12d</div>
      </div>
    </div>
  )
}
