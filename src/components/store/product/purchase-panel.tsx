'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus, RotateCcw, Star, Truck, Zap } from 'lucide-react'
import type { ProductDetailData } from '@/lib/types'
import { formatEUR, perKg, perServing } from '@/lib/format'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/use-toast'
import { RatingStars } from '@/components/store/shared/rating-stars'
import { FlavorSwatch } from '@/components/store/shared/flavor-swatch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MAX_QTY = 20

export function PurchasePanel({ product }: { product: ProductDetailData }) {
  const add = useCartStore((s) => s.add)
  const openCart = useCartStore((s) => s.open)
  const { toast } = useToast()

  const flavors = product.flavors ?? []
  const firstAvailable = useMemo(
    () => flavors.find((f) => f.inStock)?.name ?? flavors[0]?.name ?? null,
    [flavors]
  )
  const defaultSizeIdx = useMemo(() => {
    const i = product.sizes.findIndex((s) => s.popular)
    return i >= 0 ? i : 0
  }, [product.sizes])

  const [flavor, setFlavor] = useState<string | null>(firstAvailable)
  const [sizeIdx, setSizeIdx] = useState<number>(defaultSizeIdx)
  const [qty, setQty] = useState(1)

  const size = product.sizes[sizeIdx] ?? product.sizes[0]
  const kg = size ? perKg(size) : null
  const serving = size ? perServing(size) : null
  const saving =
    size?.comparePrice && size.comparePrice > size.price
      ? Math.round((size.comparePrice - size.price) * 100) / 100
      : null
  const selectedFlavor = flavors.find((f) => f.name === flavor) ?? null
  const outOfStock = !product.inStock

  const scrollToReviews = () => {
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAdd = () => {
    if (!size || outOfStock) return
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.image,
        flavor: flavor ?? '—',
        sizeLabel: size.label,
        unitPrice: size.price,
      },
      qty
    )
    toast({
      title: 'Added to cart',
      description: `${product.brand} ${product.name} · ${flavor ?? '—'} · ${size.label}`,
    })
    openCart()
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Title block */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {product.brand}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900">
          {product.brand} {product.name}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <RatingStars rating={product.rating} size={15} />
          <span className="text-sm font-semibold text-zinc-800">
            {product.rating.toFixed(1)}
          </span>
          <Button
            variant="link"
            size="sm"
            onClick={scrollToReviews}
            className="h-auto p-0 text-sm text-zinc-500"
            aria-label={`Scroll to ${product.reviewCount.toLocaleString()} reviews`}
          >
            {product.reviewCount.toLocaleString()} reviews
          </Button>
        </div>
        <p className="mt-3 leading-relaxed text-zinc-600">{product.tagline}</p>
      </div>

      {/* Price block */}
      {size && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">
              {formatEUR(size.price)}
            </span>
            {size.comparePrice && size.comparePrice > size.price && (
              <span className="text-base text-zinc-400 line-through">
                {formatEUR(size.comparePrice)}
              </span>
            )}
            {saving && (
              <Badge className="bg-zinc-900 text-xs font-bold text-white hover:bg-zinc-900">
                Save {formatEUR(saving)}
              </Badge>
            )}
          </div>
          {(kg !== null || serving !== null) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {kg !== null && (
                <span className="rounded-full bg-zinc-200/70 px-2.5 py-1 text-xs font-medium text-zinc-600">
                  {formatEUR(kg)}/kg
                </span>
              )}
              {serving !== null && (
                <span className="rounded-full bg-zinc-200/70 px-2.5 py-1 text-xs font-medium text-zinc-600">
                  {formatEUR(serving)}/serving
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Flavor selector */}
      {flavors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-bold text-zinc-900">
            Flavor: <span className="font-semibold text-zinc-700">{flavor}</span>
          </p>
          <div
            role="radiogroup"
            aria-label="Choose flavor"
            className="flex flex-wrap gap-2"
          >
            {flavors.map((f) => (
              <FlavorSwatch
                key={f.name}
                color={f.color}
                name={f.name}
                size="sm"
                selected={f.name === flavor}
                disabled={!f.inStock}
                onClick={() => setFlavor(f.name)}
              />
            ))}
          </div>
          {selectedFlavor?.rating != null && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
              <Star
                size={12}
                strokeWidth={0}
                className="fill-amber-400"
                aria-hidden="true"
              />
              {selectedFlavor.rating.toFixed(1)} from{' '}
              {(selectedFlavor.reviewCount ?? 0).toLocaleString()} flavor reviews
            </p>
          )}
        </div>
      )}

      {/* Size selector */}
      {product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-bold text-zinc-900">Size</p>
          <div
            role="radiogroup"
            aria-label="Choose size"
            className="flex flex-wrap gap-2"
          >
            {product.sizes.map((s, i) => (
              <button
                key={s.label}
                type="button"
                role="radio"
                aria-checked={i === sizeIdx}
                onClick={() => setSizeIdx(i)}
                className={cn(
                  'flex min-h-11 min-w-32 flex-col items-start rounded-lg border px-3.5 py-2 text-left transition-all',
                  i === sizeIdx
                    ? 'border-primary ring-1 ring-primary bg-primary/5'
                    : 'border-zinc-300 bg-white hover:border-zinc-400'
                )}
              >
                <span className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                  {s.label}
                  {s.popular && (
                    <Badge className="bg-primary text-[10px] font-bold uppercase tracking-wide text-white hover:bg-primary">
                      Popular
                    </Badge>
                  )}
                </span>
                {s.sublabel && (
                  <span className="text-xs text-zinc-500">{s.sublabel}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + CTA */}
      <div className="flex items-stretch gap-3">
        <div className="flex items-center rounded-lg border border-zinc-300">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-11 w-11 rounded-md hover:bg-zinc-100"
          >
            <Minus size={16} />
          </Button>
          <span
            aria-live="polite"
            aria-label={`Quantity ${qty}`}
            className="w-8 text-center text-sm font-bold tabular-nums text-zinc-900"
          >
            {qty}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            disabled={qty >= MAX_QTY}
            onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            className="h-11 w-11 rounded-md hover:bg-zinc-100"
          >
            <Plus size={16} />
          </Button>
        </div>
        <Button
          size="lg"
          disabled={outOfStock}
          onClick={handleAdd}
          aria-label={
            outOfStock
              ? `${product.name} is out of stock`
              : `Add ${qty} × ${product.name} to cart for ${formatEUR((size?.price ?? 0) * qty)}`
          }
          className="h-12 min-h-11 flex-1 text-base font-extrabold"
        >
          {outOfStock
            ? 'Out of stock'
            : `Add to cart · ${formatEUR((size?.price ?? 0) * qty)}`}
        </Button>
      </div>

      {/* Trust row */}
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-600">
        <li className="flex items-center gap-1.5">
          <Truck size={15} className="text-primary" aria-hidden="true" />
          Free shipping over €59
        </li>
        <li className="flex items-center gap-1.5">
          <Zap size={15} className="text-primary" aria-hidden="true" />
          Ships in 24h
        </li>
        <li className="flex items-center gap-1.5">
          <RotateCcw size={15} className="text-primary" aria-hidden="true" />
          30-day returns
        </li>
      </ul>
    </div>
  )
}
