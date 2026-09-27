'use client'

import { cn } from '@/lib/utils'

/** Eyebrow + title + subtitle heading with an optional trailing action. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  dark = false,
  action,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  dark?: boolean
  action?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-wrap items-end justify-between gap-3',
        align === 'center' && 'flex-col items-center text-center'
      )}
    >
      <div className={cn(align === 'center' && 'flex flex-col items-center')}>
        {eyebrow && (
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            'text-2xl font-extrabold tracking-tight sm:text-3xl',
            dark ? 'text-white' : 'text-zinc-900'
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              'mt-1.5 max-w-2xl text-sm',
              dark ? 'text-zinc-400' : 'text-zinc-500'
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
