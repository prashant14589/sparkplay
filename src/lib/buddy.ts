export interface Buddy {
  id: string
  name: string
  emoji: string
  unlockLevel: number
  gradient: string   // Tailwind from-/to- classes
  phrases: string[]  // idle catchphrases
  winPhrases: string[]
}

export const BUDDIES: Buddy[] = [
  {
    id: 'rexy',
    name: 'Rexy',
    emoji: '🦕',
    unlockLevel: 1,
    gradient: 'from-lime-400 to-green-500',
    phrases: ['Ready to roar! 🦕', "Let's go, superstar!", 'Adventure time!', 'RAWR means I like you!'],
    winPhrases: ["You're dino-mite! 🦕", 'ROAAARRR! Epic win!', 'Dino champion! 🏆', 'Fossil-ly amazing!'],
  },
  {
    id: 'puffy',
    name: 'Puffy',
    emoji: '🦄',
    unlockLevel: 3,
    gradient: 'from-pink-400 to-purple-500',
    phrases: ['Sparkles incoming! ✨', 'Magic is real!', 'Unicorn power! 🌈', 'Believe and achieve!'],
    winPhrases: ['Magical! ✨', "You're glowing! 🌟", 'Rainbow victory! 🌈', 'Pure magic!'],
  },
  {
    id: 'scout',
    name: 'Scout',
    emoji: '🐶',
    unlockLevel: 5,
    gradient: 'from-amber-400 to-orange-500',
    phrases: ['Woof! Woof! 🐾', "Best buddy ever!", 'Tail is wagging! 🐶', "Let's fetch a win!"],
    winPhrases: ['WOOF WOOF! 🐾', 'Best player ever!', 'Paw-some! 🐕', 'Fetched that win! 🎾'],
  },
  {
    id: 'spark',
    name: 'Spark',
    emoji: '⚡',
    unlockLevel: 8,
    gradient: 'from-yellow-400 to-orange-500',
    phrases: ['Power up! ⚡', 'Superhero time!', 'ZAP! Ready!', 'Charge up!'],
    winPhrases: ['SUPER! ⚡', 'Lightning speed! 🌟', 'Heroic! 🦸', 'ZAAAP! Legend!'],
  },
]

// XP is earned from stars and coins
export function calcXP(stars: number, coins: number) {
  return stars * 10 + Math.floor(coins * 2)
}

// Level 1 at 0 XP, +1 per 100 XP, capped at 10
export function calcLevel(xp: number) {
  return Math.min(10, Math.floor(xp / 100) + 1)
}

export function xpToNextLevel(xp: number) {
  const level = calcLevel(xp)
  if (level >= 10) return { current: xp, needed: 0, pct: 100 }
  const base = (level - 1) * 100
  const next = level * 100
  return { current: xp - base, needed: next - base, pct: Math.round(((xp - base) / (next - base)) * 100) }
}

export function getUnlockedBuddies(level: number) {
  return BUDDIES.filter(b => b.unlockLevel <= level)
}

export function getActiveBuddy(level: number): Buddy {
  if (typeof window === 'undefined') return BUDDIES[0]
  const saved = localStorage.getItem('sp_buddy')
  const unlocked = getUnlockedBuddies(level)
  return unlocked.find(b => b.id === saved) ?? unlocked.at(-1) ?? BUDDIES[0]
}

export function setActiveBuddy(id: string) {
  if (typeof window !== 'undefined') localStorage.setItem('sp_buddy', id)
}

export function randomPhrase(buddy: Buddy, type: 'idle' | 'win' = 'idle') {
  const pool = type === 'win' ? buddy.winPhrases : buddy.phrases
  return pool[Math.floor(Math.random() * pool.length)]
}
