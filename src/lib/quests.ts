// Daily quest system — one quest per day, progress in localStorage

const STORAGE_PREFIX = 'sp_quest_'

export interface Quest {
  id: string
  emoji: string
  title: string
  description: string
  target: number
  game: string   // which game type triggers progress
}

const TEMPLATES: Quest[] = [
  { id: 'match_pairs',   emoji: '🃏', title: 'Card Master',    description: 'Match 6 pairs in Memory Match',      target: 6,  game: 'memory'      },
  { id: 'find_words',    emoji: '🔤', title: 'Word Hunter',    description: 'Find 4 hidden words',                target: 4,  game: 'word_search'  },
  { id: 'quiz_correct',  emoji: '❓', title: 'Quiz Whiz',      description: 'Complete a quiz round',              target: 1,  game: 'quiz'         },
  { id: 'solve_puzzle',  emoji: '🧩', title: 'Puzzle Pro',     description: 'Solve the sliding puzzle',           target: 1,  game: 'puzzle'       },
  { id: 'escape_maze',   emoji: '🌀', title: 'Maze Runner',    description: 'Escape the maze',                    target: 1,  game: 'maze'         },
  { id: 'daily_play',    emoji: '🎮', title: 'Daily Player',   description: 'Complete 3 game levels today',       target: 3,  game: 'any'          },
  { id: 'finish_story',  emoji: '📖', title: 'Story Explorer', description: 'Reach an ending in Story Quest',     target: 1,  game: 'story'        },
  { id: 'star_collect',  emoji: '⭐', title: 'Star Collector', description: 'Earn a 3-star score in any game',    target: 1,  game: 'any'          },
]

function todayKey() {
  return new Date().toISOString().slice(0, 10)   // YYYY-MM-DD
}

function dayIndex() {
  // Deterministic quest rotation — cycles through templates by calendar day
  const msPerDay = 86_400_000
  return Math.floor(Date.now() / msPerDay) % TEMPLATES.length
}

export function getDailyQuest(): Quest {
  return TEMPLATES[dayIndex()]
}

export function getQuestProgress(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(`${STORAGE_PREFIX}${todayKey()}`) ?? '0', 10)
}

export function updateQuestProgress(amount = 1): { progress: number; justCompleted: boolean } {
  if (typeof window === 'undefined') return { progress: 0, justCompleted: false }
  const quest = getDailyQuest()
  const prev = getQuestProgress()
  if (prev >= quest.target) return { progress: prev, justCompleted: false }  // already done
  const next = Math.min(prev + amount, quest.target)
  localStorage.setItem(`${STORAGE_PREFIX}${todayKey()}`, String(next))
  return { progress: next, justCompleted: next >= quest.target }
}

export function isQuestComplete(): boolean {
  return getQuestProgress() >= getDailyQuest().target
}

// Games playable directly from the home page (no auth / dashboard needed)
const HOME_GAMES = new Set(['memory', 'any'])

export interface QuestCTA {
  action: 'scroll' | 'navigate'
  label: string
  href?: string   // only set when action === 'navigate'
}

const GAME_LABELS: Record<string, string> = {
  memory:       'Play Memory Match →',
  quiz:         'Play Quiz →',
  word_search:  'Play Word Search →',
  maze:         'Play Maze →',
  story:        'Play Story Quest →',
  puzzle:       'Play Sliding Puzzle →',
  number_merge: 'Play Number Merge →',
  puzzle_maker: 'Play Puzzle Maker →',
  any:          'Play a game →',
}

export function getQuestCTA(gameType: string): QuestCTA {
  if (HOME_GAMES.has(gameType)) {
    return { action: 'scroll', label: GAME_LABELS[gameType] ?? 'Play a game →' }
  }
  return {
    action: 'navigate',
    href: '/dashboard',
    label: GAME_LABELS[gameType] ?? 'Play in Dashboard →',
  }
}

// Call this from any game's onLevelComplete to auto-advance the daily quest.
// Pass the game type ('memory', 'quiz', 'word_search', 'puzzle', 'maze', 'story').
export function recordGameForQuest(gameType: string) {
  const quest = getDailyQuest()
  if (quest.game === 'any' || quest.game === gameType) {
    updateQuestProgress(1)
  }
  // Always count toward 'daily_play' regardless
  if (quest.id === 'daily_play') {
    updateQuestProgress(1)
  }
}
