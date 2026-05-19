'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Badge } from '@/lib/progress'
import { Sounds } from '@/lib/sounds'
import { getActiveBuddy, calcXP, calcLevel, randomPhrase } from '@/lib/buddy'
import { getProgress } from '@/lib/progress'
import GameEmoji from '@/components/GameEmoji'
import IllustrationImage from '@/components/IllustrationImage'
import { getCelebrationIllustration, getHeroIllustration } from '@/lib/illustrations'

interface Props {
  level: number
  totalLevels: number
  stars: number
  coins: number
  moves: number
  childName?: string
  newBadges?: Badge[]
  streak?: number
  themeEmoji?: string   // used as the fallback celebration character
  themeId?: string      // used to load the commissioned celebration illustration
  onNext?: () => void
  onReplay: () => void
}

// Static confetti positions to avoid hydration mismatch
const CONFETTI = [
  { top:'6%',  left:'8%',  bg:'bg-yellow-400', size:'w-3 h-3',   delay:'0s',    dur:'2.8s' },
  { top:'12%', left:'78%', bg:'bg-pink-400',   size:'w-2 h-2',   delay:'0.25s', dur:'3.1s' },
  { top:'4%',  left:'48%', bg:'bg-violet-400', size:'w-3 h-3',   delay:'0.5s',  dur:'2.6s' },
  { top:'22%', left:'4%',  bg:'bg-green-400',  size:'w-2 h-2',   delay:'0.1s',  dur:'3.4s' },
  { top:'18%', left:'90%', bg:'bg-blue-400',   size:'w-3 h-3',   delay:'0.4s',  dur:'2.9s' },
  { top:'8%',  left:'62%', bg:'bg-orange-400', size:'w-2 h-2',   delay:'0.7s',  dur:'3.2s' },
  { top:'30%', left:'14%', bg:'bg-pink-300',   size:'w-2.5 h-2.5', delay:'0.3s', dur:'3.0s' },
  { top:'35%', left:'88%', bg:'bg-yellow-300', size:'w-2 h-2',   delay:'0.6s',  dur:'2.7s' },
  { top:'45%', left:'3%',  bg:'bg-violet-300', size:'w-3 h-3',   delay:'0.2s',  dur:'3.3s' },
  { top:'50%', left:'93%', bg:'bg-green-300',  size:'w-2 h-2',   delay:'0.8s',  dur:'2.5s' },
  { top:'60%', left:'7%',  bg:'bg-cyan-400',   size:'w-2.5 h-2.5', delay:'0.45s','dur':'3.1s' },
  { top:'65%', left:'85%', bg:'bg-rose-400',   size:'w-2 h-2',   delay:'0.15s', dur:'2.8s' },
  { top:'75%', left:'12%', bg:'bg-amber-400',  size:'w-3 h-3',   delay:'0.55s', dur:'3.0s' },
  { top:'80%', left:'80%', bg:'bg-teal-400',   size:'w-2 h-2',   delay:'0.35s', dur:'3.2s' },
  { top:'88%', left:'45%', bg:'bg-purple-400', size:'w-3 h-3',   delay:'0.65s', dur:'2.9s' },
]

export default function LevelComplete({
  level,
  totalLevels,
  stars,
  coins,
  moves,
  childName,
  newBadges = [],
  streak = 0,
  themeEmoji = '🎊',
  themeId,
  onNext,
  onReplay,
}: Props) {
  const router = useRouter()
  const [rewardsVisible, setRewardsVisible] = useState(false)
  const [btnVisible, setBtnVisible] = useState(false)
  const isAllDone = level >= totalLevels
  const name = childName?.trim()

  const p = typeof window !== 'undefined' ? getProgress() : null
  const buddy = p ? getActiveBuddy(calcLevel(calcXP(p.totalStars, p.totalCoins))) : null
  const buddyPhrase = buddy ? randomPhrase(buddy, 'win') : null

  function handleBackToHome() {
    onReplay()           // reset game state / close overlay
    router.push('/')     // navigate to home (no-op if already there, still works)
  }

  // Stagger the reward cards + button entrance
  // win() already fired by the game component; coin() accents the reward reveal
  useEffect(() => {
    const t1 = setTimeout(() => { setRewardsVisible(true); Sounds.coin() }, 500)
    const t2 = setTimeout(() => setBtnVisible(true), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const badge = newBadges[0]
  const sticker = badge
    ? { emoji: badge.emoji, label: `${badge.name}!` }
    : streak >= 2
      ? { emoji: '🔥', label: `${streak}-day streak!` }
      : { emoji: '🎨', label: 'New Sticker!' }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* ✕ close — always visible top-right */}
      <button
        onClick={onReplay}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 font-black text-lg transition-colors"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Confetti dots */}
      {CONFETTI.map((c, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${c.bg} ${c.size} animate-float`}
          style={{ top: c.top, left: c.left, animationDelay: c.delay, animationDuration: c.dur, opacity: 0.7 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm text-center animate-slide-up">

        {/* Character art — always use hero (animal only, no human = no gender mismatch) */}
        <div className="mb-4 flex justify-center">
          <IllustrationImage
            src={themeId ? getHeroIllustration(themeId) : null}
            alt={isAllDone ? 'Champion' : 'Level complete'}
            size={isAllDone ? 160 : 180}
            fallbackEmoji={themeEmoji || '🎉'}
            skeleton
            className="drop-shadow-xl rounded-3xl"
          />
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-black text-gray-800 leading-tight mb-1">
          {name
            ? <>Amazing job, <span className="text-violet-600">{name}</span>! 😄</>
            : isAllDone ? 'You\'re a Champion! 🏆' : 'Amazing job! 🎉'
          }
        </h1>
        <p className="text-gray-400 font-semibold mb-3 text-sm">
          {isAllDone
            ? `You completed all ${totalLevels} levels!`
            : `You completed Level ${level} · ${moves} move${moves !== 1 ? 's' : ''}`}
        </p>
        {buddyPhrase && (
          <div className="flex flex-col items-center gap-2 mb-5">
            <span className="text-6xl animate-bounce leading-none">{buddy!.emoji}</span>
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-3xl px-5 py-2.5 shadow-sm">
              <p className="text-base font-black text-violet-700">{buddyPhrase}</p>
            </div>
          </div>
        )}

        {/* Reward cards */}
        <div className={`flex gap-4 justify-center mb-7 transition-all duration-500 ${rewardsVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          <RewardCard
            emoji="🪙"
            value={`+${coins}`}
            label="Coins"
            bg="bg-yellow-50"
            border="border-yellow-200"
            delay="0s"
            visible={rewardsVisible}
          />
          <RewardCard
            emoji="⭐"
            value={`+${stars}`}
            label={stars === 1 ? 'Star' : 'Stars'}
            bg="bg-violet-50"
            border="border-violet-200"
            delay="0.1s"
            visible={rewardsVisible}
          />
          <RewardCard
            emoji={sticker.emoji}
            value={sticker.label}
            label={badge ? 'Badge' : 'Reward'}
            bg="bg-green-50"
            border="border-green-200"
            delay="0.2s"
            visible={rewardsVisible}
          />
        </div>

        {/* Star rating */}
        <div className="flex justify-center gap-2 mb-7">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="transition-all duration-500"
              style={{
                filter: s <= stars ? 'none' : 'grayscale(1)',
                opacity: s <= stars ? 1 : 0.25,
                transform: s <= stars && rewardsVisible ? 'scale(1.15)' : 'scale(1)',
                transitionDelay: `${0.3 + s * 0.1}s`,
              }}
            >
              <GameEmoji emoji="⭐" size={44} />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div
          className={`space-y-3 transition-all duration-500 ${btnVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {!isAllDone && onNext ? (
            <button
              onClick={onNext}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 py-4 text-white font-black text-lg shadow-xl shadow-violet-200 hover:opacity-90 active:scale-95 transition-all min-h-[56px]"
            >
              Continue to Level {level + 1} →
            </button>
          ) : (
            <button
              onClick={onReplay}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 py-4 text-white font-black text-lg shadow-xl shadow-violet-200 hover:opacity-90 active:scale-95 transition-all min-h-[56px]"
            >
              Play Again 🎮
            </button>
          )}
          <button
            onClick={onReplay}
            className="w-full text-gray-400 font-bold text-sm hover:text-gray-600 py-2 min-h-[44px]"
          >
            {isAllDone ? 'Replay from Level 1' : 'Replay this level'}
          </button>
          <button
            onClick={handleBackToHome}
            className="block w-full text-center text-gray-300 font-semibold text-xs hover:text-violet-500 py-1 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

function RewardCard({
  emoji, value, label, bg, border, delay, visible,
}: {
  emoji: string; value: string; label: string; bg: string; border: string; delay: string; visible: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl border-2 ${bg} ${border} px-5 py-3 min-w-[90px] transition-all duration-500`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.6) rotate(-10deg)',
        transitionDelay: delay,
      }}
    >
      <GameEmoji emoji={emoji} size={40} skeleton />
      <span className="font-black text-gray-800 text-sm leading-none">{value}</span>
      <span className="text-gray-400 text-xs font-semibold mt-0.5">{label}</span>
    </div>
  )
}
