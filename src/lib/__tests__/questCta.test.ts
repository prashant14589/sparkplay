import { describe, it, expect } from 'vitest'
import { getQuestCTA } from '../quests'

describe('getQuestCTA', () => {
  it('memory quest scrolls to game on home page', () => {
    const cta = getQuestCTA('memory')
    expect(cta.action).toBe('scroll')
    expect(cta.label).toMatch(/play|match|start/i)
  })

  it('any quest scrolls to game on home page', () => {
    const cta = getQuestCTA('any')
    expect(cta.action).toBe('scroll')
  })

  it('quiz quest routes to dashboard', () => {
    const cta = getQuestCTA('quiz')
    expect(cta.action).toBe('navigate')
    expect(cta.href).toBeTruthy()
  })

  it('word_search quest routes to dashboard', () => {
    const cta = getQuestCTA('word_search')
    expect(cta.action).toBe('navigate')
  })

  it('maze quest routes to dashboard', () => {
    const cta = getQuestCTA('maze')
    expect(cta.action).toBe('navigate')
  })

  it('story quest routes to dashboard', () => {
    const cta = getQuestCTA('story')
    expect(cta.action).toBe('navigate')
  })

  it('returns a human-readable label for every game type', () => {
    const types = ['memory', 'quiz', 'word_search', 'maze', 'story', 'puzzle', 'number_merge', 'any']
    for (const type of types) {
      const cta = getQuestCTA(type)
      expect(cta.label).toBeTruthy()
    }
  })
})
