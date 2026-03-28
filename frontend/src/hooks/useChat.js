import { useState, useCallback } from 'react'
import { sendChatMessage } from '../services/api'

export default function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const send = useCallback(async (content) => {
    if (!content.trim()) return

    const userMessage = { role: 'user', content }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await sendChatMessage(content)
      if (response.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.data },
        ])
      } else {
        setError(response.error)
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${response.error}` },
        ])
      }
    } catch (err) {
      setError(err.message)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err.message}` },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, send, clear }
}
