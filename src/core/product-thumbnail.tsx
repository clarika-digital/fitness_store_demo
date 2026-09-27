'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Square product image.
 *
 * Pass `size` for a fixed-pixel thumbnail (cart rows, search results). Omit it
 * when the component should fill a sized parent — the parent must then set the
 * height (e.g. `aspect-square`).
 */
export function ProductThumbnail({
  src,
  alt,
  size,
  sizes,
  className,
  rounded = 'rounded-lg',
  priority = false,
}: {
  src: string
  alt: string
  /** Rendered width/height in px. Omit to fill the parent instead. */
  size?: number
  sizes?: string
  className?: string
  rounded?: 'rounded-lg' | 'rounded-md'
  priority?: boolean
}) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden bg-zinc-50',
        rounded,
        className
      )}
      style={size ? { height: size, width: size } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? (size ? `${size}px` : '100vw')}
        className="object-cover"
      />
    </div>
  )
}
