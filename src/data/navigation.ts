/**
 * Navigation model: header menu, protein mega-dropdown, footer link columns and
 * the registry of client-routed static pages.
 *
 * Every entry carries the `View` it navigates to, so components never build a
 * view object by hand.
 */

import type { View } from '@/lib/types'
import {
  CATEGORY_SLUGS,
  HERO_CATEGORY_SLUG,
  SEARCH_CATEGORY_SLUG,
  type CategorySlug,
} from './categories'
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

/** The landing path. Kept as a constant so route building stays consistent. */
export const PATH_ROOT = '/'

/** Single-segment path prefixes, and the collection they address. */
export const PATH_PREFIX = {
  category: 'category',
  product: 'product',
  brand: 'brand',
  search: 'search',
  order: 'order',
  checkout: 'checkout',
} as const

/** Compact USP strip pinned above the header. */
export const USP_BAR: readonly { label: string; icon: import('./icons').IconName }[] = [
  { label: 'Worldwide Shipping Available', icon: 'truck' },
  { label: `Official ${HERO_BRAND.label} dealer — lab-tested quality`, icon: 'shield-check' },
  { label: 'Dispatched in 24h', icon: 'zap' },
]

/* ── URL scheme ───────────────────────────────────────────────────────────
 * The path is the single source of truth for "which view am I on", so a
 * refresh, a deep link and the browser back button all work. These two
 * functions are the only place that maps between a `View` and a path.
 */

/**
 * Path for a view. Always absolute, so `router.push` replaces the whole path
 * instead of resolving it relative to the current URL. Search lives at
 * `/search/<query>`; other pages are explicit.
 */
export function viewPath(view: View): string {
  switch (view.name) {
    case 'home':
      return PATH_ROOT
    case 'checkout':
      return `/${PATH_PREFIX.checkout}`
    case 'page':
      return `/${view.slug}`
    case 'confirmation':
      return `/${PATH_PREFIX.order}/${encodeURIComponent(view.orderNumber)}`
    case 'brand':
      return `/${PATH_PREFIX.brand}/${view.slug}`
    case 'product':
      return `/${PATH_PREFIX.product}/${view.slug}`
    case 'category':
      if (view.slug === SEARCH_CATEGORY_SLUG) {
        return view.q ? `/${PATH_PREFIX.search}/${encodeURIComponent(view.q)}` : `/${PATH_PREFIX.search}`
      }
      return `/${PATH_PREFIX.category}/${view.slug}`
  }
}

/**
 * View for a path, or `null` when the path is not a storefront route.
 * `segments` is the pathname split on `/`, with empty parts removed.
 */
export function pathView(segments: string[]): View | null {
  const [head, second] = segments

  if (!head) return HOME_VIEW

  // Single-segment paths: the search index, checkout and the static pages.
  if (segments.length === 1) {
    if (head === PATH_PREFIX.search) return { name: 'category', slug: SEARCH_CATEGORY_SLUG }
    if (head === PATH_PREFIX.checkout) return { name: 'checkout' }
    if (isStaticPageSlug(head)) return { name: 'page', slug: head }
    return null
  }

  if (head === PATH_PREFIX.search) {
    return { name: 'category', slug: SEARCH_CATEGORY_SLUG, q: safeDecode(second) }
  }
  if (segments.length !== 2) return null
  if (head === PATH_PREFIX.category) return { name: 'category', slug: second }
  if (head === PATH_PREFIX.product) return { name: 'product', slug: second }
  if (head === PATH_PREFIX.brand) return { name: 'brand', slug: second }
  if (head === PATH_PREFIX.order) {
    return { name: 'confirmation', orderNumber: safeDecode(second) }
  }

  return null
}

/** Split a pathname into view segments. */
export function pathSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean)
}

/** Stable key for a view, used to reset scroll and to compare navigations. */
export function viewKey(v: View): string {
  return viewPath(v)
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    // A hand-typed or truncated URL can carry an invalid escape sequence.
    return value
  }
}

/** Destination used by every "go to protein" CTA. */
export const PROTEIN_VIEW: View = { name: 'category', slug: HERO_CATEGORY_SLUG }
export const HOME_VIEW: View = { name: 'home' }
export const ABOUT_VIEW: View = { name: 'page', slug: 'about' }
export const CHECKOUT_VIEW: View = { name: 'checkout' }
