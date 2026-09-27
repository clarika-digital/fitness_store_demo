/**
 * Commerce rules and money formatting config.
 * Single source of truth — imported by UI (`@/data`) and API routes alike.
 * Never duplicate these values in a component; import from here.
 */

/**
 * All prices in the database, the cart and the API are stored in this currency.
 * The locale selector only changes how an amount is *rendered* — see
 * `FX_RATES` for the conversion.
 */
export const BASE_CURRENCY = 'EUR'

/**
 * Static, hand-maintained FX rates: how many units of a currency one
 * `BASE_CURRENCY` is worth. Mid-market reference, September 2026
 * (1 EUR ≈ 13.2 GHS). There is no live rate feed, so update these by hand.
 */
export const FX_RATES = {
  EUR: 1,
  GHS: 13.2,
} as const

export type CurrencyCode = keyof typeof FX_RATES

export type LocaleConfig = {
  /** BCP-47 tag used for `Intl` formatting and the `<html lang>` attribute. */
  tag: string
  /** Name shown in the locale selector. */
  label: string
  /** Compact label for the closed selector. */
  short: string
  currency: CurrencyCode
  /** ISO country code, shown next to the label. */
  region: string
}

export const LOCALES = {
  'en-GH': {
    tag: 'en-GH',
    label: 'English · Ghana',
    short: 'EN',
    currency: 'GHS',
    region: 'GH',
  },
  'de-DE': {
    tag: 'de-DE',
    label: 'Deutsch · Deutschland',
    short: 'DE',
    currency: 'EUR',
    region: 'DE',
  },
} as const satisfies Record<string, LocaleConfig>

export type LocaleKey = keyof typeof LOCALES

export const LOCALE_KEYS = Object.keys(LOCALES) as LocaleKey[]

/** Ghanaian cedi — the store's default. */
export const DEFAULT_LOCALE_KEY: LocaleKey = 'en-GH'

export const DEFAULT_LOCALE: LocaleConfig = LOCALES[DEFAULT_LOCALE_KEY]

export function isLocaleKey(value: unknown): value is LocaleKey {
  return typeof value === 'string' && value in LOCALES
}

export function localeConfig(key: string): LocaleConfig {
  return LOCALES[key as LocaleKey] ?? DEFAULT_LOCALE
}

/**
 * A money formatter bound to one locale: takes a *base* (EUR) amount and
 * returns the rendered amount. Copy in `src/data/copy` receives one of these
 * instead of a hardcoded currency string, so a string never has to be
 * re-generated per locale.
 */
export type MoneyFormat = (baseAmount: number) => string

/** Currency the default locale prices in. Server code and metadata use this. */
export const CURRENCY = DEFAULT_LOCALE.currency
/** `en-GH` renders `GH₵123.40`; `de-DE` renders `123,40 €`. */
export const MONEY_LOCALE = DEFAULT_LOCALE.tag
export const DATE_LOCALE = DEFAULT_LOCALE.tag

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
