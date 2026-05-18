'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AGE_GROUPS, TEMPLATES, THEMES,
  getTemplatesForAge, getThemesForAge,
  type AgeGroupId, type Theme,
} from '@/lib/themes'

type Step = 'age' | 'pick' | 'customize'

const STEP_NUM: Record<Step, number> = { age: 1, pick: 2, customize: 3 }

export default function BuilderPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>('age')
  const [ageGroup, setAgeGroup] = useState<AgeGroupId | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[0] | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [childName, setChildName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function selectAge(age: AgeGroupId) {
    setAgeGroup(age)
    setSelectedTemplate(null)
    setSelectedTheme(null)
    setStep('pick')
  }

  function selectTemplate(template: typeof TEMPLATES[0]) {
    setSelectedTemplate(template)
    const themes = ageGroup ? getThemesForAge(ageGroup) : THEMES
    if (themes.length > 0 && !selectedTheme) setSelectedTheme(themes[0])
  }

  function goToCustomize() {
    if (!selectedTemplate || !selectedTheme) return
    const name = childName.trim()
    setTitle(
      name
        ? `${name}'s ${selectedTheme.name} ${selectedTemplate.name}`
        : `My ${selectedTheme.name} ${selectedTemplate.name}`
    )
    setStep('customize')
  }

  function handleChildName(name: string) {
    setChildName(name)
    if (selectedTemplate && selectedTheme) {
      setTitle(
        name.trim()
          ? `${name.trim()}'s ${selectedTheme.name} ${selectedTemplate.name}`
          : `My ${selectedTheme.name} ${selectedTemplate.name}`
      )
    }
  }

  async function save() {
    if (!selectedTemplate || !selectedTheme || !ageGroup || !title.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          template_type: selectedTemplate.id,
          content: {
            template: selectedTemplate.id,
            theme: selectedTheme.id,
            ageGroup,
            childName: childName.trim() || null,
          },
        }),
      })
      const result = await res.json()
      if (!result.success) throw new Error(result.error)
      router.push(`/builder/${result.data.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
      setSaving(false)
    }
  }

  function handleBack() {
    if (step === 'pick') setStep('age')
    else if (step === 'customize') setStep('pick')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Shared sticky nav header ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: back/cancel */}
          {step === 'age' ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-gray-500 hover:text-violet-600 font-bold text-sm min-h-[44px]"
            >
              ← <span className="ml-1">Cancel</span>
            </Link>
          ) : (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-gray-500 hover:text-violet-600 font-bold text-sm min-h-[44px]"
            >
              ← <span className="ml-1">Back</span>
            </button>
          )}

          {/* Centre: logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">✦</span>
            </div>
            <span className="text-sm font-black text-gray-800 hidden sm:inline">SparkPlay</span>
          </Link>

          {/* Right: step counter */}
          <div className="text-xs font-black text-gray-400 bg-gray-100 rounded-full px-3 py-1">
            Step {STEP_NUM[step]} of 3
          </div>
        </div>

        {/* Step progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
            style={{ width: `${(STEP_NUM[step] / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Step 1: Age group ── */}
      {step === 'age' && (
        <div className="px-4 py-10 max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">Who is the game for?</h1>
            <p className="text-gray-400 font-semibold text-sm">We&apos;ll show the best game types and themes for their age.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {AGE_GROUPS.map((ag) => (
              <button
                key={ag.id}
                onClick={() => selectAge(ag.id)}
                className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white p-6 hover:border-violet-400 hover:shadow-md transition-all text-center min-h-[44px]"
              >
                <span className="text-5xl">{ag.emoji}</span>
                <span className="text-lg font-black text-gray-900 group-hover:text-violet-600">{ag.label}</span>
                <span className="text-sm text-gray-400 font-semibold">{ag.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Template + Theme ── */}
      {step === 'pick' && (
        <div className="px-4 py-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Choose game type &amp; theme</h1>
            <p className="text-gray-400 font-semibold text-sm">Showing options for age {ageGroup}</p>
          </div>

          {/* Game type */}
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Game Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {(ageGroup ? getTemplatesForAge(ageGroup) : TEMPLATES).map((t) => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className={[
                  'text-left rounded-2xl border-2 p-4 transition-all min-h-[44px]',
                  selectedTemplate?.id === t.id
                    ? 'border-violet-500 bg-violet-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm',
                ].join(' ')}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-xl mb-2`}>
                  {t.emoji}
                </div>
                <p className="font-black text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 font-semibold">{t.desc}</p>
              </button>
            ))}
          </div>

          {/* Theme */}
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Theme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {(ageGroup ? getThemesForAge(ageGroup) : THEMES).map((th) => (
              <button
                key={th.id}
                onClick={() => setSelectedTheme(th)}
                className={[
                  'rounded-2xl border-2 p-3 text-center transition-all',
                  selectedTheme?.id === th.id
                    ? 'border-violet-500 bg-violet-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm',
                ].join(' ')}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${th.color} flex items-center justify-center text-2xl mx-auto mb-1`}>
                  {th.emoji}
                </div>
                <p className="text-xs font-black text-gray-700">{th.name}</p>
                <p className="text-xs mt-1 tracking-wider">{th.cards.slice(0, 4).join(' ')}</p>
              </button>
            ))}
          </div>

          <button
            onClick={goToCustomize}
            disabled={!selectedTemplate || !selectedTheme}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-4 text-white font-black text-base hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-200 min-h-[52px]"
          >
            Continue →
          </button>
        </div>
      )}

      {/* ── Step 3: Customize ── */}
      {step === 'customize' && (
        <div className="px-4 py-8 max-w-lg mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Personalise it</h1>
            <p className="text-gray-400 font-semibold text-sm">Add a name and we&apos;ll make it feel like their very own game.</p>
          </div>

          {/* Preview badge */}
          {selectedTemplate && selectedTheme && (
            <div className="flex items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl p-4 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedTheme.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                {selectedTheme.emoji}
              </div>
              <div>
                <p className="font-black text-gray-900">{selectedTheme.name} {selectedTemplate.name}</p>
                <p className="text-xs text-gray-400 font-semibold">Age {ageGroup} · {selectedTheme.cards.slice(0, 6).join(' ')}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-5">
            {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 font-semibold">{error}</p>}

            <div>
              <label htmlFor="childName" className="block text-sm font-black text-gray-700 mb-1">
                Child&apos;s Name <span className="text-gray-400 font-semibold">(optional — makes it personal!)</span>
              </label>
              <input
                id="childName"
                type="text"
                value={childName}
                onChange={(e) => handleChildName(e.target.value)}
                maxLength={30}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-gray-900 font-semibold min-h-[48px]"
                placeholder="e.g. Emma"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-black text-gray-700 mb-1">
                Game Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-gray-900 font-semibold min-h-[48px]"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-black text-gray-700 mb-1">
                Description <span className="text-gray-400 font-semibold">(optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 resize-none text-gray-900 font-semibold"
                placeholder="A fun dinosaur game for Emma's birthday party!"
              />
            </div>

            <button
              onClick={save}
              disabled={saving || !title.trim()}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-4 text-white font-black text-base hover:opacity-90 disabled:opacity-50 shadow-md shadow-violet-200 min-h-[52px]"
            >
              {saving ? 'Creating…' : '🎮 Create Game'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
