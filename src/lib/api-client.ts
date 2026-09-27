import type {
  ProductCardData,
  ProductDetailData,
  CheckoutPayload,
  CheckoutResponse,
  StoreStats,
  SortOption,
  ReviewSummary,
} from './types'
import { ratingDistribution } from './format'
import {
  API_ERRORS,
  API_ROUTES,
  BOOLEAN_QUERY_TRUE,
  HTTP_HEADERS,
  PRODUCTS_QUERY_PARAMS,
  SEARCH_QUERY_PARAMS,
} from '@/data/api'

export type { ProductCardData, ProductDetailData, StoreStats }

export type ProductsResponse = { products: ProductCardData[] }

export type ProductResponse = { product: ProductDetailData }

export type SearchResponse = { products: ProductCardData[] }

export type NewsletterResponse = { ok: boolean; code?: string; error?: string }

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { [HTTP_HEADERS.json]: HTTP_HEADERS.jsonValue, ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    let message = API_ERRORS.requestFailed(res.status)
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

export function fetchProducts(opts: {
  category?: string
  q?: string
  sort?: SortOption
  bestseller?: boolean
  featured?: boolean
}): Promise<ProductsResponse> {
  const params = new URLSearchParams()
  if (opts.category) params.set(PRODUCTS_QUERY_PARAMS.category, opts.category)
  if (opts.q) params.set(PRODUCTS_QUERY_PARAMS.query, opts.q)
  if (opts.sort) params.set(PRODUCTS_QUERY_PARAMS.sort, opts.sort)
  if (opts.bestseller) params.set(PRODUCTS_QUERY_PARAMS.bestseller, BOOLEAN_QUERY_TRUE)
  if (opts.featured) params.set(PRODUCTS_QUERY_PARAMS.featured, BOOLEAN_QUERY_TRUE)
  return request<ProductsResponse>(`${API_ROUTES.products}?${params.toString()}`)
}

export function fetchProduct(slug: string): Promise<ProductResponse> {
  return request<ProductResponse>(API_ROUTES.product(slug))
}

export function searchProducts(q: string): Promise<SearchResponse> {
  return request<SearchResponse>(
    `${API_ROUTES.search}?${SEARCH_QUERY_PARAMS.query}=${encodeURIComponent(q)}`
  )
}

export function fetchStats(): Promise<StoreStats> {
  return request<StoreStats>(API_ROUTES.stats)
}

export function submitCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  return request<CheckoutResponse>(API_ROUTES.checkout, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function subscribeNewsletter(email: string): Promise<NewsletterResponse> {
  return request<NewsletterResponse>(API_ROUTES.newsletter, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

/** Derive a client-side summary when API ships raw items. */
export function summarizeReviews(
  average: number,
  count: number
): Omit<ReviewSummary, 'distribution'> & { distribution: ReviewSummary['distribution'] } {
  return {
    average,
    count,
    distribution: ratingDistribution(average, count),
  }
}
