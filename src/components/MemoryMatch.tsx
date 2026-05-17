'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Theme, type AgeGroupId, THEMES, getLevels } from '@/lib/themes'
import HowToPlay from '@/components/games/HowToPlay'

type Card = { id: number; emoji: string; isFlipped: boolean; isMatched: boolean }

function makeCards(emojis: string[]): Card[] {
  const pairs = [...emojis, ...emojis]
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return pairs.map((emoji, i) => ({ id: i, emoji, isFlipped: false, isMatched: false }))
}

const TOTAL_LEVELS = 5

interface Props {
  theme?: Theme
  ageGroup?: AgeGroupId
  isAuthenticated?: boolean
  onLevelComplete: (level: number, moves: number) => void
}

export default function MemoryMatch({
  theme,
  ageGroup = '4-6',
  isAuthenticated = false,
  onLevelComplete,
}: Props) {
  const activeTheme = theme ?? THEMES[0]
  const levels = getLevels(ageGroup)

  const [currentLevel, setCurrentLevel] = useState(1)
  const [cards, setCards] = useState<Card[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [done, setDone] = useState(false)

  const levelCfg = levels[currentLevel - 1]
  const emojisForLevel = activeTheme.cards.slice(0, levelCfg.pairs)

  // Reset cards whenever theme or level changes (client-only)
  useEffect(() => {
    setCards(makeCards(emojisForLevel))
    setSelected([])
    setLocked(false)
    setMoves(0)
    setDone(false)
  }, [activeTheme.id, currentLevel, ageGroup]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFlip = useCallback((id: number) => {
    if (locked || done) return
    const card = cards.find((c) => c.id === id)
    if (!card || card.isFlipped || card.isMatched) return

    const next = [...selected, id]
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)))
    setSelected(next)
    if (next.length < 2) return

    const [a, b] = next.map((fid) => cards.find((c) => c.id === fid)!)
    setMoves((m) => m + 1)
    setLocked(true)

    if (a.emoji === b.emoji) {
      setTimeout(() => {
        setCards((prev) => prev.map((c) => (next.includes(c.id) ? { ...c, isMatched: true } : c)))
        setSelected([])
        setLocked(false)
      }, 400)
    } else {
      setTimeout(() => {
        setCards((prev) => prev.map((c) => (next.includes(c.id) ? { ...c, isFlipped: false } : c)))
        setSelected([])
        setLocked(false)
      }, 900)
    }
  }, [cards, selected, locked, done])

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched) && !done) {
      setDone(true)
      onLevelComplete(currentLevel, moves)
    }
  }, [cards, done, moves, currentLevel, onLevelComplete])

  function goToLevel(lvl: number) {
    setCurrentLevel(lvl)
    setDone(false)
  }

  function nextLevel() {
    if (currentLevel < TOTAL_LEVELS) {
      setCurrentLevel((l) => l + 1)
      setDone(false)
    }
  }

  const matched = cards.filter((c) => c.isMatched).length / 2
  const isLevelLocked = (lvl: number) => lvl > 1 && !isAuthenticated

  // Cell size — shrinks for larger grids to fit mobile
  const cellPx = Math.min(72, Math.floor(340 / levelCfg.cols))

  // Skeleton
  if (cards.length === 0) {
    return (
      <div className="select-none">
        <div className="h-8 bg-gray-100 rounded animate-pulse mb-4" />
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${levelCfg.cols}, minmax(0,1fr))` }}
        >
          {Array.from({ length: levelCfg.pairs * 2 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="select-none">
      <HowToPlay gameType="memory" />

      {/* Level tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((lvl) => {
          const locked = isLevelLocked(lvl)
          return (
            <button
              key={lvl}
              onClick={() => !locked && goToLevel(lvl)}
              disabled={locked}
              title={locked ? 'Sign up to unlock' : `Level ${lvl} — ${levels[lvl-1].pairs} pairs`}
              className={[
                'px-3 py-1 rounded-full text-xs font-semibold transition-all border',
                currentLevel === lvl
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : locked
                    ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-violet-400 hover:text-violet-600',
              ].join(' ')}
            >
              {locked ? '🔒' : `L${lvl}`}
              {!locked && <span className="ml-1 opacity-60">{levels[lvl-1].pairs}p</span>}
            </button>
          )
        })}
      </div>

      {/* Stats bar */}
      <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-500">
        <span>{activeTheme.emoji} {activeTheme.name} · Level {currentLevel}</span>
        <span className="flex gap-3 text-xs">
          <span>🃏 {matched}/{levelCfg.pairs}</span>
          <span>🔄 {moves}</span>
        </span>
      </div>

      {/* Card grid */}
      <div
        className="grid gap-2 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${levelCfg.cols}, ${cellPx}px)`,
          width: levelCfg.cols * cellPx + (levelCfg.cols - 1) * 8,
        }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            disabled={card.isMatched || locked}
            style={{ width: cellPx, height: cellPx, fontSize: cellPx * 0.45 }}
            className={[
              'rounded-xl flex items-center justify-center',
              'transition-all duration-300 border-2',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
              card.isMatched
                ? 'bg-green-50 border-green-300 scale-95 cursor-default'
                : card.isFlipped
                  ? 'bg-white border-violet-300 shadow-lg scale-105'
                  : `bg-gradient-to-br ${activeTheme.color} border-transparent hover:scale-105 hover:shadow-md cursor-pointer active:scale-95`,
            ].join(' ')}
          >
            <span className={`transition-all duration-200 ${card.isFlipped || card.isMatched ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              {card.emoji}
            </span>
          </button>
        ))}
      </div>

      {/* Level complete banner */}
      {done && (
        <div className="mt-5 rounded-2xl bg-green-50 border-2 border-green-300 p-4 text-center">
          <p className="text-2xl mb-1">{currentLevel === TOTAL_LEVELS ? '🏆' : '🎉'}</p>
          <p className="font-bold text-green-800">
            {currentLevel === TOTAL_LEVELS
              ? `All ${TOTAL_LEVELS} levels complete! You're a champion!`
              : `Level ${currentLevel} complete!`}
          </p>
          <p className="text-sm text-green-600 mt-0.5">Finished in {moves} moves</p>
          <div className="flex gap-2 justify-center mt-3">
            <button
              onClick={() => { setCards(makeCards(emojisForLevel)); setMoves(0); setDone(false) }}
              className="rounded-lg border border-green-400 px-3 py-1.5 text-sm text-green-700 font-semibold hover:bg-green-100"
            >
              Replay
            </button>
            {currentLevel < TOTAL_LEVELS && (
              <button
                onClick={nextLevel}
                className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white font-semibold hover:bg-green-700"
              >
                Level {currentLevel + 1} →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
