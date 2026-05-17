'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Game } from '@/types'

export default function DashboardPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/games')
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setGames(result.data)
        else setError(result.error || 'Failed to load games')
      })
      .catch(() => setError('An error occurred while fetching games'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-gray-500">Loading your games...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Games</h2>
        <Link
          href="/builder"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-semibold"
        >
          + Create New Game
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {games.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-lg font-semibold text-gray-700 mb-2">No games yet</p>
          <p className="text-gray-500 mb-6">Create your first kid&apos;s game in minutes</p>
          <Link
            href="/builder"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 font-semibold"
          >
            Create Your First Game
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/builder/${game.id}`}
              className="group rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="mb-4 bg-gray-100 aspect-video rounded-lg flex items-center justify-center overflow-hidden">
                {game.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={game.thumbnail_url}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">{templateEmoji(game.template_type)}</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                {game.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{game.template_type}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(game.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function templateEmoji(type: string) {
  const map: Record<string, string> = {
    memory: '🃏',
    quiz: '❓',
    word_search: '🔤',
    coloring: '🎨',
    maze: '🌀',
    puzzle: '🧩',
  }
  return map[type] ?? '🎮'
}
