import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MemoryMoment from '../MemoryMoment'
import { MEMORY_PROMPTS } from '@/lib/memoryThemes'

const ALL_MEMORY_IDS = Object.keys(MEMORY_PROMPTS)

describe('MemoryMoment — renders', () => {
  it('renders nothing when themeId is not a memory theme', () => {
    const { container } = render(
      <MemoryMoment themeId="animals" onDismiss={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders for a valid memory theme', () => {
    render(<MemoryMoment themeId="monsoon" onDismiss={() => {}} />)
    expect(screen.getByTestId('memory-moment')).toBeInTheDocument()
  })

  it('shows the prompt text for monsoon', () => {
    render(<MemoryMoment themeId="monsoon" onDismiss={() => {}} />)
    const el = screen.getByTestId('memory-moment')
    expect(el.textContent).toContain(MEMORY_PROMPTS.monsoon.prompt)
  })

  it('shows a title for each memory theme', () => {
    for (const id of ALL_MEMORY_IDS) {
      const { container, unmount } = render(
        <MemoryMoment themeId={id} onDismiss={() => {}} />
      )
      expect(container.textContent).toContain(MEMORY_PROMPTS[id].title)
      unmount()
    }
  })

  it('renders without throwing for all 8 memory themes', () => {
    for (const id of ALL_MEMORY_IDS) {
      expect(() =>
        render(<MemoryMoment themeId={id} onDismiss={() => {}} />)
      ).not.toThrow()
    }
  })
})

describe('MemoryMoment — dismiss', () => {
  it('calls onDismiss when close button is clicked', () => {
    const onDismiss = vi.fn()
    render(<MemoryMoment themeId="monsoon" onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /close|dismiss|got it/i }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('shows a "Got it" or close affordance', () => {
    render(<MemoryMoment themeId="gully_cricket" onDismiss={() => {}} />)
    // Either a button with dismiss label or an ✕ button
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
  })
})

describe('MemoryMoment — cultural cue', () => {
  it('shows the cross-cultural cue line', () => {
    render(<MemoryMoment themeId="monsoon" onDismiss={() => {}} />)
    expect(screen.getByTestId('memory-moment').textContent).toContain(
      MEMORY_PROMPTS.monsoon.cue
    )
  })
})
