import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { sound } from '../utils/soundSynthesizer'
import type {
  WidgetConfig,
  Habit,
  NoteItem,
  ExpenseItem,
  QuickAppShortcut,
  CalendarEvent,
  WeatherData,
  SystemStats,
  AIMessage,
  UserPreferences,
} from '../types'

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'weather_agenda', name: 'Command & Agenda', icon: 'SunMedium', description: 'Greeting, live weather, and upcoming schedule', enabled: true, size: 'large', category: 'daily' },
  { id: 'habits', name: 'Habit & Streak Mastery', icon: 'Flame', description: 'Daily habits with celebration confetti', enabled: true, size: 'large', category: 'productivity' },
  { id: 'focus_timer', name: 'Focus & Soundscapes', icon: 'Timer', description: 'Pomodoro timer with synthesized ambient audio', enabled: true, size: 'medium', category: 'productivity' },
  { id: 'ai_capsule', name: 'AI Copilot Capsule', icon: 'Sparkles', description: 'Instant AI assistant with smart prompt actions', enabled: true, size: 'medium', category: 'productivity' },
  { id: 'quick_notes', name: 'Instant Scratchpad', icon: 'FileText', description: 'Color-coded fast notes and ideas', enabled: true, size: 'medium', category: 'utility' },
  { id: 'expenses', name: '2-Tap Expense Logger', icon: 'Wallet', description: 'Rapid transaction tracking and daily budget', enabled: true, size: 'medium', category: 'utility' },
  { id: 'media_player', name: 'Audio & Visualizer', icon: 'Music', description: 'Ambient music player with sound waves', enabled: true, size: 'medium', category: 'utility' },
  { id: 'system_telemetry', name: 'System Telemetry & Steps', icon: 'Activity', description: 'Pedometer, RAM, Battery, and Uptime', enabled: true, size: 'medium', category: 'system' },
  { id: 'app_launcher', name: 'Quick App Dock', icon: 'Grid', description: 'Categorized app shortcuts and deep links', enabled: true, size: 'large', category: 'daily' },
]

const DEFAULT_HABITS: Habit[] = [
  { id: '1', title: 'Hydrate 2.5L Water', icon: '??', color: '#00f0ff', streak: 12, targetDays: 7, completedToday: true, history: { '2026-08-28': true, '2026-08-29': true } },
  { id: '2', title: '30m Workout / Gym', icon: '???', color: '#f43f5e', streak: 5, targetDays: 5, completedToday: false, history: { '2026-08-28': true } },
  { id: '3', title: 'Read 20 Pages', icon: '??', color: '#a855f7', streak: 8, targetDays: 7, completedToday: false, history: { '2026-08-28': true } },
  { id: '4', title: '10m Mindful Meditation', icon: '??', color: '#10b981', streak: 14, targetDays: 7, completedToday: true, history: { '2026-08-28': true, '2026-08-29': true } },
  { id: '5', title: 'Code Personal Project', icon: '??', color: '#f59e0b', streak: 21, targetDays: 7, completedToday: true, history: { '2026-08-28': true, '2026-08-29': true } },
]

const DEFAULT_NOTES: NoteItem[] = [
  { id: '1', title: 'Mobile UI Architecture', content: 'Built fully responsive personal mobile interface with offline audio synthesis, OLED stealth theme, and dynamic widgets.', tag: 'Work', timestamp: '10:45 AM', pinned: true },
  { id: '2', title: 'Weekend Project Ideas', content: 'Explore local on-device LLM with WebGPU and build an interactive 3D spatial dashboard.', tag: 'Ideas', timestamp: 'Yesterday', pinned: true },
  { id: '3', title: 'Grocery & Essentials', content: 'Almond milk, Ethiopian light roast coffee beans, Greek yogurt, fresh blueberries.', tag: 'Personal', timestamp: '2 days ago' },
]

const DEFAULT_EXPENSES: ExpenseItem[] = [
  { id: '1', title: 'Artisan Espresso', amount: 4.50, category: 'Coffee', timestamp: '09:15 AM', type: 'expense' },
  { id: '2', title: 'Healthy Lunch Bowl', amount: 14.20, category: 'Food', timestamp: 'Yesterday', type: 'expense' },
  { id: '3', title: 'Subway Pass Refill', amount: 30.00, category: 'Transport', timestamp: '2 days ago', type: 'expense' },
  { id: '4', title: 'Cloud Server Hosting', amount: 12.00, category: 'Tech', timestamp: '3 days ago', type: 'expense' },
]

const DEFAULT_APPS: QuickAppShortcut[] = [
  { id: '1', name: 'YouTube', category: 'Media', icon: 'Youtube', url: 'https://youtube.com', color: '#ff0033' },
  { id: '2', name: 'Spotify', category: 'Media', icon: 'Music', url: 'https://open.spotify.com', color: '#1db954' },
  { id: '3', name: 'GitHub', category: 'Dev', icon: 'Github', url: 'https://github.com', color: '#ffffff' },
  { id: '4', name: 'Notion', category: 'Work', icon: 'FileText', url: 'https://notion.so', color: '#ffffff' },
  { id: '5', name: 'X / Twitter', category: 'Social', icon: 'Twitter', url: 'https://x.com', color: '#1da1f2' },
  { id: '6', name: 'Maps', category: 'Utilities', icon: 'MapPin', url: 'https://maps.google.com', color: '#34a853' },
  { id: '7', name: 'Reddit', category: 'Social', icon: 'MessageCircle', url: 'https://reddit.com', color: '#ff4500' },
  { id: '8', name: 'ChatGPT', category: 'Dev', icon: 'Bot', url: 'https://chatgpt.com', color: '#10a37f' },
]

const DEFAULT_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Product Architecture Sync', time: '12:00 PM - 12:45 PM', location: 'Google Meet', color: '#00f0ff', tag: 'Work' },
  { id: '2', title: 'Deep Work: UI Polish & Audio Synth', time: '02:30 PM - 04:30 PM', color: '#a855f7', tag: 'Focus' },
  { id: '3', title: 'Gym & Cardio Session', time: '06:00 PM - 07:00 PM', location: 'Fitness Hub', color: '#f43f5e', tag: 'Health' },
]

const DEFAULT_WEATHER: WeatherData = {
  temp: 24,
  condition: 'Partly Sunny',
  city: 'Bangalore, IN',
  high: 28,
  low: 19,
  humidity: 62,
  uvIndex: 5,
  airQuality: 'Good (AQI 42)',
  hourly: [
    { time: 'Now', temp: 24, icon: 'Sun' },
    { time: '1 PM', temp: 27, icon: 'Sun' },
    { time: '3 PM', temp: 28, icon: 'Sun' },
    { time: '5 PM', temp: 26, icon: 'CloudSun' },
    { time: '7 PM', temp: 23, icon: 'Moon' },
    { time: '9 PM', temp: 21, icon: 'Moon' },
  ],
}

const DEFAULT_STATS: SystemStats = {
  battery: 84,
  isCharging: false,
  wifiStrength: 95,
  storageUsedGb: 118,
  storageTotalGb: 256,
  memoryUsedMb: 3840,
  uptimeHours: 142,
  stepCount: 6840,
  stepGoal: 10000,
}

const DEFAULT_PREFERENCES: UserPreferences = {
  userName: 'Sanje',
  tagline: 'Design & Code Enthusiast',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  theme: 'cyberpunk',
  customAccent: '#00f0ff',
  blurIntensity: 20,
  hapticFeedback: true,
  soundEffects: true,
  ambientSound: null,
  ambientVolume: 0.25,
  screenMode: 'mobile-frame',
  deviceFrame: 'iphone16',
  activeTab: 'home',
  dailyBudget: 50.00,
  monthlyBudget: 1200.00,
  focusTimerMinutes: 25,
}

interface IslandNotification {
  id: string
  title: string
  subtitle?: string
  icon?: string
  color?: string
}

interface AppContextType {
  widgets: WidgetConfig[]
  toggleWidget: (id: string) => void
  reorderWidgets: (fromIndex: number, toIndex: number) => void
  habits: Habit[]
  toggleHabit: (id: string) => void
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'history'>) => void
  deleteHabit: (id: string) => void
  notes: NoteItem[]
  addNote: (note: Omit<NoteItem, 'id' | 'timestamp'>) => void
  deleteNote: (id: string) => void
  togglePinNote: (id: string) => void
  expenses: ExpenseItem[]
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'timestamp'>) => void
  deleteExpense: (id: string) => void
  apps: QuickAppShortcut[]
  addApp: (app: Omit<QuickAppShortcut, 'id'>) => void
  deleteApp: (id: string) => void
  events: CalendarEvent[]
  weather: WeatherData
  stats: SystemStats
  preferences: UserPreferences
  updatePreferences: (updates: Partial<UserPreferences>) => void
  // Focus Timer
  focusTimeLeft: number
  isFocusRunning: boolean
  focusMode: 'focus' | 'shortBreak' | 'longBreak'
  toggleFocusTimer: () => void
  resetFocusTimer: () => void
  setFocusMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void
  // AI Messages
  aiMessages: AIMessage[]
  isAITyping: boolean
  sendAIMessage: (text: string) => void
  clearAIMessages: () => void
  // Dynamic Island
  islandNotification: IslandNotification | null
  showIslandNotification: (title: string, subtitle?: string, icon?: string, color?: string) => void
  // Command palette
  isCommandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  // Active Navigation Tab
  activeTab: 'home' | 'widgets' | 'assistant' | 'apps' | 'settings'
  setActiveTab: (tab: 'home' | 'widgets' | 'assistant' | 'apps' | 'settings') => void
  // Ambient Sound
  currentAmbient: string | null
  setAmbientSound: (type: 'rain' | 'waves' | 'forest' | 'whitenoise' | null) => void
  ambientVolume: number
  setAmbientVolume: (vol: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('mobile_ui_widgets')
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS
  })

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('mobile_ui_habits')
    return saved ? JSON.parse(saved) : DEFAULT_HABITS
  })

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('mobile_ui_notes')
    return saved ? JSON.parse(saved) : DEFAULT_NOTES
  })

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('mobile_ui_expenses')
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES
  })

  const [apps, setApps] = useState<QuickAppShortcut[]>(() => {
    const saved = localStorage.getItem('mobile_ui_apps')
    return saved ? JSON.parse(saved) : DEFAULT_APPS
  })

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('mobile_ui_prefs')
    return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES
  })

  const [activeTab, setActiveTab] = useState<'home' | 'widgets' | 'assistant' | 'apps' | 'settings'>('home')
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [islandNotification, setIslandNotification] = useState<IslandNotification | null>(null)

  // Focus Timer State
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60)
  const [isFocusRunning, setIsFocusRunning] = useState(false)
  const [focusMode, setFocusModeState] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus')

  // Ambient sound
  const [currentAmbient, setCurrentAmbient] = useState<string | null>(null)
  const [ambientVolume, setAmbientVolState] = useState(0.25)

  // AI Chat
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello Sanje! I'm your on-device AI Copilot. How can I optimize your day today? You can ask me to summarize your daily agenda, generate new project concepts, or draft quick replies.",
      timestamp: '10:00 AM',
    },
  ])
  const [isAITyping, setIsAITyping] = useState(false)

  // Save to LocalStorage
  useEffect(() => { localStorage.setItem('mobile_ui_widgets', JSON.stringify(widgets)) }, [widgets])
  useEffect(() => { localStorage.setItem('mobile_ui_habits', JSON.stringify(habits)) }, [habits])
  useEffect(() => { localStorage.setItem('mobile_ui_notes', JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem('mobile_ui_expenses', JSON.stringify(expenses)) }, [expenses])
  useEffect(() => { localStorage.setItem('mobile_ui_apps', JSON.stringify(apps)) }, [apps])
  useEffect(() => { localStorage.setItem('mobile_ui_prefs', JSON.stringify(preferences)) }, [preferences])

  // Focus Timer countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isFocusRunning && focusTimeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimeLeft(t => t - 1)
      }, 1000)
    } else if (focusTimeLeft === 0 && isFocusRunning) {
      setIsFocusRunning(false)
      sound.playAlarm()
      showIslandNotification('Focus Session Complete!', 'Time for a rejuvenating break ??', 'CheckCircle', '#10b981')
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isFocusRunning, focusTimeLeft])

  const toggleFocusTimer = () => {
    sound.playTap()
    setIsFocusRunning(r => !r)
  }

  const resetFocusTimer = () => {
    sound.playTap()
    setIsFocusRunning(false)
    if (focusMode === 'focus') setFocusTimeLeft(25 * 60)
    else if (focusMode === 'shortBreak') setFocusTimeLeft(5 * 60)
    else setFocusTimeLeft(15 * 60)
  }

  const setFocusMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    sound.playTap()
    setFocusModeState(mode)
    setIsFocusRunning(false)
    if (mode === 'focus') setFocusTimeLeft(25 * 60)
    else if (mode === 'shortBreak') setFocusTimeLeft(5 * 60)
    else setFocusTimeLeft(15 * 60)
  }

  const setAmbientSound = (type: 'rain' | 'waves' | 'forest' | 'whitenoise' | null) => {
    if (type === null || currentAmbient === type) {
      sound.stopAmbient()
      setCurrentAmbient(null)
    } else {
      sound.startAmbient(type, ambientVolume)
      setCurrentAmbient(type)
      showIslandNotification(`Ambient: ${type.toUpperCase()}`, 'Playing soothing soundscape ??', 'Headphones', '#00f0ff')
    }
  }

  const setAmbientVolume = (vol: number) => {
    setAmbientVolState(vol)
    sound.setAmbientVolume(vol)
  }

  const toggleWidget = (id: string) => {
    sound.playTap()
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w))
  }

  const reorderWidgets = (fromIndex: number, toIndex: number) => {
    setWidgets(prev => {
      const copy = [...prev]
      const [removed] = copy.splice(fromIndex, 1)
      copy.splice(toIndex, 0, removed)
      return copy
    })
  }

  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const willComplete = !h.completedToday
          if (willComplete) {
            sound.playChime()
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#00f0ff', '#a855f7', '#10b981', '#f59e0b', '#f43f5e'],
            })
            showIslandNotification(`Habit Completed!`, `${h.title} (?? ${h.streak + 1} streak)`, 'Flame', '#f59e0b')
            return {
              ...h,
              completedToday: true,
              streak: h.streak + 1,
              history: { ...h.history, [new Date().toISOString().split('T')[0]]: true },
            }
          } else {
            sound.playTap()
            return {
              ...h,
              completedToday: false,
              streak: Math.max(0, h.streak - 1),
            }
          }
        }
        return h
      })
    )
  }

  const addHabit = (newH: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'history'>) => {
    sound.playBip()
    const habit: Habit = {
      ...newH,
      id: Date.now().toString(),
      streak: 0,
      completedToday: false,
      history: {},
    }
    setHabits(prev => [habit, ...prev])
  }

  const deleteHabit = (id: string) => {
    sound.playTap()
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const addNote = (noteData: Omit<NoteItem, 'id' | 'timestamp'>) => {
    sound.playBip()
    const newNote: NoteItem = {
      ...noteData,
      id: Date.now().toString(),
      timestamp: 'Just now',
    }
    setNotes(prev => [newNote, ...prev])
    showIslandNotification('Note Saved', newNote.title, 'FileText', '#a855f7')
  }

  const deleteNote = (id: string) => {
    sound.playTap()
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const togglePinNote = (id: string) => {
    sound.playTap()
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  const addExpense = (expData: Omit<ExpenseItem, 'id' | 'timestamp'>) => {
    sound.playChime()
    const newExp: ExpenseItem = {
      ...expData,
      id: Date.now().toString(),
      timestamp: 'Just now',
    }
    setExpenses(prev => [newExp, ...prev])
    showIslandNotification(`Logged $${newExp.amount.toFixed(2)}`, `${newExp.category} - ${newExp.title}`, 'Wallet', '#10b981')
  }

  const deleteExpense = (id: string) => {
    sound.playTap()
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const addApp = (appData: Omit<QuickAppShortcut, 'id'>) => {
    sound.playBip()
    const newApp: QuickAppShortcut = {
      ...appData,
      id: Date.now().toString(),
    }
    setApps(prev => [...prev, newApp])
  }

  const deleteApp = (id: string) => {
    sound.playTap()
    setApps(prev => prev.filter(a => a.id !== id))
  }

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }

  const showIslandNotification = (title: string, subtitle?: string, icon?: string, color?: string) => {
    const id = Date.now().toString()
    setIslandNotification({ id, title, subtitle, icon, color })
    setTimeout(() => {
      setIslandNotification(cur => (cur?.id === id ? null : cur))
    }, 4000)
  }

  const sendAIMessage = (text: string) => {
    if (!text.trim()) return
    sound.playTap()
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setAiMessages(prev => [...prev, userMsg])
    setIsAITyping(true)

    setTimeout(() => {
      let replyContent = "I've analyzed your daily schedule, habits, and notes."
      const lower = text.toLowerCase()

      if (lower.includes('summar') || lower.includes('day') || lower.includes('agenda')) {
        replyContent = `?? **Daily Summary for Sanje**:\n- **Events**: Product Sync at 12:00 PM, Focus Block at 2:30 PM.\n- **Habits**: 3 of 5 completed (60% streak progress ??).\n- **Expenses**: Spent $48.70 / $50.00 daily budget (97% used).\n- **Recommendation**: Take a 15-min walk to hit your 10,000 step goal!`
      } else if (lower.includes('priority') || lower.includes('priorities') || lower.includes('todo')) {
        replyContent = `? **Top 3 High-Impact Priorities**:\n1. ?? Finish the Mobile UI system architecture.\n2. ??? Complete your 30-minute workout before 7 PM.\n3. ?? Wind down with 10m mindful breathing.`
      } else if (lower.includes('idea') || lower.includes('brainstorm')) {
        replyContent = `?? **Smart Feature Concepts**:\n- **AI Context Snapper**: Snap a photo or screenshot to instantly parse action items into your Scratchpad.\n- **Haptic Biofeedback**: Gentle pulsing cadence for 4-7-8 breathing exercises.\n- **Autonomous Daily Debrief**: Evening audio memo summarizing all habits, expenses, and notes logged.`
      } else if (lower.includes('breath') || lower.includes('zen') || lower.includes('relax')) {
        replyContent = `?? **1-Minute Centering Exercise**:\n- Inhale slowly for 4 seconds (smell the forest ??)\n- Hold gently for 4 seconds\n- Exhale deeply for 6 seconds (release all tension ??)\n*Tip: Start the Ambient Rain generator in the Focus tab for deeper immersion!*`
      } else {
        replyContent = `I understand you're asking about "${text}". All your data is encrypted and saved offline in your local vault. Would you like me to create a quick note or schedule a reminder for this?`
      }

      const botMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setAiMessages(prev => [...prev, botMsg])
      setIsAITyping(false)
      sound.playBip()
    }, 900)
  }

  const clearAIMessages = () => {
    sound.playTap()
    setAiMessages([])
  }

  return (
    <AppContext.Provider
      value={{
        widgets,
        toggleWidget,
        reorderWidgets,
        habits,
        toggleHabit,
        addHabit,
        deleteHabit,
        notes,
        addNote,
        deleteNote,
        togglePinNote,
        expenses,
        addExpense,
        deleteExpense,
        apps,
        addApp,
        deleteApp,
        events: DEFAULT_EVENTS,
        weather: DEFAULT_WEATHER,
        stats: DEFAULT_STATS,
        preferences,
        updatePreferences,
        focusTimeLeft,
        isFocusRunning,
        focusMode,
        toggleFocusTimer,
        resetFocusTimer,
        setFocusMode,
        aiMessages,
        isAITyping,
        sendAIMessage,
        clearAIMessages,
        islandNotification,
        showIslandNotification,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        activeTab,
        setActiveTab,
        currentAmbient,
        setAmbientSound,
        ambientVolume,
        setAmbientVolume,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
