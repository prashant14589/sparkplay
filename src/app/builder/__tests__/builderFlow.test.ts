import { describe, it, expect } from 'vitest'
import { getBuilderStepConfig } from '../stepConfig'

// Builder flow should be 4 discrete, single-decision steps:
// 1. Age    — who is playing?
// 2. Game   — what kind of game? (auto-advances on tap)
// 3. Theme  — which world? (auto-advances on tap)
// 4. Make   — give it a name

describe('Builder step config', () => {
  it('defines exactly 4 steps', () => {
    const steps = getBuilderStepConfig()
    expect(steps).toHaveLength(4)
  })

  it('steps are in correct order: age → game → theme → make', () => {
    const steps = getBuilderStepConfig()
    expect(steps[0].id).toBe('age')
    expect(steps[1].id).toBe('game')
    expect(steps[2].id).toBe('theme')
    expect(steps[3].id).toBe('make')
  })

  it('each step has id, label, and headline', () => {
    const steps = getBuilderStepConfig()
    for (const step of steps) {
      expect(step.id).toBeTruthy()
      expect(step.label).toBeTruthy()
      expect(step.headline).toBeTruthy()
    }
  })

  it('age step does not require a Next button — tapping advances', () => {
    const steps = getBuilderStepConfig()
    expect(steps.find(s => s.id === 'age')?.autoAdvance).toBe(true)
  })

  it('game step auto-advances on selection', () => {
    const steps = getBuilderStepConfig()
    expect(steps.find(s => s.id === 'game')?.autoAdvance).toBe(true)
  })

  it('theme step auto-advances on selection', () => {
    const steps = getBuilderStepConfig()
    expect(steps.find(s => s.id === 'theme')?.autoAdvance).toBe(true)
  })

  it('make step requires explicit submit — no auto-advance', () => {
    const steps = getBuilderStepConfig()
    expect(steps.find(s => s.id === 'make')?.autoAdvance).toBe(false)
  })
})

describe('Builder step navigation', () => {
  it('next step after age is game', () => {
    const steps = getBuilderStepConfig()
    const ageIndex = steps.findIndex(s => s.id === 'age')
    expect(steps[ageIndex + 1].id).toBe('game')
  })

  it('next step after game is theme', () => {
    const steps = getBuilderStepConfig()
    const gameIndex = steps.findIndex(s => s.id === 'game')
    expect(steps[gameIndex + 1].id).toBe('theme')
  })

  it('back from game returns to age', () => {
    const steps = getBuilderStepConfig()
    const gameIndex = steps.findIndex(s => s.id === 'game')
    expect(steps[gameIndex - 1].id).toBe('age')
  })

  it('back from theme returns to game', () => {
    const steps = getBuilderStepConfig()
    const themeIndex = steps.findIndex(s => s.id === 'theme')
    expect(steps[themeIndex - 1].id).toBe('game')
  })
})
