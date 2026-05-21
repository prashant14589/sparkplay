'use client'

import Link from 'next/link'
import type { Quest } from '@/lib/quests'
import { getQuestCTA } from '@/lib/quests'

interface Props {
  quest: Quest
  progress: number
  onScrollToGame?: () => void   // called when CTA action === 'scroll'
}

export default function QuestTeaser({ quest, progress, onScrollToGame }: Props) {
  const pct  = Math.min(100, Math.round((progress / quest.target) * 100))
  const done = progress >= quest.target
  const cta  = getQuestCTA(quest.game)

  return (
    <div className={`rounded-3xl border-2 p-4 transition-all duration-500 ${
      done
        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
        : 'bg-white/70 backdrop-blur-sm border-white/80 shadow-md'
    }`}>

      {/* Header */}
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

      {/* Identity */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-3xl leading-none select-none ${done ? '' : 'animate-bounce'}`}>
          {quest.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-base leading-tight">{quest.title}</p>
          <p className="text-xs font-semibold text-gray-400 mt-0.5 truncate">{quest.description}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="font-black text-lg leading-none text-violet-600">
            {Math.min(progress, quest.target)}
          </span>
          <span className="text-xs font-bold text-gray-300"> / {quest.target}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
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

      {/* CTA — specific and actionable */}
      {!done && (
        cta.action === 'scroll' ? (
          <button
            onClick={onScrollToGame}
            className="w-full text-left text-xs font-black text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            {cta.label}
          </button>
        ) : (
          <Link
            href={cta.href!}
            className="w-full text-left text-xs font-black text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            {cta.label}
          </Link>
        )
      )}

      {!done && progress > 0 && (
        <p className="text-[10px] font-black text-violet-500 mt-1.5 text-right">
          {quest.target - progress} more to go! 🔥
        </p>
      )}
    </div>
  )
}
