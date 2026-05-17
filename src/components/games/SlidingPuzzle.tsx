'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Theme, THEMES } from '@/lib/themes'
import HowToPlay from './HowToPlay'

// Solved state: [1, 2, 3, ..., N²-1, 0]
// tiles[pos] = tileId | tileId 0 = empty, tileId N = emojis[N-1]
// Empty is at the LAST position when solved (bottom-right)
const PUZZLE_SIZE: Record<string, number> = {
  '2-4': 3, '4-6': 3, '6-8': 4, '8-12': 4,
}

function solvedTiles(size: number): number[] {
  // [1, 2, ..., N²-1, 0]  — empty last
  return Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size))
}

function isSolved(tiles: number[]): boolean {
  const size = Math.round(Math.sqrt(tiles.length))
  return tiles.every((v, i) => v === (i + 1) % (size * size))
}

function generatePuzzle(size: number): number[] {
  // Start from solved state, make random valid moves → guaranteed solvable
  const tiles = solvedTiles(size)
  let emptyPos = size * size - 1 // empty starts at last position ✓

  for (let i = 0; i < size * size * 40; i++) {
    const row = Math.floor(emptyPos / size)
    const col = emptyPos % size
    const neighbors: number[] = []
    if (row > 0) neighbors.push(emptyPos - size)
    if (row < size - 1) neighbors.push(emptyPos + size)
    if (col > 0) neighbors.push(emptyPos - 1)
    if (col < size - 1) neighbors.push(emptyPos + 1)

    const next = neighbors[Math.floor(Math.random() * neighbors.length)]
    ;[tiles[emptyPos], tiles[next]] = [tiles[next], tiles[emptyPos]]
    emptyPos = next
  }
  return tiles
}

function isAdjacent(posA: number, posB: number, size: number) {
  const rA = Math.floor(posA / size), cA = posA % size
  const rB = Math.floor(posB / size), cB = posB % size
  return (rA === rB && Math.abs(cA - cB) === 1) || (cA === cB && Math.abs(rA - rB) === 1)
}

interface Props {
  theme?: Theme
  ageGroup?: string
  childName?: string
  onWin?: () => void
}

export default function SlidingPuzzle({ theme, ageGroup = '4-6', childName, onWin }: Props) {
  const activeTheme = theme ?? THEMES[0]
  const size = PUZZLE_SIZE[ageGroup] ?? 4
  const emojis = activeTheme.cards.slice(0, size * size - 1)

  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => { reset() }, [size, activeTheme.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!running || won) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [running, won])

  function reset() {
    setTiles(generatePuzzle(size))
    setMoves(0); setSeconds(0); setRunning(false); setWon(false)
  }

  const slide = useCallback((tilePos: number) => {
    if (won) return
    setTiles((prev) => {
      const emptyPos = prev.indexOf(0)
      if (!isAdjacent(tilePos, emptyPos, size)) return prev
      const next = [...prev]
      ;[next[tilePos], next[emptyPos]] = [next[emptyPos], next[tilePos]]
      return next
    })
    setMoves((m) => {
      if (m === 0) setRunning(true)
      return m + 1
    })
  }, [won, size])

  useEffect(() => {
    if (tiles.length > 0 && isSolved(tiles) && !won && moves > 0) {
      setWon(true); setRunning(false); onWin?.()
    }
  }, [tiles, won, moves, onWin])

  const emptyPos = tiles.indexOf(0)
  const maxWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.85, 400) : 360
  const cellPx = Math.min(90, Math.floor(maxWidth / size))
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  if (tiles.length === 0) {
    return <div className="flex items-center justify-center h-48"><div className="text-gray-400 animate-pulse">Setting up puzzle…</div></div>
  }

  return (
    <div className="select-none flex flex-col items-center gap-4">
      <HowToPlay gameType="puzzle" />

      {/* Stats */}
      <div className="flex justify-between w-full text-sm text-gray-500">
        <span>{activeTheme.emoji} {activeTheme.name} · {size}×{size}</span>
        <span className="flex gap-3">
          <span>🔄 {moves} moves</span>
          <span>⏱ {fmt(seconds)}</span>
        </span>
      </div>

      {/* Puzzle grid */}
      <div
        className="relative rounded-2xl overflow-hidden border-4 border-gray-200 bg-gray-100"
        style={{ width: size * cellPx, height: size * cellPx }}
      >
        {tiles.map((tileId, pos) => {
          if (tileId === 0) return null // empty cell — leave blank
          // Correct when tileId === pos + 1 (solved = [1,2,...,N²-1,0])
          const isCorrect = tileId === pos + 1
          const row = Math.floor(pos / size)
          const col = pos % size
          const adjToEmpty = isAdjacent(pos, emptyPos, size)

          return (
            <button
              key={tileId}
              onClick={() => slide(pos)}
              style={{
                position: 'absolute',
                width: cellPx - 4,
                height: cellPx - 4,
                top: row * cellPx + 2,
                left: col * cellPx + 2,
                fontSize: cellPx * 0.45,
                transition: 'top 0.12s ease, left 0.12s ease',
              }}
              className={[
                'rounded-xl flex items-center justify-center border-2',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
                won
                  ? 'bg-green-50 border-green-300 cursor-default'
                  : isCorrect
                    ? `bg-gradient-to-br ${activeTheme.color} border-transparent shadow-md`
                    : adjToEmpty
                      ? 'bg-white border-violet-300 cursor-pointer hover:scale-105 hover:shadow-md active:scale-95'
                      : 'bg-white border-gray-200 cursor-default opacity-80',
              ].join(' ')}
            >
              {emojis[tileId - 1]}
            </button>
          )
        })}
      </div>

      {/* Goal + legend */}
      {!won && (
        <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-2 w-full">
          <div>
            <p className="font-semibold text-gray-600 mb-1">Goal — arrange in this order:</p>
            <div className="flex flex-wrap gap-0.5" style={{ maxWidth: size * 22 }}>
              {emojis.map((e, i) => (
                <span key={i} className="w-5 h-5 text-sm flex items-center justify-center">{e}</span>
              ))}
              <span className="w-5 h-5 bg-gray-200 rounded text-xs flex items-center justify-center text-gray-400">□</span>
            </div>
          </div>
          <div className="text-left flex-1 border-l border-gray-200 pl-3 space-y-1">
            <p><span className={`inline-block w-3 h-3 rounded bg-gradient-to-br ${activeTheme.color} mr-1`} />= correct spot</p>
            <p><span className="inline-block w-3 h-3 rounded border-2 border-violet-400 mr-1" />= tap to slide</p>
          </div>
        </div>
      )}

      {/* Win banner */}
      {won && (
        <div className="rounded-2xl bg-green-50 border-2 border-green-300 px-6 py-4 text-center w-full">
          <p className="text-3xl mb-1">🏆</p>
          <p className="font-bold text-green-800 text-lg">
            {childName ? `${childName} solved it!` : 'Puzzle solved!'}
          </p>
          <p className="text-sm text-green-600 mt-0.5">{moves} moves · {fmt(seconds)}</p>
          <button onClick={reset} className="mt-3 rounded-lg bg-green-600 px-5 py-2 text-sm text-white font-semibold hover:bg-green-700">
            New puzzle →
          </button>
        </div>
      )}

      {!won && (
        <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 underline">New puzzle</button>
      )}
    </div>
  )
}
