import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { toDetailData } from '@/lib/product-mapper'
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

    const product = await db.product.findUnique({
      where: { slug },
      include: { category: true, sizes: true, flavors: true },
    })
    if (!product) {
      return NextResponse.json(
        { error: API_ERRORS.productNotFound },
        { status: 404 }
      )
    }

    const [reviewRows, relatedRows] = await Promise.all([
      db.review.findMany({
        where: { productId: product.id },
        orderBy: { createdAt: 'desc' },
        take: REVIEW_LIST_LIMIT,
      }),
      db.product.findMany({
        where: { categoryId: product.categoryId, slug: { not: slug } },
        include: { category: true, sizes: true, flavors: true },
        orderBy: [{ isBestseller: 'desc' }, { rating: 'desc' }],
        take: RELATED_PRODUCT_LIMIT,
      }),
    ])

    const product_detail = toDetailData(
      product,
      reviewRows,
      relatedRows,
      REVIEW_LIST_LIMIT,
      ratingDistribution(product.rating, product.reviewCount)
    )

    return NextResponse.json({ product: product_detail })
  } catch (err) {
    console.error(ROUTE_LOG_LABELS.product, err)
    return NextResponse.json({ error: API_ERRORS.productFailed }, { status: 500 })
  }
}
