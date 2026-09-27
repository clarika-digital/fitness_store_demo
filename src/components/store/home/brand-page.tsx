'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api-client'
import { useNavigate } from '@/hooks/use-nav'
import { HERO_CATEGORY_SLUG } from '@/data/categories'
import { BREADCRUMB_COPY } from '@/data/copy/chrome'
import { BRAND_PAGE_COPY } from '@/data/copy/catalog'
import { BRAND_EMPTY_COPY } from '@/data/copy/states'
import { BRAND_VALUES, FEATURED_PRODUCTS } from '@/data/products'
import { HERO_BRAND } from '@/data/site'
import {
  BreadcrumbNav,
  EmptyState,
  ErrorState,
  Icon,
  ProductGrid,
  ProductGridSkeleton,
  SectionHeading,
} from '@/core'
import { Button } from '@/components/ui/button'

/** Slug ordering: hero product first, then bestsellers, then by rating. */
function titleize(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function BrandPage({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const isEsn = slug === HERO_BRAND.slug
  const brandLabel = isEsn ? HERO_BRAND.label : titleize(slug)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => fetchProducts({}),
  })

  const products = useMemo(() => {
    if (!data) return []
    return data.products
      .filter((p) => p.brand.toLowerCase() === slug.toLowerCase())
      .sort((a, b) => {
        if (a.slug === FEATURED_PRODUCTS.designerWhey) return -1
        if (b.slug === FEATURED_PRODUCTS.designerWhey) return 1
        if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1
        return b.rating - a.rating
      })
  }, [data, slug])

  return (
    <div className="bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="pt-6">
          <BreadcrumbNav
            items={[
              { label: BREADCRUMB_COPY.home, view: { name: 'home' } },
              { label: BRAND_PAGE_COPY.breadcrumbRoot },
              { label: brandLabel },
            ]}
            className="mb-0"
          />
        </div>

        {/* Brand header */}
        <header className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              {BRAND_PAGE_COPY.eyebrow}
            </p>
            <h1
              className={
                isEsn
                  ? 'mt-2 text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl'
                  : 'mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl'
              }
            >
              {brandLabel}
            </h1>
            <p className="mt-3 max-w-xl text-base text-zinc-500 sm:text-lg">
              {isEsn ? BRAND_PAGE_COPY.blurb : BRAND_PAGE_COPY.genericBlurb(brandLabel)}
            </p>
          </div>
          {isEsn && (
            <ul className="grid gap-3 sm:grid-cols-3 lg:max-w-xl" aria-label={BRAND_PAGE_COPY.valuesAriaLabel}>
              {BRAND_VALUES.map((value) => (
                <li
                  key={value.title}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <Icon name={value.icon} size={18} className="text-primary" />
                  <p className="mt-2 text-sm font-bold text-zinc-900">{value.title}</p>
                  <p className="mt-1 text-xs leading-snug text-zinc-500">{value.text}</p>
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* Product grid */}
        <div className="mt-10">
          <SectionHeading
            eyebrow={isEsn ? BRAND_PAGE_COPY.rangeEyebrow : brandLabel}
            title={isEsn ? BRAND_PAGE_COPY.title : BRAND_PAGE_COPY.genericProductsTitle(brandLabel)}
            subtitle={isEsn ? BRAND_PAGE_COPY.rangeSubtitle : undefined}
          />

          {isPending && <ProductGridSkeleton />}

          {isError && (
            <ErrorState message={BRAND_PAGE_COPY.errorTitle} onRetry={() => refetch()} />
          )}

          {data && products.length === 0 && (
            <EmptyState
              icon="package"
              title={BRAND_EMPTY_COPY.body(brandLabel)}
              actions={[
                {
                  label: BRAND_EMPTY_COPY.backToHome,
                  onSelect: () => navigate({ name: 'home' }),
                },
              ]}
            />
          )}

          {data && products.length > 0 && <ProductGrid products={products} />}
        </div>

        {/* Helper cross-link */}
        {isEsn && (
          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h3 className="text-lg font-extrabold text-zinc-900">
                {BRAND_PAGE_COPY.ctaTitle}
              </h3>
              <p className="mt-1 max-w-lg text-sm text-zinc-500">{BRAND_PAGE_COPY.ctaBody}</p>
            </div>
            <Button
              className="h-11 shrink-0 px-6 text-sm font-bold"
              onClick={() => navigate({ name: 'category', slug: HERO_CATEGORY_SLUG })}
            >
              {BRAND_PAGE_COPY.ctaLabel}
              <Icon name="arrow-right" size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
