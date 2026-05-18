import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const FREE_DAILY_LIMIT = 3
const PAID_DAILY_LIMIT = 20

// Service-role client bypasses RLS for inserts
function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export type RateLimitResult =
  | { ok: true; userId: string }
  | { ok: false; response: ReturnType<typeof NextResponse.json> }

export async function checkAiRateLimit(action: 'story' | 'puzzle'): Promise<RateLimitResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Sign in to generate stories and puzzles', upgradeUrl: '/signup' },
        { status: 401 }
      ),
    }
  }

  // Get subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status')
    .eq('id', user.id)
    .single()

  const isPaid =
    profile?.subscription_tier !== 'free' &&
    profile?.subscription_status === 'active'

  const dailyLimit = isPaid ? PAID_DAILY_LIMIT : FREE_DAILY_LIMIT

  // Count today's usage
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('action', action)
    .gte('created_at', todayStart.toISOString())

  const usedToday = count ?? 0

  if (usedToday >= dailyLimit) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: isPaid
            ? `Daily limit of ${dailyLimit} reached. Resets at midnight.`
            : `Free plan: ${dailyLimit} ${action === 'story' ? 'stories' : 'puzzles'} per day. Upgrade for ${PAID_DAILY_LIMIT}/day.`,
          limitReached: true,
          used: usedToday,
          limit: dailyLimit,
          upgradeUrl: '/pricing',
        },
        { status: 429 }
      ),
    }
  }

  // Record this usage (service role to bypass RLS)
  await serviceClient()
    .from('ai_usage')
    .insert({ user_id: user.id, action })

  return { ok: true, userId: user.id }
}
