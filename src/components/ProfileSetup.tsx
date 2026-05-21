'use client'

import { useState } from 'react'
import { AGE_GROUPS, type AgeGroupId } from '@/lib/themes'
import { saveChildProfile, type ChildProfile } from '@/lib/childProfile'

const BUDDIES = [
  { id: 'rexy',  emoji: '🦕', name: 'Rexy',  desc: 'Adventurous dino' },
  { id: 'puffy', emoji: '🦄', name: 'Puffy', desc: 'Magical unicorn'  },
  { id: 'scout', emoji: '🐶', name: 'Scout', desc: 'Friendly pup'     },
  { id: 'spark', emoji: '⚡', name: 'Spark', desc: 'Super hero'       },
]

interface Props {
  onComplete: (profile: ChildProfile) => void
}

export default function ProfileSetup({ onComplete }: Props) {
  const [name, setName]         = useState('')
  const [ageGroup, setAgeGroup] = useState<AgeGroupId | null>(null)
  const [buddyId, setBuddyId]   = useState('rexy')

  const canSubmit = name.trim().length > 0 && ageGroup !== null

  function handleSubmit() {
    if (!canSubmit || !ageGroup) return
    const profile: ChildProfile = { name: name.trim(), ageGroup, buddyId }
    saveChildProfile(profile)
    onComplete(profile)
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-6 animate-slide-up">

        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-2">✦</div>
          <h1 className="text-xl font-black text-gray-900">Let&apos;s set up your world</h1>
          <p className="text-sm text-gray-400 font-semibold mt-1">Takes 30 seconds. Never asked again.</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2">
            Child&apos;s name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name…"
            maxLength={30}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-900 focus:border-violet-400 focus:outline-none min-h-[48px]"
            autoFocus
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2">How old are they?</label>
          <div className="grid grid-cols-2 gap-2">
            {AGE_GROUPS.map(ag => (
              <button
                key={ag.id}
                onClick={() => setAgeGroup(ag.id)}
                className={[
                  'flex flex-col items-center py-3 rounded-2xl border-2 transition-all font-bold text-sm',
                  ageGroup === ag.id
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-violet-300',
                ].join(' ')}
              >
                <span className="text-xl mb-0.5">{ag.emoji}</span>
                <span className="text-xs font-black">{ag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Buddy */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2">Pick a buddy</label>
          <div className="grid grid-cols-4 gap-2">
            {BUDDIES.map(b => (
              <button
                key={b.id}
                onClick={() => setBuddyId(b.id)}
                className={[
                  'flex flex-col items-center py-2.5 rounded-2xl border-2 transition-all',
                  buddyId === b.id
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-200',
                ].join(' ')}
              >
                <span className="text-2xl">{b.emoji}</span>
                <span className="text-[10px] font-black text-gray-600 mt-0.5">{b.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 py-4 text-white font-black text-base shadow-lg shadow-violet-300 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[52px]"
        >
          Let&apos;s go! 🚀
        </button>
      </div>
    </div>
  )
}
