# tasks.md — FUELD storefront refactor

Micro-task checklist for the `src/data` + `src/core` centralisation and the
port-3010 deployment work. Status legend: `[x]` done, `[ ]` open.

## 1. Environment and port

- [x] Install dependencies with Bun
- [x] Move dev server to port `3010`
- [x] Move production server to port `3010`
- [x] Point `Caddyfile` reverse proxy at `localhost:3010`
- [x] Write `DATABASE_URL` to `.env` and `.env.example`
- [x] Track `.env.example` (`.gitignore` needs `!.env.example`)
- [x] Make `dev` / `build` / `start` scripts work on Windows as well as POSIX
  (`scripts/run-next.mjs`, `scripts/copy-standalone.mjs`)

## 2. `src/data` — single source of truth

- [x] `commerce.ts` — currency, shipping, quantity, promo, payment, checkout rules
- [x] `site.ts` — brand, company, addresses, SEO metadata, payment badges
- [x] `images.ts` — editorial image paths, alt text, responsive `sizes`
- [x] `categories.ts` — category metadata, tiles, filters, comparison table
- [x] `products.ts` — sort options, unit/badge labels, featured slugs, brand values
- [x] `navigation.ts` — main nav, dropdown, footer links, USP bar, view constants
- [x] `icons.ts` — serialisable `IconName` registry (no React in this layer)
- [x] `validation.ts` — email pattern, validation messages, field ids, placeholders
- [x] `api.ts` — route paths, query params, error strings, order status, HTTP helpers
- [x] `storage.ts` — persisted-storage keys
- [x] `copy/` — `chrome`, `home`, `catalog`, `product`, `cart`, `checkout`,
      `pages`, `states` (loading / empty / error text)
- [x] Barrel `src/data/index.ts` exports every module
- [x] No React / `lucide-react` imports anywhere under `src/data`

## 3. `src/core` — reusable UI

- [x] `icon.tsx` — `IconName` → Lucide renderer via `createElement`
- [x] `product-card.tsx`, `product-grid.tsx`, `product-thumbnail.tsx`
- [x] `flavor-swatch.tsx`, `rating-stars.tsx`, `section-heading.tsx`
- [x] `price-block.tsx`, `quantity-stepper.tsx`
- [x] `breadcrumb-nav.tsx`, `state-view.tsx` (loading / empty / error)
- [x] Barrel `src/core/index.ts`
- [x] Delete superseded `src/components/store/shared/*`

## 4. Feature components

- [x] `header.tsx` — search, cart badge, nav, mobile sheet
- [x] `footer.tsx`, `usp-bar.tsx`
- [x] Home: hero, category tiles, bestsellers, bundle banner, brand strip,
      reviews section, newsletter, trust strip
- [x] `brand-page.tsx`
- [x] `shop/category-view.tsx` — filters, sort, comparison table
- [x] `product/product-view.tsx` + `product/purchase-panel.tsx` + `review-section.tsx`
- [x] `cart/cart-drawer.tsx`
- [x] `checkout/checkout-view.tsx` + `order-confirmation.tsx`
- [x] `pages/static-page.tsx` (shipping, about, FAQ)
- [x] `app/layout.tsx` metadata from `SITE` / `SEO`
- [x] No raw copy, slugs, prices or `lucide-react` imports left in features

## 5. API layer and shared libs

- [x] `lib/product-mapper.ts` — Prisma → view-model mapping, search, sorting
- [x] `lib/api-client.ts` — typed client using `API_ROUTES` / `API_ERRORS`
- [x] `lib/format.ts` — money, weight, per-unit maths from `commerce.ts`
- [x] `api/products`, `api/products/[slug]`, `api/search`, `api/stats`
- [x] `api/checkout`, `api/newsletter` — Zod schemas from `validation.ts`
- [x] Remove unused scaffold route `src/app/api/route.ts`
- [x] `store/cart-store.ts` and `store/nav-store.ts` read `STORAGE_KEYS` / `NAV_CONFIG`

## 6. Equipment category

- [x] `CATEGORY_META.equipment` (title + description) in `src/data/categories.ts`
- [x] `MAIN_NAV` entry between Accessories and Bundles
- [x] `FOOTER_CATEGORY_LABELS.equipment`
- [x] `cat('equipment', …)` in `prisma/seed.ts` (order 7)
- [x] Four products: `resistance-band-set`, `lifting-belt`, `knee-sleeves`,
      `speed-jump-rope` — flavorless, no nutrition table, size labels that do
      not trip `perKg()`
- [x] Re-seeded `db/custom.db` (15 products, 8 categories)
- [x] Home rails unchanged (no `isFeatured` / `isBestseller` on new products)
- [ ] Add the four product images to `public/images/products/`
      (`resistance-bands.png`, `lifting-belt.png`, `knee-sleeves.png`,
      `jump-rope.png`) — the seeds already point at them
- [ ] Optional: add an Equipment tile to `CATEGORY_TILES` once an image exists

## 7. Verification

- [x] `bunx tsc --noEmit` — clean
- [x] `bunx eslint . --max-warnings=0` — clean
- [x] `bun run build` — succeeds, standalone assets copied
- [x] Content parity audit against `HEAD` (every user-facing string still present)
- [x] No references to port `3000` or the deleted `shared/*` modules remain

## Known follow-ups (not part of this refactor)

- [ ] `next.config.ts` still sets `typescript.ignoreBuildErrors` — type errors are
      only caught by `bunx tsc --noEmit`, not by `next build`
- [ ] No automated test suite; `bun run build` is the only gate
- [ ] No Prisma migrations — schema is applied with `bun run db:push`
- [ ] Product-detail review distribution is synthesised in `lib/format.ts`
      because the seed data has no per-star counts
