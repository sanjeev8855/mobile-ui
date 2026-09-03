import React from 'react'
import { Sun, CloudSun, Moon, CloudRain, Calendar, Clock, MapPin, Sparkles, Flame, ShieldAlert } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const WeatherAgendaWidget: React.FC = () => {
  const { preferences, weather, events, stats, habits } = useApp()
  const { cardClass, accent, textPrimary, textMuted } = useTheme()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    if (hour < 21) return 'Good evening'
    return 'Late night focus'
  }

  const completedHabitsCount = habits.filter(h => h.completedToday).length
  const nextEvent = events[0]

  return (
    <div className="w-full flex flex-col gap-3">
      {/* User Greeting & Fast Overview */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase opacity-75" style={{ color: accent.value }}>
            <Sparkles size={13} />
            <span>{getGreeting()}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            {preferences.userName || 'Sanje'}
          </h1>
          <p className="text-xs opacity-60 text-slate-300">
            {preferences.tagline || 'Personal Command Center'}
          </p>
        </div>

        {/* User Avatar with live status ring */}
        <div className="relative">
          <img
            src={preferences.avatarUrl}
            alt="Profile"
            className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20 shadow-md"
          />
          <div
            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black"
            style={{ backgroundColor: accent.value }}
          />
        </div>
      </div>

      {/* Weather & Environmental Telemetry Card */}
      <div className={`p-4 rounded-3xl ${cardClass} relative overflow-hidden group transition-all`}>
        {/* Glow corner */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accent.value }}
        />

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <MapPin size={12} style={{ color: accent.value }} />
              <span>{weather.city}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold tracking-tight text-white">{weather.temp}�</span>
              <span className="text-xs font-medium text-slate-300">{weather.condition}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              H: {weather.high}� � L: {weather.low}� � {weather.airQuality}
            </div>
          </div>

          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10"
            style={{ color: accent.value }}
          >
            <CloudSun size={26} />
          </div>
        </div>

        {/* Hourly Forecast Pill Strip */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-center">
          {weather.hourly.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-400 font-medium">{h.time}</span>
              {h.icon === 'Sun' ? (
                <Sun size={14} className="text-amber-400" />
              ) : h.icon === 'Moon' ? (
                <Moon size={14} className="text-indigo-300" />
              ) : (
                <CloudSun size={14} className="text-sky-300" />
              )}
              <span className="text-xs font-semibold text-white">{h.temp}�</span>
            </div>
          ))}
        </div>
      </div>

      {/* Up Next / Calendar Agenda Card */}
      {nextEvent && (
        <div className={`p-3.5 rounded-3xl ${cardClass} flex items-center justify-between border-l-4`} style={{ borderLeftColor: nextEvent.color }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0"
              style={{ color: nextEvent.color }}
            >
              <Calendar size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-200">
                  {nextEvent.tag}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} /> {nextEvent.time}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-white truncate mt-0.5 m-0">
                {nextEvent.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
