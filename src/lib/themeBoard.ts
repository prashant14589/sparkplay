// Per-theme game board atmospheric styles.
// The theme should live INSIDE the game, not just on the entry card.

export interface ThemeBoardStyle {
  bgClass: string       // Tailwind bg class for the game board area
  patternEmojis: string[] // Tiny emojis tiled faintly in the board background
}

const BOARD_STYLES: Record<string, ThemeBoardStyle> = {
  // ── Adventure themes ────────────────────────────────────────────────────
  animals:     { bgClass: 'bg-emerald-50',  patternEmojis: ['🐾','🌿','🌸'] },
  dinos:       { bgClass: 'bg-lime-50',     patternEmojis: ['🌿','🦴','🥚'] },
  unicorns:    { bgClass: 'bg-pink-50',     patternEmojis: ['✨','🌸','💫'] },
  ocean:       { bgClass: 'bg-cyan-50',     patternEmojis: ['🫧','🐚','🌊'] },
  space:       { bgClass: 'bg-indigo-50',   patternEmojis: ['⭐','💫','🌙'] },
  superheroes: { bgClass: 'bg-yellow-50',   patternEmojis: ['⚡','💥','🌟'] },
  farm:        { bgClass: 'bg-amber-50',    patternEmojis: ['🌻','🌾','🍀'] },
  food:        { bgClass: 'bg-red-50',      patternEmojis: ['🍭','⭐','🎉'] },

  // ── Childhood memory themes — warm, earthy ───────────────────────────────
  monsoon:      { bgClass: 'bg-teal-50',    patternEmojis: ['💧','🌿','🐸'] },
  gully_cricket:{ bgClass: 'bg-amber-50',   patternEmojis: ['🌾','🌅','⭐'] },
  old_tree:     { bgClass: 'bg-green-50',   patternEmojis: ['🍃','🌸','🐦'] },
  fishing_dawn: { bgClass: 'bg-violet-50',  patternEmojis: ['💧','🌿','⭐'] },
  kite_sky:     { bgClass: 'bg-sky-50',     patternEmojis: ['⭐','🌈','☁'] },
  market_day:   { bgClass: 'bg-yellow-50',  patternEmojis: ['🌸','🌿','⭐'] },
  first_bicycle:{ bgClass: 'bg-rose-50',    patternEmojis: ['🌸','💫','🌿'] },
  night_sky:    { bgClass: 'bg-indigo-50',  patternEmojis: ['⭐','💫','🌙'] },
}

const FALLBACK: ThemeBoardStyle = {
  bgClass: 'bg-gray-50',
  patternEmojis: ['✦', '⭐', '💫'],
}

export function getThemeBoardStyle(themeId: string): ThemeBoardStyle {
  return BOARD_STYLES[themeId] ?? FALLBACK
}
