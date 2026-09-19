import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ThemeMode, AccentColor } from '../types'

export const ACCENT_PRESETS: AccentColor[] = [
  { id: 'ios-blue', name: 'Classic Blue', value: '#007aff', glow: 'rgba(0, 122, 255, 0.4)', border: 'rgba(0, 122, 255, 0.5)', bg: 'rgba(0, 122, 255, 0.15)' },
  { id: 'classic-gold', name: 'Royal Gold', value: '#d4af37', glow: 'rgba(212, 175, 55, 0.4)', border: 'rgba(212, 175, 55, 0.5)', bg: 'rgba(212, 175, 55, 0.15)' },
  { id: 'ios-green', name: 'Classic Emerald', value: '#34c759', glow: 'rgba(52, 199, 89, 0.4)', border: 'rgba(52, 199, 89, 0.5)', bg: 'rgba(52, 199, 89, 0.15)' },
  { id: 'cyan', name: 'Cyber Cyan', value: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)', border: 'rgba(0, 240, 255, 0.5)', bg: 'rgba(0, 240, 255, 0.12)' },
  { id: 'violet', name: 'Electric Violet', value: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)', border: 'rgba(168, 85, 247, 0.5)', bg: 'rgba(168, 85, 247, 0.12)' },
  { id: 'rose', name: 'Hyper Rose', value: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', border: 'rgba(244, 63, 94, 0.5)', bg: 'rgba(244, 63, 94, 0.12)' },
  { id: 'monochrome', name: 'Pure White', value: '#ffffff', glow: 'rgba(255, 255, 255, 0.3)', border: 'rgba(255, 255, 255, 0.3)', bg: 'rgba(255, 255, 255, 0.1)' },
]

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  accent: AccentColor
  setAccentId: (id: string) => void
  isOled: boolean
  isClassic: boolean
  cardClass: string
  bgClass: string
  textPrimary: string
  textMuted: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('mobile_ui_theme') as ThemeMode) || 'classic-ios'
  })

  const [accentId, setAccentIdState] = useState<string>(() => {
    return localStorage.getItem('mobile_ui_accent') || 'ios-blue'
  })

  const accent = ACCENT_PRESETS.find(a => a.id === accentId) || ACCENT_PRESETS[0]

  const setTheme = (t: ThemeMode) => {
    setThemeState(t)
    localStorage.setItem('mobile_ui_theme', t)
  }

  const setAccentId = (id: string) => {
    setAccentIdState(id)
    localStorage.setItem('mobile_ui_accent', id)
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accent.value)
    document.documentElement.style.setProperty('--accent-glow', accent.glow)
    document.documentElement.style.setProperty('--accent-border', accent.border)
    document.documentElement.style.setProperty('--accent-bg', accent.bg)
  }, [accent])

  const isOled = theme === 'oled'
  const isClassic = theme === 'classic-ios' || theme === 'classic-vintage' || theme === 'classic-executive'

  let bgClass = 'bg-[#070b14] text-slate-100'
  let cardClass = 'bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg'
  let textPrimary = 'text-white'
  let textMuted = 'text-slate-400'

  if (theme === 'classic-ios') {
    // Authentic premium iOS twilight wallpaper and frosted glass
    bgClass = 'bg-gradient-to-b from-[#172033] via-[#0f1626] to-[#090d17] text-slate-100'
    cardClass = 'bg-white/[0.08] border border-white/[0.14] backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)]'
    textPrimary = 'text-white'
    textMuted = 'text-slate-300'
  } else if (theme === 'classic-vintage') {
    // Steve Jobs iOS 6 era textured slate with subtle skeuomorphic depth
    bgClass = 'bg-[#18191d] text-slate-100'
    cardClass = 'bg-gradient-to-b from-[#282a30] to-[#1c1d22] border border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.6)]'
    textPrimary = 'text-slate-100'
    textMuted = 'text-slate-400'
  } else if (theme === 'classic-executive') {
    // Luxury Swiss watch & executive platinum/gold
    bgClass = 'bg-[#111215] text-amber-50'
    cardClass = 'bg-[#18191e] border border-amber-500/20 shadow-xl'
    textPrimary = 'text-white'
    textMuted = 'text-neutral-400'
  } else if (theme === 'oled') {
    bgClass = 'bg-black text-white'
    cardClass = 'bg-[#101012] border border-[#222226] shadow-none'
    textPrimary = 'text-white'
    textMuted = 'text-neutral-400'
  } else if (theme === 'glassmorphism') {
    bgClass = 'bg-gradient-to-br from-[#0c1021] via-[#14122e] to-[#0a0818] text-slate-100'
    cardClass = 'bg-white/[0.06] border border-white/[0.12] backdrop-blur-2xl shadow-2xl'
    textPrimary = 'text-white'
    textMuted = 'text-indigo-200/70'
  } else if (theme === 'sunset') {
    bgClass = 'bg-gradient-to-br from-[#180828] via-[#240c2e] to-[#0d0417] text-rose-50'
    cardClass = 'bg-rose-950/30 border border-rose-500/20 backdrop-blur-xl shadow-rose-950/30'
    textPrimary = 'text-white'
    textMuted = 'text-rose-200/60'
  } else if (theme === 'retro-terminal') {
    bgClass = 'bg-[#040e07] text-emerald-300 font-mono'
    cardClass = 'bg-[#071a0e] border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
    textPrimary = 'text-emerald-300'
    textMuted = 'text-emerald-600'
  } else if (theme === 'nordic') {
    bgClass = 'bg-gradient-to-b from-[#08121f] to-[#040910] text-slate-100'
    cardClass = 'bg-sky-950/40 border border-sky-500/20 backdrop-blur-xl shadow-sky-950/40'
    textPrimary = 'text-white'
    textMuted = 'text-sky-200/60'
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accent,
        setAccentId,
        isOled,
        isClassic,
        cardClass,
        bgClass,
        textPrimary,
        textMuted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
