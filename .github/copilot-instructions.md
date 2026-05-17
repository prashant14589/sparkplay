# SparkPlay — Copilot Instructions

A platform where parents create personalised games for their kids (memory match, mazes, puzzles). Built with Next.js 16, Supabase, and Tailwind CSS.

## ⚠️ Mobile-First — Always

Every component must work on a 375px screen. This is non-negotiable.

- **Build mobile first**, then add `md:` / `lg:` classes for larger screens
- **No fixed-width containers** — use `w-full`, `max-w-*`, responsive fractions
- **Sidebars on mobile** must collapse — use a toggle button pattern, never show both sidebar + content squished side by side
- **Game grids** (puzzle tiles, maze cells, card grids) must calculate cell size from available screen width — never hardcode `330px` or similar
- **Touch targets** must be ≥ 44px tall
- **Before completing any UI task:** mentally check 375px / 768px / 1280px widths. Horizontal overflow is always a bug.

## Tech Stack

| What | How |
|------|-----|
| Framework | Next.js 16 App Router — `src/proxy.ts` is middleware (renamed from `middleware.ts` in v16) |
| Auth | Supabase Auth — email/password + Google OAuth via `@supabase/ssr` |
| Database | Supabase (PostgreSQL + RLS) — NOT Prisma (installed but dormant for Phase 2) |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel — `NEXT_PUBLIC_*` vars are baked in at build time |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page + demo game (public)
│   ├── login/ signup/        # Auth pages
│   ├── dashboard/            # User's game library (protected)
│   ├── builder/
│   │   ├── page.tsx          # 3-step game creator: age → template → theme → customise
│   │   └── [id]/page.tsx     # Game editor (responsive: mobile stack, desktop sidebar)
│   ├── api/games/            # CRUD for games (auth-gated, Supabase RLS)
│   └── auth/callback/        # OAuth redirect handler
├── components/
│   ├── MemoryMatch.tsx        # 5-level card matching game
│   ├── SignupModal.tsx        # Post-level-1 signup gate
│   └── games/
│       ├── MazeGame.tsx       # Recursive-backtracking maze
│       ├── SlidingPuzzle.tsx  # 15-puzzle with emoji tiles
│       └── HowToPlay.tsx      # Collapsible instructions for each game type
├── lib/
│   ├── themes.ts             # All themes (8), age groups (4), level configs (5 levels per age)
│   └── supabase/
│       ├── client.ts         # createBrowserClient (use in 'use client' components)
│       └── server.ts         # createServerClient (use in Server Components + API routes)
└── proxy.ts                  # Session guard — protects /dashboard and /builder routes
```

## Key Conventions

- **Server auth**: always use `supabase.auth.getUser()` in API routes — never trust client-provided user IDs
- **`NEXT_PUBLIC_*` vars**: inlined at build time — any change needs a Vercel redeploy
- **Game content JSON**: always store `{ theme, ageGroup, childName, template }` in `games.content`
- **Themes**: defined in `src/lib/themes.ts` — 18 emojis per theme, supports up to 18 pairs at max level
- **Levels**: `getLevels(ageGroup)` returns 5 `{ pairs, cols }` configs — Level 1 free, 2–5 need sign-in
- **Proxy exports**: `export { handler as proxy, handler as middleware }` + `export default` — all three needed for Vercel compatibility
