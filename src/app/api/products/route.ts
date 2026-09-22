import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { perKg } from '@/lib/format'
import type { ProductCardData, SortOption } from '@/lib/types'

export const runtime = 'nodejs'

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; sizes: true; flavors: true }
}>

/** badges is stored as a JSON string (SQLite has no scalar lists) */
function parseBadges(json: string): string[] {
  try {
    const parsed: unknown = JSON.parse(json)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((badge): badge is string => typeof badge === 'string')
  } catch {
    return []
  }
}

function toCardData(product: ProductWithRelations): ProductCardData {
  const sizes = [...product.sizes].sort((a, b) => a.sortOrder - b.sortOrder)
  const cheapest = [...product.sizes].sort((a, b) => a.price - b.price)[0] ?? null

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
      product.flavors.length === 0 ? true : product.flavors.some((flavor) => flavor.inStock),
  }
}

function matchesQuery(product: ProductWithRelations, needle: string): boolean {
  return (
    product.name.toLowerCase().includes(needle) ||
    product.tagline.toLowerCase().includes(needle) ||
    product.brand.toLowerCase().includes(needle) ||
    product.description.toLowerCase().includes(needle)
  )
}

function sortCards(cards: ProductCardData[], sort: SortOption): void {
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const q = searchParams.get('q')
    const sortParam = searchParams.get('sort')
    const sort: SortOption =
      sortParam === 'price-asc' ||
      sortParam === 'price-desc' ||
      sortParam === 'rating' ||
      sortParam === 'popular'
        ? sortParam
        : 'popular'

    const where: Prisma.ProductWhereInput = {}
    if (category) where.category = { slug: category }
    if (searchParams.get('bestseller') === '1') where.isBestseller = true
    if (searchParams.get('featured') === '1') where.isFeatured = true

    const products = await db.product.findMany({
      where,
      include: { category: true, sizes: true, flavors: true },
      orderBy: { sortOrder: 'asc' },
    })

    // SQLite + Prisma has no case-insensitive `mode`, so filter in JS (tiny catalog).
    const needle = q?.trim().toLowerCase()
    const filtered = needle ? products.filter((p) => matchesQuery(p, needle)) : products

    const cards = filtered.map(toCardData)
    sortCards(cards, sort)

    return NextResponse.json({ products: cards })
  } catch (err) {
    console.error('[GET /api/products]', err)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
