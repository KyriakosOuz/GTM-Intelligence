const members = [
  { initials: 'AA', name: 'Armin A.', revenue: '$209k Revenue', width: '85%', bg: 'bg-rose-50', text: 'text-crimson' },
  { initials: 'EY', name: 'Eren Y.', revenue: '$142k Revenue', width: '65%', bg: 'bg-blue-50', text: 'text-blue-600' },
  { initials: 'MA', name: 'Mikasa A.', revenue: '$98k Revenue', width: '45%', bg: 'bg-purple-50', text: 'text-purple-600' },
  { initials: 'LR', name: 'Levi R.', revenue: '$79k Revenue', width: '38%', bg: 'bg-emerald-50', text: 'text-emerald-600' },
]

export default function PipelineVelocity() {
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <h3 className="section-label mb-6">Pipeline Velocity By Member</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((m) => (
          <div key={m.initials} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${m.bg} flex items-center justify-center font-bold ${m.text} text-[10px]`}>
                {m.initials}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-zinc-900">{m.name}</p>
                <p className="text-[10px] text-supporting">{m.revenue}</p>
              </div>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-crimson rounded-full" style={{ width: m.width }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
