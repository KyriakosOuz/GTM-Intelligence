import { useState } from 'react'
import { renderMarkdown } from './Reports'

export default function MyReports() {
  const [reports, setReports] = useState(() =>
    JSON.parse(localStorage.getItem('gtm_reports') || '[]')
  )
  const [viewing, setViewing] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleDelete = (id) => {
    const updated = reports.filter((r) => r.id !== id)
    setReports(updated)
    localStorage.setItem('gtm_reports', JSON.stringify(updated))
    if (viewing?.id === id) setViewing(null)
  }

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (report) => {
    const blob = new Blob([report.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gtm-report-${new Date(report.id).toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (viewing) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewing(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <div>
                <h2 className="text-lg font-bold font-headline text-zinc-900">Pipeline Report</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Generated {viewing.generatedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => handleCopy(viewing.content)}
              >
                <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                className="px-4 py-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => handleDownload(viewing)}
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download
              </button>
              <button
                className="px-4 py-1.5 text-sm font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => handleDelete(viewing.id)}
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete
              </button>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl card-shadow p-8 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(viewing.content) }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-headline text-zinc-900">My Reports</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{reports.length} saved report{reports.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl card-shadow p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-zinc-300 text-4xl">description</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-700 mb-2">No reports yet</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Generated reports will appear here. Go to Reports to create your first one.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => {
            // Extract first heading or first line as preview
            const firstLine = report.content?.split('\n').find((l) => l.trim()) || 'Pipeline Report'
            const preview = firstLine.replace(/^#+\s*/, '').slice(0, 100)
            const wordCount = report.content?.split(/\s+/).length || 0

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl card-shadow p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setViewing(report)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-crimson/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-crimson text-lg">description</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-zinc-900 truncate group-hover:text-crimson transition-colors">
                      {preview}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-zinc-400">{report.generatedAt}</span>
                      <span className="text-[11px] text-zinc-300">|</span>
                      <span className="text-[11px] text-zinc-400">{wordCount} words</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleDownload(report) }}
                    title="Download"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleDelete(report.id) }}
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
