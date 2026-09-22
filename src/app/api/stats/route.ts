import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { StoreStats } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const agg = await db.product.aggregate({
      _avg: { rating: true },
      _sum: { reviewCount: true },
      _count: true,
    })

    const stats: StoreStats = {
      averageRating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._sum.reviewCount ?? 0,
      productCount: agg._count,
    }

    return NextResponse.json(stats)
  } catch (err) {
    console.error('[GET /api/stats]', err)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
