'use client'

import Image from 'next/image'
import { useNavStore } from '@/store/nav-store'
import { CATEGORY_TILES, type CategoryTile } from '@/data/categories'
import { CATEGORY_TILES_COPY } from '@/data/copy/home'
import { IMAGE_SIZES } from '@/data/images'
import { SectionHeading } from '@/core'
import { cn } from '@/lib/utils'

function tileSizes(tile: CategoryTile) {
  if (tile.big || tile.wide) return IMAGE_SIZES.productTileWide
  return IMAGE_SIZES.productTile
}

export function CategoryTiles() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow={CATEGORY_TILES_COPY.eyebrow}
          title={CATEGORY_TILES_COPY.title}
        />
        <div className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] lg:auto-rows-[12rem] lg:grid-cols-4">
          {CATEGORY_TILES.map((tile) => (
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
