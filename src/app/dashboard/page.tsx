'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Game } from '@/types'
import { getProgress, type Progress, type Badge } from '@/lib/progress'
import GameEmoji from '@/components/GameEmoji'

export default function DashboardPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)

  useEffect(() => {
    setProgress(getProgress())
    fetch('/api/games')
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setGames(result.data)
        else setError(result.error || 'Failed to load games')
      })
      .catch(() => setError('An error occurred while fetching games'))
      .finally(() => setLoading(false))
  }, [])

  const earnedBadges = progress?.badges.filter((b) => b.earned) ?? []
  const unearnedBadges = progress?.badges.filter((b) => !b.earned) ?? []

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-gray-500">Loading…</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* ── Progress snapshot ── */}
      {progress && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard emoji="⭐" label="Stars" value={progress.totalStars} color="bg-yellow-50 border-yellow-200" />
          <StatCard emoji="🪙" label="Coins" value={progress.totalCoins} color="bg-amber-50 border-amber-200" />
          <StatCard emoji="🔥" label="Day streak" value={progress.streak} color="bg-orange-50 border-orange-200" />
          <StatCard emoji="🏅" label="Badges" value={earnedBadges.length} color="bg-violet-50 border-violet-200" />
        </div>
      )}

      {/* ── Child name + quick stats ── */}
      {progress?.childName && (
        <div className="bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 rounded-2xl p-5 flex items-center gap-4">
          <span className="text-4xl">🎮</span>
          <div>
            <p className="font-bold text-gray-800 text-lg">{progress.childName}&apos;s Adventure</p>
            <p className="text-sm text-gray-500">
              {progress.totalStars} stars earned · {earnedBadges.length} badges unlocked
              {progress.streak >= 2 ? ` · 🔥 ${progress.streak}-day streak!` : ''}
            </p>
          </div>
        </div>
      )}

      {/* ── Badges ── */}
      {progress && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned />
            ))}
            {unearnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned={false} />
            ))}
          </div>
        </section>
      )}

      {/* ── My Games ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">My Games</h2>
          <Link
            href="/builder"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-semibold text-sm"
          >
            + Create New Game
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 text-sm">{error}</div>
        )}

        {games.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-16 text-center">
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-lg font-semibold text-gray-700 mb-2">No games yet</p>
            <p className="text-gray-500 mb-6">Create your first personalised kid&apos;s game in minutes</p>
            <Link
              href="/builder"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 font-semibold"
            >
              Create Your First Game
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ emoji, label, value, color }: { emoji: string; label: string; value: number; color: string }) {
  return (
    <div className={`rounded-2xl border p-4 text-center ${color}`}>
      <div className="text-3xl mb-1">{emoji}</div>
      <div className="text-2xl font-extrabold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
    </div>
  )
}

function BadgeCard({ badge, earned }: { badge: Badge; earned: boolean }) {
  return (
    <div
      title={badge.desc}
      className={`rounded-2xl border p-3 text-center transition-all ${
        earned
          ? 'bg-white border-violet-200 shadow-sm'
          : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
      }`}
    >
      <GameEmoji emoji={badge.emoji} size={48} skeleton />
      <p className="text-xs font-bold text-gray-700 leading-tight">{badge.name}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-tight hidden sm:block">{badge.desc}</p>
      {earned && badge.earnedAt && (
        <p className="text-xs text-violet-500 mt-1">
          {new Date(badge.earnedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

function GameCard({ game }: { game: Game }) {
  const content = game.content as Record<string, string>
  return (
    <Link
      href={`/builder/${game.id}`}
      className="group rounded-2xl border border-gray-200 bg-white p-4 hover:border-violet-300 hover:shadow-lg transition-all"
    >
      <div className="mb-3 bg-gray-100 aspect-video rounded-xl flex items-center justify-center overflow-hidden">
        {game.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={game.thumbnail_url} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">{templateEmoji(game.template_type)}</span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 leading-tight">
        {game.title}
      </h3>
      {content?.childName && (
        <p className="text-xs text-violet-500 mt-0.5 font-medium">for {content.childName}</p>
      )}
      <p className="text-sm text-gray-400 mt-1 capitalize">{game.template_type.replace('_', ' ')}</p>
      <p className="text-xs text-gray-300 mt-1.5">
        {new Date(game.created_at).toLocaleDateString()}
      </p>
    </Link>
  )
}

function templateEmoji(type: string) {
  const map: Record<string, string> = {
    memory: '🃏', quiz: '❓', word_search: '🔤', coloring: '🎨', maze: '🌀', puzzle: '🧩', story: '📖',
  }
  return map[type] ?? '🎮'
}
