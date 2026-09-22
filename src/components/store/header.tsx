'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { Menu, Search, ShoppingCart, Dumbbell } from 'lucide-react'
import { useNavStore } from '@/store/nav-store'
import { cartCount, useCartStore } from '@/store/cart-store'
import { searchProducts } from '@/lib/api-client'
import { formatEUR } from '@/lib/format'
import type { ProductCardData } from '@/lib/types'
import { UspBar } from './usp-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Protein', slug: 'protein', dropdown: true },
  { label: 'Pre-Workout', slug: 'pre-workout' },
  { label: 'Creatine', slug: 'creatine' },
  { label: 'Amino Acids', slug: 'amino' },
  { label: 'Vitamins', slug: 'vitamins' },
  { label: 'Accessories', slug: 'accessories' },
  { label: 'Bundles', slug: 'bundles' },
]

const PROTEIN_DROPDOWN = [
  {
    slug: 'esn-designer-whey',
    name: 'Designer Whey',
    desc: 'The #1 whey — 76% protein',
  },
  { slug: 'esn-isoclear', name: 'Isoclear', desc: 'Clear whey isolate, lactose-free' },
  { slug: 'esn-vegan-protein', name: 'Vegan Protein', desc: '100% plant-based' },
]

function SearchBox({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const navigate = useNavStore((s) => s.navigate)
  const [q, setQ] = useState('')
  const [results, setResults] = useState<ProductCardData[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (q.trim().length < 2) {
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
    }, 250)
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
    if (q.trim().length < 2) return
    setOpen(false)
    navigate({ name: 'category', slug: 'search', q: q.trim() })
  }

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      <Search
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
      />
      <Input
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        onFocus={() => q.trim().length >= 2 && results.length > 0 && setOpen(true)}
        placeholder="Search whey, creatine, flavors…"
        aria-label="Search products"
        className="h-10 rounded-lg border-zinc-200 bg-zinc-50 pl-9 text-sm focus-visible:ring-primary"
      />
      {open && (
        <div className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
          {loading && results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-zinc-400">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-zinc-400">
              No products found for “{q}”. Try “whey” or “creatine”.
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
                      <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-zinc-900">
                        {p.brand} {p.name}
                      </span>
                      <span className="block truncate text-xs text-zinc-500">
                        {p.categoryName} · {p.flavorCount > 1 ? `${p.flavorCount} flavors` : p.sizes[0]?.label}
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
                  See all results for “{q}” →
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
      aria-label={`Open cart, ${count} items`}
      className="relative h-10 w-10 rounded-lg hover:bg-zinc-100"
    >
      <ShoppingCart size={20} className="text-zinc-800" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Button>
  )
}

export function Header() {
  const navigate = useNavStore((s) => s.navigate)
  const view = useNavStore((s) => s.view)
  const [mobileOpen, setMobileOpen] = useState(false)

  const go = (slug: string) => {
    setMobileOpen(false)
    navigate({ name: 'category', slug })
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
                aria-label="Open menu"
                className="lg:hidden h-10 w-10"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="flex items-center gap-2 border-b border-zinc-200 px-4 py-4 text-lg font-extrabold">
                <Dumbbell size={18} className="text-primary" /> FUELD
              </SheetTitle>
              <nav aria-label="Mobile navigation" className="flex flex-col p-2">
                {NAV.map((n) => (
                  <button
                    key={n.slug}
                    onClick={() => go(n.slug)}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
                  >
                    {n.label}
                  </button>
                ))}
                <div className="my-2 border-t border-zinc-100" />
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    navigate({ name: 'brand', slug: 'esn' })
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
                >
                  ESN Brand Shop
                </button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* logo */}
          <button
            onClick={() => navigate({ name: 'home' })}
            className="flex shrink-0 items-center gap-1.5"
            aria-label="FUELD — go to homepage"
          >
            <Dumbbell size={22} className="text-primary" />
            <span className="text-xl font-extrabold tracking-tight text-zinc-950">
              FUELD<span className="text-primary">.</span>
            </span>
          </button>

          {/* desktop nav */}
          <nav aria-label="Main navigation" className="ml-4 hidden items-center gap-0.5 lg:flex">
            {NAV.map((n) => (
              <div key={n.slug} className="group relative">
                <button
                  onClick={() => go(n.slug)}
                  className={cn(
                    'flex items-center gap-0.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950',
                    view.name === 'category' && view.slug === n.slug && 'bg-zinc-100 text-zinc-950'
                  )}
                  aria-haspopup={n.dropdown ? 'true' : undefined}
                >
                  {n.label}
                  {n.slug === 'protein' && (
                    <span className="ml-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                      Hero
                    </span>
                  )}
                </button>
                {n.dropdown && (
                  <div className="invisible absolute left-0 top-full z-50 w-80 pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 shadow-xl">
                      {PROTEIN_DROPDOWN.map((p) => (
                        <button
                          key={p.slug}
                          onClick={() => {
                            navigate({ name: 'product', slug: p.slug })
                          }}
                          className="block w-full rounded-lg px-3 py-2.5 text-left hover:bg-zinc-50"
                        >
                          <span className="block text-sm font-bold text-zinc-900">{p.name}</span>
                          <span className="block text-xs text-zinc-500">{p.desc}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => go('protein')}
                        className="mt-1 block w-full rounded-lg border-t border-zinc-100 px-3 py-2.5 text-left text-sm font-bold text-primary hover:bg-zinc-50"
                      >
                        Shop all protein →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => navigate({ name: 'brand', slug: 'esn' })}
              className="whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              ESN Brand Shop
            </button>
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
