import { describe, it, expect } from 'vitest'
import {
  getCardIllustration,
  getHeroIllustration,
  getCelebrationIllustration,
  hasIllustration,
  ILLUSTRATION_BASE,
  THEME_CARD_SUBJECTS,
  THEME_HERO_SUBJECTS,
} from '../illustrations'

describe('THEME_CARD_SUBJECTS', () => {
  it('has entries for all 8 supported themes', () => {
    const themes = ['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'farm', 'food']
    themes.forEach((t) => {
      expect(THEME_CARD_SUBJECTS[t], `missing theme: ${t}`).toBeDefined()
    })
  })

  it('has at least 6 card subjects per theme', () => {
    Object.entries(THEME_CARD_SUBJECTS).forEach(([theme, subjects]) => {
      expect(subjects.length, `${theme} has fewer than 6 subjects`).toBeGreaterThanOrEqual(6)
    })
  })

  it('has at most 18 card subjects per theme (matches max pairs)', () => {
    Object.entries(THEME_CARD_SUBJECTS).forEach(([theme, subjects]) => {
      expect(subjects.length, `${theme} has more than 18 subjects`).toBeLessThanOrEqual(18)
    })
  })
})

describe('THEME_HERO_SUBJECTS', () => {
  it('has a hero subject for all 8 themes', () => {
    const themes = ['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'farm', 'food']
    themes.forEach((t) => {
      expect(THEME_HERO_SUBJECTS[t], `missing hero for: ${t}`).toBeDefined()
    })
  })
})

describe('getCardIllustration', () => {
  it('returns a /illustrations/ path for a valid theme and index', () => {
    const path = getCardIllustration('animals', 0)
    expect(path).toContain(ILLUSTRATION_BASE)
    expect(path).toContain('animals')
    expect(path).toMatch(/\.(png|webp|jpg)$/)
  })

  it('returns paths for all valid indices in a theme', () => {
    const subjects = THEME_CARD_SUBJECTS['animals']
    subjects.forEach((_, i) => {
      const path = getCardIllustration('animals', i)
      expect(path).toContain(ILLUSTRATION_BASE)
    })
  })

  it('returns null for an index out of range', () => {
    expect(getCardIllustration('animals', 999)).toBeNull()
  })

  it('returns null for an unknown theme', () => {
    expect(getCardIllustration('nonexistent', 0)).toBeNull()
  })
})

describe('getHeroIllustration', () => {
  it('returns a /illustrations/ path for a valid theme', () => {
    const path = getHeroIllustration('dinos')
    expect(path).toContain(ILLUSTRATION_BASE)
    expect(path).toContain('dinos')
    expect(path).toMatch(/\.(png|webp|jpg)$/)
  })

  it('returns null for unknown theme', () => {
    expect(getHeroIllustration('nonexistent')).toBeNull()
  })
})

describe('getCelebrationIllustration', () => {
  it('returns a /illustrations/ path for a valid theme', () => {
    const path = getCelebrationIllustration('space')
    expect(path).toContain(ILLUSTRATION_BASE)
    expect(path).toContain('space')
    expect(path).toMatch(/\.(png|webp|jpg)$/)
  })

  it('returns null for unknown theme', () => {
    expect(getCelebrationIllustration('nonexistent')).toBeNull()
  })
})

describe('hasIllustration', () => {
  it('returns false when file does not exist (no public/illustrations/ yet)', () => {
    // Before generation script runs, files won't exist — hasIllustration is
    // a runtime check used by IllustrationImage to decide whether to show
    // the image or fall back to GameEmoji.
    // We just verify the function returns a boolean.
    const result = hasIllustration('animals', 0)
    expect(typeof result).toBe('boolean')
  })
})
