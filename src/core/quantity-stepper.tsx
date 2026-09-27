'use client'

import { QTY_MAX, QTY_MIN } from '@/data/commerce'
import { Button } from '@/components/ui/button'
import { Icon } from './icon'
import { cn } from '@/lib/utils'

/**
 * −/+ quantity control.
 *
 * Every consumer supplies its own aria labels (the PDP says "Decrease quantity",
 * the cart says "Decrease quantity of Designer Whey") so the control stays
 * context-agnostic.
 */
export function QuantityStepper({
  value,
  onChange,
  decreaseAriaLabel,
  increaseAriaLabel,
  quantityAriaLabel,
  min = QTY_MIN,
  max = QTY_MAX,
  variant = 'ghost',
  className,
}: {
  value: number
  onChange: (next: number) => void
  decreaseAriaLabel: string
  increaseAriaLabel: string
  quantityAriaLabel: string
  min?: number
  max?: number
  variant?: 'ghost' | 'outline'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center rounded-lg border border-zinc-300',
        variant === 'outline' && 'h-8',
        className
      )}
    >
      <Button
        variant={variant}
        size="icon"
        aria-label={decreaseAriaLabel}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          'rounded-md hover:bg-zinc-100',
          variant === 'ghost' ? 'h-11 w-11' : 'size-7'
        )}
      >
        <Icon name="minus" size={variant === 'ghost' ? 16 : 14} />
      </Button>
      <span
        aria-live="polite"
        aria-label={quantityAriaLabel}
        className={cn(
          'text-center text-sm font-bold tabular-nums text-zinc-900',
          variant === 'ghost' ? 'w-8' : 'w-7'
        )}
      >
        {value}
      </span>
      <Button
        variant={variant}
        size="icon"
        aria-label={increaseAriaLabel}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          'rounded-md hover:bg-zinc-100',
          variant === 'ghost' ? 'h-11 w-11' : 'size-7'
        )}
      >
        <Icon name="plus" size={variant === 'ghost' ? 16 : 14} />
      </Button>
    </div>
  )
}
