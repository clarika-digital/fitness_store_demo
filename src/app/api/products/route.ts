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
import { STATIC_PRODUCT_CARDS } from '@/data/products-data'
import type { ProductCardData } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get(PRODUCTS_QUERY_PARAMS.category)
    const q = searchParams.get(PRODUCTS_QUERY_PARAMS.query)
    const sortParam = searchParams.get(PRODUCTS_QUERY_PARAMS.sort)
    const sort: SortOption = isSortOption(sortParam) ? sortParam : DEFAULT_SORT

    let products = [...STATIC_PRODUCT_CARDS]

    // Filter by category
    if (category) {
      products = products.filter((p) => p.categorySlug === category)
    }

    // Filter by bestseller
    if (searchParams.get(PRODUCTS_QUERY_PARAMS.bestseller) === BOOLEAN_QUERY_TRUE) {
      products = products.filter((p) => p.isBestseller)
    }

    // Filter by featured
    if (searchParams.get(PRODUCTS_QUERY_PARAMS.featured) === BOOLEAN_QUERY_TRUE) {
      products = products.filter((p) => p.isFeatured)
    }

    // Apply search query
    const needle = q?.trim().toLowerCase()
    const filtered = needle
      ? products.filter((p) => matchesQueryStatic(p, needle))
      : products

    const cards = filtered.map(toCardDataStatic)
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

function matchesQueryStatic(product: ProductCardData, needle: string): boolean {
  return (
    product.name.toLowerCase().includes(needle) ||
    product.tagline.toLowerCase().includes(needle) ||
    product.brand.toLowerCase().includes(needle)
  )
}

function toCardDataStatic(product: ProductCardData): ProductCardData {
  // Return as-is since static data is already in the correct shape
  return product
}