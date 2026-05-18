/**
 * Twemoji utility — converts any emoji to a Twemoji CDN SVG URL.
 *
 * Twemoji is Twitter's open-source illustrated emoji library.
 * Rendering emoji as Twemoji SVGs gives us crisp, colourful,
 * platform-consistent illustrated characters instead of tiny
 * system-font glyphs.
 *
 * CDN: jsDelivr → GitHub twitter/twemoji v14.0.2 (stable, free, no API key)
 * URL pattern: {BASE}/{hex_codepoint}.svg
 *              {BASE}/{cp1}-{cp2}-...svg   (for multi-codepoint emoji)
 */

export const TWEMOJI_BASE =
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg'

/**
 * Convert an emoji character to its Twemoji CDN SVG URL.
 *
 * Algorithm:
 * 1. Spread the emoji string into individual Unicode code points
 * 2. Filter out the variation selector U+FE0F (twemoji filenames never include it)
 * 3. Convert each code point to lowercase hex
 * 4. Join with '-' for multi-codepoint sequences (flags, ZWJ sequences, etc.)
 * 5. Return the full CDN URL
 */
export function emojiToTwemojiUrl(emoji: string): string {
  const codepoints = [...emoji]
    .map((char) => char.codePointAt(0)!)
    .filter((cp) => cp !== 0xfe0f)   // strip variation selector-16
    .filter((cp) => cp !== undefined)
    .map((cp) => cp.toString(16))

  const filename = codepoints.join('-')
  return `${TWEMOJI_BASE}/${filename}.svg`
}

/**
 * Pre-compute Twemoji URLs for a list of emojis (useful for preloading).
 */
export function preloadTwemojiUrls(emojis: string[]): string[] {
  return [...new Set(emojis)].map(emojiToTwemojiUrl)
}
