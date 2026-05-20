import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MatchParticles from '../MatchParticles'
import BuddyMatchReaction from '../BuddyMatchReaction'

// ── MatchParticles ────────────────────────────────────────────────────────────

describe('MatchParticles', () => {
  it('renders nothing when active is false', () => {
    const { container } = render(<MatchParticles active={false} themeId="animals" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders particles when active is true', () => {
    const { container } = render(<MatchParticles active themeId="animals" />)
    const particles = container.querySelectorAll('[data-testid="match-particle"]')
    expect(particles.length).toBeGreaterThanOrEqual(6)
  })

  it('applies the burst container role', () => {
    render(<MatchParticles active themeId="space" />)
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('renders for all 8 themes without throwing', () => {
    const themes = ['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'farm', 'food']
    for (const themeId of themes) {
      expect(() => render(<MatchParticles active themeId={themeId} />)).not.toThrow()
    }
  })

  it('falls back gracefully for unknown theme', () => {
    expect(() => render(<MatchParticles active themeId="unknown-theme" />)).not.toThrow()
  })
})

// ── BuddyMatchReaction ────────────────────────────────────────────────────────

describe('BuddyMatchReaction', () => {
  it('renders nothing when active is false', () => {
    const { container } = render(
      <BuddyMatchReaction active={false} buddyEmoji="🦕" phrase="Great match!" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows buddy emoji when active', () => {
    render(<BuddyMatchReaction active buddyEmoji="🦕" phrase="Awesome!" />)
    expect(screen.getByText('🦕')).toBeInTheDocument()
  })

  it('shows the phrase when active', () => {
    render(<BuddyMatchReaction active buddyEmoji="🦄" phrase="You rock!" />)
    expect(screen.getByText('You rock!')).toBeInTheDocument()
  })

  it('does not show phrase when inactive', () => {
    render(<BuddyMatchReaction active={false} buddyEmoji="🦕" phrase="You rock!" />)
    expect(screen.queryByText('You rock!')).not.toBeInTheDocument()
  })

  it('renders without phrase prop', () => {
    expect(() => render(<BuddyMatchReaction active buddyEmoji="🦕" />)).not.toThrow()
  })
})
