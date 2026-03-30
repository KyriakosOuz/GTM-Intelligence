import { useState } from 'react'
import { getReport } from '../services/api'

function saveReportToStorage(report, generatedAt) {
  const saved = JSON.parse(localStorage.getItem('gtm_reports') || '[]')
  saved.unshift({
    id: Date.now(),
    content: report,
    generatedAt,
  })
  // Keep max 20 reports
  if (saved.length > 20) saved.length = 20
  localStorage.setItem('gtm_reports', JSON.stringify(saved))
}

const renderMarkdown = (text) => {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-zinc-900 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold font-headline text-zinc-900 mt-8 mb-3 pb-2 border-b border-zinc-100">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold font-headline text-zinc-900 mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4 text-sm text-zinc-600 mb-1 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-sm text-zinc-600 mb-1 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-sm text-zinc-600 mb-3">')
    .replace(/^(?!<[hl])/gm, '')
}

export default function Reports() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatedAt, setGeneratedAt] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    const res = await getReport()
    if (res.success) {
      const timestamp = new Date().toLocaleString()
      setReport(res.data)
      setGeneratedAt(timestamp)
      saveReportToStorage(res.data, timestamp)
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  const handleCopy = async () => {
    if (report) {
      await navigator.clipboard.writeText(report)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (!report) return
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gtm-pipeline-report-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12">
      {!report && !loading && (
        <div className="bg-white rounded-2xl card-shadow p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-crimson/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-crimson text-4xl">description</span>
          </div>
          <h2 className="text-xl font-bold font-headline text-zinc-900 mb-2">Pipeline Report</h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto">
            Generate an AI-powered pipeline health report with executive summary, top deals, risk areas, and recommendations.
          </p>
          <button
            className="px-8 py-3 bg-crimson text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            onClick={handleGenerate}
          >
            Generate Pipeline Report
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl card-shadow p-16 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-crimson/20 border-t-crimson animate-spin mx-auto mb-6"></div>
          <h3 className="text-lg font-bold text-zinc-700 mb-2">Generating Report...</h3>
          <p className="text-sm text-zinc-400">Claude is analyzing your pipeline data</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-2xl card-shadow p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-red-400 mb-4">error</span>
          <p className="text-zinc-600 mb-4">{error}</p>
          <button
            className="px-6 py-2 bg-crimson text-white rounded-xl font-bold text-sm"
            onClick={handleGenerate}
          >
            Try Again
          </button>
        </div>
      )}

      {report && !loading && (
        <div className="space-y-4">
          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-headline text-zinc-900">Pipeline Report</h2>
              {generatedAt && <p className="text-xs text-zinc-400 mt-0.5">Generated {generatedAt}</p>}
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2"
                onClick={handleCopy}
              >
                <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied!' : 'Copy Report'}
              </button>
              <button
                className="px-4 py-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2"
                onClick={handleDownload}
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download .txt
              </button>
              <button
                className="px-5 py-1.5 text-sm font-bold bg-crimson text-white rounded-lg hover:bg-crimson/90 transition-colors"
                onClick={handleGenerate}
              >
                Regenerate
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div
            className="bg-white rounded-2xl card-shadow p-8 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(report) }}
          />
        </div>
      )}
    </div>
  )
}

export { renderMarkdown }
