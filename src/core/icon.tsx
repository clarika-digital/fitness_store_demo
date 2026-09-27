import { createElement } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Banknote,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  Dumbbell,
  FlaskConical,
  Globe,
  HandHeart,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  SearchX,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  Truck,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { FILLED_ICON_NAMES, type IconName } from '@/data/icons'
import { cn } from '@/lib/utils'

/**
 * Icon registry.
 *
 * `data/` cannot import React, so it references icons by name (see
 * `@/data/icons`). This module is the single place that maps a name to a real
 * lucide component, which lets data files carry icon references safely.
 */
const ICONS: Record<IconName, LucideIcon> = {
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'arrow-right': ArrowRight,
  banknote: Banknote,
  'badge-check': BadgeCheck,
  check: Check,
  'check-circle': CheckCircle2,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  copy: Copy,
  'credit-card': CreditCard,
  dumbbell: Dumbbell,
  'flask-conical': FlaskConical,
  globe: Globe,
  'hand-heart': HandHeart,
  lock: Lock,
  loader: Loader2,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  minus: Minus,
  package: Package,
  plus: Plus,
  refresh: RefreshCw,
  'rotate-ccw': RotateCcw,
  search: Search,
  'search-x': SearchX,
  'shield-check': ShieldCheck,
  'shopping-bag': ShoppingBag,
  'shopping-cart': ShoppingCart,
  sparkles: Sparkles,
  star: Star,
  trash: Trash2,
  truck: Truck,
  wallet: Wallet,
  zap: Zap,
}

export function getIcon(name: IconName): LucideIcon {
  return ICONS[name]
}

export type IconProps = {
  name: IconName
  size?: number
  className?: string
  /** Overrides the default stroke/fill behaviour for the given name. */
  strokeWidth?: number
}

/** Renders an icon by name. Decorative by default (`aria-hidden`). */
export function Icon({ name, size = 16, className, strokeWidth }: IconProps) {
  const Component = getIcon(name)
  const filled = FILLED_ICON_NAMES.includes(name)
  // `createElement` rather than JSX: the component comes from a lookup, and
  // `react-hooks/static-components` rejects components built inside render.
  return createElement(Component, {
    size,
    'aria-hidden': true,
    strokeWidth: strokeWidth ?? (filled ? 0 : 2),
    className: cn(filled && 'fill-amber-400', className),
  })
}

export { ICONS as ICON_REGISTRY }
export type { IconName }
