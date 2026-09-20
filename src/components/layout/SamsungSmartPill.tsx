import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Headphones, Bell, Sparkles, X, Play, Pause, Square, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const SamsungSmartPill: React.FC = () => {
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

  if (!hasActiveContent && !isExpanded) {
    return null
  }

  return (
    <div className="relative w-full flex justify-center items-center px-4 pt-1 z-40">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        onClick={() => {
          sound.playTap()
          setIsExpanded(!isExpanded)
        }}
        className={`bg-[#121c32]/95 border border-[#25375c] text-white cursor-pointer select-none overflow-hidden rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all ${
          isExpanded ? 'w-full p-4 flex flex-col gap-3' : 'py-1.5 px-3.5 flex items-center gap-2.5 max-w-[280px]'
        }`}
      >
        {/* Compact Samsung One UI Chip */}
        {!isExpanded && (
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {islandNotification ? (
                <Bell size={13} className="text-amber-400 shrink-0" />
              ) : isFocusRunning ? (
                <Timer size={13} className="text-emerald-400 shrink-0" />
              ) : (
                <Headphones size={13} className="text-cyan-400 shrink-0" />
              )}
              <span className="text-xs font-semibold text-white truncate">
                {islandNotification
                  ? islandNotification.title
                  : isFocusRunning
                  ? `Focus: ${formatTime(focusTimeLeft)}`
                  : `Playing: ${currentAmbient?.toUpperCase()}`}
              </span>
            </div>

            <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: accent.value }} />
          </div>
        )}

        {/* Expanded One UI Quick Panel */}
        {isExpanded && (
          <div className="w-full flex flex-col gap-3 text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: accent.bg, color: accent.value }}
                >
                  ✨
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Galaxy Smart Panel</h4>
                  <p className="text-[10px] text-slate-400">One UI Active Services</p>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>

            {/* Focus Controls */}
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-emerald-400" />
                <div>
                  <div className="text-xs font-bold font-mono text-white">{formatTime(focusTimeLeft)}</div>
                  <div className="text-[10px] text-slate-400">{isFocusRunning ? 'Timer active' : 'Paused'}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleFocusTimer}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1"
                >
                  {isFocusRunning ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isFocusRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  onClick={resetFocusTimer}
                  className="p-1 rounded-lg bg-white/10 text-slate-300 hover:text-white"
                >
                  <Square size={12} />
                </button>
              </div>
            </div>

            {/* Ambient Soundscape */}
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones size={16} className="text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-white capitalize">
                    {currentAmbient ? `Soundscape: ${currentAmbient}` : 'Soundscape: Off'}
                  </div>
                  <div className="text-[10px] text-slate-400">Synthesized audio</div>
                </div>
              </div>
              <button
                onClick={() => setAmbientSound(currentAmbient ? null : 'rain')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold"
              >
                {currentAmbient ? 'Mute' : 'Play Rain'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
