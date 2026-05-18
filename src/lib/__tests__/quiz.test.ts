import { describe, it, expect } from 'vitest'
import {
  getQuestionsForTheme,
  getQuestionsForLevel,
  interpolateQuestion,
  QUIZ_THEMES,
  type QuizQuestion,
} from '../quiz'

describe('quiz library — content integrity', () => {
  it('exports questions for every supported theme', () => {
    const expected = ['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'farm', 'food']
    expected.forEach((theme) => {
      const qs = getQuestionsForTheme(theme)
      expect(qs.length, `theme "${theme}" has no questions`).toBeGreaterThanOrEqual(10)
    })
  })

  it('every question has exactly 4 answer options', () => {
    QUIZ_THEMES.forEach((theme) => {
      getQuestionsForTheme(theme).forEach((q: QuizQuestion) => {
        expect(q.answers, `question "${q.question}" has wrong answer count`).toHaveLength(4)
      })
    })
  })

  it('correct index is always 0–3', () => {
    QUIZ_THEMES.forEach((theme) => {
      getQuestionsForTheme(theme).forEach((q: QuizQuestion) => {
        expect(q.correct).toBeGreaterThanOrEqual(0)
        expect(q.correct).toBeLessThanOrEqual(3)
      })
    })
  })

  it('every question has a non-empty illustration emoji', () => {
    QUIZ_THEMES.forEach((theme) => {
      getQuestionsForTheme(theme).forEach((q: QuizQuestion) => {
        expect(q.illustration.trim()).not.toBe('')
      })
    })
  })

  it('level is 1–5 for every question', () => {
    QUIZ_THEMES.forEach((theme) => {
      getQuestionsForTheme(theme).forEach((q: QuizQuestion) => {
        expect(q.level).toBeGreaterThanOrEqual(1)
        expect(q.level).toBeLessThanOrEqual(5)
      })
    })
  })

  it('covers all 5 difficulty levels for each theme', () => {
    QUIZ_THEMES.forEach((theme) => {
      for (let lvl = 1; lvl <= 5; lvl++) {
        const qs = getQuestionsForLevel(theme, lvl)
        expect(qs.length, `theme "${theme}" level ${lvl} has no questions`).toBeGreaterThanOrEqual(3)
      }
    })
  })
})

describe('interpolateQuestion', () => {
  it('replaces {NAME} with the given name', () => {
    expect(interpolateQuestion('Hi {NAME}!', 'Emma')).toBe('Hi Emma!')
  })

  it('falls back to "you" when name is empty', () => {
    expect(interpolateQuestion('Good job, {NAME}!', '')).toBe('Good job, you!')
    expect(interpolateQuestion('Hi {NAME}!', undefined)).toBe('Hi you!')
  })

  it('replaces multiple occurrences', () => {
    expect(interpolateQuestion('{NAME} loves {NAME}!', 'Leo')).toBe('Leo loves Leo!')
  })
})

describe('getQuestionsForLevel', () => {
  it('returns only questions matching the requested level', () => {
    const qs = getQuestionsForLevel('animals', 1)
    qs.forEach((q) => expect(q.level).toBe(1))
  })

  it('returns empty array for unknown theme', () => {
    expect(getQuestionsForLevel('nonexistent', 1)).toHaveLength(0)
  })
})
