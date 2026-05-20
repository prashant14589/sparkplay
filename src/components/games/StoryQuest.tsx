'use client'

import { useState, useEffect } from 'react'
import { useCreationSteps } from '@/lib/creationSteps'
import { STORIES, getStoryById, interpolate, type Story, type StoryScene } from '@/lib/stories'
import { recordCompletion, type Badge } from '@/lib/progress'
import { recordGameForQuest } from '@/lib/quests'
import LevelComplete from '@/components/LevelComplete'
import DiceBearAvatar from '@/components/DiceBearAvatar'
import GameEmoji from '@/components/GameEmoji'
import type { Badge as BadgeType } from '@/lib/progress'

// Generated story shape (mirrors what the API returns)
type GenScene = {
  id: string
  emoji: string
  title: string
  text: string
  choices?: { label: string; next: string }[]
  isEnd?: boolean
}
type GenStory = {
  title: string
  emoji: string
  scenes: Record<string, GenScene>
  startId: string
}

// Theme visual config
const THEME_CONFIG: Record<string, { gradient: string; bg: string; pill: string }> = {
  animals:     { gradient: 'from-emerald-500 to-green-600',    bg: 'bg-emerald-50',  pill: 'bg-emerald-100 text-emerald-800' },
  dinos:       { gradient: 'from-lime-500 to-green-700',       bg: 'bg-lime-50',     pill: 'bg-lime-100 text-lime-800' },
  unicorns:    { gradient: 'from-pink-500 to-fuchsia-600',     bg: 'bg-pink-50',     pill: 'bg-pink-100 text-pink-800' },
  ocean:       { gradient: 'from-blue-500 to-cyan-600',        bg: 'bg-cyan-50',     pill: 'bg-cyan-100 text-cyan-800' },
  space:       { gradient: 'from-indigo-600 to-violet-700',    bg: 'bg-indigo-50',   pill: 'bg-indigo-100 text-indigo-800' },
  superheroes: { gradient: 'from-yellow-400 to-orange-600',    bg: 'bg-yellow-50',   pill: 'bg-yellow-100 text-yellow-800' },
  farm:        { gradient: 'from-amber-400 to-yellow-600',     bg: 'bg-amber-50',    pill: 'bg-amber-100 text-amber-800' },
  food:        { gradient: 'from-red-400 to-orange-500',       bg: 'bg-red-50',      pill: 'bg-red-100 text-red-800' },
}

const DEFAULT_THEME = THEME_CONFIG.animals

interface Props {
  storyId?: string
  childName?: string
  theme?: string
  ageGroup?: string
  onComplete?: () => void
}

type GameState = 'picker' | 'loading' | 'playing' | 'complete' | 'error'

export default function StoryQuest({ storyId, childName, theme = 'animals', ageGroup = '4-6', onComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>(storyId ? 'loading' : 'picker')
  const [selectedTheme, setSelectedTheme] = useState(storyId ? theme : '')
  const [genStory, setGenStory] = useState<GenStory | null>(null)
  const [sceneId, setSceneId] = useState('start')
  const [history, setHistory] = useState<string[]>([])
  const [choicesMade, setChoicesMade] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState<{ stars: number; coins: number; newBadges: BadgeType[]; streak: number } | null>(null)

  const themeConfig = THEME_CONFIG[selectedTheme] ?? DEFAULT_THEME
  const displayName = childName?.trim() || ''
  const creation = useCreationSteps('story', displayName || undefined)

  // Auto-fetch when storyId + theme are known (builder preview mode)
  useEffect(() => {
    if (storyId && theme) {
      fetchStory(theme)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchStory(chosenTheme: string) {
    setSelectedTheme(chosenTheme)
    setGameState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: displayName || 'the explorer',
          theme:     chosenTheme,
          ageGroup,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Story generation failed')
      setGenStory(data.data)
      setSceneId(data.data.startId ?? 'start')
      setHistory([data.data.startId ?? 'start'])
      setChoicesMade(0)
      setGameState('playing')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Could not generate story')
      setGameState('error')
    }
  }

  function makeChoice(nextId: string) {
    if (!genStory) return
    const nextScene = genStory.scenes[nextId]

    // Guard: AI can return a next-ID that doesn't exist in the story tree.
    // Rather than a blank screen, fall back to the start scene.
    if (!nextScene) {
      console.warn(`StoryQuest: scene "${nextId}" not found — restarting from start`)
      setSceneId(genStory.startId ?? 'start')
      return
    }

    setSceneId(nextId)
    setHistory((h) => [...h, nextId])
    const newChoices = choicesMade + 1
    setChoicesMade(newChoices)

    if (nextScene.isEnd) {
      const r = recordCompletion('story', selectedTheme, ageGroup, 1, newChoices, 4)
      setResult({ stars: r.stars, coins: r.coinsEarned, newBadges: r.newBadges, streak: r.streak })
      setGameState('complete')
      recordGameForQuest('story')
    }
  }

  function replay() {
    fetchStory(selectedTheme)
  }

  function backToPicker() {
    setGameState('picker')
    setGenStory(null)
    setSelectedTheme('')
    setResult(null)
  }

  // ── Theme picker ─────────────────────────────────────────────────────────
  if (gameState === 'picker') {
    return (
      <div className="select-none space-y-4">
        <div className="text-center">
          <p className="font-black text-gray-700 text-base">
            {displayName ? `Choose ${displayName}'s story! 📖` : 'Choose your adventure! 📖'}
          </p>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            AI will write a unique story just for {displayName || 'you'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(THEME_CONFIG).map(([id, cfg]) => {
            const themeEmoji: Record<string, string> = {
              animals: '🐾', dinos: '🦕', unicorns: '🦄', ocean: '🐠',
              space: '🚀', superheroes: '⚡', farm: '🐄', food: '🍕',
            }
            const themeName: Record<string, string> = {
              animals: 'Animals', dinos: 'Dinosaurs', unicorns: 'Unicorns', ocean: 'Ocean',
              space: 'Space', superheroes: 'Superheroes', farm: 'Farm', food: 'Yummy Food',
            }
            return (
              <button
                key={id}
                onClick={() => fetchStory(id)}
                className={`bg-gradient-to-br ${cfg.gradient} rounded-2xl p-4 text-white shadow-lg hover:scale-105 active:scale-95 transition-all min-h-[80px] flex flex-col items-center justify-center gap-1`}
              >
                <span className="text-3xl">{themeEmoji[id]}</span>
                <span className="font-black text-sm">{themeName[id]}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (gameState === 'loading') {
    return (
      <div className={`select-none rounded-3xl bg-gradient-to-br ${themeConfig.gradient} p-6 text-center text-white min-h-[320px] flex flex-col items-center justify-center gap-5`}>
        <div className="relative">
          {displayName ? (
            <DiceBearAvatar seed={displayName} size={96} animated className="ring-4 ring-white/40" />
          ) : (
            <span className="text-7xl animate-bounce">🦕</span>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center animate-spin">
            <span className="text-white text-sm">✦</span>
          </div>
        </div>

        <div className="space-y-1">
          <p
            key={creation.stepIndex}
            className="font-black text-xl animate-slide-up"
          >
            {creation.text}
          </p>
          <p className="text-white/60 text-sm font-semibold">
            A unique adventure, just for {displayName || 'you'}
          </p>
        </div>

        {/* Step progress track */}
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: creation.total }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === creation.stepIndex
                  ? 'w-5 h-2.5 bg-white'
                  : i < creation.stepIndex
                    ? 'w-2.5 h-2.5 bg-white/50'
                    : 'w-2.5 h-2.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (gameState === 'error') {
    return (
      <div className="select-none rounded-3xl bg-red-50 border-2 border-red-100 p-6 text-center space-y-4">
        <span className="text-5xl">😢</span>
        <p className="font-black text-red-700">Couldn't write the story</p>
        <p className="text-sm text-red-500 font-semibold">{errorMsg}</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => fetchStory(selectedTheme || 'animals')}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm text-white font-black hover:bg-violet-700 min-h-[44px]"
          >
            Try again
          </button>
          <button
            onClick={backToPicker}
            className="rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm text-gray-600 font-bold hover:bg-gray-50 min-h-[44px]"
          >
            Choose theme
          </button>
        </div>
      </div>
    )
  }

  // ── Level complete ─────────────────────────────────────────────────────────
  if (gameState === 'complete' && result && genStory) {
    const endScene = genStory.scenes[sceneId]
    return (
      <div className="select-none space-y-4">
        {/* Final scene */}
        <div className={`rounded-3xl bg-gradient-to-br ${themeConfig.gradient} p-1 shadow-xl`}>
          <div className={`${themeConfig.bg} rounded-[20px] p-5`}>
            {displayName && (
              <div className="flex justify-center mb-3">
                <DiceBearAvatar seed={displayName} size={72} className="ring-4 ring-white shadow-lg" />
              </div>
            )}
            <div className="text-center mb-3">
              <span className="text-5xl block mb-2">{endScene?.emoji ?? '🏆'}</span>
              <h3 className="font-black text-gray-800 text-lg">{endScene?.title}</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed text-center">{endScene?.text}</p>
          </div>
        </div>

        <LevelComplete
          level={1} totalLevels={1}
          stars={result.stars} coins={result.coins}
          moves={choicesMade}
          childName={childName}
          newBadges={result.newBadges}
          streak={result.streak}
          themeEmoji={genStory.emoji}
          onReplay={replay}
        />

        <div className="flex gap-2">
          <button
            onClick={backToPicker}
            className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-sm text-gray-600 font-bold hover:bg-gray-50 min-h-[44px]"
          >
            ← New story
          </button>
          {onComplete && (
            <button
              onClick={onComplete}
              className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm text-white font-black hover:bg-violet-700 min-h-[44px]"
            >
              Done 🎉
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Active story scene ─────────────────────────────────────────────────────
  if (!genStory) return null
  const scene = genStory.scenes[sceneId]
  if (!scene) return null

  const totalScenes = 3 // start + c1x + end
  const progressPct = Math.min(100, Math.round((history.length / totalScenes) * 100))

  return (
    <div className="select-none space-y-4">

      {/* Header: progress + exit */}
      <div className="flex items-center gap-3">
        {displayName && (
          <DiceBearAvatar seed={displayName} size={36} className="flex-shrink-0 ring-2 ring-violet-300" />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-black ${THEME_CONFIG[selectedTheme]?.pill ?? ''} rounded-full px-2 py-0.5`}>
              {genStory.title}
            </span>
            <button onClick={backToPicker} className="text-gray-300 hover:text-gray-500 font-bold text-xs">
              ✕
            </button>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${themeConfig.gradient} rounded-full transition-all duration-700`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scene card */}
      <div className={`rounded-3xl bg-gradient-to-br ${themeConfig.gradient} p-1 shadow-xl`}>
        <div className={`${themeConfig.bg} rounded-[20px] overflow-hidden`}>
          {/* Scene header */}
          <div className={`bg-gradient-to-r ${themeConfig.gradient} px-5 py-4 text-center`}>
            <div className="flex justify-center mb-2">
              <GameEmoji emoji={scene.emoji} size={72} className="drop-shadow-xl" skeleton />
            </div>
            <h3 className="font-black text-white text-lg leading-tight">{scene.title}</h3>
          </div>

          {/* Story text */}
          <div className="px-5 py-4">
            <p className="text-gray-700 leading-relaxed text-sm font-semibold">
              {scene.text}
            </p>
          </div>
        </div>
      </div>

      {/* Choice buttons */}
      {scene.choices && scene.choices.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-widest">
            What will {displayName || 'you'} do?
          </p>
          {scene.choices.map((choice, i) => (
            <button
              key={choice.next}
              onClick={() => makeChoice(choice.next)}
              className={`w-full text-left rounded-2xl bg-gradient-to-r ${themeConfig.gradient} text-white font-black px-5 py-4 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all min-h-[56px] flex items-center gap-3`}
            >
              <span className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-black flex-shrink-0`}>
                {i === 0 ? 'A' : 'B'}
              </span>
              <span className="text-sm leading-snug">{choice.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
