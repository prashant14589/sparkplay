// Web Audio API sound engine — no files, no CDN, no copyright issues.
// All sounds are synthesised; music is a procedural pentatonic loop.

type OscType = OscillatorType

class SoundEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private _sfxEnabled: boolean = true
  private _musicEnabled: boolean = true
  private musicTimeouts: ReturnType<typeof setTimeout>[] = []
  private musicStep = 0

  // C-major pentatonic (Hz): C4 D4 E4 G4 A4 C5 D5 E5
  private readonly NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]
  // Looping melody pattern — indices into NOTES
  private readonly MELODY = [0, 2, 4, 2, 0, 2, 4, 5, 4, 2, 4, 5, 7, 5, 4, 2]

  constructor() {
    if (typeof window === 'undefined') return
    this._sfxEnabled = localStorage.getItem('sp_sfx') !== 'off'
    this._musicEnabled = localStorage.getItem('sp_music') !== 'off'
  }

  private ctx_(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.35
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  private tone(
    freq: number,
    type: OscType = 'sine',
    duration = 0.12,
    volume = 0.5,
    delay = 0,
    gainTarget?: GainNode
  ) {
    if (!this._sfxEnabled) return
    const ctx = this.ctx_()
    if (!ctx || !this.masterGain) return

    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    env.gain.value = 0

    osc.connect(env)
    env.connect(gainTarget ?? this.masterGain)

    const t = ctx.currentTime + delay
    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(volume, t + 0.01)
    env.gain.exponentialRampToValueAtTime(0.001, t + duration)
    osc.start(t)
    osc.stop(t + duration + 0.05)
  }

  // ── Sound effects ──────────────────────────────────────────────────────────

  flip() {
    this.tone(700, 'sine', 0.07, 0.25)
    this.tone(950, 'sine', 0.05, 0.15, 0.04)
  }

  match() {
    this.tone(523, 'sine', 0.12, 0.35, 0)
    this.tone(659, 'sine', 0.12, 0.4, 0.1)
    this.tone(784, 'sine', 0.18, 0.5, 0.2)
  }

  mismatch() {
    this.tone(280, 'sawtooth', 0.09, 0.2)
    this.tone(220, 'sawtooth', 0.12, 0.18, 0.09)
  }

  win() {
    [261, 329, 392, 523, 659].forEach((f, i) => this.tone(f, 'sine', 0.28, 0.55, i * 0.13))
  }

  correct() {
    this.tone(440, 'sine', 0.09, 0.35)
    this.tone(554, 'sine', 0.14, 0.45, 0.1)
  }

  wrong() {
    this.tone(311, 'sawtooth', 0.08, 0.25)
    this.tone(233, 'sawtooth', 0.13, 0.22, 0.1)
  }

  wordFound() {
    [880, 988, 1047, 1175].forEach((f, i) => this.tone(f, 'sine', 0.08, 0.38, i * 0.055))
  }

  click() {
    this.tone(820, 'sine', 0.04, 0.18)
  }

  slide() {
    this.tone(500, 'triangle', 0.05, 0.15)
  }

  move() {
    this.tone(440, 'triangle', 0.04, 0.12)
  }

  coin() {
    this.tone(659, 'sine', 0.06, 0.28)
    this.tone(784, 'sine', 0.1, 0.38, 0.07)
  }

  // ── Background music ───────────────────────────────────────────────────────

  startMusic() {
    if (!this._musicEnabled) return
    this.stopMusic()
    this.musicStep = 0
    this._scheduleBatch()
  }

  private _scheduleBatch() {
    const ctx = this.ctx_()
    if (!ctx || !this.masterGain) return

    const musicGain = ctx.createGain()
    musicGain.gain.value = 0.1       // music softer than SFX
    musicGain.connect(this.masterGain)

    const tempo = 0.42               // seconds per note
    const now = ctx.currentTime

    for (let i = 0; i < 8; i++) {
      const noteIdx = this.MELODY[(this.musicStep + i) % this.MELODY.length]
      const freq = this.NOTES[noteIdx]

      const osc = ctx.createOscillator()
      const env = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      env.gain.value = 0

      osc.connect(env)
      env.connect(musicGain)

      const t = now + i * tempo
      env.gain.setValueAtTime(0, t)
      env.gain.linearRampToValueAtTime(0.6, t + 0.02)
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.38)
      osc.start(t)
      osc.stop(t + 0.42)
    }

    this.musicStep += 8

    const id = setTimeout(() => {
      if (this._musicEnabled && this._sfxEnabled) this._scheduleBatch()
    }, 7 * tempo * 1000)             // schedule next batch before this one ends

    this.musicTimeouts.push(id)
  }

  stopMusic() {
    this.musicTimeouts.forEach(clearTimeout)
    this.musicTimeouts = []
  }

  // ── Toggles ────────────────────────────────────────────────────────────────

  get sfxEnabled() { return this._sfxEnabled }
  get musicEnabled() { return this._musicEnabled }

  toggleSfx(): boolean {
    this._sfxEnabled = !this._sfxEnabled
    if (!this._sfxEnabled) this.stopMusic()
    localStorage.setItem('sp_sfx', this._sfxEnabled ? 'on' : 'off')
    return this._sfxEnabled
  }

  toggleMusic(): boolean {
    this._musicEnabled = !this._musicEnabled
    if (this._musicEnabled && this._sfxEnabled) this.startMusic()
    else this.stopMusic()
    localStorage.setItem('sp_music', this._musicEnabled ? 'on' : 'off')
    return this._musicEnabled
  }

  // Call on first user interaction to unlock AudioContext on iOS/Android
  resume() {
    this.ctx_()
    if (this._musicEnabled && this._sfxEnabled && this.musicTimeouts.length === 0) {
      this.startMusic()
    }
  }
}

// Lazy singleton — safe to import in SSR; no window access at module load time
let _engine: SoundEngine | null = null
function eng(): SoundEngine {
  if (!_engine) _engine = new SoundEngine()
  return _engine
}

export const Sounds = {
  flip:      () => eng().flip(),
  match:     () => eng().match(),
  mismatch:  () => eng().mismatch(),
  win:       () => eng().win(),
  correct:   () => eng().correct(),
  wrong:     () => eng().wrong(),
  wordFound: () => eng().wordFound(),
  click:     () => eng().click(),
  slide:     () => eng().slide(),
  move:      () => eng().move(),
  coin:      () => eng().coin(),

  startMusic: () => eng().startMusic(),
  stopMusic:  () => eng().stopMusic(),
  resume:     () => eng().resume(),

  toggleSfx:   () => eng().toggleSfx(),
  toggleMusic: () => eng().toggleMusic(),

  get sfxEnabled()   { return eng().sfxEnabled },
  get musicEnabled() { return eng().musicEnabled },
}
