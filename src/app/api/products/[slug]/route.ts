import { NextResponse } from 'next/server'
import { STATIC_PRODUCT_CARDS } from '@/data/products-data'
import { RELATED_PRODUCT_LIMIT, REVIEW_LIST_LIMIT } from '@/data/commerce'
import { API_ERRORS, ROUTE_LOG_LABELS } from '@/data/api'
import { ratingDistribution } from '@/lib/format'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Find product in static data
    const product = STATIC_PRODUCT_CARDS.find((p) => p.slug === slug)
    if (!product) {
      return NextResponse.json(
        { error: API_ERRORS.productNotFound },
        { status: 404 }
      )
    }

    // Mock related products - other bestselling/featured products
    const relatedProducts = STATIC_PRODUCT_CARDS
      .filter((p) => p.isBestseller || p.isFeatured)
      .filter((p) => p.slug !== slug)
      .slice(0, RELATED_PRODUCT_LIMIT)

    // Mock reviews - empty since we don't have review data in static mode
    const mockReviewRows = []

    // Mock rating distribution
    const distribution = ratingDistribution(product.rating, product.reviewCount)

    const product_detail = {
      ...product,
      description:
        product.tagline ||
        'Product description not available in static mode.',
      usage:
        'Usage instructions not available in static mode. Please refer to product packaging.',
      nutrition: null,
      flavors: product.flavorCount > 0
        ? [
          {
            name: 'Vanilla',
            color: '#f0e6c8',
            inStock: true,
            rating: product.rating,
            reviewCount: product.reviewCount,
          },
        ]
        : [],
      reviews: {
        average: product.rating,
        count: product.reviewCount,
        distribution,
        items: mockReviewRows,
      },
      related: relatedProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        image: p.image,
        priceFrom: p.priceFrom,
        isBestseller: p.isBestseller,
      })),
    } as const

    return NextResponse.json({ product: product_detail })
  } catch (err) {
    console.error(ROUTE_LOG_LABELS.product, err)
    return NextResponse.json({ error: API_ERRORS.productFailed }, { status: 500 })
  }
}