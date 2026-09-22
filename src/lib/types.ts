// Shared types & API contracts for the FUELD storefront.
// All views consume these shapes; all API routes must produce them.

export type ProductSize = {
  id?: string
  label: string
  sublabel?: string | null
  price: number
  comparePrice?: number | null
  servings?: number | null
  popular?: boolean
}

export type ProductFlavor = {
  name: string
  color: string
  inStock: boolean
  rating?: number | null
  reviewCount?: number
}

export type ProductCardData = {
  id: string
  slug: string
  name: string
  brand: string
  categoryId: string
  categorySlug: string
  categoryName: string
  tagline: string
  image: string
  badges: string[]
  rating: number
  reviewCount: number
  /** lowest size price */
  priceFrom: number
  /** lowest compare-at price, if any */
  compareFrom: number | null
  /** price per kg of the default size, if the product is a powder in grams/kg */
  perKgFrom: number | null
  sizes: ProductSize[]
  flavorCount: number
  isBestseller: boolean
  isFeatured: boolean
  inStock: boolean
}

export type NutritionTable = {
  rows: { label: string; value: string }[]
}

export type ReviewItem = {
  id: string
  author: string
  rating: number
  flavor?: string | null
  title: string
  text: string
  verified: boolean
  createdAt: string
}

export type ReviewSummary = {
  average: number
  count: number
  distribution: { stars: number; pct: number }[]
}

export type ProductDetailData = ProductCardData & {
  description: string
  usage?: string | null
  nutrition: NutritionTable | null
  flavors: ProductFlavor[]
  reviews: ReviewSummary & { items: ReviewItem[] }
  related: ProductCardData[]
}

export type CheckoutPayload = {
  email: string
  firstName: string
  lastName: string
  street: string
  zip: string
  city: string
  country: string
  shippingMethod: 'standard' | 'express'
  paymentMethod: 'paypal' | 'klarna' | 'card'
  promoCode?: string
  items: {
    productId: string
    flavor: string
    sizeLabel: string
    quantity: number
  }[]
}

export type CheckoutResponse = {
  ok: boolean
  orderNumber: string
  total: number
  subtotal: number
  discount: number
  shippingCost: number
  estimatedDelivery: string
  error?: string
}

export type StoreStats = {
  averageRating: number
  reviewCount: number
  productCount: number
}

export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating'

export type View =
  | { name: 'home' }
  | { name: 'category'; slug: string; q?: string }
  | { name: 'product'; slug: string }
  | { name: 'checkout' }
  | { name: 'confirmation'; orderNumber: string }
  | { name: 'brand'; slug: string }
  | { name: 'page'; slug: 'shipping' | 'about' | 'faq' }
