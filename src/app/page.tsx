'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import MemoryMatch from '@/components/MemoryMatch'
import SignupModal from '@/components/SignupModal'
import { THEMES, AGE_GROUPS, getThemesForAge, type Theme, type AgeGroupId } from '@/lib/themes'
import { createClient } from '@/lib/supabase/client'

const DEFAULT_AGE: AgeGroupId = '4-6'

export default function HomePage() {
  const [ageGroup, setAgeGroup] = useState<AgeGroupId>(DEFAULT_AGE)
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(getThemesForAge(DEFAULT_AGE))
  const [activeTheme, setActiveTheme] = useState<Theme>(getThemesForAge(DEFAULT_AGE)[0])
  const [showModal, setShowModal] = useState(false)
  const [completedLevel, setCompletedLevel] = useState(1)
  const [completedMoves, setCompletedMoves] = useState(0)
  const [gameKey, setGameKey] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setIsAuthenticated(!!user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthenticated(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  function selectAge(age: AgeGroupId) {
    const themes = getThemesForAge(age)
    setAgeGroup(age)
    setAvailableThemes(themes)
    setActiveTheme(themes[0])
    setGameKey((k) => k + 1)
    setShowModal(false)
  }

  function switchTheme(theme: Theme) {
    setActiveTheme(theme)
    setGameKey((k) => k + 1)
    setShowModal(false)
  }

  const handleLevelComplete = useCallback((level: number, moves: number) => {
    setCompletedLevel(level)
    setCompletedMoves(moves)
    // Show signup modal only on level 1 completion for unauthenticated users
    if (level === 1 && !isAuthenticated) setShowModal(true)
  }, [isAuthenticated])

  function handleClose() {
    setShowModal(false)
    setGameKey((k) => k + 1)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-blue-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="text-xl font-bold text-gray-900">🎮 Kids Play Store</span>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">My Games</Link>
              <Link href="/builder" className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white font-semibold hover:bg-violet-700">
                + Create Game
              </Link>
              <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-gray-600">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
              <Link href="/signup" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-semibold hover:bg-blue-700">
                Get started free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center px-4 pt-8 pb-4 max-w-2xl mx-auto">
        {isAuthenticated ? (
          <>
            <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              ✓ All 5 levels unlocked
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              Keep playing — <span className="text-violet-600">5 levels await</span>
            </h1>
            <p className="text-gray-500">
              Pick an age group and theme, then challenge yourself through all levels.
            </p>
          </>
        ) : (
          <>
            <div className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              Level 1 free · Levels 2–5 unlock on sign up
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
              Games your kids will{' '}
              <span className="text-violet-600">actually love</span>
            </h1>
            <p className="text-gray-500">
              Pick your child&apos;s age group, choose a theme, and start playing — no account needed.
            </p>
          </>
        )}
      </div>

      <div className="max-w-md mx-auto px-4 pb-16">

        {/* ── Age group selector ── */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center">
            Child&apos;s age group
          </p>
          <div className="flex gap-2 justify-center">
            {AGE_GROUPS.map((ag) => (
              <button
                key={ag.id}
                onClick={() => selectAge(ag.id)}
                className={[
                  'flex flex-col items-center px-3 py-2 rounded-xl border-2 transition-all text-center flex-1',
                  ageGroup === ag.id
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-violet-300',
                ].join(' ')}
              >
                <span className="text-xl">{ag.emoji}</span>
                <span className="text-xs font-semibold mt-0.5">{ag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Theme switcher ── */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {availableThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => switchTheme(theme)}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all whitespace-nowrap',
                activeTheme.id === theme.id
                  ? 'border-violet-500 bg-violet-100 text-violet-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-violet-300',
              ].join(' ')}
            >
              {theme.emoji} {theme.name}
            </button>
          ))}
        </div>

        {/* ── Game card ── */}
        <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-6 transition-all duration-300 ${activeTheme.bg}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🃏</span>
              <div>
                <h2 className="font-bold text-gray-900">Memory Match</h2>
                <p className="text-xs text-gray-400">{activeTheme.name} · Age {ageGroup}</p>
              </div>
            </div>
            {!isAuthenticated && (
              <Link href="/signup" className="text-xs text-violet-600 font-semibold hover:underline">
                Unlock all 5 levels →
              </Link>
            )}
          </div>

          <MemoryMatch
            key={gameKey}
            theme={activeTheme}
            ageGroup={ageGroup}
            isAuthenticated={isAuthenticated}
            onLevelComplete={handleLevelComplete}
          />
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          {isAuthenticated ? (
            <>
              <p className="text-gray-500 text-sm mb-3">Create a personalised version for your child</p>
              <Link href="/builder" className="inline-block rounded-xl bg-violet-600 px-6 py-3 text-white font-semibold hover:bg-violet-700 shadow-md">
                + Create my own game →
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-3">Want to make a personalised game for your child?</p>
              <Link href="/signup" className="inline-block rounded-xl bg-violet-600 px-6 py-3 text-white font-semibold hover:bg-violet-700 shadow-md">
                Create my own game — free →
              </Link>
            </>
          )}
        </div>

        {/* Feature pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {['🎨 8 themes','👶 Ages 2–12','🏆 5 levels','📝 Add child\'s name','📄 Export to PDF','🔗 Share with family'].map((f) => (
            <span key={f} className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 shadow-sm">{f}</span>
          ))}
        </div>
      </div>

      {showModal && <SignupModal moves={completedMoves} onClose={handleClose} />}
    </div>
  )
}
