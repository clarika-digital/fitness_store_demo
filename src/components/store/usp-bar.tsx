'use client'

import { ShieldCheck, Truck, Zap } from 'lucide-react'

export function UspBar() {
  return (
    <div className="bg-zinc-950 text-zinc-300">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 text-[11px] font-medium sm:justify-between sm:text-xs">
        <span className="flex items-center gap-1.5">
          <Truck size={13} className="text-primary" />
          <span>Free shipping over €59</span>
        </span>
        <span className="hidden items-center gap-1.5 sm:flex">
          <ShieldCheck size={13} className="text-primary" />
          <span>Official ESN dealer — lab-tested quality</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Zap size={13} className="text-primary" />
          <span>Dispatched in 24h</span>
        </span>
      </div>
    </div>
  )
}
