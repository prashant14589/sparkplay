'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Game } from '@/types'
import { getProgress, type Progress, type Badge } from '@/lib/progress'
import { THEMES, type Theme } from '@/lib/themes'
import { getDailyQuest, getQuestProgress, isQuestComplete } from '@/lib/quests'
import GameEmoji from '@/components/GameEmoji'

// Themes that have hero illustrations ready
const ILLUSTRATED_THEMES = new Set(['animals', 'dinos', 'unicorns', 'ocean'])

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

  return (
    <div className="space-y-6">

      {/* ── Personalised hero ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 p-5 text-white shadow-xl shadow-violet-200">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-bold mb-0.5">Welcome back!</p>
            <h1 className="text-2xl font-black leading-tight">
              {childName ? `Hi ${childName}! 👋` : 'Hi there! 👋'}
            </h1>
            <p className="text-white/80 text-sm font-semibold mt-1">
              🦕 Rexy is ready to play!
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-3 bg-white/20 rounded-2xl px-4 py-2.5">
              <div className="text-center">
                <div className="text-xl font-black">{progress?.totalCoins ?? 0}</div>
                <div className="text-[10px] text-white/70 font-bold">🪙 Coins</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-xl font-black">{progress?.totalStars ?? 0}</div>
                <div className="text-[10px] text-white/70 font-bold">⭐ Stars</div>
              </div>
              {(progress?.streak ?? 0) >= 2 && (
                <>
                  <div className="w-px h-8 bg-white/30" />
                  <div className="text-center">
                    <div className="text-xl font-black">{progress!.streak}</div>
                    <div className="text-[10px] text-white/70 font-bold">🔥 Streak</div>
                  </div>
                </>
              )}
            </div>
          </div>
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
  const gameType = GAME_TYPES[THEMES.indexOf(theme) % GAME_TYPES.length]

  return (
    <Link
      href={`/?theme=${theme.id}`}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 min-h-[120px] flex flex-col justify-end"
    >
      {/* Background: hero image or gradient */}
      {hasHero ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/illustrations/${theme.id}/hero.png`}
            alt={theme.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.color}`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <span className="text-7xl">{theme.emoji}</span>
          </div>
        </div>
      )}

      {/* Label */}
      <div className="relative p-3">
        <p className="font-black text-white text-sm leading-tight drop-shadow">{theme.name}</p>
        <p className="text-white/70 text-[10px] font-bold">Memory Match</p>
      </div>
    </Link>
  )
}

// ── Saved game card ───────────────────────────────────────────────────────────

function SavedGameCard({ game }: { game: Game }) {
  const content = game.content as Record<string, string>
  const theme = THEMES.find(t => t.id === content?.theme)
  return (
    <Link
      href={`/builder/${game.id}`}
      className="group rounded-2xl border border-gray-100 bg-white p-3 hover:border-violet-300 hover:shadow-lg transition-all"
    >
      <div className={`mb-2 aspect-video rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br ${theme?.color ?? 'from-gray-200 to-gray-300'}`}>
        {game.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={game.thumbnail_url} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">{theme?.emoji ?? '🎮'}</span>
        )}
      </div>
      <p className="font-bold text-gray-900 text-sm group-hover:text-violet-600 leading-tight truncate">{game.title}</p>
      {content?.childName && <p className="text-[10px] text-violet-500 font-bold mt-0.5">for {content.childName}</p>}
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
