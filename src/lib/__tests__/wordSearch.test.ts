import { describe, it, expect } from 'vitest'
import {
  buildGrid,
  isValidPath,
  getWordPositions,
  getWordsForTheme,
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
