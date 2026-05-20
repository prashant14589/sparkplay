import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import QuestTeaser from '../QuestTeaser'
import type { Quest } from '@/lib/quests'

const MATCH_QUEST: Quest = {
  id: 'match_pairs',
  emoji: '🃏',
  title: 'Card Master',
  description: 'Match 6 pairs in Memory Match',
  target: 6,
  game: 'memory',
}

const STORY_QUEST: Quest = {
  id: 'finish_story',
  emoji: '📖',
  title: 'Story Explorer',
  description: 'Reach an ending in Story Quest',
  target: 1,
  game: 'story',
}

describe('QuestTeaser — active quest', () => {
  it('renders the quest title', () => {
    render(<QuestTeaser quest={MATCH_QUEST} progress={0} />)
    expect(screen.getByText('Card Master')).toBeInTheDocument()
  })

  it('renders the quest emoji', () => {
    render(<QuestTeaser quest={MATCH_QUEST} progress={0} />)
    expect(screen.getByText('🃏')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<QuestTeaser quest={MATCH_QUEST} progress={0} />)
    expect(screen.getByText(/Match 6 pairs/i)).toBeInTheDocument()
  })

  it('shows progress count (e.g. 2 / 6)', () => {
    const { container } = render(<QuestTeaser quest={MATCH_QUEST} progress={2} />)
    // The counter renders as "2" + " / 6" in adjacent spans
    expect(container.textContent).toContain('2')
    expect(container.textContent).toMatch(/\/\s*6/)
  })

  it('progress bar fills proportionally', () => {
    const { container } = render(<QuestTeaser quest={MATCH_QUEST} progress={3} />)
    const bar = container.querySelector('[data-testid="quest-progress-bar"]') as HTMLElement
    expect(bar).toBeTruthy()
    expect(bar.style.width).toBe('50%')
  })

  it('progress bar is 100% when at target', () => {
    const { container } = render(<QuestTeaser quest={MATCH_QUEST} progress={6} />)
    const bar = container.querySelector('[data-testid="quest-progress-bar"]') as HTMLElement
    expect(bar.style.width).toBe('100%')
  })

  it('progress bar never exceeds 100%', () => {
    const { container } = render(<QuestTeaser quest={MATCH_QUEST} progress={99} />)
    const bar = container.querySelector('[data-testid="quest-progress-bar"]') as HTMLElement
    expect(bar.style.width).toBe('100%')
  })
})

describe('QuestTeaser — completed state', () => {
  it('shows completion indicator when progress meets target', () => {
    render(<QuestTeaser quest={MATCH_QUEST} progress={6} />)
    expect(screen.getByText(/done|complete|✅|🎉/i)).toBeInTheDocument()
  })

  it('does not show completion when progress is below target', () => {
    render(<QuestTeaser quest={MATCH_QUEST} progress={5} />)
    expect(screen.queryByText(/✅/)).not.toBeInTheDocument()
  })
})

describe('QuestTeaser — single-target quest', () => {
  it('renders story quest without crashing', () => {
    expect(() => render(<QuestTeaser quest={STORY_QUEST} progress={0} />)).not.toThrow()
  })

  it('shows complete state when progress is 1 of 1', () => {
    render(<QuestTeaser quest={STORY_QUEST} progress={1} />)
    expect(screen.getByText(/done|complete|✅|🎉/i)).toBeInTheDocument()
  })
})

describe('QuestTeaser — label', () => {
  it('renders a "Today\'s Quest" label', () => {
    render(<QuestTeaser quest={MATCH_QUEST} progress={0} />)
    expect(screen.getByText(/today.*quest/i)).toBeInTheDocument()
  })
})
