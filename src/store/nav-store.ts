'use client'

import { create } from 'zustand'
import type { View } from '@/lib/types'

type NavState = {
  view: View
  history: View[]
  navigate: (v: View) => void
  back: () => void
  canBack: () => boolean
}

export const useNavStore = create<NavState>((set, get) => ({
  view: { name: 'home' },
  history: [],
  navigate: (v) =>
    set((state) => ({ view: v, history: [...state.history, state.view].slice(-20) })),
  back: () =>
    set((state) => {
      const prev = state.history[state.history.length - 1]
      if (!prev) return { view: { name: 'home' }, history: [] }
      return { view: prev, history: state.history.slice(0, -1) }
    }),
  canBack: () => get().history.length > 0,
}))

export function viewKey(v: View): string {
  if (v.name === 'category') return `category:${v.slug}:${v.q ?? ''}`
  if (v.name === 'product') return `product:${v.slug}`
  if (v.name === 'confirmation') return `confirmation:${v.orderNumber}`
  if (v.name === 'page') return `page:${v.slug}`
  if (v.name === 'brand') return `brand:${v.slug}`
  return v.name
}
