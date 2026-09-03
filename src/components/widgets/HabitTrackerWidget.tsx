import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Check, Plus, X, Award, Sparkles, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const HabitTrackerWidget: React.FC = () => {
  const { habits, toggleHabit, addHabit, deleteHabit } = useApp()
  const { cardClass, accent, isOled } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newIcon, setNewIcon] = useState('??')
  const [newColor, setNewColor] = useState('#00f0ff')

  const completedCount = habits.filter(h => h.completedToday).length
  const totalCount = habits.length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addHabit({
      title: newTitle.trim(),
      icon: newIcon,
      color: newColor,
      targetDays: 7,
    })
    setNewTitle('')
    setIsModalOpen(false)
  }

  const iconOptions = ['??', '??', '??', '??', '??', '??', '??', '?', '??', '??']
  const colorOptions = ['#00f0ff', '#f43f5e', '#a855f7', '#10b981', '#f59e0b', '#38bdf8']

  return (
    <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3 relative transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
            style={{ color: accent.value }}
          >
            <Flame size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Habit Mastery</h3>
            <p className="text-[11px] text-slate-400">
              {completedCount} of {totalCount} completed ({progressPct}%)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap()
            setIsModalOpen(true)
          }}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition-colors"
          title="Add Habit"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            backgroundColor: accent.value,
            boxShadow: `0 0 10px ${accent.glow}`,
          }}
        />
      </div>

      {/* Habit Items Grid */}
      <div className="flex flex-col gap-2">
        {habits.map(habit => {
          return (
            <motion.div
              key={habit.id}
              layout
              className={`p-2.5 rounded-2xl flex items-center justify-between transition-all border ${
                habit.completedToday
                  ? 'bg-white/5 border-white/20'
                  : 'bg-black/20 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base">{habit.icon}</span>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-semibold truncate transition-all ${
                      habit.completedToday ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}
                  >
                    {habit.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span className="text-amber-400 font-bold">?? {habit.streak}d streak</span>
                  </div>
                </div>
              </div>

              {/* Check Action Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    habit.completedToday
                      ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-slate-400 border border-white/10'
                  }`}
                >
                  <Check size={16} className={habit.completedToday ? 'stroke-[3]' : ''} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-slate-900 border border-white/20 rounded-3xl p-5 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="text-sm font-bold text-white">Create Daily Habit</h4>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full bg-white/10 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="flex flex-col gap-4 mt-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Habit Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g., Read 15 mins daily"
                    required
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Choose Icon</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {iconOptions.map(ico => (
                      <button
                        type="button"
                        key={ico}
                        onClick={() => { sound.playTap(); setNewIcon(ico) }}
                        className={`w-9 h-9 rounded-xl text-base flex items-center justify-center border transition-all ${
                          newIcon === ico ? 'border-cyan-400 bg-cyan-500/20 scale-110' : 'border-white/10 bg-white/5'
                        }`}
                      >
                        {ico}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-semibold text-slate-300 hover:bg-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-black"
                    style={{ backgroundColor: accent.value }}
                  >
                    Add Habit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
