import type { Prisma } from '@prisma/client'
import { perKg } from '@/lib/format'
import type {
  NutritionTable,
  ProductCardData,
  ProductDetailData,
  ProductFlavor,
  ReviewItem,
  SortOption,
} from '@/lib/types'

/**
 * Prisma → view-model mappers shared by the product, search and stats routes.
 *
 * Server-only: imported by `app/api/**` handlers, never by client components.
 */

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; sizes: true; flavors: true }
}>

type ReviewRow = Prisma.ReviewGetPayload<object>

const FIRST_INDEX = 0

/** `badges` is stored as a JSON string (SQLite has no scalar lists). */
export function parseBadges(json: string): string[] {
  try {
    const parsed: unknown = JSON.parse(json)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((badge): badge is string => typeof badge === 'string')
  } catch {
    return []
  }
}

/** `nutrition` is stored as a JSON string shaped like `NutritionTable`. */
export function parseNutrition(json: string | null): NutritionTable | null {
  if (!json) return null
  try {
    const parsed: unknown = JSON.parse(json)
    if (!parsed || typeof parsed !== 'object' || !('rows' in parsed)) return null
    const rows: unknown = (parsed as { rows: unknown }).rows
    if (!Array.isArray(rows)) return null
    const clean = rows
      .filter(
        (row): row is { label: string; value: string } =>
          !!row &&
          typeof row === 'object' &&
          typeof (row as { label?: unknown }).label === 'string' &&
          typeof (row as { value?: unknown }).value === 'string'
      )
      .map((row) => ({ label: row.label, value: row.value }))
    return { rows: clean }
  } catch {
    return null
  }
}

export function toCardData(product: ProductWithRelations): ProductCardData {
  const sizes = [...product.sizes].sort((a, b) => a.sortOrder - b.sortOrder)
  const cheapest =
    [...product.sizes].sort((a, b) => a.price - b.price)[FIRST_INDEX] ?? null

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    categoryId: product.categoryId,
    categorySlug: product.category.slug,
    categoryName: product.category.name,
    tagline: product.tagline,
    image: product.image,
    badges: parseBadges(product.badges),
    rating: product.rating,
    reviewCount: product.reviewCount,
    priceFrom: cheapest ? cheapest.price : 0,
    compareFrom: cheapest?.comparePrice ?? null,
    perKgFrom: cheapest ? perKg(cheapest) : null,
    sizes: sizes.map((size) => ({
      id: size.id,
      label: size.label,
      sublabel: size.sublabel,
      price: size.price,
      comparePrice: size.comparePrice,
      servings: size.servings,
      popular: size.popular,
    })),
    flavorCount: product.flavors.length,
    isBestseller: product.isBestseller,
    isFeatured: product.isFeatured,
    inStock:
      product.flavors.length === 0
        ? true
        : product.flavors.some((flavor) => flavor.inStock),
  }
}

export function toFlavor(
  flavor: ProductWithRelations['flavors'][number]
): ProductFlavor {
  return {
    name: flavor.name,
    color: flavor.color,
    inStock: flavor.inStock,
    rating: flavor.rating,
    reviewCount: flavor.reviewCount,
  }
}

export function toReviewItem(review: ReviewRow): ReviewItem {
  return {
    id: review.id,
    author: review.author,
    rating: review.rating,
    flavor: review.flavor,
    title: review.title,
    text: review.text,
    verified: review.verified,
    createdAt: review.createdAt.toISOString(),
  }
}

export function toDetailData(
  product: ProductWithRelations,
  reviewRows: ReviewRow[],
  relatedRows: ProductWithRelations[],
  reviewLimit: number,
  distribution: ProductDetailData['reviews']['distribution']
): ProductDetailData {
  return {
    ...toCardData(product),
    description: product.description,
    usage: product.usage,
    nutrition: parseNutrition(product.nutrition),
    flavors: [...product.flavors]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(toFlavor),
    reviews: {
      average: product.rating,
      count: product.reviewCount,
      distribution,
      items: reviewRows.slice(0, reviewLimit).map(toReviewItem),
    },
    related: relatedRows.map(toCardData),
  }
}

/**
 * SQLite + Prisma has no case-insensitive `mode`, so free-text search filters in
 * JS. The catalog is small enough for this to be fine.
 */
export function matchesQuery(
  product: ProductWithRelations,
  needle: string
): boolean {
  return (
    product.name.toLowerCase().includes(needle) ||
    product.tagline.toLowerCase().includes(needle) ||
    product.brand.toLowerCase().includes(needle) ||
    product.description.toLowerCase().includes(needle)
  )
}

export function sortCards(cards: ProductCardData[], sort: SortOption): void {
  switch (sort) {
    case 'rating':
      cards.sort((a, b) => b.rating - a.rating)
      break
    case 'price-asc':
      cards.sort((a, b) => a.priceFrom - b.priceFrom)
      break
    case 'price-desc':
      cards.sort((a, b) => b.priceFrom - a.priceFrom)
      break
    case 'popular':
    default:
      cards.sort(
        (a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating
      )
      break
  }
}

/** Bestsellers first, then best rated — used by search. */
export function rankByPopularity(cards: ProductCardData[]): void {
  cards.sort(
    (a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating
  )
}
