/**
 * SparkPlay progress tracking — localStorage-backed, no server required.
 *
 * ─── STAR RULES ───────────────────────────────────────────────────────────
 *
 *  Memory Match  (unit = "pairs")
 *    ⭐⭐⭐  moves ≤ pairs × 1.5   e.g. 4 pairs → ≤ 6 moves   "Expert!"
 *    ⭐⭐    moves ≤ pairs × 2.5   e.g. 4 pairs → ≤ 10 moves  "Nice!"
 *    ⭐      any completion                                     "You did it!"
 *
 *  Maze  (unit = "size" = grid side length 5–11)
 *    ⭐⭐⭐  moves ≤ size × 2.5    e.g. 7×7 → ≤ 17 moves  "Sharp!"
 *    ⭐⭐    moves ≤ size × 4      e.g. 7×7 → ≤ 28 moves  "Found it!"
 *    ⭐      any completion                                 "Explorer!"
 *
 *  Sliding Puzzle  (unit = "tiles" = size²−1, e.g. 3×3 → 8 tiles)
 *    ⭐⭐⭐  moves ≤ tiles × 3     e.g. 8 tiles → ≤ 24 moves  "Genius!"
 *    ⭐⭐    moves ≤ tiles × 5     e.g. 8 tiles → ≤ 40 moves  "Smart!"
 *    ⭐      any completion                                     "Solved!"
 *
 *  Story Quest  (unit = choices made, lower = more decisive)
 *    ⭐⭐⭐  choices ≤ 2   (decided quickly)
 *    ⭐⭐    choices ≤ 4
 *    ⭐      any completion
 *
 * ─── COIN RULES ───────────────────────────────────────────────────────────
 *
 *  coins = 10                 (base — everyone gets 10 for finishing)
 *        + (stars − 1) × 5   (star bonus: 2★ → +5, 3★ → +10)
 *        + level × 2          (level bonus: level 5 → +10)
 *
 *  Examples:
 *    Level 1, 1★ →  10 + 0  + 2  = 12 coins
 *    Level 1, 3★ →  10 + 10 + 2  = 22 coins
 *    Level 5, 3★ →  10 + 10 + 10 = 30 coins
 *
 * ─── STREAK RULES ─────────────────────────────────────────────────────────
 *
 *  +1 if last play was exactly yesterday
 *  = 1 if last play was before yesterday (broken streak)
 *  unchanged if last play was today (already counted)
 */

export type Badge = {
  id: string
  name: string
  emoji: string
  desc: string
  earned: boolean
  earnedAt?: string
}

export type GameRecord = {
  templateType: string
  theme: string
  ageGroup: string
  levelsCompleted: number[]
  starsPerLevel: Record<number, number>
  coinsEarned: number
}

export type Progress = {
  totalStars: number
  totalCoins: number
  streak: number
  lastPlayedDate: string | null
  badges: Badge[]
  gameHistory: GameRecord[]
  childName: string
}

const ALL_BADGES: Badge[] = [
  { id: 'first_win',      name: 'First Win',       emoji: '🌟', desc: 'Complete your first game',                earned: false },
  { id: 'memory_ace',     name: 'Memory Ace',      emoji: '🃏', desc: 'Complete Memory Match Level 5',           earned: false },
  { id: 'perfect_memory', name: 'Perfect Memory',  emoji: '🧠', desc: 'Score 3 stars on any Memory Match level', earned: false },
  { id: 'maze_runner',    name: 'Maze Runner',     emoji: '🌀', desc: 'Solve 3 different mazes',                 earned: false },
  { id: 'puzzle_pro',     name: 'Puzzle Pro',      emoji: '🧩', desc: 'Complete a Sliding Puzzle',               earned: false },
  { id: 'story_hero',     name: 'Story Hero',      emoji: '📖', desc: 'Finish a Story Quest',                    earned: false },
  { id: 'star_10',        name: 'Star Collector',  emoji: '⭐', desc: 'Earn 10 stars total',                     earned: false },
  { id: 'coin_50',        name: 'Coin Hoarder',    emoji: '🪙', desc: 'Earn 50 coins total',                     earned: false },
  { id: 'streak_3',       name: 'On Fire!',        emoji: '🔥', desc: 'Play 3 days in a row',                    earned: false },
  { id: 'streak_7',       name: 'Week Warrior',    emoji: '🏆', desc: 'Play 7 days in a row',                    earned: false },
]

const KEY = 'sparkplay_v1_progress'

function emptyProgress(): Progress {
  return {
    totalStars: 0,
    totalCoins: 0,
    streak: 0,
    lastPlayedDate: null,
    badges: ALL_BADGES.map((b) => ({ ...b })),
    gameHistory: [],
    childName: '',
  }
}

// Maps old badge IDs → current IDs so earned status survives renames
const BADGE_ID_MIGRATIONS: Record<string, string> = {
  star_collector: 'star_10',
  coin_hoarder:   'coin_50',
  on_fire:        'streak_3',
  week_warrior:   'streak_7',
  star_5:         'star_10',
  star_20:        'star_10',
}

export function getProgress(): Progress {
  if (typeof window === 'undefined') return emptyProgress()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyProgress()
    const p = JSON.parse(raw) as Progress

    // 1. Migrate old IDs → current IDs
    for (const badge of p.badges) {
      if (BADGE_ID_MIGRATIONS[badge.id]) badge.id = BADGE_ID_MIGRATIONS[badge.id]
    }

    // 2. Deduplicate (keep highest earned status per ID)
    const seen = new Map<string, Badge>()
    for (const b of p.badges) {
      const existing = seen.get(b.id)
      if (!existing || (!existing.earned && b.earned)) seen.set(b.id, b)
    }
    p.badges = Array.from(seen.values())

    // 3. Remove truly obsolete IDs not in ALL_BADGES
    const validIds = new Set(ALL_BADGES.map((b) => b.id))
    p.badges = p.badges.filter((b) => validIds.has(b.id))

    // 4. Add any brand-new badges introduced in app updates
    const presentIds = new Set(p.badges.map((b) => b.id))
    for (const b of ALL_BADGES) {
      if (!presentIds.has(b.id)) p.badges.push({ ...b })
    }

    return p
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function setChildName(name: string): void {
  const p = getProgress()
  p.childName = name
  saveProgress(p)
}

export function getChildName(): string {
  return getProgress().childName
}

// ─── Star calculation ───────────────────────────────────────────────────────

export function calcStars(
  moves: number,
  unit: number,           // pairs | maze size | tile count
  template: string,
): number {
  const thresholds: Record<string, [number, number]> = {
    memory:  [1.5, 2.5],
    maze:    [2.5, 4.0],
    puzzle:  [3.0, 5.0],
    story:   [2.0, 4.0],
  }
  const [gold, silver] = thresholds[template] ?? [1.5, 2.5]
  if (moves <= Math.ceil(unit * gold))   return 3
  if (moves <= Math.ceil(unit * silver)) return 2
  return 1
}

// ─── Coin calculation ───────────────────────────────────────────────────────

export function calcCoins(stars: number, level: number): number {
  return 10 + (stars - 1) * 5 + level * 2
}

// ─── Main entry point ───────────────────────────────────────────────────────

export type CompletionResult = {
  stars: number
  coinsEarned: number
  newBadges: Badge[]
  streak: number
}

/**
 * Call this once per level/game completion.
 * @param templateType  'memory' | 'maze' | 'puzzle' | 'story'
 * @param theme         theme id string
 * @param ageGroup      age group string
 * @param level         1–5 (use 1 for single-level games)
 * @param moves         actual moves/choices made
 * @param unit          pairs (memory) | maze size (maze) | tile count (puzzle) | choices (story)
 */
export function recordCompletion(
  templateType: string,
  theme: string,
  ageGroup: string,
  level: number,
  moves: number,
  unit: number,
): CompletionResult {
  const p = getProgress()
  const stars = calcStars(moves, unit, templateType)
  const coinsEarned = calcCoins(stars, level)

  // ── Streak ──────────────────────────────────────────────────────────────
  const today     = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86_400_000).toDateString()
  if (p.lastPlayedDate === today) {
    // same day — streak already counted
  } else if (p.lastPlayedDate === yesterday) {
    p.streak += 1     // consecutive day
  } else {
    p.streak = 1      // streak broken or first play
  }
  p.lastPlayedDate = today

  p.totalStars  += stars
  p.totalCoins  += coinsEarned

  // ── Game history ─────────────────────────────────────────────────────────
  const rec = p.gameHistory.find(
    (g) => g.templateType === templateType && g.theme === theme && g.ageGroup === ageGroup,
  )
  if (rec) {
    if (!rec.levelsCompleted.includes(level)) rec.levelsCompleted.push(level)
    rec.starsPerLevel[level] = Math.max(rec.starsPerLevel[level] ?? 0, stars)
    rec.coinsEarned += coinsEarned
  } else {
    p.gameHistory.push({
      templateType, theme, ageGroup,
      levelsCompleted: [level],
      starsPerLevel: { [level]: stars },
      coinsEarned,
    })
  }

  // ── Badge checks ─────────────────────────────────────────────────────────
  const newBadges: Badge[] = []
  function earn(id: string) {
    const badge = p.badges.find((b) => b.id === id)
    if (badge && !badge.earned) {
      badge.earned = true
      badge.earnedAt = new Date().toISOString()
      newBadges.push({ ...badge })
    }
  }

  earn('first_win')

  if (templateType === 'memory') {
    if (level === 5)   earn('memory_ace')
    if (stars === 3)   earn('perfect_memory')
  }
  if (templateType === 'puzzle')  earn('puzzle_pro')
  if (templateType === 'story')   earn('story_hero')
  if (templateType === 'maze') {
    const mazeSolves = p.gameHistory
      .filter((g) => g.templateType === 'maze')
      .reduce((s, g) => s + g.levelsCompleted.length, 0)
    if (mazeSolves >= 3) earn('maze_runner')
  }

  if (p.totalStars  >= 10)  earn('star_10')
  if (p.totalCoins  >= 50)  earn('coin_50')
  if (p.streak      >= 3)   earn('streak_3')
  if (p.streak      >= 7)   earn('streak_7')

  saveProgress(p)
  return { stars, coinsEarned, newBadges, streak: p.streak }
}
