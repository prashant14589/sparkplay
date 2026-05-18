'use client'

interface Props {
  seed: string
  size?: number
  className?: string
  animated?: boolean
}

// DiceBear adventurer style — consistent character per child name seed
// Free, no API key, instant SVG, consistent across all devices
export default function DiceBearAvatar({ seed, size = 80, className = '', animated = false }: Props) {
  const safeSeed = encodeURIComponent(seed?.trim() || 'explorer')
  // Use a set of warm, friendly background colours
  const url = `https://api.dicebear.com/9.x/adventurer/svg?seed=${safeSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`${seed || 'explorer'}'s character`}
      width={size}
      height={size}
      className={`rounded-full ${animated ? 'animate-bounce' : ''} ${className}`}
      style={{ minWidth: size, minHeight: size }}
    />
  )
}
