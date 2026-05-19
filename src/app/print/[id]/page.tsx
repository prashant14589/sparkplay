import { createClient } from '@/lib/supabase/server'
import PrintButton from './PrintButton'
import { getThemeById } from '@/lib/themes'
import { getStoryById, interpolate } from '@/lib/stories'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Print — SparkPlay' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function PrintPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: game } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!game) notFound()

  const content = game.content as Record<string, string>
  const theme = getThemeById(content?.theme ?? 'animals')
  const childName = content?.childName?.trim() || ''
  const ageGroup = content?.ageGroup ?? '4-6'
  const templateType: string = game.template_type

  const displayName = childName || 'Your child'

  return (
    <>
      {/*
        Inline styles for print page.
        NOTE: <html>/<head>/<body> are intentionally omitted — the root layout
        provides them. Placing them here caused nested <html> which breaks hydration.
        Browsers accept <style> anywhere in the DOM; @media print rules still apply.
      */}
      <style>{`
        .print-page { max-width: 680px; margin: 0 auto; padding: 32px 24px; font-family: system-ui, -apple-system, sans-serif; color: #111; }
        .print-page .header { text-align: center; margin-bottom: 32px; border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; }
        .print-page .logo { font-size: 14px; color: #6d28d9; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px; }
        .print-page h1 { font-size: 28px; font-weight: 800; color: #111; margin-bottom: 8px; }
        .print-page .subtitle { font-size: 15px; color: #6b7280; }
        .print-page .meta { display: flex; gap: 16px; justify-content: center; margin-top: 12px; flex-wrap: wrap; }
        .print-page .tag { background: #f3f4f6; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; color: #374151; }
        .print-page .card-grid { display: grid; gap: 10px; margin: 24px auto; justify-content: center; }
        .print-page .card { border: 2px solid #d1d5db; border-radius: 12px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 36px; background: #f9fafb; }
        .print-page .card-blank { border: 2px dashed #d1d5db; border-radius: 12px; aspect-ratio: 1; background: white; }
        .print-page .story-scene { border: 2px solid #e5e7eb; border-radius: 16px; padding: 20px; margin-bottom: 16px; }
        .print-page .scene-emoji { font-size: 48px; text-align: center; margin-bottom: 12px; }
        .print-page .scene-title { font-size: 18px; font-weight: 700; color: #111; margin-bottom: 8px; }
        .print-page .scene-text { font-size: 15px; color: #374151; line-height: 1.6; margin-bottom: 12px; }
        .print-page .choices { margin-top: 12px; }
        .print-page .choice { border: 2px solid #8b5cf6; border-radius: 10px; padding: 10px 16px; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #6d28d9; display: flex; align-items: center; gap: 8px; }
        .print-page .puzzle-grid { gap: 6px; margin: 24px auto; border: 4px solid #d1d5db; border-radius: 12px; padding: 8px; display: inline-grid; }
        .print-page .tile { border: 2px solid #d1d5db; border-radius: 8px; width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; font-size: 32px; background: #f9fafb; }
        .print-page .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        .print-page .instructions { background: #f3f4f6; border-radius: 12px; padding: 16px; margin: 16px 0; }
        .print-page .instructions h3 { font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 8px; }
        .print-page .instructions p { font-size: 13px; color: #6b7280; line-height: 1.6; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          /* Hide root layout chrome (cookie banner, analytics, nav) */
          .fixed, nav, [data-analytics] { display: none !important; }
          .no-print { display: none !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>
      <div className="print-page">
          {/* Top bar — hidden when printing */}
          <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <a
              href={`/builder/${id}`}
              style={{
                color: '#6d28d9', fontWeight: 700, fontSize: 14,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              ← Back to editor
            </a>
            <PrintButton />
          </div>

          <div className="header">
            <div className="logo">🎮 SparkPlay</div>
            <h1>{theme.emoji} {game.title}</h1>
            <p className="subtitle">
              {childName ? `Made with love for ${childName}` : 'A personalised kids game'}
            </p>
            <div className="meta">
              <span className="tag">{templateLabel(templateType)}</span>
              <span className="tag">Age {ageGroup}</span>
              <span className="tag">{theme.name} theme</span>
            </div>
          </div>

          {/* ── Memory Match: print all cards ── */}
          {templateType === 'memory' && (
            <MemoryPrint theme={theme} childName={childName} />
          )}

          {/* ── Maze: print instructions + blank grid ── */}
          {templateType === 'maze' && (
            <MazePrint ageGroup={ageGroup} theme={theme} childName={childName} />
          )}

          {/* ── Sliding Puzzle ── */}
          {templateType === 'puzzle' && (
            <PuzzlePrint theme={theme} ageGroup={ageGroup} childName={childName} />
          )}

          {/* ── Story Quest: print the whole story ── */}
          {templateType === 'story' && (
            <StoryPrint childName={childName} />
          )}

          {/* ── Other templates ── */}
          {!['memory', 'maze', 'puzzle', 'story'].includes(templateType) && (
            <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
              <p style={{ fontSize: 48 }}>{templateEmoji(templateType)}</p>
              <p style={{ marginTop: 16, fontSize: 16, fontWeight: 600 }}>
                {game.title}
              </p>
              <p style={{ marginTop: 8, fontSize: 14 }}>
                Play this game interactively at sparkplay-nu.vercel.app
              </p>
            </div>
          )}

          <div className="footer">
            <p>Created with SparkPlay · sparkplay-nu.vercel.app</p>
            <p style={{ marginTop: 4 }}>Print this page and have fun! ✂️</p>
          </div>
        </div>
    </>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function MemoryPrint({ theme, childName }: { theme: ReturnType<typeof getThemeById>; childName: string }) {
  const cards = theme.cards.slice(0, 12) // up to 12 pairs = 24 cards
  const allCards = [...cards, ...cards].sort(() => Math.random() - 0.5)
  const cols = 6

  return (
    <div>
      <div className="instructions">
        <h3>✂️ How to play</h3>
        <p>
          Print this page, cut out the cards below, and place them face-down.
          {childName ? ` ${childName} takes` : ' Take'} turns flipping two at a time — find matching pairs to win!
        </p>
      </div>
      <div
        className="card-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 72px)` }}
      >
        {allCards.map((emoji, i) => (
          <div key={i} className="card" style={{ width: 72, height: 72 }}>{emoji}</div>
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
        Cut along the borders · Shuffle before playing
      </p>
      <div style={{ marginTop: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#374151' }}>Answer key — {cards.length} matching pairs:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {cards.map((e, i) => (
            <span key={i} style={{ fontSize: 24, background: '#f3f4f6', borderRadius: 8, padding: '4px 8px' }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MazePrint({ ageGroup, theme, childName }: { ageGroup: string; theme: ReturnType<typeof getThemeById>; childName: string }) {
  const sizes: Record<string, number> = { '2-4': 5, '4-6': 7, '6-8': 9, '8-12': 11 }
  const size = sizes[ageGroup] ?? 7
  const cellPx = Math.min(48, Math.floor(440 / size))

  return (
    <div>
      <div className="instructions">
        <h3>🌀 How to play</h3>
        <p>
          {childName ? `${childName} starts` : 'Start'} at {theme.cards[0]} in the top-left corner
          and finds the path to 🏆 in the bottom-right corner.
          Use a pencil to trace the route!
        </p>
      </div>
      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <div
          style={{
            display: 'inline-grid',
            gridTemplateColumns: `repeat(${size}, ${cellPx}px)`,
            gridTemplateRows: `repeat(${size}, ${cellPx}px)`,
            border: '3px solid #374151',
            borderRadius: 8,
          }}
        >
          {Array.from({ length: size * size }).map((_, i) => {
            const r = Math.floor(i / size)
            const c = i % size
            const isStart = r === 0 && c === 0
            const isEnd = r === size - 1 && c === size - 1
            return (
              <div
                key={i}
                style={{
                  width: cellPx,
                  height: cellPx,
                  background: isStart ? '#ede9fe' : isEnd ? '#fef9c3' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: cellPx * 0.5,
                  border: '1px solid #e5e7eb',
                }}
              >
                {isStart ? theme.cards[0] : isEnd ? '🏆' : ''}
              </div>
            )
          })}
        </div>
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
          {theme.cards[0]} start → 🏆 end · {size}×{size} grid
        </p>
        <p style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>
          (This is a blank grid — trace a path with a pencil or finger)
        </p>
      </div>
    </div>
  )
}

function PuzzlePrint({ theme, ageGroup, childName }: { theme: ReturnType<typeof getThemeById>; ageGroup: string; childName: string }) {
  const sizes: Record<string, number> = { '2-4': 3, '4-6': 3, '6-8': 4, '8-12': 4 }
  const size = sizes[ageGroup] ?? 3
  const emojis = theme.cards.slice(0, size * size - 1)

  return (
    <div>
      <div className="instructions">
        <h3>🧩 How to play</h3>
        <p>
          Cut out the tiles below, shuffle them, and {childName ? `${childName} arranges` : 'arrange'} them
          back into the correct order shown in the goal box!
        </p>
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12, marginTop: 16 }}>
        Goal order:
      </p>
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${size}, 72px)`,
          gap: 6,
          marginBottom: 24,
          border: '3px solid #6d28d9',
          borderRadius: 12,
          padding: 8,
        }}
      >
        {emojis.map((e, i) => (
          <div key={i} className="tile">{e}</div>
        ))}
        <div className="tile" style={{ background: '#e5e7eb' }}>□</div>
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>
        Shuffled tiles (cut these out):
      </p>
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${size}, 72px)`,
          gap: 6,
          border: '2px dashed #d1d5db',
          borderRadius: 12,
          padding: 8,
        }}
      >
        {[...emojis].sort(() => Math.random() - 0.5).map((e, i) => (
          <div key={i} className="tile">{e}</div>
        ))}
        <div className="tile" style={{ background: '#f3f4f6' }}>empty</div>
      </div>
    </div>
  )
}

function StoryPrint({ childName }: { childName: string }) {
  const story = getStoryById('space') // default to space; real story is in content.storyId if set
  const scenesInOrder = ['s1', 's2a', 's2b', 'e1', 'e2', 'e3', 'e4']

  return (
    <div>
      <div className="instructions">
        <h3>📖 How to read</h3>
        <p>
          Read aloud together! At each choice, {childName ? `${childName}` : 'your child'} picks what happens next.
          Every path leads to a happy ending!
        </p>
      </div>
      {scenesInOrder.map((sid) => {
        const scene = story.scenes[sid]
        if (!scene) return null
        return (
          <div key={sid} className="story-scene">
            <div className="scene-emoji">{scene.emoji}</div>
            <div className="scene-title">{interpolate(scene.title, childName)}</div>
            <div className="scene-text">{interpolate(scene.text, childName)}</div>
            {scene.choices && (
              <div className="choices">
                {scene.choices.map((c) => (
                  <div key={c.next} className="choice">
                    <span>👉</span> {c.label}
                  </div>
                ))}
              </div>
            )}
            {scene.isEnd && (
              <div style={{ textAlign: 'center', marginTop: 12, fontWeight: 700, color: '#6d28d9' }}>
                ✨ THE END ✨
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function templateLabel(type: string) {
  const map: Record<string, string> = {
    memory: 'Memory Match', quiz: 'Quiz', word_search: 'Word Search',
    coloring: 'Coloring', maze: 'Maze', puzzle: 'Sliding Puzzle', story: 'Story Quest',
  }
  return map[type] ?? type
}

function templateEmoji(type: string) {
  const map: Record<string, string> = {
    memory: '🃏', quiz: '❓', word_search: '🔤', coloring: '🎨', maze: '🌀', puzzle: '🧩', story: '📖',
  }
  return map[type] ?? '🎮'
}
