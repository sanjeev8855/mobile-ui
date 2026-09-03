import React, { useState, useEffect } from 'react'
import { Wifi, Battery, BatteryCharging, Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'

export const StatusBar: React.FC = () => {
  const { stats } = useApp()
  const { isOled, theme } = useTheme()
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={`w-full px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none tracking-tight font-medium z-30 transition-colors ${
        isOled ? 'text-white' : theme === 'retro-terminal' ? 'text-emerald-400' : 'text-slate-200'
      }`}
    >
      {/* Time & 5G Telemetry */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[13px] tracking-normal">{timeStr || '11:42'}</span>
        <span className="text-[10px] uppercase font-bold opacity-60 bg-white/10 px-1 py-0.5 rounded tracking-widest">
          5G+
        </span>
      </div>

      {/* Dynamic Status Icons */}
      <div className="flex items-center gap-2 text-xs">
        {/* Signal bars */}
        <div className="flex items-end gap-0.5 h-3">
          <div className="w-1 h-1.5 bg-current rounded-[0.5px]"></div>
          <div className="w-1 h-2 bg-current rounded-[0.5px]"></div>
          <div className="w-1 h-2.5 bg-current rounded-[0.5px]"></div>
          <div className="w-1 h-3 bg-current rounded-[0.5px]"></div>
        </div>

        {/* Wifi */}
        <Wifi size={13} className="opacity-90" />

        {/* Battery */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono font-medium">{stats.battery}%</span>
          {stats.isCharging ? (
            <div className="relative">
              <BatteryCharging size={16} className="text-emerald-400" />
            </div>
          ) : (
            <div className="relative flex items-center">
              <Battery size={16} className="opacity-90" />
              <div
                className="absolute left-[2px] top-[3.5px] bottom-[3.5px] bg-current rounded-[1px]"
                style={{ width: `${(stats.battery / 100) * 9}px` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
