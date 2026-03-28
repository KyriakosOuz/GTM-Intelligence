const sources = [
  { name: 'Dribbble', amount: '$124,500', width: '72%', icon: 'language' },
  { name: 'Instagram', amount: '$82,000', width: '48%', icon: 'camera' },
  { name: 'Behance', amount: '$64,000', width: '35%', icon: 'brush' },
  { name: 'Google', amount: '$37,000', width: '22%', icon: 'search' },
]

export default function SourceBreakdown() {
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-8">
        <h3 className="section-label">Source Breakdown</h3>
        <span className="material-symbols-outlined text-zinc-300">more_horiz</span>
      </div>
      <div className="space-y-6">
        {sources.map((s) => (
          <div key={s.name} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400">
              <span className="material-symbols-outlined text-lg">{s.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-body-main font-bold">{s.name}</span>
                <span className="text-body-main font-semibold">{s.amount}</span>
              </div>
              <div className="h-1.5 bg-zinc-50 rounded-full">
                <div className="h-full bg-zinc-900 rounded-full" style={{ width: s.width }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
