import type { ProductSize } from './types'

export const FREE_SHIPPING_THRESHOLD = 59
export const STANDARD_SHIPPING = 4.9
export const EXPRESS_SHIPPING = 9.9
export const PROMO_CODES: Record<string, number> = { WELCOME10: 0.1 }

export function formatEUR(value: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

/** Extract a per-kg price from a size label like "1 kg" / "2.5 kg" / "500 g" / "10 × 30 g". */
export function perKg(size: ProductSize): number | null {
  // multi-pack pattern, e.g. "10 × 30 g" → 300 g total
  const multi = size.label.match(/([\d.]+)\s*[x×]\s*([\d.]+)\s*(kg|g)\b/i)
  if (multi) {
    const total = parseFloat(multi[1]) * parseFloat(multi[2])
    if (!total || Number.isNaN(total)) return null
    const kg = multi[3].toLowerCase() === 'kg' ? total : total / 1000
    return Math.round((size.price / kg) * 100) / 100
  }
  const m = size.label.match(/([\d.]+)\s*(kg|g)\b/i)
  if (!m) return null
  const qty = parseFloat(m[1])
  if (!qty || Number.isNaN(qty)) return null
  const kg = m[2].toLowerCase() === 'kg' ? qty : qty / 1000
  return Math.round((size.price / kg) * 100) / 100
}

export function perServing(size: ProductSize): number | null {
  if (!size.servings) return null
  return Math.round((size.price / size.servings) * 100) / 100
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
  return raw.map((r) => ({ stars: r.stars, pct: Math.round((r.pct / total) * 100) }))
}

export function estimatedDeliveryText(method: 'standard' | 'express'): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
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
