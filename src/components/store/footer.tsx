'use client'

import { Dumbbell } from 'lucide-react'
import { useNavStore } from '@/store/nav-store'

const SHOP_LINKS = [
  { label: 'Whey Protein', slug: 'protein' },
  { label: 'Pre-Workout', slug: 'pre-workout' },
  { label: 'Creatine', slug: 'creatine' },
  { label: 'Amino Acids', slug: 'amino' },
  { label: 'Accessories', slug: 'accessories' },
  { label: 'Bundles & Sets', slug: 'bundles' },
]

const HELP_LINKS = [
  { label: 'Shipping & Returns', slug: 'shipping' as const },
  { label: 'FAQ', slug: 'faq' as const },
  { label: 'About FUELD', slug: 'about' as const },
]

const LEGAL = ['Imprint', 'Privacy Policy', 'Terms & Conditions', 'Right of Withdrawal']

const PAYMENTS = ['VISA', 'Mastercard', 'PayPal', 'Klarna', 'Apple Pay']

export function Footer() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <footer className="mt-auto bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <button
              onClick={() => navigate({ name: 'home' })}
              className="mb-3 flex items-center gap-1.5"
              aria-label="FUELD — go to homepage"
            >
              <Dumbbell size={20} className="text-primary" />
              <span className="text-lg font-extrabold tracking-tight text-white">
                FUELD<span className="text-primary">.</span>
              </span>
            </button>
            <p className="text-xs leading-relaxed">
              Premium sports nutrition, curated for people who train. Official ESN
              partner — lab-tested quality from Germany.
            </p>
          </div>

          <nav aria-label="Shop categories">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Shop</h3>
            <ul className="space-y-2">
              {SHOP_LINKS.map((l) => (
                <li key={l.slug}>
                  <button
                    onClick={() => navigate({ name: 'category', slug: l.slug })}
                    className="text-xs hover:text-white"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Help and company">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Help</h3>
            <ul className="space-y-2">
              {HELP_LINKS.map((l) => (
                <li key={l.slug}>
                  <button
                    onClick={() => navigate({ name: 'page', slug: l.slug })}
                    className="text-xs hover:text-white"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">
              Contact
            </h3>
            <address className="text-xs not-italic leading-relaxed">
              FUELD Nutrition GmbH
              <br />
              Musterstraße 12, 10999 Berlin
              <br />
              support@fueld.example
              <br />
              Mon–Fri, 9:00–17:00
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-300"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {LEGAL.map((l) => (
              <button
                key={l}
                onClick={() => navigate({ name: 'page', slug: 'faq' })}
                className="text-[11px] text-zinc-500 hover:text-white"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[11px] text-zinc-600">
          © {new Date().getFullYear()} FUELD Nutrition GmbH. All prices incl. VAT, excl.
          shipping. Food supplements are no substitute for a balanced diet.
        </p>
      </div>
    </footer>
  )
}
