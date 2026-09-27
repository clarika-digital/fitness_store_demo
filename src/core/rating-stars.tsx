'use client'

import { RATING_MAX } from '@/data/products'
import { RATING_STARS_COPY } from '@/data/copy/product'
import { cn } from '@/lib/utils'

/** Five stars with a full/half/empty treatment for a 0–5 rating. */
export function RatingStars({
  rating,
  size = 14,
  className,
}: {
  rating: number
  size?: number
  className?: string
}) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      aria-label={RATING_STARS_COPY.ariaLabel(rating)}
    >
      {Array.from({ length: RATING_MAX }, (_, i) => i + 1).map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden
          className={cn(
            'shrink-0',
            i <= full
              ? 'fill-amber-400'
              : half && i === full + 1
                ? 'fill-amber-400/50'
                : 'fill-zinc-200'
          )}
        >
          <path d="M12 2l2.9 6.26 6.85.72-5.1 4.6 1.42 6.72L12 17.1l-6.07 3.2 1.42-6.72-5.1-4.6 6.85-.72L12 2z" />
        </svg>
      ))}
    </span>
  )
}
