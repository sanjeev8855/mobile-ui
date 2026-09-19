import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Sun, CloudSun, Clock, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const ClassicClockWidget: React.FC = () => {
  const { preferences, weather } = useApp()
  const { cardClass, accent, theme } = useTheme()
  const [time, setTime] = useState(new Date())
  const [clockMode, setClockMode] = useState<'analog' | 'digital'>('analog')

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate analog clock hand angles
  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours()

  const secondDeg = seconds * 6
  const minuteDeg = minutes * 6 + seconds * 0.1
  const hourDeg = (hours % 12) * 30 + minutes * 0.5

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const currentDay = dayNames[time.getDay()]
  const currentDate = time.getDate()
  const currentMonth = monthNames[time.getMonth()]

  const isVintage = theme === 'classic-vintage'
  const isExecutive = theme === 'classic-executive'

  return (
    <div className={`p-4 rounded-3xl ${cardClass} relative overflow-hidden transition-all shadow-xl select-none`}>
      {/* Background ambient lighting */}
      <div
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accent.value }}
      />

      <div className="flex items-center justify-between">
        {/* Left: Classic Greeting & Date */}
        <div className="flex flex-col justify-between py-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-slate-300">
            <Calendar size={13} style={{ color: accent.value }} />
            <span>{currentDay}, {currentDate} {currentMonth}</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mt-1 mb-0">
            {preferences.userName || 'Sanje'}
          </h2>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-xs text-slate-300 font-medium bg-white/10 px-2.5 py-1 rounded-xl">
              <CloudSun size={13} className="text-amber-400" />
              <span>{weather.temp}° {weather.condition}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={11} />
              <span>{weather.city.split(',')[0]}</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="mt-3">
            <button
              onClick={() => {
                sound.playTap()
                setClockMode(m => m === 'analog' ? 'digital' : 'analog')
              }}
              className="text-[10px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-lg border border-white/5 transition-colors"
            >
              <Clock size={10} />
              <span>Switch to {clockMode === 'analog' ? 'Digital' : 'Analog'}</span>
            </button>
          </div>
        </div>

        {/* Right: The Iconic Swiss Analog Clock Face */}
        {clockMode === 'analog' ? (
          <div
            onClick={() => sound.playTap()}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
              isVintage
                ? 'bg-gradient-to-b from-[#2e313a] to-[#1a1b20] border-4 border-[#3f434e] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_8px_20px_rgba(0,0,0,0.6)]'
                : isExecutive
                ? 'bg-gradient-to-b from-[#1c1e24] to-[#121316] border-2 border-amber-500/40 shadow-[0_8px_25px_rgba(0,0,0,0.7)]'
                : 'bg-gradient-to-b from-slate-900 to-black border-2 border-white/20 shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),0_8px_25px_rgba(0,0,0,0.5)]'
            }`}
          >
            {/* Clock Ticks (12, 3, 6, 9) */}
            <div className="absolute top-1.5 w-1 h-2 bg-white/70 rounded-full" />
            <div className="absolute bottom-1.5 w-1 h-2 bg-white/70 rounded-full" />
            <div className="absolute left-1.5 h-1 w-2 bg-white/70 rounded-full" />
            <div className="absolute right-1.5 h-1 w-2 bg-white/70 rounded-full" />

            {/* Date Window */}
            <div className="absolute right-5 px-1 py-0.5 bg-black/60 rounded border border-white/10 text-[9px] font-mono font-bold text-white">
              {currentDate}
            </div>

            {/* Hour Hand */}
            <div
              className="absolute w-1.5 h-7 rounded-full bg-white origin-bottom z-10 shadow-sm"
              style={{
                transform: `rotate(${hourDeg}deg) translateY(-50%)`,
                transformOrigin: '50% 100%',
              }}
            />

            {/* Minute Hand */}
            <div
              className="absolute w-1 h-10 rounded-full bg-slate-200 origin-bottom z-20 shadow-sm"
              style={{
                transform: `rotate(${minuteDeg}deg) translateY(-50%)`,
                transformOrigin: '50% 100%',
              }}
            />

            {/* Sweeping Second Hand */}
            <div
              className="absolute w-0.5 h-11 rounded-full origin-bottom z-30"
              style={{
                backgroundColor: isExecutive ? '#d4af37' : '#ff3b30',
                transform: `rotate(${secondDeg}deg) translateY(-40%)`,
                transformOrigin: '50% 85%',
                boxShadow: isExecutive ? '0 0 4px #d4af37' : '0 0 4px #ff3b30',
              }}
            />

            {/* Center Cap Pin */}
            <div
              className="absolute w-2.5 h-2.5 rounded-full z-40 border border-black shadow"
              style={{ backgroundColor: isExecutive ? '#d4af37' : '#ff3b30' }}
            />
          </div>
        ) : (
          /* Classic Clean Digital Clock */
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/30 border border-white/10 min-w-[110px]">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold mt-0.5">
              :{seconds.toString().padStart(2, '0')} SEC
            </span>
            <span className="text-[10px] uppercase font-bold text-cyan-400 mt-1">
              CHRONO LIVE
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
