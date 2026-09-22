'use client'

import { RotateCcw, ShieldCheck, Truck, Zap } from 'lucide-react'

const items = [
  {
    icon: Truck,
    title: 'Free shipping over €59',
    sub: 'On every order within Germany',
  },
  {
    icon: ShieldCheck,
    title: 'Official ESN dealer',
    sub: 'Sealed tubs, full manufacturer warranty',
  },
  {
    icon: Zap,
    title: 'Dispatched in 24h',
    sub: 'Mon–Fri, straight from our warehouse',
  },
  {
    icon: RotateCcw,
    title: '30-day returns',
    sub: 'Unopened products, no questions asked',
  },
]

export function TrustStrip() {
  return (
    <section className="border-b border-zinc-200 bg-white" aria-label="Store guarantees">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          {items.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon size={18} aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-bold leading-tight text-zinc-900">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-zinc-500">{item.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
