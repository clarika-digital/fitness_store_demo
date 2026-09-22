'use client'

import Image from 'next/image'
import { useNavStore } from '@/store/nav-store'
import { SectionHeading } from '@/components/store/shared/section-heading'
import { cn } from '@/lib/utils'

type Tile = {
  slug: string
  label: string
  sub?: string
  image: string
  /** spans 2 cols x 2 rows in the mosaic */
  big?: boolean
  /** spans 2 cols (bottom row on desktop) */
  wide?: boolean
}

const tiles: Tile[] = [
  {
    slug: 'protein',
    label: 'Protein',
    sub: 'Whey · Isolate · Vegan',
    image: '/images/products/designer-whey.png',
    big: true,
  },
  { slug: 'pre-workout', label: 'Pre-Workout', image: '/images/products/ultra-booster.png' },
  { slug: 'creatine', label: 'Creatine', image: '/images/products/creatine.png' },
  { slug: 'amino', label: 'Amino Acids', image: '/images/products/eaa.png' },
  { slug: 'vitamins', label: 'Vitamins', image: '/images/products/zma.png' },
  { slug: 'accessories', label: 'Accessories', image: '/images/products/shaker.png', wide: true },
  { slug: 'bundles', label: 'Bundles', image: '/images/products/starter-bundle.png', wide: true },
]

function tileSizes(tile: Tile) {
  if (tile.big) return '(max-width: 1024px) 100vw, 50vw'
  if (tile.wide) return '(max-width: 1024px) 100vw, 50vw'
  return '(max-width: 640px) 50vw, 25vw'
}

export function CategoryTiles() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="Shop by category" title="Built around protein" />
        <div className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] lg:auto-rows-[12rem] lg:grid-cols-4">
          {tiles.map((tile) => (
            <button
              key={tile.slug}
              type="button"
              aria-label={`Shop ${tile.label}`}
              onClick={() => navigate({ name: 'category', slug: tile.slug })}
              className={cn(
                'group relative overflow-hidden rounded-xl text-left transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:shadow-lg hover:shadow-zinc-200/70',
                tile.big && 'col-span-2 row-span-2',
                tile.wide && 'col-span-2'
              )}
            >
              <Image
                src={tile.image}
                alt=""
                fill
                sizes={tileSizes(tile)}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-zinc-950/5 transition-colors duration-300 group-hover:from-zinc-950/95 group-hover:via-zinc-950/35"
              />
              <span className="absolute inset-x-0 bottom-0 block p-3 sm:p-4">
                <span
                  className={cn(
                    'block font-extrabold tracking-tight text-white',
                    tile.big ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
                  )}
                >
                  {tile.label}
                </span>
                {tile.sub && (
                  <span className="mt-0.5 block text-xs font-medium text-zinc-300 sm:text-sm">
                    {tile.sub}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
