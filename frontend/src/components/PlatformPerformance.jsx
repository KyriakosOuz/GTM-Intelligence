export default function PlatformPerformance() {
  return (
    <div className="col-span-12 lg:col-span-4 bg-crimson p-6 rounded-2xl text-white shadow-lg shadow-rose-500/10">
      <h3 className="section-label text-white/60 mb-8">Platform Performance</h3>
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-white/70 uppercase">Total Growth</p>
            <p className="large-number text-white">84.2%</p>
          </div>
          <span className="material-symbols-outlined bg-white/20 p-2 rounded-full">trending_up</span>
        </div>
        <div className="h-20 flex items-end gap-2">
          <div className="flex-1 bg-white/20 rounded-sm h-1/2"></div>
          <div className="flex-1 bg-white/40 rounded-sm h-3/4"></div>
          <div className="flex-1 bg-white/20 rounded-sm h-1/3"></div>
          <div className="flex-1 bg-white/60 rounded-sm h-full"></div>
          <div className="flex-1 bg-white/20 rounded-sm h-2/3"></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-[9px] font-bold opacity-60 uppercase">Revenue</p>
            <p className="text-sm font-bold">+12%</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-[9px] font-bold opacity-60 uppercase">Leads</p>
            <p className="text-sm font-bold">342</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-[9px] font-bold opacity-60 uppercase">Win/Rate</p>
            <p className="text-sm font-bold">44%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
