'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { useNavStore } from '@/store/nav-store'
import { cartCount, useCartStore } from '@/store/cart-store'
import { searchProducts } from '@/lib/api-client'
import { formatEUR } from '@/lib/format'
import type { ProductCardData, View } from '@/lib/types'
import { CART_BADGE_MAX, SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH } from '@/data/commerce'
import {
  HOME_VIEW,
  MAIN_NAV,
  PROTEIN_DROPDOWN,
  PROTEIN_VIEW,
} from '@/data/navigation'
import { CART_COPY } from '@/data/copy/cart'
import { HEADER_COPY } from '@/data/copy/chrome'
import { IMAGE_SIZES } from '@/data/images'
import { HERO_BRAND, SITE } from '@/data/site'
import { Icon } from '@/core/icon'
import { UspBar } from './usp-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

function SearchBox({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const navigate = useNavStore((s) => s.navigate)
  const [q, setQ] = useState('')
  const [results, setResults] = useState<ProductCardData[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (q.trim().length < SEARCH_MIN_LENGTH) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await searchProducts(q.trim())
        setResults(res.products)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const submit = () => {
    if (q.trim().length < SEARCH_MIN_LENGTH) return
    setOpen(false)
    navigate({ name: 'category', slug: 'search', q: q.trim() })
  }

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      <Icon
        name="search"
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
      />
      <Input
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        onFocus={() => q.trim().length >= SEARCH_MIN_LENGTH && results.length > 0 && setOpen(true)}
        placeholder={HEADER_COPY.searchPlaceholder}
        aria-label={HEADER_COPY.searchAriaLabel}
        className="h-10 rounded-lg border-zinc-200 bg-zinc-50 pl-9 text-sm focus-visible:ring-primary"
      />
      {open && (
        <div className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
          {loading && results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-zinc-400">{HEADER_COPY.searching}</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-zinc-400">
              {HEADER_COPY.noResults(q.trim())}
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-zinc-50"
                    onClick={() => {
                      setOpen(false)
                      setQ('')
                      navigate({ name: 'product', slug: p.slug })
                    }}
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes={IMAGE_SIZES.searchResult}
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-zinc-900">
                        {p.brand} {p.name}
                      </span>
                      <span className="block truncate text-xs text-zinc-500">
                        {p.categoryName} ·{' '}
                        {p.flavorCount > 1
                          ? HEADER_COPY.flavourCount(p.flavorCount)
                          : p.sizes[0]?.label}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-zinc-900">
                      {formatEUR(p.priceFrom)}
                    </span>
                  </button>
                </li>
              ))}
              <li className="border-t border-zinc-100">
                <button
                  type="button"
                  onClick={submit}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-primary hover:bg-zinc-50"
                >
                  {HEADER_COPY.seeAllResults(q.trim())}
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function CartButton() {
  const items = useCartStore((s) => s.items)
  const open = useCartStore((s) => s.open)
  // true after hydration on the client, false during SSR render
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const count = mounted ? cartCount(items) : 0
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={open}
      aria-label={`${CART_COPY.openAriaLabel}, ${count} items`}
      className="relative h-10 w-10 rounded-lg hover:bg-zinc-100"
    >
      <Icon name="shopping-cart" size={20} className="text-zinc-800" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
          {count > CART_BADGE_MAX ? `${CART_BADGE_MAX}+` : count}
        </span>
      )}    </Button>
  )
}

export function Header() {
  const navigate = useNavStore((s) => s.navigate)
  const view = useNavStore((s) => s.view)
  const [mobileOpen, setMobileOpen] = useState(false)

  const go = (v: View) => {
    setMobileOpen(false)
    navigate(v)
  }

  return (
    <header className="sticky top-0 z-40">
      <UspBar />
      <div className="border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          {/* mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={HEADER_COPY.menuAriaLabel}
                className="h-10 w-10 lg:hidden"
              >
                <Icon name="menu" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="flex items-center gap-2 border-b border-zinc-200 px-4 py-4 text-lg font-extrabold">
                <Icon name="dumbbell" size={18} className="text-primary" /> {SITE.name}
              </SheetTitle>
              <nav aria-label={HEADER_COPY.mobileNavAriaLabel} className="flex flex-col p-2">
                {MAIN_NAV.filter((item) => item.view.name === 'category').map((item) => (
                  <button
                    key={item.view.name === 'category' ? item.view.slug : item.label}
                    onClick={() => go(item.view)}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="my-2 border-t border-zinc-100" />
                <button
                  onClick={() => go({ name: 'brand', slug: HERO_BRAND.slug })}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
                >
                  {HERO_BRAND.shopLabel}
                </button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* logo */}
          <button
            onClick={() => go(HOME_VIEW)}
            className="flex shrink-0 items-center gap-1.5"
            aria-label={HEADER_COPY.homeAriaLabel}
          >
            <Icon name="dumbbell" size={22} className="text-primary" />
            <span className="text-xl font-extrabold tracking-tight text-zinc-950">
              {SITE.wordmark}
              <span className="text-primary">{SITE.wordmarkSuffix}</span>
            </span>
          </button>

          {/* desktop nav */}
          <nav aria-label={HEADER_COPY.mainNavAriaLabel} className="ml-4 hidden items-center gap-0.5 lg:flex">
            {MAIN_NAV.map((item) => {
              const slug = item.view.name === 'category' ? item.view.slug : null
              const active = slug !== null && view.name === 'category' && view.slug === slug
              return (
                <div key={item.label} className="group relative">
                  <button
                    onClick={() => go(item.view)}
                    className={cn(
                      'flex items-center gap-0.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950',
                      active && 'bg-zinc-100 text-zinc-950'
                    )}
                    aria-haspopup={item.dropdown ? 'true' : undefined}
                  >
                    {item.label}
                  </button>
                  {item.dropdown && (
                    <div className="invisible absolute left-0 top-full z-50 w-80 pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 shadow-xl">
                        {PROTEIN_DROPDOWN.map((entry) => (
                          <button
                            key={entry.label}
                            onClick={() => go(entry.view)}
                            className="block w-full rounded-lg px-3 py-2.5 text-left hover:bg-zinc-50"
                          >
                            <span className="block text-sm font-bold text-zinc-900">
                              {entry.label}
                            </span>
                            <span className="block text-xs text-zinc-500">
                              {entry.description}
                            </span>
                          </button>
                        ))}
                        <button
                          onClick={() => go(PROTEIN_VIEW)}
                          className="mt-1 block w-full rounded-lg border-t border-zinc-100 px-3 py-2.5 text-left text-sm font-bold text-primary hover:bg-zinc-50"
                        >
                          {HEADER_COPY.dropdownTriggerLabel}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <SearchBox className="hidden w-64 md:block" />
            <CartButton />
          </div>
        </div>
        {/* mobile search row */}
        <div className="border-t border-zinc-100 px-4 py-2 md:hidden">
          <SearchBox />
        </div>
      </div>
    </header>
  )
}
