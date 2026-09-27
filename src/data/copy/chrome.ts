/** Copy for the persistent chrome: USP strip, header and footer. */

import type { IconName } from '../icons'
import { SITE } from '../site'

export const USP_BAR_COPY = {
  hiddenOnMobile: 1,
} as const

export const HEADER_COPY = {
  searchPlaceholder: 'Search whey, creatine, flavors…',
  searchAriaLabel: 'Search products',
  menuAriaLabel: 'Open menu',
  mobileNavAriaLabel: 'Mobile navigation',
  mainNavAriaLabel: 'Main navigation',
  homeAriaLabel: `${SITE.name} — go to homepage`,
  dropdownTriggerLabel: 'Shop all protein →',
  searching: 'Searching…',
  noResults: (q: string) => `No products found for “${q}”. Try “whey” or “creatine”.`,
  seeAllResults: (q: string) => `See all results for “${q}” →`,
  flavourCount: (n: number) => `${n} flavors`,
} as const

export const BREADCRUMB_COPY = {
  ariaLabel: 'Breadcrumb',
  home: 'Home',
} as const

export const FOOTER_COPY = {
  shopAriaLabel: 'Shop categories',
  helpAriaLabel: 'Help and company',
  shopHeading: 'Shop',
  helpHeading: 'Help',
  contactHeading: 'Contact',
  copyright: (year: number) =>
    `© ${year} ${SITE.legalName}. ${SITE.vatNote} ${SITE.disclaimer}`,
  legalFallbackView: 'faq',
} as const

/** Punctuation reused by more than one component. */
export const GLYPH_COPY = {
  separator: '·',
  times: '×',
} as const

export const BRAND_MARK_COPY: { icon: IconName; ariaLabel: string } = {
  icon: 'dumbbell',
  ariaLabel: `${SITE.name} — go to homepage`,
}
