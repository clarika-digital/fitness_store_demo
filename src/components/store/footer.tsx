'use client'

import { useNavStore } from '@/store/nav-store'
import { FOOTER_COPY, BRAND_MARK_COPY, BREADCRUMB_COPY } from '@/data/copy/chrome'
import {
  FOOTER_HELP_LINKS,
  FOOTER_LEGAL_FALLBACK_VIEW,
  FOOTER_LEGAL_LINKS,
  FOOTER_SHOP_LINKS,
} from '@/data/navigation'
import { PAYMENT_BADGES, SITE } from '@/data/site'
import { Icon } from '@/core/icon'

export function Footer() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <footer className="mt-auto bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <button
              onClick={() => navigate({ name: 'home' })}
              className="mb-3 flex items-center gap-1.5"
              aria-label={BRAND_MARK_COPY.ariaLabel}
            >
              <Icon name={BRAND_MARK_COPY.icon} size={20} className="text-primary" />
              <span className="text-lg font-extrabold tracking-tight text-white">
                {SITE.wordmark}
                <span className="text-primary">{SITE.wordmarkSuffix}</span>
              </span>
            </button>
            <p className="text-xs leading-relaxed">
              {SITE.tagline} {SITE.blurb}
            </p>
          </div>

          <nav aria-label={FOOTER_COPY.shopAriaLabel}>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">
              {FOOTER_COPY.shopHeading}
            </h3>
            <ul className="space-y-2">
              {FOOTER_SHOP_LINKS.map((l) => (
                <li key={l.view.name === 'category' ? l.view.slug : l.label}>
                  <button
                    onClick={() => navigate(l.view)}
                    className="text-xs hover:text-white"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={FOOTER_COPY.helpAriaLabel}>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">
              {FOOTER_COPY.helpHeading}
            </h3>
            <ul className="space-y-2">
              {FOOTER_HELP_LINKS.map((l) => (
                <li key={l.view.name === 'page' ? l.view.slug : l.label}>
                  <button
                    onClick={() => navigate(l.view)}
                    className="text-xs hover:text-white"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">
              {FOOTER_COPY.contactHeading}
            </h3>
            <address className="text-xs not-italic leading-relaxed">
              {SITE.legalName}
              <br />
              {SITE.address.street}, {SITE.address.zip} {SITE.address.city}
              <br />
              {SITE.supportEmail}
              <br />
              {SITE.supportHours}
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_BADGES.map((p) => (
              <span
                key={p}
                className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-300"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => navigate(FOOTER_LEGAL_FALLBACK_VIEW)}
                className="text-[11px] text-zinc-500 hover:text-white"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[11px] text-zinc-600">
          {FOOTER_COPY.copyright(new Date().getFullYear())}
        </p>
      </div>
    </footer>
  )
}
