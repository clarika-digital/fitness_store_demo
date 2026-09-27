import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { WELCOME_PROMO_CODE } from '@/data/commerce'
import { API_ERRORS, ROUTE_LOG_LABELS } from '@/data/api'

export const runtime = 'nodejs'

const newsletterSchema = z.object({
  email: z.email(),
})

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

  const parsed = newsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: API_ERRORS.invalidEmail },
      { status: 400 }
    )
  }

  try {
    const email = parsed.data.email.trim().toLowerCase()
    // Idempotent upsert: duplicate subscribes are a no-op.
    await db.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })
    return NextResponse.json({ ok: true, code: WELCOME_PROMO_CODE })
  } catch (err) {
    console.error(ROUTE_LOG_LABELS.newsletter, err)
    return NextResponse.json(
      { ok: false, error: API_ERRORS.subscriptionFailed },
      { status: 500 }
    )
  }
}
