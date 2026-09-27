'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProduct } from '@/lib/api-client'
import { BREADCRUMB_COPY } from '@/data/copy/chrome'
import { PDP_ACCORDIONS_COPY, PRODUCT_VIEW_COPY } from '@/data/copy/product'
import { PRODUCT_NOT_FOUND_COPY } from '@/data/copy/states'
import { GALLERY_THUMB_COUNT } from '@/data/products'
import { IMAGE_SIZES } from '@/data/images'
import {
  BreadcrumbNav,
  EmptyState,
  ProductGrid,
  ProductThumbnail,
  SectionHeading,
} from '@/core'
import { useNavStore } from '@/store/nav-store'
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
import { cn } from '@/lib/utils'
import { PurchasePanel } from './purchase-panel'
import { ReviewSection } from './review-section'

// ─── Main view ───────────────────────────────────────────────────────────────

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
      <section
        aria-label={PRODUCT_VIEW_COPY.loadingAriaLabel}
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
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
      <section
        aria-label={PRODUCT_VIEW_COPY.ariaLabel}
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <EmptyState
          icon={PRODUCT_NOT_FOUND_COPY.icon}
          title={PRODUCT_NOT_FOUND_COPY.title}
          body={PRODUCT_NOT_FOUND_COPY.body}
          actions={[
            {
              label: PRODUCT_NOT_FOUND_COPY.backToHome,
              onSelect: () => navigate({ name: 'home' }),
            },
          ]}
        />
      </section>
    )
  }

  return (
    <section
      aria-label={`${product.brand} ${product.name}`}
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <BreadcrumbNav
        items={[
          { label: BREADCRUMB_COPY.home, view: { name: 'home' } },
          {
            label: product.categoryName,
            view: { name: 'category', slug: product.categorySlug },
          },
          { label: product.name },
        ]}
      />

      {/* Gallery + purchase panel */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <ProductThumbnail
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            className="aspect-square w-full border border-zinc-200 bg-white"
            priority
            sizes={IMAGE_SIZES.productMain}
          />
          <div
            className="mt-3 flex gap-2"
            role="group"
            aria-label={PRODUCT_VIEW_COPY.galleryAriaLabel}
          >
            {Array.from({ length: GALLERY_THUMB_COUNT }, (_, i) => (
              <ProductThumbnail
                key={i}
                src={product.image}
                alt=""
                size={80}
                className={cn(
                  'border',
                  i === 0 ? 'border-primary ring-1 ring-primary' : 'border-zinc-200'
                )}
                sizes={IMAGE_SIZES.productThumb}
              />
            ))}
          </div>
        </div>

        <PurchasePanel product={product} />
      </div>

      {/* Details accordions */}
      <div className="mt-10 rounded-xl border border-zinc-200 bg-white px-4 sm:px-6">
        <Accordion type="multiple" defaultValue={[PDP_ACCORDIONS_COPY.openByDefault]}>
          <AccordionItem value={PDP_ACCORDIONS_COPY.openByDefault}>
            <AccordionTrigger className="text-sm font-extrabold text-zinc-900">
              {PDP_ACCORDIONS_COPY.description}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-zinc-600">
              {product.description}
            </AccordionContent>
          </AccordionItem>

          {product.nutrition && product.nutrition.rows.length > 0 && (
            <AccordionItem value="nutrition">
              <AccordionTrigger className="text-sm font-extrabold text-zinc-900">
                {PDP_ACCORDIONS_COPY.nutrition}
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
                {PDP_ACCORDIONS_COPY.usage}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-zinc-600">
                {product.usage}
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="shipping">
            <AccordionTrigger className="text-sm font-extrabold text-zinc-900">
              {PDP_ACCORDIONS_COPY.shipping}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-zinc-600">
              {PDP_ACCORDIONS_COPY.shippingBody}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Reviews */}
      <ReviewSection product={product} />

      {/* Cross-sell */}
      {product.related.length > 0 && (
        <section aria-label={PRODUCT_VIEW_COPY.stackAriaLabel} className="mt-16">
          <SectionHeading
            eyebrow={PRODUCT_VIEW_COPY.stackEyebrow}
            title={PRODUCT_VIEW_COPY.stackTitle}
          />
          <ProductGrid products={product.related} />
        </section>
      )}
    </section>
  )
}
