'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Analytics } from '@/lib/analytics'

// TODO (India/Razorpay): Replace the checkout fetch below with a Razorpay order creation
// when the user's locale is India. Steps:
//   1. POST /api/razorpay/checkout → get { orderId, keyId, amount }
//   2. Open Razorpay checkout modal: new window.Razorpay({ key: keyId, order_id: orderId, ... }).open()
//   3. On payment success, Razorpay calls your webhook → update subscription tier
// Reference: https://razorpay.com/docs/payment-gateway/web-integration/

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceINR: '₹0',
    priceUSD: '$0',
    period: 'forever',
    highlight: false,
    features: [
      '✅ Memory Match (5 levels)',
      '✅ Maze Adventure',
      '✅ Sliding Puzzle',
      '✅ 3 AI stories / day',
      '✅ 3 AI puzzle images / day',
      '❌ Quiz Game',
      '❌ Word Search',
      '❌ Puzzle Maker',
      '❌ Story Quest',
    ],
    cta: 'Get started free',
    ctaHref: '/signup',
  },
  {
    id: 'family',
    name: 'Family',
    priceINR: '₹499',
    priceUSD: '$4.99',
    period: 'per month',
    highlight: true,
    badge: 'Most popular',
    features: [
      '✅ Everything in Free',
      '✅ Quiz Game — 200 questions',
      '✅ Word Search — 8 themes',
      '✅ Puzzle Maker — AI images',
      '✅ Story Quest — AI stories',
      '✅ 20 AI generations / day',
      '✅ PDF export for all games',
      '✅ Up to 3 child profiles',
    ],
    cta: 'Start Family plan',
    ctaAction: 'family',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceINR: '₹999',
    priceUSD: '$9.99',
    period: 'per month',
    highlight: false,
    features: [
      '✅ Everything in Family',
      '✅ Unlimited child profiles',
      '✅ Priority AI generation',
      '✅ Early access to new games',
      '✅ Priority email support',
    ],
    cta: 'Start Pro plan',
    ctaAction: 'pro',
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout(plan: string) {
    Analytics.upgradeClicked('pricing_page', plan)
    setLoading(plan)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (res.status === 401) {
        window.location.href = '/signup'
      } else {
        setError(data.error ?? 'Checkout failed. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Nav */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">✦</span>
            </div>
            <span className="text-base font-black text-gray-900">SparkPlay</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">← Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Simple, family-friendly pricing</h1>
          <p className="text-gray-500 text-lg">Start free. Upgrade when your kids want more adventures.</p>
          {/* India payment note */}
          <p className="mt-3 text-sm text-violet-600 font-medium">
            🇮🇳 Indian users: UPI &amp; NetBanking support coming soon via Razorpay
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 bg-white p-6 flex flex-col ${
                plan.highlight
                  ? 'border-violet-500 shadow-xl shadow-violet-100'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-bold text-white">
                  {plan.badge}
                </span>
              )}

              <div className="mb-4">
                <h2 className="text-xl font-black text-gray-900">{plan.name}</h2>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">{plan.priceINR}</span>
                  {plan.period !== 'forever' && (
                    <span className="text-sm text-gray-400">/mo</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {plan.priceUSD !== '$0' ? `${plan.priceUSD}/mo` : 'Free forever'} · {plan.period}
                </p>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-700 leading-snug">{f}</li>
                ))}
              </ul>

              {'ctaAction' in plan ? (
                <button
                  onClick={() => handleCheckout(plan.ctaAction!)}
                  disabled={loading === plan.ctaAction}
                  className={`w-full rounded-xl py-3 font-bold text-sm min-h-[44px] transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white hover:opacity-90'
                      : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  {loading === plan.ctaAction ? 'Loading…' : plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.ctaHref!}
                  className="block w-full rounded-xl border-2 border-gray-200 py-3 text-center font-bold text-sm text-gray-700 hover:bg-gray-50 min-h-[44px] flex items-center justify-center"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* FAQ / trust signals */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-center">
          {[
            { emoji: '🔒', title: 'Secure payments', desc: 'Powered by Stripe (international) · Razorpay coming for India' },
            { emoji: '↩️', title: '7-day refund', desc: 'Not happy? Email us and we\'ll refund you, no questions asked.' },
            { emoji: '❌', title: 'Cancel anytime', desc: 'No contracts. Cancel from your account settings in one click.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="rounded-2xl bg-gray-50 p-6">
              <div className="text-3xl mb-2">{emoji}</div>
              <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Questions? <a href="mailto:support@sparkplay.app" className="underline">support@sparkplay.app</a> ·{' '}
          <Link href="/privacy" className="underline">Privacy</Link> ·{' '}
          <Link href="/terms" className="underline">Terms</Link>
        </p>
      </main>
    </div>
  )
}
