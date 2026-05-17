import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              Kids Play Store
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                My Games
              </Link>
              <Link
                href="/builder"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 font-semibold"
              >
                + Create Game
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
