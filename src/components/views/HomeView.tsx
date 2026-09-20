import React from 'react'
import { motion } from 'framer-motion'
import { WeatherAgendaWidget } from '../widgets/WeatherAgendaWidget'
import { HabitTrackerWidget } from '../widgets/HabitTrackerWidget'
import { FocusPomodoroWidget } from '../widgets/FocusPomodoroWidget'
import { AICapsuleWidget } from '../widgets/AICapsuleWidget'
import { QuickNotesWidget } from '../widgets/QuickNotesWidget'
import { ExpenseTrackerWidget } from '../widgets/ExpenseTrackerWidget'
import { QuickLauncherWidget } from '../widgets/QuickLauncherWidget'
import { MediaPlayerWidget } from '../widgets/MediaPlayerWidget'
import { SystemTelemetryWidget } from '../widgets/SystemTelemetryWidget'
import { SamsungWeatherClockWidget } from '../widgets/SamsungWeatherClockWidget'
import { SamsungAppGrid } from '../widgets/SamsungAppGrid'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'

export const HomeView: React.FC = () => {
  const { widgets } = useApp()
  const { isSamsung } = useTheme()

  const renderWidget = (id: string) => {
    switch (id) {
      case 'weather_agenda': return <WeatherAgendaWidget />
      case 'habits': return <HabitTrackerWidget />
      case 'focus_timer': return <FocusPomodoroWidget />
      case 'ai_capsule': return <AICapsuleWidget />
      case 'quick_notes': return <QuickNotesWidget />
      case 'expenses': return <ExpenseTrackerWidget />
      case 'app_launcher': return <QuickLauncherWidget />
      case 'media_player': return <MediaPlayerWidget />
      case 'system_telemetry': return <SystemTelemetryWidget />
      default: return null
    }
  }

  const enabledWidgets = widgets.filter(w => w.enabled)

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Samsung One UI Signature Home: Clock & 4x4 Galaxy Apps */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3"
      >
        <SamsungWeatherClockWidget />
        <SamsungAppGrid />
        <div className="flex items-center gap-3 py-1">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Galaxy Hub & Widgets</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>
      </motion.div>
      {enabledWidgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
        >
          {renderWidget(widget.id)}
        </motion.div>
      ))}
    </div>
  )
}
