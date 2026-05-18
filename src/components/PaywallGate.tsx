'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Analytics } from '@/lib/analytics'

type SubscriptionStatus = { isPaid: boolean; tier: string } | null

interface PaywallGateProps {
  children: React.ReactNode
  featureName: string
  featureEmoji: string
}

export default function PaywallGate({ children, featureName, featureEmoji }: PaywallGateProps) {
  const [status, setStatus] = useState<SubscriptionStatus>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/subscription/status')
      .then(r => r.json())
      .then((s) => {
        setStatus(s)
        if (!s.isPaid) Analytics.paywallHit(featureName)
      })
      .catch(() => setStatus({ isPaid: false, tier: 'free' }))
      .finally(() => setLoading(false))
  }, [featureName])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    )
  }

  if (status?.isPaid) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Blurred game preview underneath */}
      <div className="pointer-events-none select-none blur-sm opacity-40 max-h-64 overflow-hidden">
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-2xl border-2 border-violet-200 shadow-xl p-6 mx-4 text-center max-w-sm w-full">
          <div className="text-5xl mb-3">{featureEmoji}</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{featureName}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Upgrade to Family or Pro to unlock this game and AI-powered features.
          </p>
          <Link
            href="/pricing"
            onClick={() => Analytics.upgradeClicked('paywall_gate', featureName)}
            className="block w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 py-3 text-white font-bold text-sm hover:opacity-90 min-h-[44px] flex items-center justify-center"
          >
            View Plans — from ₹499/mo
          </Link>
          <p className="text-xs text-gray-400 mt-3">Free plan: Memory Match, Maze, Sliding Puzzle — always free</p>
        </div>
      </div>
    </div>
  )
}
