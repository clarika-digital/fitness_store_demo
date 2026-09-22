'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string
  slug: string
  name: string
  brand: string
  image: string
  flavor: string
  sizeLabel: string
  unitPrice: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  open: () => void
  close: () => void
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  remove: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
}

const itemKey = (productId: string, flavor: string, sizeLabel: string) =>
  `${productId}::${flavor}::${sizeLabel}`

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item, quantity = 1) =>
        set((state) => {
          const key = itemKey(item.productId, item.flavor, item.sizeLabel)
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.flavor, i.sizeLabel) === key
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.flavor, i.sizeLabel) === key
                  ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity }] }
        }),
      remove: (key) =>
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.productId, i.flavor, i.sizeLabel) !== key
          ),
        })),
      setQty: (key, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              itemKey(i.productId, i.flavor, i.sizeLabel) === key
                ? { ...i, quantity: Math.max(0, Math.min(99, qty)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'fueld-cart' }
  )
)

export function cartKey(i: CartItem) {
  return itemKey(i.productId, i.flavor, i.sizeLabel)
}

export function cartSubtotal(items: CartItem[]): number {
  return Math.round(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100) / 100
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0)
}
