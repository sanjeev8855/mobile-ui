import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Headphones, Bell, Sparkles, X, Play, Pause, Square } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const DynamicIsland: React.FC = () => {
  const {
    isFocusRunning,
    focusTimeLeft,
    toggleFocusTimer,
    resetFocusTimer,
    currentAmbient,
    setAmbientSound,
    islandNotification,
  } = useApp()
  const { accent } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const hasActiveContent = isFocusRunning || currentAmbient || islandNotification

  return (
    <div className="relative w-full flex justify-center items-center pt-1 pb-1 z-40">
      <motion.div
        layout
        onClick={() => {
          sound.playTap()
          setIsExpanded(!isExpanded)
        }}
        className={`bg-black text-white cursor-pointer select-none overflow-hidden rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.7)] border border-white/10 flex items-center transition-all ${
          isExpanded
            ? 'w-[92%] rounded-3xl p-4 flex-col gap-3 min-h-[110px]'
            : hasActiveContent
            ? 'h-8 px-3.5 gap-2.5 min-w-[170px]'
            : 'h-7 w-28 px-3 gap-2'
        }`}
        animate={{
          scale: [1, isExpanded ? 1 : 1.02, 1],
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      >
        {/* Compact View */}
        {!isExpanded && (
          <div className="w-full flex items-center justify-between">
            {/* Left side indicator */}
            <div className="flex items-center gap-1.5">
              {islandNotification ? (
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              ) : isFocusRunning ? (
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : currentAmbient ? (
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 h-2 bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-1.5 bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-[#18181c] border border-white/20" />
              )}

              <span className="text-[11px] font-medium tracking-tight truncate max-w-[90px]">
                {islandNotification
                  ? islandNotification.title
                  : isFocusRunning
                  ? formatTime(focusTimeLeft)
                  : currentAmbient
                  ? currentAmbient.toUpperCase()
                  : 'Sanje Hub'}
              </span>
            </div>

            {/* Right side icon */}
            <div className="flex items-center gap-1 text-[10px] opacity-80">
              {islandNotification ? (
                <Bell size={12} className="text-amber-400" />
              ) : isFocusRunning ? (
                <Timer size={12} className="text-emerald-400" />
              ) : currentAmbient ? (
                <Headphones size={12} className="text-cyan-400" />
              ) : (
                <Sparkles size={11} style={{ color: accent.value }} />
              )}
            </div>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col gap-3 text-left"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: accent.bg, color: accent.value }}
                >
                  <Sparkles size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Dynamic Control Center</h4>
                  <p className="text-[10px] text-neutral-400">Live background services</p>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>

            {/* Notification Banner if any */}
            {islandNotification && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Bell size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{islandNotification.title}</p>
                  {islandNotification.subtitle && (
                    <p className="text-[11px] text-neutral-400 truncate">{islandNotification.subtitle}</p>
                  )}
                </div>
              </div>
            )}

            {/* Focus Timer Live Controls */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-white font-mono">{formatTime(focusTimeLeft)}</div>
                  <div className="text-[10px] text-neutral-400">
                    {isFocusRunning ? 'Session active' : 'Session paused'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleFocusTimer}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1 hover:bg-emerald-500/30"
                >
                  {isFocusRunning ? <Pause size={12} /> : <Play size={12} />}
                  {isFocusRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={resetFocusTimer}
                  className="p-1 rounded-lg bg-white/10 text-neutral-300 hover:text-white"
                >
                  <Square size={12} />
                </button>
              </div>
            </div>

            {/* Ambient Soundscape Quick Switch */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones size={16} className="text-cyan-400" />
                <div>
                  <div className="text-xs font-semibold text-white capitalize">
                    {currentAmbient ? `Sound: ${currentAmbient}` : 'Ambient Off'}
                  </div>
                  <div className="text-[10px] text-neutral-400">Synthesized audio nodes</div>
                </div>
              </div>

              <button
                onClick={() => setAmbientSound(currentAmbient ? null : 'rain')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-medium hover:bg-cyan-500/30"
              >
                {currentAmbient ? 'Stop' : 'Play Rain'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
