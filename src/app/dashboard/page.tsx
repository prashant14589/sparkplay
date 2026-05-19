'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Game } from '@/types'
import { getProgress, type Progress, type Badge } from '@/lib/progress'
import { THEMES, type Theme } from '@/lib/themes'
import { getDailyQuest, getQuestProgress, isQuestComplete } from '@/lib/quests'
import { calcXP, calcLevel, xpToNextLevel } from '@/lib/buddy'
import GameEmoji from '@/components/GameEmoji'
import BuddyWidget from '@/components/BuddyWidget'

// Themes that have hero illustrations ready
const ILLUSTRATED_THEMES = new Set(['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'food'])

export default function DashboardPage() {
  const [games, setGames] = useState<Game[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [questProgress, setQuestProgress] = useState(0)
  const [questDone, setQuestDone] = useState(false)

  useEffect(() => {
    const p = getProgress()
    setProgress(p)
    setQuestProgress(getQuestProgress())
    setQuestDone(isQuestComplete())
    fetch('/api/games')
      .then(r => r.json())
      .then(result => { if (result.success) setGames(result.data) })
  }, [])

  const quest = getDailyQuest()
  const childName = progress?.childName || null
  const earnedBadges = progress?.badges.filter(b => b.earned) ?? []
  const xp = calcXP(progress?.totalStars ?? 0, progress?.totalCoins ?? 0)
  const level = calcLevel(xp)
  const xpBar = xpToNextLevel(xp)

  return (
    <div className="space-y-6">

      {/* ── Personalised hero ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 p-5 text-white shadow-xl shadow-violet-200">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative space-y-4">
          {/* Top row: greeting + stats */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-white/70 text-sm font-bold mb-0.5">Welcome back!</p>
              <h1 className="text-2xl font-black leading-tight">
                {childName ? `Hi ${childName}! 👋` : 'Hi there! 👋'}
              </h1>
              <p className="text-white/60 text-xs font-semibold mt-0.5">
                Explorer · Level {level}
              </p>
            </div>
            <div className="flex items-center gap-2.5 bg-white/20 rounded-2xl px-3 py-2 shrink-0">
              <div className="text-center">
                <div className="text-base font-black">{progress?.totalCoins ?? 0}</div>
                <div className="text-[9px] text-white/70 font-bold">🪙</div>
              </div>
              <div className="w-px h-6 bg-white/30" />
              <div className="text-center">
                <div className="text-base font-black">{progress?.totalStars ?? 0}</div>
                <div className="text-[9px] text-white/70 font-bold">⭐</div>
              </div>
              {(progress?.streak ?? 0) >= 2 && (
                <>
                  <div className="w-px h-6 bg-white/30" />
                  <div className="text-center">
                    <div className="text-base font-black">{progress!.streak}</div>
                    <div className="text-[9px] text-white/70 font-bold">🔥</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* XP bar */}
          <div>
            <div className="flex justify-between text-[10px] text-white/60 font-bold mb-1">
              <span>{xpBar.current} XP</span>
              <span>{xpBar.needed} XP to Lv.{Math.min(10, level + 1)}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/70 rounded-full transition-all duration-700"
                style={{ width: `${xpBar.pct}%` }} />
            </div>
          </div>

          {/* Buddy row */}
          <BuddyWidget size="sm" showSelector />
        </div>
      </div>

      {/* ── Today's Quest ── */}
      <div className={`rounded-2xl border-2 p-4 ${questDone ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{quest.emoji}</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                {questDone ? '✅ Quest Complete!' : "Today's Quest"}
              </p>
              <p className="font-black text-gray-800 text-sm leading-tight">{quest.title}</p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-700 bg-amber-100 rounded-full px-2.5 py-1">
            {questProgress}/{quest.target}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-2.5">{quest.description}</p>
        {/* Progress bar */}
        <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${questDone ? 'bg-green-500' : 'bg-amber-400'}`}
            style={{ width: `${Math.min(100, (questProgress / quest.target) * 100)}%` }}
          />
        </div>
      </div>

      {/* ── Pick your adventure ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-gray-900">Pick your adventure</h2>
          <Link href="/builder" className="text-xs font-black text-violet-600 hover:underline">+ Create →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEMES.map(theme => (
            <AdventureCard key={theme.id} theme={theme} />
          ))}
        </div>
      </section>

      {/* ── My saved games ── */}
      {games.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">My Games</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {games.map(game => (
              <SavedGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* ── Badges ── */}
      {earnedBadges.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">
            Badges <span className="text-gray-400 font-semibold text-sm ml-1">{earnedBadges.length} earned</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map(badge => (
              <BadgeChip key={badge.id} badge={badge} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ── Adventure card with hero illustration ────────────────────────────────────

const THEME_GAME_LABEL: Record<string, string> = {
  memory: 'Memory Match', quiz: 'Quiz', word_search: 'Word Search',
  puzzle: 'Sliding Puzzle', maze: 'Maze', story: 'Story Quest', puzzle_maker: 'Puzzle Maker',
}

const GAME_TYPES = ['memory', 'quiz', 'word_search', 'puzzle', 'maze', 'story']

function AdventureCard({ theme }: { theme: Theme }) {
  const hasHero = ILLUSTRATED_THEMES.has(theme.id)

  return (
    <Link
      href={`/?theme=${theme.id}`}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 min-h-[120px] flex flex-col justify-end"
    >
      {hasHero ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/illustrations/${theme.id}/hero.png`}
            alt={theme.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        </>
      ) : (
        /* No illustration yet — rich gradient + large emoji bottom-right */
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.color}`}>
          <span className="absolute bottom-3 right-3 text-7xl drop-shadow-lg leading-none select-none">
            {theme.emoji}
          </span>
        </div>
      )}

      <div className="relative p-3">
        <p className="font-black text-white text-sm leading-tight drop-shadow-sm">{theme.name}</p>
        <p className="text-white/70 text-[10px] font-bold">Memory Match</p>
      </div>
    </Link>
  )
}

// ── Saved game card ───────────────────────────────────────────────────────────

function SavedGameCard({ game }: { game: Game }) {
  const content = game.content as Record<string, string>
  const themeId = content?.theme
  const theme = THEMES.find(t => t.id === themeId)
  const hasHero = theme && ILLUSTRATED_THEMES.has(theme.id)
  const gameLabel = game.template_type.replace('_', ' ')

  return (
    <Link
      href={`/builder/${game.id}`}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 min-h-[130px] flex flex-col justify-end"
    >
      {/* Background */}
      {game.thumbnail_url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={game.thumbnail_url} alt={game.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </>
      ) : hasHero ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/illustrations/${theme!.id}/hero.png`}
            alt={theme!.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${theme?.color ?? 'from-gray-400 to-gray-600'}`}>
          <span className="absolute bottom-3 right-3 text-6xl drop-shadow-lg leading-none select-none opacity-80">
            {theme?.emoji ?? '🎮'}
          </span>
        </div>
      )}

      {/* Game type badge + title */}
      <div className="relative p-3">
        <span className="inline-block text-[9px] font-black text-white/80 bg-white/25 rounded-full px-2 py-0.5 capitalize mb-1.5">
          {gameLabel}
        </span>
        <p className="font-black text-white text-sm leading-tight line-clamp-2 drop-shadow-sm">{game.title}</p>
        {content?.childName && (
          <p className="text-white/70 text-[10px] font-bold mt-0.5">for {content.childName}</p>
        )}
      </div>
    </Link>
  )
}

// ── Badge chip ────────────────────────────────────────────────────────────────

function BadgeChip({ badge }: { badge: Badge }) {
  return (
    <div
      title={badge.desc}
      className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-full px-3 py-1.5"
    >
      <GameEmoji emoji={badge.emoji} size={18} />
      <span className="text-xs font-bold text-violet-700">{badge.name}</span>
    </div>
  )
}
