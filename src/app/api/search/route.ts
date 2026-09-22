import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { perKg } from '@/lib/format'
import type { ProductCardData } from '@/lib/types'

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') ?? '').trim().toLowerCase()
    if (q.length < 2) {
      return NextResponse.json({ products: [] })
    }

    const products = await db.product.findMany({
      include: { category: true, sizes: true, flavors: true },
      orderBy: { sortOrder: 'asc' },
    })

    // SQLite + Prisma has no case-insensitive `mode`, so filter in JS (tiny catalog).
    const cards = products.filter((p) => matchesQuery(p, q)).map(toCardData)
    // Surface bestsellers / top-rated matches first, then cap results.
    cards.sort(
      (a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating
    )

    return NextResponse.json({ products: cards.slice(0, 6) })
  } catch (err) {
    console.error('[GET /api/search]', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
