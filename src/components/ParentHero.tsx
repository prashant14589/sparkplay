'use client'

import Link from 'next/link'

const PILLARS = [
  { emoji: '🧩', text: 'Games built around your child\'s name' },
  { emoji: '🧡', text: 'Childhood memories your parents lived too' },
  { emoji: '✨', text: 'No ads. No hyperstimulation. No guilt.' },
]

export default function ParentHero() {
  return (
    <div
      data-testid="parent-hero"
      className="rounded-3xl bg-white/50 backdrop-blur-sm border border-white/70 shadow-lg px-5 pt-6 pb-5 mb-5"
    >
      {/* Eyebrow */}
      <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-2">
        For parents who want more than screen time
      </p>

      {/* Headline — the one sentence that earns the scroll */}
      <h1
        data-testid="parent-hero-headline"
        className="font-black text-gray-900 text-xl leading-tight mb-2"
      >
        Give your child games<br />
        built from your own childhood.
      </h1>

      {/* Sub-line — the emotional hook */}
      <p
        data-testid="parent-hero-sub"
        className="text-sm text-gray-500 font-semibold leading-relaxed mb-4"
      >
        SparkPlay turns your memories — first rain, kite festivals, market days —
        into personalised adventures your child plays by name.
      </p>

      {/* Three pillars — scannable, honest */}
      <div className="space-y-2 mb-5">
        {PILLARS.map(({ emoji, text }) => (
          <div key={text} className="flex items-center gap-2.5">
            <span className="text-base w-6 text-center flex-shrink-0">{emoji}</span>
            <span className="text-xs font-semibold text-gray-600">{text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/signup"
        className="block w-full text-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 py-3.5 text-white font-black text-sm shadow-lg shadow-violet-100 hover:opacity-90 transition-opacity"
      >
        Start free — takes 30 seconds
      </Link>

      <p className="text-center text-[10px] text-gray-300 font-semibold mt-2">
        No credit card · No ads · Made with love
      </p>
    </div>
  )
}
