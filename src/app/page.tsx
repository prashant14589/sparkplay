'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import MemoryMatch from '@/components/MemoryMatch'
import SignupModal from '@/components/SignupModal'
import { THEMES, AGE_GROUPS, getThemesForAge, type Theme, type AgeGroupId } from '@/lib/themes'
import { createClient } from '@/lib/supabase/client'
import { getProgress, setChildName as saveChildName, type Progress } from '@/lib/progress'

const DEFAULT_AGE: AgeGroupId = '4-6'

export default function HomePage() {
  const [ageGroup, setAgeGroup] = useState<AgeGroupId>(DEFAULT_AGE)
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(getThemesForAge(DEFAULT_AGE))
  const [activeTheme, setActiveTheme] = useState<Theme>(getThemesForAge(DEFAULT_AGE)[0])
  const [showModal, setShowModal] = useState(false)
  const [completedMoves, setCompletedMoves] = useState(0)
  const [gameKey, setGameKey] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [childName, setChildName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [progress, setProgress] = useState<Progress | null>(null)
  const [activeTab, setActiveTab] = useState('games')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setIsAuthenticated(!!user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthenticated(!!session?.user)
    })
    const p = getProgress()
    setProgress(p)
    if (p.childName) { setChildName(p.childName); setNameInput(p.childName) }
    return () => subscription.unsubscribe()
  }, [])

  function applyName() {
    const trimmed = nameInput.trim()
    setChildName(trimmed)
    saveChildName(trimmed)
    setProgress(getProgress())
    setGameKey((k) => k + 1)
  }

  function selectAge(age: AgeGroupId) {
    const themes = getThemesForAge(age)
    setAgeGroup(age)
    setAvailableThemes(themes)
    setActiveTheme(themes[0])
    setGameKey((k) => k + 1)
    setShowModal(false)
  }

  function switchTheme(t: Theme) {
    setActiveTheme(t)
    setGameKey((k) => k + 1)
    setShowModal(false)
  }

  const handleLevelComplete = useCallback((level: number, moves: number) => {
    setCompletedMoves(moves)
    setProgress(getProgress())
    if (level === 1 && !isAuthenticated) setShowModal(true)
  }, [isAuthenticated])

  function handleClose() { setShowModal(false); setGameKey((k) => k + 1) }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  const displayName = childName?.trim()
  const earnedBadges = progress?.badges.filter((b) => b.earned) ?? []

  return (
    <div className="bg-white pb-24">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-4 py-3.5 max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">✦</span>
          </div>
          <span className="text-lg font-black text-gray-900">SparkPlay</span>
        </Link>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
                <span className="text-sm">🪙</span>
                <span className="font-black text-yellow-700 text-sm">{progress?.totalCoins ?? 0}</span>
                <span className="text-sm">⭐</span>
                <span className="font-black text-yellow-700 text-sm">{progress?.totalStars ?? 0}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/signup"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-2 text-sm text-white font-black shadow-md shadow-violet-200 hover:opacity-90">
              Get started free
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4">

        {/* ── Level banner ── */}
        <div className="flex items-center justify-center mb-5">
          <div className="bg-violet-50 border border-violet-100 rounded-full px-4 py-1.5 text-xs font-black text-violet-600 uppercase tracking-widest text-center">
            {isAuthenticated
              ? '✅ All 5 levels unlocked'
              : 'Level 1 free · Levels 2–5 unlock on sign up'}
          </div>
        </div>

        {/* ── Hero headline ── */}
        <div className="text-center mb-6">
          {displayName ? (
            <>
              <h1 className="text-4xl font-black text-gray-900 leading-tight mb-2">
                Hi <span className="text-violet-600">{displayName}</span>!<br />
                Ready to play? 🎉
              </h1>
              <p className="text-gray-400 font-semibold text-sm">
                Pick an age group and theme, then go!
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-black text-gray-900 leading-tight mb-2">
                Games your kids<br />
                <span className="text-violet-600">actually love</span>
              </h1>
              <p className="text-gray-400 font-semibold text-sm">
                Pick your child&apos;s age group, choose a theme,<br />
                and start playing — no account needed.
              </p>
            </>
          )}
        </div>

        {/* ── Progress row (shows after first win) ── */}
        {earnedBadges.length > 0 && (
          <div className="flex items-center gap-2 justify-center mb-5 flex-wrap">
            {earnedBadges.slice(0, 6).map((b) => (
              <span key={b.id} title={b.name}
                className="text-2xl bg-violet-50 rounded-full w-10 h-10 flex items-center justify-center border border-violet-100">
                {b.emoji}
              </span>
            ))}
            {progress && progress.streak >= 2 && (
              <span className="text-xs font-black text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-3 py-1">
                🔥 {progress.streak} day streak!
              </span>
            )}
          </div>
        )}

        {/* ── Who's playing ── */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 mb-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Child&apos;s age group</p>
          {/* Age group buttons — matches mockup */}
          <div className="flex gap-2 mb-4">
            {AGE_GROUPS.map((ag) => (
              <button
                key={ag.id}
                onClick={() => selectAge(ag.id)}
                className={[
                  'flex flex-col items-center py-2.5 px-1 rounded-2xl border-2 transition-all text-center flex-1 font-bold',
                  ageGroup === ag.id
                    ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-violet-300',
                ].join(' ')}
              >
                <span className="text-xl mb-0.5">{ag.emoji}</span>
                <span className="text-xs font-black leading-none">{ag.label}</span>
              </button>
            ))}
          </div>

          {/* Theme chips */}
          <div className="flex gap-2 flex-wrap">
            {availableThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTheme(t)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border-2 transition-all whitespace-nowrap',
                  activeTheme.id === t.id
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300',
                ].join(' ')}
              >
                <span>{t.emoji}</span> {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Who's playing name box ── */}
        <div className="mb-5">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter child's name (optional)"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyName()}
              maxLength={30}
              className="flex-1 rounded-2xl border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-violet-400 min-h-[48px] placeholder:text-gray-300 placeholder:font-normal"
            />
            <button
              onClick={applyName}
              className="rounded-2xl bg-violet-600 px-4 py-3 text-sm text-white font-black hover:bg-violet-700 min-h-[48px] shadow-md shadow-violet-200"
            >
              {displayName ? '↺' : 'Set'}
            </button>
          </div>
          {displayName && (
            <p className="text-xs text-violet-500 font-bold mt-1.5 pl-1">
              🎮 Playing as {displayName} — their name appears in the game!
            </p>
          )}
        </div>

        {/* ── Game card ── */}
        <div className="rounded-3xl overflow-hidden border-2 border-gray-100 shadow-xl shadow-gray-100 mb-6">
          {/* Themed header */}
          <div className={`bg-gradient-to-r ${activeTheme.color} px-5 py-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                🃏
              </div>
              <div>
                <h2 className="font-black text-white text-base leading-tight">Memory Match</h2>
                <p className="text-white/70 text-xs font-bold">
                  {activeTheme.name} · Age {ageGroup}
                  {displayName ? ` · ${displayName}` : ''}
                </p>
              </div>
            </div>
            {!isAuthenticated && (
              <Link href="/signup"
                className="text-xs text-white font-black bg-white/20 hover:bg-white/30 rounded-full px-3 py-1.5">
                Unlock all 5 levels →
              </Link>
            )}
          </div>

          <div className="bg-white p-4">
            <MemoryMatch
              key={gameKey}
              theme={activeTheme}
              ageGroup={ageGroup}
              childName={childName}
              isAuthenticated={isAuthenticated}
              onLevelComplete={handleLevelComplete}
            />
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center mb-8">
          {isAuthenticated ? (
            <>
              <p className="text-gray-400 font-semibold text-sm mb-3">
                Create a personalised game for {displayName || 'your child'}
              </p>
              <Link href="/builder"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-4 text-white font-black text-base shadow-xl shadow-violet-200 hover:opacity-90 hover:scale-105 transition-all">
                + Create my own game
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-400 font-semibold text-sm mb-3">
                Want to make a personalised game for your child?
              </p>
              <Link href="/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-4 text-white font-black text-base shadow-xl shadow-violet-200 hover:opacity-90 hover:scale-105 transition-all">
                Create my own game — free
              </Link>
            </>
          )}
        </div>

      </div>

      {/* ── Bottom tab navigation (matches mockup) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-100 shadow-xl">
        <div className="max-w-md mx-auto grid grid-cols-5 h-16">
          {[
            { id: 'games',      icon: '🎮', label: 'Games',      href: '/' },
            { id: 'progress',   icon: '📊', label: 'Progress',   href: isAuthenticated ? '/dashboard' : '/signup' },
            { id: 'rewards',    icon: '⭐', label: 'Rewards',    href: isAuthenticated ? '/dashboard' : '/signup' },
            { id: 'printables', icon: '📄', label: 'Printables', href: isAuthenticated ? '/dashboard' : '/signup' },
            { id: 'more',       icon: '⋯',  label: 'More',       href: isAuthenticated ? '/dashboard' : '/signup' },
          ].map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex flex-col items-center justify-center gap-0.5 transition-colors text-center',
                activeTab === tab.id
                  ? 'text-violet-600'
                  : 'text-gray-300 hover:text-gray-500',
              ].join(' ')}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-xs font-black leading-none">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="w-1 h-1 bg-violet-600 rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {showModal && <SignupModal moves={completedMoves} onClose={handleClose} />}
    </div>
  )
}
