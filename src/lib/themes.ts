export type AgeGroupId = '2-4' | '4-6' | '6-8' | '8-12'
export type TemplateId = 'memory' | 'quiz' | 'word_search' | 'coloring' | 'maze' | 'puzzle' | 'story' | 'puzzle_maker' | 'number_merge'

export const AGE_GROUPS = [
  { id: '2-4'  as AgeGroupId, label: '2–4 yrs', emoji: '🧸', desc: 'Toddlers' },
  { id: '4-6'  as AgeGroupId, label: '4–6 yrs', emoji: '🎒', desc: 'Pre-K & Kindergarten' },
  { id: '6-8'  as AgeGroupId, label: '6–8 yrs', emoji: '📚', desc: 'Early Elementary' },
  { id: '8-12' as AgeGroupId, label: '8–12 yrs', emoji: '🔬', desc: 'Upper Elementary' },
]

// 5-level config per age group: { pairs, cols }
export type LevelConfig = { pairs: number; cols: number }

export const LEVEL_CONFIGS: Record<AgeGroupId, LevelConfig[]> = {
  '2-4':  [
    { pairs: 3,  cols: 3 },
    { pairs: 4,  cols: 4 },
    { pairs: 6,  cols: 4 },
    { pairs: 8,  cols: 4 },
    { pairs: 10, cols: 5 },
  ],
  '4-6':  [
    { pairs: 4,  cols: 4 },
    { pairs: 6,  cols: 4 },
    { pairs: 8,  cols: 4 },
    { pairs: 10, cols: 5 },
    { pairs: 12, cols: 6 },
  ],
  '6-8':  [
    { pairs: 6,  cols: 4 },
    { pairs: 8,  cols: 4 },
    { pairs: 10, cols: 5 },
    { pairs: 12, cols: 6 },
    { pairs: 15, cols: 6 },
  ],
  '8-12': [
    { pairs: 8,  cols: 4 },
    { pairs: 10, cols: 5 },
    { pairs: 12, cols: 6 },
    { pairs: 15, cols: 6 },
    { pairs: 18, cols: 6 },
  ],
}

export type Theme = {
  id: string
  name: string
  emoji: string
  color: string
  bg: string
  ageGroups: AgeGroupId[]
  cards: string[] // 18 emojis — supports up to 18 pairs at max level
}

export const THEMES: Theme[] = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    color: 'from-green-400 to-emerald-500',
    bg: 'bg-emerald-50',
    ageGroups: ['2-4', '4-6', '6-8'],
    cards: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🐔','🐧','🦆','🦅','🦉'],
  },
  {
    id: 'dinos',
    name: 'Dinosaurs',
    emoji: '🦕',
    color: 'from-lime-400 to-green-600',
    bg: 'bg-lime-50',
    ageGroups: ['4-6', '6-8', '8-12'],
    cards: ['🦕','🦖','🐊','🐉','🦎','🥚','🌋','🦴','🐢','🦂','🪲','🌿','🌾','🏔️','💎','🪶','🦗','🌊'],
  },
  {
    id: 'unicorns',
    name: 'Unicorns',
    emoji: '🦄',
    color: 'from-pink-400 to-purple-500',
    bg: 'bg-pink-50',
    ageGroups: ['2-4', '4-6'],
    cards: ['🦄','🌈','⭐','🌸','🎀','💎','🌺','✨','🌙','💫','🦋','🌷','🌼','💐','🎆','🧚','🪄','🎠'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🐠',
    color: 'from-blue-400 to-cyan-500',
    bg: 'bg-cyan-50',
    ageGroups: ['2-4', '4-6', '6-8'],
    cards: ['🐠','🐟','🦈','🐙','🦞','🐋','🐚','🦀','🐡','🦑','🐬','🦐','🦭','🌊','⚓','🏖️','🪸','🐌'],
  },
  {
    id: 'space',
    name: 'Space',
    emoji: '🚀',
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
    ageGroups: ['6-8', '8-12'],
    cards: ['🚀','🌙','⭐','🪐','🌍','☀️','🛸','🌟','🌠','👽','☄️','🔭','🛰️','🌛','💫','🌌','🌑','🪩'],
  },
  {
    id: 'superheroes',
    name: 'Superheroes',
    emoji: '⚡',
    color: 'from-yellow-400 to-orange-500',
    bg: 'bg-yellow-50',
    ageGroups: ['6-8', '8-12'],
    cards: ['⚡','🔥','💫','🌊','🌪️','🛡️','💥','🦸','🦹','🕷️','🦇','🌀','💪','🏹','⚔️','🔮','🌟','🎯'],
  },
  {
    id: 'farm',
    name: 'Farm',
    emoji: '🐄',
    color: 'from-yellow-300 to-amber-500',
    bg: 'bg-amber-50',
    ageGroups: ['2-4', '4-6'],
    cards: ['🐄','🐖','🐑','🐓','🐴','🦆','🌽','🥕','🍎','🥛','🥚','🌻','🌾','🚜','🌈','🏡','🍓','🫐'],
  },
  {
    id: 'food',
    name: 'Yummy Food',
    emoji: '🍕',
    color: 'from-red-400 to-orange-500',
    bg: 'bg-red-50',
    ageGroups: ['2-4', '4-6', '6-8'],
    cards: ['🍕','🍦','🍩','🍎','🍓','🌮','🍪','🧁','🍰','🎂','🍫','🍬','🍭','🍑','🥧','🧃','🍇','🍒'],
  },

  // ── Childhood Memory Themes ──────────────────────────────────────────────
  // Warm, earthy, analog. The worlds our parents played in.

  {
    id: 'monsoon',
    name: 'First Rain',
    emoji: '🌧️',
    color: 'from-teal-400 to-cyan-500',
    bg: 'bg-teal-50',
    ageGroups: ['4-6', '6-8', '8-12'],
    cards: ['🌧️','☔','🐸','🌈','💧','🌊','⛈️','🌿','🌱','🍃','🌾','🪲','🐌','🌸','🦋','🌬️','🫧','🌦️'],
  },
  {
    id: 'gully_cricket',
    name: 'Street Games',
    emoji: '🏏',
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    ageGroups: ['4-6', '6-8', '8-12'],
    cards: ['🏏','🌅','🌳','🏃','👟','🌿','🎯','🌙','⭐','🏆','🔥','💪','🎉','🌺','🍃','🌾','🌻','🌈'],
  },
  {
    id: 'old_tree',
    name: 'The Old Tree',
    emoji: '🌳',
    color: 'from-green-600 to-emerald-700',
    bg: 'bg-green-50',
    ageGroups: ['4-6', '6-8', '8-12'],
    cards: ['🌳','🐦','🍃','🌿','🌸','🍎','🍂','🌺','🦋','🐛','🪺','🌰','🍇','🐝','🦜','🌻','🌼','🍃'],
  },
  {
    id: 'fishing_dawn',
    name: 'Fishing at Dawn',
    emoji: '🎣',
    color: 'from-violet-400 to-indigo-400',
    bg: 'bg-violet-50',
    ageGroups: ['4-6', '6-8', '8-12'],
    cards: ['🎣','🐟','🌅','🐸','🦋','🌿','🪸','🐚','🌾','🦆','🐢','🌸','💧','⭐','🌙','🍃','🌱','🌊'],
  },
  {
    id: 'kite_sky',
    name: 'Kite Festival',
    emoji: '🪁',
    color: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50',
    ageGroups: ['4-6', '6-8', '8-12'],
    cards: ['🪁','🌈','⭐','💫','🌟','🌬️','🌅','🎨','🌺','🌸','🌻','🍃','🦅','🦋','☁️','🌤️','🎊','🌈'],
  },
  {
    id: 'market_day',
    name: 'Market Day',
    emoji: '🛒',
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-50',
    ageGroups: ['4-6', '6-8', '8-12'],
    cards: ['🥕','🍅','🍆','🌽','🥦','🍋','🍎','🌶️','🧅','🥜','🍇','🍓','🌿','🫑','🥭','🍊','🥥','🍌'],
  },
  {
    id: 'first_bicycle',
    name: 'First Bicycle',
    emoji: '🚲',
    color: 'from-rose-400 to-pink-500',
    bg: 'bg-rose-50',
    ageGroups: ['4-6', '6-8', '8-12'],
    cards: ['🚲','⭐','💫','🌟','🎯','🏆','🎊','🎉','🌈','🌺','🌸','🌻','🍃','🌿','🌱','🌾','🦋','🐦'],
  },
  {
    id: 'night_sky',
    name: 'Stargazing',
    emoji: '⭐',
    color: 'from-indigo-600 to-slate-700',
    bg: 'bg-indigo-50',
    ageGroups: ['4-6', '6-8', '8-12'],
    cards: ['⭐','🌙','💫','🌟','☄️','🌠','🪐','🌛','🌜','🌕','🔭','🦉','🦋','🌿','🌸','🌺','🌌','🎑'],
  },
]

export const TEMPLATES = [
  {
    id: 'memory' as TemplateId,
    name: 'Memory Match',
    emoji: '🃏',
    desc: 'Flip cards to find matching pairs',
    color: 'from-purple-400 to-purple-600',
    ageGroups: ['2-4', '4-6', '6-8', '8-12'] as AgeGroupId[],
  },
  {
    id: 'quiz' as TemplateId,
    name: 'Quiz Game',
    emoji: '❓',
    desc: 'Multiple choice questions',
    color: 'from-blue-400 to-blue-600',
    ageGroups: ['4-6', '6-8', '8-12'] as AgeGroupId[],
  },
  {
    id: 'word_search' as TemplateId,
    name: 'Word Search',
    emoji: '🔤',
    desc: 'Find hidden words in a grid',
    color: 'from-green-400 to-green-600',
    ageGroups: ['6-8', '8-12'] as AgeGroupId[],
  },
  {
    id: 'coloring' as TemplateId,
    name: 'Coloring Book',
    emoji: '🎨',
    desc: 'Interactive coloring pages',
    color: 'from-yellow-400 to-orange-500',
    ageGroups: ['2-4', '4-6'] as AgeGroupId[],
  },
  {
    id: 'maze' as TemplateId,
    name: 'Maze',
    emoji: '🌀',
    desc: 'Navigate through a maze',
    color: 'from-pink-400 to-red-500',
    ageGroups: ['4-6', '6-8', '8-12'] as AgeGroupId[],
  },
  {
    id: 'puzzle' as TemplateId,
    name: 'Sliding Puzzle',
    emoji: '🧩',
    desc: 'Rearrange tiles to complete a picture',
    color: 'from-teal-400 to-cyan-600',
    ageGroups: ['6-8', '8-12'] as AgeGroupId[],
  },
  {
    id: 'puzzle_maker' as TemplateId,
    name: 'Puzzle Maker',
    emoji: '🧩',
    desc: 'AI draws a personalised picture — you piece it together',
    color: 'from-violet-500 to-fuchsia-600',
    ageGroups: ['2-4', '4-6', '6-8', '8-12'] as AgeGroupId[],
  },
  {
    id: 'story' as TemplateId,
    name: 'Story Quest',
    emoji: '📖',
    desc: 'A branching story adventure with your child\'s name',
    color: 'from-rose-400 to-pink-600',
    ageGroups: ['2-4', '4-6', '6-8', '8-12'] as AgeGroupId[],
  },
  {
    id: 'number_merge' as TemplateId,
    name: 'Number Merge',
    emoji: '2️⃣',
    desc: 'Swipe to merge tiles and reach 2048',
    color: 'from-slate-600 to-gray-800',
    ageGroups: ['8-12'] as AgeGroupId[],
  },
]

export function getThemesForAge(ageGroup: AgeGroupId): Theme[] {
  return THEMES.filter((t) => t.ageGroups.includes(ageGroup))
}

export function getTemplatesForAge(ageGroup: AgeGroupId) {
  return TEMPLATES.filter((t) => t.ageGroups.includes(ageGroup))
}

export function getThemeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

export function getLevels(ageGroup: AgeGroupId): LevelConfig[] {
  return LEVEL_CONFIGS[ageGroup] ?? LEVEL_CONFIGS['4-6']
}

// Visual experience tier shown in game headers
const AGE_TIERS: Record<string, { label: string; emoji: string; color: string }> = {
  '2-4':  { label: 'Tiny Explorer', emoji: '🌱', color: 'bg-green-100 text-green-700 border-green-200' },
  '4-6':  { label: 'Adventurer',    emoji: '⚡', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  '6-8':  { label: 'Champion',      emoji: '🏆', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  '8-12': { label: 'Legend Mode',   emoji: '🔥', color: 'bg-red-100 text-red-700 border-red-200' },
}

export function getAgeTier(ageGroup: string) {
  return AGE_TIERS[ageGroup] ?? AGE_TIERS['4-6']
}
