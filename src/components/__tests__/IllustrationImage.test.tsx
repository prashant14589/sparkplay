import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import IllustrationImage from '../IllustrationImage'

// Mock GameEmoji so we can assert on fallback rendering
vi.mock('../GameEmoji', () => ({
  default: ({ emoji, size }: { emoji: string; size: number }) => (
    <span data-testid="game-emoji" data-emoji={emoji} data-size={size} />
  ),
}))

describe('IllustrationImage', () => {
  it('renders an img when a src is provided', () => {
    render(
      <IllustrationImage
        src="/illustrations/animals/hero.png"
        alt="Lion hero"
        size={120}
      />
    )
    const img = screen.getByRole('img', { name: 'Lion hero' })
    expect(img).toBeInTheDocument()
    expect((img as HTMLImageElement).src).toContain('/illustrations/animals/hero.png')
  })

  it('applies the correct width and height', () => {
    render(
      <IllustrationImage
        src="/illustrations/dinos/hero.png"
        alt="Dino hero"
        size={96}
      />
    )
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.width).toBe(96)
    expect(img.height).toBe(96)
  })

  it('renders the GameEmoji fallback when src is null', () => {
    render(
      <IllustrationImage
        src={null}
        alt="Fallback"
        size={80}
        fallbackEmoji="🦁"
      />
    )
    const fallback = screen.getByTestId('game-emoji')
    expect(fallback).toBeInTheDocument()
    expect(fallback.getAttribute('data-emoji')).toBe('🦁')
  })

  it('passes className to the img element', () => {
    render(
      <IllustrationImage
        src="/illustrations/animals/hero.png"
        alt="Test"
        size={64}
        className="rounded-2xl shadow"
      />
    )
    const img = screen.getByRole('img')
    expect(img.className).toContain('rounded-2xl')
  })

  it('renders nothing when src is null and no fallbackEmoji is provided', () => {
    const { container } = render(
      <IllustrationImage src={null} alt="Empty" size={80} />
    )
    expect(container.firstChild).toBeNull()
  })
})
