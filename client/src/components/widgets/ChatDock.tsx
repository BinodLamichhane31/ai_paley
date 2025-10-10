import { useState } from 'react'
import { api } from '@/lib/api'
import { Bot } from 'lucide-react'

type Msg = { role: 'user' | 'assistant'; content: string; mode?: 'gemini' | 'rag' | 'demo' | 'error' }

export default function ChatDock() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: "Hi! I'm the AI-Solutions assistant. I can help you navigate our website, learn about our AI services, schedule demos, and answer questions. What would you like to know?",
      mode: 'rag'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send() {
    const text = input.trim()
    if (!text) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await api.post('/chat', { messages: next })
      setMessages([...next, { 
        role: 'assistant' as const, 
        content: res.data.content,
        mode: res.data.mode || 'rag'
      }])
    } catch (error: any) {
      console.error('Chat error:', error)
      // Add error message to chat
      const errorMessage = error?.response?.data?.content || 'Sorry, there was an error. Please try again.'
      setMessages([...next, { 
        role: 'assistant' as const, 
        content: errorMessage,
        mode: 'error'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating chat button */}
      <button
        aria-label="Open chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary-600 text-white shadow-elevation-lg focus-ring flex items-center justify-center hover:-translate-y-0.5 transition-transform"
      >
        <Bot className="size-6" />
        <span className="sr-only">Chat</span>
      </button>
      {open && (
        <div role="dialog" aria-label="AI-Solutions Assistant" className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-slate-900 shadow-lg border-l border-slate-200 dark:border-slate-800 flex flex-col z-50">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div className="font-semibold">AI-Solutions Assistant (beta)</div>
            <button className="px-2 py-1 border rounded-md focus-ring" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block max-w-[80%] px-3 py-2 rounded-xl ${m.role === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.mode && m.role === 'assistant' && (
                    <div className={`text-xs mt-1 ${m.mode === 'gemini' ? 'text-green-600' : m.mode === 'rag' ? 'text-blue-600' : m.mode === 'error' ? 'text-red-600' : 'text-slate-500'}`}>
                      {m.mode === 'gemini' ? '🤖 AI Powered' : m.mode === 'rag' ? '📚 Context-Aware' : m.mode === 'error' ? '⚠️ Error' : '💬 Demo'}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-slate-500 text-sm">Assistant is typing…</div>}
            <div className="text-xs text-slate-500">
              💬 AI-powered assistant with navigation help
            </div>
          </div>
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded-md p-2 h-20 focus-ring" placeholder="Type a message..." onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send() } }} />
            <button className="px-4 py-2 rounded-md bg-primary-600 text-white focus-ring" onClick={() => void send()} disabled={loading}>Send</button>
          </div>
        </div>
      )}
    </>
  )
}


