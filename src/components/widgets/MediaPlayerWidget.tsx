import React, { useState, useEffect } from 'react'
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Sparkles, Disc } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { sound } from '../../utils/soundSynthesizer'

export const MediaPlayerWidget: React.FC = () => {
  const { currentAmbient, setAmbientSound } = useApp()
  const { cardClass, accent } = useTheme()
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [progress, setProgress] = useState(38)

  const tracks = [
    { title: 'Synthwave Nightfall', artist: 'Cyber Resonance', duration: '3:45', ambient: 'whitenoise' as const },
    { title: 'Rainy Cafe in Tokyo', artist: 'Lo-Fi Ambient', duration: '4:12', ambient: 'rain' as const },
    { title: 'Bioluminescent Waves', artist: 'Chill Drift', duration: '5:00', ambient: 'waves' as const },
  ]

  const currentTrack = tracks[trackIndex]

  const togglePlay = () => {
    sound.playTap()
    if (!isPlaying) {
      setIsPlaying(true)
      setAmbientSound(currentTrack.ambient)
    } else {
      setIsPlaying(false)
      setAmbientSound(null)
    }
  }

  const handleNext = () => {
    sound.playTap()
    const nextIdx = (trackIndex + 1) % tracks.length
    setTrackIndex(nextIdx)
    setProgress(0)
    if (isPlaying) {
      setAmbientSound(tracks[nextIdx].ambient)
    }
  }

  const handlePrev = () => {
    sound.playTap()
    const prevIdx = (trackIndex - 1 + tracks.length) % tracks.length
    setTrackIndex(prevIdx)
    setProgress(0)
    if (isPlaying) {
      setAmbientSound(tracks[prevIdx].ambient)
    }
  }

  // Animate progress slightly when playing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1))
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isPlaying])

  return (
    <div className={`p-4 rounded-3xl ${cardClass} flex flex-col gap-3 relative transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
            style={{ color: accent.value }}
          >
            <Music size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Soundscape Player</h3>
            <p className="text-[11px] text-slate-400">Ambient audio & focus track</p>
          </div>
        </div>

        {/* Animated Equalizer Waveform */}
        <div className="flex items-end gap-1 h-4">
          <span
            className={`w-1 bg-cyan-400 rounded-full transition-all ${
              isPlaying ? 'h-4 animate-bounce' : 'h-1.5 opacity-40'
            }`}
            style={{ animationDuration: '600ms' }}
          />
          <span
            className={`w-1 bg-cyan-400 rounded-full transition-all ${
              isPlaying ? 'h-3 animate-bounce' : 'h-2 opacity-40'
            }`}
            style={{ animationDuration: '450ms', animationDelay: '150ms' }}
          />
          <span
            className={`w-1 bg-cyan-400 rounded-full transition-all ${
              isPlaying ? 'h-5 animate-bounce' : 'h-1 opacity-40'
            }`}
            style={{ animationDuration: '750ms', animationDelay: '300ms' }}
          />
          <span
            className={`w-1 bg-cyan-400 rounded-full transition-all ${
              isPlaying ? 'h-3.5 animate-bounce' : 'h-2 opacity-40'
            }`}
            style={{ animationDuration: '500ms', animationDelay: '100ms' }}
          />
        </div>
      </div>

      {/* Track info card */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/30 border border-white/10">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-md ${
            isPlaying ? 'animate-spin-slow' : ''
          }`}
        >
          <Disc size={24} className="text-white opacity-90" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-white truncate">{currentTrack.title}</div>
          <div className="text-[11px] text-slate-400 truncate">{currentTrack.artist}</div>
          <div className="text-[9px] font-mono text-cyan-400 mt-0.5 uppercase tracking-wider">
            {currentTrack.ambient} soundscape
          </div>
        </div>
      </div>

      {/* Scrubber progress */}
      <div className="flex flex-col gap-1">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: accent.value,
              boxShadow: `0 0 8px ${accent.glow}`,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>01:24</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Media Controls */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <button onClick={handlePrev} className="p-2 text-slate-300 hover:text-white transition-colors">
          <SkipBack size={18} />
        </button>

        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-black font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer"
          style={{ backgroundColor: accent.value }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>

        <button onClick={handleNext} className="p-2 text-slate-300 hover:text-white transition-colors">
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  )
}
