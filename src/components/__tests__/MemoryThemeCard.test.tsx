import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MemoryThemeCard from '../MemoryThemeCard'
import { THEMES } from '@/lib/themes'
import { MEMORY_THEME_IDS } from '@/lib/memoryThemes'

const MEMORY_THEMES = THEMES.filter(t => MEMORY_THEME_IDS.has(t.id))

describe('MemoryThemeCard', () => {
  it('renders theme name', () => {
    const theme = MEMORY_THEMES[0]
    render(<MemoryThemeCard theme={theme} isActive={false} onClick={() => {}} />)
    expect(screen.getByText(theme.name)).toBeInTheDocument()
  })

  it('renders for all memory themes without throwing', () => {
    for (const theme of MEMORY_THEMES) {
      expect(() =>
        render(<MemoryThemeCard theme={theme} isActive={false} onClick={() => {}} />)
      ).not.toThrow()
    }
  })

  it('renders animated particle elements', () => {
    const monsoon = MEMORY_THEMES.find(t => t.id === 'monsoon')!
    const { container } = render(
      <MemoryThemeCard theme={monsoon} isActive={false} onClick={() => {}} />
    )
    const particles = container.querySelectorAll('[data-testid="card-particle"]')
    expect(particles.length).toBeGreaterThanOrEqual(2)
  })

  it('applies active ring when isActive is true', () => {
    const theme = MEMORY_THEMES[0]
    const { container } = render(
      <MemoryThemeCard theme={theme} isActive onClick={() => {}} />
    )
    const btn = container.querySelector('button')
    expect(btn?.className).toMatch(/ring|outline|scale/)
  })

  it('calls onClick when tapped', () => {
    const onClick = vi.fn()
    const theme = MEMORY_THEMES[0]
    render(<MemoryThemeCard theme={theme} isActive={false} onClick={onClick} />)
    screen.getByRole('button').click()
    expect(onClick).toHaveBeenCalledOnce()
  })
})
