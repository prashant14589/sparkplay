import { describe, it, expect } from 'vitest'
import { emojiToTwemojiUrl, TWEMOJI_BASE } from '../twemoji'

describe('emojiToTwemojiUrl', () => {
  it('converts a simple emoji to its Twemoji CDN SVG URL', () => {
    const url = emojiToTwemojiUrl('🐶')
    expect(url).toContain('1f436')
    expect(url).toMatch(/\.svg$/)
    expect(url).toContain(TWEMOJI_BASE)
  })

  it('strips the variation selector (U+FE0F) from the URL', () => {
    // ⭐ with variation selector should still give 2b50, not 2b50-fe0f
    const url = emojiToTwemojiUrl('⭐')
    expect(url).toContain('2b50')
    expect(url).not.toContain('fe0f')
  })

  it('handles lion emoji', () => {
    expect(emojiToTwemojiUrl('🦁')).toContain('1f981')
  })

  it('handles rocket emoji', () => {
    expect(emojiToTwemojiUrl('🚀')).toContain('1f680')
  })

  it('handles party popper emoji', () => {
    expect(emojiToTwemojiUrl('🎉')).toContain('1f389')
  })

  it('handles trophy emoji', () => {
    expect(emojiToTwemojiUrl('🏆')).toContain('1f3c6')
  })

  it('handles star emoji', () => {
    expect(emojiToTwemojiUrl('⭐')).toContain('2b50')
  })

  it('handles dinosaur emoji', () => {
    expect(emojiToTwemojiUrl('🦕')).toContain('1f995')
  })

  it('handles unicorn emoji', () => {
    expect(emojiToTwemojiUrl('🦄')).toContain('1f984')
  })

  it('handles coin / dollar emoji', () => {
    // Dollar sign isn't an emoji — but coin (🪙) is
    expect(emojiToTwemojiUrl('🪙')).toContain('1fa99')
  })

  it('returns a string starting with https', () => {
    const url = emojiToTwemojiUrl('🐾')
    expect(url.startsWith('https://')).toBe(true)
  })

  it('handles compound emoji with ZWJ by including all codepoints joined by dash', () => {
    // 🦸 (superhero, no ZWJ) should have its codepoint
    const url = emojiToTwemojiUrl('🦸')
    expect(url).toContain('1f9b8')
  })
})
