/** Copy for the home page sections, in render order. */

import type { MoneyFormat } from '../commerce'
import type { IconName } from '../icons'
import { BUNDLE_PROMO } from '../products'
import { HERO_BRAND } from '../site'

/** Buttons and links reused by several home-page sections. */
export const COMMON_CTA_COPY = {
  backToHome: 'Back to home',
  tryAgain: 'Try again',
  view: 'View',
} as const

export const HERO_COPY = {
  eyebrow: `Official ${HERO_BRAND.label} Dealer`,
  title: 'Whey, done properly.',
  body: `ESN Designer Whey — 76% protein, perfectly soluble, legendary flavors. The protein thousands of lifters reorder every month.`,
  primaryCta: 'Shop Whey Protein',
  secondaryCta: 'Our quality promise',
  chipsAriaLabel: 'Store trust highlights',
  trustChips: [
    { icon: 'star', label: '4.8 · 12,000+ reviews', tone: 'star' },
    { icon: 'sparkles', label: '25+ flavors', tone: 'primary' },
    { icon: 'flask-conical', label: 'Lab-tested in Germany', tone: 'primary' },
  ] as { icon: IconName; label: string; tone: 'star' | 'primary' }[],
} as const

export const TRUST_STRIP_COPY = {
  ariaLabel: 'Store guarantees',
  items: [
    {
      icon: 'truck',
      title: 'Worldwide Shipping Available',
      sub: 'Tracked delivery to most countries',
    },
    {
      icon: 'shield-check',
      title: 'Official ESN dealer',
      sub: 'Sealed tubs, full manufacturer warranty',
    },
    {
      icon: 'zap',
      title: 'Dispatched in 24h',
      sub: 'Mon–Fri, straight from our warehouse',
    },
    {
      icon: 'rotate-ccw',
      title: '30-day returns',
      sub: 'Unopened products, no questions asked',
    },
  ] as { icon: IconName; title: string; sub: string }[],
} as const

export const CATEGORY_TILES_COPY = {
  eyebrow: 'Shop by category',
  title: 'Built around protein',
} as const

export const BESTSELLERS_COPY = {
  eyebrow: 'Most ordered',
  title: 'Our bestsellers',
  subtitle: 'Ranked by real orders from the last 30 days.',
  errorTitle: 'Bestsellers couldn’t be loaded. Check your connection and try again.',
  emptyTitle: 'No bestsellers yet — check back soon.',
} as const

export const BUNDLE_BANNER_COPY = {
  eyebrow: 'Limited bundle',
  title: 'Whey Starter Bundle',
  body: (money: MoneyFormat) =>
    `Designer Whey 1 kg + Fuel’d Shaker — ${money(BUNDLE_PROMO.saving)} cheaper together. Everything a first order needs.`,
  saveLabel: (money: MoneyFormat) => `Save ${money(BUNDLE_PROMO.saving)}`,
  cta: 'Get the bundle',
} as const

export const BRAND_STRIP_COPY = {
  prefix: 'Official dealer for',
  brandAriaLabel: HERO_BRAND.label,
  cta: `Visit the ${HERO_BRAND.label} Brand Shop`,
} as const

export const REVIEWS_SECTION_COPY = {
  eyebrow: 'What lifters say',
  outOf: '/5',
  summary: (count: string) => `${count} verified reviews across our store`,
  testimonials: [
    {
      name: 'Jonas M.',
      detail: 'Verified buyer · reorders every 5 weeks',
      text: 'Reordered Designer Whey for the fifth time now — every five weeks like clockwork. It mixes clean with just water and a shaker, no clumps, and Vanilla actually tastes like vanilla.',
    },
    {
      name: 'Lea K.',
      detail: 'Verified buyer · Salted Caramel Whey',
      text: 'I’m picky with flavor and this is the first whey I finished to the last scoop. Salted Caramel is dangerously good. Delivery took two days and the batch was freshly dated.',
    },
    {
      name: 'Deniz A.',
      detail: 'Verified buyer · EAA + Citrulline',
      text: 'Ordered at 9pm, it shipped the next morning and arrived the day after. Prices are honest with no fake discounts — that’s why I keep coming back for my training fuel.',
    },
  ] as { name: string; detail: string; text: string }[],
  errorTitle: 'Review stats couldn’t be loaded.',
  retry: COMMON_CTA_COPY.tryAgain,
} as const

export const NEWSLETTER_COPY = {
  title: 'Get 10% off your first order',
  subtitle: 'Flavor drops, restock alerts and training fuel tips. No spam.',
  successTitle: 'You’re in — the code is yours.',
  successBody: 'Enter this code at checkout to claim 10% off your first order.',
  emailAriaLabel: 'Email address',
  cta: 'Claim 10%',
  pendingCta: 'Claiming…',
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
  copyAriaLabel: (code: string) => `Copy discount code ${code}`,
  finePrint: 'One email per week, max. Unsubscribe anytime.',
  toast: {
    successTitle: 'Welcome aboard!',
    successBody: 'Your 10% welcome code is ready below.',
    errorTitle: 'Subscription failed',
    copyTitle: 'Code copied',
    copyBody: (code: string) => `${code} is on your clipboard.`,
    copyErrorTitle: 'Copy failed',
    copyErrorBody: 'Please copy the code manually.',
    fallbackError: 'Something went wrong. Please try again.',
  },
} as const
