// Web Audio API Synthesizer for 100% offline, zero-asset audio effects & ambient soundscapes

class SoundEngine {
  private ctx: AudioContext | null = null
  private ambientSource: AudioNode | null = null
  private ambientGain: GainNode | null = null
  private ambientLFO: OscillatorNode | null = null
  private currentAmbient: string | null = null

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  // Soft haptic click
  playTap() {
    try {
      const ctx = this.getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(420, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } catch {
      // Audio context waiting for user interaction
    }
  }

  // Double harmonic chime for habit check or success
  playChime() {
    try {
      const ctx = this.getContext()
      const notes = [587.33, 880, 1174.66] // D5, A5, D6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        const startTime = ctx.currentTime + index * 0.06
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.12, startTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 0.35)
      })
    } catch {}
  }

  // High-tech futuristic bip
  playBip() {
    try {
      const ctx = this.getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(950, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08)
      gain.gain.setValueAtTime(0.07, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch {}
  }

  // Focus completion alarm
  playAlarm() {
    try {
      const ctx = this.getContext()
      const chords = [523.25, 659.25, 783.99, 1046.5] // C Major
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        const startTime = ctx.currentTime + idx * 0.12
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.15, startTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 0.8)
      })
    } catch {}
  }

  // Synthesize realistic ambient sounds (Rain, Waves, Forest, Cyber White Noise)
  startAmbient(type: 'rain' | 'waves' | 'forest' | 'whitenoise', volume: number = 0.2) {
    this.stopAmbient()
    try {
      const ctx = this.getContext()
      this.currentAmbient = type

      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime)
      masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), ctx.currentTime + 0.5)
      masterGain.connect(ctx.destination)
      this.ambientGain = masterGain

      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      if (type === 'rain') {
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(850, ctx.currentTime)
        filter.Q.setValueAtTime(1.5, ctx.currentTime)

        whiteNoise.connect(filter)
        filter.connect(masterGain)
        this.ambientSource = whiteNoise
      } else if (type === 'waves') {
        const filter = ctx.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(450, ctx.currentTime)
        filter.Q.setValueAtTime(2.0, ctx.currentTime)

        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.type = 'sine'
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime)
        lfoGain.gain.setValueAtTime(280, ctx.currentTime)

        lfo.connect(filter.frequency)
        whiteNoise.connect(filter)
        filter.connect(masterGain)

        lfo.start()
        this.ambientLFO = lfo
        this.ambientSource = whiteNoise
      } else if (type === 'forest') {
        const filter = ctx.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.setValueAtTime(1200, ctx.currentTime)

        whiteNoise.connect(filter)
        filter.connect(masterGain)
        this.ambientSource = whiteNoise
      } else {
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(500, ctx.currentTime)

        const drone = ctx.createOscillator()
        const droneGain = ctx.createGain()
        drone.type = 'sawtooth'
        drone.frequency.setValueAtTime(55, ctx.currentTime)
        droneGain.gain.setValueAtTime(0.08, ctx.currentTime)

        drone.connect(filter)
        whiteNoise.connect(filter)
        filter.connect(masterGain)

        drone.start()
        this.ambientSource = drone
      }

      whiteNoise.start()
    } catch {}
  }

  setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(Math.max(0.001, vol), this.ctx.currentTime)
    }
  }

  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.ctx.currentTime)
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3)
      } catch {}
    }
    setTimeout(() => {
      if (this.ambientLFO) {
        try { this.ambientLFO.stop(); this.ambientLFO.disconnect() } catch {}
        this.ambientLFO = null
      }
      if (this.ambientSource) {
        try { this.ambientSource.disconnect() } catch {}
        this.ambientSource = null
      }
      this.currentAmbient = null
    }, 350)
  }

  getCurrentAmbient() {
    return this.currentAmbient
  }
}

export const sound = new SoundEngine()
