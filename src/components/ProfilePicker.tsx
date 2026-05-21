'use client'

import type { ChildProfile } from '@/lib/childProfile'
import { AGE_GROUPS } from '@/lib/themes'

const BUDDY_EMOJI: Record<string, string> = {
  rexy: '🦕', puffy: '🦄', scout: '🐶', spark: '⚡',
}

interface Props {
  profile: ChildProfile
  onSwitch: () => void
}

export default function ProfilePicker({ profile, onSwitch }: Props) {
  const ageLabel = AGE_GROUPS.find(ag => ag.id === profile.ageGroup)?.label ?? profile.ageGroup
  const buddyEmoji = BUDDY_EMOJI[profile.buddyId] ?? '🦕'

  return (
    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 px-4 py-3 mb-4 shadow-sm">
      {/* Identity */}
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{buddyEmoji}</span>
        <div>
          <p className="font-black text-gray-900 text-sm leading-tight">{profile.name}</p>
          <p className="text-xs text-gray-400 font-semibold">{ageLabel}</p>
        </div>
      </div>

      {/* Switch */}
      <button
        onClick={onSwitch}
        aria-label={`Switch — not ${profile.name}?`}
        className="text-xs text-gray-400 font-black hover:text-violet-600 transition-colors px-2 py-1 rounded-xl hover:bg-violet-50 min-h-[44px]"
      >
        Not {profile.name}?
      </button>
    </div>
  )
}
