'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { type Theme, THEMES } from '@/lib/themes'
import {
  buildGrid,
  getWordsForTheme,
  checkPath,
  getWordPositions,
  isValidPath,
  GRID_SIZES,
  type GridCell,
  type PlacedWord,
  type CellPos,
} from '@/lib/wordSearch'
import { recordCompletion, type Badge } from '@/lib/progress'
import LevelComplete from '@/components/LevelComplete'
import HowToPlay from './HowToPlay'

// Number of words to find per level (increases with difficulty)
const WORDS_PER_LEVEL: Record<number, number> = { 1: 4, 2: 5, 3: 6, 4: 7, 5: 8 }

// Vivid highlight colours for found words (cycles)
const FOUND_COLORS = [
  'bg-violet-400/70',
  'bg-pink-400/70',
  'bg-amber-400/70',
  'bg-cyan-400/70',
  'bg-green-400/70',
  'bg-rose-400/70',
  'bg-indigo-400/70',
  'bg-teal-400/70',
]

interface Props {
  theme?: Theme
  ageGroup?: string
  childName?: string
  level?: number
  totalLevels?: number
  onLevelComplete?: (level: number, moves: number) => void
}

export default function WordSearch({
  theme,
  ageGroup = '4-6',
  childName,
  level = 1,
  totalLevels = 5,
  onLevelComplete,
}: Props) {
  const activeTheme = theme ?? THEMES[0]
  const gridSize = GRID_SIZES[ageGroup] ?? 8
  const wordCount = WORDS_PER_LEVEL[level] ?? 5

  const [grid, setGrid] = useState<GridCell[][]>([])
  const [placed, setPlaced] = useState<PlacedWord[]>([])
  const [found, setFound] = useState<Set<string>>(new Set())
  const [selecting, setSelecting] = useState<CellPos[]>([])
  const [isPointerDown, setIsPointerDown] = useState(false)
  const [flashWrong, setFlashWrong] = useState(false)
  const [done, setDone] = useState(false)
  const [moves, setMoves] = useState(0) // attempts made
  const [completionResult, setCompletionResult] = useState<{
    stars: number; coins: number; newBadges: Badge[]; streak: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Build grid on mount / level / theme change
  useEffect(() => {
    const allWords = getWordsForTheme(activeTheme.id)
    const wordPool = [...allWords].sort(() => Math.random() - 0.5).slice(0, wordCount + 4)
    const { grid: g, placed: p } = buildGrid(wordPool, gridSize)
    const actualWords = p.slice(0, wordCount)
    setGrid(g)
    setPlaced(actualWords)
    setFound(new Set())
    setSelecting([])
    setIsPointerDown(false)
    setDone(false)
    setMoves(0)
    setCompletionResult(null)
  }, [activeTheme.id, level, ageGroup, gridSize, wordCount])

  // Map cell position → colour index for found words
  const foundCellColors = new Map<string, number>()
  placed.forEach((pw, colorIdx) => {
    if (!found.has(pw.word)) return
    getWordPositions(grid, pw).forEach((pos) => {
      foundCellColors.set(`${pos.row},${pos.col}`, colorIdx % FOUND_COLORS.length)
    })
  })

  const selectingSet = new Set(selecting.map((p) => `${p.row},${p.col}`))

  // Cell size — fills container while staying square
  const maxPx = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9 - 32, 380) : 340
  const cellPx = Math.floor(maxPx / gridSize)

  function cellKey(pos: CellPos) { return `${pos.row},${pos.col}` }

  function startSelect(row: number, col: number) {
    setIsPointerDown(true)
    setSelecting([{ row, col }])
  }

  function continueSelect(row: number, col: number) {
    if (!isPointerDown) return
    const next: CellPos[] = [...selecting, { row, col }]
    // Only extend if still a valid path
    if (isValidPath(next)) setSelecting(next)
  }

  const endSelect = useCallback(() => {
    if (!isPointerDown) return
    setIsPointerDown(false)
    setMoves((m) => m + 1)

    if (selecting.length < 2) { setSelecting([]); return }

    const match = checkPath(grid, placed, selecting)
    if (match && !found.has(match.word)) {
      const nextFound = new Set(found)
      nextFound.add(match.word)
      setFound(nextFound)
      setSelecting([])

      // Check win
      if (nextFound.size >= placed.length) {
        const finalMoves = moves + 1
        const r = recordCompletion('word_search', activeTheme.id, ageGroup, level, finalMoves, placed.length)
        setCompletionResult({ stars: r.stars, coins: r.coinsEarned, newBadges: r.newBadges, streak: r.streak })
        setDone(true)
        onLevelComplete?.(level, finalMoves)
      }
    } else {
      setFlashWrong(true)
      setTimeout(() => { setFlashWrong(false); setSelecting([]) }, 400)
    }
  }, [isPointerDown, selecting, grid, placed, found, moves, activeTheme.id, ageGroup, level, onLevelComplete])

  function replay() {
    const allWords = getWordsForTheme(activeTheme.id)
    const wordPool = [...allWords].sort(() => Math.random() - 0.5).slice(0, wordCount + 4)
    const { grid: g, placed: p } = buildGrid(wordPool, gridSize)
    setGrid(g)
    setPlaced(p.slice(0, wordCount))
    setFound(new Set())
    setSelecting([])
    setDone(false)
    setMoves(0)
    setCompletionResult(null)
  }

  if (grid.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-300 animate-pulse font-bold">Building word search…</p>
      </div>
    )
  }

  if (done && completionResult) {
    return (
      <LevelComplete
        level={level}
        totalLevels={totalLevels}
        stars={completionResult.stars}
        coins={completionResult.coins}
        moves={moves}
        childName={childName}
        newBadges={completionResult.newBadges}
        streak={completionResult.streak}
        themeEmoji={activeTheme.emoji} themeId={activeTheme.id}
        onReplay={replay}
      />
    )
  }

  return (
    <div className="select-none flex flex-col gap-4">
      <HowToPlay gameType="word_search" />

      {/* Stats bar */}
      <div className="flex items-center justify-between text-sm font-black text-gray-500">
        <span>{activeTheme.emoji} {activeTheme.name}{childName?.trim() ? ` · ${childName}` : ''}</span>
        <span className="bg-violet-50 border border-violet-100 rounded-full px-3 py-0.5 text-violet-600">
          Found {found.size}/{placed.length}
        </span>
      </div>

      {/* Word list */}
      <div className="flex flex-wrap gap-2">
        {placed.map((pw, i) => {
          const isFound = found.has(pw.word)
          return (
            <span
              key={pw.word}
              className={`px-3 py-1 rounded-full text-xs font-black border-2 transition-all ${
                isFound
                  ? `${FOUND_COLORS[i % FOUND_COLORS.length].replace('/70', '')} text-white border-transparent line-through`
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {pw.word}
            </span>
          )
        })}
      </div>

      {/* Grid */}
      <div
        ref={containerRef}
        className="relative mx-auto rounded-2xl overflow-hidden border-2 border-violet-200 shadow-lg"
        style={{
          width: cellPx * gridSize,
          height: cellPx * gridSize,
          touchAction: 'none',
        }}
        onPointerLeave={endSelect}
        onPointerUp={endSelect}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = cellKey({ row: r, col: c })
            const foundColor = foundCellColors.get(key)
            const isSelected = selectingSet.has(key)
            const isFound = foundColor !== undefined

            return (
              <div
                key={key}
                onPointerDown={(e) => { e.preventDefault(); startSelect(r, c) }}
                onPointerEnter={() => continueSelect(r, c)}
                className={[
                  'absolute flex items-center justify-center',
                  'text-center font-black cursor-pointer transition-colors duration-100',
                  isFound
                    ? `${FOUND_COLORS[foundColor!]} text-white`
                    : isSelected
                      ? flashWrong
                        ? 'bg-red-300 text-white'
                        : 'bg-violet-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-violet-50',
                ].join(' ')}
                style={{
                  width: cellPx,
                  height: cellPx,
                  top: r * cellPx,
                  left: c * cellPx,
                  fontSize: Math.max(10, cellPx * 0.45),
                  borderRight: c < gridSize - 1 ? '1px solid #e9d5ff' : 'none',
                  borderBottom: r < gridSize - 1 ? '1px solid #e9d5ff' : 'none',
                }}
              >
                {cell.letter}
              </div>
            )
          })
        )}
      </div>

      <p className="text-xs text-gray-300 text-center font-semibold">
        Drag or tap letters to select a word
      </p>
    </div>
  )
}
