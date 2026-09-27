'use client'

import { SKELETON_CARD_COUNT } from '@/data/commerce'
import type { ProductCardData } from '@/lib/types'
import { ProductCard, ProductCardSkeleton } from './product-card'

const GRID_CLASS = 'grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'

/** Responsive product grid — the single layout used by every catalog surface. */
export function ProductGrid({
  products,
  className,
}: {
  products: ProductCardData[]
  className?: string
}) {
  return (
    <div className={`${GRID_CLASS} ${className ?? ''}`.trim()}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

/** Placeholder grid shown while a catalog query is pending. */
export function ProductGridSkeleton({
  count = SKELETON_CARD_COUNT,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={`${GRID_CLASS} ${className ?? ''}`.trim()}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
