'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

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
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          className={cn(
            i <= full
              ? 'fill-amber-400'
              : half && i === full + 1
                ? 'fill-amber-400/50'
                : 'fill-zinc-200'
          )}
        />
      ))}
    </span>
  )
}
