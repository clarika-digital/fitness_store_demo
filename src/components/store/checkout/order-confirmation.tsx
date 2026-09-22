'use client'

import { useRef, useState } from 'react'
import {
  Check,
  CheckCircle2,
  Copy,
  Mail,
  Package,
  Truck,
} from 'lucide-react'
import { useNavStore } from '@/store/nav-store'
import { estimatedDeliveryText } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

const NEXT_STEPS = [
  {
    icon: Mail,
    text: 'Order confirmation via email',
  },
  {
    icon: Package,
    text: 'Packed & dispatched within 24h',
  },
  {
    icon: Truck,
    text: 'Tracking link as soon as it ships',
  },
] as const

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
      copyTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please copy the order number manually.',
        variant: 'destructive',
      })
    }
  }

  return (
    <section
      aria-label="Order confirmation"
      className="flex w-full justify-center px-4 py-10 sm:py-16"
    >
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 text-center sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="size-9 text-primary" aria-hidden />
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900">
            Order confirmed!
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Thanks — we&rsquo;re getting your fuel ready.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3">
            <span
              className="font-mono text-lg font-bold tracking-wider text-zinc-900"
              aria-label={`Order number ${orderNumber}`}
            >
              {orderNumber}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-zinc-400 hover:text-primary"
              onClick={copyOrderNumber}
              aria-label={copied ? 'Order number copied' : 'Copy order number'}
            >
              {copied ? (
                <Check className="size-4 text-primary" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
            </Button>
          </div>

          <p className="mt-4 text-sm text-zinc-700">
            Estimated delivery:{' '}
            <span className="font-bold text-zinc-900">
              {estimatedDeliveryText('standard')}
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            A confirmation email is on its way to you.
          </p>

          <Separator className="my-6" />

          <ul className="space-y-3 text-left" aria-label="What happens next">
            {NEXT_STEPS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-100">
                  <Icon className="size-4 text-zinc-500" aria-hidden />
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
              Back to home
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate({ name: 'category', slug: 'protein' })}
              className="h-11 flex-1 font-semibold text-zinc-600"
            >
              Continue shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
