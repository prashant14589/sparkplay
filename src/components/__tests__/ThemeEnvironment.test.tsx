import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ThemeEnvironment from '../ThemeEnvironment'

const THEMES = ['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'farm', 'food']

describe('ThemeEnvironment', () => {
  it('renders children', () => {
    render(
      <ThemeEnvironment themeId="animals">
        <span>hello</span>
      </ThemeEnvironment>
    )
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('renders floating environment particles', () => {
    const { container } = render(
      <ThemeEnvironment themeId="space">
        <div />
      </ThemeEnvironment>
    )
    const particles = container.querySelectorAll('[data-testid="env-particle"]')
    expect(particles.length).toBeGreaterThanOrEqual(4)
  })

  it('applies a theme-specific background class', () => {
    const { container } = render(
      <ThemeEnvironment themeId="ocean">
        <div />
      </ThemeEnvironment>
    )
    // Outer wrapper should carry some bg- or gradient class
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toMatch(/bg-|from-|gradient/)
  })

  it('renders without error for all 8 themes', () => {
    for (const themeId of THEMES) {
      expect(() =>
        render(
          <ThemeEnvironment themeId={themeId}>
            <div />
          </ThemeEnvironment>
        )
      ).not.toThrow()
    }
  })

  it('falls back gracefully for unknown theme', () => {
    expect(() =>
      render(
        <ThemeEnvironment themeId="totally-unknown">
          <div />
        </ThemeEnvironment>
      )
    ).not.toThrow()
  })

  it('particles carry an animation class', () => {
    const { container } = render(
      <ThemeEnvironment themeId="dinos">
        <div />
      </ThemeEnvironment>
    )
    const particles = container.querySelectorAll('[data-testid="env-particle"]')
    particles.forEach((p) => {
      expect(p.className).toMatch(/animate-/)
    })
  })
})
