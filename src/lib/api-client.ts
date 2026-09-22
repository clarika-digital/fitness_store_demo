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

export type { ProductCardData, ProductDetailData, StoreStats }

export type ProductsResponse = { products: ProductCardData[] }

export type ProductResponse = { product: ProductDetailData }

export type SearchResponse = { products: ProductCardData[] }

export type NewsletterResponse = { ok: boolean; code?: string; error?: string }

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
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
  if (opts.category) params.set('category', opts.category)
  if (opts.q) params.set('q', opts.q)
  if (opts.sort) params.set('sort', opts.sort)
  if (opts.bestseller) params.set('bestseller', '1')
  if (opts.featured) params.set('featured', '1')
  return request<ProductsResponse>(`/api/products?${params.toString()}`)
}

export function fetchProduct(slug: string): Promise<ProductResponse> {
  return request<ProductResponse>(`/api/products/${slug}`)
}

export function searchProducts(q: string): Promise<SearchResponse> {
  return request<SearchResponse>(`/api/search?q=${encodeURIComponent(q)}`)
}

export function fetchStats(): Promise<StoreStats> {
  return request<StoreStats>('/api/stats')
}

export function submitCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  return request<CheckoutResponse>('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function subscribeNewsletter(email: string): Promise<NewsletterResponse> {
  return request<NewsletterResponse>('/api/newsletter', {
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
