'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Game } from '@/types'
import { getThemeById, type AgeGroupId } from '@/lib/themes'
import MemoryMatch from '@/components/MemoryMatch'
import MazeGame from '@/components/games/MazeGame'
import SlidingPuzzle from '@/components/games/SlidingPuzzle'
import StoryQuest from '@/components/games/StoryQuest'
import QuizGame from '@/components/games/QuizGame'
import WordSearch from '@/components/games/WordSearch'
import PuzzleMaker from '@/components/games/PuzzleMaker'
import PaywallGate from '@/components/PaywallGate'
import NumberMerge from '@/components/games/NumberMerge'
import { recordGameForQuest } from '@/lib/quests'

function GamePreview({ game }: { game: Game }) {
  const content = game.content as Record<string, string>
  const theme = getThemeById(content?.theme ?? 'animals')
  const ageGroup = (content?.ageGroup ?? '4-6') as AgeGroupId
  const childName = content?.childName ?? ''

  switch (game.template_type) {
    case 'memory':
      return (
        <div className={`w-full max-w-sm mx-auto rounded-2xl overflow-hidden ${theme.bg}`}>
          <MemoryMatch theme={theme} ageGroup={ageGroup} childName={childName} onLevelComplete={() => recordGameForQuest('memory')} />
        </div>
      )
    case 'maze':
      return <MazeGame theme={theme} ageGroup={ageGroup} childName={childName} onWin={() => recordGameForQuest('maze')} />
    case 'puzzle':
      return <SlidingPuzzle theme={theme} ageGroup={ageGroup} childName={childName} onWin={() => recordGameForQuest('puzzle')} />
    case 'story':
      return (
        <PaywallGate featureName="Story Quest" featureEmoji="📖">
          <div className="w-full max-w-sm mx-auto">
            <StoryQuest childName={childName} />
          </div>
        </PaywallGate>
      )
    case 'quiz':
      return (
        <PaywallGate featureName="Quiz Game" featureEmoji="❓">
          <div className="w-full max-w-sm mx-auto">
            <QuizGame theme={theme} ageGroup={ageGroup} childName={childName} level={1} />
          </div>
        </PaywallGate>
      )
    case 'word_search':
      return (
        <PaywallGate featureName="Word Search" featureEmoji="🔤">
          <div className="w-full max-w-sm mx-auto">
            <WordSearch theme={theme} ageGroup={ageGroup} childName={childName} level={1} />
          </div>
        </PaywallGate>
      )
    case 'puzzle_maker':
      return (
        <PaywallGate featureName="Puzzle Maker" featureEmoji="🧩">
          <div className="w-full max-w-sm mx-auto">
            <PuzzleMaker childName={childName} ageGroup={ageGroup} />
          </div>
        </PaywallGate>
      )
    case 'number_merge':
      return (
        <PaywallGate featureName="Number Merge (2048)" featureEmoji="2️⃣">
          <div className="w-full max-w-sm mx-auto">
            <NumberMerge childName={childName} onWin={() => recordGameForQuest('number_merge')} />
          </div>
        </PaywallGate>
      )
    default:
      return (
        <div className="text-center text-gray-400 py-12">
          <div className="text-7xl mb-4">{templateEmoji(game.template_type)}</div>
          <p className="font-black text-gray-600 text-lg">{game.title}</p>
          <p className="text-sm mt-2 max-w-xs mx-auto text-gray-400 font-semibold">
            Interactive {game.template_type.replace('_', ' ')} — coming soon
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {theme.cards.slice(0, 6).map((e, i) => (
              <span key={i} className="text-4xl">{e}</span>
            ))}
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 font-bold animate-pulse">Loading game…</p>
    </div>
  )

  if (error && !game) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <Link href="/dashboard" className="text-violet-600 font-bold hover:underline">← Back to dashboard</Link>
      </div>
    </div>
  )

  const content = game?.content as Record<string, string> | undefined
  const theme = getThemeById(content?.theme ?? 'animals')
  const childName = content?.childName ?? ''

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b-2 border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard"
              className="flex items-center gap-1.5 text-gray-500 hover:text-violet-600 font-black text-sm flex-shrink-0 min-h-[44px]">
              ← <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <span className="text-gray-200 hidden sm:inline">|</span>
            <div className={`hidden sm:flex items-center gap-1.5 bg-gradient-to-r ${theme.color} text-white text-xs font-black px-3 py-1 rounded-full flex-shrink-0`}>
              {theme.emoji} {game?.template_type?.replace('_', ' ')}
            </div>
            <span className="font-black text-gray-700 truncate text-sm">{game?.title}</span>
            {childName && (
              <span className="text-xs text-violet-500 font-bold bg-violet-50 rounded-full px-2 py-0.5 flex-shrink-0 hidden sm:inline">
                for {childName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {saved && <span className="text-xs text-green-600 font-bold">✓ Saved</span>}
            {error && <span className="text-xs text-red-500 font-bold hidden sm:inline">{error}</span>}
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              className="md:hidden rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-500 hover:bg-gray-200 font-bold min-h-[44px]"
            >
              ⚙️
            </button>
            <button
              onClick={save}
              disabled={saving || !title.trim()}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-2 text-sm font-black text-white hover:opacity-90 disabled:opacity-50 shadow-sm shadow-violet-200 min-h-[44px]"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className={[
          'bg-white border-gray-100 overflow-y-auto flex-shrink-0 transition-all',
          'w-full md:w-64 border-b-2 md:border-b-0 md:border-r-2',
          settingsOpen ? 'block' : 'hidden md:block',
        ].join(' ')}>
          <div className="p-5">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Game Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setSaved(false) }}
                  maxLength={80}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setSaved(false) }}
                  maxLength={300}
                  rows={3}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 resize-none"
                />
              </div>
              {childName && (
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-1">Personalised for</label>
                  <div className="flex items-center gap-2 bg-violet-50 border-2 border-violet-100 rounded-xl px-3 py-2">
                    <span className="text-lg">🎮</span>
                    <span className="font-black text-violet-700 text-sm">{childName}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-5 border-t-2 border-gray-100 space-y-2">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Export</h2>
              <button
                onClick={() => window.open(`/print/${id}`, '_blank')}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:border-violet-300 flex items-center gap-2 min-h-[48px] transition-colors"
              >
                <span>📄</span> Export / Print as PDF
              </button>
              <button
                onClick={() => alert('Share link coming soon!')}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:border-violet-300 flex items-center gap-2 min-h-[48px] transition-colors"
              >
                <span>🔗</span> Get Share Link
              </button>
            </div>

            <button
              onClick={() => setSettingsOpen(false)}
              className="md:hidden mt-4 w-full rounded-xl bg-gray-100 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 min-h-[44px]"
            >
              ▲ Close settings
            </button>
          </div>
        </aside>

        {/* Game canvas — light themed background */}
        <main
          className="flex-1 overflow-auto flex items-start md:items-center justify-center p-4 md:p-8"
          style={{ background: `linear-gradient(135deg, ${themeBgColor(theme.color)} 0%, #f9fafb 60%)` }}
        >
          <div className="bg-white rounded-3xl shadow-xl border-2 border-white p-5 md:p-8 w-full max-w-xl">
            {game && <GamePreview game={game} />}
          </div>
        </main>
      </div>
    </div>
  )
}

function templateEmoji(type: string) {
  const map: Record<string, string> = { quiz: '❓', word_search: '🔤', coloring: '🎨', puzzle: '🧩', story: '📖', number_merge: '2️⃣' }
  return map[type] ?? '🎮'
}

// Extract a very light version of the theme gradient for the canvas background
function themeBgColor(gradientClass: string): string {
  const map: Record<string, string> = {
    'from-green-400':   '#f0fdf4',
    'from-lime-400':    '#f7fee7',
    'from-pink-400':    '#fdf2f8',
    'from-blue-400':    '#eff6ff',
    'from-indigo-500':  '#eef2ff',
    'from-yellow-400':  '#fefce8',
    'from-yellow-300':  '#fefce8',
    'from-red-400':     '#fff1f2',
    'from-rose-400':    '#fff1f2',
    'from-teal-400':    '#f0fdfa',
  }
  const key = gradientClass.split(' ')[0]
  return map[key] ?? '#f5f3ff'
}
