import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Mic, Trash2, Bot, User, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const AssistantView: React.FC = () => {
  const { aiMessages, sendAIMessage, clearAIMessages, isAITyping } = useApp()
  const { cardClass, accent } = useTheme()
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages, isAITyping])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isAITyping) return
    sendAIMessage(input.trim())
    setInput('')
  }

  const handleVoiceSim = () => {
    sound.playBip()
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)
      sendAIMessage('Summarize my top priority tasks for today')
    }, 2500)
  }

  const quickPrompts = [
    '? Summarize my daily agenda',
    '?? Plan my top 3 priorities',
    '?? 3 Creative project concepts',
    '?? 1-Minute breathing exercise',
  ]

  return (
    <div className="flex flex-col h-full min-h-[580px] justify-between pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10"
            style={{ color: accent.value }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white m-0">Gemini Copilot</h2>
            <p className="text-[10px] text-slate-400">Personal Intelligence Assistant</p>
          </div>
        </div>

        <button
          onClick={clearAIMessages}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
          title="Clear History"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-3 max-h-[440px]">
        {aiMessages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2.5 max-w-[88%] ${
              msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                msg.role === 'user' ? 'bg-white/20 text-white' : 'bg-cyan-500/20 text-cyan-300'
              }`}
            >
              {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
            </div>

            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-500 text-black font-semibold shadow-md rounded-tr-sm'
                  : `${cardClass} rounded-tl-sm text-slate-100`
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>
              <div
                className={`text-[9px] mt-1 font-mono text-right ${
                  msg.role === 'user' ? 'text-black/60' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </motion.div>
        ))}

        {isAITyping && (
          <div className="flex items-center gap-2 self-start p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="ml-1 text-[11px]">Thinking & generating insight...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Listening Mode Overlay */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-xs flex items-center justify-between mb-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <div className="flex items-center gap-2">
            <Mic size={16} className="animate-pulse text-cyan-300" />
            <span>Listening to speech...</span>
          </div>
          <span className="text-[10px] font-mono animate-ping">? LIVE</span>
        </motion.div>
      )}

      {/* Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 shrink-0">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => sendAIMessage(qp.replace(/^[^\s]+\s/, ''))}
            disabled={isAITyping}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-medium text-slate-300 whitespace-nowrap transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="relative flex items-center mt-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask AI Copilot..."
          className="w-full pl-3 pr-20 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          <button
            type="button"
            onClick={handleVoiceSim}
            className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Voice Input"
          >
            <Mic size={13} />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isAITyping}
            className="p-1.5 rounded-xl text-black font-bold transition-all disabled:opacity-30"
            style={{ backgroundColor: accent.value }}
          >
            <Send size={13} />
          </button>
        </div>
      </form>
    </div>
  )
}
