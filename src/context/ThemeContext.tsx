import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ThemeMode, AccentColor } from '../types'

export const ACCENT_PRESETS: AccentColor[] = [
  { id: 'samsung-blue', name: 'Samsung Blue', value: '#0072de', glow: 'rgba(0, 114, 222, 0.4)', border: 'rgba(0, 114, 222, 0.5)', bg: 'rgba(0, 114, 222, 0.15)' },
  { id: 'galaxy-emerald', name: 'Galaxy Green', value: '#00b074', glow: 'rgba(0, 176, 116, 0.4)', border: 'rgba(0, 176, 116, 0.5)', bg: 'rgba(0, 176, 116, 0.15)' },
  { id: 'titanium-violet', name: 'Titanium Violet', value: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)', border: 'rgba(139, 92, 246, 0.5)', bg: 'rgba(139, 92, 246, 0.15)' },
  { id: 'titanium-amber', name: 'Titanium Amber', value: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', border: 'rgba(245, 158, 11, 0.5)', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'phantom-white', name: 'Phantom White', value: '#ffffff', glow: 'rgba(255, 255, 255, 0.3)', border: 'rgba(255, 255, 255, 0.3)', bg: 'rgba(255, 255, 255, 0.1)' },
]

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  accent: AccentColor
  setAccentId: (id: string) => void
  isOled: boolean
  isSamsung: boolean
  cardClass: string
  bgClass: string
  textPrimary: string
  textMuted: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('mobile_ui_theme') as ThemeMode) || 'samsung-oneui'
  })

  const [accentId, setAccentIdState] = useState<string>(() => {
    return localStorage.getItem('mobile_ui_accent') || 'samsung-blue'
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

  const isOled = theme === 'oled' || theme === 'samsung-phantom-black'
  const isSamsung = theme.startsWith('samsung')

  let bgClass = 'bg-gradient-to-b from-[#0e1629] via-[#09101f] to-[#050811] text-slate-100'
  let cardClass = 'bg-[#131b2e]/80 border border-[#223152]/70 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-[26px]'
  let textPrimary = 'text-white'
  let textMuted = 'text-slate-300'

  if (theme === 'samsung-oneui') {
    bgClass = 'bg-gradient-to-b from-[#0d172e] via-[#080e1e] to-[#04070f] text-slate-100'
    cardClass = 'bg-[#121c33]/85 border border-[#203157]/80 backdrop-blur-2xl shadow-[0_10px_32px_rgba(0,0,0,0.4)] rounded-[26px]'
    textPrimary = 'text-white'
    textMuted = 'text-slate-300'
  } else if (theme === 'samsung-phantom-black') {
    bgClass = 'bg-black text-white'
    cardClass = 'bg-[#111215] border border-[#23252c] shadow-none rounded-[26px]'
    textPrimary = 'text-white'
    textMuted = 'text-neutral-400'
  } else if (theme === 'samsung-titanium-violet') {
    bgClass = 'bg-gradient-to-b from-[#1c1229] via-[#110b1a] to-[#07040c] text-purple-50'
    cardClass = 'bg-[#221633]/80 border border-violet-500/25 backdrop-blur-2xl shadow-xl rounded-[26px]'
    textPrimary = 'text-white'
    textMuted = 'text-purple-200/70'
  } else if (theme === 'samsung-titanium-gray') {
    bgClass = 'bg-[#17181c] text-slate-100'
    cardClass = 'bg-[#212328] border border-[#333740] shadow-lg rounded-[26px]'
    textPrimary = 'text-white'
    textMuted = 'text-slate-400'
  } else if (theme === 'oled') {
    bgClass = 'bg-black text-white'
    cardClass = 'bg-[#101012] border border-[#222226] shadow-none rounded-[26px]'
    textPrimary = 'text-white'
    textMuted = 'text-neutral-400'
  } else if (theme === 'sunset') {
    bgClass = 'bg-gradient-to-br from-[#180828] via-[#240c2e] to-[#0d0417] text-rose-50'
    cardClass = 'bg-rose-950/30 border border-rose-500/20 backdrop-blur-xl shadow-rose-950/30 rounded-[26px]'
    textPrimary = 'text-white'
    textMuted = 'text-rose-200/60'
  } else if (theme === 'cyberpunk') {
    bgClass = 'bg-[#070b14] text-slate-100'
    cardClass = 'bg-slate-900/60 border border-cyan-500/30 backdrop-blur-xl shadow-lg rounded-[26px]'
    textPrimary = 'text-white'
    textMuted = 'text-slate-400'
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accent,
        setAccentId,
        isOled,
        isSamsung,
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
