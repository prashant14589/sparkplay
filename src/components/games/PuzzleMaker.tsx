'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useCreationSteps } from '@/lib/creationSteps'
import { recordGameForQuest } from '@/lib/quests'
import {
  getScenariosForAge,
  DEFAULT_DIFFICULTY_FOR_AGE,
  DIFFICULTY_GRID,
  createPieces,
  shufflePieces,
  isPieceCorrect,
  getCacheKey,
  type PuzzleScenario,
  type PuzzlePiece,
  type DifficultyLevel,
} from '@/lib/puzzleGame'
import { recordCompletion, type Badge } from '@/lib/progress'
import LevelComplete from '@/components/LevelComplete'
import DiceBearAvatar from '@/components/DiceBearAvatar'

// Puzzle image dimensions — matches the 1536×1024 image from the API
const IMG_W = 1536
const IMG_H = 1024

interface Props {
  childName?: string
  ageGroup?: string
  gameId?: string                            // if set, saves completed image to Supabase
  existingContent?: Record<string, unknown>  // merged into content on save
  onComplete?: () => void
}

type GameState = 'picker' | 'generating' | 'playing' | 'complete' | 'error'

interface BoardPiece extends PuzzlePiece {
  placed: boolean   // true once correctly snapped to its slot
}

export default function PuzzleMaker({ childName, ageGroup = '4-6', gameId, existingContent, onComplete }: Props) {
  const scenarios = getScenariosForAge(ageGroup)
  const defaultDifficulty = DEFAULT_DIFFICULTY_FOR_AGE[ageGroup] ?? '6'

  const [gameState, setGameState]       = useState<GameState>('picker')
  const [selectedScenario, setSelectedScenario] = useState<PuzzleScenario | null>(null)
  const [difficulty, setDifficulty]     = useState<DifficultyLevel>(defaultDifficulty)
  const [imageUrl, setImageUrl]         = useState<string | null>(null)
  const [pieces, setPieces]             = useState<BoardPiece[]>([])
  const [dragId, setDragId]             = useState<number | null>(null)
  const [activeTray, setActiveTray]     = useState<number | null>(null) // for tap-select on mobile
  const [moves, setMoves]               = useState(0)
  const [errorMsg, setErrorMsg]         = useState('')
  const [result, setResult]             = useState<{ stars: number; coins: number; newBadges: Badge[]; streak: number } | null>(null)
  const [genKey, setGenKey]             = useState(0)
  const boardRef = useRef<HTMLDivElement>(null)

  // Save completed puzzle image to Supabase so the print page can show it
  useEffect(() => {
    if (gameState !== 'complete' || !gameId || !imageUrl || !selectedScenario) return
    fetch(`/api/games/${gameId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: {
          ...(existingContent ?? {}),
          puzzleImageUrl:      imageUrl,
          puzzleScenario:      selectedScenario.label,
          puzzleDifficulty:    difficulty,
        },
      }),
    }).catch(() => {/* non-critical — print page falls back gracefully */})
  }, [gameState]) // eslint-disable-line react-hooks/exhaustive-deps

  const displayName = childName?.trim() || ''
  const creation = useCreationSteps('puzzle', displayName || undefined, genKey)
  const { cols, rows } = DIFFICULTY_GRID[difficulty]
  const totalPieces = cols * rows

  // ── Generate puzzle ────────────────────────────────────────────────────────

  async function generatePuzzle(scenario: PuzzleScenario) {
    setSelectedScenario(scenario)
    setGameState('generating')
    setErrorMsg('')
    setGenKey((k) => k + 1)

    // Check localStorage cache first
    const cacheKey = getCacheKey(displayName || 'explorer', scenario.id)
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null
    if (cached) {
      startGame(cached, scenario)
      return
    }

    try {
      const res = await fetch('/api/puzzle/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: displayName || 'a child',
          scenarioLabel: scenario.label,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Generation failed')

      // Cache in localStorage for instant replays
      try { localStorage.setItem(cacheKey, data.imageDataUrl) } catch { /* ignore quota */ }

      startGame(data.imageDataUrl, scenario)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Could not generate puzzle')
      setGameState('error')
    }
  }

  function startGame(url: string, scenario: PuzzleScenario) {
    setImageUrl(url)
    const rawPieces = createPieces(cols, rows, IMG_W, IMG_H)
    const shuffled = shufflePieces(rawPieces).map(p => ({ ...p, placed: false }))
    setPieces(shuffled)
    setMoves(0)
    setResult(null)
    setGameState('playing')
    setSelectedScenario(scenario)
    setActiveTray(null)
    setDragId(null)
  }

  function resetToScenarioPicker() {
    setGameState('picker')
    setImageUrl(null)
    setPieces([])
    setResult(null)
    setSelectedScenario(null)
  }

  // ── Drop / tap-snap logic ──────────────────────────────────────────────────

  const snapPiece = useCallback((pieceId: number, slotRow: number, slotCol: number) => {
    setPieces(prev => {
      const piece = prev.find(p => p.id === pieceId)
      if (!piece || piece.placed) return prev

      const correct = isPieceCorrect(piece, slotRow, slotCol)
      if (!correct) return prev

      const next = prev.map(p => p.id === pieceId ? { ...p, placed: true } : p)

      setMoves(m => {
        const newMoves = m + 1
        const allPlaced = next.every(p => p.placed)
        if (allPlaced) {
          const r = recordCompletion('puzzle_maker', 'custom', '4-6', 1, newMoves, totalPieces)
          setResult({ stars: r.stars, coins: r.coinsEarned, newBadges: r.newBadges, streak: r.streak })
          setGameState('complete')
          recordGameForQuest('puzzle_maker')
        }
        return newMoves
      })

      return next
    })
    setActiveTray(null)
    setDragId(null)
  }, [totalPieces])

  // ── Slot click (tap mode) ──────────────────────────────────────────────────

  function handleSlotClick(slotRow: number, slotCol: number) {
    if (activeTray !== null) {
      snapPiece(activeTray, slotRow, slotCol)
    }
  }

  // ── Drag handlers (desktop) ────────────────────────────────────────────────

  function handleDragStart(pieceId: number) {
    setDragId(pieceId)
  }

  function handleDropOnSlot(e: React.DragEvent, slotRow: number, slotCol: number) {
    e.preventDefault()
    if (dragId !== null) snapPiece(dragId, slotRow, slotCol)
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  const placedIds = new Set(pieces.filter(p => p.placed).map(p => p.id))
  const trayPieces = pieces.filter(p => !p.placed)

  // Piece display size — fit nicely on screen
  const maxBoardW = typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 480) : 380
  const slotW = Math.floor(maxBoardW / cols)
  const slotH = Math.floor(slotW * (IMG_H / IMG_W))

  // Scale factor from image size to display size
  const scaleX = (slotW * cols) / IMG_W
  const scaleY = (slotH * rows) / IMG_H

  // ─────────────────────────────────────────────────────────────────────────

  // ── Picker ────────────────────────────────────────────────────────────────
  if (gameState === 'picker') {
    return (
      <div className="select-none space-y-5">
        <div className="text-center">
          <p className="font-black text-gray-700 text-base">
            {displayName ? `Make a puzzle for ${displayName}! 🧩` : 'Make your puzzle! 🧩'}
          </p>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            AI draws a personalised picture, then you piece it together
          </p>
        </div>

        {/* Difficulty selector — hidden for 2-4 (always 6 pieces) */}
        {ageGroup !== '2-4' && (
          <div className="flex gap-2 justify-center">
            {(['6', '12', '24'] as DifficultyLevel[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={[
                  'px-4 py-2 rounded-2xl border-2 font-black text-sm transition-all min-h-[44px]',
                  difficulty === d
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300',
                ].join(' ')}
              >
                {d} pieces
              </button>
            ))}
          </div>
        )}

        {/* Scenario grid — age-filtered */}
        <div className="grid grid-cols-2 gap-3">
          {scenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => generatePuzzle(scenario)}
              className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-100 p-4 text-center hover:border-violet-400 hover:shadow-lg transition-all min-h-[80px] flex flex-col items-center justify-center gap-1"
            >
              <span className="text-3xl">{scenario.emoji}</span>
              <span className="font-black text-gray-700 text-xs leading-snug">{scenario.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Generating ────────────────────────────────────────────────────────────
  if (gameState === 'generating') {
    return (
      <div className="select-none flex flex-col items-center justify-center gap-6 py-10 text-center min-h-[320px]">
        <div className="relative">
          {displayName ? (
            <DiceBearAvatar seed={displayName} size={100} className="ring-4 ring-violet-300" animated />
          ) : (
            <span className="text-7xl animate-bounce block">🦕</span>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center animate-spin">
            <span className="text-white text-sm">✦</span>
          </div>
        </div>

        <div className="space-y-1">
          <p
            key={creation.stepIndex}
            className="font-black text-gray-800 text-lg animate-slide-up"
          >
            {creation.text}
          </p>
          {selectedScenario && (
            <p className="text-gray-400 text-sm font-semibold">
              {selectedScenario.emoji} {selectedScenario.label}
            </p>
          )}
        </div>

        {/* Step progress track */}
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: creation.total }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === creation.stepIndex
                  ? 'w-5 h-2.5 bg-violet-500'
                  : i < creation.stepIndex
                    ? 'w-2.5 h-2.5 bg-violet-300'
                    : 'w-2.5 h-2.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-gray-300">Usually takes 5–10 seconds…</p>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (gameState === 'error') {
    return (
      <div className="select-none rounded-3xl bg-red-50 border-2 border-red-100 p-6 text-center space-y-4">
        <span className="text-5xl">😢</span>
        <p className="font-black text-red-700">Couldn't create the puzzle</p>
        <p className="text-sm text-red-500 font-semibold">{errorMsg}</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => selectedScenario && generatePuzzle(selectedScenario)}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm text-white font-black hover:bg-violet-700 min-h-[44px]"
          >
            Try again
          </button>
          <button
            onClick={resetToScenarioPicker}
            className="rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm text-gray-600 font-bold hover:bg-gray-50 min-h-[44px]"
          >
            Choose another
          </button>
        </div>
      </div>
    )
  }

  // ── Level complete ────────────────────────────────────────────────────────
  if (gameState === 'complete' && result) {
    return (
      <div className="select-none space-y-4">
        {/* Show finished puzzle */}
        {imageUrl && (
          <div className="rounded-2xl overflow-hidden border-4 border-yellow-300 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Completed puzzle" className="w-full h-auto" />
          </div>
        )}
        <LevelComplete
          level={1} totalLevels={1}
          stars={result.stars} coins={result.coins}
          moves={moves}
          childName={childName}
          newBadges={result.newBadges}
          streak={result.streak}
          themeEmoji="🧩"
          onReplay={() => selectedScenario && generatePuzzle(selectedScenario)}
        />
        <div className="flex gap-2">
          <button
            onClick={resetToScenarioPicker}
            className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-sm text-gray-600 font-bold hover:bg-gray-50 min-h-[44px]"
          >
            ← New puzzle
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

  // ── Playing ───────────────────────────────────────────────────────────────
  if (gameState !== 'playing' || !imageUrl) return null

  return (
    <div className="select-none space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={resetToScenarioPicker} className="text-xs text-gray-400 hover:text-violet-600 font-bold">
          ✕ Exit
        </button>
        <div className="text-center">
          <p className="font-black text-gray-700 text-sm">
            {selectedScenario?.emoji} {selectedScenario?.label}
          </p>
          <p className="text-xs text-gray-400">
            {placedIds.size}/{totalPieces} placed · {moves} attempts
          </p>
        </div>
        <div className="text-xs text-violet-500 font-black">
          {Math.round((placedIds.size / totalPieces) * 100)}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
          style={{ width: `${(placedIds.size / totalPieces) * 100}%` }}
        />
      </div>

      {/* Preview image (small, for reference) */}
      <div className="rounded-xl overflow-hidden border-2 border-violet-100 shadow-sm">
        <p className="text-center text-xs font-bold text-gray-400 bg-violet-50 py-1">Reference image</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Target puzzle" className="w-full h-auto opacity-60" />
      </div>

      {/* Puzzle board */}
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-center">
          Drag or tap a piece, then tap its spot on the board
        </p>
        <div
          ref={boardRef}
          className="mx-auto border-2 border-violet-200 rounded-2xl overflow-hidden shadow-lg"
          style={{ width: slotW * cols, display: 'grid', gridTemplateColumns: `repeat(${cols}, ${slotW}px)` }}
        >
          {Array.from({ length: rows * cols }, (_, i) => {
            const slotRow = Math.floor(i / cols)
            const slotCol = i % cols
            const placedPiece = pieces.find(p => p.placed && p.row === slotRow && p.col === slotCol)

            return (
              <div
                key={i}
                onClick={() => handleSlotClick(slotRow, slotCol)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnSlot(e, slotRow, slotCol)}
                style={{ width: slotW, height: slotH }}
                className={[
                  'relative border border-violet-100 transition-all',
                  placedPiece ? '' : 'bg-violet-50 hover:bg-violet-100 cursor-pointer',
                ].join(' ')}
              >
                {placedPiece ? (
                  <div
                    style={{
                      width: slotW,
                      height: slotH,
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: `${slotW * cols}px ${slotH * rows}px`,
                      backgroundPosition: `${placedPiece.bgX * scaleX}px ${placedPiece.bgY * scaleY}px`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-violet-200 text-xs font-bold">
                    {slotRow + 1},{slotCol + 1}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Piece tray */}
      {trayPieces.length > 0 && (
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-center">
            Pieces tray — tap a piece, then tap its spot above
          </p>
          <div className="flex flex-wrap gap-2 justify-center p-3 bg-gray-50 rounded-2xl border-2 border-gray-100">
            {trayPieces.map(piece => (
              <div
                key={piece.id}
                draggable
                onDragStart={() => handleDragStart(piece.id)}
                onClick={() => setActiveTray(activeTray === piece.id ? null : piece.id)}
                style={{
                  width: slotW,
                  height: slotH,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${slotW * cols}px ${slotH * rows}px`,
                  backgroundPosition: `${piece.bgX * scaleX}px ${piece.bgY * scaleY}px`,
                  cursor: 'grab',
                }}
                className={[
                  'rounded-xl border-2 shadow-md transition-all flex-shrink-0',
                  activeTray === piece.id
                    ? 'border-violet-500 scale-110 shadow-xl shadow-violet-200'
                    : 'border-white hover:border-violet-300 hover:scale-105',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
