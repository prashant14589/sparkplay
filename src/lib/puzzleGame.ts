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
].join(', ')

// ─── Age-specific scenario banks ───────────────────────────────────────────
// Vocabulary, themes, and aspirations matched to developmental stage.

export const PUZZLE_SCENARIOS_BY_AGE: Record<string, PuzzleScenario[]> = {

  // 2–4 Toddlers: familiar, safe, joyful — no aspiration, just delight
  '2-4': [
    { id: 'puppy-hug',     label: 'hugging a puppy',        emoji: '🐶', theme: 'animals',
      prompt: (n) => `${STYLE}, gentle toddler style: ${n} giving a big hug to a fluffy golden puppy in a sunny garden` },
    { id: 'puddle-splash', label: 'splashing in puddles',   emoji: '💦', theme: 'ocean',
      prompt: (n) => `${STYLE}: ${n} gleefully jumping in rainbow puddles wearing bright rain boots` },
    { id: 'bubbles',       label: 'blowing bubbles',        emoji: '🫧', theme: 'unicorns',
      prompt: (n) => `${STYLE}: ${n} blowing giant shimmery soap bubbles in a sunny meadow, bubbles floating everywhere` },
    { id: 'teddy-hug',     label: 'hugging a teddy bear',   emoji: '🧸', theme: 'animals',
      prompt: (n) => `${STYLE}: ${n} cuddling an enormous friendly teddy bear in a cosy bedroom` },
    { id: 'duck-feed',     label: 'feeding baby ducks',     emoji: '🦆', theme: 'farm',
      prompt: (n) => `${STYLE}: ${n} tossing breadcrumbs to a parade of fluffy yellow ducklings at a pond` },
    { id: 'trike-ride',    label: 'riding a tricycle',      emoji: '🚲', theme: 'superheroes',
      prompt: (n) => `${STYLE}: ${n} happily pedalling a bright red tricycle down a flower-lined path` },
    { id: 'icecream',      label: 'eating ice cream',       emoji: '🍦', theme: 'food',
      prompt: (n) => `${STYLE}: ${n} holding a giant rainbow ice cream cone, looking absolutely delighted` },
    { id: 'butterfly',     label: 'chasing butterflies',    emoji: '🦋', theme: 'animals',
      prompt: (n) => `${STYLE}: ${n} running through a flower field chasing giant colourful butterflies` },
  ],

  // 4–6 Preschool: concrete + slightly magical, first adventures
  '4-6': [
    { id: 'horse-ride',    label: 'riding a horse',         emoji: '🐴', theme: 'farm',
      prompt: (n) => `${STYLE}: ${n} riding a friendly cartoon horse through a golden sunlit meadow full of flowers` },
    { id: 'veggie-cook',   label: 'baking rainbow cupcakes',emoji: '🧁', theme: 'food',
      prompt: (n) => `${STYLE}: ${n} baking giant rainbow cupcakes in a cosy magical kitchen, flour everywhere` },
    { id: 'magic-carpet',  label: 'flying on a magic carpet',emoji: '✨', theme: 'unicorns',
      prompt: (n) => `${STYLE}: ${n} riding a sparkling magic carpet over a colourful cartoon city at sunset` },
    { id: 'sandcastle',    label: 'building a sandcastle',  emoji: '🏰', theme: 'ocean',
      prompt: (n) => `${STYLE}: ${n} building an enormous sandcastle on a sunny beach, waves in the background` },
    { id: 'fairy-dance',   label: 'dancing with fairies',   emoji: '🧚', theme: 'unicorns',
      prompt: (n) => `${STYLE}: ${n} dancing in a moonlit glade surrounded by tiny glowing fairies` },
    { id: 'ocean-swim',    label: 'swimming with dolphins',  emoji: '🐬', theme: 'ocean',
      prompt: (n) => `${STYLE}: ${n} swimming alongside cheerful dolphins in a sparkling turquoise ocean` },
    { id: 'dragon-feed',   label: 'feeding friendly dragons',emoji: '🐲', theme: 'dinos',
      prompt: (n) => `${STYLE}: ${n} offering berries to a small friendly baby dragon in a magical forest` },
    { id: 'unicorn-fly',   label: 'flying on a unicorn',    emoji: '🦄', theme: 'unicorns',
      prompt: (n) => `${STYLE}: ${n} soaring through a rainbow sky on a magical sparkly unicorn` },
  ],

  // 6–8 Early school: adventure with mild stakes, exploration, achievement
  '6-8': [
    { id: 'space-float',   label: 'floating in outer space',emoji: '🚀', theme: 'space',
      prompt: (n) => `${STYLE}: ${n} in a colourful spacesuit floating beside a glowing nebula, Earth visible below` },
    { id: 'dino-play',     label: 'training a fire dragon', emoji: '🔥', theme: 'dinos',
      prompt: (n) => `${STYLE}: ${n} bravely training a small fire-breathing dragon on a clifftop at sunset` },
    { id: 'treasure',      label: 'discovering hidden treasure',emoji: '💎', theme: 'ocean',
      prompt: (n) => `${STYLE}: ${n} opening a glowing treasure chest in an underwater cave surrounded by fish` },
    { id: 'volcano',       label: 'exploring a volcano',    emoji: '🌋', theme: 'dinos',
      prompt: (n) => `${STYLE}: ${n} in explorer gear peering into a dramatic volcano crater with a dinosaur beside them` },
    { id: 'skate-city',    label: 'skateboarding through a city',emoji: '🛹', theme: 'superheroes',
      prompt: (n) => `${STYLE}: ${n} doing a trick on a skateboard flying through a vibrant cartoon cityscape` },
    { id: 'treehouse',     label: 'building a jungle treehouse',emoji: '🌳', theme: 'animals',
      prompt: (n) => `${STYLE}: ${n} hammering together an epic treehouse high in a jungle canopy, parrots watching` },
    { id: 'safari',        label: 'going on an African safari',emoji: '🦁', theme: 'animals',
      prompt: (n) => `${STYLE}: ${n} in a safari jeep watching elephants and giraffes at golden hour` },
    { id: 'pirate',        label: 'sailing on a pirate ship',emoji: '⚓', theme: 'ocean',
      prompt: (n) => `${STYLE}: ${n} at the helm of a grand pirate ship sailing past dramatic sea cliffs` },
  ],

  // 8–12 Tweens: aspirational, mature tone, complexity & consequence
  '8-12': [
    { id: 'rocket-launch', label: 'launching a rocket into orbit',emoji: '🛸', theme: 'space',
      prompt: (n) => `${STYLE}, slightly more realistic Pixar style: ${n} as a mission commander watching their rocket launch into orbit from a futuristic control room` },
    { id: 'desert-island', label: 'surviving on a deserted island',emoji: '🏝️', theme: 'ocean',
      prompt: (n) => `${STYLE}: ${n} building a shelter on a tropical island, having just discovered fresh water, dramatic sunset behind them` },
    { id: 'secret-code',   label: 'cracking an ancient code',emoji: '🔐', theme: 'superheroes',
      prompt: (n) => `${STYLE}: ${n} deciphering glowing ancient hieroglyphs on a stone wall deep inside a mysterious temple` },
    { id: 'neon-race',     label: 'racing through a neon city',emoji: '🏎️', theme: 'superheroes',
      prompt: (n) => `${STYLE}: ${n} piloting a glowing hover-car through a neon-drenched futuristic city at night` },
    { id: 'tournament',    label: 'winning a championship',emoji: '🏆', theme: 'superheroes',
      prompt: (n) => `${STYLE}: ${n} holding a glowing championship trophy on a grand stadium stage with fireworks overhead` },
    { id: 'robot-design',  label: 'building a giant robot',emoji: '🤖', theme: 'space',
      prompt: (n) => `${STYLE}: ${n} putting the finishing touches on a towering friendly robot in a high-tech workshop` },
    { id: 'deep-sea',      label: 'exploring a sunken ship',emoji: '🌊', theme: 'ocean',
      prompt: (n) => `${STYLE}: ${n} in a sleek diving suit exploring a dramatic ancient shipwreck on the ocean floor, bioluminescent creatures around` },
    { id: 'storm-hero',    label: 'flying through a superstorm',emoji: '⚡', theme: 'superheroes',
      prompt: (n) => `${STYLE}: ${n} as a superhero flying fearlessly through a massive lightning storm above the clouds` },
  ],
}

// Default difficulty by age — auto-set so younger kids aren't overwhelmed
export const DEFAULT_DIFFICULTY_FOR_AGE: Record<string, DifficultyLevel> = {
  '2-4':  '6',
  '4-6':  '6',
  '6-8':  '12',
  '8-12': '24',
}

export function getScenariosForAge(ageGroup: string): PuzzleScenario[] {
  return PUZZLE_SCENARIOS_BY_AGE[ageGroup] ?? PUZZLE_SCENARIOS_BY_AGE['4-6']
}

// Kept for backward compatibility
export const PUZZLE_SCENARIOS = PUZZLE_SCENARIOS_BY_AGE['4-6']

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
