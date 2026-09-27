/** Copy for the product detail page, purchase panel and review section. */

import {
  EXPRESS_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  type MoneyFormat,
} from '../commerce'
import {
  BADGE_LABELS,
  RATING_OUT_OF,
  RATING_STAR,
  TOP_FLAVORS_LIMIT,
  UNIT_LABELS,
} from '../products'

export const PRODUCT_VIEW_COPY = {
  ariaLabel: 'Product',
  breadcrumbAriaLabel: 'Breadcrumb',
  breadcrumbHome: 'Home',
  galleryAriaLabel: 'Product images',
  loadingAriaLabel: 'Loading product',
  stackAriaLabel: 'Complete your stack',
  stackEyebrow: 'Frequently stacked',
  stackTitle: 'Complete your stack',
} as const

export const PDP_ACCORDIONS_COPY = {
  description: 'Description',
  nutrition: 'Nutrition (per 100 g)',
  usage: 'How to use',
  shipping: 'Shipping & returns',
  shippingBody: (money: MoneyFormat) =>
    `Free shipping over ${money(FREE_SHIPPING_THRESHOLD)} · Standard ${money(STANDARD_SHIPPING)} (2–4 days) · Express ${money(EXPRESS_SHIPPING)} (next day) · 30-day returns`,
  openByDefault: 'description',
} as const

export const PURCHASE_PANEL_COPY = {
  flavorPrefix: 'Flavor:',
  flavorAriaLabel: 'Choose flavor',
  sizeLabel: 'Size',
  sizeAriaLabel: 'Choose size',
  popularBadge: BADGE_LABELS.popular,
  savePrefix: 'Save',
  perKgSuffix: UNIT_LABELS.perKg,
  perServingSuffix: UNIT_LABELS.perServing,
  outOfStockCta: 'Out of stock',
  addToCart: (total: string) => `Add to cart · ${total}`,
  reviewsLink: (count: string) => `${count} reviews`,
  reviewsScrollLabel: (count: string) => `Scroll to ${count} reviews`,
  trustAriaLabel: 'Purchase guarantees',
  flavorRating: (rating: string, count: string) =>
    `${rating} from ${count} flavor reviews`,
  decreaseAriaLabel: 'Decrease quantity',
  increaseAriaLabel: 'Increase quantity',
  quantityAriaLabel: (qty: number) => `Quantity ${qty}`,
  outOfStockAriaLabel: (name: string) => `${name} is out of stock`,
  addAriaLabel: (qty: number, name: string, total: string) =>
    `Add ${qty} × ${name} to cart for ${total}`,
  reviewsAnchorId: 'reviews',
  toast: {
    title: 'Added to cart',
    description: (brand: string, name: string, flavor: string, size: string) =>
      `${brand} ${name} · ${flavor} · ${size}`,
  },
} as const

export const REVIEW_SECTION_COPY = {
  id: 'reviews',
  ariaLabel: 'Customer reviews',
  eyebrow: 'Reviews',
  title: 'Rated by real customers',
  subtitle: (brand: string, name: string) =>
    `Every rating comes from a verified purchase of ${brand} ${name}.`,
  outOf: RATING_OUT_OF,
  reviewsCount: (count: string) => `${count} reviews`,
  topFlavorsTitle: 'Top flavors',
  topFlavorsBody: 'Ranked by number of verified flavor reviews.',
  topFlavorsLimit: TOP_FLAVORS_LIMIT,
  listAriaLabel: 'Review list',
  verifiedPurchase: BADGE_LABELS.verifiedPurchase,
  verifiedPurchaseIcon: 'badge-check' as const,
  starsLabel: (n: number) => `${n} ${RATING_STAR}`,
  distributionAriaLabel: (pct: number, stars: number) =>
    `${pct}% of reviews gave ${stars} stars`,
} as const

export const PRODUCT_CARD_COPY = {
  bestsellerBadge: BADGE_LABELS.bestseller,
  savePrefix: 'Save',
  outOfStock: BADGE_LABELS.outOfStock,
  perKgSuffix: UNIT_LABELS.perKg,
  flavorCount: (n: number) => `· ${n} flavors`,
  ariaLabel: (brand: string, name: string, price: string) =>
    `${brand} ${name}, from ${price}`,
  addAriaLabel: (name: string) => `Add ${name} to cart`,
  toast: {
    title: 'Added to cart',
    description: (brand: string, name: string) => `${brand} ${name}`,
  },
} as const

export const FLAVOR_SWATCH_COPY = {
  ariaLabel: (name: string, outOfStock: boolean) =>
    `Flavor ${name}${outOfStock ? ' (out of stock)' : ''}`,
  title: (name: string, outOfStock: boolean) =>
    outOfStock ? `${name} — out of stock` : name,
  outOfStockLabel: 'out of stock',
} as const

export const RATING_STARS_COPY = {
  ariaLabel: (rating: number) => `Rated ${rating} out of 5 stars`,
} as const
