// Word Search grid generation + validation

export type GridCell = {
  letter: string
  row: number
  col: number
}

export type PlacedWord = {
  word: string
  startRow: number
  startCol: number
  dirRow: number  // -1, 0, or 1
  dirCol: number  // -1, 0, or 1
}

export type GridResult = {
  grid: GridCell[][]
  placed: PlacedWord[]
}

export type CellPos = { row: number; col: number }

// ─── Grid size per age group ───────────────────────────────────────────────

export const GRID_SIZES: Record<string, number> = {
  '2-4':  7,
  '4-6':  8,
  '6-8':  10,
  '8-12': 12,
}

// ─── Theme word banks ──────────────────────────────────────────────────────

const WORD_BANKS: Record<string, string[]> = {
  animals:     ['DOG', 'CAT', 'LION', 'BEAR', 'FISH', 'BIRD', 'FROG', 'DUCK', 'WOLF', 'DEER', 'CROW', 'MOLE'],
  dinos:       ['TREX', 'DINO', 'CLAW', 'ROAR', 'BONE', 'TAIL', 'FANG', 'WING', 'NEST', 'HERD', 'GIGA', 'FOSSIL'],
  unicorns:    ['HORN', 'WISH', 'GLOW', 'STAR', 'MOON', 'PINK', 'GOLD', 'FAIRY', 'MAGIC', 'DREAM', 'LOVE'],
  ocean:       ['FISH', 'WAVE', 'REEF', 'CRAB', 'SHARK', 'WHALE', 'PEARL', 'TIDE', 'SAND', 'CORAL', 'SEAL'],
  space:       ['STAR', 'MOON', 'MARS', 'ORBIT', 'COMET', 'ALIEN', 'RING', 'SUN', 'NOVA', 'DUST', 'DARK'],
  superheroes: ['CAPE', 'HERO', 'SAVE', 'MASK', 'FLY', 'LEAP', 'BRAVE', 'SWIFT', 'POWER', 'FIST', 'GUARD'],
  farm:        ['COW', 'PIG', 'HEN', 'BARN', 'HAY', 'CROP', 'MILK', 'SEED', 'RAIN', 'SOIL', 'TOOL'],
  food:        ['CAKE', 'TACO', 'RICE', 'SOUP', 'MILK', 'BEEF', 'PORK', 'SALT', 'LIME', 'PLUM', 'MINT'],
}

export function getWordsForTheme(theme: string): string[] {
  return WORD_BANKS[theme] ?? []
}

// All 8 directions: horiz, vert, diag
const DIRECTIONS: [number, number][] = [
  [0, 1], [0, -1],  // right, left
  [1, 0], [-1, 0],  // down, up
  [1, 1], [1, -1],  // diag ↘ ↙
  [-1, 1], [-1, -1], // diag ↗ ↖
]

// ─── Grid builder ─────────────────────────────────────────────────────────

export function buildGrid(words: string[], size: number): GridResult {
  // Initialise with empty letters
  const grid: GridCell[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({ letter: '', row: r, col: c })),
  )

  const placed: PlacedWord[] = []

  for (const word of words) {
    if (word.length > size) continue
    const success = tryPlaceWord(grid, word, size)
    if (success) placed.push(success)
  }

  // Fill remaining empty cells with random uppercase letters
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c].letter) {
        grid[r][c].letter = alpha[Math.floor(Math.random() * alpha.length)]
      }
    }
  }

  return { grid, placed }
}

function tryPlaceWord(grid: GridCell[][], word: string, size: number): PlacedWord | null {
  // Shuffle directions to get variety
  const dirs = [...DIRECTIONS].sort(() => Math.random() - 0.5)

  for (let attempt = 0; attempt < 80; attempt++) {
    const startRow = Math.floor(Math.random() * size)
    const startCol = Math.floor(Math.random() * size)
    const [dr, dc] = dirs[attempt % dirs.length]

    const endRow = startRow + dr * (word.length - 1)
    const endCol = startCol + dc * (word.length - 1)

    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue

    // Check no conflict
    let canPlace = true
    for (let i = 0; i < word.length; i++) {
      const cell = grid[startRow + dr * i][startCol + dc * i]
      if (cell.letter && cell.letter !== word[i]) { canPlace = false; break }
    }

    if (!canPlace) continue

    // Place it
    for (let i = 0; i < word.length; i++) {
      grid[startRow + dr * i][startCol + dc * i].letter = word[i]
    }
    return { word, startRow, startCol, dirRow: dr, dirCol: dc }
  }

  return null
}

// ─── Validation helpers ────────────────────────────────────────────────────

export function getWordPositions(grid: GridCell[][], placed: PlacedWord): CellPos[] {
  return Array.from({ length: placed.word.length }, (_, i) => ({
    row: placed.startRow + placed.dirRow * i,
    col: placed.startCol + placed.dirCol * i,
  }))
}

/**
 * Validates that a user-selected path of cells is a straight, non-repeating line.
 * Accepts horizontal, vertical, and diagonal (45°) paths.
 */
export function isValidPath(path: CellPos[]): boolean {
  if (path.length === 0) return false
  if (path.length === 1) return true

  // Check for duplicates
  const seen = new Set(path.map((p) => `${p.row},${p.col}`))
  if (seen.size !== path.length) return false

  const dr = Math.sign(path[1].row - path[0].row)
  const dc = Math.sign(path[1].col - path[0].col)

  // Must move in at least one direction
  if (dr === 0 && dc === 0) return false

  for (let i = 1; i < path.length; i++) {
    const actualDr = Math.sign(path[i].row - path[i - 1].row)
    const actualDc = Math.sign(path[i].col - path[i - 1].col)
    if (actualDr !== dr || actualDc !== dc) return false
  }

  return true
}

/**
 * Given a path and the full grid, extract the word string.
 */
export function pathToWord(grid: GridCell[][], path: CellPos[]): string {
  return path.map((p) => grid[p.row]?.[p.col]?.letter ?? '').join('')
}

/**
 * Check if a user-selected path matches any placed word.
 */
export function checkPath(
  grid: GridCell[][],
  placed: PlacedWord[],
  path: CellPos[],
): PlacedWord | null {
  if (!isValidPath(path)) return null
  const word = pathToWord(grid, path)
  return placed.find((p) => {
    const positions = getWordPositions(grid, p)
    if (positions.length !== path.length) return false
    return positions.every((pos, i) => pos.row === path[i].row && pos.col === path[i].col)
  }) ?? (placed.find((p) => p.word === word) ?? null)
}
