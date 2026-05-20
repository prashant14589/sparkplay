import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next/navigation so LevelComplete can render in tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

// Mock Sounds to avoid Web Audio API errors in jsdom
vi.mock('@/lib/sounds', () => ({
  Sounds: { win: vi.fn(), flip: vi.fn(), match: vi.fn(), mismatch: vi.fn() },
}))

// Mock illustrations
vi.mock('@/lib/illustrations', () => ({
  getCelebrationIllustration: () => null,
  getHeroIllustration: () => null,
}))

import LevelComplete from '../LevelComplete'

const BASE_PROPS = {
  level: 1,
  totalLevels: 5,
  stars: 3,
  coins: 10,
  moves: 6,
  childName: 'Emma',
  themeId: 'animals',
  onReplay: vi.fn(),
}

describe('LevelComplete — guest save-progress nudge', () => {
  beforeEach(() => {
    // Default: localStorage has no auth session → guest
    localStorage.clear()
  })

  it('shows save-progress nudge for guest users', () => {
    render(<LevelComplete {...BASE_PROPS} isAuthenticated={false} />)
    expect(screen.getByTestId('save-progress-nudge')).toBeInTheDocument()
  })

  it('does NOT show nudge for authenticated users', () => {
    render(<LevelComplete {...BASE_PROPS} isAuthenticated={true} />)
    expect(screen.queryByTestId('save-progress-nudge')).not.toBeInTheDocument()
  })

  it('nudge contains a link to /signup', () => {
    render(<LevelComplete {...BASE_PROPS} isAuthenticated={false} />)
    const nudge = screen.getByTestId('save-progress-nudge')
    const link = nudge.querySelector('a')
    expect(link?.getAttribute('href')).toBe('/signup')
  })

  it('nudge mentions saving or streak', () => {
    render(<LevelComplete {...BASE_PROPS} isAuthenticated={false} />)
    const nudge = screen.getByTestId('save-progress-nudge')
    expect(nudge.textContent).toMatch(/save|streak|keep|progress/i)
  })

  it('nudge defaults gracefully when isAuthenticated prop is omitted', () => {
    // Without the prop, should behave as guest (show nudge)
    render(<LevelComplete {...BASE_PROPS} />)
    expect(screen.getByTestId('save-progress-nudge')).toBeInTheDocument()
  })
})
