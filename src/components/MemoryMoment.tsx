'use client'

import { MEMORY_PROMPTS, isMemoryTheme } from '@/lib/memoryThemes'

interface Props {
  themeId: string
  onDismiss: () => void
}

export default function MemoryMoment({ themeId, onDismiss }: Props) {
  if (!isMemoryTheme(themeId)) return null

  const { title, prompt, cue, parentNote } = MEMORY_PROMPTS[themeId]

  return (
    <div
      data-testid="memory-moment"
      className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 mb-5 relative"
    >
      {/* Decorative corner quote */}
      <span className="absolute top-3 right-4 text-3xl opacity-10 select-none">"</span>

      {/* Label */}
      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">
        🧡 A moment to share
      </p>

      {/* Title — the question */}
      <h3 className="font-black text-gray-900 text-base leading-snug mb-2">
        {title}
      </h3>

      {/* The prompt */}
      <p className="text-sm text-gray-600 font-semibold leading-relaxed mb-3">
        {prompt}
      </p>

      {/* Parent note — the one thing that makes them pause */}
      <div className="bg-white/70 rounded-2xl px-4 py-3 mb-4 border border-amber-100">
        <p className="text-xs text-amber-700 font-semibold leading-relaxed italic">
          {parentNote}
        </p>
      </div>

      {/* Cross-cultural cue — shows this is everyone's memory */}
      <p className="text-[10px] text-gray-400 font-semibold mb-4 leading-relaxed">
        {cue}
      </p>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        aria-label="Got it"
        className="w-full rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm py-3 transition-colors min-h-[44px]"
      >
        Got it — let&apos;s play 🎮
      </button>
    </div>
  )
}
