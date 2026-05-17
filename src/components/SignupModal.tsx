'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Props {
  moves: number
  onClose: () => void
}

export default function SignupModal({ moves, onClose }: Props) {
  async function signInWithGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // After OAuth, come back to the landing page (not dashboard)
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="text-6xl mb-3">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Level 1 Complete!</h2>
        <p className="text-gray-500 mb-1">
          You matched all pairs in{' '}
          <span className="font-semibold text-gray-700">{moves} moves</span>
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Sign up free to unlock <strong>Level 2</strong> and create your own personalised games!
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all mb-3"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <Link
          href="/signup"
          className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition-colors mb-4"
        >
          Sign up with Email
        </Link>

        <p className="text-xs text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
