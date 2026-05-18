'use client'

import { useState } from 'react'
import GameEmoji from '@/components/GameEmoji'

interface Props {
  /** Absolute path from public/, e.g. "/illustrations/animals/hero.png".
   *  Pass null to render the fallback immediately. */
  src: string | null
  alt: string
  size: number
  className?: string
  /** Shown when src is null or the image fails to load. */
  fallbackEmoji?: string
  skeleton?: boolean
}

/**
 * Renders a commissioned illustration from public/illustrations/.
 * Falls back to <GameEmoji> if the file doesn't exist yet
 * (i.e. the generation script hasn't been run) or if loading fails.
 */
export default function IllustrationImage({
  src,
  alt,
  size,
  className = '',
  fallbackEmoji,
  skeleton = false,
}: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // No src or already failed → show fallback
  if (!src || failed) {
    if (!fallbackEmoji) return null
    return <GameEmoji emoji={fallbackEmoji} size={size} className={className} skeleton={skeleton} />
  }

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      {skeleton && !loaded && (
        <span className="absolute inset-0 rounded-2xl bg-gray-100 animate-pulse" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={className}
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{
          objectFit: 'contain',
          opacity: loaded ? 1 : (skeleton ? 0 : 1),
          transition: 'opacity 0.2s',
        }}
      />
    </span>
  )
}
