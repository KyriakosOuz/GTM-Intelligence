import { useState, useEffect, useMemo } from 'react'
import { getLeads } from '../services/api'

const STATUS_COLORS = {
  Active: 'bg-emerald-50 text-emerald-600',
  Stalled: 'bg-amber-50 text-amber-600',
  'Closed Won': 'bg-blue-50 text-blue-600',
  'Closed Lost': 'bg-red-50 text-red-600',
  New: 'bg-zinc-100 text-zinc-600',
}

export default function Deals() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('deal_value')
  const [sortDir, setSortDir] = useState('desc')
  const [expandedRow, setExpandedRow] = useState(null)

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true)
      const res = await getLeads()
      if (res.success) {
        setLeads(res.data)
      } else {
        setError(res.error)
      }
      setLoading(false)
    }
    fetchLeads()
  }, [])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    let result = leads
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          l.company?.toLowerCase().includes(q) ||
          l.contact?.toLowerCase().includes(q)
      )
    }
    result = [...result].sort((a, b) => {
      let aVal = a[sortKey] ?? ''
      let bVal = b[sortKey] ?? ''
      if (sortKey === 'deal_value') {
        aVal = parseFloat(aVal) || 0
        bVal = parseFloat(bVal) || 0
      }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return result
  }, [leads, search, sortKey, sortDir])

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="text-zinc-300 ml-1">&#8597;</span>
    return <span className="text-crimson ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const columns = [
    { key: 'company', label: 'Company' },
    { key: 'contact', label: 'Contact' },
    { key: 'status', label: 'Status' },
    { key: 'deal_value', label: 'Deal Value' },
    { key: 'last_contact', label: 'Last Contact' },
    { key: 'owner', label: 'Owner' },
    { key: 'source', label: 'Source' },
    { key: 'industry', label: 'Industry' },
  ]

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12">
        <div className="bg-white rounded-2xl card-shadow p-6 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
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

  if (leads.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12">
        <div className="bg-white rounded-2xl card-shadow p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-zinc-300 mb-4">upload_file</span>
          <h2 className="text-lg font-bold text-zinc-700 mb-2">No CRM data yet</h2>
          <p className="text-sm text-zinc-400 mb-6">Upload a CSV to get started</p>
          <a href="/settings" className="px-6 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-500/20 hover:scale-[1.02] transition-all">
            Go to Settings
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12">
      <div className="bg-white rounded-2xl card-shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-50">
          <div>
            <h2 className="text-lg font-bold font-headline text-zinc-900">All Deals</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{filtered.length} of {leads.length} records</p>
          </div>
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
            <input
              className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-rose-500/10 focus:border-crimson outline-none transition-all"
              placeholder="Search company or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 section-label cursor-pointer select-none hover:text-zinc-600 transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <>
                  <tr
                    key={lead.company + i}
                    className="border-t border-zinc-50 hover:bg-zinc-50/50 cursor-pointer transition-colors"
                    onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-zinc-900">{lead.company}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{lead.contact}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${STATUS_COLORS[lead.status] || 'bg-zinc-100 text-zinc-500'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-zinc-900">
                      ${parseFloat(lead.deal_value || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{lead.last_contact}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{lead.owner}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{lead.source}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{lead.industry}</td>
                  </tr>
                  {expandedRow === i && (
                    <tr key={`${lead.company}-notes`} className="bg-zinc-50/50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-zinc-400 text-sm mt-0.5">notes</span>
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Notes</p>
                            <p className="text-sm text-zinc-600">{lead.notes || 'No notes available'}</p>
                            {lead.email && (
                              <p className="text-xs text-zinc-400 mt-2">{lead.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
