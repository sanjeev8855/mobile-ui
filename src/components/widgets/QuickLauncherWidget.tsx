import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid, Plus, ExternalLink, Video, Music, Code, FileText, Share2, MapPin, MessageCircle, Bot, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const QuickLauncherWidget: React.FC = () => {
  const { apps, addApp } = useApp()
  const { cardClass, accent } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [appName, setAppName] = useState('')
  const [appUrl, setAppUrl] = useState('')
  const [category, setCategory] = useState<'Social' | 'Dev' | 'Media' | 'Utilities' | 'Work'>('Utilities')

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Youtube': return <Video size={22} className="text-rose-500" />
      case 'Music': return <Music size={22} className="text-emerald-400" />
      case 'Github': return <Code size={22} className="text-cyan-300" />
      case 'FileText': return <FileText size={22} className="text-slate-200" />
      case 'Twitter': return <Share2 size={22} className="text-sky-400" />
      case 'MapPin': return <MapPin size={22} className="text-emerald-400" />
      case 'MessageCircle': return <MessageCircle size={22} className="text-orange-500" />
      case 'Bot': return <Bot size={22} className="text-teal-400" />
      default: return <ExternalLink size={22} style={{ color: accent.value }} />
    }
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!appName.trim() || !appUrl.trim()) return
    let formattedUrl = appUrl.trim()
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }
    addApp({
      name: appName.trim(),
      url: formattedUrl,
      category,
      icon: 'ExternalLink',
      color: accent.value,
    })
    setAppName('')
    setAppUrl('')
    setIsModalOpen(false)
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
            <Grid size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Quick Shortcuts</h3>
            <p className="text-[11px] text-slate-400">Launch apps & web tools</p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap()
            setIsModalOpen(true)
          }}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition-colors"
          title="Add Shortcut"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Grid of 4 Columns */}
      <div className="grid grid-cols-4 gap-2.5 pt-1">
        {apps.map(app => (
          <a
            key={app.id}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playTap()}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-black/20 border border-white/5 hover:border-white/20 hover:scale-105 transition-all group select-none text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-md group-hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              {getAppIcon(app.icon)}
            </div>
            <span className="text-[10px] font-semibold text-slate-200 truncate w-full group-hover:text-white">
              {app.name}
            </span>
          </a>
        ))}
      </div>

      {/* Add App Modal */}
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
                <h4 className="text-sm font-bold text-white">Add App Shortcut</h4>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="flex flex-col gap-3 mt-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium">App / Site Name</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={e => setAppName(e.target.value)}
                    placeholder="e.g., Linear / Figma / Docs"
                    required
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Destination URL</label>
                  <input
                    type="text"
                    value={appUrl}
                    onChange={e => setAppUrl(e.target.value)}
                    placeholder="https://..."
                    required
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Category</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(['Utilities', 'Dev', 'Media', 'Social', 'Work'] as const).map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => { sound.playTap(); setCategory(c) }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                          category === c ? 'border-cyan-400 bg-cyan-500/20 text-white' : 'border-white/10 bg-white/5 text-slate-400'
                        }`}
                      >
                        {c}
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
                    Add Shortcut
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
