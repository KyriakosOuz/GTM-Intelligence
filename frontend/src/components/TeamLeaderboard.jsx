const reps = [
  { initials: 'AA', name: 'Armin A.', revenue: '$209,633', leads: 41, kpi: '0.92', kpiColor: 'bg-emerald-50 text-emerald-600', wl: '88%', badge: '\u{1F947}\u{1F525}', bg: 'bg-rose-50', text: 'text-crimson' },
  { initials: 'EY', name: 'Eren Y.', revenue: '$142,000', leads: 29, kpi: '0.72', kpiColor: 'bg-emerald-50 text-emerald-600', wl: '74%', badge: '\u2B50', bg: 'bg-blue-50', text: 'text-blue-600' },
  { initials: 'MA', name: 'Mikasa A.', revenue: '$98,400', leads: 24, kpi: '0.76', kpiColor: 'bg-zinc-50 text-zinc-500', wl: '62%', badge: '\u{1F6E1}\uFE0F', bg: 'bg-purple-50', text: 'text-purple-600' },
  { initials: 'LR', name: 'Levi R.', revenue: '$79,150', leads: 18, kpi: '0.71', kpiColor: 'bg-zinc-50 text-zinc-500', wl: '58%', badge: '\u26A1', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { initials: 'SB', name: 'Sasha B.', revenue: '$52,300', leads: 15, kpi: '0.65', kpiColor: 'bg-zinc-50 text-zinc-500', wl: '51%', badge: '\u{1F356}', bg: 'bg-amber-50', text: 'text-amber-600' },
]

export default function TeamLeaderboard() {
  return (
    <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl card-shadow">
      <h3 className="section-label mb-6">Team Leaderboard</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-zinc-50 section-label">
            <tr>
              <th className="pb-4 font-bold">Sales Rep</th>
              <th className="pb-4 font-bold">Revenue</th>
              <th className="pb-4 font-bold">Leads</th>
              <th className="pb-4 font-bold">KPI</th>
              <th className="pb-4 font-bold">W/L</th>
              <th className="pb-4 font-bold">Badges</th>
            </tr>
          </thead>
          <tbody className="text-sm text-body-main">
            {reps.map((rep, i) => (
              <tr key={rep.initials} className={`group hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-50' : ''}`}>
                <td className="py-4 font-bold">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${rep.bg} flex items-center justify-center font-bold ${rep.text} text-xs`}>
                      {rep.initials}
                    </div>
                    {rep.name}
                  </div>
                </td>
                <td className="py-4 font-semibold">{rep.revenue}</td>
                <td className="py-4">{rep.leads}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 ${rep.kpiColor} text-[10px] font-bold rounded-full`}>{rep.kpi}</span>
                </td>
                <td className="py-4 font-medium">{rep.wl}</td>
                <td className="py-4">{rep.badge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
