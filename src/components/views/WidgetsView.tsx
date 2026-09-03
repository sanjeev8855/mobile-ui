import React from 'react'
import { motion } from 'framer-motion'
import { LayoutGrid, ArrowUp, ArrowDown, Eye, EyeOff, Sparkles, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const WidgetsView: React.FC = () => {
  const { widgets, toggleWidget, reorderWidgets } = useApp()
  const { cardClass, accent } = useTheme()

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      sound.playTap()
      reorderWidgets(index, index - 1)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < widgets.length - 1) {
      sound.playTap()
      reorderWidgets(index, index + 1)
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Title */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase opacity-75" style={{ color: accent.value }}>
          <LayoutGrid size={13} />
          <span>Layout Customizer</span>
        </div>
        <h2 className="text-xl font-bold text-white m-0">Widget Studio</h2>
        <p className="text-xs text-slate-400">
          Customize, reorder, and toggle your home screen widgets
        </p>
      </div>

      {/* Widget List */}
      <div className="flex flex-col gap-2.5">
        {widgets.map((widget, index) => (
          <motion.div
            key={widget.id}
            layout
            className={`p-3.5 rounded-3xl ${cardClass} flex items-center justify-between border transition-all ${
              widget.enabled ? 'border-white/15' : 'border-white/5 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0"
                style={{ color: widget.enabled ? accent.value : undefined }}
              >
                <LayoutGrid size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white truncate m-0">{widget.name}</h4>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                    {widget.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{widget.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {/* Reorder Buttons */}
              <div className="flex flex-col gap-1">
                <button
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20"
                >
                  <ArrowUp size={11} />
                </button>
                <button
                  disabled={index === widgets.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20"
                >
                  <ArrowDown size={11} />
                </button>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleWidget(widget.id)}
                className={`w-12 h-7 rounded-full p-1 transition-colors flex items-center cursor-pointer ${
                  widget.enabled ? 'justify-end' : 'justify-start bg-white/10'
                }`}
                style={{ backgroundColor: widget.enabled ? accent.value : undefined }}
              >
                <motion.div
                  layout
                  className="w-5 h-5 rounded-full bg-black shadow-md flex items-center justify-center text-[9px]"
                >
                  {widget.enabled ? <Check size={10} className="text-white" /> : <EyeOff size={10} className="text-slate-400" />}
                </motion.div>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
