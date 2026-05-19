'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { recordCompletion, type Badge } from '@/lib/progress'
import { recordGameForQuest } from '@/lib/quests'
import { Sounds } from '@/lib/sounds'
import LevelComplete from '@/components/LevelComplete'

// ── Types ────────────────────────────────────────────────────────────────────

type Cell = { value: number; id: number; merged?: boolean }
type Board = (Cell | null)[][]
type Dir = 'up' | 'down' | 'left' | 'right'

interface Props {
  childName?: string
  onWin?: () => void
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SIZE = 4
const WIN_TILE = 2048

// Tile colours from 2 → 2048+
const TILE_COLORS: Record<number, string> = {
  2:    'bg-slate-100 text-slate-700',
  4:    'bg-slate-200 text-slate-700',
  8:    'bg-orange-200 text-orange-800',
  16:   'bg-orange-300 text-white',
  32:   'bg-orange-400 text-white',
  64:   'bg-orange-500 text-white',
  128:  'bg-yellow-400 text-white',
  256:  'bg-yellow-500 text-white',
  512:  'bg-amber-500 text-white',
  1024: 'bg-amber-600 text-white',
  2048: 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-black shadow-xl shadow-amber-200',
}

function tileStyle(value: number): string {
  if (value >= 2048) return TILE_COLORS[2048]
  return TILE_COLORS[value] ?? 'bg-violet-600 text-white'
}

// ── Game logic ────────────────────────────────────────────────────────────────

let nextId = 1
function newCell(value: number): Cell {
  return { value, id: nextId++ }
}

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
}

function addRandom(board: Board): Board {
  const empty: [number, number][] = []
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!board[r][c]) empty.push([r, c])
  if (empty.length === 0) return board
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const next = board.map(row => [...row]) as Board
  next[r][c] = newCell(Math.random() < 0.9 ? 2 : 4)
  return next
}

function initBoard(): Board {
  let b = emptyBoard()
  b = addRandom(b)
  b = addRandom(b)
  return b
}

// Slide and merge a single row leftward (canonical direction)
function slideRow(row: (Cell | null)[]): { row: (Cell | null)[]; score: number } {
  const tiles = row.filter(Boolean) as Cell[]
  const merged: (Cell | null)[] = []
  let score = 0
  let i = 0
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const val = tiles[i].value * 2
      score += val
      merged.push({ ...newCell(val), merged: true })
      i += 2
    } else {
      merged.push(tiles[i])
      i++
    }
  }
  while (merged.length < SIZE) merged.push(null)
  return { row: merged, score }
}

function move(board: Board, dir: Dir): { board: Board; score: number; moved: boolean } {
  let totalScore = 0
  let moved = false

  // Rotate board so we always slide left
  let b = board.map(r => [...r]) as Board

  if (dir === 'right') b = b.map(r => [...r].reverse()) as Board
  if (dir === 'up')    b = transpose(b)
  if (dir === 'down')  b = transpose(b).map(r => [...r].reverse()) as Board

  const newB = b.map(row => {
    const { row: slid, score } = slideRow(row)
    totalScore += score
    if (JSON.stringify(slid) !== JSON.stringify(row)) moved = true
    return slid
  }) as Board

  // Reverse rotation
  let result = newB
  if (dir === 'right') result = result.map(r => [...r].reverse()) as Board
  if (dir === 'up')    result = transpose(result)
  if (dir === 'down')  result = transpose(result.map(r => [...r].reverse())) as Board

  return { board: result, score: totalScore, moved }
}

function transpose(b: Board): Board {
  return Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => b[c][r])
  ) as Board
}

function hasWon(b: Board): boolean {
  return b.some(row => row.some(cell => cell && cell.value >= WIN_TILE))
}

function hasLost(b: Board): boolean {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (!b[r][c]) return false
      const v = b[r][c]!.value
      if (c + 1 < SIZE && b[r][c + 1]?.value === v) return false
      if (r + 1 < SIZE && b[r + 1]?.[c]?.value === v) return false
    }
  return true
}

function highestTile(b: Board): number {
  return Math.max(...b.flat().map(c => c?.value ?? 0))
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NumberMerge({ childName, onWin }: Props) {
  const [board, setBoard] = useState<Board>(initBoard)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  const [result, setResult] = useState<{ stars: number; coins: number; newBadges: Badge[]; streak: number } | null>(null)
  const [keepPlaying, setKeepPlaying] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const name = childName?.trim() || 'you'

  // Persist best score
  useEffect(() => {
    const saved = parseInt(localStorage.getItem('sp_2048_best') ?? '0', 10)
    setBest(saved)
  }, [])

  const handleMove = useCallback((dir: Dir) => {
    if (lost || (won && !keepPlaying)) return
    setBoard(prev => {
      const { board: next, score: gained, moved } = move(prev, dir)
      if (!moved) return prev
      Sounds.slide()
      const withNew = addRandom(next)
      setScore(s => {
        const total = s + gained
        setBest(b => {
          const newBest = Math.max(b, total)
          localStorage.setItem('sp_2048_best', String(newBest))
          return newBest
        })
        return total
      })
      setMoves(m => m + 1)
      if (gained > 0) Sounds.match()
      if (!won && hasWon(withNew) && !keepPlaying) {
        Sounds.win()
        setWon(true)
        const r = recordCompletion('number_merge', 'space', '8-12', 1, moves + 1, WIN_TILE)
        setResult({ stars: r.stars, coins: r.coinsEarned, newBadges: r.newBadges, streak: r.streak })
        recordGameForQuest('number_merge')
        onWin?.()
      } else if (hasLost(withNew)) {
        setLost(true)
      }
      return withNew
    })
  }, [lost, won, keepPlaying, moves, onWin])

  // Keyboard
  useEffect(() => {
    const map: Record<string, Dir> = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
    }
    const handler = (e: KeyboardEvent) => {
      const dir = map[e.key]
      if (dir) { e.preventDefault(); handleMove(dir) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleMove])

  // Touch swipe
  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return
    if (Math.abs(dx) > Math.abs(dy))
      handleMove(dx > 0 ? 'right' : 'left')
    else
      handleMove(dy > 0 ? 'down' : 'up')
  }

  function restart() {
    nextId = 1
    setBoard(initBoard())
    setScore(0)
    setMoves(0)
    setWon(false)
    setLost(false)
    setResult(null)
    setKeepPlaying(false)
  }

  if (won && !keepPlaying && result) {
    return (
      <LevelComplete
        level={1} totalLevels={1}
        stars={result.stars} coins={result.coins} moves={moves}
        childName={childName}
        newBadges={result.newBadges} streak={result.streak}
        themeEmoji="2️⃣"
        onReplay={restart}
        onNext={() => setKeepPlaying(true)}
      />
    )
  }

  const highest = highestTile(board)

  return (
    <div
      className="select-none flex flex-col items-center gap-4 touch-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="font-black text-gray-800 text-lg leading-none">2048</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Swipe to merge tiles</p>
        </div>
        <div className="flex gap-2">
          <ScoreBox label="SCORE" value={score} />
          <ScoreBox label="BEST" value={best} />
        </div>
      </div>

      {/* Progress toward 2048 */}
      <div className="w-full">
        <div className="flex justify-between text-[11px] font-black text-gray-400 mb-1">
          <span>Highest: {highest}</span>
          <span>{moves} moves</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (Math.log2(Math.max(highest, 2)) / Math.log2(WIN_TILE)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Board */}
      <div className="relative bg-slate-300 rounded-2xl p-2 shadow-xl w-full max-w-[320px]">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {/* Empty slots */}
          {Array.from({ length: SIZE * SIZE }).map((_, i) => (
            <div key={`slot-${i}`} className="aspect-square rounded-xl bg-slate-200" />
          ))}
        </div>

        {/* Tiles overlay */}
        <div
          className="absolute inset-2 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
        >
          {board.flat().map((cell, i) => (
            <div
              key={cell ? `tile-${cell.id}` : `empty-${i}`}
              className={`aspect-square rounded-xl flex items-center justify-center font-black transition-transform duration-100 ${
                cell
                  ? `${tileStyle(cell.value)} ${cell.merged ? 'scale-110' : 'scale-100'}`
                  : 'bg-transparent'
              }`}
            >
              {cell && (
                <span className={cell.value >= 1024 ? 'text-sm' : cell.value >= 128 ? 'text-base' : 'text-xl'}>
                  {cell.value}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Game over overlay */}
        {lost && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3">
            <p className="text-2xl font-black text-gray-800">Game Over</p>
            <p className="text-sm text-gray-500">Best: {highest} · Score: {score}</p>
            <button
              onClick={restart}
              className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-white font-black text-sm shadow-lg min-h-[44px]"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="flex gap-2 justify-center">
        {(['←', '→', '↑', '↓'] as const).map((arrow, i) => {
          const dirs: Dir[] = ['left', 'right', 'up', 'down']
          return (
            <button
              key={arrow}
              onClick={() => handleMove(dirs[i])}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-black text-slate-600 text-lg flex items-center justify-center transition-colors"
            >
              {arrow}
            </button>
          )
        })}
      </div>

      <button
        onClick={restart}
        className="text-xs text-gray-400 hover:text-violet-600 font-bold transition-colors"
      >
        New game
      </button>
    </div>
  )
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-200 rounded-xl px-3 py-1.5 text-center min-w-[60px]">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="font-black text-slate-700 text-sm leading-none mt-0.5">{value}</p>
    </div>
  )
}
