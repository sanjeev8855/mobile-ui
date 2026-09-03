import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Sparkles, Timer, Music, Flame, FileText, Wallet, Moon, ExternalLink, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    apps,
    notes,
    habits,
    expenses,
    toggleFocusTimer,
    setAmbientSound,
    setActiveTab,
    sendAIMessage,
  } = useApp()
  const { theme, setTheme, accent } = useTheme()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) {
      return [
        { type: 'action', title: 'Start 25m Focus Session', icon: Timer, action: () => { toggleFocusTimer(); setActiveTab('widgets') } },
        { type: 'action', title: 'Play Rain Soundscape', icon: Music, action: () => setAmbientSound('rain') },
        { type: 'action', title: 'Ask AI Copilot for Daily Briefing', icon: Sparkles, action: () => { sendAIMessage('Summarize my day'); setActiveTab('assistant') } },
        { type: 'action', title: 'Switch to OLED Theme', icon: Moon, action: () => setTheme('oled') },
      ]
    }

    const q = query.toLowerCase()
    const list: { type: string; title: string; subtitle?: string; icon: any; action: () => void }[] = []

    // Apps match
    apps.forEach(app => {
      if (app.name.toLowerCase().includes(q) || app.category.toLowerCase().includes(q)) {
        list.push({
          type: 'app',
          title: `Launch ${app.name}`,
          subtitle: `Category: ${app.category}`,
          icon: ExternalLink,
          action: () => window.open(app.url, '_blank'),
        })
      }
    })

    // Notes match
    notes.forEach(note => {
      if (note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)) {
        list.push({
          type: 'note',
          title: note.title,
          subtitle: note.content.slice(0, 45) + '...',
          icon: FileText,
          action: () => setActiveTab('widgets'),
        })
      }
    })

    // Habits match
    habits.forEach(h => {
      if (h.title.toLowerCase().includes(q)) {
        list.push({
          type: 'habit',
          title: `Habit: ${h.title}`,
          subtitle: `Streak: ${h.streak} days`,
          icon: Flame,
          action: () => setActiveTab('home'),
        })
      }
    })

    // Custom AI action if query is conversational
    list.push({
      type: 'ai',
      title: `Ask AI: "${query}"`,
      subtitle: 'Ask on-device AI Copilot',
      icon: Sparkles,
      action: () => {
        sendAIMessage(query)
        setActiveTab('assistant')
      },
    })

    return list
  }, [query, apps, notes, habits, expenses, toggleFocusTimer, setAmbientSound, setActiveTab, sendAIMessage, setTheme])

  if (!isCommandPaletteOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-md bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl overflow-hidden z-10 text-slate-100 flex flex-col"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3 border-b border-white/10 gap-3">
            <Search size={18} style={{ color: accent.value }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search apps, notes, habits, commands..."
              autoFocus
              className="w-full bg-transparent text-sm placeholder-slate-400 focus:outline-none text-white font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="text-xs px-2 py-1 rounded bg-white/10 text-slate-300 hover:bg-white/20"
            >
              ESC
            </button>
          </div>

          {/* Quick Filtered Results */}
          <div className="max-h-[340px] overflow-y-auto p-2 flex flex-col gap-1">
            {results.map((item, idx) => {
              const Icon = item.icon
              return (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playTap()
                    item.action()
                    setCommandPaletteOpen(false)
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/10 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10 group-hover:scale-105 transition-transform"
                      style={{ color: accent.value }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Navigation: Click or Enter</span>
            <span className="font-mono text-[10px]">Universal Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
