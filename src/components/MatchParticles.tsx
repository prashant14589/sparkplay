'use client'

interface Props {
  active: boolean
  themeId: string
}

// Each theme gets 8 particle characters that burst outward
const THEME_PARTICLES: Record<string, string[]> = {
  animals:     ['🐾', '⭐', '💫', '✨', '🌟', '💥', '🎉', '✦'],
  dinos:       ['🦕', '🌿', '💫', '✨', '⭐', '💥', '🌟', '✦'],
  unicorns:    ['✨', '🌈', '💫', '⭐', '🌸', '💎', '🌟', '✦'],
  ocean:       ['💧', '🌊', '⭐', '💫', '✨', '🫧', '🌟', '✦'],
  space:       ['⭐', '🌟', '💫', '✨', '🪐', '☄️', '💥', '✦'],
  superheroes: ['⚡', '💥', '🌟', '✨', '💫', '⭐', '🔥', '✦'],
  farm:        ['🌻', '⭐', '💫', '✨', '🌟', '🌈', '💥', '✦'],
  food:        ['⭐', '💫', '✨', '🌟', '🎉', '💥', '🍭', '✦'],
}

const FALLBACK_PARTICLES = ['⭐', '💫', '✨', '🌟', '💥', '🎉', '✦', '✦']

// 8 burst directions: up, up-right, right, down-right, down, down-left, left, up-left
const DIRECTIONS = [
  { x: 0,   y: -44 },
  { x: 31,  y: -31 },
  { x: 44,  y: 0   },
  { x: 31,  y: 31  },
  { x: 0,   y: 44  },
  { x: -31, y: 31  },
  { x: -44, y: 0   },
  { x: -31, y: -31 },
]

export default function MatchParticles({ active, themeId }: Props) {
  if (!active) return null

  const chars = THEME_PARTICLES[themeId] ?? FALLBACK_PARTICLES

  return (
    <div
      role="presentation"
      className="absolute inset-0 pointer-events-none overflow-visible z-20 flex items-center justify-center"
    >
      {chars.map((char, i) => (
        <span
          key={i}
          data-testid="match-particle"
          className="absolute text-base leading-none animate-particle-burst"
          style={{
            '--px': `${DIRECTIONS[i].x}px`,
            '--py': `${DIRECTIONS[i].y}px`,
            animationDelay: `${i * 0.04}s`,
          } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </div>
  )
}
