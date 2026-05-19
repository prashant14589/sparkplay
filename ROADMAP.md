# SparkPlay — Roadmap & Remaining TODOs

Last updated: 2026-05-19

---

## 🔴 Before charging real money (do in order)

### 1. Verify Supabase migration on live project
Run `supabase/migrations/verify_001.sql` in the Supabase SQL editor.
Confirms `profiles` and `ai_usage` tables exist. Without them:
- Everyone is treated as free tier (subscription checks silently fail)
- AI usage quota enforcement doesn't work

### 2. Stripe → live mode
1. Stripe dashboard → switch to **live** mode
2. Complete KYC (PAN + Indian bank account)
3. Re-create Family (₹499/mo) + Pro (₹999/mo) products in live mode
4. Update Vercel env vars: `STRIPE_SECRET_KEY`, `STRIPE_FAMILY_PRICE_ID`, `STRIPE_PRO_PRICE_ID`
5. Re-register webhook → update `STRIPE_WEBHOOK_SECRET`

### 3. Razorpay + UPI (India — critical)
Stripe doesn't support UPI or NetBanking. Indian audience can't pay without this.

**Steps:**
```bash
npm install razorpay
```
Add to `.env.local`:
```
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
```
Create routes:
- `POST /api/razorpay/checkout` — `razorpay.orders.create({ amount: 49900, currency: 'INR' })`
  → return `{ orderId, keyId, amount }` to client
- `POST /api/razorpay/webhook` — handle `payment.captured`, call same `updateSubscription`
  helper in `src/app/api/stripe/webhook/route.ts`

On `/pricing` page: detect India via `Intl.DateTimeFormat().resolvedOptions().timeZone`
→ open Razorpay checkout modal for INR, redirect to Stripe for other currencies.

TODO comments already in `src/app/api/stripe/checkout/route.ts` with full steps.
Reference: https://razorpay.com/docs/payment-gateway/server-integration/nodejs/

---

## 🟡 Phase 5 — Growth

### 4. Share links `/play/[gameId]`
Public URL that lets anyone play a game without logging in.
- New route `src/app/play/[id]/page.tsx` — fetch game by ID (no auth), render GamePreview
- Add "Copy share link" button to builder sidebar
- High virality: parent sends to grandparent → grandparent plays → discovers SparkPlay

### 5. Email onboarding
- Welcome email on signup (use Resend or Supabase Edge Functions)
- Day-3 nudge: "Your child hasn't played in 3 days — new dinosaur adventure waiting!"
- Triggered by Supabase auth webhook or a daily cron job

### 6. Parent dashboard
- Per-child progress: stars/coins/badges/streak per child name
- Currently all progress is global localStorage — need per-child localStorage keys
- Shows which games child played, time spent, levels completed

### 7. PWA → Play Store (2 days)
SparkPlay already works on mobile. Wrapping as a TWA gets it on Google Play instantly.

**Steps:**
1. Add `public/manifest.json`:
   ```json
   { "name": "SparkPlay", "short_name": "SparkPlay", "display": "standalone",
     "theme_color": "#7c3aed", "background_color": "#ffffff",
     "start_url": "/", "icons": [{ "src": "/icon-512.png", "sizes": "512x512" }] }
   ```
2. Add `<link rel="manifest" href="/manifest.json" />` to `src/app/layout.tsx`
3. `npm install next-pwa` → configure in `next.config.ts`
4. Generate icons (512×512, 192×192) — violet gradient ✦ logo
5. Test: Chrome DevTools → Application → Manifest
6. Build TWA: `npx @bubblewrap/cli init --manifest https://sparkplay-nu.vercel.app/manifest.json`
7. Sign APK → upload to Play Store ($25 one-time developer fee)
8. iOS: Safari "Add to Home Screen" — no App Store submission needed for MVP

---

## 🟢 Sprint 4 — Polish & Depth

### 8. Competitive / personal best for 8–12
- Show "Your best: 14 moves" prominently before game starts (localStorage)
- "Beat your record" mode — subtle pressure, right for this age group
- Affects: MemoryMatch, WordSearch, SlidingPuzzle, MazeGame, NumberMerge

### 9. Quiz question restructure by age
- 200 questions currently tagged only by level (1-5)
- Add `minAge / maxAge` fields to `QuizQuestion` type in `src/lib/quiz.ts`
- Re-tag each question so 4-6 gets genuinely simpler vocabulary, 8-12 gets real trivia
- Large effort (~1 day), deferred to Sprint 5

### 10. Buddy visual art
- Replace emoji buddy (🦕🦄🐶⚡) with illustrated characters
- Commission or generate 4 character illustrations (front-facing, celebrate pose)
- Use IllustrationImage component pattern already established
- High emotional impact — makes buddies feel like real characters

### 11. Animated theme environments
- CSS gradient backgrounds per theme already done (Sprint 3)
- Next level: subtle CSS animations (floating leaves for animals, stars for space)
- No JS needed — pure CSS keyframes added to globals.css

### 12. Coloring Book game
- Template exists in TEMPLATES array, shows "coming soon" in builder
- `src/components/games/ColoringBook` — needs implementation
- Could use SVG paths + CSS fill for colour-by-touch mechanic

---

## 🔵 Sprint 5 — Bigger bets

### 13. Supabase Storage for puzzle images
- Currently: base64 image (~2-4MB) saved to `games.content.puzzleImageUrl` (JSONB)
- Better: upload to Supabase Storage bucket `puzzle-images`, save public URL to content
- Optimization only needed once users have many completed puzzles

### 14. Runner game / Pet companion
- Concept: Phaser 4 infinite runner + pet that grows with child
- Needs: Phaser integration, sprite art, physics engine wiring
- Significant scope — estimate 3-4 weeks
- Highest engagement potential but highest effort

### 15. Coloring pages as printable product (Gumroad)
- Generate themed colouring book PDFs (8 pages per theme)
- Use SVG outlines of the commissioned illustrations
- Sell on Gumroad as a standalone product, link from SparkPlay

---

## ✅ Already done — for reference

- All 8 theme illustrations complete (103 PNGs) ✅
- Phase 4 monetisation infrastructure (Stripe sandbox, paywall, AI limits) ✅
- Sound engine (synthesised SFX + background music) ✅
- Buddy system with XP/levels ✅
- Daily quest system ✅
- Age-differentiated games (Tier 1: scenarios, vocabulary, difficulty) ✅
- Number Merge (2048) for 8-12 ✅
- Emotional-first home page (animated backgrounds, buddy greeting first) ✅
- Builder illustrated game/theme tiles ✅
- Print page fixed (hydration error, puzzle image, SparkPlay watermark) ✅
- LevelComplete gender fix (hero.png, no human character) ✅
