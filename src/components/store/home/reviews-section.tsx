'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchStats } from '@/lib/api-client'
import { REVIEWS_SECTION_COPY } from '@/data/copy/home'
import { RATING_MAX } from '@/data/products'
import { useLocale } from '@/hooks/use-money'
import { ErrorState, Icon, RatingStars } from '@/core'
import { Button } from '@/components/ui/button'

export function ReviewsSection() {
  const locale = useLocale()
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
            <Icon name="alert-triangle" size={22} className="text-primary" />
            <p className="text-sm text-zinc-400">{REVIEWS_SECTION_COPY.errorTitle}</p>
            <Button
              variant="outline"
              className="min-h-11 gap-2 border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
              onClick={() => refetch()}
            >
              <Icon name="refresh" size={14} />
              {REVIEWS_SECTION_COPY.retry}
            </Button>
          </div>
        )}

        {data && (
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {REVIEWS_SECTION_COPY.eyebrow}
            </p>
            <div className="mt-3 flex items-end justify-center gap-1.5">
              <span className="text-6xl font-extrabold leading-none tracking-tight text-white sm:text-7xl">
                {data.averageRating.toFixed(1)}
              </span>
              <span className="pb-1 text-2xl font-bold text-zinc-500">
                {REVIEWS_SECTION_COPY.outOf}
              </span>
            </div>
            <RatingStars rating={data.averageRating} size={20} className="mt-4" />
            <p className="mt-3 text-sm text-zinc-400">
              {REVIEWS_SECTION_COPY.summary(data.reviewCount.toLocaleString(locale.tag))}
            </p>
          </div>
        )}

        {/* Static testimonials */}
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {REVIEWS_SECTION_COPY.testimonials.map((t) => (
            <li
              key={t.name}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6"
            >
              <RatingStars rating={RATING_MAX} size={14} />
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
