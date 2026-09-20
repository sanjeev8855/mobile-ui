import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CloudSun, Sun, MapPin, Sparkles, Bell, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const SamsungWeatherClockWidget: React.FC = () => {
  const { preferences, weather, setActiveTab, sendAIMessage } = useApp()
  const { cardClass, accent, isOled } = useTheme()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const currentDay = dayNames[time.getDay()]
  const currentDate = time.getDate()
  const currentMonth = monthNames[time.getMonth()]

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')

  const getGreeting = () => {
    const hour = time.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    if (hour < 21) return 'Good evening'
    return 'Late night'
  }

  return (
    <div className={`p-4 rounded-[26px] ${cardClass} relative overflow-hidden transition-all shadow-xl select-none`}>
      {/* Subtle Samsung Galaxy glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accent.value }}
      />

      {/* Top Banner: One UI Greeting & Profile */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 shadow-sm shrink-0">
            <img src={preferences.avatarUrl} alt="Jay" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight">
            {getGreeting()}, <span style={{ color: accent.value }}>{preferences.userName || 'Jay'}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-[10px] font-medium text-cyan-300">
          <Sparkles size={10} />
          <span>Galaxy AI</span>
        </div>
      </div>

      {/* Main Dual Clock & Weather Block */}
      <div className="flex items-center justify-between">
        {/* Left: Samsung Digital Clock & Date */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black font-sans tracking-tight text-white">
              {hours}:{minutes}
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-300 mt-0.5">
            {currentDay}, {currentMonth} {currentDate}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
            <Bell size={11} className="text-amber-400" />
            <span>Alarm in 6h 30m</span>
          </div>
        </div>

        {/* Right: Samsung Weather Info */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-black text-white">{weather.temp}°</div>
              <div className="text-[11px] font-medium text-slate-300">{weather.condition}</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
              <CloudSun size={24} />
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
            <MapPin size={10} style={{ color: accent.value }} />
            <span>{weather.city.split(',')[0]} • H: {weather.high}° L: {weather.low}°</span>
          </div>
        </div>
      </div>

      {/* Galaxy AI Smart Chip */}
      <div
        onClick={() => {
          sound.playTap()
          sendAIMessage('Galaxy AI daily briefing')
          setActiveTab('assistant')
        }}
        className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer group transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">✨</span>
          <span className="font-semibold text-[11px] text-cyan-300 group-hover:underline">
            Galaxy AI: Ready to assist
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-cyan-300">
          <span>Tap to summarize day</span>
          <ArrowRight size={11} />
        </div>
      </div>
    </div>
  )
}
