// Universal childhood memory themes — the worlds our parents played in.
// Every culture has these. We just need to remind people.

export interface MemoryPrompt {
  title: string        // The question that unlocks the memory
  prompt: string       // What to tell your child
  cue: string          // Cross-cultural names — shows this is everyone's memory
  parentNote: string   // The one thing that makes a parent pause
}

export const MEMORY_PROMPTS: Record<string, MemoryPrompt> = {
  monsoon: {
    title: 'Do you remember your first rain?',
    prompt: 'Tell your child about the best rain you ever got caught in — the smell, the sound, the puddles.',
    cue: '🌧️  Barish · Rain · Umuua · Pluie · Lluvia',
    parentNote: 'The smell of first rain on dry earth is the same everywhere. Petrichor — there is even a word for it.',
  },
  gully_cricket: {
    title: 'Remember playing in the street?',
    prompt: 'Tell your child about your best street game — who played, what you used for a bat, who always won.',
    cue: '🏏  Gully Cricket · Street Football · Stickball · Kickball · Gilli-Danda',
    parentNote: 'Every child in every country turned a road into a pitch. The rules were always made up on the spot.',
  },
  old_tree: {
    title: 'Was there a tree that was yours?',
    prompt: 'Tell your child about the tree you climbed, hid behind, built in, or slept under.',
    cue: '🌳  Aam ka Ped · Oak Tree · Baobab · Ceiba · Sakura',
    parentNote: 'Every childhood has one tree. A landmark that somehow meant safety.',
  },
  fishing_dawn: {
    title: 'Did someone take you fishing?',
    prompt: 'Tell your child about an early morning with a grandparent or parent — the quiet, the water, the waiting.',
    cue: '🎣  Talab · Pond · Étang · Estanque · Ziwa',
    parentNote: 'It was never about the fish. It was always about the silence you shared.',
  },
  kite_sky: {
    title: 'Did you ever fly a kite?',
    prompt: 'Tell your child about a kite you flew — where, with whom, whether it came down whole or in pieces.',
    cue: '🪁  Patang · Kite · Cerf-volant · Cometa · Ndege',
    parentNote: 'The string cutting into your fingers was proof you were holding something that wanted to be free.',
  },
  market_day: {
    title: 'Do you remember the market?',
    prompt: 'Tell your child about going to the market — the colours, the smells, riding on shoulders, what you were allowed to pick.',
    cue: '🛒  Sabzi Mandi · Bazaar · Marché · Mercado · Soko',
    parentNote: 'Markets are where children learn that food grows from earth, not factories.',
  },
  first_bicycle: {
    title: 'Do you remember learning to ride?',
    prompt: 'Tell your child exactly what it felt like — the wobble, who was holding the seat, the moment they let go.',
    cue: '🚲  Cycle · Bicycle · Vélo · Bicicleta · Baiskeli',
    parentNote: 'The hand letting go is one of the most honest metaphors for growing up.',
  },
  night_sky: {
    title: 'When did you last really see the stars?',
    prompt: 'Tell your child about lying outside at night — on a roof, in a field, on a charpai — and counting stars with someone you loved.',
    cue: '⭐  Tare · Stars · Étoiles · Estrellas · Nyota',
    parentNote: 'Before screens, the night sky was the first story anyone ever told. It still is.',
  },
}

export const MEMORY_THEME_IDS = new Set(Object.keys(MEMORY_PROMPTS))

export function isMemoryTheme(themeId: string): boolean {
  return MEMORY_THEME_IDS.has(themeId)
}
