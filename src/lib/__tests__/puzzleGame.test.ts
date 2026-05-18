import { describe, it, expect } from 'vitest'
import {
  createPieces,
  isPieceCorrect,
  shufflePieces,
  generatePuzzlePrompt,
  DIFFICULTY_GRID,
  PUZZLE_SCENARIOS,
  getCacheKey,
  type PuzzlePiece,
} from '../puzzleGame'

describe('DIFFICULTY_GRID', () => {
  it('defines grids for 6, 12 and 24 pieces', () => {
    expect(DIFFICULTY_GRID['6'].cols  * DIFFICULTY_GRID['6'].rows).toBe(6)
    expect(DIFFICULTY_GRID['12'].cols * DIFFICULTY_GRID['12'].rows).toBe(12)
    expect(DIFFICULTY_GRID['24'].cols * DIFFICULTY_GRID['24'].rows).toBe(24)
  })
})

describe('PUZZLE_SCENARIOS', () => {
  it('has at least 6 scenarios', () => {
    expect(PUZZLE_SCENARIOS.length).toBeGreaterThanOrEqual(6)
  })

  it('every scenario has id, label, emoji, theme and a prompt function', () => {
    PUZZLE_SCENARIOS.forEach((s) => {
      expect(typeof s.id).toBe('string')
      expect(typeof s.label).toBe('string')
      expect(typeof s.emoji).toBe('string')
      expect(typeof s.theme).toBe('string')
      expect(typeof s.prompt).toBe('function')
    })
  })

  it('scenario prompt includes the child name', () => {
    const s = PUZZLE_SCENARIOS[0]
    const p = s.prompt('Aarav')
    expect(p).toContain('Aarav')
  })
})

describe('createPieces', () => {
  it('creates the correct number of pieces for a 3×2 grid', () => {
    const pieces = createPieces(3, 2, 300, 200)
    expect(pieces).toHaveLength(6)
  })

  it('creates the correct number of pieces for a 4×3 grid', () => {
    const pieces = createPieces(4, 3, 400, 300)
    expect(pieces).toHaveLength(12)
  })

  it('assigns unique IDs to all pieces', () => {
    const pieces = createPieces(4, 3, 400, 300)
    const ids = new Set(pieces.map((p) => p.id))
    expect(ids.size).toBe(12)
  })

  it('assigns correct row and col to each piece', () => {
    const pieces = createPieces(3, 2, 300, 200)
    const rows = pieces.map((p) => p.row)
    const cols = pieces.map((p) => p.col)
    expect(Math.max(...rows)).toBe(1)   // rows 0 and 1
    expect(Math.max(...cols)).toBe(2)   // cols 0, 1, 2
  })

  it('calculates correct CSS background offsets (top-left piece)', () => {
    const pieces = createPieces(3, 2, 300, 200)
    const topLeft = pieces.find((p) => p.row === 0 && p.col === 0)!
    expect(topLeft.bgX).toBe(0)
    expect(topLeft.bgY).toBe(0)
  })

  it('calculates correct CSS background offsets for piece at (row=1, col=2)', () => {
    // 3 cols, 2 rows, 300×200 image → pieceW=100, pieceH=100
    const pieces = createPieces(3, 2, 300, 200)
    const piece = pieces.find((p) => p.row === 1 && p.col === 2)!
    expect(piece.bgX).toBe(-200)   // -(col * pieceW) = -(2 * 100)
    expect(piece.bgY).toBe(-100)   // -(row * pieceH) = -(1 * 100)
  })

  it('piece width and height are correct', () => {
    const pieces = createPieces(4, 3, 400, 300)  // pieceW=100, pieceH=100
    pieces.forEach((p) => {
      expect(p.pieceW).toBe(100)
      expect(p.pieceH).toBe(100)
    })
  })
})

describe('isPieceCorrect', () => {
  it('returns true when dropped on the correct slot', () => {
    const piece: PuzzlePiece = {
      id: 5, row: 1, col: 2,
      bgX: -200, bgY: -100, pieceW: 100, pieceH: 100,
    }
    expect(isPieceCorrect(piece, 1, 2)).toBe(true)
  })

  it('returns false when dropped on a wrong slot', () => {
    const piece: PuzzlePiece = {
      id: 5, row: 1, col: 2,
      bgX: -200, bgY: -100, pieceW: 100, pieceH: 100,
    }
    expect(isPieceCorrect(piece, 0, 0)).toBe(false)
    expect(isPieceCorrect(piece, 1, 0)).toBe(false)
    expect(isPieceCorrect(piece, 0, 2)).toBe(false)
  })
})

describe('shufflePieces', () => {
  it('returns the same pieces in a different order (statistically)', () => {
    const pieces = createPieces(4, 3, 400, 300)
    const shuffled = shufflePieces(pieces)
    expect(shuffled).toHaveLength(pieces.length)
    // Same set of ids
    const origIds = new Set(pieces.map((p) => p.id))
    const shuffIds = new Set(shuffled.map((p) => p.id))
    expect(shuffIds).toEqual(origIds)
  })

  it('does not mutate the original array', () => {
    const pieces = createPieces(3, 2, 300, 200)
    const first = pieces[0].id
    shufflePieces(pieces)
    expect(pieces[0].id).toBe(first)
  })
})

describe('generatePuzzlePrompt', () => {
  it('includes child name in the prompt', () => {
    const prompt = generatePuzzlePrompt('Aarav', 'riding a friendly horse')
    expect(prompt).toContain('Aarav')
  })

  it('includes the scenario label in the prompt', () => {
    const prompt = generatePuzzlePrompt('Emma', 'eating rainbow vegetables')
    expect(prompt).toContain('eating rainbow vegetables')
  })

  it('falls back gracefully when name is empty', () => {
    const prompt = generatePuzzlePrompt('', 'flying on a unicorn')
    expect(prompt.toLowerCase()).toContain('a child')
    expect(prompt).not.toContain('""')
  })

  it('returns a non-empty string of at least 50 chars', () => {
    const prompt = generatePuzzlePrompt('Leo', 'swimming with dolphins')
    expect(prompt.length).toBeGreaterThan(50)
  })
})

describe('getCacheKey', () => {
  it('returns a stable lowercase string for name + scenario', () => {
    expect(getCacheKey('Aarav', 'horse-ride')).toBe('puzzle:aarav:horse-ride')
  })

  it('lowercases and trims the name', () => {
    expect(getCacheKey('  AARAV  ', 'horse-ride')).toBe('puzzle:aarav:horse-ride')
  })
})
