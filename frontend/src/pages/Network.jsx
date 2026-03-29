import { useState, useEffect } from 'react'
import { getTeam, getLeads } from '../services/api'

const REP_STYLES = [
  { bg: 'bg-rose-50', text: 'text-crimson', border: 'border-crimson/20' },
  { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
]

const STATUS_COLORS = {
  Active: 'bg-emerald-50 text-emerald-600',
  Stalled: 'bg-amber-50 text-amber-600',
  'Closed Won': 'bg-blue-50 text-blue-600',
  'Closed Lost': 'bg-red-50 text-red-600',
  New: 'bg-zinc-100 text-zinc-600',
}

const BADGES = {
  'Armin A.': '\u{1F947}\u{1F525}',
  'Eren Y.': '\u2B50',
  'Mikasa A.': '\u{1F6E1}\uFE0F',
  'Levi R.': '\u26A1',
  'Sasha B.': '\u{1F356}',
}

export default function Network() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contacts, setContacts] = useState([])
  const [contactsLoading, setContactsLoading] = useState(true)

  useEffect(() => {
    async function fetchTeam() {
      setLoading(true)
      const res = await getTeam()
      if (res.success) {
        setTeam(res.data.sort((a, b) => b.total_revenue - a.total_revenue))
      } else {
        setError(res.error)
      }
      setLoading(false)
    }
    async function fetchContacts() {
      setContactsLoading(true)
      const res = await getLeads()
      if (res.success) {
        setContacts(res.data)
      }
      setContactsLoading(false)
    }
    fetchTeam()
    fetchContacts()
  }, [])

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl card-shadow animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-2xl card-shadow animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12">
        <div className="bg-white rounded-2xl card-shadow p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-red-400 mb-4">error</span>
          <p className="text-zinc-600">{error}</p>
        </div>
      </div>
    )
  }

  const totals = {
    revenue: team.reduce((sum, r) => sum + r.total_revenue, 0),
    leads: team.reduce((sum, r) => sum + r.lead_count, 0),
    avgDeal: team.length ? team.reduce((sum, r) => sum + r.avg_deal_value, 0) / team.length : 0,
    avgWinRate: team.length
      ? Math.round(team.reduce((sum, r) => sum + (r.win_rate || 0), 0) / team.length)
      : 0,
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12 space-y-8">
      {/* Team Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl card-shadow border border-zinc-50">
          <h3 className="section-label">Total Revenue</h3>
          <p className="text-xl font-bold text-zinc-900 mt-1">${totals.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl card-shadow border border-zinc-50">
          <h3 className="section-label">Total Leads</h3>
          <p className="text-xl font-bold text-zinc-900 mt-1">{totals.leads}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl card-shadow border border-zinc-50">
          <h3 className="section-label">Avg Deal Value</h3>
          <p className="text-xl font-bold text-zinc-900 mt-1">${Math.round(totals.avgDeal).toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl card-shadow border border-zinc-50">
          <h3 className="section-label">Avg Win Rate</h3>
          <p className="text-xl font-bold text-zinc-900 mt-1">{totals.avgWinRate}%</p>
        </div>
      </div>

      {/* Rep Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((rep, i) => {
          const style = REP_STYLES[i % REP_STYLES.length]
          const isTop = i === 0
          const initials = rep.name.split(' ').map((n) => n[0]).join('')
          return (
            <div
              key={rep.name}
              className={`bg-white p-6 rounded-2xl card-shadow border-2 transition-all ${isTop ? 'border-crimson/30 ring-1 ring-crimson/10' : 'border-zinc-50'}`}
            >
              {isTop && (
                <div className="text-[10px] font-bold text-crimson uppercase tracking-widest mb-4">Top Performer</div>
              )}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center font-bold ${style.text} text-sm`}>
                  {initials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900">{rep.name}</h3>
                  <p className="text-xs text-zinc-400">{rep.lead_count} leads managed</p>
                </div>
                <span className="ml-auto text-2xl">{BADGES[rep.name] || ''}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl text-center">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Revenue</p>
                  <p className="text-sm font-bold text-zinc-900 mt-0.5">${(rep.total_revenue / 1000).toFixed(0)}k</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl text-center">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Avg Deal</p>
                  <p className="text-sm font-bold text-zinc-900 mt-0.5">${(rep.avg_deal_value / 1000).toFixed(1)}k</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl text-center">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Win Rate</p>
                  <p className="text-sm font-bold text-zinc-900 mt-0.5">{rep.win_rate || 0}%</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* All Contacts */}
      <div className="bg-white rounded-2xl card-shadow">
        <div className="p-6 border-b border-zinc-50">
          <h2 className="section-label">All Contacts</h2>
          {!contactsLoading && (
            <p className="text-xs text-zinc-400 mt-1">{contacts.length} records</p>
          )}
        </div>

        {contactsLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-zinc-300 mb-2">contacts</span>
            <p className="text-sm text-zinc-400">No contacts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-50">
                  <th className="px-6 py-4 section-label">Company</th>
                  <th className="px-6 py-4 section-label">Contact</th>
                  <th className="px-6 py-4 section-label">Owner</th>
                  <th className="px-6 py-4 section-label">Status</th>
                  <th className="px-6 py-4 section-label">Deal Value</th>
                  <th className="px-6 py-4 section-label">Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((lead, i) => (
                  <tr
                    key={lead.company + lead.contact + i}
                    className="border-t border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-zinc-900">{lead.company}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{lead.contact}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{lead.owner}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${STATUS_COLORS[lead.status] || 'bg-zinc-100 text-zinc-500'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-zinc-900">
                      ${parseFloat(lead.deal_value || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{lead.last_contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
