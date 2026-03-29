import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../services/api'

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const content = input
    const userMsg = { role: 'user', content, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    const history = updatedMessages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
    const res = await sendChatMessage(content, history)

    const aiMsg = {
      role: 'assistant',
      content: res.success ? (res.data?.answer || res.data) : `Sorry, I couldn't reach the AI. Is the backend running?`,
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
    <div className="fixed bottom-0 left-[272px] right-0 z-50" style={{ height: isOpen ? 400 : 56 }}>
      {isOpen && (
        <div
          className="absolute bottom-0 left-0 right-0 h-screen bg-zinc-900/5 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white/95 backdrop-blur-md border-x border-t border-zinc-200 rounded-t-2xl shadow-2xl shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)]">
        <button
          className="flex items-center justify-between px-6 h-[56px] w-full cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-crimson" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-sm font-semibold text-zinc-700">GTM AI Assistant</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Powered by Claude</span>
            <span className={`material-symbols-outlined text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>keyboard_arrow_up</span>
          </div>
        </button>

        {isOpen && (
          <div className="h-[344px] flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-50/30">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
                  Ask anything about your pipeline...
                </div>
              )}
              {messages.map((msg, i) =>
                msg.role === 'user' ? (
                  <div key={i} className="flex justify-end gap-2">
                    <div className="flex flex-col items-end">
                      <div className="bg-crimson text-white px-4 py-2 rounded-2xl rounded-tr-sm text-[13px] font-medium max-w-[85%] shadow-md">
                        {msg.content}
                      </div>
                      <span className="text-[9px] text-zinc-400 mt-0.5">{msg.time}</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-crimson">KY</div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-zinc-400 text-xs">smart_toy</span>
                    </div>
                    <div className="flex flex-col">
                      <div className={`px-4 py-2 rounded-2xl rounded-tl-sm text-[13px] max-w-[85%] shadow-sm whitespace-pre-wrap ${msg.isError ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-white border border-zinc-100 text-zinc-700'}`}>
                        {msg.content}
                      </div>
                      {msg.sources?.length > 0 && (
                        <p className="text-[9px] text-zinc-400 mt-1 ml-1">Based on: {msg.sources.join(', ')}</p>
                      )}
                      <span className="text-[9px] text-zinc-400 mt-0.5 ml-1">{msg.time}</span>
                    </div>
                  </div>
                )
              )}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-zinc-400 text-xs">smart_toy</span>
                  </div>
                  <div className="bg-white border border-zinc-100 px-4 py-2 rounded-2xl rounded-tl-sm text-[13px] text-zinc-400 shadow-sm">
                    <span className="inline-flex items-center gap-0.5">
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
            <div className="p-4 bg-white border-t border-zinc-100">
              <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-1">
                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] py-2 outline-none"
                  placeholder="Ask about your pipeline..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <button className="text-crimson disabled:opacity-50" onClick={handleSend} disabled={isLoading || !input.trim()}>
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
