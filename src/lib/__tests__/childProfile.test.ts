import { describe, it, expect, beforeEach } from 'vitest'
import {
  getChildProfile,
  saveChildProfile,
  clearChildProfile,
  hasChildProfile,
} from '../childProfile'

beforeEach(() => {
  localStorage.clear()
})

describe('childProfile — read', () => {
  it('returns null when no profile is stored', () => {
    expect(getChildProfile()).toBeNull()
  })

  it('returns the profile after saving', () => {
    saveChildProfile({ name: 'Emma', ageGroup: '4-6', buddyId: 'rexy' })
    const p = getChildProfile()
    expect(p?.name).toBe('Emma')
    expect(p?.ageGroup).toBe('4-6')
    expect(p?.buddyId).toBe('rexy')
  })

  it('returns null after clearing', () => {
    saveChildProfile({ name: 'Leo', ageGroup: '6-8', buddyId: 'scout' })
    clearChildProfile()
    expect(getChildProfile()).toBeNull()
  })

  it('handles corrupted storage gracefully', () => {
    localStorage.setItem('sp_child_profile', 'not-json{{{')
    expect(() => getChildProfile()).not.toThrow()
    expect(getChildProfile()).toBeNull()
  })
})

describe('childProfile — hasChildProfile', () => {
  it('returns false when no profile exists', () => {
    expect(hasChildProfile()).toBe(false)
  })

  it('returns true after saving a profile', () => {
    saveChildProfile({ name: 'Aria', ageGroup: '2-4', buddyId: 'puffy' })
    expect(hasChildProfile()).toBe(true)
  })

  it('returns false after clearing', () => {
    saveChildProfile({ name: 'Aria', ageGroup: '2-4', buddyId: 'puffy' })
    clearChildProfile()
    expect(hasChildProfile()).toBe(false)
  })
})

describe('childProfile — validation', () => {
  it('saves and retrieves all age groups', () => {
    const ages = ['2-4', '4-6', '6-8', '8-12'] as const
    for (const age of ages) {
      saveChildProfile({ name: 'Test', ageGroup: age, buddyId: 'rexy' })
      expect(getChildProfile()?.ageGroup).toBe(age)
    }
  })

  it('profile name is trimmed on save', () => {
    saveChildProfile({ name: '  Emma  ', ageGroup: '4-6', buddyId: 'rexy' })
    expect(getChildProfile()?.name).toBe('Emma')
  })
})
