export type StepId = 'age' | 'game' | 'theme' | 'make'

export interface BuilderStep {
  id: StepId
  label: string       // short label for the progress dots
  headline: string    // big question shown at top of each step
  sub: string         // supporting line
  autoAdvance: boolean // true = tapping a card advances immediately
}

export function getBuilderStepConfig(): BuilderStep[] {
  return [
    {
      id: 'age',
      label: 'Who',
      headline: 'Who is this game for?',
      sub: "We'll pick the best games and worlds for their age.",
      autoAdvance: true,
    },
    {
      id: 'game',
      label: 'Game',
      headline: 'What kind of game?',
      sub: 'Tap one to choose.',
      autoAdvance: true,
    },
    {
      id: 'theme',
      label: 'World',
      headline: 'Which world?',
      sub: 'Each world has its own feel. Tap one.',
      autoAdvance: true,
    },
    {
      id: 'make',
      label: 'Name',
      headline: "Make it theirs.",
      sub: "Add a name and we'll make it feel like their very own game.",
      autoAdvance: false,
    },
  ]
}

export function nextStep(current: StepId): StepId | null {
  const steps = getBuilderStepConfig()
  const idx = steps.findIndex(s => s.id === current)
  return idx < steps.length - 1 ? steps[idx + 1].id : null
}

export function prevStep(current: StepId): StepId | null {
  const steps = getBuilderStepConfig()
  const idx = steps.findIndex(s => s.id === current)
  return idx > 0 ? steps[idx - 1].id : null
}

export function stepNumber(current: StepId): number {
  return getBuilderStepConfig().findIndex(s => s.id === current) + 1
}
