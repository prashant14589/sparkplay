'use client'

import type { Quest } from '@/lib/quests'

interface Props {
  quest: Quest
  progress: number
}

export default function QuestTeaser({ quest, progress }: Props) {
  const pct = Math.min(100, Math.round((progress / quest.target) * 100))
  const done = progress >= quest.target

  return (
    <div className={`rounded-3xl border-2 p-4 transition-all duration-500 ${
      done
        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
        : 'bg-white/70 backdrop-blur-sm border-white/80 shadow-md'
    }`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Today&apos;s Quest
        </span>
        {done && (
          <span className="text-xs font-black text-emerald-600 bg-emerald-100 rounded-full px-2.5 py-0.5">
            ✅ Complete!
          </span>
        )}
      </div>

      {/* Quest identity */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-3xl leading-none select-none ${done ? '' : 'animate-bounce'}`}>
          {quest.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-base leading-tight">{quest.title}</p>
          <p className="text-xs font-semibold text-gray-400 mt-0.5 truncate">{quest.description}</p>
        </div>
        {/* Progress counter */}
        <div className="flex-shrink-0 text-right">
          <span className="font-black text-lg leading-none text-violet-600">
            {Math.min(progress, quest.target)}
          </span>
          <span className="text-xs font-bold text-gray-300"> / {quest.target}</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          data-testid="quest-progress-bar"
          className={`h-full rounded-full transition-all duration-700 ${
            done
              ? 'bg-gradient-to-r from-emerald-400 to-green-500'
              : 'bg-gradient-to-r from-violet-500 to-purple-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Motivational sub-line */}
      {!done && progress > 0 && (
        <p className="text-[10px] font-black text-violet-500 mt-2 text-right">
          {quest.target - progress} more to go! 🔥
        </p>
      )}
      {!done && progress === 0 && (
        <p className="text-[10px] font-semibold text-gray-300 mt-2">
          Play a game below to start ↓
        </p>
      )}
    </div>
  )
}
