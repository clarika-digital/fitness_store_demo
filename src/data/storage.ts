/**
 * Keys for anything persisted to `localStorage`.
 *
 * Changing a key silently orphans existing users' data, so treat these as
 * append-only.
 */
export const STORAGE_KEYS = {
  cart: 'fueld-cart',
  locale: 'fueld-locale',
} as const
