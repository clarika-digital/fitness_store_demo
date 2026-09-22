'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useNavStore } from '@/store/nav-store'
import { Button } from '@/components/ui/button'
import { formatEUR } from '@/lib/format'

export function BundleBanner() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative grid items-center gap-4 md:grid-cols-2">
            <div className="p-8 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Limited bundle
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Whey Starter Bundle
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                Designer Whey 1 kg + Fuel’d Shaker — €4.90 cheaper together. Everything a first
                order needs.
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white">{formatEUR(34.9)}</span>
                <span className="text-sm text-zinc-500 line-through">{formatEUR(39.8)}</span>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                  Save €4.90
                </span>
              </div>
              <Button
                size="lg"
                className="mt-6 h-11 px-7 text-sm font-bold"
                onClick={() => navigate({ name: 'product', slug: 'whey-starter-bundle' })}
              >
                Get the bundle
                <ArrowRight size={16} />
              </Button>
            </div>
            <div className="relative h-64 w-full md:h-80">
              <Image
                src="/images/products/starter-bundle.png"
                alt="Whey Starter Bundle: ESN Designer Whey 1 kg with Fuel’d Shaker"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
