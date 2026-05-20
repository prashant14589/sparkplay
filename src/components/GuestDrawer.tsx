'use client'

import Link from 'next/link'

type Variant = 'rewards' | 'profile'

interface Props {
  open: boolean
  variant: Variant
  onClose: () => void
}

const BADGE_PREVIEWS = ['🏅','⭐','🔥','🧩','🃏','🌟','🎯','🦁']

const CONTENT: Record<Variant, { title: string; subtitle: string; body: React.ReactNode }> = {
  rewards: {
    title: 'Your Rewards',
    subtitle: 'Sign up to keep every star, badge and streak you earn.',
    body: (
      <div className="flex flex-wrap gap-2 justify-center my-4">
        {BADGE_PREVIEWS.map((b, i) => (
          <span
            key={i}
            className="w-12 h-12 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center text-2xl"
            style={{ filter: 'grayscale(1)', opacity: 0.5 }}
          >
            {b}
          </span>
        ))}
        <p className="w-full text-center text-xs text-gray-400 font-semibold mt-1">
          Unlock badges by playing — sign up to save them forever
        </p>
      </div>
    ),
  },
  profile: {
    title: 'Your Profile',
    subtitle: 'Save your child\'s name, progress and streaks across devices.',
    body: (
      <div className="my-4 space-y-3">
        {[
          { emoji: '🎮', text: 'Progress saved across sessions' },
          { emoji: '🔥', text: 'Daily streaks that build habits' },
          { emoji: '🧩', text: 'Personalised puzzles with your name' },
          { emoji: '👨‍👩‍👧', text: 'Multiple child profiles' },
        ].map(({ emoji, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm font-semibold text-gray-600">
            <span className="text-xl w-8 text-center">{emoji}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    ),
  },
}

export default function GuestDrawer({ open, variant, onClose }: Props) {
  if (!open) return null

  const { title, subtitle, body } = CONTENT[variant]

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl p-6 pb-10 animate-slide-up"
      >
        {/* Handle + close */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
          <h2 className="font-black text-gray-900 text-lg">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 font-semibold mb-1">{subtitle}</p>

        {body}

        <Link
          href="/signup"
          className="block w-full text-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 py-3.5 text-white font-black text-base shadow-lg shadow-violet-200 hover:opacity-90 mt-2"
        >
          Sign up free — takes 30 seconds
        </Link>

        <p className="text-center text-xs text-gray-300 font-semibold mt-3">
          No credit card · No ads · Built for kids
        </p>
      </div>
    </>
  )
}
