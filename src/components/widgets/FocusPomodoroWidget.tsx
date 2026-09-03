import React from 'react'
import { motion } from 'framer-motion'
import { Timer, Play, Pause, RotateCcw, CloudRain, Waves, Trees, Zap, Volume2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const FocusPomodoroWidget: React.FC = () => {
  const {
    focusTimeLeft,
    isFocusRunning,
    focusMode,
    toggleFocusTimer,
    resetFocusTimer,
    setFocusMode,
    currentAmbient,
    setAmbientSound,
    ambientVolume,
    setAmbientVolume,
  } = useApp()
  const { cardClass, accent, textPrimary, textMuted } = useTheme()

  const totalTime = focusMode === 'focus' ? 25 * 60 : focusMode === 'shortBreak' ? 5 * 60 : 15 * 60
  const progress = ((totalTime - focusTimeLeft) / totalTime) * 100

  const mins = Math.floor(focusTimeLeft / 60)
  const secs = focusTimeLeft % 60
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

  const ambientPresets: { id: 'rain' | 'waves' | 'forest' | 'whitenoise'; label: string; icon: any }[] = [
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'waves', label: 'Waves', icon: Waves },
    { id: 'forest', label: 'Forest', icon: Trees },
    { id: 'whitenoise', label: 'Cyber Drone', icon: Zap },
  ]

  return (
    <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3 relative transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
            style={{ color: accent.value }}
          >
            <Timer size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Focus & Soundscape</h3>
            <p className="text-[11px] text-slate-400">Deep work timer & ambient engine</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[10px]">
          <button
            onClick={() => setFocusMode('focus')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
              focusMode === 'focus' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => setFocusMode('shortBreak')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
              focusMode === 'shortBreak' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            5m Rest
          </button>
        </div>
      </div>

      {/* Radial Timer Center */}
      <div className="flex items-center justify-center py-2 relative">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* SVG Circular Progress */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-white/10"
              strokeWidth="6"
              fill="transparent"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              stroke={accent.value}
              strokeWidth="6"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
              style={{ filter: `drop-shadow(0 0 8px ${accent.glow})` }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black font-mono tracking-tight text-white">{formatted}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {isFocusRunning ? 'In Session' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleFocusTimer}
          className="px-6 py-2.5 rounded-2xl font-bold text-sm text-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: accent.value }}
        >
          {isFocusRunning ? <Pause size={16} /> : <Play size={16} />}
          <span>{isFocusRunning ? 'Pause Session' : 'Start Focus'}</span>
        </button>

        <button
          onClick={resetFocusTimer}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Ambient Soundscapes Selector */}
      <div className="mt-1 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-[11px] text-slate-300 mb-2 font-medium">
          <span>Synthesized Soundscapes</span>
          {currentAmbient && (
            <span className="text-[10px] uppercase font-bold text-cyan-300 animate-pulse">
              ? Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {ambientPresets.map(preset => {
            const Icon = preset.icon
            const isPlaying = currentAmbient === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => setAmbientSound(preset.id)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-medium border transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.3)] scale-105'
                    : 'bg-black/20 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
                }`}
              >
                <Icon size={15} />
                <span>{preset.label}</span>
              </button>
            )
          })}
        </div>

        {/* Volume Slider if active */}
        {currentAmbient && (
          <div className="flex items-center gap-2 mt-2.5 px-1">
            <Volume2 size={12} className="text-slate-400" />
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={ambientVolume}
              onChange={e => setAmbientVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        )}
      </div>
    </div>
  )
}
