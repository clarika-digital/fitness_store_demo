'use client'

import { useRef, useState } from 'react'
import { DEFAULT_SHIPPING_METHOD } from '@/data/commerce'
import { HERO_CATEGORY_SLUG } from '@/data/categories'
import { ORDER_CONFIRMATION_COPY } from '@/data/copy/checkout'
import { useNavStore } from '@/store/nav-store'
import { estimatedDeliveryText } from '@/lib/format'
import { Icon } from '@/core'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

export function OrderConfirmation({ orderNumber }: { orderNumber: string }) {
  const navigate = useNavStore((s) => s.navigate)
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber)
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(
        () => setCopied(false),
        ORDER_CONFIRMATION_COPY.copyResetDelay_MS
      )
    } catch {
      toast({
        title: ORDER_CONFIRMATION_COPY.copyErrorTitle,
        description: ORDER_CONFIRMATION_COPY.copyError,
        variant: 'destructive',
      })
    }
  }

  return (
    <section
      aria-label={ORDER_CONFIRMATION_COPY.ariaLabel}
      className="flex w-full justify-center px-4 py-10 sm:py-16"
    >
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 text-center sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Icon name="check-circle" size={36} className="text-primary" />
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900">
            {ORDER_CONFIRMATION_COPY.title}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {ORDER_CONFIRMATION_COPY.subtitle}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3">
            <span
              className="font-mono text-lg font-bold tracking-wider text-zinc-900"
              aria-label={ORDER_CONFIRMATION_COPY.orderNumberAriaLabel(orderNumber)}
            >
              {orderNumber}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-zinc-400 hover:text-primary"
              onClick={copyOrderNumber}
              aria-label={
                copied
                  ? ORDER_CONFIRMATION_COPY.copiedAriaLabel
                  : ORDER_CONFIRMATION_COPY.copyAriaLabel
              }
            >
              <Icon
                name={copied ? 'check' : 'copy'}
                size={16}
                className={copied ? 'text-primary' : undefined}
              />
            </Button>
          </div>

          <p className="mt-4 text-sm text-zinc-700">
            {ORDER_CONFIRMATION_COPY.estimatedDelivery}{' '}
            <span className="font-bold text-zinc-900">
              {estimatedDeliveryText(DEFAULT_SHIPPING_METHOD)}
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {ORDER_CONFIRMATION_COPY.emailNote}
          </p>

          <Separator className="my-6" />

          <ul
            className="space-y-3 text-left"
            aria-label={ORDER_CONFIRMATION_COPY.nextStepsAriaLabel}
          >
            {ORDER_CONFIRMATION_COPY.nextSteps.map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-100">
                  <Icon name={icon} size={16} className="text-zinc-500" />
                </span>
                <span className="text-sm font-medium text-zinc-700">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => navigate({ name: 'home' })}
              className="h-11 flex-1 font-bold"
            >
              {ORDER_CONFIRMATION_COPY.backToHome}
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate({ name: 'category', slug: HERO_CATEGORY_SLUG })}
              className="h-11 flex-1 font-semibold text-zinc-600"
            >
              {ORDER_CONFIRMATION_COPY.continueShopping}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
