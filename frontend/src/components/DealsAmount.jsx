const bars = [
  { height: 'h-2/3', color: 'bg-zinc-50' },
  { height: 'h-3/4', color: 'bg-crimson' },
  { height: 'h-1/2', color: 'bg-zinc-50' },
  { height: 'h-full', color: 'bg-zinc-50' },
  { height: 'h-2/3', color: 'bg-zinc-50' },
  { height: 'h-3/4', color: 'bg-zinc-50' },
  { height: 'h-1/2', color: 'bg-crimson' },
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DealsAmount() {
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-8">
        <h3 className="section-label">Deals Amount</h3>
        <div className="flex bg-zinc-50 p-1 rounded-lg">
          <button className="px-3 py-1 text-[10px] font-bold bg-white shadow-sm rounded-md text-zinc-900">Revenue</button>
          <button className="px-3 py-1 text-[10px] font-bold text-zinc-500">Leads</button>
          <button className="px-3 py-1 text-[10px] font-bold text-zinc-500">W/L</button>
        </div>
      </div>
      <div className="flex items-end gap-3 h-40 pt-4">
        {bars.map((bar, i) => (
          <div key={i} className={`flex-1 ${bar.color} rounded-t-lg ${bar.height}`}></div>
        ))}
      </div>
      <div className="flex justify-between mt-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
        {days.map((d) => <span key={d}>{d}</span>)}
      </div>
    </div>
  )
}
