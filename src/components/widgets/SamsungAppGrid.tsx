import React from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageSquare, Globe, Camera, Image, Calendar, Clock, CloudSun, FileText, Folder, Settings, Sparkles, Activity, CreditCard, Music, MapPin } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const SamsungAppGrid: React.FC = () => {
  const { setActiveTab, habits, notes, showIslandNotification } = useApp()
  const { accent } = useTheme()

  const uncompletedHabits = habits.filter(h => !h.completedToday).length
  const todayDate = new Date().getDate()
  const todayDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()]

  const samsungApps = [
    {
      id: 'phone',
      name: 'Phone',
      badge: null,
      icon: Phone,
      gradient: 'from-[#00b074] to-[#008f5d]',
      action: () => {
        sound.playBip()
        showIslandNotification('Samsung Phone', 'Keypad ready for dialing', 'Phone', '#00b074')
      },
    },
    {
      id: 'messages',
      name: 'Messages',
      badge: 3,
      icon: MessageSquare,
      gradient: 'from-[#0072de] to-[#005bb3]',
      action: () => {
        sound.playTap()
        setActiveTab('assistant')
      },
    },
    {
      id: 'internet',
      name: 'Internet',
      badge: null,
      icon: Globe,
      gradient: 'from-[#6049e8] to-[#4530bf]',
      action: () => {
        sound.playTap()
        setActiveTab('apps')
      },
    },
    {
      id: 'camera',
      name: 'Camera',
      badge: null,
      icon: Camera,
      gradient: 'from-[#e12e36] to-[#b31920]',
      action: () => {
        sound.playBip()
        showIslandNotification('Galaxy Camera', '200MP Quad Telephoto Ready', 'Camera', '#e12e36')
      },
    },
    {
      id: 'gallery',
      name: 'Gallery',
      badge: null,
      icon: Image,
      gradient: 'from-[#ff5967] to-[#e63242]',
      action: () => {
        sound.playTap()
        showIslandNotification('Samsung Gallery', 'Albums & Stories synced', 'Image', '#ff5967')
      },
    },
    {
      id: 'calendar',
      name: 'Calendar',
      badge: null,
      isLiveCalendar: true,
      gradient: 'from-white to-slate-200',
      action: () => {
        sound.playTap()
        setActiveTab('home')
      },
    },
    {
      id: 'clock',
      name: 'Clock',
      badge: null,
      icon: Clock,
      gradient: 'from-[#22242a] to-[#121316]',
      action: () => {
        sound.playTap()
        setActiveTab('widgets')
      },
    },
    {
      id: 'weather',
      name: 'Weather',
      badge: null,
      icon: CloudSun,
      gradient: 'from-[#2489e6] to-[#0f62b3]',
      action: () => {
        sound.playTap()
        setActiveTab('home')
      },
    },
    {
      id: 'notes',
      name: 'Samsung Notes',
      badge: notes.length > 0 ? notes.length : null,
      icon: FileText,
      gradient: 'from-[#f58220] to-[#cc640c]',
      action: () => {
        sound.playTap()
        setActiveTab('widgets')
      },
    },
    {
      id: 'files',
      name: 'My Files',
      badge: null,
      icon: Folder,
      gradient: 'from-[#e89b00] to-[#b87800]',
      action: () => {
        sound.playTap()
        showIslandNotification('My Files', 'Internal Storage: 118 GB / 256 GB', 'Folder', '#e89b00')
      },
    },
    {
      id: 'health',
      name: 'Samsung Health',
      badge: uncompletedHabits > 0 ? uncompletedHabits : null,
      icon: Activity,
      gradient: 'from-[#00c07d] to-[#00945e]',
      action: () => {
        sound.playTap()
        setActiveTab('home')
      },
    },
    {
      id: 'galaxy_ai',
      name: 'Galaxy AI',
      badge: null,
      icon: Sparkles,
      gradient: 'from-[#7352ff] via-[#4d88ff] to-[#00c8b3]',
      action: () => {
        sound.playTap()
        setActiveTab('assistant')
      },
    },
    {
      id: 'wallet',
      name: 'Samsung Wallet',
      badge: null,
      icon: CreditCard,
      gradient: 'from-[#1a1d24] to-[#0b0c0e]',
      action: () => {
        sound.playTap()
        setActiveTab('widgets')
      },
    },
    {
      id: 'music',
      name: 'Music',
      badge: null,
      icon: Music,
      gradient: 'from-[#ff6b00] to-[#cc4e00]',
      action: () => {
        sound.playTap()
        setActiveTab('widgets')
      },
    },
    {
      id: 'maps',
      name: 'Maps',
      badge: null,
      icon: MapPin,
      gradient: 'from-[#2ea44f] to-[#1a73e8]',
      action: () => {
        sound.playTap()
        window.open('https://maps.google.com', '_blank')
      },
    },
    {
      id: 'settings',
      name: 'Settings',
      badge: null,
      icon: Settings,
      gradient: 'from-[#6e7480] to-[#4d515a]',
      action: () => {
        sound.playTap()
        setActiveTab('settings')
      },
    },
  ]

  return (
    <div className="w-full pt-1 pb-3">
      {/* 4x4 Samsung One UI App Grid */}
      <div className="grid grid-cols-4 gap-y-4 gap-x-2.5 justify-items-center select-none">
        {samsungApps.map(app => {
          const Icon = app.icon

          return (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.88 }}
              onClick={app.action}
              className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer group"
            >
              {/* Samsung Squircle Icon with One UI Curves */}
              <div className="relative">
                <div
                  className={`w-[58px] h-[58px] rounded-[22px] bg-gradient-to-b ${app.gradient} flex flex-col items-center justify-center relative overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-transform duration-150 group-hover:scale-105`}
                >
                  {/* Subtle One UI Lighting Sheen */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-[22px]" />

                  {/* Special Live Calendar Icon */}
                  {app.isLiveCalendar ? (
                    <div className="flex flex-col items-center justify-center w-full h-full text-slate-900 bg-white">
                      <div className="w-full bg-[#e12e36] text-white text-[9px] font-black uppercase text-center py-0.5 tracking-wider">
                        {todayDay}
                      </div>
                      <span className="text-xl font-black font-sans text-slate-900 leading-none pt-1">
                        {todayDate}
                      </span>
                    </div>
                  ) : (
                    Icon && (
                      <Icon
                        size={28}
                        className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    )
                  )}
                </div>

                {/* Samsung Circular Notification Badge */}
                {app.badge !== null && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#ff3b30] border-2 border-[#121c33] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md z-20 font-mono"
                  >
                    {app.badge}
                  </motion.div>
                )}
              </div>

              {/* Samsung One UI App Label */}
              <span className="text-[11px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-tight text-center truncate max-w-[66px]">
                {app.name}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
