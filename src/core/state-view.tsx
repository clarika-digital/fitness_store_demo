'use client'

import type { IconName } from '@/data/icons'
import { COMMON_CTA_COPY } from '@/data/copy/home'
import { STATE_COPY } from '@/data/copy/states'
import { Button } from '@/components/ui/button'
import { Icon } from './icon'
import { cn } from '@/lib/utils'

/** Retryable error panel used by every query-driven view. */
export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center',
        className
      )}
    >
      <Icon name={STATE_COPY.icon} size={22} className="text-primary" />
      <p className="text-sm text-zinc-500">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          className="min-h-11 gap-2 border-zinc-300"
          onClick={onRetry}
          aria-label={STATE_COPY.retryAriaLabel}
        >
          <Icon name="refresh" size={14} />
          {COMMON_CTA_COPY.tryAgain}
        </Button>
      )}
    </div>
  )
}

export type EmptyStateAction = {
  label: string
  onSelect: () => void
  variant?: 'default' | 'outline'
}

/** Icon + headline + body + optional actions, for zero-result screens. */
export function EmptyState({
  icon,
  title,
  body,
  actions = [],
  className,
}: {
  icon: IconName
  title: string
  body?: string
  actions?: EmptyStateAction[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center',
        className
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
        <Icon name={icon} size={26} className="text-zinc-400" />
      </span>
      <div>
        <p className="text-lg font-extrabold text-zinc-900">{title}</p>
        {body && <p className="mt-1 text-sm text-zinc-500">{body}</p>}
      </div>
      {actions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? 'default'}
              onClick={action.onSelect}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Text-only busy indicator for inline regions. */
export function LoadingLabel({ className }: { className?: string }) {
  return (
    <span className={cn('text-sm font-medium text-zinc-500', className)}>
      {STATE_COPY.loading}
    </span>
  )
}
