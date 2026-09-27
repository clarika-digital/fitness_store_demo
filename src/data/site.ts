/**
 * Brand, company and SEO metadata.
 * Single source of truth — `app/layout.tsx` builds `metadata` from here.
 */

export const SITE = {
  name: 'FUELD',
  legalName: 'FUELD Nutrition GmbH',
  /** Logo lockup renders as `FUELD` + a period in the primary colour. */
  wordmark: 'FUELD',
  wordmarkSuffix: '.',
  tagline: 'Premium sports nutrition, curated for people who train.',
  blurb:
    'Official ESN partner — lab-tested quality from Germany.',
  address: {
    street: 'Musterstraße 12',
    zip: '10999',
    city: 'Berlin',
  },
  supportEmail: 'support@fueld.example',
  returnsEmail: 'returns@fueld.store',
  supportHours: 'Mon–Fri, 9:00–17:00',
  disclaimer:
    'Food supplements are no substitute for a balanced diet.',
  vatNote: 'All prices incl. VAT, excl. shipping.',
} as const

/** The one brand we stock in depth; the whole catalog is ESN-led. */
export const HERO_BRAND = {
  slug: 'esn',
  label: 'ESN',
  longName: 'European Sports Nutrition',
  shopLabel: 'ESN Brand Shop',
  navLabel: 'ESN Brand Shop',
  tagline: 'Germany’s most-ordered whey.',
} as const

export const SEO = {
  title: 'FUELD — Premium Sports Nutrition | ESN Whey Protein & More',
  description:
    'Official ESN dealer: whey protein, pre-workout, creatine and more. Lab-tested quality, fast dispatch, free shipping over €59.',
  keywords: [
    'whey protein',
    'ESN',
    'sports nutrition',
    'creatine',
    'pre-workout',
    'supplements',
  ],
  author: 'FUELD Nutrition',
  openGraphTitle: 'FUELD — Premium Sports Nutrition',
  openGraphDescription:
    'Whey protein first: ESN Designer Whey, Isoclear, creatine & stacks.',
  siteName: 'FUELD',
  locale: 'en',
  iconUrl: 'https://z-cdn.chatglm.cn/z-ai/static/logo.svg',
} as const

/** Badges shown in the footer as accepted payment methods. */
export const PAYMENT_BADGES = ['VISA', 'Mastercard', 'PayPal', 'Klarna', 'Apple Pay'] as const
