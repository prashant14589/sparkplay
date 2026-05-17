'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AGE_GROUPS,
  TEMPLATES,
  THEMES,
  getTemplatesForAge,
  getThemesForAge,
  type AgeGroupId,
  type Theme,
} from '@/lib/themes'

type Step = 'age' | 'pick' | 'customize'

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
    // Auto-select first available theme for this age
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

  // Update title when child name changes
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

  // ── Step 1: Age group ──────────────────────────────────────────────────────
  if (step === 'age') {
    return (
      <div className="min-h-screen bg-gray-50 py-14 px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-2">Step 1 of 3</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Who is the game for?</h1>
          <p className="text-gray-500 mb-10">We'll show the best game types and themes for their age.</p>
          <div className="grid grid-cols-2 gap-4">
            {AGE_GROUPS.map((ag) => (
              <button
                key={ag.id}
                onClick={() => selectAge(ag.id)}
                className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white p-6 hover:border-violet-400 hover:shadow-md transition-all text-center"
              >
                <span className="text-5xl">{ag.emoji}</span>
                <span className="text-xl font-bold text-gray-900 group-hover:text-violet-600">{ag.label}</span>
                <span className="text-sm text-gray-400">{ag.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Step 2: Template + Theme ───────────────────────────────────────────────
  if (step === 'pick') {
    const templates = ageGroup ? getTemplatesForAge(ageGroup) : TEMPLATES
    const themes = ageGroup ? getThemesForAge(ageGroup) : THEMES
    const canContinue = selectedTemplate && selectedTheme

    return (
      <div className="min-h-screen bg-gray-50 py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep('age')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-flex items-center gap-1">
            ← Back
          </button>

          <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-2">Step 2 of 3</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Choose game type & theme</h1>
          <p className="text-gray-500 mb-8">Showing options for age {ageGroup}</p>

          {/* Game type */}
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Game Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className={[
                  'text-left rounded-xl border-2 p-4 transition-all',
                  selectedTemplate?.id === t.id
                    ? 'border-violet-500 bg-violet-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm',
                ].join(' ')}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-xl mb-2`}>
                  {t.emoji}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>

          {/* Theme */}
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Theme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => setSelectedTheme(th)}
                className={[
                  'rounded-xl border-2 p-3 text-center transition-all',
                  selectedTheme?.id === th.id
                    ? 'border-violet-500 bg-violet-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm',
                ].join(' ')}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${th.color} flex items-center justify-center text-2xl mx-auto mb-1`}>
                  {th.emoji}
                </div>
                <p className="text-xs font-semibold text-gray-700">{th.name}</p>
                {/* Preview of card emojis */}
                <p className="text-xs mt-1 tracking-wider">{th.cards.slice(0, 4).join(' ')}</p>
              </button>
            ))}
          </div>

          <button
            onClick={goToCustomize}
            disabled={!canContinue}
            className="w-full rounded-xl bg-violet-600 px-6 py-3 text-white font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>
    )
  }

  // ── Step 3: Customize ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-14 px-4">
      <div className="max-w-lg mx-auto">
        <button onClick={() => setStep('pick')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-flex items-center gap-1">
          ← Back
        </button>

        <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-2">Step 3 of 3</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Personalise it</h1>
        <p className="text-gray-500 mb-8">Add a name and we'll make it feel like their very own game.</p>

        {/* Preview badge */}
        {selectedTemplate && selectedTheme && (
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedTheme.color} flex items-center justify-center text-2xl flex-shrink-0`}>
              {selectedTheme.emoji}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{selectedTheme.name} {selectedTemplate.name}</p>
              <p className="text-xs text-gray-400">Age {ageGroup} · {selectedTheme.cards.slice(0, 6).join(' ')}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

          <div>
            <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
              Child's Name <span className="text-gray-400 font-normal">(optional — makes it personal!)</span>
            </label>
            <input
              id="childName"
              type="text"
              value={childName}
              onChange={(e) => handleChildName(e.target.value)}
              maxLength={30}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-900"
              placeholder="e.g. Emma"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Game Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none text-gray-900"
              placeholder="A fun dinosaur game for Emma's birthday party!"
            />
          </div>

          <button
            onClick={save}
            disabled={saving || !title.trim()}
            className="w-full rounded-xl bg-violet-600 px-4 py-3 text-white font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Creating…' : '🎮 Create Game'}
          </button>
        </div>
      </div>
    </div>
  )
}
