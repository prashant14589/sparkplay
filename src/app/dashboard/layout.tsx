import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import SoundToggle from '@/components/SoundToggle'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-black">✦</span>
              </div>
              <span className="text-base font-black text-gray-900">SparkPlay</span>
            </Link>

            {/* Right-side actions */}
            <div className="flex items-center gap-2">
              <SoundToggle />
              {/* Back to home / play games */}
              <Link
                href="/"
                className="hidden sm:inline text-sm font-bold text-gray-500 hover:text-violet-600 px-3 py-2"
              >
                ← Play Games
              </Link>

              {/* + Create — always visible */}
              <Link
                href="/builder"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-2 text-sm text-white font-black hover:opacity-90 shadow-sm shadow-violet-200 min-h-[40px] flex items-center"
              >
                <span className="hidden sm:inline">+ Create Game</span>
                <span className="sm:hidden">+ Create</span>
              </Link>

              {/* Sign out — icon on mobile, text on desktop */}
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-bold text-gray-500 hover:border-gray-300 hover:text-gray-700 min-h-[40px]"
                  title="Sign out"
                >
                  <span className="hidden sm:inline">Sign out</span>
                  <span className="sm:hidden">↩</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
