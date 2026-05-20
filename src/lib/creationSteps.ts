import { useState, useEffect } from 'react'

export type CreationGameType = 'puzzle' | 'story'

const STEP_INTERVAL_MS = 1500

export function getCreationSteps(gameType: CreationGameType, childName?: string): string[] {
  const n = childName?.trim() ? `${childName.trim()}'s` : 'your'
  if (gameType === 'puzzle') {
    return [
      `✨ Rexy is building ${n} adventure…`,
      `🎨 Painting every detail…`,
      `🧩 Cutting the puzzle pieces…`,
      `🌟 Almost ready!`,
    ]
  }
  return [
    `✨ Rexy is dreaming up ${n} story…`,
    `📖 Writing the chapters…`,
    `🗺️ Exploring the world…`,
    `🌟 Almost ready!`,
  ]
}

export function useCreationSteps(gameType: CreationGameType, childName?: string, resetKey?: number) {
  const steps = getCreationSteps(gameType, childName)
  const [stepIndex, setStepIndex] = useState(0)

  // Reset when inputs change (resetKey lets callers force a reset on retry)
  useEffect(() => {
    setStepIndex(0)
  }, [gameType, childName, resetKey])

  // Advance through steps, stop at last
  useEffect(() => {
    if (stepIndex >= steps.length - 1) return
    const id = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1))
    }, STEP_INTERVAL_MS)
    return () => clearInterval(id)
  }, [stepIndex, steps.length])

  return { stepIndex, text: steps[stepIndex], total: steps.length }
}
