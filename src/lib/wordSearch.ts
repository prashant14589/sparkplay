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

// ─── Age-stratified theme word banks ─────────────────────────────────────
// 4-6: short (3-4 letters) — decodable, single-syllable
// 6-8: medium (4-6 letters) — familiar but challenging
// 8-12: longer (6-9 letters) — vocabulary-building

const WORD_BANKS_BY_AGE: Record<string, Record<string, string[]>> = {
  animals: {
    '4-6':  ['CAT', 'DOG', 'COW', 'PIG', 'HEN', 'BEE', 'ANT', 'OWL', 'FOX', 'RAT', 'ELK', 'YAK'],
    '6-8':  ['TIGER', 'EAGLE', 'SNAKE', 'HIPPO', 'PANDA', 'COBRA', 'OTTER', 'MOOSE', 'BISON', 'GECKO', 'RAVEN', 'HYENA'],
    '8-12': ['DOLPHIN', 'PENGUIN', 'CHEETAH', 'PANTHER', 'LEOPARD', 'VULTURE', 'PIRANHA', 'GORILLA', 'GAZELLE', 'MANATEE', 'NARWHAL', 'WALRUS'],
  },
  dinos: {
    '4-6':  ['REX', 'CLAW', 'TAIL', 'BONE', 'NEST', 'ROAR', 'WING', 'HERD', 'FANG', 'DOME', 'SLOW', 'HUGE'],
    '6-8':  ['CREST', 'FRILL', 'SPIKE', 'PLATE', 'ARMOR', 'SWIFT', 'SCALE', 'TEETH', 'GIANT', 'FLIER', 'CLAWS', 'TREX'],
    '8-12': ['RAPTOR', 'FOSSIL', 'ANCIENT', 'EXTINCT', 'PREDATOR', 'THEROPOD', 'JURASSIC', 'ARMORED', 'SPECIES', 'SAUROPOD', 'REPTILE', 'HABITAT'],
  },
  unicorns: {
    '4-6':  ['HORN', 'WISH', 'GLOW', 'STAR', 'MOON', 'PINK', 'GOLD', 'LOVE', 'GIFT', 'SOFT', 'PURE', 'SILK'],
    '6-8':  ['MAGIC', 'FAIRY', 'CHARM', 'PRISM', 'DREAM', 'CLOUD', 'PEARL', 'DANCE', 'GRACE', 'GLEAM', 'WINGS', 'TIARA'],
    '8-12': ['CRYSTAL', 'GLITTER', 'RAINBOW', 'ENCHANT', 'SPARKLE', 'FANTASY', 'STARDUST', 'SHIMMER', 'MAGICAL', 'MYSTICAL', 'WONDROUS', 'RADIANT'],
  },
  ocean: {
    '4-6':  ['FISH', 'CRAB', 'WAVE', 'REEF', 'TIDE', 'SAND', 'SEAL', 'CLAM', 'FOAM', 'GULL', 'KELP', 'POOL'],
    '6-8':  ['SHARK', 'WHALE', 'CORAL', 'PEARL', 'SQUID', 'PRAWN', 'TROUT', 'BEACH', 'SHELL', 'BRINE', 'SWIRL', 'ALGAE'],
    '8-12': ['DOLPHIN', 'OCTOPUS', 'JELLYFISH', 'PLANKTON', 'NAUTILUS', 'SEAHORSE', 'MANATEE', 'LOBSTER', 'CURRENT', 'TSUNAMI', 'ABYSSAL', 'BARNACLE'],
  },
  space: {
    '4-6':  ['STAR', 'MOON', 'SUN', 'MARS', 'RING', 'NOVA', 'DUST', 'GLOW', 'VAST', 'DARK', 'VOID', 'BEAM'],
    '6-8':  ['ORBIT', 'COMET', 'ALIEN', 'LUNAR', 'SOLAR', 'PROBE', 'RINGS', 'FLARE', 'PULSE', 'TITAN', 'PLUTO', 'VENUS'],
    '8-12': ['NEBULA', 'GALAXY', 'ECLIPSE', 'GRAVITY', 'MISSION', 'STATION', 'ASTEROID', 'SATELLITE', 'BLACKHOLE', 'SUPERNOVA', 'WORMHOLE', 'LIGHTYEAR'],
  },
  superheroes: {
    '4-6':  ['CAPE', 'HERO', 'MASK', 'FLY', 'SAVE', 'LEAP', 'FAST', 'BOLD', 'RISE', 'WING', 'BEAM', 'GLOW'],
    '6-8':  ['BRAVE', 'SWOOP', 'POWER', 'GUARD', 'SPEED', 'SQUAD', 'VAULT', 'BLAZE', 'SURGE', 'LASER', 'SCOUT', 'RIVAL'],
    '8-12': ['JUSTICE', 'STRENGTH', 'FEARLESS', 'CHAMPION', 'DEFENDER', 'SIDEKICK', 'IDENTITY', 'VILLAIN', 'MISSION', 'INVINCIBLE', 'FORTRESS', 'SHIELD'],
  },
  farm: {
    '4-6':  ['COW', 'PIG', 'HEN', 'HAY', 'BARN', 'SOIL', 'SEED', 'MILK', 'RAIN', 'LAMB', 'GOAT', 'CROP'],
    '6-8':  ['SHEEP', 'GOOSE', 'HORSE', 'WHEAT', 'MAIZE', 'FENCE', 'GRASS', 'CHICK', 'GRAIN', 'ROOST', 'BROOK', 'PETAL'],
    '8-12': ['HARVEST', 'TRACTOR', 'ORCHARD', 'PASTURE', 'COMPOST', 'IRRIGATION', 'LIVESTOCK', 'POULTRY', 'FURROW', 'THRESHER', 'FARMSTEAD', 'WINDMILL'],
  },
  food: {
    '4-6':  ['CAKE', 'RICE', 'MILK', 'LIME', 'PLUM', 'MINT', 'CORN', 'BEET', 'PEAR', 'BEAN', 'TUNA', 'CHIP'],
    '6-8':  ['PIZZA', 'BREAD', 'PASTA', 'LEMON', 'CREAM', 'SPICE', 'SALAD', 'GRAVY', 'STEAK', 'WAFER', 'MANGO', 'MAPLE'],
    '8-12': ['SAFFRON', 'CINNAMON', 'TURMERIC', 'AVOCADO', 'BROCCOLI', 'BARBECUE', 'SOURDOUGH', 'CARAMEL', 'CROISSANT', 'SMOOTHIE', 'BURRITO', 'RISOTTO'],
  },
}

export function getWordsForTheme(theme: string, ageGroup = '6-8'): string[] {
  const banks = WORD_BANKS_BY_AGE[theme]
  if (!banks) return []
  // Fall back to '6-8' if exact age group not found
  return banks[ageGroup] ?? banks['6-8'] ?? []
}

// All 8 directions: horiz, vert, diag
const DIRECTIONS_ALL: [number, number][] = [
  [0, 1], [0, -1],   // right, left
  [1, 0], [-1, 0],   // down, up
  [1, 1], [1, -1],   // diag ↘ ↙
  [-1, 1], [-1, -1], // diag ↗ ↖
]

// Horizontal + vertical only (no diagonals) — easier for younger players
const DIRECTIONS_SIMPLE: [number, number][] = [
  [0, 1], [0, -1],  // right, left
  [1, 0], [-1, 0],  // down, up
]

// ─── Grid builder ─────────────────────────────────────────────────────────

export function buildGrid(words: string[], size: number, allowDiagonals = true): GridResult {
  const directions = allowDiagonals ? DIRECTIONS_ALL : DIRECTIONS_SIMPLE

  // Initialise with empty letters
  const grid: GridCell[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({ letter: '', row: r, col: c })),
  )

  const placed: PlacedWord[] = []

  for (const word of words) {
    if (word.length > size) continue
    const success = tryPlaceWord(grid, word, size, directions)
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

function tryPlaceWord(grid: GridCell[][], word: string, size: number, directions: [number, number][]): PlacedWord | null {
  const dirs = [...directions].sort(() => Math.random() - 0.5)

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

/**
 * Given a start cell and an end cell, compute the full straight-line path.
 * Returns null if the two points don't form a straight horizontal, vertical,
 * or 45° diagonal line — i.e. the kind of paths a word-search allows.
 *
 * This is used by the WordSearch component to rebuild the selection path on
 * every pointer-move event (start→current), which correctly handles diagonals
 * without accumulating stray intermediate cells.
 */
export function computePathFromStartTo(
  start: CellPos,
  end: CellPos,
): CellPos[] | null {
  const rowDiff = end.row - start.row
  const colDiff = end.col - start.col

  // Same cell
  if (rowDiff === 0 && colDiff === 0) return [start]

  const dr = Math.sign(rowDiff)
  const dc = Math.sign(colDiff)

  const absRow = Math.abs(rowDiff)
  const absCol = Math.abs(colDiff)

  // Must be horizontal, vertical, or exactly 45° diagonal
  if (dr !== 0 && dc !== 0 && absRow !== absCol) return null

  const distance = Math.max(absRow, absCol)
  return Array.from({ length: distance + 1 }, (_, i) => ({
    row: start.row + dr * i,
    col: start.col + dc * i,
  }))
}


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
