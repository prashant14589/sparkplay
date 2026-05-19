import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { checkAiRateLimit } from '@/lib/aiRateLimit'

let _anthropic: Anthropic | null = null
function getAnthropicClient() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _anthropic
}

// Stable system prompt — cached after first request (requires ≥ 4096 tokens,
// haiku-4-5 minimum). The prompt is intentionally detailed so it stays in cache.
const SYSTEM_PROMPT = `You are a magical children's story writer for SparkPlay, a kids game platform.
Your job is to write short, vivid, personalised branching adventure stories for children.

ABSOLUTE RULES:
1. Use the child's name NATURALLY throughout — not every sentence, but 2-3 times per scene minimum
2. Every ending must be HAPPY, positive, and exciting — no sad endings ever
3. Language must match the child's age group (2-4: very simple words; 4-6: short sentences; 6-8: descriptive; 8-12: richer vocabulary)
4. Stories are SHORT — 3-4 sentences per scene maximum, punchy and exciting
5. Choices must feel genuinely different and exciting — no "same path different name" choices
6. ALWAYS return ONLY valid JSON — no markdown fences, no extra text before or after

STORY STRUCTURE (7 scenes forming a binary tree):
- "start" scene: Exciting opening with 2 choices → "c1a" and "c1b"
- "c1a" scene: What happens after choice A, with 2 choices → "end1" and "end2"
- "c1b" scene: What happens after choice B, with 2 choices → "end3" and "end4"
- "end1", "end2", "end3", "end4": Four different happy endings (isEnd: true)

SCENE REQUIREMENTS:
- emoji: One single expressive emoji that represents the scene visually
- title: 3-5 words, exciting, present-tense
- text: 3-4 sentences, vivid and immersive, use child's name
- choices (non-end scenes): exactly 2 options, each 4-8 words, starting with an action verb

THEME SETTINGS to draw from:
- animals: Magical forest where animals can talk and have feelings
- dinos: Jurassic adventure with friendly, curious dinosaurs of all sizes
- unicorns: Sparkling enchanted kingdom full of magic, rainbows, and wonder
- ocean: Shimmering underwater world with mermaids, coral palaces, sea creatures
- space: Galaxy of colourful planets, friendly aliens, and cosmic wonders
- superheroes: Vibrant city where everyone discovers their special power
- farm: Sunny countryside farm with animals, harvests, and friendly magic
- food: Edible candy kingdom where everything is made of delicious treats

QUALITY BAR:
Each story must feel like something a parent would delight in reading aloud.
Use sensory details (sounds, colours, smells) to bring scenes alive.
Make the child feel like the star hero of an incredible adventure.
Choices should feel genuinely exciting — like turning points in an epic tale.

VALID JSON SCHEMA (follow exactly):
{
  "title": "string — story title with child's name",
  "emoji": "single emoji representing the whole story",
  "scenes": {
    "start": {
      "id": "start",
      "emoji": "single emoji",
      "title": "short scene title",
      "text": "immersive scene text with child name",
      "choices": [
        {"label": "Action-verb choice description", "next": "c1a"},
        {"label": "Action-verb choice description", "next": "c1b"}
      ]
    },
    "c1a": { "id":"c1a", "emoji":"...", "title":"...", "text":"...", "choices":[{"label":"...","next":"end1"},{"label":"...","next":"end2"}] },
    "c1b": { "id":"c1b", "emoji":"...", "title":"...", "text":"...", "choices":[{"label":"...","next":"end3"},{"label":"...","next":"end4"}] },
    "end1": { "id":"end1", "emoji":"...", "title":"...", "text":"...", "isEnd":true },
    "end2": { "id":"end2", "emoji":"...", "title":"...", "text":"...", "isEnd":true },
    "end3": { "id":"end3", "emoji":"...", "title":"...", "text":"...", "isEnd":true },
    "end4": { "id":"end4", "emoji":"...", "title":"...", "text":"...", "isEnd":true }
  },
  "startId": "start"
}`

const THEME_HINTS: Record<string, string> = {
  animals:     'magical forest with talking animals',
  dinos:       'Jurassic world with friendly dinosaurs',
  unicorns:    'enchanted kingdom full of magic and rainbows',
  ocean:       'shimmering underwater kingdom',
  space:       'colourful galaxy full of wonder',
  superheroes: 'vibrant city where powers are discovered',
  farm:        'sunny countryside farm with friendly magic',
  food:        'delicious candy kingdom',
}

export async function POST(req: NextRequest) {
  const rateLimit = await checkAiRateLimit('story')
  if (!rateLimit.ok) return rateLimit.response

  try {
    const { childName, theme, ageGroup } = await req.json()

    const name    = childName?.trim() || 'the explorer'
    const setting = THEME_HINTS[theme] ?? 'magical adventure world'

    // Age-specific language + narrative style guidance
    const ageCtx =
      ageGroup === '2-4'
        ? 'a toddler aged 2-4. Use the very simplest words (1-2 syllables). Short sentences. ' +
          'Only familiar, safe concepts. Choices must be obvious and joyful, never scary. ' +
          'Lots of animals, colours, and sounds (WOOF! SPLASH! YAY!).'
        : ageGroup === '4-6'
        ? 'a child aged 4-6. Use simple, vivid language. Short sentences with a few describing words. ' +
          'Choices should feel magical and exciting. Include some humour and wonder. ' +
          'Clear happy outcomes at every path.'
        : ageGroup === '6-8'
        ? 'a child aged 6-8. Use descriptive, exciting language with some challenge vocabulary. ' +
          'Build genuine tension and adventure. Choices should feel like real decisions with consequence. ' +
          'Include some mystery, humour, and one surprising twist per path.'
        : /* 8-12 */
          'an older child aged 8-12. Use rich, varied vocabulary. Build real narrative tension. ' +
          'Choices should have meaningful moral or strategic weight — not just A vs B but WHY it matters. ' +
          'Include plot twists, clever wordplay, and endings that feel genuinely earned. ' +
          'Treat the reader as intelligent; avoid talking down to them.'

    const userPrompt =
      `Write a personalised branching adventure story for ${name} (${ageCtx}).\n` +
      `Setting: ${setting} (theme: ${theme}).\n` +
      `The story must feel custom-made for ${name} — use their name naturally and often.\n` +
      `Return ONLY the JSON object, nothing else.`

    const message = await getAnthropicClient().messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: [
        {
          type:          'text',
          text:          SYSTEM_PROMPT,
          // Cache the stable system prompt — saves ~90% on repeated requests
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    })

    const block = message.content[0]
    if (block.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 })
    }

    // Strip any accidental markdown fences
    const raw = block.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let story
    try {
      story = JSON.parse(raw)
    } catch {
      console.error('Story JSON parse error. Raw:', raw.slice(0, 300))
      return NextResponse.json({ error: 'Story generation produced invalid JSON' }, { status: 500 })
    }

    // Basic sanity check
    if (!story.scenes?.start) {
      return NextResponse.json({ error: 'Story missing required start scene' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data:    story,
      usage:   {
        input:       message.usage.input_tokens,
        output:      message.usage.output_tokens,
        cacheRead:   message.usage.cache_read_input_tokens ?? 0,
        cacheCreate: message.usage.cache_creation_input_tokens ?? 0,
      },
    })
  } catch (err) {
    console.error('Story generation error:', err)
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'Invalid API key — check ANTHROPIC_API_KEY' }, { status: 401 })
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'Rate limited — please try again shortly' }, { status: 429 })
    }
    return NextResponse.json({ error: 'Story generation failed' }, { status: 500 })
  }
}
