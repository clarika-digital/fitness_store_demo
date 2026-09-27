/**
 * Navigation model: header menu, protein mega-dropdown, footer link columns and
 * the registry of client-routed static pages.
 *
 * Every entry carries the `View` it navigates to, so components never build a
 * view object by hand.
 */

import type { View } from '@/lib/types'
import { CATEGORY_SLUGS, HERO_CATEGORY_SLUG, type CategorySlug } from './categories'
import { FREE_SHIPPING_THRESHOLD } from './commerce'
import { FEATURED_PRODUCTS } from './products'
import { HERO_BRAND, SITE } from './site'

export type NavItem = {
  label: string
  view: View
  /** Renders a hover panel of product shortcuts. */
  dropdown?: boolean
}

export const MAIN_NAV: readonly NavItem[] = [
  {
    label: 'Protein',
    view: { name: 'category', slug: HERO_CATEGORY_SLUG },
    dropdown: true,
  },
  { label: 'Pre-Workout', view: { name: 'category', slug: 'pre-workout' } },
  { label: 'Creatine', view: { name: 'category', slug: 'creatine' } },
  { label: 'Amino Acids', view: { name: 'category', slug: 'amino' } },
  { label: 'Vitamins', view: { name: 'category', slug: 'vitamins' } },
  { label: 'Accessories', view: { name: 'category', slug: 'accessories' } },
  { label: 'Equipment', view: { name: 'category', slug: 'equipment' } },
  { label: 'Bundles', view: { name: 'category', slug: 'bundles' } },
  {
    label: HERO_BRAND.navLabel,
    view: { name: 'brand', slug: HERO_BRAND.slug },
  },
]

export type NavDropdownEntry = {
  label: string
  description: string
  view: View
}

export const PROTEIN_DROPDOWN: readonly NavDropdownEntry[] = [
  {
    label: 'Designer Whey',
    description: 'The #1 whey — 76% protein',
    view: { name: 'product', slug: FEATURED_PRODUCTS.designerWhey },
  },
  {
    label: 'Isoclear',
    description: 'Clear whey isolate, lactose-free',
    view: { name: 'product', slug: FEATURED_PRODUCTS.isoclear },
  },
  {
    label: 'Vegan Protein',
    description: '100% plant-based',
    view: { name: 'product', slug: FEATURED_PRODUCTS.veganProtein },
  },
]

/**
 * Footer links use shopper-facing labels, which intentionally differ from the
 * header nav ("Whey Protein" rather than "Protein").
 */
export const FOOTER_CATEGORY_LABELS: Record<CategorySlug, string> = {
  protein: 'Whey Protein',
  'pre-workout': 'Pre-Workout',
  creatine: 'Creatine',
  amino: 'Amino Acids',
  vitamins: 'Vitamins',
  accessories: 'Accessories',
  equipment: 'Equipment',
  bundles: 'Bundles & Sets',
}

export const FOOTER_SHOP_LINKS: readonly NavItem[] = CATEGORY_SLUGS.map((slug) => ({
  label: FOOTER_CATEGORY_LABELS[slug],
  view: { name: 'category', slug },
}))

export const FOOTER_HELP_LINKS: readonly NavItem[] = [
  { label: 'Shipping & Returns', view: { name: 'page', slug: 'shipping' } },
  { label: 'FAQ', view: { name: 'page', slug: 'faq' } },
  { label: `About ${SITE.name}`, view: { name: 'page', slug: 'about' } },
]

/** Legal links are placeholders; they all route to the FAQ until real pages land. */
export const FOOTER_LEGAL_LINKS: readonly string[] = [
  'Imprint',
  'Privacy Policy',
  'Terms & Conditions',
  'Right of Withdrawal',
]

export const FOOTER_LEGAL_FALLBACK_VIEW: View = { name: 'page', slug: 'faq' }

export const STATIC_PAGE_SLUGS = ['shipping', 'about', 'faq'] as const
export type StaticPageSlug = (typeof STATIC_PAGE_SLUGS)[number]

export function isStaticPageSlug(value: string): value is StaticPageSlug {
  return (STATIC_PAGE_SLUGS as readonly string[]).includes(value)
}

/** Compact USP strip pinned above the header. */
export const USP_BAR: readonly { label: string; icon: import('./icons').IconName }[] = [
  { label: `Free shipping over €${FREE_SHIPPING_THRESHOLD}`, icon: 'truck' },
  { label: `Official ${HERO_BRAND.label} dealer — lab-tested quality`, icon: 'shield-check' },
  { label: 'Dispatched in 24h', icon: 'zap' },
]

/** Tunables for the client-side navigation model in `store/nav-store`. */
export const NAV_CONFIG = {
  /** How many views the back stack keeps. */
  historyLimit: 20,
} as const

/** Destination used by every "go to protein" CTA. */
export const PROTEIN_VIEW: View = { name: 'category', slug: HERO_CATEGORY_SLUG }
export const HOME_VIEW: View = { name: 'home' }
export const ABOUT_VIEW: View = { name: 'page', slug: 'about' }
export const CHECKOUT_VIEW: View = { name: 'checkout' }
