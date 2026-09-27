'use client'

import { useEffect, useMemo } from 'react'
import { localeConfig } from '@/data/commerce'
import { moneyFormatter } from '@/lib/format'
import { useLocaleStore } from '@/store/locale-store'

/**
 * Returns a money formatter bound to the shopper's selected locale.
 *
 * Every amount passed in is a *base* amount (EUR in the database, the cart and
 * the API); the formatter converts and renders it, so switching locale never
 * touches stored numbers.
 *
 *   const money = useMoney()
 *   money(product.priceFrom) // → "GH₵412.68" or "31,24 €"
 */
export function useMoney() {
  const localeKey = useLocaleStore((s) => s.localeKey)
  return useMemo(() => moneyFormatter(localeConfig(localeKey)), [localeKey])
}

/** The active locale's config, reactive to selector changes. */
export function useLocale() {
  const localeKey = useLocaleStore((s) => s.localeKey)
  return useMemo(() => ({ key: localeKey, ...localeConfig(localeKey) }), [localeKey])
}

/**
 * Rehydrates the persisted locale after mount and keeps `<html lang>` in sync.
 *
 * Mount it once, inside the providers. Rehydration is deferred to an effect so
 * the first client render still matches the server-rendered prices.
 */
export function LocaleSync() {
  const localeKey = useLocaleStore((s) => s.localeKey)

  useEffect(() => {
    void useLocaleStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    document.documentElement.lang = localeConfig(localeKey).tag
  }, [localeKey])

  return null
}
