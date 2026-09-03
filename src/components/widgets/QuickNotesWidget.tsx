import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Plus, Pin, Trash2, Copy, Check, X, Tag } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const QuickNotesWidget: React.FC = () => {
  const { notes, addNote, deleteNote, togglePinNote } = useApp()
  const { cardClass, accent } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState<'Work' | 'Personal' | 'Ideas' | 'Urgent' | 'Quick'>('Quick')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>('All')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addNote({
      title: title.trim(),
      content: content.trim(),
      tag,
      pinned: false,
    })
    setTitle('')
    setContent('')
    setIsModalOpen(false)
  }

  const handleCopy = (text: string, id: string) => {
    sound.playTap()
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const tags: ('Work' | 'Personal' | 'Ideas' | 'Urgent' | 'Quick')[] = ['Quick', 'Work', 'Ideas', 'Personal', 'Urgent']

  const filteredNotes = selectedFilter === 'All'
    ? notes
    : notes.filter(n => n.tag === selectedFilter)

  const getTagColor = (t: string) => {
    switch (t) {
      case 'Work': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
      case 'Ideas': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'Urgent': return 'bg-rose-500/20 text-rose-300 border-rose-500/30'
      case 'Personal': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
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
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Quick Scratchpad</h3>
            <p className="text-[11px] text-slate-400">{notes.length} notes in vault</p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap()
            setIsModalOpen(true)
          }}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition-colors"
          title="New Note"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {['All', 'Quick', 'Work', 'Ideas', 'Personal', 'Urgent'].map(t => (
          <button
            key={t}
            onClick={() => setSelectedFilter(t)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
              selectedFilter === t
                ? 'bg-white/20 text-white font-semibold'
                : 'bg-black/20 text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className={`p-3 rounded-2xl border transition-all ${
              note.pinned ? 'bg-white/10 border-white/25 shadow-md' : 'bg-black/20 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md border ${getTagColor(note.tag)}`}>
                  {note.tag}
                </span>
                <h4 className="text-xs font-semibold text-white truncate m-0">{note.title}</h4>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => togglePinNote(note.id)}
                  className={`p-1 rounded-lg text-slate-400 hover:text-white ${note.pinned ? 'text-amber-400' : ''}`}
                >
                  <Pin size={11} className={note.pinned ? 'fill-amber-400' : ''} />
                </button>
                <button
                  onClick={() => handleCopy(`${note.title}\n\n${note.content}`, note.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                  title="Copy"
                >
                  {copiedId === note.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{note.content}</p>
            <div className="text-[9px] text-slate-500 mt-1 font-mono">{note.timestamp}</div>
          </div>
        ))}
      </div>

      {/* New Note Modal */}
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
                <h4 className="text-sm font-bold text-white">Capture Quick Note</h4>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="flex flex-col gap-3 mt-3">
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Note Title..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
                />

                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your quick thoughts or markdown..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                />

                <div>
                  <label className="text-xs text-slate-400 font-medium">Tag</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {tags.map(t => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => { sound.playTap(); setTag(t) }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                          tag === t ? 'border-cyan-400 bg-cyan-500/20 text-white scale-105' : 'border-white/10 bg-white/5 text-slate-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
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
                    Save Note
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
