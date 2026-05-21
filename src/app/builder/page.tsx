'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AGE_GROUPS, TEMPLATES, THEMES,
  getTemplatesForAge, getThemesForAge,
  type AgeGroupId, type Theme,
} from '@/lib/themes'
import { makeGameTitle } from '@/lib/titleTemplate'
import { getBuilderStepConfig, stepNumber, prevStep, type StepId } from './stepConfig'
import { getChildProfile } from '@/lib/childProfile'

const ILLUSTRATED = new Set(['animals', 'dinos', 'unicorns', 'ocean', 'space', 'superheroes', 'food', 'farm'])
const STEPS = getBuilderStepConfig()

export default function BuilderPage() {
  const router = useRouter()

  // If a child profile exists, skip the age step — we already know who's playing
  const savedProfile = typeof window !== 'undefined' ? getChildProfile() : null
  const [step, setStep]                     = useState<StepId>(savedProfile ? 'game' : 'age')
  const [ageGroup, setAgeGroup]             = useState<AgeGroupId | null>(savedProfile?.ageGroup ?? null)
  const [selectedTemplate, setTemplate]     = useState<typeof TEMPLATES[0] | null>(null)
  const [selectedTheme, setTheme]           = useState<Theme | null>(null)
  const [childName, setChildName]           = useState(savedProfile?.name ?? '')
  const [title, setTitle]                   = useState('')
  const [saving, setSaving]                 = useState(false)
  const [error, setError]                   = useState<string | null>(null)

  const stepNum   = stepNumber(step)
  const stepCfg   = STEPS.find(s => s.id === step)!

  function advance(nextStep: StepId) { setStep(nextStep) }

  function handleBack() {
    const prev = prevStep(step)
    if (prev) setStep(prev)
  }

  // ── Step handlers (each auto-advances) ─────────────────────────────────

  function selectAge(age: AgeGroupId) {
    setAgeGroup(age)
    setTemplate(null)
    setTheme(null)
    advance('game')
  }

  function selectGame(template: typeof TEMPLATES[0]) {
    setTemplate(template)
    advance('theme')
  }

  function selectTheme(theme: Theme) {
    setTheme(theme)
    const name = childName.trim()
    setTitle(makeGameTitle(name, theme.name, selectedTemplate?.name ?? ''))
    advance('make')
  }

  function handleChildName(name: string) {
    setChildName(name)
    if (selectedTemplate && selectedTheme) {
      setTitle(makeGameTitle(name.trim(), selectedTheme.name, selectedTemplate.name))
    }
  }

  async function save() {
    if (!selectedTemplate || !selectedTheme || !ageGroup || !title.trim()) return
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Back / Cancel */}
          {step === 'age' ? (
            <Link href="/dashboard"
              className="text-gray-500 hover:text-violet-600 font-bold text-sm min-h-[44px] flex items-center">
              ← Cancel
            </Link>
          ) : (
            <button onClick={handleBack}
              className="text-gray-500 hover:text-violet-600 font-bold text-sm min-h-[44px]">
              ← Back
            </button>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">✦</span>
            </div>
            <span className="text-sm font-black text-gray-800 hidden sm:inline">SparkPlay</span>
          </Link>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`rounded-full transition-all duration-300 ${
                  i + 1 < stepNum
                    ? 'w-2 h-2 bg-violet-400'
                    : i + 1 === stepNum
                      ? 'w-4 h-2 bg-violet-600'
                      : 'w-2 h-2 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
            style={{ width: `${(stepNum / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Step content — slide in on each new step ── */}
      <div key={step} className="animate-step-in px-4 py-8 max-w-xl mx-auto">

        {/* Step headline */}
        <div className="mb-7 text-center">
          <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">
            Step {stepNum} of {STEPS.length} · {stepCfg.label}
          </p>
          <h1 className="text-2xl font-black text-gray-900 leading-tight mb-1">
            {stepCfg.headline}
          </h1>
          <p className="text-gray-400 font-semibold text-sm">{stepCfg.sub}</p>
        </div>

        {/* ── AGE ── */}
        {step === 'age' && (
          <div className="grid grid-cols-2 gap-4">
            {AGE_GROUPS.map((ag) => (
              <button
                key={ag.id}
                onClick={() => selectAge(ag.id)}
                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white p-6 hover:border-violet-400 hover:shadow-lg active:scale-95 transition-all text-center"
              >
                <span className="text-5xl">{ag.emoji}</span>
                <span className="text-base font-black text-gray-900 group-hover:text-violet-600">{ag.label}</span>
                <span className="text-xs text-gray-400 font-semibold">{ag.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── GAME TYPE ── */}
        {step === 'game' && (
          <div className="grid grid-cols-2 gap-3">
            {(ageGroup ? getTemplatesForAge(ageGroup) : TEMPLATES).map((t) => (
              <button
                key={t.id}
                onClick={() => selectGame(t)}
                className="relative rounded-2xl overflow-hidden min-h-[130px] flex flex-col justify-end text-left active:scale-95 transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${t.color}`} />
                <span className="absolute top-3 right-3 text-5xl leading-none drop-shadow-lg select-none">
                  {t.emoji}
                </span>
                <div className="relative bg-gradient-to-t from-black/60 to-transparent px-3 pt-6 pb-3">
                  <p className="font-black text-white text-sm leading-tight drop-shadow">{t.name}</p>
                  <p className="text-white/70 text-[10px] font-semibold mt-0.5">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── THEME / WORLD ── */}
        {step === 'theme' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(ageGroup ? getThemesForAge(ageGroup) : THEMES).map((th) => (
              <button
                key={th.id}
                onClick={() => selectTheme(th)}
                className="relative rounded-2xl overflow-hidden min-h-[100px] flex flex-col justify-end active:scale-95 transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                {ILLUSTRATED.has(th.id) ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/illustrations/${th.id}/hero.png`}
                      alt={th.name}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${th.color}`}
                    style={{ filter: 'saturate(0.8) brightness(0.95)' }}>
                    <span className="absolute bottom-2 right-2 text-4xl leading-none drop-shadow select-none">{th.emoji}</span>
                  </div>
                )}
                <div className="relative px-2.5 pb-2.5">
                  <p className="text-xs font-black text-white drop-shadow">{th.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── MAKE / NAME ── */}
        {step === 'make' && (
          <div className="space-y-5">
            {/* Selection summary pill */}
            {selectedTemplate && selectedTheme && (
              <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl bg-gradient-to-br ${selectedTheme.color}`}>
                  {selectedTheme.emoji}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{selectedTheme.name}</p>
                  <p className="text-xs text-gray-400 font-semibold">{selectedTemplate.emoji} {selectedTemplate.name} · Age {ageGroup}</p>
                </div>
                <button onClick={() => setStep('theme')}
                  className="ml-auto text-xs text-violet-500 font-black hover:text-violet-700">
                  Change
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 space-y-4">
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 font-semibold">{error}</p>
              )}

              {/* Child name */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">
                  Child&apos;s name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => handleChildName(e.target.value)}
                  maxLength={30}
                  placeholder="e.g. Emma"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 font-semibold text-gray-900 min-h-[48px]"
                />
              </div>

              {/* Auto-generated title */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">
                  Game title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 font-semibold text-gray-900 min-h-[48px]"
                />
              </div>

              {/* Create button */}
              <button
                onClick={save}
                disabled={saving || !title.trim()}
                className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 py-4 text-white font-black text-base shadow-lg shadow-violet-200 hover:opacity-90 disabled:opacity-50 transition-all min-h-[52px]"
              >
                {saving ? '✨ Creating…' : '🎮 Create this game!'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
