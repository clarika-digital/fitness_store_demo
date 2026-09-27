import type { ProductSize } from './types'
import {
  DATE_LOCALE,
  DEFAULT_LOCALE,
  FX_RATES,
  GRAMS_PER_KG,
  MONEY_SCALE,
  PERCENT_SCALE,
  type CurrencyCode,
  type LocaleConfig,
} from '@/data/commerce'

/**
 * Formatting helpers.
 *
 * Money/shipping *rules* live in `@/data/commerce` — this module only formats
 * values. Re-exported here so existing `from '@/lib/format'` imports keep
 * working, but new code should import rules from `@/data`.
 */
export {
  BASE_CURRENCY,
  CURRENCY,
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_KEY,
  FREE_SHIPPING_THRESHOLD,
  FX_RATES,
  LOCALES,
  LOCALE_KEYS,
  STANDARD_SHIPPING,
  EXPRESS_SHIPPING,
  PROMO_CODES,
  WELCOME_PROMO_CODE,
  isLocaleKey,
  localeConfig,
  type CurrencyCode,
  type LocaleConfig,
  type LocaleKey,
  type ShippingMethodId,
  type PaymentMethodId,
} from '@/data/commerce'

/** Rounds to the currency's minor unit, avoiding float drift on money maths. */
export function roundMoney(value: number): number {
  return Math.round(value * MONEY_SCALE) / MONEY_SCALE
}

/** Converts an amount held in `BASE_CURRENCY` into `currency`. */
export function convertMoney(value: number, currency: CurrencyCode): number {
  return roundMoney(value * FX_RATES[currency])
}

/**
 * Renders an amount held in `BASE_CURRENCY` (database, cart and API values are
 * all base amounts) in the given locale's currency.
 */
export function formatMoney(
  value: number,
  locale: Pick<LocaleConfig, 'tag' | 'currency'> = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale.tag, {
    style: 'currency',
    currency: locale.currency,
  }).format(convertMoney(value, locale.currency))
}

/** `Intl` formatter for an explicit locale, for callers that need the object. */
export function moneyFormatter(locale: Pick<LocaleConfig, 'tag' | 'currency'>) {
  const formatter = new Intl.NumberFormat(locale.tag, {
    style: 'currency',
    currency: locale.currency,
  })
  return (value: number) => formatter.format(convertMoney(value, locale.currency))
}

/** Extract a per-kg price from a size label like "1 kg" / "2.5 kg" / "500 g" / "10 × 30 g". */
export function perKg(size: ProductSize): number | null {
  // multi-pack pattern, e.g. "10 × 30 g" → 300 g total
  const multi = size.label.match(/([\d.]+)\s*[x×]\s*([\d.]+)\s*(kg|g)\b/i)
  if (multi) {
    const total = parseFloat(multi[1]) * parseFloat(multi[2])
    if (!total || Number.isNaN(total)) return null
    const kg = multi[3].toLowerCase() === 'kg' ? total : total / GRAMS_PER_KG
    return roundMoney(size.price / kg)
  }
  const m = size.label.match(/([\d.]+)\s*(kg|g)\b/i)
  if (!m) return null
  const qty = parseFloat(m[1])
  if (!qty || Number.isNaN(qty)) return null
  const kg = m[2].toLowerCase() === 'kg' ? qty : qty / GRAMS_PER_KG
  return roundMoney(size.price / kg)
}

export function perServing(size: ProductSize): number | null {
  if (!size.servings) return null
  return roundMoney(size.price / size.servings)
}

/** Deterministic plausible rating distribution for a given average & count. */
export function ratingDistribution(average: number, count: number) {
  const five = Math.min(0.86, Math.max(0.55, average - 3.55))
  const four = Math.min(0.22, Math.max(0.08, 4.55 - average + 0.08))
  const three = Math.max(0.01, 1 - five - four - 0.04)
  const two = 0.02
  const one = Math.max(0.005, 1 - five - four - three - two)
  const raw = [
    { stars: 5, pct: five },
    { stars: 4, pct: four },
    { stars: 3, pct: three },
    { stars: 2, pct: two },
    { stars: 1, pct: one },
  ]
  const total = raw.reduce((s, r) => s + r.pct, 0)
  return raw.map((r) => ({
    stars: r.stars,
    pct: Math.round((r.pct / total) * PERCENT_SCALE),
  }))
}

export function estimatedDeliveryText(
  method: 'standard' | 'express',
  locale: string = DATE_LOCALE
): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  const now = new Date()
  const min = new Date(now)
  const max = new Date(now)
  if (method === 'express') {
    min.setDate(min.getDate() + 1)
    max.setDate(max.getDate() + 2)
  } else {
    min.setDate(min.getDate() + 2)
    max.setDate(max.getDate() + 4)
  }
  return `${fmt(min)} – ${fmt(max)}`
}
