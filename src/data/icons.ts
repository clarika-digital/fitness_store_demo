/**
 * Icon registry.
 *
 * `data/` must stay importable from server code (API routes), so it never
 * imports React or lucide-react. Instead it references icons by a string key
 * and `core/icon.tsx` resolves the key to a real component.
 *
 * Adding an icon: add the key here, then map it in `core/icon.tsx`.
 */

export const ICON_NAMES = [
  'alert-circle',
  'alert-triangle',
  'arrow-right',
  'banknote',
  'badge-check',
  'check',
  'check-circle',
  'chevron-left',
  'chevron-right',
  'copy',
  'credit-card',
  'dumbbell',
  'flask-conical',
  'hand-heart',
  'lock',
  'loader',
  'mail',
  'map-pin',
  'menu',
  'minus',
  'package',
  'plus',
  'refresh',
  'rotate-ccw',
  'search',
  'search-x',
  'shield-check',
  'shopping-bag',
  'shopping-cart',
  'sparkles',
  'star',
  'trash',
  'truck',
  'wallet',
  'zap',
] as const

export type IconName = (typeof ICON_NAMES)[number]

/** Icons drawn with a solid fill rather than a stroke. */
export const FILLED_ICON_NAMES: readonly IconName[] = ['star']
