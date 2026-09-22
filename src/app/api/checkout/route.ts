import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import {
  estimatedDeliveryText,
  EXPRESS_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  STANDARD_SHIPPING,
} from '@/lib/format'
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
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1),
})

const round2 = (value: number): number => Math.round(value * 100) / 100

const ORDER_SUFFIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function generateOrderNumber(): string {
  const suffix = Array.from(
    { length: 3 },
    () => ORDER_SUFFIX_CHARS[Math.floor(Math.random() * ORDER_SUFFIX_CHARS.length)]
  ).join('')
  return `FD-${Date.now().toString(36).toUpperCase()}-${suffix}`
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
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const error = issue
      ? `Invalid checkout data: ${issue.path.join('.') || 'body'} — ${issue.message}`
      : 'Invalid checkout data'
    return NextResponse.json({ ok: false, error }, { status: 400 })
  }

  const data = parsed.data

  try {
    // SECURITY: never trust client prices — resolve product + size from the DB.
    const productIds = [...new Set(data.items.map((item) => item.productId))]
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      include: { sizes: true },
    })
    const productMap = new Map(products.map((product) => [product.id, product]))

    const resolvedItems: ResolvedItem[] = []
    for (const item of data.items) {
      const product = productMap.get(item.productId)
      const size = product?.sizes.find((s) => s.label === item.sizeLabel)
      if (!product || !size) {
        return NextResponse.json(
          { ok: false, error: 'Invalid product in cart' },
          { status: 400 }
        )
      }
      resolvedItems.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        flavor: item.flavor,
        sizeLabel: size.label,
        unitPrice: size.price,
        quantity: item.quantity,
      })
    }

    const subtotal = round2(
      resolvedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    )
    const promoRate =
      PROMO_CODES[(data.promoCode ?? '').trim().toUpperCase()] ?? 0
    const discount = round2(subtotal * promoRate)
    const shippingCost =
      data.shippingMethod === 'express'
        ? EXPRESS_SHIPPING
        : subtotal - discount >= FREE_SHIPPING_THRESHOLD
          ? 0
          : STANDARD_SHIPPING
    const total = round2(subtotal - discount + shippingCost)

    const orderNumber = generateOrderNumber()

    await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          street: data.street,
          zip: data.zip,
          city: data.city,
          country: data.country,
          shippingMethod: data.shippingMethod,
          shippingCost,
          paymentMethod: data.paymentMethod,
          promoCode: data.promoCode?.trim().toUpperCase() || null,
          discount,
          subtotal,
          total,
          status: 'confirmed',
        },
      })
      await tx.orderItem.createMany({
        data: resolvedItems.map((item) => ({ ...item, orderId: order.id })),
      })
    })

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
    console.error('[POST /api/checkout]', err)
    return NextResponse.json(
      { ok: false, error: 'Checkout failed. Please try again.' },
      { status: 500 }
    )
  }
}
