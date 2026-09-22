'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { fetchStats } from '@/lib/api-client'
import { RatingStars } from '@/components/store/shared/rating-stars'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    name: 'Jonas M.',
    detail: 'Verified buyer · reorders every 5 weeks',
    text: 'Reordered Designer Whey for the fifth time now — every five weeks like clockwork. It mixes clean with just water and a shaker, no clumps, and Vanilla actually tastes like vanilla.',
  },
  {
    name: 'Lea K.',
    detail: 'Verified buyer · Salted Caramel Whey',
    text: 'I’m picky with flavor and this is the first whey I finished to the last scoop. Salted Caramel is dangerously good. Delivery took two days and the batch was freshly dated.',
  },
  {
    name: 'Deniz A.',
    detail: 'Verified buyer · EAA + Citrulline',
    text: 'Ordered at 9pm, it shipped the next morning and arrived the day after. Prices are honest with no fake discounts — that’s why I keep coming back for my training fuel.',
  },
]

export function ReviewsSection() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  })

  return (
    <section className="bg-zinc-950 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Live stat */}
        {isPending && (
          <div className="flex flex-col items-center" aria-hidden>
            <div className="h-3 w-40 animate-pulse rounded bg-zinc-800" />
            <div className="mt-4 h-14 w-40 animate-pulse rounded bg-zinc-800" />
            <div className="mt-4 h-4 w-56 animate-pulse rounded bg-zinc-800" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertTriangle size={22} className="text-primary" aria-hidden />
            <p className="text-sm text-zinc-400">Review stats couldn’t be loaded.</p>
            <Button
              variant="outline"
              className="min-h-11 gap-2 border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
              onClick={() => refetch()}
            >
              <RefreshCw size={14} />
              Try again
            </Button>
          </div>
        )}

        {data && (
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              What lifters say
            </p>
            <div className="mt-3 flex items-end justify-center gap-1.5">
              <span className="text-6xl font-extrabold leading-none tracking-tight text-white sm:text-7xl">
                {data.averageRating.toFixed(1)}
              </span>
              <span className="pb-1 text-2xl font-bold text-zinc-500">/5</span>
            </div>
            <RatingStars rating={data.averageRating} size={20} className="mt-4" />
            <p className="mt-3 text-sm text-zinc-400">
              {data.reviewCount.toLocaleString()} verified reviews across our store
            </p>
          </div>
        )}

        {/* Static testimonials */}
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <li
              key={t.name}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6"
            >
              <RatingStars rating={5} size={14} />
              <blockquote className="text-sm leading-relaxed text-zinc-300">“{t.text}”</blockquote>
              <footer className="mt-auto pt-1">
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{t.detail}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
