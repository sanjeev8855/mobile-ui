import React, { useState } from 'react'
import { Sparkles, Send, Bot, ArrowUpRight, Mic } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const AICapsuleWidget: React.FC = () => {
  const { aiMessages, sendAIMessage, isAITyping, setActiveTab } = useApp()
  const { cardClass, accent } = useTheme()
  const [input, setInput] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isAITyping) return
    sendAIMessage(input.trim())
    setInput('')
  }

  const quickPrompts = [
    { label: '? Daily summary', query: 'Summarize my day' },
    { label: '?? Top priorities', query: 'What are my top priorities?' },
    { label: '?? Creative ideas', query: 'Brainstorm 3 project ideas' },
    { label: '?? 1-min breathing', query: 'Guide me in a 1-minute breathing session' },
  ]

  const lastAssistantMessage = [...aiMessages].reverse().find(m => m.role === 'assistant')

  return (
    <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3 relative transition-all overflow-hidden`}>
      {/* Glow highlight */}
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accent.value }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
            style={{ color: accent.value }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Gemini AI Copilot</h3>
            <p className="text-[11px] text-slate-400">On-device context assistant</p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap()
            setActiveTab('assistant')
          }}
          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-xl bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <span>Chat</span>
          <ArrowUpRight size={12} />
        </button>
      </div>

      {/* Latest Assistant Message or Briefing */}
      {lastAssistantMessage && (
        <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-start gap-2.5">
          <Bot size={16} className="mt-0.5 shrink-0" style={{ color: accent.value }} />
          <div className="text-xs text-slate-200 leading-relaxed font-sans min-w-0">
            {isAITyping ? (
              <div className="flex items-center gap-1 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-slate-400 ml-1">Analyzing schedule...</span>
              </div>
            ) : (
              <p className="m-0 line-clamp-3 whitespace-pre-line text-[11px]">
                {lastAssistantMessage.content}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => sendAIMessage(p.query)}
            disabled={isAITyping}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-medium text-slate-300 whitespace-nowrap transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything or run smart action..."
          className="w-full pl-3 pr-10 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isAITyping}
          className="absolute right-1.5 p-1.5 rounded-xl text-black font-bold transition-all disabled:opacity-30"
          style={{ backgroundColor: accent.value }}
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  )
}
