import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageSquare, Compass, Music, Mail, Calendar, Camera, Image, CloudSun, Clock, FileText, Flame, Wallet, Sparkles, MapPin, Settings, X, ExternalLink } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const ClassicAppGrid: React.FC = () => {
  const { setActiveTab, habits, notes, expenses, showIslandNotification } = useApp()
  const { theme } = useTheme()
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const uncompletedHabits = habits.filter(h => !h.completedToday).length
  const todayDate = new Date().getDate()
  const todayDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()]

  const classicApps = [
    {
      id: 'phone',
      name: 'Phone',
      badge: null,
      icon: Phone,
      gradient: 'from-[#34c759] to-[#248a3d]',
      action: () => {
        sound.playBip()
        showIslandNotification('Phone Dialer', 'Ready for voice calling', 'Phone', '#34c759')
      },
    },
    {
      id: 'messages',
      name: 'Messages',
      badge: 2,
      icon: MessageSquare,
      gradient: 'from-[#30d158] to-[#1eb345]',
      action: () => {
        sound.playTap()
        setActiveTab('assistant')
      },
    },
    {
      id: 'safari',
      name: 'Safari',
      badge: null,
      icon: Compass,
      gradient: 'from-[#007aff] to-[#0051a8]',
      action: () => {
        sound.playTap()
        setActiveTab('apps')
      },
    },
    {
      id: 'music',
      name: 'Music',
      badge: null,
      icon: Music,
      gradient: 'from-[#fa2d48] to-[#c71830]',
      action: () => {
        sound.playTap()
        setActiveTab('widgets')
      },
    },
    {
      id: 'mail',
      name: 'Mail',
      badge: 4,
      icon: Mail,
      gradient: 'from-[#147efb] to-[#0a5ec2]',
      action: () => {
        sound.playBip()
        showIslandNotification('Inbox Synced', '4 unread messages', 'Mail', '#147efb')
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
      id: 'camera',
      name: 'Camera',
      badge: null,
      icon: Camera,
      gradient: 'from-[#434853] to-[#21242b]',
      action: () => {
        sound.playBip()
        showIslandNotification('Camera Shutter', 'Ready to snap photos', 'Camera', '#ffffff')
      },
    },
    {
      id: 'photos',
      name: 'Photos',
      badge: null,
      icon: Image,
      gradient: 'from-white to-slate-100',
      action: () => {
        sound.playTap()
        showIslandNotification('Photo Vault', '342 memories stored locally', 'Image', '#ff9500')
      },
    },
    {
      id: 'weather',
      name: 'Weather',
      badge: null,
      icon: CloudSun,
      gradient: 'from-[#38bdf8] to-[#0284c7]',
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
      gradient: 'from-[#1c1c1e] to-black',
      action: () => {
        sound.playTap()
        setActiveTab('widgets')
      },
    },
    {
      id: 'notes',
      name: 'Notes',
      badge: notes.length > 0 ? notes.length : null,
      icon: FileText,
      gradient: 'from-[#f59e0b] to-[#d97706]',
      action: () => {
        sound.playTap()
        setActiveTab('widgets')
      },
    },
    {
      id: 'habits',
      name: 'Habits',
      badge: uncompletedHabits > 0 ? uncompletedHabits : null,
      icon: Flame,
      gradient: 'from-[#ff9500] to-[#e06600]',
      action: () => {
        sound.playTap()
        setActiveTab('home')
      },
    },
    {
      id: 'wallet',
      name: 'Wallet',
      badge: null,
      icon: Wallet,
      gradient: 'from-[#2c2c2e] to-[#121212]',
      action: () => {
        sound.playTap()
        setActiveTab('widgets')
      },
    },
    {
      id: 'copilot',
      name: 'Copilot',
      badge: null,
      icon: Sparkles,
      gradient: 'from-[#8b5cf6] via-[#ec4899] to-[#3b82f6]',
      action: () => {
        sound.playTap()
        setActiveTab('assistant')
      },
    },
    {
      id: 'maps',
      name: 'Maps',
      badge: null,
      icon: MapPin,
      gradient: 'from-[#34c759] to-[#007aff]',
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
      gradient: 'from-[#8e8e93] to-[#636366]',
      action: () => {
        sound.playTap()
        setActiveTab('settings')
      },
    },
  ]

  const isVintage = theme === 'classic-vintage'

  return (
    <div className="w-full pt-1 pb-3">
      {/* 4x4 Iconic Classic App Grid */}
      <div className="grid grid-cols-4 gap-y-4 gap-x-3 justify-items-center select-none">
        {classicApps.map(app => {
          const Icon = app.icon

          return (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.88 }}
              onClick={app.action}
              className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer group"
            >
              {/* Squircle App Icon with Reflection and Depth */}
              <div className="relative">
                <div
                  className={`w-[58px] h-[58px] rounded-[18px] bg-gradient-to-b ${app.gradient} flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] ${
                    isVintage
                      ? 'shadow-[0_4px_10px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-black/40'
                      : 'shadow-[0_5px_15px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                  }`}
                >
                  {/* Subtle Glossy Curvature Reflection */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[18px]" />

                  {/* Special Live Calendar Icon */}
                  {app.isLiveCalendar ? (
                    <div className="flex flex-col items-center justify-center w-full h-full text-slate-900">
                      <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">
                        {todayDay}
                      </span>
                      <span className="text-xl font-black font-sans -mt-0.5">
                        {todayDate}
                      </span>
                    </div>
                  ) : (
                    Icon && (
                      <Icon
                        size={28}
                        className={`transition-transform duration-200 group-hover:scale-105 ${
                          app.id === 'photos'
                            ? 'text-amber-500'
                            : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                        }`}
                      />
                    )
                  )}
                </div>

                {/* Notification Badge Bubble */}
                {app.badge !== null && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md z-20 font-mono"
                  >
                    {app.badge}
                  </motion.div>
                )}
              </div>

              {/* App Label */}
              <span className="text-[11px] font-medium text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight text-center truncate max-w-[64px]">
                {app.name}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
