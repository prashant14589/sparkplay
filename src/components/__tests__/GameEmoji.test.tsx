import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GameEmoji from '../GameEmoji'
import { TWEMOJI_BASE } from '@/lib/twemoji'

describe('GameEmoji', () => {
  it('renders an img element', () => {
    render(<GameEmoji emoji="🐶" size={80} />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
  })

  it('uses the Twemoji CDN as src', () => {
    render(<GameEmoji emoji="🐶" size={80} />)
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.src).toContain(TWEMOJI_BASE)
    expect(img.src).toContain('1f436')   // 🐶 codepoint
    expect(img.src).toMatch(/\.svg$/)
  })

  it('applies the requested size as width and height', () => {
    render(<GameEmoji emoji="🦁" size={96} />)
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.width).toBe(96)
    expect(img.height).toBe(96)
  })

  it('uses size 48 by default', () => {
    render(<GameEmoji emoji="🚀" />)
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.width).toBe(48)
    expect(img.height).toBe(48)
  })

  it('sets a descriptive alt attribute', () => {
    render(<GameEmoji emoji="🦄" size={64} />)
    const img = screen.getByAltText('🦄')
    expect(img).toBeInTheDocument()
  })

  it('passes additional className to the img', () => {
    render(<GameEmoji emoji="⭐" size={32} className="rounded-full shadow" />)
    const img = screen.getByRole('img')
    expect(img.className).toContain('rounded-full')
    expect(img.className).toContain('shadow')
  })

  it('renders different emojis with different src URLs', () => {
    const { rerender } = render(<GameEmoji emoji="🐶" size={48} />)
    const dog = (screen.getByRole('img') as HTMLImageElement).src

    rerender(<GameEmoji emoji="🐱" size={48} />)
    const cat = (screen.getByRole('img') as HTMLImageElement).src

    expect(dog).not.toBe(cat)
    expect(cat).toContain('1f431')  // 🐱 codepoint
  })
})
