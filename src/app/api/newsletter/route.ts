import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

const newsletterSchema = z.object({
  email: z.email(),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = newsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
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
    return NextResponse.json({ ok: true, code: 'WELCOME10' })
  } catch (err) {
    console.error('[POST /api/newsletter]', err)
    return NextResponse.json(
      { ok: false, error: 'Subscription failed. Please try again.' },
      { status: 500 }
    )
  }
}
