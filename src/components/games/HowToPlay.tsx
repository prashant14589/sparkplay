'use client'

import { useState } from 'react'

type GameType = 'memory' | 'maze' | 'puzzle' | 'quiz' | 'word_search' | 'coloring'

const INSTRUCTIONS: Record<GameType, { title: string; steps: string[]; tip: string }> = {
  memory: {
    title: 'How to play Memory Match',
    steps: [
      'Click any card to flip it over and see the emoji',
      'Click a second card — if both emojis match, they stay face up ✅',
      'If they don\'t match, both cards flip back — remember where they were!',
      'Match all pairs to complete the level',
    ],
    tip: '💡 Tip: Start from a corner and work your way across so you remember positions',
  },
  maze: {
    title: 'How to play Maze',
    steps: [
      'Your character starts in the top-left corner',
      'Move using the ↑ ↓ ← → arrow keys on your keyboard',
      'Or tap the on-screen direction buttons (great for phones!)',
      'Reach the 🏆 trophy in the bottom-right to win',
    ],
    tip: '💡 Tip: Try to hug one wall the whole way — it\'s a classic maze-solving trick',
  },
  puzzle: {
    title: 'How to play Sliding Puzzle',
    steps: [
      'There is one empty space in the grid — that\'s your sliding space',
      'Tap any tile that is directly next to the empty space to slide it in',
      'Keep sliding tiles until all emojis are in order (left → right, top → bottom)',
      'Tiles glowing in colour are already in the correct position 🎯',
    ],
    tip: '💡 Tip: Solve the top row first, then the left column, then work on the rest',
  },
  quiz: {
    title: 'How to play Quiz',
    steps: [
      'Read the question carefully',
      'Tap the answer you think is correct',
      'Green = correct, Red = wrong — then the next question appears',
      'Try to get a perfect score!',
    ],
    tip: '💡 Tip: If unsure, eliminate the obviously wrong answers first',
  },
  word_search: {
    title: 'How to play Word Search',
    steps: [
      'Find all the hidden words listed on the side',
      'Words can go left→right, top→bottom, or diagonal',
      'Click the first letter, then the last letter to mark a word',
      'Find all words to win!',
    ],
    tip: '💡 Tip: Scan each row left-to-right first, then look for unusual letters',
  },
  coloring: {
    title: 'How to play Coloring Book',
    steps: [
      'Pick a colour from the palette',
      'Tap any section of the picture to colour it in',
      'Use as many colours as you like — there\'s no wrong answer!',
      'Save or share your finished artwork',
    ],
    tip: '💡 Tip: Try to use contrasting colours for sections next to each other',
  },
}

interface Props {
  gameType: GameType
}

export default function HowToPlay({ gameType }: Props) {
  const [open, setOpen] = useState(false)
  const info = INSTRUCTIONS[gameType]
  if (!info) return null

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
      >
        <span className="w-4 h-4 rounded-full border border-violet-400 flex items-center justify-center text-[10px] flex-shrink-0">?</span>
        {open ? 'Hide instructions' : 'How to play'}
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 rounded-xl bg-violet-50 border border-violet-200 p-4 text-sm">
          <p className="font-semibold text-violet-900 mb-2">{info.title}</p>
          <ol className="space-y-1.5 mb-3">
            {info.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-violet-800">
                <span className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-violet-700 bg-violet-100 rounded-lg px-3 py-2">{info.tip}</p>
        </div>
      )}
    </div>
  )
}
