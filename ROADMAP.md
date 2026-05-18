# SparkPlay — Remaining TODOs

Phase 4 core is done (rate-limiting, legal, Stripe, analytics). Below are the next items.

---

## 🇮🇳 India Payments — Razorpay + UPI

**Why:** Most of the target audience is in India. Stripe's India support for subscriptions is
limited and does not natively support UPI, NetBanking, or wallets.

**Steps:**

1. Sign up at https://razorpay.com → get test + live API keys
2. `npm install razorpay`
3. Add env vars (already in `.env.local.example`):
   ```
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
   ```
4. Create a `POST /api/razorpay/checkout` route:
   - Creates a Razorpay Order (`razorpay.orders.create`)
   - Returns `{ orderId, keyId, amount, currency: 'INR' }` to client
5. On the pricing page, detect Indian users (via `Intl.DateTimeFormat().resolvedOptions().timeZone`)
   and open the Razorpay checkout modal instead of redirecting to Stripe.
6. Create a `POST /api/razorpay/webhook` route to handle `payment.captured` and
   `subscription.activated`, then call the same `updateSubscription` helper from
   `src/app/api/stripe/webhook/route.ts`.

**INR pricing to configure in Razorpay:**
- Family: ₹499/mo
- Pro: ₹999/mo

**Reference:** https://razorpay.com/docs/payment-gateway/server-integration/nodejs/

---

## 📱 Mobile App — Play Store + App Store

**Goal:** Ship SparkPlay as a native app to reach parents who discover via app stores.

### Option A — PWA (fastest, 1–2 days)
- SparkPlay already works on mobile. Add `public/manifest.json` + service worker.
- Submit to Play Store as a TWA (Trusted Web Activity) — Google allows PWAs natively.
- iOS: add to home screen from Safari (no App Store submission needed for MVP).
- Tools: `next-pwa` package, Bubblewrap CLI for TWA packaging.

### Option B — React Native (most native, 4–6 weeks)
- Extract game logic from `src/lib/` — it's platform-agnostic (no DOM).
- Wrap games with React Native views.
- Use `expo` for easy iOS + Android builds.
- Shared API layer (already REST + Supabase).

**Recommended start:** Option A (PWA → TWA) — gets you on Play Store in 2 days with zero
new code. iOS home screen shortcut covers most Indian mobile users on Chrome/Safari.

**Steps for PWA/TWA:**
1. Add `src/app/manifest.json` with icons, theme_color, display: standalone
2. Add `<link rel="manifest" href="/manifest.json" />` to `src/app/layout.tsx`
3. Install `next-pwa`: `npm install next-pwa`
4. Configure in `next.config.ts`
5. Generate app icons (512×512, 192×192) — use the SparkPlay violet gradient
6. Test: Chrome DevTools → Application → Manifest
7. Build TWA: `npx @bubblewrap/cli init --manifest https://sparkplay-nu.vercel.app/manifest.json`
8. Sign APK and upload to Play Store (free $25 one-time developer fee)

---

## 🎨 Remaining Illustrations (TODO 5)

**Status:** 65 illustrations done (animals, dinos, unicorns, ocean partial).
**Remaining:** space, superheroes, farm, food (~44 images, ~$1.76 at current OpenAI pricing).

**Prerequisites:**
- Top up OpenAI account at https://platform.openai.com/settings/organization/billing
- Ensure `OPENAI_API_KEY` is set in `.env.local`

**Run per theme (one at a time to monitor):**
```bash
npx tsx scripts/generate-illustrations.ts space
npx tsx scripts/generate-illustrations.ts superheroes
npx tsx scripts/generate-illustrations.ts farm
npx tsx scripts/generate-illustrations.ts food
```

Each theme takes ~2 min and costs ~$0.80.
Images land in `public/illustrations/{theme}/`.

---

## 🔮 Phase 5 — Growth (after monetisation is live)

- Share links: `/play/[gameId]` — public URL to play a friend's game
- Email onboarding: welcome email + day-3 nudge (use Resend or Supabase Edge Functions)
- Parent dashboard: per-child progress view (mockup screen 10)
- Coloring Book game: template exists at `src/components/games/ColoringBook` (shows "coming soon")
- Runner game / Pet companion: needs Phaser 4 + sprite art (deferred)
