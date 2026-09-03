export type ThemeMode = 'cyberpunk' | 'oled' | 'glassmorphism' | 'sunset' | 'retro-terminal' | 'nordic'

export interface AccentColor {
  id: string
  name: string
  value: string
  glow: string
  border: string
  bg: string
}

export interface WidgetConfig {
  id: string
  name: string
  icon: string
  description: string
  enabled: boolean
  size: 'small' | 'medium' | 'large' | 'full'
  category: 'daily' | 'productivity' | 'utility' | 'system'
}

export interface Habit {
  id: string
  title: string
  icon: string
  color: string
  streak: number
  targetDays: number
  completedToday: boolean
  history: Record<string, boolean>
}

export interface NoteItem {
  id: string
  title: string
  content: string
  tag: 'Work' | 'Personal' | 'Ideas' | 'Urgent' | 'Quick'
  timestamp: string
  pinned?: boolean
}

export interface ExpenseItem {
  id: string
  title: string
  amount: number
  category: 'Food' | 'Transport' | 'Tech' | 'Coffee' | 'Entertainment' | 'Bills' | 'Other'
  timestamp: string
  type: 'expense' | 'income'
}

export interface QuickAppShortcut {
  id: string
  name: string
  category: 'Social' | 'Dev' | 'Media' | 'Utilities' | 'Work'
  icon: string
  url: string
  color: string
  badge?: string
}

export interface CalendarEvent {
  id: string
  title: string
  time: string
  location?: string
  color: string
  tag: string
}

export interface WeatherData {
  temp: number
  condition: string
  city: string
  high: number
  low: number
  humidity: number
  uvIndex: number
  airQuality: string
  hourly: { time: string; temp: number; icon: string }[]
}

export interface SystemStats {
  battery: number
  isCharging: boolean
  wifiStrength: number
  storageUsedGb: number
  storageTotalGb: number
  memoryUsedMb: number
  uptimeHours: number
  stepCount: number
  stepGoal: number
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface UserPreferences {
  userName: string
  tagline: string
  avatarUrl: string
  theme: ThemeMode
  customAccent: string
  blurIntensity: number
  hapticFeedback: boolean
  soundEffects: boolean
  ambientSound: string | null
  ambientVolume: number
  screenMode: 'mobile-frame' | 'fullscreen'
  deviceFrame: 'iphone16' | 'galaxys24' | 'minimal'
  activeTab: 'home' | 'widgets' | 'assistant' | 'apps' | 'settings'
  dailyBudget: number
  monthlyBudget: number
  focusTimerMinutes: number
}