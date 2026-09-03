import React from 'react'
import { motion } from 'framer-motion'
import { Home, LayoutGrid, Sparkles, Grid3X3, Settings } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const BottomDock: React.FC = () => {
  const { activeTab, setActiveTab } = useApp()
  const { accent, isOled } = useTheme()

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'widgets' as const, label: 'Widgets', icon: LayoutGrid },
    { id: 'assistant' as const, label: 'Copilot', icon: Sparkles },
    { id: 'apps' as const, label: 'Apps', icon: Grid3X3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ]

  return (
    <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-center z-40 pointer-events-none">
      <nav
        className={`pointer-events-auto w-full max-w-[340px] px-2.5 py-1.5 rounded-full flex items-center justify-around backdrop-blur-2xl transition-all shadow-[0_12px_32px_rgba(0,0,0,0.6)] ${
          isOled
            ? 'bg-[#121216]/95 border border-[#2a2a30]'
            : 'bg-slate-950/80 border border-white/15'
        }`}
      >
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playTap()
                setActiveTab(tab.id)
              }}
              className="relative py-2 px-3 flex flex-col items-center justify-center rounded-full transition-colors group cursor-pointer"
            >
              {/* Active pill background with spring physics */}
              {isActive && (
                <motion.div
                  layoutId="activeDockIndicator"
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: accent.bg,
                    border: `1px solid ${accent.border}`,
                    boxShadow: `0 0 16px ${accent.glow}`,
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  size={19}
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'scale-105' : 'opacity-60 text-slate-400 group-hover:opacity-100'
                  }`}
                  style={{ color: isActive ? accent.value : undefined }}
                />
                <span
                  className={`text-[9px] font-medium tracking-tight ${
                    isActive ? 'font-semibold' : 'opacity-60 text-slate-400'
                  }`}
                  style={{ color: isActive ? accent.value : undefined }}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
