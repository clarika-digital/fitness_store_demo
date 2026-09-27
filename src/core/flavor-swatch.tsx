'use client'

import { FLAVOR_SWATCH_COPY } from '@/data/copy/product'
import { cn } from '@/lib/utils'

/** Colour swatch + name pill used to pick a flavor. */
export function FlavorSwatch({
  color,
  name,
  selected,
  disabled,
  onClick,
  size = 'md',
}: {
  color: string
  name: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={FLAVOR_SWATCH_COPY.ariaLabel(name, Boolean(disabled))}
      title={FLAVOR_SWATCH_COPY.title(name, Boolean(disabled))}
      className={cn(
        'group relative flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all',
        size === 'md' ? 'min-w-[130px] flex-1' : '',
        selected
          ? 'border-primary ring-1 ring-primary bg-primary/5'
          : 'border-border hover:border-zinc-400 bg-white',
        disabled && 'cursor-not-allowed opacity-40'
      )}
    >
      <span
        className={cn(
          'shrink-0 rounded-full border border-black/10 shadow-inner',
          size === 'md' ? 'h-6 w-6' : 'h-4 w-4'
        )}
        style={{ backgroundColor: color }}
      />
      <span
        className={cn(
          'truncate text-xs font-medium',
          selected ? 'text-foreground' : 'text-zinc-700'
        )}
      >
        {name}
      </span>
      {disabled && (
        <span className="absolute inset-x-0 text-center text-[10px] font-medium text-red-600">
          {FLAVOR_SWATCH_COPY.outOfStockLabel}
        </span>
      )}
    </button>
  )
}
