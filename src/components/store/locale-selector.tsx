'use client'

import {
  LOCALE_KEYS,
  LOCALES,
  type LocaleConfig,
} from '@/data/commerce'
import { LOCALE_SELECTOR_COPY } from '@/data/copy/chrome'
import { useLocale } from '@/hooks/use-money'
import { useLocaleStore } from '@/store/locale-store'
import { Icon } from '@/core/icon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

/**
 * Language/currency picker.
 *
 * Switching only changes the active locale key: amounts stay in `BASE_CURRENCY`
 * and are converted when formatted (see `useMoney`). The choice is persisted by
 * the locale store and rehydrated after mount, so the first render matches the
 * server-rendered prices.
 */
export function LocaleSelector({ className }: { className?: string }) {
  const active = useLocale()
  const setLocale = useLocaleStore((s) => s.setLocale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={LOCALE_SELECTOR_COPY.ariaLabel}
          className={cn('h-10 gap-1.5 rounded-lg px-2 hover:bg-zinc-100', className)}
        >
          <Icon name="globe" size={18} className="text-zinc-800" />
          <span className="text-xs font-bold text-zinc-800">
            {LOCALE_SELECTOR_COPY.shortLabel(active)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {LOCALE_KEYS.map((key) => (
          <LocaleOption
            key={key}
            locale={LOCALES[key]}
            selected={key === active.key}
            onSelect={() => setLocale(key)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LocaleOption({
  locale,
  selected,
  onSelect,
}: {
  locale: LocaleConfig
  selected: boolean
  onSelect: () => void
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className="flex items-center justify-between gap-3"
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-extrabold',
            selected ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-500'
          )}
        >
          {locale.region}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-900">{locale.label}</span>
          <span className="text-[11px] text-zinc-500">
            {LOCALE_SELECTOR_COPY.currencyLabel(locale)}
          </span>
        </span>
      </span>
      {selected && <Icon name="check" size={16} className="text-primary" />}
    </DropdownMenuItem>
  )
}
