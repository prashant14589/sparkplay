import { describe, it, expect } from 'vitest'
import { getThemeBoardStyle } from '../themeBoard'

const ALL_THEMES = [
  'animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'farm', 'food',
  'monsoon', 'gully_cricket', 'old_tree', 'fishing_dawn', 'kite_sky', 'market_day',
  'first_bicycle', 'night_sky',
]

describe('getThemeBoardStyle', () => {
  it('returns an object with bgClass and patternClass', () => {
    const style = getThemeBoardStyle('animals')
    expect(style).toHaveProperty('bgClass')
    expect(style).toHaveProperty('patternEmojis')
  })

  it('returns different styles for different themes', () => {
    const animals = getThemeBoardStyle('animals')
    const space   = getThemeBoardStyle('space')
    expect(animals.bgClass).not.toBe(space.bgClass)
  })

  it('returns valid tailwind bg class for every theme', () => {
    for (const themeId of ALL_THEMES) {
      const { bgClass } = getThemeBoardStyle(themeId)
      expect(bgClass).toMatch(/^bg-/)
    }
  })

  it('returns at least 3 pattern emojis for each theme', () => {
    for (const themeId of ALL_THEMES) {
      const { patternEmojis } = getThemeBoardStyle(themeId)
      expect(patternEmojis.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('falls back gracefully for unknown theme', () => {
    expect(() => getThemeBoardStyle('unknown-theme')).not.toThrow()
    const { bgClass } = getThemeBoardStyle('unknown-theme')
    expect(bgClass).toBeTruthy()
  })

  it('memory themes get warm/earthy background classes', () => {
    const monsoon = getThemeBoardStyle('monsoon')
    const nightSky = getThemeBoardStyle('night_sky')
    // Memory themes should not use the generic violet-50
    expect(monsoon.bgClass).not.toBe('bg-violet-50')
    expect(nightSky.bgClass).not.toBe('bg-violet-50')
  })
})
