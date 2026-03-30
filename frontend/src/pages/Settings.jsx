import { useState, useEffect, useRef } from 'react'
import { uploadCSV, syncGoogleSheet, getSyncStatus, healthCheck, clearLeads, triggerAutomation, getAutomationStatus } from '../services/api'

export default function Settings() {
  const [uploadState, setUploadState] = useState('idle') // idle, dragging, uploading, success, error
  const [uploadResult, setUploadResult] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [syncStatus, setSyncStatus] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [backendStatus, setBackendStatus] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [automationStatus, setAutomationStatus] = useState(null)
  const [triggering, setTriggering] = useState(false)
  const [triggerResult, setTriggerResult] = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    checkHealth()
    fetchSyncStatus()
    fetchAutomationStatus()
  }, [])

  const checkHealth = async () => {
    const res = await healthCheck()
    setBackendStatus(res.status === 'ok' ? 'connected' : 'error')
  }

  const fetchSyncStatus = async () => {
    const res = await getSyncStatus()
    if (res.success) setSyncStatus(res.data)
  }

  const handleFile = async (file) => {
    if (!file) return
    if (!file.name.endsWith('.csv')) {
      setUploadState('error')
      setUploadError('Only .csv files are accepted')
      return
    }
    setFileName(file.name)
    setUploadState('uploading')
    setUploadError(null)

    const res = await uploadCSV(file)
    if (res.success) {
      setUploadState('success')
      setUploadResult(res.data)
    } else {
      setUploadState('error')
      setUploadError(res.error)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setUploadState('idle')
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleSync = async () => {
    setSyncing(true)
    await syncGoogleSheet()
    await fetchSyncStatus()
    setSyncing(false)
  }

  const handleClear = async () => {
    setClearing(true)
    await clearLeads()
    setClearing(false)
    setShowClearConfirm(false)
  }

  const fetchAutomationStatus = async () => {
    const res = await getAutomationStatus()
    if (res.success) setAutomationStatus(res.data)
  }

  const handleTrigger = async () => {
    setTriggering(true)
    setTriggerResult(null)
    const res = await triggerAutomation()
    setTriggering(false)
    if (res.success) {
      setTriggerResult('success')
      setTimeout(() => setTriggerResult(null), 10000)
    } else {
      setTriggerResult('error')
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12 space-y-8">
      {/* Upload CSV */}
      <div className="bg-white rounded-2xl card-shadow p-6">
        <h3 className="section-label mb-6">Upload CRM Data</h3>
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
            uploadState === 'dragging'
              ? 'border-crimson bg-crimson/5'
              : uploadState === 'success'
              ? 'border-emerald-300 bg-emerald-50'
              : uploadState === 'error'
              ? 'border-red-300 bg-red-50'
              : 'border-zinc-200 hover:border-crimson/40 hover:bg-zinc-50'
          }`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setUploadState('dragging') }}
          onDragLeave={() => setUploadState('idle')}
          onDrop={handleDrop}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {uploadState === 'uploading' && (
            <>
              <div className="w-10 h-10 rounded-full border-4 border-crimson/20 border-t-crimson animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-semibold text-zinc-700">Uploading {fileName}...</p>
            </>
          )}

          {uploadState === 'success' && (
            <>
              <span className="material-symbols-outlined text-4xl text-emerald-500 mb-3">check_circle</span>
              <p className="text-sm font-semibold text-emerald-700">
                Successfully embedded {uploadResult?.embedded || uploadResult?.records_embedded} records
              </p>
              {uploadResult?.skipped > 0 && (
                <p className="text-xs text-amber-600 mt-1">{uploadResult.skipped} records skipped</p>
              )}
              <button
                className="mt-4 text-xs text-zinc-500 underline"
                onClick={(e) => { e.stopPropagation(); setUploadState('idle'); setFileName(null) }}
              >
                Upload another file
              </button>
            </>
          )}

          {uploadState === 'error' && (
            <>
              <span className="material-symbols-outlined text-4xl text-red-400 mb-3">error</span>
              <p className="text-sm font-semibold text-red-600">Upload failed: {uploadError}</p>
              <button
                className="mt-4 text-xs text-zinc-500 underline"
                onClick={(e) => { e.stopPropagation(); setUploadState('idle') }}
              >
                Try again
              </button>
            </>
          )}

          {(uploadState === 'idle' || uploadState === 'dragging') && (
            <>
              <span className="material-symbols-outlined text-4xl text-zinc-300 mb-3">cloud_upload</span>
              <p className="text-sm font-semibold text-zinc-600">
                {fileName ? fileName : 'Drag and drop a CSV file, or click to browse'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">Accepts .csv files only</p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sync Status */}
        <div className="bg-white rounded-2xl card-shadow p-6">
          <h3 className="section-label mb-6">Google Sheets Sync</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full ${syncStatus?.last_sync ? 'bg-emerald-400' : 'bg-zinc-300'}`}></div>
            <span className="text-sm text-zinc-600">
              {syncStatus?.last_sync ? `Last synced: ${syncStatus.last_sync}` : 'Not synced yet'}
            </span>
          </div>
          <button
            className="px-5 py-2 text-sm font-bold bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        {/* Pinecone Status */}
        <div className="bg-white rounded-2xl card-shadow p-6">
          <h3 className="section-label mb-6">Pinecone Index</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Index Name</span>
              <span className="font-mono text-zinc-900 text-xs bg-zinc-50 px-2 py-0.5 rounded">gtm-intelligence</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Dimensions</span>
              <span className="text-zinc-900">1024</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Metric</span>
              <span className="text-zinc-900">Cosine</span>
            </div>
          </div>
          {!showClearConfirm ? (
            <button
              className="px-5 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All Data
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-red-500 font-medium">Are you sure?</span>
              <button
                className="px-4 py-1.5 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
                onClick={handleClear}
                disabled={clearing}
              >
                {clearing ? 'Clearing...' : 'Yes, delete all'}
              </button>
              <button
                className="px-4 py-1.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 rounded-lg"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Daily Automation */}
      <div className="bg-white rounded-2xl card-shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-label">Daily Automation</h3>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-600">Scheduler Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-zinc-50 rounded-xl">
            <p className="text-xs text-zinc-400 mb-1">Schedule</p>
            <p className="text-sm font-semibold text-zinc-900">
              {automationStatus?.schedule || 'Daily at 09:00'}
            </p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-xl">
            <p className="text-xs text-zinc-400 mb-1">Next Run</p>
            <p className="text-sm font-semibold text-zinc-900">
              {automationStatus?.next_run
                ? new Date(automationStatus.next_run).toLocaleString()
                : 'Loading...'}
            </p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-xl">
            <p className="text-xs text-zinc-400 mb-1">Email To</p>
            <p className="text-sm font-semibold text-zinc-900">kyriakos.ouzounis@gmail.com</p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-xl">
            <p className="text-xs text-zinc-400 mb-1">Slack Alert</p>
            <p className="text-sm font-semibold text-zinc-900">Stalled deals channel</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="px-6 py-2.5 text-sm font-bold bg-crimson text-white rounded-xl hover:bg-crimson/90 transition-colors disabled:opacity-50"
            onClick={handleTrigger}
            disabled={triggering}
          >
            {triggering ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                Running...
              </span>
            ) : 'Run Now'}
          </button>

          {triggerResult === 'success' && (
            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Triggered! Check email and Slack in ~30s
            </span>
          )}
          {triggerResult === 'error' && (
            <span className="text-sm text-red-500 font-medium">Failed to trigger automation</span>
          )}
        </div>
      </div>

      {/* API Keys Status */}
      <div className="bg-white rounded-2xl card-shadow p-6">
        <h3 className="section-label mb-6">API Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <span className="text-sm text-zinc-600">Anthropic API</span>
            <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Configured</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <span className="text-sm text-zinc-600">Pinecone API</span>
            <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Configured</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <span className="text-sm text-zinc-600">Cohere API</span>
            <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Configured</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 p-3 bg-zinc-50 rounded-xl">
          <div className={`w-2.5 h-2.5 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-zinc-600">Backend Server</span>
          <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${backendStatus === 'connected' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
            {backendStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  )
}
