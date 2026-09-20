import React from 'react'
import { Home, LayoutGrid, Sparkles, Grid3X3, Settings } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const BottomDock: React.FC = () => {
  const { activeTab, setActiveTab, preferences, setCommandPaletteOpen, isCommandPaletteOpen } = useApp()
  const { accent, isOled } = useTheme()

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'widgets' as const, label: 'Widgets', icon: LayoutGrid },
    { id: 'assistant' as const, label: 'Copilot', icon: Sparkles },
    { id: 'apps' as const, label: 'Apps', icon: Grid3X3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ]

  const navStyle = preferences.navigationStyle || 'gestures'

  return (
    <nav
      className={`w-full shrink-0 z-40 select-none border-t transition-colors duration-200 px-3 pt-2 pb-1.5 flex flex-col items-center justify-between ${
        isOled
          ? 'bg-black/95 border-white/10'
          : 'bg-[#080d19]/95 backdrop-blur-2xl border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* 5 Flagship Navigation Tabs */}
      <div className="w-full max-w-[390px] flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playTap()
                setActiveTab(tab.id)
              }}
              className="relative flex-1 py-1.5 px-1 flex flex-col items-center justify-center rounded-2xl cursor-pointer group focus:outline-none transition-transform active:scale-95"
            >
              {/* Active Pill Background: Instant CSS transition, NO layoutId to eliminate freezes & glitching */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-200 ease-out ${
                  isActive
                    ? 'opacity-100 scale-100 shadow-[0_2px_12px_rgba(0,0,0,0.4)]'
                    : 'opacity-0 scale-90 pointer-events-none'
                }`}
                style={{
                  backgroundColor: accent.bg,
                  border: `1px solid ${accent.border}`,
                  boxShadow: `0 0 16px ${accent.glow}`,
                }}
              />

              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  size={20}
                  className={`transition-all duration-200 ${
                    isActive
                      ? 'scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
                      : 'opacity-55 text-slate-400 group-hover:opacity-100 group-hover:text-slate-200'
                  }`}
                  style={{ color: isActive ? accent.value : undefined }}
                />
                <span
                  className={`text-[10px] tracking-tight transition-all duration-200 ${
                    isActive ? 'font-bold text-white scale-105' : 'font-medium opacity-55 text-slate-400'
                  }`}
                  style={{ color: isActive ? accent.value : undefined }}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Samsung Galaxy Navigation Footer Base */}
      {navStyle === 'buttons' ? (
        /* Classic 3-Button Navigation Bar (||| ▢ <) docked cleanly */
        <div className="w-full max-w-[260px] pt-1.5 pb-0.5 flex items-center justify-between text-white/60">
          <button
            type="button"
            onClick={() => {
              sound.playTap()
              setCommandPaletteOpen(!isCommandPaletteOpen)
            }}
            className="p-1 hover:text-white transition-transform active:scale-90 cursor-pointer"
            title="Recent Apps & Universal Search"
          >
            <div className="flex gap-1 items-center">
              <div className="w-1 h-3 bg-current rounded-full" />
              <div className="w-1 h-3 bg-current rounded-full" />
              <div className="w-1 h-3 bg-current rounded-full" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap()
              setActiveTab('home')
            }}
            className="p-1 hover:text-white transition-transform active:scale-90 cursor-pointer"
            title="Home"
          >
            <div className="w-3.5 h-3.5 border-2 border-current rounded-[4px]" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap()
              setActiveTab('home')
            }}
            className="p-1 hover:text-white transition-transform active:scale-90 cursor-pointer"
            title="Back"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 3 4 7 9 11" />
            </svg>
          </button>
        </div>
      ) : (
        /* Authentic Samsung Galaxy S24 Ultra One UI Gesture Indicator Pill */
        <div className="pt-1.5 pb-0.5 flex items-center justify-center w-full">
          <button
            type="button"
            onClick={() => {
              sound.playTap()
              setActiveTab('home')
            }}
            className="w-28 h-1 rounded-full bg-white/30 hover:bg-white/60 active:scale-90 transition-all cursor-pointer"
            title="Home Gesture"
          />
        </div>
      )}
    </nav>
  )
}

