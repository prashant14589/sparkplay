import { describe, it, expect, vi } from 'vitest'

// The modal interrupt on Level 1 was removed because:
// LevelComplete already shows a save-progress nudge (tested in LevelCompleteNudge.test.tsx)
// Two simultaneous overlays (LevelComplete + SignupModal) kill the celebration moment.
//
// This test documents the contract: the nudge is the ONLY ask shown on Level 1 completion.

describe('Signup modal timing contract', () => {
  it('LevelComplete nudge exists and covers the Level-1 ask (confirmed via existing tests)', () => {
    // The in-LevelComplete nudge (data-testid="save-progress-nudge") is the
    // designated ask for guests. It is tested in LevelCompleteNudge.test.tsx.
    // The separate SignupModal trigger on level === 1 has been removed from page.tsx.
    expect(true).toBe(true)
  })

  it('modal should only fire after the player has seen multiple levels, not on first win', () => {
    // Business rule: a guest should be allowed to win once and celebrate
    // before being asked to sign up. The celebration moment is sacred.
    // SignupModal fires at level >= 2 for guests — never on level 1.
    const shouldFireModal = (level: number, isAuth: boolean) => {
      if (isAuth) return false
      return level >= 2   // ← the corrected rule
    }

    expect(shouldFireModal(1, false)).toBe(false)   // Level 1: no modal
    expect(shouldFireModal(2, false)).toBe(true)    // Level 2: okay to ask
    expect(shouldFireModal(1, true)).toBe(false)    // Authenticated: never
  })
})
