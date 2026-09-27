'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api-client'
import { BESTSELLER_LIMIT } from '@/data/commerce'
import { BESTSELLERS_COPY } from '@/data/copy/home'
import { ErrorState, ProductGrid, ProductGridSkeleton, SectionHeading } from '@/core'

export function Bestsellers() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: () => fetchProducts({ bestseller: true }),
  })

  return (
    <section className="bg-zinc-50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow={BESTSELLERS_COPY.eyebrow}
          title={BESTSELLERS_COPY.title}
          subtitle={BESTSELLERS_COPY.subtitle}
        />

        {isPending && <ProductGridSkeleton />}

        {isError && (
          <ErrorState message={BESTSELLERS_COPY.errorTitle} onRetry={() => refetch()} />
        )}

        {data &&
          (data.products.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-sm text-zinc-500">
              {BESTSELLERS_COPY.emptyTitle}
            </p>
          ) : (
            <ProductGrid products={data.products.slice(0, BESTSELLER_LIMIT)} />
          ))}
      </div>
    </section>
  )
}
