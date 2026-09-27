import { NextResponse } from 'next/server'
import { STATIC_PRODUCT_CARDS } from '@/data/products-data'
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

    const needle = q
    const products = STATIC_PRODUCT_CARDS.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.tagline.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle)
    )

    const cards = products.map((p) => ({
      ...p,
      priceFrom: p.priceFrom,
      compareFrom: p.compareFrom,
      perKgFrom: p.perKgFrom,
    }))

    rankByPopularityStatic(cards)

    return NextResponse.json({
      products: cards.slice(0, SEARCH_RESULT_LIMIT),
    })
  } catch (err) {
    console.error(ROUTE_LOG_LABELS.search, err)
    return NextResponse.json({ error: API_ERRORS.searchFailed }, { status: 500 })
  }
}

function rankByPopularityStatic(cards: any[]): void {
  cards.sort(
    (a, b) =>
      Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating
  )
}