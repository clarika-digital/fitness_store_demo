'use client'

import { USP_BAR } from '@/data/navigation'
import { Icon } from '@/core/icon'

/** Thin USP strip pinned above the header. */
export function UspBar() {
  return (
    <div className="bg-zinc-950 text-zinc-300">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 text-[11px] font-medium sm:justify-between sm:text-xs">
        {USP_BAR.map((item, index) => (
          <span
            key={item.label}
            className={index === 1 ? 'hidden items-center gap-1.5 sm:flex' : 'flex items-center gap-1.5'}
          >
            <Icon name={item.icon} size={13} className="text-primary" />
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
