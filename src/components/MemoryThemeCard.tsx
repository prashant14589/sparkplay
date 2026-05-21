'use client'

import type { Theme } from '@/lib/themes'

// Per-memory-theme animated particles — the card SHOWS you what's inside before you tap
const CARD_PARTICLES: Record<string, { char: string; positions: { x: number; y: number; delay: string; dur: string }[] }> = {
  monsoon:      { char: '💧', positions: [{ x: 20, y: 15, delay: '0s',    dur: '1.8s' }, { x: 65, y: 30, delay: '0.6s', dur: '2.1s' }, { x: 42, y: 10, delay: '1.1s', dur: '1.6s' }] },
  gully_cricket:{ char: '⭐', positions: [{ x: 15, y: 20, delay: '0s',    dur: '3.2s' }, { x: 70, y: 15, delay: '1.2s', dur: '2.8s' }, { x: 45, y: 8,  delay: '2.0s', dur: '3.5s' }] },
  old_tree:     { char: '🍃', positions: [{ x: 18, y: 12, delay: '0s',    dur: '4.0s' }, { x: 72, y: 20, delay: '1.5s', dur: '3.5s' }, { x: 50, y: 8,  delay: '0.8s', dur: '4.5s' }] },
  fishing_dawn: { char: '⭐', positions: [{ x: 12, y: 18, delay: '0s',    dur: '5.0s' }, { x: 60, y: 10, delay: '2.0s', dur: '4.2s' }, { x: 38, y: 5,  delay: '1.0s', dur: '5.5s' }] },
  kite_sky:     { char: '✦', positions: [{ x: 22, y: 8,  delay: '0s',    dur: '3.8s' }, { x: 68, y: 12, delay: '1.4s', dur: '4.0s' }, { x: 48, y: 6,  delay: '2.2s', dur: '3.2s' }] },
  market_day:   { char: '🌸', positions: [{ x: 16, y: 15, delay: '0s',    dur: '3.5s' }, { x: 75, y: 25, delay: '1.0s', dur: '4.0s' }, { x: 40, y: 8,  delay: '1.8s', dur: '3.0s' }] },
  first_bicycle:{ char: '💫', positions: [{ x: 20, y: 10, delay: '0s',    dur: '3.2s' }, { x: 65, y: 18, delay: '0.8s', dur: '3.8s' }, { x: 44, y: 8,  delay: '1.6s', dur: '2.8s' }] },
  night_sky:    { char: '⭐', positions: [{ x: 15, y: 12, delay: '0s',    dur: '4.5s' }, { x: 70, y: 8,  delay: '1.5s', dur: '3.8s' }, { x: 40, y: 6,  delay: '0.7s', dur: '5.2s' }] },
}

const FALLBACK_PARTICLES = { char: '✦', positions: [{ x: 20, y: 15, delay: '0s', dur: '3s' }, { x: 65, y: 20, delay: '1s', dur: '3.5s' }, { x: 42, y: 8, delay: '1.8s', dur: '2.8s' }] }

interface Props {
  theme: Theme
  isActive: boolean
  onClick: () => void
}

export default function MemoryThemeCard({ theme, isActive, onClick }: Props) {
  const particles = CARD_PARTICLES[theme.id] ?? FALLBACK_PARTICLES

  return (
    <button
      onClick={onClick}
      className={[
        'relative flex-shrink-0 rounded-2xl overflow-hidden snap-start transition-all w-[88px] h-[72px]',
        isActive
          ? 'scale-105 shadow-xl'
          : 'opacity-90 hover:opacity-100 hover:scale-102 shadow-md',
      ].join(' ')}
      style={{ outline: isActive ? '3px solid #f59e0b' : 'none', outlineOffset: 3 }}
    >
      {/* Warm desaturated gradient — deliberately analog */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.color}`}
        style={{ filter: 'saturate(0.72) brightness(0.93)' }}
      />

      {/* Warm amber overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/35 to-transparent" />

      {/* Animated ambient particles — the card breathes the theme */}
      {particles.positions.map((pos, i) => (
        <span
          key={i}
          data-testid="card-particle"
          aria-hidden="true"
          className="pointer-events-none select-none absolute text-xs leading-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            opacity: 0.55,
            animation: `particleDrift ${pos.dur} ease-in-out infinite`,
            animationDelay: pos.delay,
          }}
        >
          {particles.char}
        </span>
      ))}

      {/* Theme emoji */}
      <span className="absolute bottom-6 right-1.5 text-2xl leading-none drop-shadow select-none">
        {theme.emoji}
      </span>

      {/* Name */}
      <span className="absolute bottom-1.5 left-2 text-[10px] font-black text-white drop-shadow leading-tight">
        {theme.name}
      </span>
    </button>
  )
}
