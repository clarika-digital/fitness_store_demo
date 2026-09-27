import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PERCENT_FACTOR } from '@/data/commerce'
import { API_ERRORS, ROUTE_LOG_LABELS } from '@/data/api'
import { RATING_DISPLAY_PRECISION } from '@/data/products'
import type { StoreStats } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const agg = await db.product.aggregate({
      _avg: { rating: true },
      _sum: { reviewCount: true },
      _count: true,
    })

    const scale = RATING_DISPLAY_PRECISION * PERCENT_FACTOR
    const stats: StoreStats = {
      averageRating: Math.round((agg._avg.rating ?? 0) * scale) / scale,
      reviewCount: agg._sum.reviewCount ?? 0,
      productCount: agg._count,
    }

    return NextResponse.json(stats)
  } catch (err) {
    console.error(ROUTE_LOG_LABELS.stats, err)
    return NextResponse.json({ error: API_ERRORS.statsFailed }, { status: 500 })
  }
}
