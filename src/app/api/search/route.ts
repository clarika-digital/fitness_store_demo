import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rankByPopularity, toCardData, matchesQuery } from '@/lib/product-mapper'
import { SEARCH_MIN_LENGTH, SEARCH_RESULT_LIMIT } from '@/data/commerce'
import { API_ERRORS, ROUTE_LOG_LABELS, SEARCH_QUERY_PARAMS } from '@/data/api'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get(SEARCH_QUERY_PARAMS.query) ?? '')
      .trim()
      .toLowerCase()
    if (q.length < SEARCH_MIN_LENGTH) {
      return NextResponse.json({ products: [] })
    }

    const products = await db.product.findMany({
      include: { category: true, sizes: true, flavors: true },
      orderBy: { sortOrder: 'asc' },
    })

    const cards = products.filter((p) => matchesQuery(p, q)).map(toCardData)
    rankByPopularity(cards)

    return NextResponse.json({ products: cards.slice(0, SEARCH_RESULT_LIMIT) })
  } catch (err) {
    console.error(ROUTE_LOG_LABELS.search, err)
    return NextResponse.json({ error: API_ERRORS.searchFailed }, { status: 500 })
  }
}
