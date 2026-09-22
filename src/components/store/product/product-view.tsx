'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, ChevronRight } from 'lucide-react'
import { fetchProduct } from '@/lib/api-client'
import { useNavStore } from '@/store/nav-store'
import { ProductCard } from '@/components/store/shared/product-card'
import { SectionHeading } from '@/components/store/shared/section-heading'
import { PurchasePanel } from './purchase-panel'
import { ReviewSection } from './review-section'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'

export function ProductView({ slug }: { slug: string }) {
  const navigate = useNavStore((s) => s.navigate)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
  })
  const product = data?.product

  // Reset scroll when switching between products.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (isLoading) {
    return (
      <section aria-label="Product" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-48" />
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </section>
    )
  }

  if (isError || !product) {
    return (
      <section aria-label="Product" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-zinc-300 bg-white py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
            <AlertCircle className="text-zinc-400" size={26} aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg font-extrabold text-zinc-900">
              Product not found
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              This product may have been moved or is no longer available.
            </p>
          </div>
          <Button onClick={() => navigate({ name: 'home' })}>Back to home</Button>
        </div>
      </section>
    )
  }

  const thumbIndexes = [0, 1, 2]

  return (
    <section aria-label={`${product.brand} ${product.name}`} className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-zinc-500">
          <li>
            <button
              type="button"
              onClick={() => navigate({ name: 'home' })}
              className="rounded px-1 py-0.5 font-medium underline-offset-4 hover:text-primary hover:underline"
            >
              Home
            </button>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={12} />
          </li>
          <li>
            <button
              type="button"
              onClick={() =>
                navigate({ name: 'category', slug: product.categorySlug })
              }
              className="rounded px-1 py-0.5 font-medium underline-offset-4 hover:text-primary hover:underline"
            >
              {product.categoryName}
            </button>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={12} />
          </li>
          <li aria-current="page" className="font-semibold text-zinc-800">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Gallery + purchase panel */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <Image
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="mt-3 flex gap-2" role="group" aria-label="Product images">
            {thumbIndexes.map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className={`relative h-20 w-20 overflow-hidden rounded-lg border bg-white ${
                  i === 0 ? 'border-primary ring-1 ring-primary' : 'border-zinc-200'
                }`}
              >
                <Image
                  src={product.image}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <PurchasePanel product={product} />
      </div>

      {/* Details accordions */}
      <div className="mt-10 rounded-xl border border-zinc-200 bg-white px-4 sm:px-6">
        <Accordion
          type="multiple"
          defaultValue={['description']}
          className="w-full"
        >
          <AccordionItem value="description">
            <AccordionTrigger className="text-sm font-extrabold text-zinc-900">
              Description
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-zinc-600">
              {product.description}
            </AccordionContent>
          </AccordionItem>

          {product.nutrition && product.nutrition.rows.length > 0 && (
            <AccordionItem value="nutrition">
              <AccordionTrigger className="text-sm font-extrabold text-zinc-900">
                Nutrition (per 100 g)
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableBody>
                    {product.nutrition.rows.map((row) => (
                      <TableRow key={row.label}>
                        <TableCell className="pl-0 text-sm font-medium text-zinc-600">
                          {row.label}
                        </TableCell>
                        <TableCell className="pr-0 text-right text-sm font-semibold text-zinc-900">
                          {row.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          )}

          {product.usage && (
            <AccordionItem value="usage">
              <AccordionTrigger className="text-sm font-extrabold text-zinc-900">
                How to use
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-zinc-600">
                {product.usage}
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="shipping">
            <AccordionTrigger className="text-sm font-extrabold text-zinc-900">
              Shipping &amp; returns
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-zinc-600">
              Free shipping over €59 · Standard €4.90 (2–4 days) · Express €9.90
              (next day) · 30-day returns
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Reviews */}
      <ReviewSection product={product} />

      {/* Cross-sell */}
      {product.related.length > 0 && (
        <section aria-label="Complete your stack" className="mt-16">
          <SectionHeading
            eyebrow="Frequently stacked"
            title="Complete your stack"
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {product.related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
