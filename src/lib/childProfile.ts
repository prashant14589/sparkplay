import type { AgeGroupId } from './themes'

export interface ChildProfile {
  name: string
  ageGroup: AgeGroupId
  buddyId: string
}

const PROFILE_KEY = 'sp_child_profile'

export function getChildProfile(): ChildProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ChildProfile
    if (!parsed.name || !parsed.ageGroup) return null
    return parsed
  } catch {
    return null
  }
}

export function saveChildProfile(profile: ChildProfile): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_KEY, JSON.stringify({
    ...profile,
    name: profile.name.trim(),
  }))
}

export function clearChildProfile(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PROFILE_KEY)
}

export function hasChildProfile(): boolean {
  return getChildProfile() !== null
}
