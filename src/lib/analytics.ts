import { track } from '@vercel/analytics'

// All SparkPlay analytics events — call these from game components and auth flows.
// Vercel Analytics automatically collects page views; these are custom events.

export const Analytics = {
  gamePlayed(gameType: string, theme?: string) {
    track('game_played', { game_type: gameType, theme: theme ?? 'unknown' })
  },

  levelComplete(gameType: string, level: number, stars: number) {
    track('level_complete', { game_type: gameType, level, stars })
  },

  storyGenerated(theme: string, ageGroup: string) {
    track('story_generated', { theme, age_group: ageGroup })
  },

  puzzleGenerated(scenario: string) {
    track('puzzle_generated', { scenario })
  },

  signup(method: 'email' | 'google') {
    track('signup', { method })
  },

  upgradeClicked(source: string, plan: string) {
    track('upgrade_clicked', { source, plan })
  },

  paywallHit(featureName: string) {
    track('paywall_hit', { feature: featureName })
  },

  rateLimitHit(action: 'story' | 'puzzle', tier: string) {
    track('rate_limit_hit', { action, tier })
  },
}
