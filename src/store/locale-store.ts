'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_LOCALE_KEY, type LocaleKey } from '@/data/commerce'
import { STORAGE_KEYS } from '@/data/storage'

type LocaleState = {
  localeKey: LocaleKey
  setLocale: (localeKey: LocaleKey) => void
}

/**
 * Selected locale, persisted so a returning shopper keeps their currency.
 *
 * `skipHydration` matters: without it zustand would rehydrate from
 * localStorage during the first client render, and the store would disagree
 * with the server-rendered prices — a hydration mismatch. Instead
 * `<LocaleSync />` rehydrates in an effect, after hydration has finished.
 */
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      localeKey: DEFAULT_LOCALE_KEY,
      setLocale: (localeKey) => set({ localeKey }),
    }),
    { name: STORAGE_KEYS.locale, skipHydration: true }
  )
)
