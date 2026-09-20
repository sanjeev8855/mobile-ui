import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const SamsungNavBar: React.FC = () => {
  const { setActiveTab, setCommandPaletteOpen, isCommandPaletteOpen } = useApp()
  const { isOled } = useTheme()

  const handleRecents = () => {
    sound.playTap()
    setCommandPaletteOpen(!isCommandPaletteOpen)
  }

  const handleHome = () => {
    sound.playTap()
    setActiveTab('home')
  }

  const handleBack = () => {
    sound.playTap()
    setActiveTab('home')
  }

  return (
    <div
      className={`w-full py-1.5 px-10 flex items-center justify-between select-none z-40 transition-colors ${
        isOled ? 'bg-black text-white/70' : 'bg-slate-950/90 text-white/80 backdrop-blur-md'
      }`}
    >
      {/* 1. Recents Button (|||) */}
      <button
        onClick={handleRecents}
        className="p-2 flex items-center justify-center gap-1 hover:text-white transition-transform active:scale-90 cursor-pointer"
        title="Recent Apps"
      >
        <div className="w-1 h-3.5 bg-current rounded-full" />
        <div className="w-1 h-3.5 bg-current rounded-full" />
        <div className="w-1 h-3.5 bg-current rounded-full" />
      </button>

      {/* 2. Home Button (Rounded Square ▢) */}
      <button
        onClick={handleHome}
        className="p-2 flex items-center justify-center hover:text-white transition-transform active:scale-90 cursor-pointer"
        title="Home"
      >
        <div className="w-3.5 h-3.5 border-2 border-current rounded-[4px]" />
      </button>

      {/* 3. Back Button (<) */}
      <button
        onClick={handleBack}
        className="p-2 flex items-center justify-center hover:text-white transition-transform active:scale-90 cursor-pointer"
        title="Back"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 3 4 7 9 11" />
        </svg>
      </button>
    </div>
  )
}
