import { describe, it, expect, beforeEach } from 'vitest'
import { calcStars, calcCoins } from '../progress'

describe('calcStars — memory', () => {
  it('3 stars when moves ≤ pairs × 1.5', () => {
    expect(calcStars(6, 4, 'memory')).toBe(3)   // 6 ≤ ceil(4*1.5)=6 ✓
    expect(calcStars(4, 4, 'memory')).toBe(3)   // perfect
  })
  it('2 stars when moves ≤ pairs × 2.5', () => {
    expect(calcStars(8, 4, 'memory')).toBe(2)   // 8 ≤ ceil(4*2.5)=10 ✓
  })
  it('1 star otherwise', () => {
    expect(calcStars(20, 4, 'memory')).toBe(1)
  })
})

describe('calcStars — quiz (moves = wrong answers out of N questions)', () => {
  it('3 stars when 0 wrong', () => {
    expect(calcStars(0, 5, 'quiz')).toBe(3)
  })
  it('2 stars when 1–2 wrong out of 5', () => {
    expect(calcStars(1, 5, 'quiz')).toBe(2)
    expect(calcStars(2, 5, 'quiz')).toBe(2)  // 2 ≤ ceil(5*0.4)=2 ✓
  })
  it('1 star when 3+ wrong out of 5', () => {
    expect(calcStars(3, 5, 'quiz')).toBe(1)
    expect(calcStars(5, 5, 'quiz')).toBe(1)
  })
})

describe('calcStars — word_search (moves = selection attempts)', () => {
  it('3 stars when attempts ≤ words × 1.5', () => {
    expect(calcStars(6, 5, 'word_search')).toBe(3)   // 6 ≤ ceil(5*1.5)=8 ✓
    expect(calcStars(8, 5, 'word_search')).toBe(3)
  })
  it('2 stars when attempts ≤ words × 3', () => {
    expect(calcStars(10, 5, 'word_search')).toBe(2)  // 10 ≤ ceil(5*3)=15 ✓
  })
  it('1 star when too many attempts', () => {
    expect(calcStars(20, 5, 'word_search')).toBe(1)
  })
})

describe('calcStars — maze', () => {
  it('3 stars for efficient navigation (≤ size × 2.5)', () => {
    expect(calcStars(17, 7, 'maze')).toBe(3)  // 17 ≤ ceil(7*2.5)=18 ✓
  })
  it('1 star for many moves', () => {
    expect(calcStars(50, 7, 'maze')).toBe(1)
  })
})

describe('calcCoins', () => {
  it('base 10 coins for 1 star level 1', () => {
    expect(calcCoins(1, 1)).toBe(12)   // 10 + 0 + 2
  })
  it('more coins for 3 stars level 1', () => {
    expect(calcCoins(3, 1)).toBe(22)   // 10 + 10 + 2
  })
  it('level multiplier adds 2 per level', () => {
    expect(calcCoins(3, 5)).toBe(30)   // 10 + 10 + 10
  })
  it('1 star level 5', () => {
    expect(calcCoins(1, 5)).toBe(20)   // 10 + 0 + 10
  })
})
