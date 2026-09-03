import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid3X3, Search, Plus, ExternalLink, Video, Music, Code, FileText, Share2, MapPin, MessageCircle, Bot, X, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const AppsView: React.FC = () => {
  const { apps, addApp, deleteApp } = useApp()
  const { cardClass, accent } = useTheme()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [appName, setAppName] = useState('')
  const [appUrl, setAppUrl] = useState('')
  const [appCategory, setAppCategory] = useState<'Social' | 'Dev' | 'Media' | 'Utilities' | 'Work'>('Utilities')

  const categories = ['All', 'Media', 'Dev', 'Social', 'Work', 'Utilities']

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || app.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Youtube': return <Video size={24} className="text-rose-500" />
      case 'Music': return <Music size={24} className="text-emerald-400" />
      case 'Github': return <Code size={24} className="text-cyan-300" />
      case 'FileText': return <FileText size={24} className="text-slate-200" />
      case 'Twitter': return <Share2 size={24} className="text-sky-400" />
      case 'MapPin': return <MapPin size={24} className="text-emerald-400" />
      case 'MessageCircle': return <MessageCircle size={24} className="text-orange-500" />
      case 'Bot': return <Bot size={24} className="text-teal-400" />
      default: return <ExternalLink size={24} style={{ color: accent.value }} />
    }
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!appName.trim() || !appUrl.trim()) return
    let url = appUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    addApp({
      name: appName.trim(),
      url,
      category: appCategory,
      icon: 'ExternalLink',
      color: accent.value,
    })
    setAppName('')
    setAppUrl('')
    setIsAddOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Title & Add Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase opacity-75" style={{ color: accent.value }}>
            <Grid3X3 size={13} />
            <span>Applications & Tools</span>
          </div>
          <h2 className="text-xl font-bold text-white m-0">App Drawer</h2>
        </div>

        <button
          onClick={() => {
            sound.playTap()
            setIsAddOpen(true)
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-bold text-black shadow-md cursor-pointer"
          style={{ backgroundColor: accent.value }}
        >
          <Plus size={14} />
          <span>Add Tool</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search size={16} className="absolute left-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter apps, websites, tools..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 text-slate-400 hover:text-white">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === c
                ? 'bg-white/20 text-white font-semibold shadow-sm'
                : 'bg-black/20 text-slate-400 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filteredApps.map(app => (
          <motion.div
            key={app.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-3 rounded-3xl ${cardClass} flex flex-col items-center justify-between text-center gap-2 group relative border hover:border-white/25 transition-all`}
          >
            <button
              onClick={e => {
                e.stopPropagation()
                deleteApp(app.id)
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all"
              title="Remove"
            >
              <Trash2 size={11} />
            </button>

            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playTap()}
              className="flex flex-col items-center gap-2 w-full pt-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                {getAppIcon(app.icon)}
              </div>
              <div className="w-full">
                <div className="text-xs font-bold text-white truncate">{app.name}</div>
                <div className="text-[9px] text-slate-400 font-mono uppercase">{app.category}</div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>

      {/* Add App Modal */}
      <AnimatePresence>
        {isAddOpen && (
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
                <h4 className="text-sm font-bold text-white">Add App or Tool</h4>
                <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="flex flex-col gap-3 mt-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium">App Name</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={e => setAppName(e.target.value)}
                    placeholder="e.g., Discord / Claude"
                    required
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">URL</label>
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
                        onClick={() => { sound.playTap(); setAppCategory(c) }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                          appCategory === c ? 'border-cyan-400 bg-cyan-500/20 text-white' : 'border-white/10 bg-white/5 text-slate-400'
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
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-black"
                    style={{ backgroundColor: accent.value }}
                  >
                    Add App
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
