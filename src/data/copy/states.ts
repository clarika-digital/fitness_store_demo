/** Copy for loading / error / empty states shared across every view. */

import type { IconName } from '../icons'

export const STATE_COPY = {
  loading: 'Loading…',
  ellipsis: '…',
  retry: 'Try again',
  retryAriaLabel: 'Retry loading',
  icon: 'alert-triangle' as IconName,
} as const

export const PRODUCT_LOADING_ERROR_COPY = {
  title: 'Something went wrong loading products.',
  body: 'Please try again in a moment.',
} as const

export const CATALOG_EMPTY_COPY = {
  searchTitle: (q?: string) => `Nothing found for “${q}”`,
  searchBody: 'Try “whey”, “creatine”, “vanilla”',
  categoryTitle: 'No products here yet',
  categoryBody: 'Check back soon — new products are on the way.',
  backToShop: 'Back to shop',
  backToHome: 'Back to home',
  icon: 'search-x' as IconName,
} as const

export const PRODUCT_NOT_FOUND_COPY = {
  title: 'Product not found',
  body: 'This product may have been moved or is no longer available.',
  backToHome: 'Back to home',
  icon: 'alert-circle' as IconName,
} as const

export const BRAND_EMPTY_COPY = {
  body: (brand: string) =>
    `No ${brand} products in stock right now — browse our categories instead.`,
  backToHome: 'Back to home',
} as const
