import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../services/api'

const SUGGESTIONS = [
  "Which leads haven't been contacted in 30 days?",
  "Who is our top performer this month?",
  "What is the total value of stalled deals?",
  "Summarize pipeline from Dribbble leads",
  "Generate a pipeline health summary",
]

export default function Intelligence() {
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gtm_chat_history') || '[]')
    } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    localStorage.setItem('gtm_chat_history', JSON.stringify(messages))
  }, [messages])

  const handleSend = async (text) => {
    const content = text || input
    if (!content.trim() || isLoading) return

    const userMsg = { role: 'user', content, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    const history = updatedMessages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
    const res = await sendChatMessage(content, history)

    const aiMsg = {
      role: 'assistant',
      content: res.success ? (res.data?.answer || res.data) : `Error: ${res.error}`,
      sources: res.data?.sources || [],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isError: !res.success,
    }
    setMessages((prev) => [...prev, aiMsg])
    setIsLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12 h-[calc(100vh-88px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-headline text-zinc-900">AI Intelligence</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Ask anything about your pipeline</p>
        </div>
        {messages.length > 0 && (
          <button
            className="px-4 py-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            onClick={() => { setMessages([]); localStorage.removeItem('gtm_chat_history') }}
          >
            Clear conversation
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white rounded-2xl card-shadow flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="w-16 h-16 rounded-2xl bg-crimson/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-crimson text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-zinc-700 mb-1">GTM AI Assistant</h3>
                <p className="text-sm text-zinc-400">Ask a question or try one of these</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 max-w-xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="px-4 py-2 text-[13px] font-medium text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-crimson/5 hover:border-crimson/20 hover:text-crimson transition-all"
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) =>
            msg.role === 'user' ? (
              <div key={i} className="flex justify-end gap-3">
                <div className="flex flex-col items-end">
                  <div className="bg-crimson text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-[13px] font-medium max-w-lg shadow-md">
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1">{msg.time}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-crimson">
                  KY
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-zinc-400 text-sm">smart_toy</span>
                </div>
                <div className="flex flex-col">
                  <div className={`px-4 py-2.5 rounded-2xl rounded-tl-sm text-[13px] max-w-lg shadow-sm whitespace-pre-wrap ${msg.isError ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-white border border-zinc-100 text-zinc-700'}`}>
                    {msg.content}
                  </div>
                  {msg.sources?.length > 0 && (
                    <p className="text-[10px] text-zinc-400 mt-1.5 ml-1">
                      Based on: {msg.sources.join(', ')}
                    </p>
                  )}
                  <span className="text-[10px] text-zinc-400 mt-1 ml-1">{msg.time}</span>
                </div>
              </div>
            )
          )}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-zinc-400 text-sm">smart_toy</span>
              </div>
              <div className="bg-white border border-zinc-100 px-4 py-2.5 rounded-2xl rounded-tl-sm text-[13px] text-zinc-400 shadow-sm">
                <span className="inline-flex items-center gap-1">
                  GTM AI is thinking
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-1">
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] py-2.5 outline-none"
              placeholder="Ask about your pipeline..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="text-crimson disabled:opacity-50 transition-opacity"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
          <p className="text-center text-[10px] text-zinc-400 mt-2">Powered by Claude + Pinecone</p>
        </div>
      </div>
    </div>
  )
}
