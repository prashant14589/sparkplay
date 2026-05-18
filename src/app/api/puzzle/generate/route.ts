import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { generatePuzzlePrompt } from '@/lib/puzzleGame'
import { checkAiRateLimit } from '@/lib/aiRateLimit'

export async function POST(req: NextRequest) {
  const rateLimit = await checkAiRateLimit('puzzle')
  if (!rateLimit.ok) return rateLimit.response

  const { childName, scenarioLabel } = await req.json()

  if (!scenarioLabel) {
    return NextResponse.json({ error: 'scenarioLabel is required' }, { status: 400 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 })
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  try {
    const prompt = generatePuzzlePrompt(childName, scenarioLabel)

    const response = await openai.images.generate({
      model:   'gpt-image-1',
      prompt,
      size:    '1536x1024',  // landscape — best for a puzzle
      quality: 'medium',
      n:       1,
    })

    const imgResponse = response as { data?: Array<{ b64_json?: string; url?: string }> }
    const b64 = imgResponse.data?.[0]?.b64_json

    if (!b64) {
      return NextResponse.json({ error: 'No image data returned' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      imageDataUrl: `data:image/png;base64,${b64}`,
    })
  } catch (err) {
    console.error('Puzzle generation error:', err)
    if (err instanceof OpenAI.RateLimitError) {
      return NextResponse.json({ error: 'Rate limited — try again in a moment' }, { status: 429 })
    }
    if (err instanceof OpenAI.AuthenticationError) {
      return NextResponse.json({ error: 'Invalid OPENAI_API_KEY' }, { status: 401 })
    }
    return NextResponse.json({ error: (err as Error).message ?? 'Generation failed' }, { status: 500 })
  }
}
