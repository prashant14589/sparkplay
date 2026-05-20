import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { getCreationSteps, useCreationSteps } from '../creationSteps'

afterEach(() => { vi.useRealTimers() })

// ── Pure function ────────────────────────────────────────────────────────────

describe('getCreationSteps — puzzle', () => {
  it('returns at least 3 steps', () => {
    expect(getCreationSteps('puzzle').length).toBeGreaterThanOrEqual(3)
  })
  it('includes child name somewhere in the steps', () => {
    const joined = getCreationSteps('puzzle', 'Emma').join(' ')
    expect(joined).toContain('Emma')
  })
  it('falls back to "your" when no name given', () => {
    expect(getCreationSteps('puzzle')[0]).toContain('your')
  })
  it('never contains the string "undefined"', () => {
    expect(getCreationSteps('puzzle').join(' ')).not.toContain('undefined')
    expect(getCreationSteps('puzzle', '').join(' ')).not.toContain('undefined')
  })
  it('last step signals near-completion', () => {
    expect(getCreationSteps('puzzle').at(-1)).toMatch(/ready|done|✅|🌟/i)
  })
})

describe('getCreationSteps — story', () => {
  it('returns at least 3 steps', () => {
    expect(getCreationSteps('story').length).toBeGreaterThanOrEqual(3)
  })
  it('includes child name when provided', () => {
    const joined = getCreationSteps('story', 'Aisha').join(' ')
    expect(joined).toContain('Aisha')
  })
  it('puzzle and story have different first steps', () => {
    expect(getCreationSteps('puzzle', 'Leo')[0]).not.toBe(getCreationSteps('story', 'Leo')[0])
  })
})

// ── Hook ─────────────────────────────────────────────────────────────────────

describe('useCreationSteps', () => {
  it('starts at step index 0', () => {
    const { result } = renderHook(() => useCreationSteps('puzzle', 'Aria'))
    expect(result.current.stepIndex).toBe(0)
    expect(result.current.text).toBe(getCreationSteps('puzzle', 'Aria')[0])
  })

  it('exposes total step count', () => {
    const { result } = renderHook(() => useCreationSteps('story'))
    expect(result.current.total).toBe(getCreationSteps('story').length)
  })

  it('advances to next step after the interval fires', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCreationSteps('puzzle', 'Aria'))
    act(() => { vi.advanceTimersByTime(1600) })
    expect(result.current.stepIndex).toBe(1)
  })

  it('does not advance past the final step', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCreationSteps('puzzle'))
    const total = getCreationSteps('puzzle').length
    act(() => { vi.advanceTimersByTime(1600 * (total + 10)) })
    expect(result.current.stepIndex).toBe(total - 1)
  })

  it('resets to 0 when childName changes', () => {
    vi.useFakeTimers()
    let name = 'Emma'
    const { result, rerender } = renderHook(() => useCreationSteps('puzzle', name))
    act(() => { vi.advanceTimersByTime(1600) })
    expect(result.current.stepIndex).toBe(1)
    name = 'Leo'
    rerender()
    expect(result.current.stepIndex).toBe(0)
  })
})
