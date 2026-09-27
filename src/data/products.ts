/**
 * Product-level display config: sort options, unit labels, featured slugs and the
 * trust rows shown next to a buy button.
 *
 * Product copy itself (name, tagline, description, nutrition) lives in the
 * database — never duplicate it here.
 */

import type { SortOption } from '@/lib/types'
import { FREE_SHIPPING_THRESHOLD } from './commerce'
import type { IconName } from './icons'

export const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'rating', label: 'Top rated' },
]

export const DEFAULT_SORT: SortOption = 'popular'

/** Accepted `sort` query values; anything else falls back to DEFAULT_SORT. */
export const SORT_VALUES: readonly SortOption[] = SORT_OPTIONS.map((o) => o.value)

export function isSortOption(value: unknown): value is SortOption {
  return typeof value === 'string' && (SORT_VALUES as readonly string[]).includes(value)
}

/** Suffixes appended to computed per-unit prices. */
export const UNIT_LABELS = {
  perKg: '/kg',
  perServing: '/serving',
} as const

export const BADGE_LABELS = {
  bestseller: 'Bestseller',
  popular: 'Popular',
  outOfStock: 'Out of stock',
  verifiedPurchase: 'Verified purchase',
} as const

/** Star glyph used next to distribution bars. */
export const RATING_STAR = '★'
export const RATING_MAX = 5
export const RATING_OUT_OF = '/5'
/** Decimal places ratings are rounded to before display. */
export const RATING_DISPLAY_PRECISION = 1

/** Slugs the store links to directly from editorial surfaces. */
export const FEATURED_PRODUCTS = {
  designerWhey: 'esn-designer-whey',
  isoclear: 'esn-isoclear',
  veganProtein: 'esn-vegan-protein',
  sampleBox: 'whey-sample-box',
  starterBundle: 'whey-starter-bundle',
} as const

/** Promo bundle pricing shown in the home banner. */
export const BUNDLE_PROMO = {
  slug: FEATURED_PRODUCTS.starterBundle,
  price: 34.9,
  comparePrice: 39.8,
  /** Computed from the two prices above, but pinned so copy and UI agree. */
  saving: 4.9,
} as const

/** Trust row under the PDP buy button and in the static-page feature list. */
export const PDP_TRUST_ROW: readonly { label: string; icon: IconName }[] = [
  { label: `Free shipping over €${FREE_SHIPPING_THRESHOLD}`, icon: 'truck' },
  { label: 'Ships in 24h', icon: 'zap' },
  { label: '30-day returns', icon: 'rotate-ccw' },
]

/** Value props on the ESN brand page. */
export const BRAND_VALUES: readonly { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'map-pin',
    title: 'Produced in Germany',
    text: 'Own production lines — short paths, full control over every batch.',
  },
  {
    icon: 'flask-conical',
    title: 'Regularly lab-tested',
    text: 'Batches checked for purity and label accuracy, so the tub matches the promise.',
  },
  {
    icon: 'sparkles',
    title: 'Flavor obsession',
    text: '25+ flavors, re-tuned until they actually earn the name on the label.',
  },
]

/** Quality badges flanking the brand wordmark. */
export const BRAND_QUALITY_BADGES = ['Creapure®', 'Made in Germany', 'Lab-tested'] as const

/** How many flavor ratings to list on the PDP "Top flavors" card. */
export const TOP_FLAVORS_LIMIT = 5
/** Max-height of the scrollable review list. */
export const REVIEW_LIST_MAX_HEIGHT = 'max-h-[520px]'
/** Number of decorative gallery thumbnails under the PDP main image. */
export const GALLERY_THUMB_COUNT = 3
