'use client'

import { create } from 'zustand'
import type { View } from '@/lib/types'
import { HOME_VIEW } from '@/data/navigation'
import { NAV_CONFIG } from '@/data/navigation'

type NavState = {
  view: View
  history: View[]
  navigate: (v: View) => void
  back: () => void
  canBack: () => boolean
}

const LAST_ENTRY_OFFSET = 1
const NO_ENTRIES = 0

export const useNavStore = create<NavState>((set, get) => ({
  view: HOME_VIEW,
  history: [],
  navigate: (v) =>
    set((state) => ({
      view: v,
      history: [...state.history, state.view].slice(-NAV_CONFIG.historyLimit),
    })),
  back: () =>
    set((state) => {
      const prev = state.history[state.history.length - LAST_ENTRY_OFFSET]
      if (!prev) return { view: HOME_VIEW, history: [] }
      return { view: prev, history: state.history.slice(0, -LAST_ENTRY_OFFSET) }
    }),
  canBack: () => get().history.length > NO_ENTRIES,
}))

export function viewKey(v: View): string {
  if (v.name === 'category') return `category:${v.slug}:${v.q ?? ''}`
  if (v.name === 'product') return `product:${v.slug}`
  if (v.name === 'confirmation') return `confirmation:${v.orderNumber}`
  if (v.name === 'page') return `page:${v.slug}`
  if (v.name === 'brand') return `brand:${v.slug}`
  return v.name
}
