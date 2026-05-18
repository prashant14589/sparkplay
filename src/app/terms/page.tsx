import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — SparkPlay',
  description: 'SparkPlay terms of service and acceptable use policy.',
}

const EFFECTIVE_DATE = 'May 19, 2026'
const CONTACT_EMAIL = 'support@sparkplay.app'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">← Back to SparkPlay</Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Effective date: {EFFECTIVE_DATE}</p>

        <Section title="1. Acceptance">
          <p>By creating a SparkPlay account you agree to these Terms. If you are registering on behalf of a child, you confirm you are a parent or guardian aged 18 or older and accept these Terms on their behalf.</p>
        </Section>

        <Section title="2. The service">
          <p>SparkPlay provides personalised educational games, AI-generated stories, and AI-generated puzzle images for children. Access requires a registered account. Some features require a paid subscription.</p>
        </Section>

        <Section title="3. Account eligibility">
          <ul>
            <li>You must be at least 18 years old (or the legal age of majority in your country) to create an account.</li>
            <li>Accounts are for personal, family use only.</li>
            <li>You are responsible for keeping your password secure.</li>
            <li>One account per household on the Free plan; the Family and Pro plans allow multiple profiles.</li>
          </ul>
        </Section>

        <Section title="4. Subscriptions and billing">
          <ul>
            <li><strong>Free plan:</strong> 3 AI story generations and 3 AI puzzle images per day. All other games are unlimited.</li>
            <li><strong>Family plan (₹499/mo or $4.99/mo):</strong> 20 AI generations per day, all games unlocked.</li>
            <li><strong>Pro plan (₹999/mo or $9.99/mo):</strong> 20 AI generations per day, all games unlocked, priority support.</li>
            <li>Subscriptions renew automatically. Cancel any time from your account settings — you retain access until the end of the billing period.</li>
            <li>Payments processed by Stripe (international) or Razorpay (India).</li>
            <li>Refunds within 7 days of initial purchase if you are unsatisfied. Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 underline">{CONTACT_EMAIL}</a>.</li>
          </ul>
        </Section>

        <Section title="5. AI-generated content">
          <ul>
            <li>AI stories and images are generated on demand and are not stored on our servers after delivery to you.</li>
            <li>Content is filtered to be age-appropriate, but AI is imperfect — please review content before sharing with very young children.</li>
            <li>You may print and keep AI-generated content for personal use. You may not resell or republish it at scale.</li>
          </ul>
        </Section>

        <Section title="6. Acceptable use">
          <p>You must not:</p>
          <ul>
            <li>Attempt to circumvent AI rate limits (e.g. scripted calls, multiple accounts).</li>
            <li>Use SparkPlay to generate harmful, illegal, or adult content.</li>
            <li>Scrape, clone, or reverse-engineer the service.</li>
          </ul>
          <p>Violation may result in immediate account termination without refund.</p>
        </Section>

        <Section title="7. Intellectual property">
          <p>The SparkPlay platform, game logic, artwork, and brand are owned by SparkPlay. AI-generated stories and images created using your prompts are licensed to you for personal use under a non-exclusive, non-transferable licence.</p>
        </Section>

        <Section title="8. Disclaimers &amp; limitation of liability">
          <p>SparkPlay is provided &ldquo;as is&rdquo;. We do not guarantee uninterrupted service. To the maximum extent permitted by law, our aggregate liability is limited to the amount you paid us in the 12 months preceding the claim.</p>
        </Section>

        <Section title="9. Governing law">
          <p>These Terms are governed by the laws of India. Disputes shall be resolved by arbitration in accordance with the Arbitration and Conciliation Act 1996 (India), or in the courts of Bengaluru, Karnataka, India.</p>
        </Section>

        <Section title="10. Changes">
          <p>We may update these Terms. Continued use after 30 days&apos; notice of material changes constitutes acceptance.</p>
        </Section>

        <Section title="11. Contact">
          <p><a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 underline">{CONTACT_EMAIL}</a></p>
        </Section>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
      <div className="text-gray-700 space-y-2 text-[15px] leading-relaxed">{children}</div>
    </section>
  )
}
