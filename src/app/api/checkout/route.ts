import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  CHECKOUT_ITEM_QTY_MAX,
  EXPRESS_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  ORDER_NUMBER_ALPHABET,
  ORDER_NUMBER_PREFIX,
  ORDER_NUMBER_RANDOM_LENGTH,
  PROMO_CODES,
  STANDARD_SHIPPING,
} from '@/data/commerce'
import { API_ERRORS, ORDER_STATUS, ROUTE_LOG_LABELS } from '@/data/api'
import { estimatedDeliveryText, roundMoney } from '@/lib/format'
import type { CheckoutResponse } from '@/lib/types'

export const runtime = 'nodejs'

const checkoutSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  street: z.string().min(1),
  zip: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['paypal', 'klarna', 'card']),
  promoCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        flavor: z.string().min(1),
        sizeLabel: z.string().min(1),
        quantity: z.number().int().min(1).max(CHECKOUT_ITEM_QTY_MAX),
      })
    )
    .min(1),
})

function generateOrderNumber(): string {
  const alphabets = ORDER_NUMBER_ALPHABET.split('')
  const suffix = Array.from(
    { length: ORDER_NUMBER_RANDOM_LENGTH },
    () => alphabets[Math.floor(Math.random() * alphabets.length)]
  ).join('')
  return `${ORDER_NUMBER_PREFIX}-${Date.now().toString(36).toUpperCase()}-${suffix}`
}

type ResolvedItem = {
  productId: string
  name: string
  brand: string
  image: string
  flavor: string
  sizeLabel: string
  unitPrice: number
  quantity: number
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: API_ERRORS.invalidBody },
      { status: 400 }
    )
  }

  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const error = issue
      ? API_ERRORS.invalidCheckoutDataDetail(
          issue.path.join(API_ERRORS.pathSeparator) || API_ERRORS.bodyFallback,
          issue.message
        )
      : API_ERRORS.invalidCheckoutData
    return NextResponse.json({ ok: false, error }, { status: 400 })
  }

  const data = parsed.data

  // Mock checkout - in a real deployment without a DB, order processing
  // would require a database. For now, we return a mock success response.
  try {
    const orderNumber = generateOrderNumber()
    const subtotal = roundMoney(
      data.items.reduce((sum, item) => sum + item.quantity * 10, 0)
    )
    const promoRate =
      PROMO_CODES[(data.promoCode ?? '').trim().toUpperCase()] ?? 0
    const discount = roundMoney(subtotal * promoRate)
    const shippingCost =
      data.shippingMethod === 'express'
        ? EXPRESS_SHIPPING
        : subtotal - discount >= FREE_SHIPPING_THRESHOLD
          ? 0
          : STANDARD_SHIPPING
    const total = roundMoney(subtotal - discount + shippingCost)

    const response: CheckoutResponse = {
      ok: true,
      orderNumber,
      total,
      subtotal,
      discount,
      shippingCost,
      estimatedDelivery: estimatedDeliveryText(data.shippingMethod),
    }
    return NextResponse.json(response)
  } catch (err) {
    console.error(ROUTE_LOG_LABELS.checkout, err)
    return NextResponse.json(
      { ok: false, error: API_ERRORS.checkoutFailed },
      { status: 500 }
    )
  }
}