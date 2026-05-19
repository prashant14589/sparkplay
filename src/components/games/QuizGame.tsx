'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Theme, THEMES } from '@/lib/themes'
import { Sounds } from '@/lib/sounds'
import {
  pickQuestionsForGame,
  interpolateQuestion,
  type QuizQuestion,
} from '@/lib/quiz'
import { recordCompletion, type Badge } from '@/lib/progress'
import LevelComplete from '@/components/LevelComplete'
import GameEmoji from '@/components/GameEmoji'

// Vivid per-option colour pairs [bg, text, border] — cycling through 4 colours
const OPTION_STYLES = [
  'bg-violet-500 hover:bg-violet-600 text-white border-violet-400',
  'bg-pink-500   hover:bg-pink-600   text-white border-pink-400',
  'bg-amber-400  hover:bg-amber-500  text-gray-900 border-amber-300',
  'bg-cyan-500   hover:bg-cyan-600   text-white border-cyan-400',
]

const CORRECT_STYLE  = 'bg-green-400 text-white border-green-500 scale-105 shadow-lg shadow-green-200'
const WRONG_STYLE    = 'bg-red-400   text-white border-red-500   opacity-80'
const NEUTRAL_STYLE  = 'opacity-40 cursor-not-allowed'

interface Props {
  theme?: Theme
  ageGroup?: string
  childName?: string
  level?: number
  totalLevels?: number
  onLevelComplete?: (level: number, moves: number) => void
}

export default function QuizGame({
  theme,
  ageGroup = '4-6',
  childName,
  level = 1,
  totalLevels = 5,
  onLevelComplete,
}: Props) {
  const activeTheme = theme ?? THEMES[0]

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [completionResult, setCompletionResult] = useState<{
    stars: number; coins: number; newBadges: Badge[]; streak: number
  } | null>(null)

  useEffect(() => {
    const qs = pickQuestionsForGame(activeTheme.id, level, 5)
    setQuestions(qs)
    setQIndex(0)
    setChosen(null)
    setScore(0)
    setDone(false)
    setCompletionResult(null)
  }, [activeTheme.id, level, ageGroup])

  const current = questions[qIndex]

  const handleChoice = useCallback((idx: number) => {
    if (chosen !== null || !current) return
    setChosen(idx)
    const correct = idx === current.correct
    if (correct) { setScore((s) => s + 1); Sounds.correct() }
    else Sounds.wrong()

    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        // Game over — calculate result
        const totalQuestions = questions.length
        const finalScore = correct ? score + 1 : score
        // moves = wrong answers (lower = better)
        const wrongAnswers = totalQuestions - finalScore
        const r = recordCompletion(
          'quiz', activeTheme.id, ageGroup, level, wrongAnswers, totalQuestions,
        )
        setCompletionResult({ stars: r.stars, coins: r.coinsEarned, newBadges: r.newBadges, streak: r.streak })
        setDone(true)
        onLevelComplete?.(level, wrongAnswers)
      } else {
        setQIndex((i) => i + 1)
        setChosen(null)
      }
    }, 1000)
  }, [chosen, current, qIndex, questions, score, activeTheme.id, ageGroup, level, onLevelComplete])

  function replay() {
    const qs = pickQuestionsForGame(activeTheme.id, level, 5)
    setQuestions(qs)
    setQIndex(0)
    setChosen(null)
    setScore(0)
    setDone(false)
    setCompletionResult(null)
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="text-5xl">{activeTheme.emoji}</div>
        <p className="font-black text-gray-400">No quiz questions for this theme + level yet.</p>
        <p className="text-sm text-gray-300">Try a different theme or level.</p>
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
        moves={questions.length - score}
        childName={childName}
        newBadges={completionResult.newBadges}
        streak={completionResult.streak}
        themeEmoji={current?.illustration ?? activeTheme.emoji}
        onReplay={replay}
      />
    )
  }

  return (
    <div className="select-none flex flex-col gap-5">

      {/* ── Progress bar + score ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${activeTheme.color} transition-all duration-500`}
            style={{ width: `${((qIndex) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-black text-gray-400 whitespace-nowrap">
          {qIndex + 1} / {questions.length}
        </span>
        <span className="text-sm font-black text-violet-600">
          ⭐ {score}
        </span>
      </div>

      {/* ── Question card ── */}
      {current && (
        <div className={`rounded-3xl bg-gradient-to-br ${activeTheme.color} p-1 shadow-xl`}>
          <div className="bg-white rounded-[20px] p-5 text-center">

            {/* Illustration — Twemoji at 96px on gradient card */}
            <div
              className={`mx-auto mb-4 w-24 h-24 rounded-2xl bg-gradient-to-br ${activeTheme.color} flex items-center justify-center shadow-xl`}
            >
              <GameEmoji emoji={current.illustration} size={72} skeleton />
            </div>

            {/* Question text */}
            <h2 className="font-black text-gray-800 text-lg leading-snug">
              {interpolateQuestion(current.question, childName)}
            </h2>

            {/* Chosen feedback */}
            {chosen !== null && (
              <p className={`mt-2 text-sm font-black ${chosen === current.correct ? 'text-green-600' : 'text-red-500'}`}>
                {chosen === current.correct ? '✓ Correct! Great job!' : `✗ The answer was: ${current.answers[current.correct]}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Answer buttons ── */}
      {current && (
        <div className="grid grid-cols-1 gap-3">
          {current.answers.map((answer, idx) => {
            let style = OPTION_STYLES[idx]
            if (chosen !== null) {
              if (idx === current.correct)       style = CORRECT_STYLE
              else if (idx === chosen)           style = WRONG_STYLE
              else                               style = `${OPTION_STYLES[idx]} ${NEUTRAL_STYLE}`
            }
            return (
              <button
                key={idx}
                onClick={() => handleChoice(idx)}
                disabled={chosen !== null}
                className={`w-full rounded-2xl border-2 px-5 py-3.5 text-left font-black text-sm transition-all duration-200 min-h-[52px] flex items-center gap-3 ${style}`}
              >
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-black flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                {answer}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Child name tag ── */}
      {childName?.trim() && (
        <p className="text-center text-xs text-gray-300 font-semibold">
          Playing as <span className="text-violet-500 font-black">{childName}</span>
        </p>
      )}
    </div>
  )
}
