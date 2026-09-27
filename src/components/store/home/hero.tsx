'use client'

import Image from 'next/image'
import { useNavStore } from '@/store/nav-store'
import { PROTEIN_VIEW, ABOUT_VIEW } from '@/data/navigation'
import { HERO_COPY } from '@/data/copy/home'
import { HERO_BRAND } from '@/data/site'
import { IMAGES, IMAGE_SIZES } from '@/data/images'
import { Icon } from '@/core/icon'
import { Button } from '@/components/ui/button'

export function Hero() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <section className="bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              {HERO_COPY.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {HERO_COPY.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              {HERO_COPY.body}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-11 px-7 text-sm font-bold"
                onClick={() => navigate(PROTEIN_VIEW)}
              >
                {HERO_COPY.primaryCta}
                <Icon name="arrow-right" size={16} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-zinc-700 bg-transparent px-7 text-sm font-semibold text-white hover:bg-zinc-800 hover:text-white"
                onClick={() => navigate(ABOUT_VIEW)}
              >
                {HERO_COPY.secondaryCta}
              </Button>
            </div>

            <ul className="mt-7 flex flex-wrap gap-2" aria-label={HERO_COPY.chipsAriaLabel}>
              {HERO_COPY.trustChips.map((chip) => (
                <li
                  key={chip.label}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 text-xs font-medium text-zinc-300"
                >
                  <Icon
                    name={chip.icon}
                    size={13}
                    className={chip.tone === 'star' ? 'text-amber-400' : 'text-primary'}
                  />
                  {chip.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[3rem] bg-primary/25 blur-3xl sm:-inset-8"
            />
            <div className="relative aspect-[2/1] overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-black/50">
              <Image
                src={IMAGES.hero.src}
                alt={IMAGES.hero.alt}
                fill
                priority
                sizes={IMAGE_SIZES.hero}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
