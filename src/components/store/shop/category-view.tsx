'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, SearchX } from 'lucide-react'
import { fetchProducts } from '@/lib/api-client'
import type { ProductCardData, SortOption } from '@/lib/types'
import { useNavStore } from '@/store/nav-store'
import {
  ProductCard,
  ProductCardSkeleton,
} from '@/components/store/shared/product-card'
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

// ─── Static category metadata ────────────────────────────────────────────────

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  protein: {
    title: 'Protein',
    description:
      'Whey protein, isolates & vegan blends — the foundation of every training goal.',
  },
  'pre-workout': {
    title: 'Pre-Workout',
    description:
      'Booster and pump supplements for maximum focus, energy and performance.',
  },
  creatine: {
    title: 'Creatine',
    description:
      'Creapure® creatine monohydrate — the most researched supplement in sports nutrition.',
  },
  amino: {
    title: 'Amino Acids',
    description:
      'EAAs and citrulline for recovery, pump and muscle protection.',
  },
  vitamins: {
    title: 'Vitamins & Health',
    description: 'ZMA and micronutrients to cover your daily basics.',
  },
  accessories: {
    title: 'Accessories',
    description: 'Shakers and everything around the shaker cup.',
  },
  bundles: {
    title: 'Bundles & Sets',
    description: 'Curated stacks at a better price — the easy way to start.',
  },
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'rating', label: 'Top rated' },
]

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'whey', label: 'Whey' },
  { value: 'isolate', label: 'Isolate' },
  { value: 'vegan', label: 'Vegan' },
] as const

type TypeFilter = (typeof TYPE_FILTERS)[number]['value']

// ─── Protein comparison table (static, protein category only) ────────────────

const COMPARISON_ROWS: { label: string; values: [string, string, string] }[] = [
  { label: 'Protein per 100 g', values: ['76 g', '82 g', '68 g'] },
  { label: 'Texture', values: ['Creamy shake', 'Crystal-clear drink', 'Smooth & creamy'] },
  { label: 'Lactose-free', values: ['No', 'Yes', 'Yes'] },
  { label: 'Best for', values: ['Taste & everyday', 'Cutting & summer', 'Plant-based diets'] },
  { label: 'From', values: ['€29.90', '€34.90', '€32.90'] },
]

const COMPARISON_COLUMNS: { slug: string; name: string }[] = [
  { slug: 'esn-designer-whey', name: 'Designer Whey' },
  { slug: 'esn-isoclear', name: 'Isoclear' },
  { slug: 'esn-vegan-protein', name: 'Vegan Protein' },
]

function ProteinComparisonTable() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-32 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Compare
              </TableHead>
              {COMPARISON_COLUMNS.map((col) => (
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
            {COMPARISON_ROWS.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="text-xs font-semibold text-zinc-500">
                  {row.label}
                </TableCell>
                {row.values.map((v, i) => (
                  <TableCell
                    key={i}
                    className={cn(
                      'text-sm text-zinc-800',
                      row.label === 'From' && 'font-extrabold text-zinc-900'
                    )}
                  >
                    {v}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className="hover:bg-transparent">
              <TableCell className="pb-4" />
              {COMPARISON_COLUMNS.map((col) => (
                <TableCell key={col.slug} className="pb-4">
                  <Button
                    size="sm"
                    className="h-9 w-full min-w-20"
                    onClick={() => navigate({ name: 'product', slug: col.slug })}
                  >
                    View
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 sm:px-6">
        Not sure? Get the{' '}
        <button
          type="button"
          onClick={() => navigate({ name: 'product', slug: 'whey-sample-box' })}
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Whey Sample Box →
        </button>
      </div>
    </div>
  )
}

// ─── Main view ───────────────────────────────────────────────────────────────

export function CategoryView({ slug, q }: { slug: string; q?: string }) {
  const navigate = useNavStore((s) => s.navigate)
  const [sort, setSort] = useState<SortOption>('popular')
  const [type, setType] = useState<TypeFilter>('all')

  const isSearch = slug === 'search'
  const isProtein = slug === 'protein'
  const meta = !isSearch ? CATEGORY_META[slug] : undefined

  const { data, isLoading, isError } = useQuery({
    queryKey: ['category', slug, q ?? '', sort],
    queryFn: () =>
      isSearch
        ? fetchProducts({ q, sort })
        : fetchProducts({ category: slug, sort }),
  })

  const products: ProductCardData[] = useMemo(() => {
    const list = data?.products ?? []
    if (!isProtein || type === 'all') return list
    return list.filter((p) =>
      `${p.name} ${p.tagline}`.toLowerCase().includes(type)
    )
  }, [data, isProtein, type])

  const title = isSearch ? `Search results for “${q}”` : (meta?.title ?? slug)

  return (
    <section aria-label={title} className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb + heading */}
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex items-center gap-1 text-xs text-zinc-500">
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
          <li aria-current="page" className="font-semibold text-zinc-800">
            {isSearch ? 'Search' : title}
          </li>
        </ol>
      </nav>

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
          11 flavors across the range — every flavor rated by real customers.
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
            TYPE_FILTERS.map((f) => (
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
              {isLoading ? 'Loading…' : `${products.length} products`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="category-sort" className="sr-only">
            Sort products
          </label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger id="category-sort" className="h-9 w-40 text-sm">
              <SelectValue placeholder="Sort" />
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
          {isLoading ? '…' : `${products.length} products`}
        </p>
      )}

      {/* Grid / loading / empty */}
      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <p className="text-sm font-semibold text-zinc-900">
            Something went wrong loading products.
          </p>
          <p className="text-sm text-zinc-500">Please try again in a moment.</p>
        </div>
      ) : products.length === 0 ? (
        <EmptyState q={q} isSearch={isSearch} />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ q, isSearch }: { q?: string; isSearch: boolean }) {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
        <SearchX className="text-zinc-400" size={26} aria-hidden="true" />
      </span>
      <div>
        <p className="text-lg font-extrabold text-zinc-900">
          {isSearch ? `Nothing found for “${q}”` : 'No products here yet'}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          {isSearch
            ? 'Try “whey”, “creatine”, “vanilla”'
            : 'Check back soon — new products are on the way.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => navigate({ name: 'home' })}>Back to home</Button>
        {isSearch && (
          <Button
            variant="outline"
            onClick={() => navigate({ name: 'category', slug: 'protein' })}
          >
            Back to shop
          </Button>
        )}
      </div>
    </div>
  )
}
