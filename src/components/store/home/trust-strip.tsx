'use client'

import { TRUST_STRIP_COPY } from '@/data/copy/home'
import { Icon } from '@/core/icon'

export function TrustStrip() {
  return (
    <section
      aria-label={TRUST_STRIP_COPY.ariaLabel}
      className="border-b border-zinc-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-6">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          {TRUST_STRIP_COPY.items.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name={item.icon} size={18} />
              </span>
              <span>
                <span className="block text-sm font-bold leading-tight text-zinc-900">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-zinc-500">
                  {item.sub}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
