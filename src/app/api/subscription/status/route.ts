import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ tier: 'free', status: 'inactive', isPaid: false })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status')
    .eq('id', user.id)
    .single()

  const tier = profile?.subscription_tier ?? 'free'
  const status = profile?.subscription_status ?? 'inactive'
  const isPaid = tier !== 'free' && status === 'active'

  return NextResponse.json({ tier, status, isPaid })
}
