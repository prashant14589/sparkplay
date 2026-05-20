'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { type Theme, type AgeGroupId, THEMES, getLevels, getAgeTier } from '@/lib/themes'
import { recordCompletion, getProgress, type Badge } from '@/lib/progress'
import { Sounds } from '@/lib/sounds'
import { getActiveBuddy, calcLevel, calcXP, randomPhrase } from '@/lib/buddy'
import HowToPlay from '@/components/games/HowToPlay'
import LevelComplete from '@/components/LevelComplete'
import GameEmoji from '@/components/GameEmoji'
import IllustrationImage from '@/components/IllustrationImage'
import MatchParticles from '@/components/MatchParticles'
import BuddyMatchReaction from '@/components/BuddyMatchReaction'
import ThemeEnvironment from '@/components/ThemeEnvironment'
import { getCardIllustration } from '@/lib/illustrations'

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
  childName?: string
  isAuthenticated?: boolean
  onLevelComplete: (level: number, moves: number) => void
}

export default function MemoryMatch({
  theme,
  ageGroup = '4-6',
  childName,
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
  const [seconds, setSeconds] = useState(0)
  const [timerOn, setTimerOn] = useState(false)
  const [totalCoins, setTotalCoins] = useState(0)
  const [justMatched, setJustMatched] = useState<Set<number>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastKey, setToastKey] = useState(0)
  const [reactionActive, setReactionActive] = useState(false)
  const [reaction, setReaction] = useState<{ emoji: string; phrase: string } | null>(null)
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [completionResult, setCompletionResult] = useState<{
    stars: number; coins: number; newBadges: Badge[]; streak: number
  } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const levelCfg = levels[currentLevel - 1]
  const emojisForLevel = activeTheme.cards.slice(0, levelCfg.pairs)

  // Load coins from progress on mount
  useEffect(() => { setTotalCoins(getProgress().totalCoins) }, [])

  // Reset cards on level / theme change
  useEffect(() => {
    setCards(makeCards(emojisForLevel))
    setSelected([])
    setLocked(false)
    setMoves(0)
    setSeconds(0)
    setTimerOn(false)
    setDone(false)
    setCompletionResult(null)
    setJustMatched(new Set())
  }, [activeTheme.id, currentLevel, ageGroup]) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (!timerOn || done) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [timerOn, done])

  const handleFlip = useCallback((id: number) => {
    if (locked || done) return
    const card = cards.find((c) => c.id === id)
    if (!card || card.isFlipped || card.isMatched) return

    if (moves === 0) setTimerOn(true)

    const next = [...selected, id]
    Sounds.flip()
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)))
    setSelected(next)
    if (next.length < 2) return

    const [a, b] = next.map((fid) => cards.find((c) => c.id === fid)!)
    setMoves((m) => m + 1)
    setLocked(true)

    if (a.emoji === b.emoji) {
      Sounds.match()
      // Buddy reaction — clear any in-flight timer so rapid matches don't cancel each other
      const prog = getProgress()
      const buddy = getActiveBuddy(calcLevel(calcXP(prog.totalStars, prog.totalCoins)))
      setReaction({ emoji: buddy.emoji, phrase: randomPhrase(buddy, 'win') })
      setReactionActive(true)
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current)
      reactionTimerRef.current = setTimeout(() => setReactionActive(false), 1500)
      setTimeout(() => {
        setCards((prev) => prev.map((c) => (next.includes(c.id) ? { ...c, isMatched: true } : c)))
        setJustMatched(new Set(next))
        setShowToast(true)
        setToastKey((k) => k + 1)
        setSelected([])
        setLocked(false)
        setTimeout(() => setJustMatched(new Set()), 650)
        setTimeout(() => setShowToast(false), 1700)
      }, 400)
    } else {
      Sounds.mismatch()
      setTimeout(() => {
        setCards((prev) => prev.map((c) => (next.includes(c.id) ? { ...c, isFlipped: false } : c)))
        setSelected([])
        setLocked(false)
      }, 850)
    }
  }, [cards, selected, locked, done, moves])

  useEffect(() => {
    // Guard: moves > 0 prevents false trigger on freshly-reset cards.
    // `done` is intentionally NOT in the dep array — if it were, calling
    // setDone(false) in nextLevel() would re-trigger this effect with the
    // still-matched cards from the previous level and skip a level.
    if (cards.length > 0 && moves > 0 && cards.every((c) => c.isMatched) && !done) {
      Sounds.win()
      setDone(true)
      setTimerOn(false)
      onLevelComplete(currentLevel, moves)
      const r = recordCompletion('memory', activeTheme.id, ageGroup, currentLevel, moves, levelCfg.pairs)
      setTotalCoins(getProgress().totalCoins)
      setCompletionResult({ stars: r.stars, coins: r.coinsEarned, newBadges: r.newBadges, streak: r.streak })
    }
  }, [cards]) // eslint-disable-line react-hooks/exhaustive-deps

  function goToLevel(lvl: number) { setCurrentLevel(lvl); setDone(false) }
  function nextLevel() { if (currentLevel < TOTAL_LEVELS) { setCurrentLevel((l) => l + 1); setDone(false) } }
  function replay() {
    setCards(makeCards(emojisForLevel))
    setMoves(0); setSeconds(0); setTimerOn(false)
    setDone(false); setCompletionResult(null)
  }

  const matched = cards.filter((c) => c.isMatched).length / 2
  const isLevelLocked = (lvl: number) => lvl > 1 && !isAuthenticated

  // Cell size — computed from actual viewport so the grid never overflows at 375px.
  // ~64px is eaten by page-container + game-card padding on both sides.
  const availW = typeof window !== 'undefined'
    ? Math.min(window.innerWidth - 64, 320)
    : 311
  const gapTotal = (levelCfg.cols - 1) * 8
  const cellPx = Math.max(44, Math.floor((availW - gapTotal) / levelCfg.cols))
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (cards.length === 0) {
    return (
      <div className="select-none">
        <div className="h-8 bg-gray-100 rounded-xl animate-pulse mb-4" />
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${levelCfg.cols}, minmax(0,1fr))` }}>
          {Array.from({ length: levelCfg.pairs * 2 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const tier = getAgeTier(ageGroup)

  return (
    <div className="select-none">
      <HowToPlay gameType="memory" />

      {/* Age tier badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${tier.color}`}>
          {tier.emoji} {tier.label}
        </span>
        <span className="text-xs text-gray-400 font-semibold">Level {currentLevel}/{TOTAL_LEVELS}</span>
      </div>

      {/* ── Gameplay header bar (matches mockup screen 2) ── */}
      <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-sm font-black text-gray-500">
          <span className="text-base">⏱</span>
          <span className="font-mono tabular-nums">{fmt(seconds)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-black text-yellow-600 text-sm">
            🪙 {totalCoins}
          </span>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1 font-black text-gray-500 text-sm">
            🔄 {moves}
          </span>
        </div>
      </div>

      {/* Level tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((lvl) => {
          const locked = isLevelLocked(lvl)
          return (
            <button
              key={lvl}
              onClick={() => !locked && goToLevel(lvl)}
              disabled={locked}
              title={locked ? 'Sign up to unlock' : `Level ${lvl} — ${levels[lvl - 1].pairs} pairs`}
              className={[
                'px-3 py-2 rounded-full text-xs font-black transition-all border-2 min-h-[44px]',
                currentLevel === lvl
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200'
                  : locked
                    ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-violet-400 hover:text-violet-600',
              ].join(' ')}
            >
              {locked ? '🔒' : `L${lvl}`}
              {!locked && <span className="ml-1 opacity-60">{levels[lvl - 1].pairs}p</span>}
            </button>
          )
        })}
      </div>

      {/* Card grid — wrapped in themed living-world environment */}
      <ThemeEnvironment themeId={activeTheme.id} className="p-3 mb-1">
      <div className="relative" ref={gridRef}>
        <div
          className="grid gap-2 mx-auto"
          style={{ gridTemplateColumns: `repeat(${levelCfg.cols}, ${cellPx}px)` }}
        >
          {cards.map((card) => {
            const isJustMatched = justMatched.has(card.id)
            const showFront = card.isFlipped || card.isMatched
            return (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                disabled={card.isMatched || locked}
                style={{ width: cellPx, height: cellPx }}
                className={[
                  'rounded-2xl relative focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
                  'transition-all duration-200',
                  isJustMatched ? 'overflow-visible' : 'overflow-hidden',
                  !card.isMatched && !card.isFlipped ? 'hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer' : '',
                  isJustMatched ? 'animate-match-pop animate-match-glow' : '',
                ].join(' ')}
              >
                {/* ── Card back — purple gradient + CSS sparkle pattern ── */}
                <div
                  className={[
                    'absolute inset-0 rounded-2xl flex items-center justify-center',
                    'transition-all duration-300',
                    showFront ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100',
                  ].join(' ')}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Repeating sparkle dots pattern */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: `${cellPx * 0.28}px ${cellPx * 0.28}px`,
                    }}
                  />
                  {/* Centred sparkle star */}
                  <span style={{ fontSize: cellPx * 0.38, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.3))', zIndex: 1 }}>
                    ✦
                  </span>
                </div>

                {/* ── Card front — white with commissioned illustration ── */}
                <div
                  className={[
                    'absolute inset-0 rounded-2xl flex items-center justify-center border-2 shadow-lg',
                    'transition-all duration-300',
                    card.isMatched
                      ? 'bg-gradient-to-br from-green-100 to-emerald-200 border-green-300'
                      : 'bg-white border-violet-100',
                    showFront ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none',
                  ].join(' ')}
                >
                  {/* emojiIndex tracks position in theme.cards array for illustration lookup */}
                  <IllustrationImage
                    src={getCardIllustration(activeTheme.id, activeTheme.cards.indexOf(card.emoji))}
                    alt={card.emoji}
                    size={Math.floor(cellPx * 0.72)}
                    fallbackEmoji={card.emoji}
                    skeleton
                  />
                </div>
                <MatchParticles active={isJustMatched} themeId={activeTheme.id} />
              </button>
            )
          })}
        </div>

        {/* MATCH! toast */}
        {showToast && (
          <div
            key={toastKey}
            className="animate-match-toast pointer-events-none absolute z-20"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="bg-white rounded-2xl px-5 py-2.5 shadow-2xl border-4 border-yellow-400 whitespace-nowrap flex items-center gap-2">
              <GameEmoji emoji="🎉" size={28} />
              <span className="font-black text-violet-700 text-xl">MATCH!</span>
              <GameEmoji emoji="✨" size={28} />
            </div>
          </div>
        )}
      </div>

      {/* Buddy reaction */}
      <div className="flex justify-end mt-2 min-h-[44px] px-1">
        <BuddyMatchReaction
          active={reactionActive}
          buddyEmoji={reaction?.emoji ?? '🦕'}
          phrase={reaction?.phrase}
        />
      </div>
      </ThemeEnvironment>

      {/* Pairs progress bar (matches mockup bottom bar) */}
      <div className="flex items-center gap-3 mt-1 px-1">
        <span className="text-xs font-black text-gray-400 whitespace-nowrap">
          Pairs: {matched}/{levelCfg.pairs}
        </span>
        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
            style={{ width: `${(matched / levelCfg.pairs) * 100}%` }}
          />
        </div>
        <span className="text-lg">⭐</span>
      </div>

      {/* Level complete full-screen overlay */}
      {done && completionResult && (
        <LevelComplete
          level={currentLevel}
          totalLevels={TOTAL_LEVELS}
          stars={completionResult.stars}
          coins={completionResult.coins}
          moves={moves}
          childName={childName}
          newBadges={completionResult.newBadges}
          streak={completionResult.streak}
          themeEmoji={activeTheme.cards[0]} themeId={activeTheme.id}
          isAuthenticated={isAuthenticated}
          onReplay={replay}
          onNext={currentLevel < TOTAL_LEVELS ? nextLevel : undefined}
        />
      )}
    </div>
  )
}
