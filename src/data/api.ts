/**
 * API contract: endpoint paths, query-parameter names and the error strings the
 * route handlers return.
 *
 * Both halves of the request use these values — the handlers in `app/api/**` and
 * the client wrappers in `lib/api-client` — so a renamed param can never drift
 * between the two.
 */

export const API_ROUTES = {
  products: '/api/products',
  product: (slug: string) => `/api/products/${slug}`,
  search: '/api/search',
  stats: '/api/stats',
  checkout: '/api/checkout',
  newsletter: '/api/newsletter',
} as const

/** Query-string keys accepted by `GET /api/products`. */
export const PRODUCTS_QUERY_PARAMS = {
  category: 'category',
  query: 'q',
  sort: 'sort',
  bestseller: 'bestseller',
  featured: 'featured',
} as const

/** Query-string keys accepted by `GET /api/search`. */
export const SEARCH_QUERY_PARAMS = {
  query: 'q',
} as const

/** Value that marks a boolean query parameter as enabled. */
export const BOOLEAN_QUERY_TRUE = '1'

/** Prefix used when logging a caught server error, per route. */
export const ROUTE_LOG_LABELS = {
  products: '[GET /api/products]',
  product: '[GET /api/products/:slug]',
  search: '[GET /api/search]',
  stats: '[GET /api/stats]',
  checkout: '[POST /api/checkout]',
  newsletter: '[POST /api/newsletter]',
} as const

export const API_ERRORS = {
  requestFailed: (status: number) => `Request failed (${status})`,
  invalidBody: 'Invalid request body',
  invalidEmail: 'Please enter a valid email address.',
  subscriptionFailed: 'Subscription failed. Please try again.',
  checkoutFailed: 'Checkout failed. Please try again.',
  invalidCheckoutData: 'Invalid checkout data',
  invalidCheckoutDataDetail: (path: string, message: string) =>
    `Invalid checkout data: ${path} — ${message}`,
  bodyFallback: 'body',
  pathSeparator: '.',
  invalidCartItem: 'Invalid product in cart',
  productsFailed: 'Failed to load products',
  productFailed: 'Failed to load product',
  productNotFound: 'Product not found',
  searchFailed: 'Search failed',
  statsFailed: 'Failed to load stats',
} as const

/** Order lifecycle written by the checkout handler. */
export const ORDER_STATUS = {
  confirmed: 'confirmed',
} as const

export const HTTP_HEADERS = {
  json: 'Content-Type',
  jsonValue: 'application/json',
} as const

export const HTTP_METHODS = {
  post: 'POST',
  get: 'GET',
} as const
