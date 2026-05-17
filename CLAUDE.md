@AGENTS.md

# SparkPlay — Claude Code Instructions

## Mobile-First Design (NON-NEGOTIABLE)

Every UI component and page **must work on a 375px wide screen** before being considered done.

**Rules:**
- Build mobile layout first, then enhance for desktop with `md:` / `lg:` prefixes
- Never use fixed pixel widths for containers — use `w-full`, `max-w-*`, or responsive fractions
- Sidebars must collapse or stack on mobile — use a toggle/hamburger pattern
- Game grids must calculate cell size from `window.innerWidth` or container width, not hardcoded values
- Touch targets must be at least 44px tall (`min-h-[44px]` or `py-3`)
- Test every layout change at 375px, 768px, and 1280px widths before committing
- Horizontal scrolling is always a bug — fix it, never accept it

**Before submitting any UI change, ask:**
1. Does this look correct on a 375px phone screen?
2. Are all buttons tappable without zooming?
3. Does any content overflow horizontally?

## Tech Stack (Current)

- **Framework**: Next.js 16.x (App Router) — read `node_modules/next/dist/docs/` before writing Next.js code
- **Auth**: Supabase Auth (NOT NextAuth — that is installed but unused for Phase 1)
- **Database**: Supabase (PostgreSQL) with RLS — NOT Prisma (installed but unused for Phase 1)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Middleware**: `src/proxy.ts` exports `proxy`, `middleware`, and `default` (Next.js 16 renamed middleware to proxy)
- **Deployment**: Vercel at sparkplay-nu.vercel.app

## Project Rules

- `NEXT_PUBLIC_*` env vars are inlined at BUILD TIME — changing them in Vercel requires a fresh deploy
- Never commit `.env.local` — it is gitignored
- `src/lib/supabase/client.ts` → browser client, `src/lib/supabase/server.ts` → server client
- All API routes in `src/app/api/` check auth via `supabase.auth.getUser()` — never trust client-supplied user IDs
- Game content is stored as JSONB in `games.content` — always include `theme`, `ageGroup`, `childName` keys
- Themes and level configs live in `src/lib/themes.ts` — add new themes there, not inline in components
