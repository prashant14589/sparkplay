'use client'

import { useEffect, useState } from 'react'
import { getActiveBuddy, calcXP, calcLevel, xpToNextLevel, getUnlockedBuddies, setActiveBuddy, randomPhrase, BUDDIES, type Buddy } from '@/lib/buddy'
import { getProgress } from '@/lib/progress'

interface BuddyWidgetProps {
  size?: 'sm' | 'lg'
  winMode?: boolean       // shows a win phrase instead of idle
  showSelector?: boolean  // shows buddy switcher
}

export default function BuddyWidget({ size = 'sm', winMode = false, showSelector = false }: BuddyWidgetProps) {
  const [buddy, setBuddy] = useState<Buddy | null>(null)
  const [phrase, setPhrase] = useState('')
  const [level, setLevel] = useState(1)
  const [xpInfo, setXpInfo] = useState({ current: 0, needed: 100, pct: 0 })
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    const p = getProgress()
    const xp = calcXP(p.totalStars, p.totalCoins)
    const lvl = calcLevel(xp)
    const info = xpToNextLevel(xp)
    setLevel(lvl)
    setXpInfo(info)
    const b = getActiveBuddy(lvl)
    setBuddy(b)
    setPhrase(randomPhrase(b, winMode ? 'win' : 'idle'))
  }, [winMode])

  // Rotate idle phrase every 5 seconds
  useEffect(() => {
    if (!buddy || winMode) return
    const id = setInterval(() => setPhrase(randomPhrase(buddy, 'idle')), 5000)
    return () => clearInterval(id)
  }, [buddy, winMode])

  if (!buddy) return null

  const emojiSize = size === 'lg' ? 'text-5xl' : 'text-3xl'
  const unlockedBuddies = getUnlockedBuddies(level)

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Buddy emoji with bounce */}
        <div
          className={`${emojiSize} animate-bounce cursor-pointer select-none`}
          onClick={() => showSelector && setShowPicker(p => !p)}
          title={showSelector ? 'Switch buddy' : buddy.name}
        >
          {buddy.emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + level */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-black text-white text-sm">{buddy.name}</span>
            <span className="text-[10px] font-bold text-white/60 bg-white/20 rounded-full px-1.5 py-0.5">
              Lv.{level}
            </span>
          </div>

          {/* Speech bubble */}
          <div className="bg-white/20 rounded-xl px-2.5 py-1 max-w-[160px]">
            <p className="text-[11px] font-bold text-white leading-snug truncate">{phrase}</p>
          </div>

          {/* XP bar (lg only) */}
          {size === 'lg' && (
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-white/60 font-bold mb-1">
                <span>{xpInfo.current} XP</span>
                <span>{xpInfo.needed} to Lv.{Math.min(10, level + 1)}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full transition-all duration-700"
                  style={{ width: `${xpInfo.pct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buddy picker dropdown */}
      {showPicker && showSelector && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 min-w-[200px]">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Your Buddies</p>
          <div className="space-y-1">
            {BUDDIES.map(b => {
              const unlocked = b.unlockLevel <= level
              return (
                <button
                  key={b.id}
                  disabled={!unlocked}
                  onClick={() => { setActiveBuddy(b.id); setBuddy(b); setPhrase(randomPhrase(b, 'idle')); setShowPicker(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                    buddy.id === b.id ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50'
                  } ${!unlocked ? 'opacity-40' : ''}`}
                >
                  <span className="text-2xl">{b.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{b.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {unlocked ? `Lv.${level} · Active` : `Unlocks at Lv.${b.unlockLevel}`}
                    </p>
                  </div>
                  {buddy.id === b.id && <span className="ml-auto text-violet-500 text-xs">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
