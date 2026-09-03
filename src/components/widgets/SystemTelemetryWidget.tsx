import React from 'react'
import { Activity, Footprints, HardDrive, Cpu, BatteryCharging, Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'

export const SystemTelemetryWidget: React.FC = () => {
  const { stats } = useApp()
  const { cardClass, accent } = useTheme()

  const stepPct = Math.min(100, Math.round((stats.stepCount / stats.stepGoal) * 100))
  const storagePct = Math.round((stats.storageUsedGb / stats.storageTotalGb) * 100)

  return (
    <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3 relative transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
            style={{ color: accent.value }}
          >
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Device Telemetry</h3>
            <p className="text-[11px] text-slate-400">Sensors & hardware health</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          HEALTH: OPTIMAL
        </span>
      </div>

      {/* Grid of 2 Stats Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Step Pedometer Card */}
        <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Footprints size={16} className="text-amber-400" />
            <span className="text-[10px] font-mono text-slate-400">{stepPct}%</span>
          </div>

          <div className="mt-2">
            <div className="text-lg font-bold font-mono text-white tracking-tight">
              {stats.stepCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">of {stats.stepGoal.toLocaleString()} steps</div>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${stepPct}%` }}
            />
          </div>
        </div>

        {/* Local Storage Card */}
        <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <HardDrive size={16} className="text-cyan-400" />
            <span className="text-[10px] font-mono text-slate-400">{storagePct}%</span>
          </div>

          <div className="mt-2">
            <div className="text-lg font-bold font-mono text-white tracking-tight">
              {stats.storageUsedGb} GB
            </div>
            <div className="text-[10px] text-slate-400">of {stats.storageTotalGb} GB used</div>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all"
              style={{ width: `${storagePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hardware Telemetry Row */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/10">
        <div className="flex items-center gap-2 text-slate-300">
          <Cpu size={14} className="text-purple-400" />
          <span className="text-[11px] text-slate-400">RAM:</span>
          <span className="font-mono font-semibold text-white">{(stats.memoryUsedMb / 1024).toFixed(1)} / 8 GB</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Zap size={14} className="text-amber-400" />
          <span className="text-[11px] text-slate-400">Uptime:</span>
          <span className="font-mono font-semibold text-white">{stats.uptimeHours} hrs</span>
        </div>
      </div>
    </div>
  )
}
