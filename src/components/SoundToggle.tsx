'use client'

import { useEffect, useState } from 'react'
import { Sounds } from '@/lib/sounds'

export default function SoundToggle() {
  const [sfx, setSfx] = useState(true)
  const [music, setMusic] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSfx(Sounds.sfxEnabled)
    setMusic(Sounds.musicEnabled)
  }, [])

  // Don't render until client-side (avoids hydration mismatch)
  if (!mounted) return null

  function handleSfx() {
    const next = Sounds.toggleSfx()
    setSfx(next)
  }

  function handleMusic() {
    const next = Sounds.toggleMusic()
    setMusic(next)
  }

  // First interaction unlocks AudioContext on mobile
  function handleFirstClick(fn: () => void) {
    Sounds.resume()
    fn()
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleFirstClick(handleSfx)}
        title={sfx ? 'Mute sound effects' : 'Enable sound effects'}
        className="rounded-lg p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
        aria-label={sfx ? 'Mute sound effects' : 'Enable sound effects'}
      >
        {sfx ? '🔊' : '🔇'}
      </button>
      <button
        onClick={() => handleFirstClick(handleMusic)}
        title={music ? 'Mute music' : 'Enable music'}
        className="relative rounded-lg p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
        aria-label={music ? 'Mute music' : 'Enable music'}
      >
        <span className={music ? '' : 'opacity-40'}>🎵</span>
        {!music && (
          <span className="absolute top-1 right-1 text-[9px] font-black text-red-500 leading-none">✕</span>
        )}
      </button>
    </div>
  )
}
