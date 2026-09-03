import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Palette, Smartphone, Volume2, ShieldCheck, Download, Upload, RefreshCw, User, Check, Sparkles, Bell } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme, ACCENT_PRESETS } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'
import type { ThemeMode } from '../../types'

export const SettingsView: React.FC = () => {
  const { preferences, updatePreferences, habits, notes, expenses, apps, showIslandNotification } = useApp()
  const { theme, setTheme, accent, setAccentId, cardClass } = useTheme()
  const [userName, setUserName] = useState(preferences.userName)
  const [tagline, setTagline] = useState(preferences.tagline)
  const [dailyBudget, setDailyBudget] = useState(preferences.dailyBudget.toString())

  const themes: { id: ThemeMode; name: string; desc: string; previewBg: string; previewBorder: string }[] = [
    { id: 'cyberpunk', name: 'Cyberpunk HUD', desc: 'Neon cyan & techno aesthetic', previewBg: 'bg-[#070b14]', previewBorder: 'border-cyan-400' },
    { id: 'oled', name: 'OLED Stealth', desc: 'Pure pitch black #000000 & battery saver', previewBg: 'bg-black', previewBorder: 'border-white/40' },
    { id: 'glassmorphism', name: 'iOS Frosted Glass', desc: 'Translucent blur & specular highlights', previewBg: 'bg-[#0c1021]', previewBorder: 'border-indigo-400' },
    { id: 'sunset', name: 'Sunset Aurora', desc: 'Velvet purple & warm rose glow', previewBg: 'bg-[#180828]', previewBorder: 'border-rose-400' },
    { id: 'retro-terminal', name: 'Matrix Terminal', desc: 'CRT phosphor green & monospaced', previewBg: 'bg-[#040e07]', previewBorder: 'border-emerald-400' },
    { id: 'nordic', name: 'Nordic Glacier', desc: 'Arctic midnight & ice cyan', previewBg: 'bg-[#08121f]', previewBorder: 'border-sky-400' },
  ]

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    sound.playChime()
    updatePreferences({
      userName: userName.trim() || 'Sanje',
      tagline: tagline.trim() || 'Personal Command Center',
      dailyBudget: parseFloat(dailyBudget) || 50,
    })
    showIslandNotification('Profile Updated', 'Settings saved to local vault', 'CheckCircle', '#10b981')
  }

  const handleExportData = () => {
    sound.playBip()
    const data = {
      preferences,
      habits,
      notes,
      expenses,
      apps,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `personal-mobile-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    showIslandNotification('Backup Exported', 'JSON data downloaded successfully', 'Download', '#00f0ff')
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Title */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase opacity-75" style={{ color: accent.value }}>
          <Settings size={13} />
          <span>System & Aesthetics</span>
        </div>
        <h2 className="text-xl font-bold text-white m-0">Settings & Customization</h2>
        <p className="text-xs text-slate-400">
          Personalize themes, sound synthesis, audio engines & data
        </p>
      </div>

      {/* 1. Theme Selection */}
      <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3`}>
        <div className="flex items-center gap-2">
          <Palette size={16} style={{ color: accent.value }} />
          <h3 className="text-sm font-bold text-white m-0">Visual Aesthetic Preset</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {themes.map(t => {
            const isSelected = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => {
                  sound.playTap()
                  setTheme(t.id)
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                  t.previewBg
                } ${
                  isSelected ? `ring-2 ring-cyan-400 ${t.previewBorder} shadow-lg scale-[1.02]` : 'border-white/10 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.name}</span>
                  {isSelected && <Check size={13} className="text-cyan-400 stroke-[3]" />}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight m-0">{t.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Custom Accent Colors */}
      <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3`}>
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: accent.value }} />
          <h3 className="text-sm font-bold text-white m-0">Accent & Glow Tone</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {ACCENT_PRESETS.map(acc => {
            const isSelected = accent.id === acc.id
            return (
              <button
                key={acc.id}
                onClick={() => {
                  sound.playTap()
                  setAccentId(acc.id)
                }}
                className={`p-2 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected ? 'border-white bg-white/15 scale-105' : 'border-white/5 bg-black/20 hover:bg-white/5'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-md shrink-0"
                  style={{ backgroundColor: acc.value, boxShadow: `0 0 8px ${acc.glow}` }}
                />
                <span className="text-xs font-medium text-white truncate">{acc.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Audio & Haptic Feedback Tester */}
      <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={16} style={{ color: accent.value }} />
            <div>
              <h3 className="text-sm font-bold text-white m-0">Synthesized Sound Studio</h3>
              <p className="text-[10px] text-slate-400">Offline Web Audio API effects</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => sound.playChime()}
            className="p-2.5 rounded-2xl bg-black/30 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex flex-col items-center gap-1"
          >
            <span>Harmonic Chime</span>
            <span className="text-[9px] text-emerald-400 font-mono">Test 880Hz</span>
          </button>
          <button
            onClick={() => sound.playBip()}
            className="p-2.5 rounded-2xl bg-black/30 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex flex-col items-center gap-1"
          >
            <span>Futuristic Bip</span>
            <span className="text-[9px] text-cyan-400 font-mono">Test 1400Hz</span>
          </button>
          <button
            onClick={() => sound.playTap()}
            className="p-2.5 rounded-2xl bg-black/30 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex flex-col items-center gap-1"
          >
            <span>Haptic Micro-Tap</span>
            <span className="text-[9px] text-purple-400 font-mono">Test 120Hz</span>
          </button>
        </div>
      </div>

      {/* 4. User Profile Settings */}
      <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3`}>
        <div className="flex items-center gap-2">
          <User size={16} style={{ color: accent.value }} />
          <h3 className="text-sm font-bold text-white m-0">Personal Profile</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-slate-400">Display Name</label>
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Tagline / Motto</label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Daily Expense Cap ($)</label>
            <input
              type="number"
              value={dailyBudget}
              onChange={e => setDailyBudget(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl font-bold text-xs text-black shadow-md transition-all hover:scale-[1.01]"
            style={{ backgroundColor: accent.value }}
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* 5. Local Vault & Backup */}
      <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3`}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-white m-0">Local Vault & Offline Data</h3>
        </div>
        <p className="text-xs text-slate-400 m-0">
          All habits, notes, expenses, and shortcuts are stored securely in your browser/device LocalStorage.
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleExportData}
            className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2"
          >
            <Download size={14} />
            <span>Export Backup</span>
          </button>
        </div>
      </div>
    </div>
  )
}
