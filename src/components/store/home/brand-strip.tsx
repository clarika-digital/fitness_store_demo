'use client'

import { ArrowRight } from 'lucide-react'
import { useNavStore } from '@/store/nav-store'
import { Button } from '@/components/ui/button'

const qualityBadges = ['Creapure®', 'Made in Germany', 'Lab-tested']

export function BrandStrip() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <section className="border-y border-zinc-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
            <span className="text-sm text-zinc-500">Official dealer for</span>
            <span
              className="text-2xl font-extrabold leading-none tracking-[0.3em] text-zinc-900"
              aria-label="ESN"
            >
              ESN
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {qualityBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            className="min-h-11 gap-1.5 px-4 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => navigate({ name: 'brand', slug: 'esn' })}
          >
            Visit the ESN Brand Shop
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  )
}
