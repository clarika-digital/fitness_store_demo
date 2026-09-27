'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QTY_HARD_MAX, QTY_MIN } from '@/data/commerce'
import { STORAGE_KEYS } from '@/data/storage'
import { roundMoney } from '@/lib/format'

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

/** Separator between the parts of a cart line key. */
export const CART_KEY_SEPARATOR = '::'

const itemKey = (productId: string, flavor: string, sizeLabel: string) =>
  [productId, flavor, sizeLabel].join(CART_KEY_SEPARATOR)

/** A line whose quantity drops to zero is removed rather than kept at 0. */
const MIN_LINE_QUANTITY = 1

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item, quantity = QTY_MIN) =>
        set((state) => {
          const key = itemKey(item.productId, item.flavor, item.sizeLabel)
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.flavor, i.sizeLabel) === key
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.flavor, i.sizeLabel) === key
                  ? { ...i, quantity: Math.min(QTY_HARD_MAX, i.quantity + quantity) }
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
                ? { ...i, quantity: Math.max(0, Math.min(QTY_HARD_MAX, qty)) }
                : i
            )
            .filter((i) => i.quantity >= MIN_LINE_QUANTITY),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: STORAGE_KEYS.cart }
  )
)

export function cartKey(i: CartItem) {
  return itemKey(i.productId, i.flavor, i.sizeLabel)
}

export function cartSubtotal(items: CartItem[]): number {
  return roundMoney(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0))
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0)
}
