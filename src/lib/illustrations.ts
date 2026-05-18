/**
 * Illustration manifest for SparkPlay.
 *
 * Run `npm run generate:illustrations` (scripts/generate-illustrations.ts)
 * once to populate public/illustrations/ with DALL-E 3 generated PNGs.
 * After generation, every path returned by these helpers maps to an actual
 * static file served from /public.
 *
 * Components check hasIllustration() and fall back to <GameEmoji> when the
 * file doesn't exist yet (e.g. in local dev before the script has run).
 */

export const ILLUSTRATION_BASE = '/illustrations'

// ─── Card subjects ──────────────────────────────────────────────────────────
// Each entry drives one DALL-E generation and maps to a card illustration.
// Order matches the theme's emoji card array in themes.ts.

export const THEME_CARD_SUBJECTS: Record<string, string[]> = {
  animals:     ['dog', 'cat', 'lion', 'bear', 'frog', 'duck', 'fox', 'panda', 'koala', 'tiger', 'monkey', 'penguin', 'rabbit', 'hamster', 'owl', 'elephant', 'giraffe', 'dolphin'],
  dinos:       ['brachiosaurus', 'trex', 'triceratops', 'stegosaurus', 'pterodactyl', 'ankylosaurus', 'spinosaurus', 'velociraptor', 'diplodocus', 'parasaurolophus', 'pachycephalosaurus', 'iguanodon'],
  unicorns:    ['unicorn', 'fairy', 'pegasus', 'rainbow-pony', 'magic-bunny', 'sparkle-cat', 'crystal-fox', 'star-deer', 'moon-bear', 'cloud-horse', 'glitter-owl', 'potion-witch'],
  ocean:       ['clownfish', 'dolphin', 'octopus', 'crab', 'shark', 'seahorse', 'jellyfish', 'turtle', 'whale', 'starfish', 'lobster', 'seal', 'narwhal', 'pufferfish', 'manta-ray', 'anglerfish'],
  space:       ['astronaut', 'alien', 'rocket', 'planet-robot', 'moon-cat', 'star-dog', 'comet-dragon', 'saturn-frog', 'nebula-owl', 'blackhole-bunny', 'space-whale', 'meteor-bear'],
  superheroes: ['cape-kid', 'speedster', 'strongman', 'flying-girl', 'lightning-boy', 'ice-hero', 'fire-hero', 'water-hero', 'earth-hero', 'shadow-hero', 'light-hero', 'time-hero'],
  farm:        ['cow', 'pig', 'chicken', 'horse', 'sheep', 'goat', 'duck', 'rooster', 'rabbit', 'dog', 'cat', 'donkey', 'turkey', 'goose'],
  food:        ['pizza-chef', 'ice-cream', 'donut', 'cupcake', 'taco', 'strawberry', 'cookie', 'cake', 'burger', 'candy', 'waffle', 'sushi'],
}

// ─── Hero subjects (for level complete screen + story header) ───────────────

export const THEME_HERO_SUBJECTS: Record<string, string> = {
  animals:     'friendly lion with a big mane and a warm smile',
  dinos:       'cute baby T-Rex with tiny arms and a big happy grin',
  unicorns:    'magical unicorn with a rainbow horn and sparkling mane',
  ocean:       'cheerful dolphin leaping through the air',
  space:       'excited young astronaut in a colourful spacesuit waving hello',
  superheroes: 'energetic young kid in a purple superhero cape and mask',
  farm:        'happy round cow with big brown eyes and flower on head',
  food:        'smiling chef cookie with a tiny white hat and chocolate chips',
}

// ─── Celebration subjects (level complete "kid + theme" scene) ───────────────

export const THEME_CELEBRATION_SUBJECTS: Record<string, string> = {
  animals:     'a joyful child hugging a fluffy cartoon lion, both celebrating with confetti',
  dinos:       'an excited child riding a friendly baby T-Rex through a prehistoric jungle',
  unicorns:    'a happy child and a magical unicorn jumping over a rainbow together',
  ocean:       'a laughing child swimming alongside cheerful dolphins underwater',
  space:       'a delighted young astronaut high-fiving a friendly green alien on the moon',
  superheroes: 'a triumphant child in a purple cape flying above a bright cartoon city',
  farm:        'a smiling child feeding carrots to a friendly cartoon horse on a sunny farm',
  food:        'a gleeful child and a giant smiling donut dancing in a candy kingdom',
}

// ─── Path helpers ────────────────────────────────────────────────────────────

/** Path for a specific card illustration (index into the theme's subject list). */
export function getCardIllustration(theme: string, index: number): string | null {
  const subjects = THEME_CARD_SUBJECTS[theme]
  if (!subjects || index < 0 || index >= subjects.length) return null
  const subject = subjects[index]
  return `${ILLUSTRATION_BASE}/${theme}/card-${subject}.png`
}

/** Path for the theme's main hero illustration. */
export function getHeroIllustration(theme: string): string | null {
  if (!THEME_HERO_SUBJECTS[theme]) return null
  return `${ILLUSTRATION_BASE}/${theme}/hero.png`
}

/** Path for the theme's celebration scene (kid + character). */
export function getCelebrationIllustration(theme: string): string | null {
  if (!THEME_CELEBRATION_SUBJECTS[theme]) return null
  return `${ILLUSTRATION_BASE}/${theme}/celebration.png`
}

/**
 * Returns whether a valid path exists for the given theme/index.
 * Doesn't check the filesystem — IllustrationImage handles load failures
 * with onError → fallback to GameEmoji.
 */
export function hasIllustration(theme: string, indexOrType: number | 'hero' | 'celebration'): boolean {
  if (typeof indexOrType === 'number') return getCardIllustration(theme, indexOrType) !== null
  if (indexOrType === 'hero') return getHeroIllustration(theme) !== null
  return getCelebrationIllustration(theme) !== null
}
