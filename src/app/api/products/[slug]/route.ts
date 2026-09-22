import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { perKg, ratingDistribution } from '@/lib/format'
import type {
  NutritionTable,
  ProductCardData,
  ProductDetailData,
  ProductFlavor,
  ReviewItem,
} from '@/lib/types'

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

/** nutrition is stored as a JSON string shaped like NutritionTable */
function parseNutrition(json: string | null): NutritionTable | null {
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

function toFlavor(flavor: ProductWithRelations['flavors'][number]): ProductFlavor {
  return {
    name: flavor.name,
    color: flavor.color,
    inStock: flavor.inStock,
    rating: flavor.rating,
    reviewCount: flavor.reviewCount,
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await db.product.findUnique({
      where: { slug },
      include: { category: true, sizes: true, flavors: true },
    })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const [reviewRows, relatedRows] = await Promise.all([
      db.review.findMany({
        where: { productId: product.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      db.product.findMany({
        where: { categoryId: product.categoryId, slug: { not: slug } },
        include: { category: true, sizes: true, flavors: true },
        orderBy: [{ isBestseller: 'desc' }, { rating: 'desc' }],
        take: 4,
      }),
    ])

    const items: ReviewItem[] = reviewRows.map((review) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      flavor: review.flavor,
      title: review.title,
      text: review.text,
      verified: review.verified,
      createdAt: review.createdAt.toISOString(),
    }))

    const detail: ProductDetailData = {
      ...toCardData(product),
      description: product.description,
      usage: product.usage,
      nutrition: parseNutrition(product.nutrition),
      flavors: [...product.flavors].sort((a, b) => a.sortOrder - b.sortOrder).map(toFlavor),
      reviews: {
        average: product.rating,
        count: product.reviewCount,
        distribution: ratingDistribution(product.rating, product.reviewCount),
        items,
      },
      related: relatedRows.map(toCardData),
    }

    return NextResponse.json({ product: detail })
  } catch (err) {
    console.error('[GET /api/products/:slug]', err)
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 })
  }
}
