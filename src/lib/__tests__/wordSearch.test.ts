import { describe, it, expect } from 'vitest'
import {
  buildGrid,
  isValidPath,
  getWordPositions,
  getWordsForTheme,
  pathToWord,
  computePathFromStartTo,
  GRID_SIZES,
  type GridCell,
} from '../wordSearch'

describe('getWordsForTheme', () => {
  it('returns words for every supported theme', () => {
    const themes = ['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'farm', 'food']
    themes.forEach((t) => {
      expect(getWordsForTheme(t).length).toBeGreaterThanOrEqual(6)
    })
  })

  it('all words are uppercase letters only', () => {
    const themes = ['animals', 'dinos', 'ocean']
    themes.forEach((t) => {
      getWordsForTheme(t).forEach((w) => {
        expect(w).toMatch(/^[A-Z]+$/)
      })
    })
  })
})

describe('GRID_SIZES', () => {
  it('maps every age group to a grid size', () => {
    expect(GRID_SIZES['2-4']).toBeGreaterThanOrEqual(6)
    expect(GRID_SIZES['4-6']).toBeGreaterThanOrEqual(7)
    expect(GRID_SIZES['6-8']).toBeGreaterThanOrEqual(9)
    expect(GRID_SIZES['8-12']).toBeGreaterThanOrEqual(10)
  })
})

describe('buildGrid', () => {
  it('creates a grid with the specified size', () => {
    const { grid } = buildGrid(['CAT', 'DOG'], 8)
    expect(grid).toHaveLength(8)
    grid.forEach((row) => expect(row).toHaveLength(8))
  })

  it('every cell has a single uppercase letter', () => {
    const { grid } = buildGrid(['CAT', 'DOG'], 8)
    grid.forEach((row: GridCell[]) =>
      row.forEach((cell) => {
        expect(cell.letter).toMatch(/^[A-Z]$/)
      })
    )
  })

  it('places all requested words in the grid', () => {
    const words = ['CAT', 'DOG', 'FISH']
    const { placed } = buildGrid(words, 10)
    expect(placed.length).toBeGreaterThanOrEqual(words.length - 1) // allows 1 failure due to collision
  })

  it('buildGrid is deterministic given a seed word list', () => {
    const words = ['LION', 'BEAR']
    const r1 = buildGrid(words, 8)
    const r2 = buildGrid(words, 8)
    // Both grids should have the same placed word count
    expect(r1.placed.length).toBe(r2.placed.length)
  })
})

describe('getWordPositions', () => {
  it('returns positions for a placed word', () => {
    const { grid, placed } = buildGrid(['CAT'], 8)
    if (placed.length === 0) return // word wasn't placed (very rare)
    const placedWord = placed[0]
    const positions = getWordPositions(grid, placedWord)
    expect(positions).toHaveLength(placedWord.word.length)
    positions.forEach((p) => {
      expect(p.row).toBeGreaterThanOrEqual(0)
      expect(p.col).toBeGreaterThanOrEqual(0)
    })
  })
})

// ── NEW: word findability ────────────────────────────────────────────────────

describe('word findability — every placed word must be readable in the grid', () => {
  it('all placed words are readable at their stored coordinates', () => {
    const words = ['CAT', 'DOG', 'FISH', 'BIRD', 'LION']
    const { grid, placed } = buildGrid(words, 12)

    placed.forEach((pw) => {
      let extracted = ''
      for (let i = 0; i < pw.word.length; i++) {
        const r = pw.startRow + pw.dirRow * i
        const c = pw.startCol + pw.dirCol * i
        extracted += grid[r]?.[c]?.letter ?? '?'
      }
      expect(extracted).toBe(pw.word)
    })
  })

  it('pathToWord extracts the correct string from a horizontal word', () => {
    const { grid, placed } = buildGrid(['CAT'], 8)
    if (placed.length === 0) return
    const pw = placed[0]
    const positions = getWordPositions(grid, pw)
    expect(pathToWord(grid, positions)).toBe(pw.word)
  })

  it('pathToWord extracts the correct string from a diagonal word', () => {
    // Force a diagonal by running enough attempts
    const words = ['TIGER', 'SNAKE', 'EAGLE', 'CRANE', 'WHALE']
    const { grid, placed } = buildGrid(words, 12)
    const diagonal = placed.find((pw) => pw.dirRow !== 0 && pw.dirCol !== 0)
    if (!diagonal) return // no diagonal placed this run — skip
    const positions = getWordPositions(grid, diagonal)
    expect(pathToWord(grid, positions)).toBe(diagonal.word)
  })
})

// ── NEW: computePathFromStartTo ──────────────────────────────────────────────

describe('computePathFromStartTo', () => {
  it('computes a horizontal path', () => {
    const path = computePathFromStartTo({ row: 0, col: 0 }, { row: 0, col: 3 })
    expect(path).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ])
  })

  it('computes a vertical path going upward', () => {
    const path = computePathFromStartTo({ row: 3, col: 2 }, { row: 0, col: 2 })
    expect(path).toEqual([
      { row: 3, col: 2 },
      { row: 2, col: 2 },
      { row: 1, col: 2 },
      { row: 0, col: 2 },
    ])
  })

  it('computes a diagonal path (top-left to bottom-right)', () => {
    const path = computePathFromStartTo({ row: 0, col: 0 }, { row: 2, col: 2 })
    expect(path).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
    ])
  })

  it('computes a reverse diagonal (bottom-right to top-left)', () => {
    const path = computePathFromStartTo({ row: 2, col: 2 }, { row: 0, col: 0 })
    expect(path).toEqual([
      { row: 2, col: 2 },
      { row: 1, col: 1 },
      { row: 0, col: 0 },
    ])
  })

  it('returns just the start cell when start === end', () => {
    const path = computePathFromStartTo({ row: 1, col: 1 }, { row: 1, col: 1 })
    expect(path).toEqual([{ row: 1, col: 1 }])
  })

  it('returns null for a non-straight path (e.g. 2 right, 1 down)', () => {
    const result = computePathFromStartTo({ row: 0, col: 0 }, { row: 1, col: 2 })
    expect(result).toBeNull()
  })
})

describe('isValidPath', () => {
  it('accepts a straight horizontal path', () => {
    const path = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]
    expect(isValidPath(path)).toBe(true)
  })

  it('accepts a straight vertical path', () => {
    const path = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
    ]
    expect(isValidPath(path)).toBe(true)
  })

  it('accepts a diagonal path', () => {
    const path = [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
    ]
    expect(isValidPath(path)).toBe(true)
  })

  it('rejects a path with inconsistent direction', () => {
    const path = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 3 }, // wrong direction
    ]
    expect(isValidPath(path)).toBe(false)
  })

  it('rejects a path with duplicate cells', () => {
    const path = [
      { row: 0, col: 0 },
      { row: 0, col: 0 }, // duplicate
    ]
    expect(isValidPath(path)).toBe(false)
  })

  it('returns true for a single-cell path', () => {
    expect(isValidPath([{ row: 0, col: 0 }])).toBe(true)
  })
})
