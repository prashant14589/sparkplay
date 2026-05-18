'use client'

import { useState } from 'react'
import { emojiToTwemojiUrl } from '@/lib/twemoji'

interface Props {
  emoji: string
  size?: number
  className?: string
  /** If true, show a skeleton placeholder while the SVG loads */
  skeleton?: boolean
}

/**
 * Renders any emoji as a crisp Twemoji SVG illustration.
 *
 * Why: raw Unicode emoji rely on the OS font — tiny, pixelated, and
 * inconsistent across devices. Twemoji renders them as 72×72 (or larger)
 * illustrated SVGs, matching the mockup's "illustrated character" look.
 *
 * Falls back to the raw emoji character if the CDN image fails to load.
 */
export default function GameEmoji({ emoji, size = 48, className = '', skeleton = false }: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const url = emojiToTwemojiUrl(emoji)

  if (failed) {
    // Graceful fallback — render the system-font glyph
    return (
      <span
        className={className}
        style={{ fontSize: size * 0.85, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        role="img"
        aria-label={emoji}
      >
        {emoji}
      </span>
    )
  }

  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size, flexShrink: 0 }}>
      {/* Skeleton shimmer while loading */}
      {skeleton && !loaded && (
        <span className="absolute inset-0 rounded-full bg-gray-100 animate-pulse" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={emoji}
        width={size}
        height={size}
        draggable={false}
        className={className}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{
          imageRendering: 'crisp-edges',
          opacity: loaded ? 1 : (skeleton ? 0 : 1),
          transition: 'opacity 0.15s',
        }}
      />
    </span>
  )
}
