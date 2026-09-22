'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  FlaskConical,
  MapPin,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { fetchProducts } from '@/lib/api-client'
import { useNavStore } from '@/store/nav-store'
import { SectionHeading } from '@/components/store/shared/section-heading'
import { ProductCard, ProductCardSkeleton } from '@/components/store/shared/product-card'
import { Button } from '@/components/ui/button'

const ESN_VALUES = [
  {
    icon: MapPin,
    title: 'Produced in Germany',
    text: 'Own production lines — short paths, full control over every batch.',
  },
  {
    icon: FlaskConical,
    title: 'Regularly lab-tested',
    text: 'Batches checked for purity and label accuracy, so the tub matches the promise.',
  },
  {
    icon: Sparkles,
    title: 'Flavor obsession',
    text: '25+ flavors, re-tuned until they actually earn the name on the label.',
  },
]

function titleize(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function BrandPage({ slug }: { slug: string }) {
  const navigate = useNavStore((s) => s.navigate)
  const isEsn = slug === 'esn'
  const brandLabel = isEsn ? 'ESN' : titleize(slug)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => fetchProducts({}),
  })

  const products = useMemo(() => {
    if (!data) return []
    return data.products
      .filter((p) => p.brand.toLowerCase() === slug.toLowerCase())
      .sort((a, b) => {
        if (a.slug === 'esn-designer-whey') return -1
        if (b.slug === 'esn-designer-whey') return 1
        if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1
        return b.rating - a.rating
      })
  }, [data, slug])

  return (
    <div className="bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pt-6">
          <button
            type="button"
            onClick={() => navigate({ name: 'home' })}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-primary"
          >
            <ChevronLeft size={16} aria-hidden />
            Home
          </button>
          <span className="mx-2 text-sm text-zinc-300" aria-hidden>
            /
          </span>
          <span className="text-sm font-semibold text-zinc-900">Brands</span>
          <span className="mx-2 text-sm text-zinc-300" aria-hidden>
            /
          </span>
          <span className="text-sm font-semibold text-zinc-900">{brandLabel}</span>
        </nav>

        {/* Brand header */}
        <header className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Brand shop
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
              {isEsn
                ? 'European Sports Nutrition — Germany’s most-ordered whey.'
                : `Products from ${brandLabel} available at Fuel’d.`}
            </p>
          </div>
          {isEsn && (
            <ul className="grid gap-3 sm:grid-cols-3 lg:max-w-xl">
              {ESN_VALUES.map((value) => (
                <li
                  key={value.title}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <value.icon size={18} className="text-primary" aria-hidden />
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
            eyebrow={isEsn ? 'ESN range' : brandLabel}
            title={isEsn ? 'Every ESN product we stock' : `${brandLabel} products`}
            subtitle={
              isEsn
                ? 'From the 76%-protein classic to shakers and bundles — everything ships within 24h.'
                : undefined
            }
          />

          {isPending && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center">
              <AlertTriangle size={22} className="text-primary" aria-hidden />
              <p className="text-sm text-zinc-500">
                Products couldn’t be loaded. Check your connection and try again.
              </p>
              <Button
                variant="outline"
                className="min-h-11 gap-2 border-zinc-300"
                onClick={() => refetch()}
              >
                <RefreshCw size={14} />
                Try again
              </Button>
            </div>
          )}

          {data &&
            (products.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center">
                <p className="text-sm text-zinc-500">
                  No {brandLabel} products in stock right now — browse our categories instead.
                </p>
                <Button
                  variant="outline"
                  className="min-h-11 border-zinc-300"
                  onClick={() => navigate({ name: 'home' })}
                >
                  Back to home
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ))}
        </div>

        {/* Helper cross-link */}
        {isEsn && (
          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h3 className="text-lg font-extrabold text-zinc-900">Not sure which protein?</h3>
              <p className="mt-1 max-w-lg text-sm text-zinc-500">
                Whey, isolate or vegan — our protein category breaks down the differences without
                the hype.
              </p>
            </div>
            <Button
              className="h-11 shrink-0 px-6 text-sm font-bold"
              onClick={() => navigate({ name: 'category', slug: 'protein' })}
            >
              Compare proteins
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
