'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { fetchProducts } from '@/lib/api-client'
import { SectionHeading } from '@/components/store/shared/section-heading'
import { ProductCard, ProductCardSkeleton } from '@/components/store/shared/product-card'
import { Button } from '@/components/ui/button'

export function Bestsellers() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: () => fetchProducts({ bestseller: true }),
  })

  return (
    <section className="bg-zinc-50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Most ordered"
          title="Our bestsellers"
          subtitle="Ranked by real orders from the last 30 days."
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
              Bestsellers couldn’t be loaded. Check your connection and try again.
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
          (data.products.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-sm text-zinc-500">
              No bestsellers yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {data.products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ))}
      </div>
    </section>
  )
}
