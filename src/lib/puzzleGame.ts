/**
 * Puzzle Maker — Jigsaw Game Library
 *
 * Image slicing uses CSS background-position so no Canvas API is needed.
 * The generated image URL is set as background-image on each piece div;
 * background-size covers the full image, and bgX/bgY shift to show the
 * correct tile.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

export type PuzzlePiece = {
  id: number
  row: number
  col: number
  bgX: number       // CSS background-position-x (negative px value)
  bgY: number       // CSS background-position-y (negative px value)
  pieceW: number    // width of each piece in px
  pieceH: number    // height of each piece in px
}

export type DifficultyLevel = '6' | '12' | '24'

// ─── Difficulty grids ──────────────────────────────────────────────────────

export const DIFFICULTY_GRID: Record<DifficultyLevel, { cols: number; rows: number }> = {
  '6':  { cols: 3, rows: 2 },
  '12': { cols: 4, rows: 3 },
  '24': { cols: 6, rows: 4 },
}

// ─── AI Scenarios ──────────────────────────────────────────────────────────
// Each scenario generates a personalised illustration via gpt-image-1.
// The prompt function weaves in the child's name naturally.

export type PuzzleScenario = {
  id: string
  label: string        // shown in the picker UI
  emoji: string
  theme: string        // matches themes.ts theme id
  prompt: (name: string) => string
}

const STYLE = [
  "children's book illustration",
  'wide landscape composition',
  'bright vibrant colours',
  'Pixar-inspired cartoon style',
  'soft digital art',
  'no text or watermarks',
  'suitable for ages 2–12',
].join(', ')

export const PUZZLE_SCENARIOS: PuzzleScenario[] = [
  {
    id: 'horse-ride',
    label: 'riding a horse',
    emoji: '🐴',
    theme: 'farm',
    prompt: (name) =>
      `${STYLE}: a joyful child named ${name} riding a friendly cartoon horse through a golden sunlit meadow full of flowers`,
  },
  {
    id: 'veggie-cook',
    label: 'cooking rainbow veggies',
    emoji: '🥕',
    theme: 'food',
    prompt: (name) =>
      `${STYLE}: an excited child named ${name} cooking a giant colourful vegetable feast in a cosy magical kitchen`,
  },
  {
    id: 'space-float',
    label: 'floating in space',
    emoji: '🚀',
    theme: 'space',
    prompt: (name) =>
      `${STYLE}: a happy child named ${name} in a colourful spacesuit floating weightlessly among friendly cartoon planets and stars`,
  },
  {
    id: 'dino-play',
    label: 'playing with dinosaurs',
    emoji: '🦕',
    theme: 'dinos',
    prompt: (name) =>
      `${STYLE}: a delighted child named ${name} playing catch with a friendly baby brachiosaurus in a lush prehistoric jungle`,
  },
  {
    id: 'ocean-swim',
    label: 'swimming with dolphins',
    emoji: '🐬',
    theme: 'ocean',
    prompt: (name) =>
      `${STYLE}: a laughing child named ${name} swimming alongside cheerful dolphins in a sparkling turquoise ocean`,
  },
  {
    id: 'unicorn-fly',
    label: 'flying on a unicorn',
    emoji: '🦄',
    theme: 'unicorns',
    prompt: (name) =>
      `${STYLE}: a joyful child named ${name} soaring through a rainbow sky on a magical sparkly unicorn`,
  },
  {
    id: 'superhero-fly',
    label: 'flying as a superhero',
    emoji: '⚡',
    theme: 'superheroes',
    prompt: (name) =>
      `${STYLE}: a triumphant child named ${name} in a colourful superhero cape flying above a bright cartoon city`,
  },
  {
    id: 'puppy-play',
    label: 'playing with baby animals',
    emoji: '🐾',
    theme: 'animals',
    prompt: (name) =>
      `${STYLE}: an overjoyed child named ${name} surrounded by adorable baby animals — puppies, kittens, bunnies — in a sunny park`,
  },
]

// ─── Piece factory ──────────────────────────────────────────────────────────

/**
 * Create all pieces for a puzzle grid.
 * @param cols   Number of columns
 * @param rows   Number of rows
 * @param imgW   Total image width in pixels (used for CSS background-size)
 * @param imgH   Total image height in pixels
 */
export function createPieces(cols: number, rows: number, imgW: number, imgH: number): PuzzlePiece[] {
  const pieceW = imgW / cols
  const pieceH = imgH / rows
  const pieces: PuzzlePiece[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pieces.push({
        id:     r * cols + c,
        row:    r,
        col:    c,
        bgX:    c === 0 ? 0 : -(c * pieceW),
        bgY:    r === 0 ? 0 : -(r * pieceH),
        pieceW,
        pieceH,
      })
    }
  }

  return pieces
}

// ─── Game helpers ───────────────────────────────────────────────────────────

export function isPieceCorrect(piece: PuzzlePiece, dropRow: number, dropCol: number): boolean {
  return piece.row === dropRow && piece.col === dropCol
}

/** Fisher-Yates shuffle — does not mutate the original array */
export function shufflePieces(pieces: PuzzlePiece[]): PuzzlePiece[] {
  const arr = [...pieces]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ─── AI prompt builder ──────────────────────────────────────────────────────

export function generatePuzzlePrompt(childName: string, scenarioLabel: string): string {
  const name = childName?.trim() || 'a child'
  return [
    `Charming children's book illustration of ${name} ${scenarioLabel},`,
    'wide landscape composition 16:9,',
    'Pixar-inspired cartoon style, bright vibrant saturated colours,',
    'warm and joyful mood, soft digital painting,',
    'no text, no watermarks, no borders,',
    'suitable for children ages 2–12',
  ].join(' ')
}

// ─── Cache key ──────────────────────────────────────────────────────────────

/** LocalStorage key for a generated image, stable per child+scenario */
export function getCacheKey(childName: string, scenarioId: string): string {
  return `puzzle:${(childName ?? '').trim().toLowerCase()}:${scenarioId}`
}
