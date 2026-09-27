'use client'

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useNavigate } from '@/hooks/use-nav'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/use-toast'
import { perKg } from '@/lib/format'
import { useLocale, useMoney } from '@/hooks/use-money'
import type { ProductCardData } from '@/lib/types'
import {
  NO_FLAVOR_LABEL,
  PRODUCT_CARD_COPY,
  QUICK_ADD_FLAVOR_LABEL,
  UNIT_LABELS,
} from '@/data'
import { IMAGE_SIZES } from '@/data/images'
import { RatingStars } from './rating-stars'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Catalog tile: image, badges, rating, price and a quick-add button. */
export function ProductCard({
  product,
  className,
}: {
  product: ProductCardData
  className?: string
}) {
  const navigate = useNavigate()
  const add = useCartStore((s) => s.add)
  const openCart = useCartStore((s) => s.open)
  const { toast } = useToast()

  const money = useMoney()
  const locale = useLocale()
  const size = product.sizes[0]
  const kg = size ? perKg(size) : null
  const saving =
    size?.comparePrice && size.comparePrice > size.price
      ? Math.round((size.comparePrice - size.price) * 100) / 100
      : null

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product.inStock || !size) return
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.image,
      flavor: product.flavorCount > 0 ? QUICK_ADD_FLAVOR_LABEL : NO_FLAVOR_LABEL,
      sizeLabel: size.label,
      unitPrice: size.price,
    })
    toast({
      title: PRODUCT_CARD_COPY.toast.title,
      description: PRODUCT_CARD_COPY.toast.description(product.brand, product.name),
    })
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={PRODUCT_CARD_COPY.ariaLabel(
        product.brand,
        product.name,
        money(product.priceFrom)
      )}
      onClick={() => navigate({ name: 'product', slug: product.slug })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate({ name: 'product', slug: product.slug })
        }
      }}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-200/60 focus-visible:outline-2 focus-visible:outline-primary',
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={IMAGE_SIZES.productCard}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.isBestseller && (
            <Badge className="bg-primary text-[10px] font-bold uppercase tracking-wide text-white hover:bg-primary">
              {PRODUCT_CARD_COPY.bestsellerBadge}
            </Badge>
          )}
          {saving && (
            <Badge className="bg-zinc-900 text-[10px] font-bold text-white hover:bg-zinc-900">
              {PRODUCT_CARD_COPY.savePrefix} {money(saving)}
            </Badge>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
              {PRODUCT_CARD_COPY.outOfStock}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {product.brand}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-500">
            <RatingStars rating={product.rating} size={11} />
            <span className="font-medium text-zinc-700">{product.rating.toFixed(1)}</span>
            <span className="hidden text-zinc-400 sm:inline">
              ({product.reviewCount.toLocaleString(locale.tag)})
            </span>
          </span>
        </div>
        <h3 className="text-sm font-bold leading-tight text-zinc-900 group-hover:text-primary">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-snug text-zinc-500">{product.tagline}</p>

        <div className="mt-auto pt-2">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-zinc-900">
                  {money(product.priceFrom)}
                </span>
                {product.compareFrom && product.compareFrom > product.priceFrom && (
                  <span className="text-xs text-zinc-400 line-through">
                    {money(product.compareFrom)}
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-zinc-500">
                {kg && <span>{money(kg)}{UNIT_LABELS.perKg}</span>}
                {product.flavorCount > 1 && (
                  <span>{PRODUCT_CARD_COPY.flavorCount(product.flavorCount)}</span>
                )}
              </div>
            </div>
            <Button
              size="icon"
              aria-label={PRODUCT_CARD_COPY.addAriaLabel(product.name)}
              onClick={quickAdd}
              disabled={!product.inStock}
              className="h-9 w-9 shrink-0 rounded-lg"
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="aspect-square animate-pulse bg-zinc-100" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
        <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
        <div className="mt-2 h-6 w-1/2 animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  )
}
