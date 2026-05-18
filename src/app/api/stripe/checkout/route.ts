import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// TODO (India): Add Razorpay checkout as alternative payment processor.
// Razorpay supports UPI, NetBanking, cards and wallets in India.
// Steps:
//   1. npm install razorpay
//   2. Add RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to .env.local
//   3. Create a razorpay instance: const razorpay = new Razorpay({ key_id, key_secret })
//   4. Create order: razorpay.orders.create({ amount: amountInPaise, currency: 'INR', ... })
//   5. Return the order_id + key_id to the client to open the Razorpay checkout modal
// Reference: https://razorpay.com/docs/payment-gateway/server-integration/nodejs/
//
// Detect India by checking Accept-Language / IP geolocation header, then route to
// Razorpay for INR and Stripe for all other currencies.

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })
  const PLANS: Record<string, { priceId: string; name: string }> = {
    family: { priceId: process.env.STRIPE_FAMILY_PRICE_ID ?? '', name: 'Family' },
    pro:    { priceId: process.env.STRIPE_PRO_PRICE_ID ?? '',    name: 'Pro'    },
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { plan } = await req.json() as { plan: string }
  const selectedPlan = PLANS[plan]

  if (!selectedPlan || !selectedPlan.priceId) {
    return NextResponse.json({ error: `Invalid or unconfigured plan: ${plan}` }, { status: 400 })
  }

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id as string | undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const origin = req.headers.get('origin') ?? 'https://sparkplay-nu.vercel.app'

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?subscribed=1`,
    cancel_url: `${origin}/pricing?cancelled=1`,
    metadata: { supabase_user_id: user.id, plan },
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan },
    },
  })

  return NextResponse.json({ url: session.url })
}
