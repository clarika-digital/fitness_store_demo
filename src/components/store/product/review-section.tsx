'use client'

import { useMemo } from 'react'
import { DATE_LOCALE } from '@/data/commerce'
import { GLYPH_COPY } from '@/data/copy/chrome'
import { REVIEW_SECTION_COPY } from '@/data/copy/product'
import { TOP_FLAVORS_LIMIT } from '@/data/products'
import { ratingDistribution } from '@/lib/format'
import type { ProductDetailData } from '@/lib/types'
import { FlavorSwatch, Icon, RatingStars, SectionHeading } from '@/core'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export function ReviewSection({ product }: { product: ProductDetailData }) {
  const { average, count, distribution, items } = product.reviews

  const dist = useMemo(
    () =>
      (distribution && distribution.length > 0
        ? distribution
        : ratingDistribution(average, count)
      )
        .slice()
        .sort((a, b) => b.stars - a.stars),
    [distribution, average, count]
  )

  const topFlavors = useMemo(
    () =>
      (product.flavors ?? [])
        .filter((f) => (f.reviewCount ?? 0) > 0)
        .slice()
        .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
        .slice(0, TOP_FLAVORS_LIMIT),
    [product.flavors]
  )

  if (count <= 0) return null

  return (
    <section
      id={REVIEW_SECTION_COPY.id}
      aria-label={REVIEW_SECTION_COPY.ariaLabel}
      className="mt-16 scroll-mt-24"
    >
      <SectionHeading
        eyebrow={REVIEW_SECTION_COPY.eyebrow}
        title={REVIEW_SECTION_COPY.title}
        subtitle={REVIEW_SECTION_COPY.subtitle(product.brand, product.name)}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Summary card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-end gap-2">
            <span className="text-5xl font-extrabold leading-none tracking-tight text-zinc-900">
              {average.toFixed(1)}
            </span>
            <span className="pb-0.5 text-lg font-semibold text-zinc-400">
              {REVIEW_SECTION_COPY.outOf}
            </span>
          </div>
          <div className="mt-2">
            <RatingStars rating={average} size={16} />
          </div>
          <p className="mt-1.5 text-sm text-zinc-500">
            {REVIEW_SECTION_COPY.reviewsCount(count.toLocaleString(DATE_LOCALE))}
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            {dist.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="w-9 shrink-0 text-xs font-semibold text-zinc-600">
                  {REVIEW_SECTION_COPY.starsLabel(d.stars)}
                </span>
                <Progress
                  value={d.pct}
                  aria-label={REVIEW_SECTION_COPY.distributionAriaLabel(d.pct, d.stars)}
                  className="h-2 flex-1 bg-zinc-100"
                />
                <span className="w-10 shrink-0 text-right text-xs tabular-nums text-zinc-500">
                  {d.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top flavors card */}
        {topFlavors.length > 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900">
              {REVIEW_SECTION_COPY.topFlavorsTitle}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              {REVIEW_SECTION_COPY.topFlavorsBody}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {topFlavors.map((f) => (
                <li key={f.name} className="flex items-center justify-between gap-2">
                  <FlavorSwatch color={f.color} name={f.name} size="sm" />
                  <span className="flex shrink-0 items-center gap-1.5">
                    <RatingStars rating={f.rating ?? 0} size={11} />
                    <span className="text-xs tabular-nums text-zinc-500">
                      ({(f.reviewCount ?? 0).toLocaleString(DATE_LOCALE)})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Review list */}
        <div
          className={cn(
            'rounded-xl border border-zinc-200 bg-white p-4 sm:p-6',
            topFlavors.length === 0 && 'lg:col-span-2'
          )}
        >
          <ul
            className="scrollbar-slim flex max-h-[520px] flex-col gap-4 overflow-y-auto pr-1"
            aria-label={REVIEW_SECTION_COPY.listAriaLabel}
          >
            {items.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4"
              >
                <RatingStars rating={r.rating} size={12} />
                <p className="mt-1.5 text-sm font-bold text-zinc-900">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600">{r.text}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-700">{r.author}</span>
                  {r.verified && (
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <Icon name={REVIEW_SECTION_COPY.verifiedPurchaseIcon} size={13} />
                      {REVIEW_SECTION_COPY.verifiedPurchase}
                    </span>
                  )}
                  {r.flavor && (
                    <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 font-medium text-zinc-600">
                      {r.flavor}
                    </span>
                  )}
                  <span aria-hidden>{GLYPH_COPY.separator}</span>
                  <time dateTime={r.createdAt}>
                    {new Date(r.createdAt).toLocaleDateString(DATE_LOCALE)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
