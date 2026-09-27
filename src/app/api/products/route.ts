import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { matchesQuery, sortCards, toCardData } from '@/lib/product-mapper'
import { DEFAULT_SORT, isSortOption } from '@/data/products'
import {
  API_ERRORS,
  BOOLEAN_QUERY_TRUE,
  PRODUCTS_QUERY_PARAMS,
  ROUTE_LOG_LABELS,
} from '@/data/api'
import type { SortOption } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get(PRODUCTS_QUERY_PARAMS.category)
    const q = searchParams.get(PRODUCTS_QUERY_PARAMS.query)
    const sortParam = searchParams.get(PRODUCTS_QUERY_PARAMS.sort)
    const sort: SortOption = isSortOption(sortParam) ? sortParam : DEFAULT_SORT

    const where: Prisma.ProductWhereInput = {}
    if (category) where.category = { slug: category }
    if (searchParams.get(PRODUCTS_QUERY_PARAMS.bestseller) === BOOLEAN_QUERY_TRUE) {
      where.isBestseller = true
    }
    if (searchParams.get(PRODUCTS_QUERY_PARAMS.featured) === BOOLEAN_QUERY_TRUE) {
      where.isFeatured = true
    }

    const products = await db.product.findMany({
      where,
      include: { category: true, sizes: true, flavors: true },
      orderBy: { sortOrder: 'asc' },
    })

    const needle = q?.trim().toLowerCase()
    const filtered = needle
      ? products.filter((p) => matchesQuery(p, needle))
      : products

    const cards = filtered.map(toCardData)
    sortCards(cards, sort)

    return NextResponse.json({ products: cards })
  } catch (err) {
    console.error(ROUTE_LOG_LABELS.products, err)
    return NextResponse.json(
      { error: API_ERRORS.productsFailed },
      { status: 500 }
    )
  }
}
