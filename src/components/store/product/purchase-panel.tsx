'use client'

import { useMemo, useState } from 'react'
import { NO_FLAVOR_LABEL, QTY_MAX, QTY_MIN } from '@/data/commerce'
import { DATE_LOCALE } from '@/data/commerce'
import { PRODUCT_CARD_COPY, PURCHASE_PANEL_COPY } from '@/data/copy/product'
import { PDP_TRUST_ROW } from '@/data/products'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/use-toast'
import { formatEUR, perKg, perServing } from '@/lib/format'
import type { ProductDetailData } from '@/lib/types'
import {
  FlavorSwatch,
  Icon,
  PriceBlock,
  QuantityStepper,
  RatingStars,
} from '@/core'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const FIRST_INDEX = 0

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
    return i >= FIRST_INDEX ? i : FIRST_INDEX
  }, [product.sizes])

  const [flavor, setFlavor] = useState<string | null>(firstAvailable)
  const [sizeIdx, setSizeIdx] = useState<number>(defaultSizeIdx)
  const [qty, setQty] = useState(QTY_MIN)

  const size = product.sizes[sizeIdx] ?? product.sizes[FIRST_INDEX]
  const kg = size ? perKg(size) : null
  const serving = size ? perServing(size) : null
  const selectedFlavor = flavors.find((f) => f.name === flavor) ?? null
  const outOfStock = !product.inStock
  const lineTotal = formatEUR((size?.price ?? 0) * qty)
  const reviewCount = product.reviewCount.toLocaleString(DATE_LOCALE)

  const scrollToReviews = () => {
    document
      .getElementById(PURCHASE_PANEL_COPY.reviewsAnchorId)
      ?.scrollIntoView({ behavior: 'smooth' })
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
        flavor: flavor ?? NO_FLAVOR_LABEL,
        sizeLabel: size.label,
        unitPrice: size.price,
      },
      qty
    )
    toast({
      title: PRODUCT_CARD_COPY.toast.title,
      description: PURCHASE_PANEL_COPY.toast.description(
        product.brand,
        product.name,
        flavor ?? NO_FLAVOR_LABEL,
        size.label
      ),
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
            aria-label={PURCHASE_PANEL_COPY.reviewsScrollLabel(reviewCount)}
          >
            {PURCHASE_PANEL_COPY.reviewsLink(reviewCount)}
          </Button>
        </div>
        <p className="mt-3 leading-relaxed text-zinc-600">{product.tagline}</p>
      </div>

      {/* Price block */}
      {size && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
          <PriceBlock price={size.price} comparePrice={size.comparePrice} size="lg" />
          {(kg !== null || serving !== null) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {kg !== null && (
                <span className="rounded-full bg-zinc-200/70 px-2.5 py-1 text-xs font-medium text-zinc-600">
                  {formatEUR(kg)}
                  {PURCHASE_PANEL_COPY.perKgSuffix}
                </span>
              )}
              {serving !== null && (
                <span className="rounded-full bg-zinc-200/70 px-2.5 py-1 text-xs font-medium text-zinc-600">
                  {formatEUR(serving)}
                  {PURCHASE_PANEL_COPY.perServingSuffix}
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
            {PURCHASE_PANEL_COPY.flavorPrefix}{' '}
            <span className="font-semibold text-zinc-700">{flavor}</span>
          </p>
          <div
            role="radiogroup"
            aria-label={PURCHASE_PANEL_COPY.flavorAriaLabel}
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
              <Icon name="star" size={12} />
              {PURCHASE_PANEL_COPY.flavorRating(
                selectedFlavor.rating.toFixed(1),
                (selectedFlavor.reviewCount ?? 0).toLocaleString(DATE_LOCALE)
              )}
            </p>
          )}
        </div>
      )}

      {/* Size selector */}
      {product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-bold text-zinc-900">
            {PURCHASE_PANEL_COPY.sizeLabel}
          </p>
          <div
            role="radiogroup"
            aria-label={PURCHASE_PANEL_COPY.sizeAriaLabel}
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
                      {PURCHASE_PANEL_COPY.popularBadge}
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
        <QuantityStepper
          value={qty}
          onChange={setQty}
          min={QTY_MIN}
          max={QTY_MAX}
          decreaseAriaLabel={PURCHASE_PANEL_COPY.decreaseAriaLabel}
          increaseAriaLabel={PURCHASE_PANEL_COPY.increaseAriaLabel}
          quantityAriaLabel={PURCHASE_PANEL_COPY.quantityAriaLabel(qty)}
        />
        <Button
          size="lg"
          disabled={outOfStock}
          onClick={handleAdd}
          aria-label={
            outOfStock
              ? PURCHASE_PANEL_COPY.outOfStockAriaLabel(product.name)
              : PURCHASE_PANEL_COPY.addAriaLabel(qty, product.name, lineTotal)
          }
          className="h-12 min-h-11 flex-1 text-base font-extrabold"
        >
          {outOfStock
            ? PURCHASE_PANEL_COPY.outOfStockCta
            : PURCHASE_PANEL_COPY.addToCart(lineTotal)}
        </Button>
      </div>

      {/* Trust row */}
      <ul
        className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-600"
        aria-label={PURCHASE_PANEL_COPY.trustAriaLabel}
      >
        {PDP_TRUST_ROW.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <Icon name={item.icon} size={15} className="text-primary" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
