import React, { useState, useEffect } from 'react'
import { StatusBar } from './StatusBar'
import { SamsungSmartPill } from './SamsungSmartPill'
import { BottomDock } from '../navigation/BottomDock'
import { SamsungNavBar } from '../navigation/SamsungNavBar'
import { CommandPalette } from '../navigation/CommandPalette'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    preferences,
  } = useApp()
  const { bgClass, accent } = useTheme()

  const [isFullscreen] = useState(preferences.screenMode === 'fullscreen')

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

  // Samsung Galaxy S24 Ultra Frame Styling
  const getFrameStyles = () => {
    if (isFullscreen) {
      return 'w-full max-w-md h-[100dvh] rounded-none shadow-none border-0'
    }
    // Galaxy S24 Ultra Titanium Frame: Symmetrical ultra-thin titanium borders, responsive on mobile & desktop
    return 'w-full max-w-md h-[100dvh] md:w-[392px] md:h-[856px] md:rounded-[32px] md:border-[10px] md:border-[#22252c] md:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95),0_0_0_2px_rgba(255,255,255,0.14),inset_0_0_0_1px_rgba(0,0,0,0.8)]'
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

      {/* Samsung Galaxy S24 Ultra Hardware Shell */}
      <div className={`relative ${getFrameStyles()} transition-all duration-300 overflow-hidden flex flex-col justify-between ${bgClass}`}>
        {/* Galaxy S24 Ultra Titanium Reflection Border */}
        {!isFullscreen && (
          <div className="hidden md:block absolute inset-0 pointer-events-none rounded-[22px] border border-white/10 z-50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]" />
        )}

        {/* Top Header: Samsung Status Bar + Infinity-O Punch Hole Camera Cutout */}
        <div className="w-full shrink-0 z-40 relative">
          <StatusBar />

          {/* Authentic Centered Infinity-O Camera Punch-Hole */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black border border-[#1b1c20] shadow-inner z-50 flex items-center justify-center pointer-events-none ring-1 ring-white/10">
            <div className="w-1 h-1 rounded-full bg-[#0d1629]" />
          </div>

          {/* Samsung One UI Smart Capsule / Edge Alert */}
          <SamsungSmartPill />
        </div>

        {/* Scrollable Mobile Surface Area */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative scrollbar-none px-4 pt-1 pb-36 z-10">
          {children}
        </main>

        {/* Soft bottom edge fade so text gracefully scrolls behind dock */}
        <div className="pointer-events-none absolute bottom-11 inset-x-0 h-16 bg-gradient-to-t from-[#070b14] via-[#070b14]/75 to-transparent z-30" />

        {/* Bottom Floating Navigation Dock */}
        <BottomDock />

        {/* Samsung One UI 3-Button Navigation Bar (||| ▢ <) */}
        <SamsungNavBar />

        {/* Universal Search / Command Palette Overlay */}
        <CommandPalette />
      </div>
    </div>
  )
}
