/** Copy for the catalog views: category listing, search results and brand page. */

import { HERO_BRAND } from '../site'
import { COMMON_CTA_COPY } from './home'
import { STATE_COPY } from './states'

export const CATEGORY_VIEW_COPY = {
  breadcrumbAriaLabel: 'Breadcrumb',
  breadcrumbHome: 'Home',
  breadcrumbSearch: 'Search',
  searchTitle: (q?: string) => `Search results for “${q}”`,
  proteinFlavorHint: '11 flavors across the range — every flavor rated by real customers.',
  resultCount: (n: number) => `${n} products`,
  sortAriaLabel: 'Sort products',
  sortPlaceholder: 'Sort',
  loading: STATE_COPY.loading,
} as const

export const COMPARISON_TABLE_COPY = {
  headerLabel: 'Compare',
  cta: COMMON_CTA_COPY.view,
  footerPrefix: 'Not sure? Get the',
  footerLink: 'Whey Sample Box →',
  ariaLabel: 'Protein comparison',
} as const

export const SEARCH_COPY = {
  ariaLabel: 'Product search results',
  resultsLabel: 'Product search results',
} as const

export const BRAND_PAGE_COPY = {
  breadcrumbAriaLabel: 'Breadcrumb',
  breadcrumbRoot: 'Brands',
  eyebrow: 'Brand shop',
  rangeEyebrow: `${HERO_BRAND.label} range`,
  title: `Every ${HERO_BRAND.label} product we stock`,
  genericProductsTitle: (brand: string) => `${brand} products`,
  blurb: `${HERO_BRAND.longName} — ${HERO_BRAND.tagline}`,
  genericBlurb: (brand: string) => `Products from ${brand} available at Fuel’d.`,
  rangeSubtitle: `From the 76%-protein classic to shakers and bundles — everything ships within 24h.`,
  valuesAriaLabel: `Why buy ${HERO_BRAND.label} from us`,
  errorTitle: `Products couldn’t be loaded. Check your connection and try again.`,
  ctaTitle: 'Not sure which protein?',
  ctaBody:
    'Whey, isolate or vegan — our protein category breaks down the differences without the hype.',
  ctaLabel: 'Compare proteins',
  retry: COMMON_CTA_COPY.tryAgain,
  backToHome: COMMON_CTA_COPY.backToHome,
} as const
