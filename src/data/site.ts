/**
 * Brand, company and SEO metadata.
 * Single source of truth — `app/layout.tsx` builds `metadata` from here.
 */

import { FREE_SHIPPING_THRESHOLD, type MoneyFormat } from './commerce'
import { DEFAULT_LOCALE, formatMoney } from '../lib/format'

/** Formatter bound to the default locale, for non-reactive data like metadata. */
const defaultMoney: MoneyFormat = (amount) => formatMoney(amount, DEFAULT_LOCALE)

export const SITE = {
  name: 'Clarika Fitness',
  legalName: 'Clarika Fitness',
  /** Logo lockup renders as the wordmark plus an optional coloured suffix. */
  wordmark: 'Clarika Fitness',
  /** No trailing glyph: the wordmark already reads as a complete brand. */
  wordmarkSuffix: '',
  tagline: 'Premium sports nutrition, curated for people who train.',
  blurb:
    'Official ESN partner — lab-tested quality from Germany.',
  address: {
    city: 'Accra',
    country: 'Ghana',
  },
  supportEmail: 'clarikadigital@gmail.com',
  returnsEmail: 'clarikadigital@gmail.com',
  supportHours: 'Mon–Fri, 9:00–17:00',
  /**
   * WhatsApp contact. `number` is digits-only with no `+` or separators, which
   * is what wa.me requires; `display` is what the customer sees.
   */
  whatsapp: {
    number: '233203178222',
    display: '+233203178222',
    url: 'https://wa.me/233203178222',
  },
  /** Attribution link rendered in the footer. */
  credits: {
    label: 'Teva Clarika Digital',
    url: 'https://www.clarikadigital.net',
  },
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

/**
 * Server-rendered metadata. Crawlers get a single static value, so these use
 * the *default* locale rather than the shopper's — see `seoDescription`.
 */
export const seoDescription = (money: MoneyFormat) =>
  `Official ESN dealer: whey protein, pre-workout, creatine and more. Lab-tested quality, fast dispatch, free shipping over ${money(FREE_SHIPPING_THRESHOLD)}.`

export const SEO = {
  title: 'Clarika Fitness — Premium Sports Nutrition | ESN Whey Protein & More',
  /** Renders in the default locale; use `seoDescription(money)` where a locale is known. */
  description: seoDescription(defaultMoney),
  keywords: [
    'whey protein',
    'ESN',
    'sports nutrition',
    'creatine',
    'pre-workout',
    'supplements',
  ],
  author: 'Clarika Fitness',
  openGraphTitle: 'Clarika Fitness — Premium Sports Nutrition',
  openGraphDescription:
    'Whey protein first: ESN Designer Whey, Isoclear, creatine & stacks.',
  siteName: 'Clarika Fitness',
  /** `<html lang>`. `LocaleSync` keeps it in sync after a locale switch. */
  htmlLang: DEFAULT_LOCALE.tag,
  /** Open Graph wants `lang_REGION`, e.g. `en_GH`. */
  ogLocale: DEFAULT_LOCALE.tag.replace('-', '_'),
  iconUrl: 'https://z-cdn.chatglm.cn/z-ai/static/logo.svg',
} as const

/** Badges shown in the footer as accepted payment methods. */
export const PAYMENT_BADGES = ['VISA', 'Mastercard', 'PayPal', 'Klarna', 'Apple Pay'] as const
