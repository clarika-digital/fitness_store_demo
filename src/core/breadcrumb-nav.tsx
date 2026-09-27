'use client'

import { useNavigate } from '@/hooks/use-nav'
import type { View } from '@/lib/types'
import { BREADCRUMB_COPY } from '@/data/copy/chrome'
import { Icon } from './icon'
import { cn } from '@/lib/utils'

export type BreadcrumbItem = {
  label: string
  /** Omit on the last item to render it as the current page. */
  view?: View
}

/**
 * Trail of ancestor links. The final item is always rendered as the current page.
 * Used by every view that is not the home page.
 */
export function BreadcrumbNav({
  items,
  className,
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  const navigate = useNavigate()

  return (
    <nav aria-label={BREADCRUMB_COPY.ariaLabel} className={cn('mb-3', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && <Icon name="chevron-right" size={12} aria-hidden />}
              {item.view && !isLast ? (
                <button
                  type="button"
                  onClick={() => navigate(item.view as View)}
                  className="rounded px-1 py-0.5 font-medium underline-offset-4 hover:text-primary hover:underline"
                >
                  {item.label}
                </button>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="rounded px-1 py-0.5 font-semibold text-zinc-800"
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
