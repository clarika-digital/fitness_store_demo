'use client'

import Image from 'next/image'
import { ArrowRight, FlaskConical, Sparkles, Star } from 'lucide-react'
import { useNavStore } from '@/store/nav-store'
import { Button } from '@/components/ui/button'

const trustChips = [
  { icon: Star, label: '4.8 · 12,000+ reviews', iconClass: 'fill-amber-400 text-amber-400' },
  { icon: Sparkles, label: '25+ flavors', iconClass: 'text-primary' },
  { icon: FlaskConical, label: 'Lab-tested in Germany', iconClass: 'text-primary' },
]

export function Hero() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <section className="bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Official ESN Dealer
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Whey, done properly.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              ESN Designer Whey — 76% protein, perfectly soluble, legendary flavors. The protein
              thousands of lifters reorder every month.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-11 px-7 text-sm font-bold"
                onClick={() => navigate({ name: 'category', slug: 'protein' })}
              >
                Shop Whey Protein
                <ArrowRight size={16} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-zinc-700 bg-transparent px-7 text-sm font-semibold text-white hover:bg-zinc-800 hover:text-white"
                onClick={() => navigate({ name: 'page', slug: 'about' })}
              >
                Our quality promise
              </Button>
            </div>

            <ul className="mt-7 flex flex-wrap gap-2" aria-label="Store trust highlights">
              {trustChips.map((chip) => (
                <li
                  key={chip.label}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 text-xs font-medium text-zinc-300"
                >
                  <chip.icon size={13} strokeWidth={chip.icon === Star ? 0 : 2} className={chip.iconClass} />
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
                src="/images/hero.png"
                alt="ESN Designer Whey tubs in a dark gym scene"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
