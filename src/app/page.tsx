'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import MemoryMatch from '@/components/MemoryMatch'
import SignupModal from '@/components/SignupModal'
import { THEMES, AGE_GROUPS, getThemesForAge, type Theme, type AgeGroupId } from '@/lib/themes'
import { createClient } from '@/lib/supabase/client'
import { getProgress, setChildName as saveChildName, type Progress } from '@/lib/progress'
import { recordGameForQuest } from '@/lib/quests'
import { getActiveBuddy, calcXP, calcLevel, randomPhrase } from '@/lib/buddy'

const DEFAULT_AGE: AgeGroupId = '4-6'
const ILLUSTRATED = new Set(['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes'])

// Per-theme ambient particles and CSS gradient colors
const THEME_META: Record<string, { particles: string[]; bgFrom: string; bgTo: string }> = {
  animals:     { particles: ['🐾','🌿','🌸','🍃','🌺'], bgFrom: '#bbf7d0', bgTo: '#a7f3d0' },
  dinos:       { particles: ['🦕','⭐','🌿','🥚','🌟'], bgFrom: '#d9f99d', bgTo: '#bbf7d0' },
  unicorns:    { particles: ['✨','🌈','⭐','💫','🌸'], bgFrom: '#f5d0fe', bgTo: '#ddd6fe' },
  ocean:       { particles: ['🫧','⭐','🐚','💙','🌊'], bgFrom: '#bae6fd', bgTo: '#a5f3fc' },
  space:       { particles: ['⭐','🌟','💫','✨','🪐'], bgFrom: '#c7d2fe', bgTo: '#ddd6fe' },
  superheroes: { particles: ['⚡','💥','⭐','🌟','✨'], bgFrom: '#fef08a', bgTo: '#fed7aa' },
  farm:        { particles: ['🌻','🌾','🐝','🌸','☀️'], bgFrom: '#fef08a', bgTo: '#fde68a' },
  food:        { particles: ['🍭','✨','🍬','⭐','🌟'], bgFrom: '#fecaca', bgTo: '#fed7aa' },
}

// Static particle positions so server/client match
const PARTICLE_POSITIONS = [
  { top: '8%',  left: '5%',  delay: '0s',    dur: '5.1s', size: 'text-2xl' },
  { top: '15%', left: '88%', delay: '1.3s',  dur: '6.2s', size: 'text-xl'  },
  { top: '35%', left: '3%',  delay: '2.1s',  dur: '4.8s', size: 'text-lg'  },
  { top: '55%', left: '92%', delay: '0.7s',  dur: '5.5s', size: 'text-2xl' },
  { top: '72%', left: '8%',  delay: '3.2s',  dur: '6.0s', size: 'text-xl'  },
  { top: '82%', left: '85%', delay: '1.8s',  dur: '4.5s', size: 'text-lg'  },
  { top: '45%', left: '95%', delay: '4.0s',  dur: '5.8s', size: 'text-xl'  },
  { top: '25%', left: '2%',  delay: '2.7s',  dur: '5.3s', size: 'text-2xl' },
]

export default function HomePage() {
  const [ageGroup, setAgeGroup]         = useState<AgeGroupId>(DEFAULT_AGE)
  const [availableThemes, setAvailable] = useState<Theme[]>(getThemesForAge(DEFAULT_AGE))
  const [activeTheme, setActiveTheme]   = useState<Theme>(getThemesForAge(DEFAULT_AGE)[0])
  const [showModal, setShowModal]       = useState(false)
  const [completedMoves, setMoves]      = useState(0)
  const [gameKey, setGameKey]           = useState(0)
  const [isAuth, setIsAuth]             = useState(false)
  const [childName, setChildName]       = useState('')
  const [nameInput, setNameInput]       = useState('')
  const [progress, setProgress]         = useState<Progress | null>(null)
  const [buddyEmoji, setBuddyEmoji]     = useState('🦕')
  const [buddyPhrase, setBuddyPhrase]   = useState('Ready to play!')
  const [showNameInput, setShowNameInput] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const p = getProgress()
    setProgress(p)
    if (p.childName) { setChildName(p.childName); setNameInput(p.childName) }

    const xp = calcXP(p.totalStars, p.totalCoins)
    const buddy = getActiveBuddy(calcLevel(xp))
    setBuddyEmoji(buddy.emoji)
    setBuddyPhrase(randomPhrase(buddy, 'idle'))

    // Pre-select theme from adventure picker link e.g. /?theme=dinos
    const themeParam = new URLSearchParams(window.location.search).get('theme')
    if (themeParam) {
      const found = getThemesForAge(ageGroup).find(t => t.id === themeParam)
      if (found) { setActiveTheme(found); setGameKey(k => k + 1) }
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setIsAuth(!!user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setIsAuth(!!s?.user))
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function applyName() {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    setChildName(trimmed)
    saveChildName(trimmed)
    setProgress(getProgress())
    setGameKey(k => k + 1)
    setShowNameInput(false)
  }

  function selectAge(age: AgeGroupId) {
    const themes = getThemesForAge(age)
    setAgeGroup(age)
    setAvailable(themes)
    setActiveTheme(themes[0])
    setGameKey(k => k + 1)
    setShowModal(false)
  }

  function switchTheme(t: Theme) {
    setActiveTheme(t)
    setGameKey(k => k + 1)
    setShowModal(false)
  }

  const handleLevelComplete = useCallback((level: number, moves: number) => {
    setMoves(moves)
    setProgress(getProgress())
    recordGameForQuest('memory')
    if (level === 1 && !isAuth) setShowModal(true)
  }, [isAuth])

  const meta = THEME_META[activeTheme.id] ?? THEME_META.animals
  const displayName = childName?.trim()
  const earnedBadges = progress?.badges.filter(b => b.earned) ?? []

  return (
    <div
      className="min-h-screen pb-24 transition-colors duration-700 relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${meta.bgFrom} 0%, ${meta.bgTo} 60%, #ffffff 100%)` }}
    >
      {/* ── Ambient floating particles ── */}
      {PARTICLE_POSITIONS.map((p, i) => (
        <span
          key={i}
          className={`pointer-events-none select-none absolute ${p.size}`}
          style={{
            top: p.top, left: p.left,
            animation: `particleDrift ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        >
          {meta.particles[i % meta.particles.length]}
        </span>
      ))}

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-4 py-3.5 max-w-md mx-auto relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-black">✦</span>
          </div>
          <span className="text-lg font-black text-gray-900">SparkPlay</span>
        </Link>
        <div className="flex items-center gap-2">
          {isAuth ? (
            <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-white/50 rounded-full px-3 py-1 shadow-sm">
              <span className="text-sm">🪙</span>
              <span className="font-black text-amber-700 text-sm">{progress?.totalCoins ?? 0}</span>
              <span className="text-sm ml-1">⭐</span>
              <span className="font-black text-amber-700 text-sm">{progress?.totalStars ?? 0}</span>
            </div>
          ) : (
            <Link href="/signup"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-2 text-sm text-white font-black shadow-md shadow-violet-200 hover:opacity-90">
              Get started free
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 relative z-10">

        {/* ── EMOTIONAL FIRST: Buddy greeting ── */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-lg p-5 mb-5">
          <div className="flex items-center gap-4">
            {/* Buddy */}
            <div className="text-5xl animate-bounce flex-shrink-0 select-none">{buddyEmoji}</div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-gray-900 leading-tight">
                {displayName ? `Hi ${displayName}! 👋` : 'Hi there! 👋'}
              </h1>
              {/* Speech bubble */}
              <div className="mt-1.5 bg-violet-50 border border-violet-100 rounded-2xl rounded-tl-sm px-3 py-1.5 inline-block">
                <p className="text-sm font-bold text-violet-700">{buddyPhrase}</p>
              </div>
            </div>
          </div>

          {/* Name input — friendly framing */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            {displayName && !showNameInput ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-semibold">
                  🎮 Playing as <span className="font-black text-violet-600">{displayName}</span>
                </span>
                <button
                  onClick={() => { setShowNameInput(true); setTimeout(() => nameRef.current?.focus(), 50) }}
                  className="text-xs text-gray-400 hover:text-violet-500 font-bold"
                >
                  Change
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs font-black text-gray-400 mb-2">Who&apos;s playing today?</p>
                <div className="flex gap-2">
                  <input
                    ref={nameRef}
                    type="text"
                    placeholder="Enter child's name…"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyName()}
                    maxLength={30}
                    className="flex-1 rounded-2xl border-2 border-violet-200 bg-white px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400 min-h-[44px] placeholder:font-normal placeholder:text-gray-300"
                  />
                  <button
                    onClick={applyName}
                    className="rounded-2xl bg-violet-600 px-4 py-2.5 text-sm text-white font-black hover:bg-violet-700 min-h-[44px] shadow-md shadow-violet-200"
                  >
                    Let&apos;s go!
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Age tabs ── */}
        <div className="flex gap-2 mb-4">
          {AGE_GROUPS.map(ag => (
            <button
              key={ag.id}
              onClick={() => selectAge(ag.id)}
              className={[
                'flex flex-col items-center py-2.5 px-1 rounded-2xl border-2 transition-all text-center flex-1 font-bold min-h-[52px]',
                ageGroup === ag.id
                  ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200'
                  : 'bg-white/70 backdrop-blur-sm border-white/60 text-gray-500 hover:border-violet-300',
              ].join(' ')}
            >
              <span className="text-lg mb-0.5 leading-none">{ag.emoji}</span>
              <span className="text-[10px] font-black leading-none">{ag.label}</span>
            </button>
          ))}
        </div>

        {/* ── Theme strip — illustrated adventure cards ── */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 mb-5 scrollbar-hide snap-x snap-mandatory">
          {availableThemes.map(t => {
            const isActive = activeTheme.id === t.id
            return (
              <button
                key={t.id}
                onClick={() => switchTheme(t)}
                className={[
                  'relative flex-shrink-0 rounded-2xl overflow-hidden snap-start transition-all',
                  'w-[88px] h-[72px]',
                  isActive
                    ? 'ring-3 ring-violet-500 ring-offset-2 scale-105 shadow-xl'
                    : 'opacity-80 hover:opacity-100 hover:scale-102 shadow-md',
                ].join(' ')}
                style={{ outline: isActive ? '3px solid #7c3aed' : 'none', outlineOffset: 3 }}
              >
                {ILLUSTRATED.has(t.id) ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/illustrations/${t.id}/hero.png`}
                      alt={t.name}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.color}`}>
                    <span className="absolute bottom-1 right-1 text-3xl leading-none drop-shadow">{t.emoji}</span>
                  </div>
                )}
                <span className="absolute bottom-1.5 left-2 text-[10px] font-black text-white drop-shadow leading-tight">
                  {t.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Game card ── */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-white/50 mb-6">
          {/* Themed header with hero image */}
          <div className={`bg-gradient-to-r ${activeTheme.color} px-5 py-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                {ILLUSTRATED.has(activeTheme.id) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/illustrations/${activeTheme.id}/hero.png`}
                    alt={activeTheme.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-xl">
                    {activeTheme.emoji}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-black text-white text-base leading-tight">Memory Match</h2>
                <p className="text-white/70 text-xs font-bold">
                  {activeTheme.name} · Age {ageGroup}
                  {displayName ? ` · ${displayName}` : ''}
                </p>
              </div>
            </div>
            {!isAuth && (
              <Link href="/signup"
                className="text-xs text-white font-black bg-white/20 hover:bg-white/30 rounded-full px-3 py-1.5 transition-colors">
                Unlock all →
              </Link>
            )}
          </div>

          <div className={`${activeTheme.bg} p-4`}>
            <MemoryMatch
              key={gameKey}
              theme={activeTheme}
              ageGroup={ageGroup}
              childName={childName}
              isAuthenticated={isAuth}
              onLevelComplete={handleLevelComplete}
            />
          </div>
        </div>

        {/* ── Badges earned (after first win) ── */}
        {earnedBadges.length > 0 && (
          <div className="flex items-center gap-2 justify-center mb-5 flex-wrap">
            {earnedBadges.slice(0, 6).map(b => (
              <span key={b.id} title={b.name}
                className="text-2xl bg-white/70 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center border border-white/60 shadow-sm">
                {b.emoji}
              </span>
            ))}
            {(progress?.streak ?? 0) >= 2 && (
              <span className="text-xs font-black text-orange-600 bg-white/70 border border-orange-100 rounded-full px-3 py-1">
                🔥 {progress!.streak}-day streak!
              </span>
            )}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="text-center mb-8">
          <p className="text-gray-500 font-semibold text-sm mb-3">
            {isAuth
              ? `Create a personalised game for ${displayName || 'your child'}`
              : 'Want even more games for your child?'}
          </p>
          <Link
            href={isAuth ? '/builder' : '/signup'}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-4 text-white font-black text-base shadow-xl shadow-violet-200 hover:opacity-90 hover:scale-105 transition-all"
          >
            {isAuth ? '+ Create my own game' : 'Create my own game — free'}
          </Link>
        </div>
      </div>

      {/* ── Bottom tab navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-xl">
        <div className="max-w-md mx-auto grid grid-cols-4 h-16">
          {[
            { icon: '🎮', label: 'Play',     href: '/'                              },
            { icon: '⚡', label: 'Quests',   href: isAuth ? '/dashboard' : '/signup' },
            { icon: '🏅', label: 'Rewards',  href: isAuth ? '/dashboard' : '/signup' },
            { icon: '👤', label: 'Profile',  href: isAuth ? '/dashboard' : '/signup' },
          ].map(tab => (
            <Link
              key={tab.label}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-violet-600 transition-colors"
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-xs font-black leading-none">{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {showModal && <SignupModal moves={completedMoves} onClose={() => { setShowModal(false); setGameKey(k => k + 1) }} />}
    </div>
  )
}
