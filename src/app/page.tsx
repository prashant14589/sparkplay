'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import MemoryMatch from '@/components/MemoryMatch'
import SignupModal from '@/components/SignupModal'
import { THEMES, AGE_GROUPS, getThemesForAge, type Theme, type AgeGroupId } from '@/lib/themes'
import { createClient } from '@/lib/supabase/client'
import { getProgress, setChildName as saveChildName, type Progress } from '@/lib/progress'
import { recordGameForQuest, getDailyQuest, getQuestProgress, type Quest } from '@/lib/quests'
import { getActiveBuddy, calcXP, calcLevel, randomPhrase } from '@/lib/buddy'
import QuestTeaser from '@/components/QuestTeaser'
import GuestDrawer from '@/components/GuestDrawer'
import MemoryMoment from '@/components/MemoryMoment'
import ParentHero from '@/components/ParentHero'
import ProfileSetup from '@/components/ProfileSetup'
import ProfilePicker from '@/components/ProfilePicker'
import { MEMORY_THEME_IDS } from '@/lib/memoryThemes'
import { getThemeBoardStyle } from '@/lib/themeBoard'
import MemoryThemeCard from '@/components/MemoryThemeCard'
import { getChildProfile, saveChildProfile, type ChildProfile } from '@/lib/childProfile'

const DEFAULT_AGE: AgeGroupId = '4-6'
const ILLUSTRATED = new Set(['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'food', 'farm'])

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
  // Profile-driven state — age and name come from the stored child profile
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  const ageGroup = childProfile?.ageGroup ?? DEFAULT_AGE
  const [availableThemes, setAvailable] = useState<Theme[]>(getThemesForAge(DEFAULT_AGE))
  const [activeTheme, setActiveTheme]   = useState<Theme>(getThemesForAge(DEFAULT_AGE)[0])
  const [showModal, setShowModal]       = useState(false)
  const [completedMoves, setMoves]      = useState(0)
  const [gameKey, setGameKey]           = useState(0)
  const [isAuth, setIsAuth]             = useState(false)
  const [progress, setProgress]         = useState<Progress | null>(null)
  const [buddyEmoji, setBuddyEmoji]     = useState('🦕')
  const [buddyPhrase, setBuddyPhrase]   = useState('Ready to play!')
  const [dailyQuest, setDailyQuest]     = useState<Quest | null>(null)
  const [questProgress, setQuestProgress] = useState(0)
  const [drawerVariant, setDrawerVariant] = useState<'rewards' | 'profile' | null>(null)
  const [memoryMomentActive, setMemoryMomentActive] = useState(false)
  const [seenMemoryMoments] = useState(() => new Set<string>())
  const questRef    = useRef<HTMLDivElement>(null)
  const gameCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load child profile — drives age + name for the whole session
    const profile = getChildProfile()
    if (profile) {
      setChildProfile(profile)
      const themes = getThemesForAge(profile.ageGroup)
      setAvailable(themes)
      setActiveTheme(themes[0])
      // Sync name to progress store for backward compat
      saveChildName(profile.name)
    } else {
      setShowProfileSetup(true)
    }

    const p = getProgress()
    setProgress(p)

    const xp = calcXP(p.totalStars, p.totalCoins)
    const buddy = getActiveBuddy(calcLevel(xp))
    setBuddyEmoji(buddy.emoji)
    setBuddyPhrase(randomPhrase(buddy, 'idle'))

    setDailyQuest(getDailyQuest())
    setQuestProgress(getQuestProgress())

    const themeParam = new URLSearchParams(window.location.search).get('theme')
    if (themeParam) {
      const ageForTheme = profile?.ageGroup ?? DEFAULT_AGE
      const found = getThemesForAge(ageForTheme).find(t => t.id === themeParam)
      if (found) { setActiveTheme(found); setGameKey(k => k + 1) }
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setIsAuth(!!user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setIsAuth(!!s?.user))
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleProfileComplete(profile: ChildProfile) {
    setChildProfile(profile)
    setShowProfileSetup(false)
    saveChildName(profile.name)
    const themes = getThemesForAge(profile.ageGroup)
    setAvailable(themes)
    setActiveTheme(themes[0])
    setGameKey(k => k + 1)
    // Update buddy based on profile choice
    setBuddyEmoji(
      profile.buddyId === 'rexy'  ? '🦕' :
      profile.buddyId === 'puffy' ? '🦄' :
      profile.buddyId === 'scout' ? '🐶' : '⚡'
    )
  }

  function switchTheme(t: Theme) {
    setActiveTheme(t)
    setGameKey(k => k + 1)
    setShowModal(false)
    // Show memory moment on first visit to a memory theme
    if (MEMORY_THEME_IDS.has(t.id) && !seenMemoryMoments.has(t.id)) {
      seenMemoryMoments.add(t.id)
      setMemoryMomentActive(true)
    }
  }

  const handleLevelComplete = useCallback((level: number, moves: number) => {
    setMoves(moves)
    setProgress(getProgress())
    recordGameForQuest('memory')
    setQuestProgress(getQuestProgress())
    if (level >= 2 && !isAuth) setShowModal(true)
  }, [isAuth])

  const meta        = THEME_META[activeTheme.id] ?? THEME_META.animals
  const displayName = childProfile?.name ?? ''
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

        {/* ── Parent-first hero — only for new visitors ── */}
        {!isAuth && <ParentHero />}

        {/* ── Profile identity — replaces age tabs + name input ── */}
        {childProfile ? (
          <ProfilePicker
            profile={childProfile}
            onSwitch={() => setShowProfileSetup(true)}
          />
        ) : null}

        {/* ── Buddy greeting — simple now that profile handles identity ── */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-lg px-5 py-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-bounce flex-shrink-0 select-none">{buddyEmoji}</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-gray-900 leading-tight">
                {displayName ? `Hi ${displayName}! 👋` : 'Hi there! 👋'}
              </h1>
              <div className="mt-1.5 bg-violet-50 border border-violet-100 rounded-2xl rounded-tl-sm px-3 py-1.5 inline-block">
                <p className="text-sm font-bold text-violet-700">{buddyPhrase}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Theme strip — illustrated adventure cards ── */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 mb-3 scrollbar-hide snap-x snap-mandatory">
          {availableThemes.filter(t => !MEMORY_THEME_IDS.has(t.id)).map(t => {
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

        {/* ── Childhood Memory themes — the worlds our parents played in ── */}
        {availableThemes.some(t => MEMORY_THEME_IDS.has(t.id)) && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-amber-100" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest whitespace-nowrap">
                🧡 Childhood Memories
              </span>
              <div className="flex-1 h-px bg-amber-100" />
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
              {availableThemes.filter(t => MEMORY_THEME_IDS.has(t.id)).map(t => (
                <MemoryThemeCard
                  key={t.id}
                  theme={t}
                  isActive={activeTheme.id === t.id}
                  onClick={() => switchTheme(t)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Memory Moment — appears when a memory theme is first selected */}
        {memoryMomentActive && (
          <MemoryMoment
            themeId={activeTheme.id}
            onDismiss={() => setMemoryMomentActive(false)}
          />
        )}

        {/* ── Daily quest teaser — visible without auth, drives the daily loop ── */}
        {dailyQuest && (
          <div ref={questRef} id="quest" className="mb-5">
            <QuestTeaser
              quest={dailyQuest}
              progress={questProgress}
              onScrollToGame={() =>
                gameCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            />
          </div>
        )}

        {/* ── Game card ── */}
        <div ref={gameCardRef} className="rounded-3xl overflow-hidden shadow-xl border border-white/50 mb-6">
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
                Save progress →
              </Link>
            )}
          </div>

          <div className={`${getThemeBoardStyle(activeTheme.id).bgClass} p-4 relative overflow-hidden`}>
            {/* Faint tiled pattern emojis — theme bleeds into the game board */}
            {getThemeBoardStyle(activeTheme.id).patternEmojis.map((em, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="pointer-events-none select-none absolute text-4xl opacity-[0.06]"
                style={{
                  top: `${[10, 55, 80][i] ?? 30}%`,
                  left: `${[5, 88, 45][i] ?? 50}%`,
                }}
              >
                {em}
              </span>
            ))}
            <MemoryMatch
              key={gameKey}
              theme={activeTheme}
              ageGroup={ageGroup}
              childName={displayName}
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
          {/* Play — always goes home */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-0.5 text-violet-600 transition-colors"
          >
            <span className="text-xl leading-none">🎮</span>
            <span className="text-xs font-black leading-none">Play</span>
          </Link>

          {/* Quests — scrolls to quest teaser (no auth needed) */}
          {isAuth ? (
            <Link href="/dashboard"
              className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-violet-600 transition-colors">
              <span className="text-xl leading-none">⚡</span>
              <span className="text-xs font-black leading-none">Quests</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                questRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }}
              className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-violet-600 transition-colors"
            >
              <span className="text-xl leading-none">⚡</span>
              <span className="text-xs font-black leading-none">Quests</span>
            </button>
          )}

          {/* Rewards — drawer for guests */}
          {isAuth ? (
            <Link href="/dashboard"
              className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-violet-600 transition-colors">
              <span className="text-xl leading-none">🏅</span>
              <span className="text-xs font-black leading-none">Rewards</span>
            </Link>
          ) : (
            <button
              onClick={() => setDrawerVariant('rewards')}
              className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-violet-600 transition-colors"
            >
              <span className="text-xl leading-none">🏅</span>
              <span className="text-xs font-black leading-none">Rewards</span>
            </button>
          )}

          {/* Profile — drawer for guests */}
          {isAuth ? (
            <Link href="/dashboard"
              className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-violet-600 transition-colors">
              <span className="text-xl leading-none">👤</span>
              <span className="text-xs font-black leading-none">Profile</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowProfileSetup(true)}
              className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-violet-600 transition-colors"
            >
              <span className="text-xl leading-none">👤</span>
              <span className="text-xs font-black leading-none">Profile</span>
            </button>
          )}
        </div>
      </nav>

      {/* Guest drawers */}
      {!isAuth && drawerVariant && (
        <GuestDrawer
          open
          variant={drawerVariant}
          onClose={() => setDrawerVariant(null)}
        />
      )}

      {showModal && <SignupModal moves={completedMoves} onClose={() => { setShowModal(false); setGameKey(k => k + 1) }} />}

      {/* Profile setup overlay — shown on first visit or when switching child */}
      {showProfileSetup && (
        <ProfileSetup onComplete={handleProfileComplete} />
      )}
    </div>
  )
}
