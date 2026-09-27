'use client'

import { formatEUR } from '@/lib/format'
import { PRODUCT_CARD_COPY } from '@/data/copy/product'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Price with optional strike-through compare price and "Save" badge.
 *
 * `saving` is derived from the compare price when not supplied, so callers only
 * have to pass the raw numbers.
 */
export function PriceBlock({
  price,
  comparePrice,
  saving,
  size = 'md',
  className,
}: {
  price: number
  comparePrice?: number | null
  saving?: number | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const hasCompare = Boolean(comparePrice && comparePrice > price)
  const derivedSaving = hasCompare ? Math.round((comparePrice! - price) * 100) / 100 : null
  const discount = saving ?? derivedSaving

  return (
    <div className={cn('flex flex-wrap items-baseline gap-1.5', className)}>
      <span
        className={cn(
          'font-extrabold tracking-tight text-zinc-900',
          size === 'lg' && 'text-3xl',
          size === 'md' && 'text-base',
          size === 'sm' && 'text-sm'
        )}
      >
        {formatEUR(price)}
      </span>
      {hasCompare && (
        <span
          className={cn(
            'text-zinc-400 line-through',
            size === 'lg' ? 'text-base' : 'text-xs'
          )}
        >
          {formatEUR(comparePrice!)}
        </span>
      )}
      {discount && (
        <Badge
          className={cn(
            'font-bold text-white',
            size === 'sm'
              ? 'bg-zinc-900 text-[10px] hover:bg-zinc-900'
              : 'bg-zinc-900 text-xs hover:bg-zinc-900'
          )}
        >
          {PRODUCT_CARD_COPY.savePrefix} {formatEUR(discount)}
        </Badge>
      )}
    </div>
  )
}
