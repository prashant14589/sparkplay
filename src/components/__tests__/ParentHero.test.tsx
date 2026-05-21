import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ParentHero from '../ParentHero'

describe('ParentHero', () => {
  it('renders a parent-facing headline', () => {
    render(<ParentHero />)
    const el = screen.getByTestId('parent-hero')
    expect(el.textContent).toMatch(/child|kid|childhood|memories|parent|family/i)
  })

  it('contains a sign-up call to action', () => {
    render(<ParentHero />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('signup'))
  })

  it('shows a primary headline', () => {
    render(<ParentHero />)
    expect(screen.getByTestId('parent-hero-headline')).toBeInTheDocument()
  })

  it('shows a sub-line with emotional context', () => {
    render(<ParentHero />)
    expect(screen.getByTestId('parent-hero-sub')).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    expect(() => render(<ParentHero />)).not.toThrow()
  })
})
