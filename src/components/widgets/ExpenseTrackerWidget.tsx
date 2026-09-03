import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Plus, Coffee, Utensils, Car, Laptop, Film, Zap, Trash2, X, DollarSign } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const ExpenseTrackerWidget: React.FC = () => {
  const { expenses, addExpense, deleteExpense, preferences } = useApp()
  const { cardClass, accent } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'Coffee' | 'Food' | 'Transport' | 'Tech' | 'Entertainment' | 'Bills' | 'Other'>('Coffee')

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0)
  const dailyBudget = preferences.dailyBudget || 50
  const budgetPct = Math.min(100, Math.round((totalSpent / dailyBudget) * 100))

  const handleQuickAdd = (cat: typeof category, defaultTitle: string, defaultAmount: number) => {
    sound.playChime()
    addExpense({
      title: defaultTitle,
      amount: defaultAmount,
      category: cat,
      type: 'expense',
    })
  }

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed <= 0) return
    addExpense({
      title: title.trim() || category,
      amount: parsed,
      category,
      type: 'expense',
    })
    setAmount('')
    setTitle('')
    setIsModalOpen(false)
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Coffee': return <Coffee size={14} className="text-amber-400" />
      case 'Food': return <Utensils size={14} className="text-emerald-400" />
      case 'Transport': return <Car size={14} className="text-cyan-400" />
      case 'Tech': return <Laptop size={14} className="text-purple-400" />
      case 'Entertainment': return <Film size={14} className="text-rose-400" />
      default: return <Zap size={14} className="text-yellow-400" />
    }
  }

  return (
    <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3 relative transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
            style={{ color: accent.value }}
          >
            <Wallet size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Rapid Expense Log</h3>
            <p className="text-[11px] text-slate-400">
              ${totalSpent.toFixed(2)} spent of ${dailyBudget.toFixed(2)} target
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap()
            setIsModalOpen(true)
          }}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition-colors"
          title="Log Expense"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Budget Bar */}
      <div className="flex flex-col gap-1">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all ${
              budgetPct > 90 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
            }`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{budgetPct}% daily cap</span>
          <span>${Math.max(0, dailyBudget - totalSpent).toFixed(2)} remaining</span>
        </div>
      </div>

      {/* 1-Tap Quick Logger Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        <button
          onClick={() => handleQuickAdd('Coffee', 'Espresso', 4.50)}
          className="px-2.5 py-1.5 rounded-xl bg-black/30 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 text-xs text-slate-200 shrink-0"
        >
          <Coffee size={12} className="text-amber-400" />
          <span>+$4.50 Coffee</span>
        </button>
        <button
          onClick={() => handleQuickAdd('Food', 'Lunch Meal', 12.00)}
          className="px-2.5 py-1.5 rounded-xl bg-black/30 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 text-xs text-slate-200 shrink-0"
        >
          <Utensils size={12} className="text-emerald-400" />
          <span>+$12 Lunch</span>
        </button>
        <button
          onClick={() => handleQuickAdd('Transport', 'Transit', 3.00)}
          className="px-2.5 py-1.5 rounded-xl bg-black/30 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 text-xs text-slate-200 shrink-0"
        >
          <Car size={12} className="text-cyan-400" />
          <span>+$3 Transit</span>
        </button>
      </div>

      {/* Recent Entries */}
      <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
        {expenses.slice(0, 4).map(exp => (
          <div
            key={exp.id}
            className="px-2.5 py-1.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-white/5">{getCategoryIcon(exp.category)}</div>
              <div>
                <div className="text-xs font-semibold text-white">{exp.title}</div>
                <div className="text-[10px] text-slate-400">{exp.timestamp}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400">
                -${exp.amount.toFixed(2)}
              </span>
              <button
                onClick={() => deleteExpense(exp.id)}
                className="p-1 text-slate-500 hover:text-rose-400"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
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
                <h4 className="text-sm font-bold text-white">Log Custom Expense</h4>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleManualAdd} className="flex flex-col gap-3 mt-3">
                <div>
                  <label className="text-xs text-slate-400">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    required
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-lg font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400">Description</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Grocery Store"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-black"
                    style={{ backgroundColor: accent.value }}
                  >
                    Save Expense
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
