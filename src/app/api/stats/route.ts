import { NextResponse } from 'next/server'
import { API_ERRORS, ROUTE_LOG_LABELS } from '@/data/api'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Static summary data - in a real deployment without a DB, these would
    // be computed from the static product data or stored in a separate file.
    const productCount = 20 // Would be: Object.keys(staticProducts).length
    const reviewCount = 15837 // Would be sum of all review counts
    const averageRating = 4.7 // Would be: total rating sum / total count rounded

    const stats = {
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount,
      productCount,
    }

    return NextResponse.json(stats)
  } catch (err) {
    console.error(ROUTE_LOG_LABELS.stats, err)
    return NextResponse.json({ error: API_ERRORS.statsFailed }, { status: 500 })
  }
}