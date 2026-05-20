'use client'

import { THEMES } from '@/lib/themes'

interface EnvParticle {
  char: string
  x: number   // % from left
  y: number   // % from top
  delay: number
  floatClass: 'animate-float' | 'animate-float-alt' | 'animate-float-slow'
}

const ENV_PARTICLES: Record<string, EnvParticle[]> = {
  animals: [
    { char: '🐾', x: 8,  y: 12, delay: 0,   floatClass: 'animate-float' },
    { char: '🦋', x: 85, y: 8,  delay: 0.8, floatClass: 'animate-float-alt' },
    { char: '🌿', x: 5,  y: 72, delay: 1.4, floatClass: 'animate-float-slow' },
    { char: '🌸', x: 90, y: 65, delay: 0.4, floatClass: 'animate-float' },
    { char: '🍃', x: 50, y: 5,  delay: 1.8, floatClass: 'animate-float-alt' },
    { char: '✨', x: 78, y: 40, delay: 1.1, floatClass: 'animate-float-slow' },
  ],
  dinos: [
    { char: '🌿', x: 6,  y: 10, delay: 0,   floatClass: 'animate-float' },
    { char: '🦴', x: 88, y: 15, delay: 0.9, floatClass: 'animate-float-alt' },
    { char: '🌋', x: 5,  y: 70, delay: 1.5, floatClass: 'animate-float-slow' },
    { char: '💎', x: 85, y: 70, delay: 0.3, floatClass: 'animate-float' },
    { char: '🌾', x: 48, y: 4,  delay: 1.9, floatClass: 'animate-float-alt' },
    { char: '🦕', x: 80, y: 38, delay: 1.2, floatClass: 'animate-float-slow' },
  ],
  unicorns: [
    { char: '✨', x: 7,  y: 10, delay: 0,   floatClass: 'animate-float' },
    { char: '🌈', x: 84, y: 8,  delay: 0.7, floatClass: 'animate-float-alt' },
    { char: '💫', x: 6,  y: 68, delay: 1.3, floatClass: 'animate-float-slow' },
    { char: '🌸', x: 87, y: 62, delay: 0.5, floatClass: 'animate-float' },
    { char: '💎', x: 46, y: 3,  delay: 2.0, floatClass: 'animate-float-alt' },
    { char: '🌙', x: 77, y: 42, delay: 1.1, floatClass: 'animate-float-slow' },
  ],
  ocean: [
    { char: '💧', x: 7,  y: 12, delay: 0,   floatClass: 'animate-float' },
    { char: '🌊', x: 83, y: 7,  delay: 0.6, floatClass: 'animate-float-alt' },
    { char: '🐚', x: 5,  y: 74, delay: 1.6, floatClass: 'animate-float-slow' },
    { char: '⚓', x: 88, y: 68, delay: 0.2, floatClass: 'animate-float' },
    { char: '🫧', x: 50, y: 4,  delay: 1.8, floatClass: 'animate-float-alt' },
    { char: '🦀', x: 76, y: 40, delay: 1.0, floatClass: 'animate-float-slow' },
  ],
  space: [
    { char: '⭐', x: 8,  y: 10, delay: 0,   floatClass: 'animate-float' },
    { char: '🌙', x: 85, y: 7,  delay: 0.8, floatClass: 'animate-float-alt' },
    { char: '💫', x: 4,  y: 70, delay: 1.4, floatClass: 'animate-float-slow' },
    { char: '🪐', x: 89, y: 66, delay: 0.4, floatClass: 'animate-float' },
    { char: '🌟', x: 47, y: 3,  delay: 1.9, floatClass: 'animate-float-alt' },
    { char: '🛸', x: 79, y: 38, delay: 1.2, floatClass: 'animate-float-slow' },
  ],
  superheroes: [
    { char: '⚡', x: 7,  y: 11, delay: 0,   floatClass: 'animate-float' },
    { char: '💥', x: 86, y: 8,  delay: 0.7, floatClass: 'animate-float-alt' },
    { char: '🔥', x: 5,  y: 72, delay: 1.5, floatClass: 'animate-float-slow' },
    { char: '🛡️', x: 88, y: 64, delay: 0.3, floatClass: 'animate-float' },
    { char: '💫', x: 49, y: 4,  delay: 1.8, floatClass: 'animate-float-alt' },
    { char: '🌟', x: 80, y: 40, delay: 1.0, floatClass: 'animate-float-slow' },
  ],
  farm: [
    { char: '🌻', x: 7,  y: 10, delay: 0,   floatClass: 'animate-float' },
    { char: '🌾', x: 84, y: 8,  delay: 0.9, floatClass: 'animate-float-alt' },
    { char: '🍎', x: 6,  y: 74, delay: 1.6, floatClass: 'animate-float-slow' },
    { char: '🌈', x: 87, y: 66, delay: 0.4, floatClass: 'animate-float' },
    { char: '🌿', x: 48, y: 3,  delay: 2.0, floatClass: 'animate-float-alt' },
    { char: '🐦', x: 78, y: 38, delay: 1.1, floatClass: 'animate-float-slow' },
  ],
  food: [
    { char: '🍭', x: 8,  y: 11, delay: 0,   floatClass: 'animate-float' },
    { char: '⭐', x: 85, y: 7,  delay: 0.8, floatClass: 'animate-float-alt' },
    { char: '🎉', x: 5,  y: 73, delay: 1.4, floatClass: 'animate-float-slow' },
    { char: '🍬', x: 88, y: 65, delay: 0.5, floatClass: 'animate-float' },
    { char: '✨', x: 47, y: 4,  delay: 1.9, floatClass: 'animate-float-alt' },
    { char: '🌟', x: 77, y: 40, delay: 1.2, floatClass: 'animate-float-slow' },
  ],
}

const FALLBACK_PARTICLES: EnvParticle[] = ENV_PARTICLES.animals

interface Props {
  themeId: string
  children: React.ReactNode
  className?: string
}

export default function ThemeEnvironment({ themeId, children, className = '' }: Props) {
  const theme = THEMES.find((t) => t.id === themeId)
  const bgClass = theme?.bg ?? 'bg-violet-50'
  const particles = ENV_PARTICLES[themeId] ?? FALLBACK_PARTICLES

  return (
    <div className={`relative rounded-2xl ${bgClass} ${className}`}>
      {/* Ambient floating particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            data-testid="env-particle"
            className={`absolute text-xl select-none ${p.floatClass}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              opacity: 0.28,
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
