'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api-client'
import type { ProductCardData, SortOption } from '@/lib/types'
import { useNavigate } from '@/hooks/use-nav'
import {
  HERO_CATEGORY_SLUG,
  PROTEIN_COMPARISON,
  PROTEIN_TYPE_FILTERS,
  SEARCH_CATEGORY_SLUG,
  categoryMeta,
  type ProteinTypeFilter,
} from '@/data/categories'
import { BREADCRUMB_COPY } from '@/data/copy/chrome'
import {
  CATEGORY_VIEW_COPY,
  COMPARISON_TABLE_COPY,
} from '@/data/copy/catalog'
import { CATALOG_EMPTY_COPY, PRODUCT_LOADING_ERROR_COPY, STATE_COPY } from '@/data/copy/states'
import { DEFAULT_SORT, SORT_OPTIONS } from '@/data/products'
import {
  BreadcrumbNav,
  EmptyState,
  Icon,
  ProductGrid,
  ProductGridSkeleton,
} from '@/core'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useMoney } from '@/hooks/use-money'

// ─── Protein comparison table (protein category only) ────────────────────────

function ProteinComparisonTable() {
  const navigate = useNavigate()
  const money = useMoney()

  return (
    <div
      className="rounded-xl border border-zinc-200 bg-white"
      aria-label={COMPARISON_TABLE_COPY.ariaLabel}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-32 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {COMPARISON_TABLE_COPY.headerLabel}
              </TableHead>
              {PROTEIN_COMPARISON.columns.map((col) => (
                <TableHead key={col.slug} className="min-w-36">
                  <button
                    type="button"
                    onClick={() => navigate({ name: 'product', slug: col.slug })}
                    className="text-left text-sm font-extrabold text-zinc-900 underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {col.name}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROTEIN_COMPARISON.rows(money).map((row) => (
              <TableRow key={row.label}>
                <TableCell className="text-xs font-semibold text-zinc-500">
                  {row.label}
                </TableCell>
                {row.values.map((v, i) => (
                  <TableCell
                    key={i}
                    className={cn(
                      'text-sm text-zinc-800',
                      row.emphasis && 'font-extrabold text-zinc-900'
                    )}
                  >
                    {v}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className="hover:bg-transparent">
              <TableCell className="pb-4" />
              {PROTEIN_COMPARISON.columns.map((col) => (
                <TableCell key={col.slug} className="pb-4">
                  <Button
                    size="sm"
                    className="h-9 w-full min-w-20"
                    onClick={() => navigate({ name: 'product', slug: col.slug })}
                  >
                    {COMPARISON_TABLE_COPY.cta}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 sm:px-6">
        {COMPARISON_TABLE_COPY.footerPrefix}{' '}
        <button
          type="button"
          onClick={() =>
            navigate({ name: 'product', slug: PROTEIN_COMPARISON.sampleBoxSlug })
          }
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          {COMPARISON_TABLE_COPY.footerLink}
        </button>
      </div>
    </div>
  )
}

// ─── Main view ───────────────────────────────────────────────────────────────

export function CategoryView({ slug, q }: { slug: string; q?: string }) {
  const navigate = useNavigate()
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT)
  const [type, setType] = useState<ProteinTypeFilter>('all')

  const isSearch = slug === SEARCH_CATEGORY_SLUG
  const isProtein = slug === HERO_CATEGORY_SLUG
  const meta = isSearch ? undefined : categoryMeta(slug)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['category', slug, q ?? '', sort],
    queryFn: () =>
      isSearch
        ? fetchProducts({ q, sort })
        : fetchProducts({ category: slug, sort }),
  })

  const products: ProductCardData[] = useMemo(() => {
    const list = data?.products ?? []
    if (!isProtein || type === 'all') return list
    return list.filter((p) => `${p.name} ${p.tagline}`.toLowerCase().includes(type))
  }, [data, isProtein, type])

  const title = isSearch
    ? CATEGORY_VIEW_COPY.searchTitle(q)
    : (meta?.title ?? slug)

  return (
    <section
      aria-label={title}
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <BreadcrumbNav
        items={[
          { label: BREADCRUMB_COPY.home, view: { name: 'home' } },
          { label: isSearch ? CATEGORY_VIEW_COPY.breadcrumbSearch : title },
        ]}
      />

      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
        {title}
      </h1>
      {!isSearch && meta && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
          {meta.description}
        </p>
      )}
      {isProtein && (
        <p className="mt-2 text-sm font-medium text-zinc-500">
          {CATEGORY_VIEW_COPY.proteinFlavorHint}
        </p>
      )}

      {/* Protein-only comparison table */}
      {isProtein && (
        <div className="mt-6">
          <ProteinComparisonTable />
        </div>
      )}

      {/* Filter / sort bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-h-9 flex-wrap items-center gap-2">
          {isProtein ? (
            PROTEIN_TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={type === f.value}
                onClick={() => setType(f.value)}
                className={cn(
                  'min-h-9 rounded-full border px-4 text-xs font-semibold transition-colors',
                  type === f.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900'
                )}
              >
                {f.label}
              </button>
            ))
          ) : (
            <span className="text-sm font-medium text-zinc-500">
              {isLoading
                ? CATEGORY_VIEW_COPY.loading
                : CATEGORY_VIEW_COPY.resultCount(products.length)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="category-sort" className="sr-only">
            {CATEGORY_VIEW_COPY.sortAriaLabel}
          </label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger id="category-sort" className="h-9 w-40 text-sm">
              <SelectValue placeholder={CATEGORY_VIEW_COPY.sortPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Result count for protein (chips replace the count on the left) */}
      {isProtein && (
        <p className="mt-2 text-xs text-zinc-400" aria-live="polite">
          {isLoading
            ? STATE_COPY.ellipsis
            : CATEGORY_VIEW_COPY.resultCount(products.length)}
        </p>
      )}

      {/* Grid / loading / error / empty */}
      {isLoading ? (
        <div className="mt-6">
          <ProductGridSkeleton />
        </div>
      ) : isError ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <Icon name="alert-triangle" size={22} className="text-primary" />
          <p className="text-sm font-semibold text-zinc-900">
            {PRODUCT_LOADING_ERROR_COPY.title}
          </p>
          <p className="text-sm text-zinc-500">{PRODUCT_LOADING_ERROR_COPY.body}</p>
          <Button variant="outline" onClick={() => refetch()}>
            {STATE_COPY.retry}
          </Button>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={CATALOG_EMPTY_COPY.icon}
          title={
            isSearch
              ? CATALOG_EMPTY_COPY.searchTitle(q)
              : CATALOG_EMPTY_COPY.categoryTitle
          }
          body={
            isSearch ? CATALOG_EMPTY_COPY.searchBody : CATALOG_EMPTY_COPY.categoryBody
          }
          actions={[
            {
              label: CATALOG_EMPTY_COPY.backToHome,
              onSelect: () => navigate({ name: 'home' }),
            },
            ...(isSearch
              ? [
                  {
                    label: CATALOG_EMPTY_COPY.backToShop,
                    onSelect: () =>
                      navigate({ name: 'category', slug: HERO_CATEGORY_SLUG }),
                    variant: 'outline' as const,
                  },
                ]
              : []),
          ]}
        />
      ) : (
        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      )}
    </section>
  )
}
