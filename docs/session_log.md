# session_log.md

Agent-readable log of the FUELD storefront refactor. Newest section last.
Related: `docs/tasks.md` (micro-task checklist).

## 1. Goal

Move the storefront onto port `3010`, extract every app-owned string, constant
and reusable UI piece out of the feature components into `src/data` and
`src/core`, and keep the rendered result identical.

## 2. Constraints

- `src/data` is imported by server routes, so it must stay free of React and
  `lucide-react`. Icon names are plain strings resolved by `src/core/icon.tsx`.
- Product data stays in `prisma/schema.prisma` + `prisma/seed.ts`. Only app-owned
  marketing copy, configuration and rules belong in `src/data`.
- The working tree already contained unrelated modifications (file mode and
  line-ending flips on `src/app/globals.css`, `src/components/ui/*`,
  `src/lib/db.ts`, `src/lib/types.ts`, `src/lib/utils.ts`). They were left alone.

## 3. Changes

### 3.1 Port 3010 and cross-platform scripts

- `package.json`: `dev` and `start` now target `3010` via
  `scripts/run-next.mjs <dev|start> <port>`. The old scripts used POSIX-only
  syntax (`PORT=3010 cmd`, `| tee log`) which fails in cmd.exe/PowerShell, so the
  original `dev.log` / `server.log` tee behaviour is reproduced in Node and
  written to `logs/dev.log` and `logs/start.log`.
- `package.json`: `build` replaced `cp -r …` with `scripts/copy-standalone.mjs`
  (`fs.cp`, recursive) for the same reason; the standalone output is unchanged.
- Added `typecheck` script (`tsc --noEmit`).
- `Caddyfile` reverse proxy targets `localhost:3010`.
- `.env` / `.env.example`: `DATABASE_URL="file:../db/custom.db"`, resolved by
  Prisma relative to `prisma/schema.prisma`.
- `.gitignore`: added `!.env.example` (the `.env*` rule was swallowing it) and
  `/logs/`.

### 3.2 `src/data` (new)

| File | Contents |
| --- | --- |
| `commerce.ts` | currency/locale, free-shipping threshold, shipping methods, qty bounds, promo codes, payment methods, country list, checkout steps, money/percent/weight/format constants, debounce and copy-feedback timings |
| `site.ts` | brand name/legal name/wordmark, addresses, emails, SEO metadata, payment badges, `HERO_BRAND` |
| `images.ts` | editorial image paths + alt text, responsive `sizes` hints |
| `categories.ts` | `CATEGORY_META`, tiles, protein-type filters, `PROTEIN_COMPARISON`, category helpers |
| `products.ts` | sort options, unit/badge labels, rating constants, featured slugs, bundle promo, PDP trust row, brand values, gallery limits |
| `navigation.ts` | `NavItem`, main nav, protein dropdown, footer link groups, static-page slugs, `USP_BAR`, `NAV_CONFIG`, view constants |
| `icons.ts` | `ICON_NAMES`, `IconName`, `FILLED_ICON_NAMES` |
| `validation.ts` | email pattern, validation messages, checkout field ids/autocomplete/placeholders |
| `api.ts` | `API_ROUTES`, query-param names, `API_ERRORS`, `ORDER_STATUS`, `ROUTE_LOG_LABELS`, HTTP header/method constants |
| `storage.ts` | `STORAGE_KEYS.cart` |
| `copy/*.ts` | all user-facing text grouped by surface: `chrome`, `home`, `catalog`, `product`, `cart`, `checkout`, `pages`, `states` |
| `index.ts` | barrel re-exporting all of the above |

Interpolated copy is built from the constants rather than retyped, e.g.
`` title: `About ${SITE.name}` ``, `` `Free shipping over €${FREE_SHIPPING_THRESHOLD}` ``,
`` `${HERO_BRAND.longName} — ${HERO_BRAND.tagline}` ``.

### 3.3 `src/core` (new)

`icon.tsx` (name → Lucide through `createElement`, which also satisfies the
`react-hooks/static-components` lint rule), `product-card.tsx`,
`product-grid.tsx`, `product-thumbnail.tsx` (fixed-size or fill-parent variants),
`flavor-swatch.tsx`, `rating-stars.tsx`, `section-heading.tsx`, `price-block.tsx`,
`quantity-stepper.tsx`, `breadcrumb-nav.tsx`, `state-view.tsx`, `index.ts`.

`src/components/store/shared/{product-card,rating-stars,flavor-swatch,section-heading}.tsx`
were deleted; call sites now import from `@/core`.

### 3.4 Feature components, routes, stores

- Every component under `src/components/store/` was rewritten to read from
  `@/data` / `@/core`. No raw copy, slugs, prices, `lucide-react` imports or
  magic numbers remain (UI-local derivations such as `STEP_NUMBER_OFFSET` and
  `FIRST_INDEX` stay in the component; behaviour timings moved to `commerce.ts`).
- `product-view.tsx` composes the canonical `product/purchase-panel.tsx` and
  `product/review-section.tsx`.
- New `src/lib/product-mapper.ts` centralises Prisma → `ProductCardData` /
  product-detail mapping, badge parsing, search matching and sort handling; the
  products, product-detail, search and stats routes all use it.
- `src/lib/api-client.ts` builds paths from `API_ROUTES` and reports `API_ERRORS`.
- `src/store/cart-store.ts` persists under `STORAGE_KEYS.cart`;
  `src/store/nav-store.ts` bounds history with `NAV_CONFIG.historyLimit`.
- `src/app/api/route.ts` (unused Next.js scaffold returning `Hello, world!`)
  was removed.
- `src/app/layout.tsx` builds `metadata` from `SITE` / `SEO`.

## 4. Behaviour fixes found during the audit

- Removed a nav pill that rendered the literal word "HERO" next to the Protein
  menu item (`HERO_BADGE` did not exist in `HEAD`; the badge slot and its
  rendering block in `header.tsx` are gone).
- Restored the brand-page section title `Every ESN product we stock`, which had
  been changed to `ESN Brand Shop` while moving copy into
  `data/copy/catalog.ts`.
- Removed the unused `SITE` import in `app/layout.tsx` and the unused
  `ErrorState` import in `home/reviews-section.tsx`.
- Two encoding scares were PowerShell console artefacts, not file content: the
  files are valid UTF-8 (`€` = U+20AC, `★` = U+2605, `’` = U+2019,
  `—` = U+2014). A scan that reads every file with an explicit UTF-8 decoder
  found no mojibake.

## 5. Verification

| Command | Result |
| --- | --- |
| `bunx tsc --noEmit` | clean |
| `bunx eslint . --max-warnings=0` | clean |
| `bun run build` | compiles, 8 routes, standalone assets copied |

Content parity was checked by extracting every string literal from `HEAD`'s
non-`ui` source and searching the current tree for it (ASCII-folded). The only
differences left are intentional: the deleted scaffold route string, the removed
nav badge, and strings that are now template expressions over the new constants.

Route table produced by the build:

```
○ /            ○ /_not-found
ƒ /api/checkout   ƒ /api/newsletter
ƒ /api/products    ƒ /api/products/[slug]
ƒ /api/search      ƒ /api/stats
```

## 6. Equipment category (added after the refactor)

New shoppable category `equipment` ("Equipment"), kept separate from
`accessories`, which still holds the shaker and sample box.

- `src/data/categories.ts`: `CATEGORY_META.equipment` — this also widens the
  `CategorySlug` union, so `categoryMeta()` / `categoryTitle()` pick it up.
- `src/data/navigation.ts`: `MAIN_NAV` entry between Accessories and Bundles,
  plus `FOOTER_CATEGORY_LABELS.equipment` (the footer list is derived from
  `CATEGORY_SLUGS`, and the label map is a `Record<CategorySlug, string>` so
  TypeScript forces the new key — it caught the omission).
- `prisma/seed.ts`: `cat('equipment', …, order 7)` and four products —
  `resistance-band-set`, `lifting-belt`, `knee-sleeves`, `speed-jump-rope`
  (brand `FUELD`). Seed log now reports 8 categories; total 15 products.
- Re-seeded `db/custom.db` (`bun prisma/seed.ts`) — it wipes and recreates every
  table, so local data was reset.

Notes for the equipment products:

- They have **no flavors** (equipment has no flavor axis). The code already
  handles that: `purchase-panel.tsx` and `review-section.tsx` guard on
  `flavors.length > 0`, `product-mapper.ts` reports `inStock: true` and
  `flavorCount: 0`, and the cart uses `NO_FLAVOR_LABEL`.
- They have **no nutrition table** (the accordion is guarded on
  `product.nutrition && rows.length > 0`), same as the shaker/sample box.
- Size labels deliberately avoid `digits + kg/g` (e.g. `Light`, `S/M`, `One
  size`; the weights live in `sublabel`) so `perKg()` in `lib/format.ts` returns
  `null` instead of inventing a per-kilogram price.
- None are flagged `isFeatured` / `isBestseller`, so the home rails are unchanged.
- The category tile was intentionally **not** added to `CATEGORY_TILES`, so the
  home mosaic keeps its 7 tiles and the existing image files still resolve.

Images still to be sourced (the seeds point at these paths):

```
public/images/products/resistance-bands.png
public/images/products/lifting-belt.png
public/images/products/knee-sleeves.png
public/images/products/jump-rope.png
```

Until those four files exist, the equipment cards and the `Category.image` for
`equipment` will 404 through the Next image optimizer.

## 7. Locale and currency (added after the equipment category)

The storefront previously rendered every amount with a hardcoded EUR formatter
(`formatEUR`) and every piece of chrome announced free shipping "over €59". The
store is now sold in **Ghanaian cedis by default**, with German/euro available
from a header selector.

### 7.1 The rule: EUR stays the base, display is converted

Prices live in the database, the cart and the API as EUR and stay that way — no
re-seed, no migration, no rounding drift in the maths (cart subtotal, discount
and shipping thresholds are all still computed on EUR). Conversion happens at
exactly one place, when an amount is rendered.

`src/data/commerce.ts` owns the whole scheme:

| Export | Value |
| --- | --- |
| `BASE_CURRENCY` | `'EUR'` — the unit all stored amounts are in |
| `DEFAULT_LOCALE_KEY` | `'en-GH'` — Ghanaian cedi is the default |
| `FX_RATES` | `{ EUR: 1, GHS: 13.2 }` |
| `LOCALES` / `LOCALE_KEYS` | `en-GH` → GHS, `de-DE` → EUR, with BCP-47 tag, label and ISO region |
| `CURRENCY`, `MONEY_LOCALE`, `DATE_LOCALE` | now *derived* from the default locale, for server code and metadata |

`FX_RATES` is a hand-maintained mid-market table, not a live feed: mid-market
1 EUR ≈ 13.2 GHS, September 2026. It needs a manual update when the rate drifts.

### 7.2 Formatters

`formatEUR` is gone. `src/lib/format.ts` exposes:

- `convertMoney(baseAmount, currency)` — multiply, then `roundMoney` to the minor unit
- `formatMoney(baseAmount, locale)` — `Intl` for an explicit locale
- `moneyFormatter(locale)` — a reusable `Intl` instance bound to a locale
- `estimatedDeliveryText(method, locale)` — now takes a locale instead of using `DATE_LOCALE`

Rendering, for reference: `en-GH` → `GH₵394.68`, `de-DE` → `394,68 €`.

### 7.3 Reactive + hydration-safe state

`src/store/locale-store.ts` holds the selected key and persists it under
`STORAGE_KEYS.locale` (`fueld-locale`). It sets `skipHydration: true` on purpose:
without it zustand rehydrates during the first client render, the store would
disagree with the server-rendered prices, and Next reports a hydration mismatch.
Instead `LocaleSync` (mounted once in `Providers`) rehydrates in an effect, after
hydration has completed, so the first paint always shows default-locale prices
and swaps to the remembered locale a tick later.

`src/hooks/use-money.ts` adds:

- `useMoney()` — a `money(baseAmount)` formatter bound to the active locale; the
  single replacement for `formatEUR` at every call site
- `useLocale()` — the active locale config, for `toLocaleString` /
  `toLocaleDateString` of review counts and dates
- `LocaleSync` — the rehydrate + `<html lang>` effect pair

### 7.4 No hardcoded currency strings left in `src/data`

Copy that embeds an amount is now a function of a `MoneyFormat`
(`(baseAmount: number) => string`), so a sentence is built per render instead of
being frozen at import time:

| Was | Now |
| --- | --- |
| `CART_COPY.shippingNote` | `shippingNote(money)` |
| `PDP_ACCORDIONS_COPY.shippingBody` | `shippingBody(money)` — also drops the retyped `€4.90` / `€9.90` literals in favour of `STANDARD_SHIPPING` / `EXPRESS_SHIPPING` |
| `SHIPPING_PAGE_COPY.dispatchParagraphs` | `dispatchParagraphs(money)` |
| `FAQ_COPY.items` | `items(money)` |
| `TRUST_STRIP_COPY.items` | `items(money)` |
| `PROTEIN_COMPARISON.rows` | `rows(money)` — the "From" row holds base numbers and maps them through `money` |
| `BUNDLE_BANNER_COPY.body` / `.saveLabel` | `body(money)` / `saveLabel(money)` |
| `PDP_TRUST_ROW` | `pdpTrustRow(money)` |
| `USP_BAR` | `uspBar(money)` |
| `SEO.description` | `seoDescription(money)`, defaulted to the default locale since crawlers get one static value |

`static-page.tsx` had built its shipping-cost table into a module-level const;
that is now `shippingCostRows(money)`, built per render.

### 7.5 The selector

`src/components/store/locale-selector.tsx` is a `DropdownMenu` triggered by a
globe button showing the language short code (`EN` / `DE`). Each row shows the
ISO region badge, the full label and the currency. It sits in the header
right-hand group next to the cart, and again in the mobile nav sheet. A `globe`
key was added to the icon registry (`data/icons.ts` + `core/icon.tsx`).

`app/layout.tsx` renders `lang={SEO.htmlLang}` (`en-GH`); `LocaleSync` keeps the
attribute in sync after a switch, and Open Graph now uses `SEO.ogLocale`
(`en_GH`) rather than the old bare `'en'`.

## 8. URL-backed navigation (added after the locale work)

The old app had a single route plus an in-memory `nav-store`, so a refresh on any
view always fell back to the landing page. Navigation is now derived from the
URL, and the store is gone.

- `data/navigation.ts` gained the mapping layer: `viewPath(view)` builds a
  pathname, `pathView(pathname)` parses one back, plus `pathSegments` and
  `viewKey` (the serialisable key used as a React dependency).
- `hooks/use-nav.ts` exposes `useNavigate`, `useView` and `useBack`. `useView`
  is derived from `usePathname`, so there is no hydration-sensitive state.
- `app/page.tsx` was replaced by the optional catch-all `app/[[...slug]]/page.tsx`,
  which resolves the view once and re-renders on navigation.
- `store/nav-store.ts` was deleted, along with `NAV_CONFIG.historyLimit`.
- Unknown paths render `components/store/pages/not-found-view.tsx`
  (`NOT_FOUND_COPY` in `data/copy/states.ts`) instead of silently redirecting home.

Paths now in use: `/`, `/category/:slug`, `/search`, `/search/:q`,
`/product/:slug`, `/checkout`, `/order/:orderNumber`, `/brand/:slug`,
`/shipping`, `/about`, `/faq`.

**Bug found and fixed immediately after.** The first cut of `viewPath` built
paths from the bare `PATH_PREFIX` values, so it returned *relative* paths
(`product/esn-designer-whey`, `category/protein`, `checkout`, `search`) for every
branch except `home` and `page`. `router.push` resolves a relative path against
the current URL, so each click stacked onto the previous one:

```
/category/protein
  -> push "product/esn-designer-whey"  -> /category/product/esn-designer-whey
  -> push "product/esn-designer-whey"  -> /category/product/category/product/esn-designer-whey
```

Those paths have four segments, so `pathView` hit `if (segments.length !== 2)`
and rendered the not-found view — the 404. `viewPath` now prefixes every branch
with `/`.

Worth noting how this slipped through: the first round-trip test
(`pathView(pathSegments(viewPath(v)))`) passed 20/20, because splitting on `/`
and dropping empty parts cannot tell `/product/x` from `product/x`. The
regression guard that actually catches it asserts `viewPath(...).startsWith('/')`
and replays the click accumulation. Round-trip equality alone is not sufficient.

## 9. Equipment product images

Four seeded Equipment products referenced PNGs that were never committed, so
Next's image optimizer returned `400 Bad Request` for them. Stock photos were
sourced instead of generated placeholders, cropped to 1024x1024 PNG to match the
existing catalogue assets.

| File | Source | Photographer |
| --- | --- | --- |
| `public/images/products/resistance-bands.png` | Pexels 6740819 | Mikhail Nilov |
| `public/images/products/lifting-belt.png` | Pexels 949132 | Victor Freitas |
| `public/images/products/jump-rope.png` | Pexels 8032841 | MART PRODUCTION |
| `public/images/products/knee-sleeves.png` | Pexels 38121344 | PIC MATTI |

All four are under the Pexels License (free for commercial use, attribution not
required). Credits are recorded here so provenance is traceable.

The knee-sleeve photo is the weakest match: it shows a knee *brace* on a leg with
a cluttered background rather than a product shot of sleeves on a clean
background. No free provider returned a better option, so it is worth a visual
check before the site is published.

## 10. Shipping copy

`USP_BAR`, `PDP_TRUST_ROW` and the first `TRUST_STRIP_COPY` entry were changed
from the threshold-based "Free shipping over ..." line to:

- `Worldwide Shipping Available`
- `Tracked delivery to most countries`

Because those three data sets no longer interpolate a price, the `MoneyFormat`
parameter was dropped from them (and the components now map over plain arrays
again). Threshold copy elsewhere (cart, PDP accordion, shipping page, FAQ, SEO)
was intentionally left alone.

## 11. Open items

- `next.config.ts` keeps `typescript.ignoreBuildErrors`, so `next build` will not
  fail on type errors; run `bun run typecheck` in CI.
- No test suite and no Prisma migrations exist (`db:push` applies the schema).
- Review star distribution on the product page is still derived rather than
  stored.
- `FX_RATES` is static and hand-maintained; there is no rate feed, so the GHS
  price will drift from the real mid-market rate over time. Re-check the rate
  periodically, and consider rounding GHS to whole cedis at the display layer
  once the catalogue is priced for the Ghanaian market.
- Only the *currency* is localised. All copy is still English, so `de-DE` shows
  euro prices with English text; the selector is currency-first by design.
- Shipping copy still describes Germany / Austria / Switzerland only, which does
  not match the new default market.
- The knee-sleeve image is a knee brace on a leg, not a clean sleeve product
  shot; swap it if a better asset becomes available.
- Runtime smoke testing of `dev`/`start` on port `3010` was not performed in
  this session (build output only, per request). The URL-backed navigation was
  verified with a throwaway path round-trip script and a production build, not
  in a browser.
