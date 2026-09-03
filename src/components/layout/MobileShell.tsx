import React, { useState, useEffect, useRef } from 'react'
import { Search, Smartphone, Moon, Sun, Sparkles, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react'
import { StatusBar } from './StatusBar'
import { DynamicIsland } from './DynamicIsland'
import { BottomDock } from '../navigation/BottomDock'
import { CommandPalette } from '../navigation/CommandPalette'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    preferences,
    updatePreferences,
    activeTab,
  } = useApp()
  const { theme, setTheme, bgClass, isOled, accent } = useTheme()

  const [deviceFrame, setDeviceFrame] = useState<'iphone16' | 'galaxys24' | 'minimal' | 'fullscreen'>(() => {
    return preferences.screenMode === 'fullscreen' ? 'fullscreen' : (preferences.deviceFrame || 'iphone16')
  })

  // Listen for keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!isCommandPaletteOpen)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen, setCommandPaletteOpen])

  // Frame styles
  const getFrameStyles = () => {
    if (deviceFrame === 'fullscreen') {
      return 'w-full max-w-md md:max-w-md h-[100dvh] rounded-none shadow-none border-0'
    }
    if (deviceFrame === 'galaxys24') {
      return 'w-[390px] h-[844px] rounded-[38px] border-[10px] border-[#22252a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)]'
    }
    if (deviceFrame === 'minimal') {
      return 'w-[380px] h-[820px] rounded-[24px] border-[4px] border-neutral-700 shadow-2xl'
    }
    // iphone16 (default)
    return 'w-[393px] h-[852px] rounded-[52px] border-[11px] border-[#1e2024] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.08),inset_0_0_0_2px_rgba(0,0,0,0.5)]'
  }

  return (
    <div className="min-h-screen w-full bg-[#05070d] flex flex-col items-center justify-center relative overflow-hidden font-sans select-none text-slate-100">
      {/* Ambient background glow */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: accent.value }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[140px] opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: accent.value }}
      />

      {/* Desktop Top Control Bar */}
      <header className="hidden md:flex items-center justify-between w-full max-w-4xl px-6 py-3 mb-2 z-20 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold text-white">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent.value }} />
            Personal Mobile Interface
          </div>
          <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-400 font-mono">
            v2.4
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => {
              sound.playTap()
              setDeviceFrame('iphone16')
              updatePreferences({ deviceFrame: 'iphone16', screenMode: 'mobile-frame' })
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              deviceFrame === 'iphone16' ? 'bg-white/15 text-white' : 'hover:text-slate-200'
            }`}
          >
            iPhone 16 Pro
          </button>
          <button
            onClick={() => {
              sound.playTap()
              setDeviceFrame('galaxys24')
              updatePreferences({ deviceFrame: 'galaxys24', screenMode: 'mobile-frame' })
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              deviceFrame === 'galaxys24' ? 'bg-white/15 text-white' : 'hover:text-slate-200'
            }`}
          >
            Galaxy S24
          </button>
          <button
            onClick={() => {
              sound.playTap()
              setDeviceFrame('minimal')
              updatePreferences({ deviceFrame: 'minimal', screenMode: 'mobile-frame' })
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              deviceFrame === 'minimal' ? 'bg-white/15 text-white' : 'hover:text-slate-200'
            }`}
          >
            Minimalist
          </button>
          <button
            onClick={() => {
              sound.playTap()
              setDeviceFrame(deviceFrame === 'fullscreen' ? 'iphone16' : 'fullscreen')
            }}
            className={`p-1 rounded-lg transition-all ${
              deviceFrame === 'fullscreen' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:text-slate-200'
            }`}
            title="Toggle Fullscreen"
          >
            {deviceFrame === 'fullscreen' ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTap()
              setCommandPaletteOpen(true)
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5"
          >
            <Search size={12} />
            <span>Search</span>
            <kbd className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded text-slate-400">
              ?K
            </kbd>
          </button>

          <button
            onClick={() => {
              sound.playTap()
              setTheme(isOled ? 'cyberpunk' : 'oled')
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="Toggle OLED Stealth"
          >
            {isOled ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* Smartphone Hardware Frame Mockup */}
      <div className={`relative ${getFrameStyles()} transition-all duration-300 overflow-hidden flex flex-col justify-between ${bgClass}`}>
        {/* Top hardware antenna line or frame reflections */}
        {deviceFrame !== 'fullscreen' && (
          <div className="absolute inset-0 pointer-events-none rounded-[42px] border border-white/10 z-50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
        )}

        {/* Top Header with Status Bar & Dynamic Island */}
        <div className="w-full shrink-0 z-40 relative">
          <StatusBar />
          <DynamicIsland />
        </div>

        {/* Scrollable Mobile Surface Area */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative scrollbar-none px-4 pt-2 pb-24 z-10">
          {children}
        </main>

        {/* Bottom Floating Navigation Dock */}
        <BottomDock />

        {/* Universal Search / Command Palette Overlay */}
        <CommandPalette />
      </div>
    </div>
  )
}
