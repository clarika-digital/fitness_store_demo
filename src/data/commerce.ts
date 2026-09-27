/**
 * Commerce rules and money formatting config.
 * Single source of truth — imported by UI (`@/data`) and API routes alike.
 * Never duplicate these values in a component; import from here.
 */

export const CURRENCY = 'EUR'
/** en-IE renders `€12.90` with a non-breaking space, as the copy expects. */
export const MONEY_LOCALE = 'en-IE'
export const DATE_LOCALE = 'en-GB'

export const FREE_SHIPPING_THRESHOLD = 59
export const STANDARD_SHIPPING = 4.9
export const EXPRESS_SHIPPING = 9.9

/** Promo code -> discount rate. The checkout route and the UI share this map. */
export const PROMO_CODES: Record<string, number> = { WELCOME10: 0.1 }
export const WELCOME_PROMO_CODE = 'WELCOME10'

/** Quantity floor/ceiling enforced by every stepper in the UI. */
export const QTY_MIN = 1
export const QTY_MAX = 20
/** Hard ceiling persisted per cart line; the UI stops well below it. */
export const QTY_HARD_MAX = 99
export const CHECKOUT_ITEM_QTY_MAX = 99
/** Header badge switches to "9+" past this count. */
export const CART_BADGE_MAX = 9

/** Placeholder written into a cart line when a product has no flavors. */
export const NO_FLAVOR_LABEL = '—'
/** Flavor assigned when quick-adding a flavored product from a card. */
export const QUICK_ADD_FLAVOR_LABEL = 'Mix'

export type ShippingMethodId = 'standard' | 'express'
export type PaymentMethodId = 'paypal' | 'klarna' | 'card'

export const DEFAULT_SHIPPING_METHOD: ShippingMethodId = 'standard'
export const DEFAULT_PAYMENT_METHOD: PaymentMethodId = 'paypal'

export const SHIPPING_METHODS: readonly {
  id: ShippingMethodId
  label: string
  description: string
  cost: number
}[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: '2–4 business days',
    cost: STANDARD_SHIPPING,
  },
  {
    id: 'express',
    label: 'Express',
    description: 'Next business day',
    cost: EXPRESS_SHIPPING,
  },
]

export const PAYMENT_METHODS: readonly {
  id: PaymentMethodId
  label: string
  description: string
  icon: import('./icons').IconName
}[] = [
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'You’ll be redirected after placing the order',
    icon: 'wallet',
  },
  {
    id: 'klarna',
    label: 'Klarna — Pay after delivery',
    description: 'Pay in 30 days',
    icon: 'banknote',
  },
  {
    id: 'card',
    label: 'Credit card',
    description: 'Visa / Mastercard — demo checkout, no real charge',
    icon: 'credit-card',
  },
]

export const COUNTRIES: readonly { code: string; label: string }[] = [
  { code: 'DE', label: 'Germany' },
  { code: 'AT', label: 'Austria' },
  { code: 'CH', label: 'Switzerland' },
]

export const DEFAULT_COUNTRY = COUNTRIES[0].code

/** Checkout steps rendered by the progress indicator. */
export const CHECKOUT_STEPS = ['Details', 'Payment', 'Done'] as const
/** Steps considered "reached" while the customer is still filling the form in. */
export const CHECKOUT_ACTIVE_STEP_COUNT = 2

/** Prefix for every generated order number, e.g. `FD-MUD8ACP4-4FP`. */
export const ORDER_NUMBER_PREFIX = 'FD'
export const ORDER_NUMBER_RANDOM_LENGTH = 3
export const ORDER_NUMBER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/** Converts a 0–1 rate (e.g. `0.1`) into whole percent for display. */
export const PERCENT_FACTOR = 100
export const PERCENT_SCALE = 100
/** Upper bound of a percentage progress bar. */
export const PERCENT_MAX = 100
/** Minor units per major unit — used to keep money maths free of float drift. */
export const MONEY_SCALE = 100
/** Grams in a kilogram, for per-kg price maths. */
export const GRAMS_PER_KG = 1000
/** `KeyboardEvent.key` for submit-on-Enter. */
export const ENTER_KEY = 'Enter'
/** How long the header waits after typing before firing a search request. */
export const SEARCH_DEBOUNCE_MS = 250
/** How long a "copied" confirmation stays visible. */
export const COPY_FEEDBACK_MS = 2000

/** How many related products the PDP cross-sell shows. */
export const RELATED_PRODUCT_LIMIT = 4
/** How many reviews the PDP returns, newest first. */
export const REVIEW_LIST_LIMIT = 10
/** Cap on header search autocomplete results. */
export const SEARCH_RESULT_LIMIT = 6
/** Minimum characters before a search request fires. */
export const SEARCH_MIN_LENGTH = 2
/** Cap on bestsellers rendered on the home page. */
export const BESTSELLER_LIMIT = 8
/** Cards rendered in a skeleton grid while a catalog query is pending. */
export const SKELETON_CARD_COUNT = 8
