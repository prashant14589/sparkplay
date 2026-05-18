import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — SparkPlay',
  description: 'How SparkPlay collects, uses, and protects your data.',
}

const EFFECTIVE_DATE = 'May 19, 2026'
const CONTACT_EMAIL = 'privacy@sparkplay.app'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">← Back to SparkPlay</Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 prose prose-gray">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Effective date: {EFFECTIVE_DATE}</p>

        <Section title="1. Who we are">
          <p>SparkPlay (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is a children&apos;s educational games platform. Our website is available at sparkplay-nu.vercel.app. For privacy questions contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
        </Section>

        <Section title="2. Information we collect">
          <ul>
            <li><strong>Account information:</strong> name and email address when you register.</li>
            <li><strong>Child&apos;s first name:</strong> optionally provided by the parent/guardian to personalise games. This is stored locally on your device (localStorage) and is never shared with third parties.</li>
            <li><strong>Usage data:</strong> game plays, level completions, story generations — used only to improve the service and enforce fair-use quotas.</li>
            <li><strong>Payment information:</strong> handled entirely by Stripe or Razorpay. We never store card numbers or UPI details.</li>
            <li><strong>Cookies:</strong> a single session cookie from Supabase to keep you logged in. We do not use advertising trackers.</li>
          </ul>
        </Section>

        <Section title="3. COPPA — Children's Online Privacy Protection Act (US)">
          <p>SparkPlay is designed for parents and guardians to use <em>on behalf of</em> children under 13. We do not knowingly collect personal information directly from children under 13 without verifiable parental consent.</p>
          <p>By creating an account you confirm that you are at least 18 years old (or the legal age of majority in your jurisdiction) and are acting as a parent or guardian.</p>
          <p>If you believe a child under 13 has provided us with personal information without your consent, contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will delete it within 30 days.</p>
        </Section>

        <Section title="4. GDPR / UK-GDPR (European &amp; UK users)">
          <p>If you are located in the European Economic Area or the United Kingdom, you have the following rights under GDPR / UK-GDPR:</p>
          <ul>
            <li><strong>Right of access</strong> — request a copy of your data.</li>
            <li><strong>Right to rectification</strong> — correct inaccurate data.</li>
            <li><strong>Right to erasure</strong> — ask us to delete your account and all associated data.</li>
            <li><strong>Right to portability</strong> — receive your data in a machine-readable format.</li>
            <li><strong>Right to object</strong> — object to processing based on legitimate interests.</li>
          </ul>
          <p>Our lawful basis for processing is <strong>contract performance</strong> (providing the service you signed up for) and <strong>legitimate interests</strong> (preventing abuse). To exercise any right, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>
        </Section>

        <Section title="5. India — Digital Personal Data Protection Act (DPDP) 2023">
          <p>For users in India, we process personal data in accordance with the Digital Personal Data Protection Act 2023. You have the right to access, correct, and erase your personal data. Contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to exercise these rights.</p>
        </Section>

        <Section title="6. How we use your data">
          <ul>
            <li>To create and manage your account.</li>
            <li>To personalise games with your child&apos;s name.</li>
            <li>To enforce AI generation quotas (free vs paid).</li>
            <li>To process payments via Stripe / Razorpay.</li>
            <li>To send transactional emails (account confirmation, receipts).</li>
            <li>To improve our service using aggregated, anonymised analytics.</li>
          </ul>
          <p>We do <strong>not</strong> sell your data. We do <strong>not</strong> show you advertisements.</p>
        </Section>

        <Section title="7. Data retention">
          <p>We retain your account data for as long as your account is active. If you delete your account, all personal data is removed within 30 days, except where we are required by law to retain it (e.g. payment records for 7 years under Indian tax law).</p>
        </Section>

        <Section title="8. Third-party services">
          <ul>
            <li><strong>Supabase</strong> — authentication and database (hosted in US/EU).</li>
            <li><strong>Anthropic</strong> — AI story generation (prompts are not stored by Anthropic beyond the API call).</li>
            <li><strong>OpenAI</strong> — AI puzzle image generation (same policy).</li>
            <li><strong>Stripe</strong> — payment processing (PCI-DSS Level 1 certified).</li>
            <li><strong>Razorpay</strong> — payment processing for India (PCI-DSS compliant).</li>
            <li><strong>Vercel</strong> — hosting and edge functions.</li>
          </ul>
        </Section>

        <Section title="9. Security">
          <p>We use HTTPS everywhere, Supabase Row Level Security on all tables, and we never log API keys or passwords. Passwords are hashed by Supabase (bcrypt). Payment data never touches our servers.</p>
        </Section>

        <Section title="10. Changes to this policy">
          <p>We may update this policy. When we do, we will update the effective date above and, for material changes, notify you by email.</p>
        </Section>

        <Section title="11. Contact">
          <p>SparkPlay privacy team: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
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
