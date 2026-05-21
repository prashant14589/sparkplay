import { describe, it, expect } from 'vitest'
import { makeGameTitle } from '../titleTemplate'

describe('makeGameTitle — strips leading articles', () => {
  it('strips "The" from theme name in possessive', () => {
    expect(makeGameTitle('Emma', 'The Old Tree', 'Puzzle Maker'))
      .toBe("Emma's Old Tree Puzzle Maker")
  })

  it('strips "The" from theme name without child name', () => {
    expect(makeGameTitle('', 'The Old Tree', 'Puzzle Maker'))
      .toBe('Old Tree Puzzle Maker')
  })

  it('strips "A" from theme name', () => {
    expect(makeGameTitle('Rohan', 'A Rainy Day', 'Memory Match'))
      .toBe("Rohan's Rainy Day Memory Match")
  })

  it('strips "An" from theme name', () => {
    expect(makeGameTitle('Priya', 'An Ocean Adventure', 'Quiz'))
      .toBe("Priya's Ocean Adventure Quiz")
  })

  it('does NOT strip articles from the middle of theme names', () => {
    expect(makeGameTitle('Leo', 'Animals', 'Memory Match'))
      .toBe("Leo's Animals Memory Match")
  })

  it('does not add "My" when no child name — just theme + template', () => {
    const title = makeGameTitle('', 'Space', 'Quiz')
    expect(title).not.toContain('My ')
    expect(title).toBe('Space Quiz')
  })

  it('trims whitespace from child name', () => {
    expect(makeGameTitle('  Aisha  ', 'Ocean', 'Word Search'))
      .toBe("Aisha's Ocean Word Search")
  })

  it('handles empty theme name gracefully', () => {
    expect(() => makeGameTitle('Emma', '', 'Puzzle Maker')).not.toThrow()
  })
})
