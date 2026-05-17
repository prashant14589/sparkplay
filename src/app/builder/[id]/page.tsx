'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Game } from '@/types'
import { getThemeById } from '@/lib/themes'
import MemoryMatch from '@/components/MemoryMatch'
import MazeGame from '@/components/games/MazeGame'
import SlidingPuzzle from '@/components/games/SlidingPuzzle'

function GamePreview({ game }: { game: Game }) {
  const content = game.content as Record<string, string>
  const theme = getThemeById(content?.theme ?? 'animals')
  const ageGroup = content?.ageGroup ?? '4-6'
  const childName = content?.childName ?? ''

  switch (game.template_type) {
    case 'memory':
      return <div className="w-full max-w-sm mx-auto"><MemoryMatch theme={theme} onLevelComplete={() => {}} /></div>
    case 'maze':
      return <MazeGame theme={theme} ageGroup={ageGroup} childName={childName} />
    case 'puzzle':
      return <SlidingPuzzle theme={theme} ageGroup={ageGroup} childName={childName} />
    default:
      return (
        <div className="text-center text-gray-400 py-8">
          <div className="text-6xl mb-4">{templateEmoji(game.template_type)}</div>
          <p className="font-semibold text-gray-600 text-lg">{game.title}</p>
          <p className="text-sm mt-2 max-w-xs mx-auto">
            Interactive {game.template_type.replace('_', ' ')} — coming soon
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {theme.cards.slice(0, 6).map((e, i) => <span key={i} className="text-3xl">{e}</span>)}
          </div>
        </div>
      )
  }
}

export default function EditGamePage() {
  const { id } = useParams<{ id: string }>()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/games/${id}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.success) {
          setGame(result.data)
          setTitle(result.data.title)
          setDescription(result.data.description ?? '')
        } else setError(result.error || 'Game not found')
      })
      .catch(() => setError('Failed to load game'))
      .finally(() => setLoading(false))
  }, [id])

  async function save() {
    if (!title.trim()) return
    setSaving(true); setError(null); setSaved(false)
    try {
      const res = await fetch(`/api/games/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || null }),
      })
      const result = await res.json()
      if (!result.success) throw new Error(result.error)
      setGame(result.data); setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally { setSaving(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Loading game…</p>
    </div>
  )

  if (error && !game) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Link href="/dashboard" className="text-blue-400 hover:underline">← Back to dashboard</Link>
      </div>
    </div>
  )

  const content = game?.content as Record<string, string> | undefined
  const theme = getThemeById(content?.theme ?? 'animals')

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm flex-shrink-0">
            ← <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <span className="font-semibold truncate text-sm">{game?.title}</span>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded capitalize flex-shrink-0 hidden sm:inline">
            {theme.emoji} {game?.template_type?.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {saved && <span className="text-xs text-green-400">Saved!</span>}
          {error && <span className="text-xs text-red-400 hidden sm:inline">{error}</span>}
          {/* Mobile: settings toggle */}
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            className="md:hidden rounded-lg bg-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-600"
          >
            ⚙️
          </button>
          <button
            onClick={save}
            disabled={saving || !title.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — hidden on mobile unless toggled */}
        <aside className={[
          'bg-gray-800 border-gray-700 overflow-y-auto flex-shrink-0 transition-all',
          // Mobile: full-width collapsible panel above game
          'w-full md:w-64 border-b md:border-b-0 md:border-r',
          settingsOpen ? 'block' : 'hidden md:block',
        ].join(' ')}>
          <div className="p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Game Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setSaved(false) }}
                  maxLength={80}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setSaved(false) }}
                  maxLength={300}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700 space-y-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Export</h2>
              <button className="w-full rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700" onClick={() => alert('PDF export coming soon!')}>
                📄 Export as PDF
              </button>
              <button className="w-full rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700" onClick={() => alert('Share link coming soon!')}>
                🔗 Get Share Link
              </button>
            </div>

            {/* Mobile: close settings */}
            <button
              onClick={() => setSettingsOpen(false)}
              className="md:hidden mt-4 w-full rounded-lg bg-gray-700 py-2 text-sm text-gray-300 hover:bg-gray-600"
            >
              ▲ Close settings
            </button>
          </div>
        </aside>

        {/* Game canvas */}
        <main className="flex-1 overflow-auto bg-gray-950 flex items-start md:items-center justify-center p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 w-full max-w-xl">
            {game && <GamePreview game={game} />}
          </div>
        </main>
      </div>
    </div>
  )
}

function templateEmoji(type: string) {
  const map: Record<string, string> = { quiz: '❓', word_search: '🔤', coloring: '🎨', puzzle: '🧩' }
  return map[type] ?? '🎮'
}
