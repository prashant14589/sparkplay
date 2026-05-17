'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { type Theme, THEMES } from '@/lib/themes'
import HowToPlay from './HowToPlay'

type Cell = { n: boolean; e: boolean; s: boolean; w: boolean }
type Pos = { r: number; c: number }

const MAZE_SIZE: Record<string, number> = {
  '2-4': 5, '4-6': 7, '6-8': 9, '8-12': 11,
}

function generateMaze(size: number): Cell[][] {
  const visited = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const grid: Cell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ n: true, e: true, s: true, w: true }))
  )
  const DIRS = [
    { dr: -1, dc: 0, wall: 'n' as const, opp: 's' as const },
    { dr: 0,  dc: 1, wall: 'e' as const, opp: 'w' as const },
    { dr: 1,  dc: 0, wall: 's' as const, opp: 'n' as const },
    { dr: 0,  dc: -1,wall: 'w' as const, opp: 'e' as const },
  ]
  function visit(r: number, c: number) {
    visited[r][c] = true
    const dirs = [...DIRS].sort(() => Math.random() - 0.5)
    for (const { dr, dc, wall, opp } of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
        grid[r][c][wall] = false
        grid[nr][nc][opp] = false
        visit(nr, nc)
      }
    }
  }
  visit(0, 0)
  return grid
}

interface Props {
  theme?: Theme
  ageGroup?: string
  childName?: string
  onWin?: () => void
}

export default function MazeGame({ theme, ageGroup = '4-6', childName, onWin }: Props) {
  const activeTheme = theme ?? THEMES[0]
  const size = MAZE_SIZE[ageGroup] ?? 7
  const playerEmoji = activeTheme.cards[0]
  const goalEmoji = '🏆'

  const [maze, setMaze] = useState<Cell[][] | null>(null)
  const [pos, setPos] = useState<Pos>({ r: 0, c: 0 })
  const [won, setWon] = useState(false)
  const [moves, setMoves] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate maze client-side only (Math.random)
  useEffect(() => {
    setMaze(generateMaze(size))
    setPos({ r: 0, c: 0 })
    setWon(false)
    setMoves(0)
  }, [size, activeTheme.id])

  const move = useCallback((dir: 'n' | 'e' | 's' | 'w') => {
    if (!maze || won) return
    setPos((p) => {
      const cell = maze[p.r][p.c]
      if (cell[dir]) return p // wall blocks
      const next = {
        n: { r: p.r - 1, c: p.c },
        e: { r: p.r,     c: p.c + 1 },
        s: { r: p.r + 1, c: p.c },
        w: { r: p.r,     c: p.c - 1 },
      }[dir]
      setMoves((m) => m + 1)
      if (next.r === size - 1 && next.c === size - 1) {
        setWon(true)
        onWin?.()
      }
      return next
    })
  }, [maze, won, size, onWin])

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, 'n' | 'e' | 's' | 'w'> = {
        ArrowUp: 'n', ArrowRight: 'e', ArrowDown: 's', ArrowLeft: 'w',
        w: 'n', d: 'e', s: 's', a: 'w',
      }
      if (map[e.key]) { e.preventDefault(); move(map[e.key]) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [move])

  function restart() {
    setMaze(generateMaze(size))
    setPos({ r: 0, c: 0 })
    setWon(false)
    setMoves(0)
  }

  // Skeleton while maze generates
  if (!maze) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 animate-pulse">Generating maze…</div>
      </div>
    )
  }

  // Cell size — fit in container (max ~400px wide)
  const cellPx = Math.min(48, Math.floor(360 / size))
  const borderW = 2

  return (
    <div className="select-none flex flex-col items-center gap-4" ref={containerRef}>
      <div className="w-full"><HowToPlay gameType="maze" /></div>
      {/* Header */}
      <div className="flex items-center justify-between w-full text-sm text-gray-500">
        <span>{activeTheme.emoji} {activeTheme.name} Maze · {size}×{size}</span>
        <span>🔄 {moves} moves</span>
      </div>

      {/* Maze grid */}
      <div
        className="relative border-2 border-gray-800 rounded-sm"
        style={{ width: cellPx * size, height: cellPx * size }}
      >
        {maze.map((row, r) =>
          row.map((cell, c) => {
            const isPlayer = pos.r === r && pos.c === c
            const isGoal = r === size - 1 && c === size - 1 && !isPlayer

            return (
              <div
                key={`${r}-${c}`}
                className="absolute flex items-center justify-center text-center"
                style={{
                  width: cellPx,
                  height: cellPx,
                  top: r * cellPx,
                  left: c * cellPx,
                  borderTop:    cell.n ? `${borderW}px solid #1f2937` : `${borderW}px solid transparent`,
                  borderRight:  cell.e ? `${borderW}px solid #1f2937` : `${borderW}px solid transparent`,
                  borderBottom: cell.s ? `${borderW}px solid #1f2937` : `${borderW}px solid transparent`,
                  borderLeft:   cell.w ? `${borderW}px solid #1f2937` : `${borderW}px solid transparent`,
                  fontSize: cellPx * 0.55,
                  lineHeight: 1,
                  background: isPlayer ? '#ede9fe' : isGoal ? '#fef9c3' : 'white',
                  transition: 'background 0.15s',
                  zIndex: isPlayer ? 2 : 1,
                }}
              >
                {isPlayer && <span style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.3))' }}>{playerEmoji}</span>}
                {isGoal && goalEmoji}
              </div>
            )
          })
        )}
      </div>

      {/* Win banner */}
      {won && (
        <div className="rounded-2xl bg-green-50 border-2 border-green-300 px-6 py-4 text-center animate-bounce-in">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-bold text-green-800">
            {childName ? `${childName} solved it!` : 'You solved it!'}
          </p>
          <p className="text-sm text-green-600 mt-1">Finished in {moves} moves</p>
          <button
            onClick={restart}
            className="mt-3 rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white font-semibold hover:bg-green-700"
          >
            New maze →
          </button>
        </div>
      )}

      {/* On-screen D-pad */}
      <div className="grid grid-cols-3 gap-1 mt-1">
        {[
          [null, { label: '↑', dir: 'n' as const }, null],
          [{ label: '←', dir: 'w' as const }, null, { label: '→', dir: 'e' as const }],
          [null, { label: '↓', dir: 's' as const }, null],
        ].map((row, ri) =>
          row.map((btn, ci) =>
            btn ? (
              <button
                key={`${ri}-${ci}`}
                onPointerDown={(e) => { e.preventDefault(); move(btn.dir) }}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-xl font-bold text-gray-700 flex items-center justify-center touch-none"
              >
                {btn.label}
              </button>
            ) : (
              <div key={`${ri}-${ci}`} className="w-12 h-12" />
            )
          )
        )}
      </div>

      <p className="text-xs text-gray-400">Arrow keys or buttons to move {playerEmoji} to {goalEmoji}</p>
    </div>
  )
}
