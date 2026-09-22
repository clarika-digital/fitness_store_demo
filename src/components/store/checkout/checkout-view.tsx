'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useMutation } from '@tanstack/react-query'
import {
  Banknote,
  CreditCard,
  Loader2,
  Lock,
  ShoppingBag,
  Wallet,
} from 'lucide-react'
import { cartSubtotal, useCartStore } from '@/store/cart-store'
import { useNavStore } from '@/store/nav-store'
import { submitCheckout } from '@/lib/api-client'
import {
  formatEUR,
  EXPRESS_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  STANDARD_SHIPPING,
} from '@/lib/format'
import type { CheckoutPayload } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type ShippingMethod = 'standard' | 'express'
type PaymentMethod = 'paypal' | 'klarna' | 'card'

type FormState = {
  email: string
  firstName: string
  lastName: string
  street: string
  zip: string
  city: string
  country: string
}

const EMPTY_FORM: FormState = {
  email: '',
  firstName: '',
  lastName: '',
  street: '',
  zip: '',
  city: '',
  country: 'DE',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const CHECKOUT_STEPS = ['Details', 'Payment', 'Done'] as const

function fieldCls(invalid: boolean) {
  return cn('h-11 bg-white', invalid && 'border-red-400 focus-visible:ring-red-200')
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-xs font-medium text-red-500">
      {message}
    </p>
  )
}

function StepsIndicator() {
  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label="Checkout steps">
      {CHECKOUT_STEPS.map((label, idx) => {
        const n = idx + 1
        const active = n <= 2
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <span
              aria-current={n === 1 ? 'step' : undefined}
              className={cn(
                'flex size-7 items-center justify-center rounded-full text-xs font-extrabold',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-zinc-200 text-zinc-500'
              )}
            >
              {n}
            </span>
            <span
              className={cn(
                'text-sm font-bold',
                active ? 'text-zinc-900' : 'text-zinc-400'
              )}
            >
              {label}
            </span>
            {idx < CHECKOUT_STEPS.length - 1 && (
              <span className="h-px w-6 bg-zinc-300 sm:w-10" aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}

function EmptyCartCard() {
  const navigate = useNavStore((s) => s.navigate)
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:py-24">
      <Card className="text-center">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100">
            <ShoppingBag className="size-7 text-zinc-400" aria-hidden />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-zinc-900">
              Your cart is empty
            </h1>
            <p className="text-sm text-muted-foreground">
              Add some fuel first — then come back to check out.
            </p>
          </div>
          <Button
            onClick={() => navigate({ name: 'category', slug: 'protein' })}
            className="h-11 w-full font-bold"
          >
            Shop whey protein
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function CheckoutView() {
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const navigate = useNavStore((s) => s.navigate)
  const { toast } = useToast()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal')
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const subtotal = cartSubtotal(items)
  const discount = promoApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0
  const afterDiscount = Math.max(0, Math.round((subtotal - discount) * 100) / 100)
  const shippingCost =
    shippingMethod === 'express'
      ? EXPRESS_SHIPPING
      : afterDiscount >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING
  const total = Math.round((afterDiscount + shippingCost) * 100) / 100

  const setField = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.firstName.trim()) next.firstName = 'First name is required.'
    if (!form.lastName.trim()) next.lastName = 'Last name is required.'
    if (!form.street.trim()) next.street = 'Street and house no. are required.'
    if (!form.zip.trim()) next.zip = 'ZIP code is required.'
    if (!form.city.trim()) next.city = 'City is required.'
    setErrors(next)
    return Object.values(next).every((v) => !v)
  }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) {
      setPromoApplied(false)
      setPromoMsg(null)
      return
    }
    const rate = PROMO_CODES[code]
    if (rate) {
      setPromoApplied(true)
      setPromoMsg({ ok: true, text: `${Math.round(rate * 100)}% applied ✓` })
    } else {
      setPromoApplied(false)
      setPromoMsg({ ok: false, text: 'Code not valid' })
    }
  }

  const mutation = useMutation({
    mutationFn: submitCheckout,
    onSuccess: (res) => {
      clear()
      toast({
        title: 'Order placed!',
        description: `Order ${res.orderNumber} is confirmed. Time to refuel.`,
      })
      navigate({ name: 'confirmation', orderNumber: res.orderNumber })
    },
    onError: (err: Error) => {
      setCheckoutError(err.message)
      toast({
        variant: 'destructive',
        title: 'Checkout failed',
        description: err.message,
      })
    },
  })

  const placeOrder = () => {
    setCheckoutError(null)
    if (!validate()) return
    const payload: CheckoutPayload = {
      email: form.email.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      street: form.street.trim(),
      zip: form.zip.trim(),
      city: form.city.trim(),
      country: form.country,
      shippingMethod,
      paymentMethod,
      promoCode: promoApplied ? promoInput.trim().toUpperCase() : undefined,
      items: items.map((i) => ({
        productId: i.productId,
        flavor: i.flavor,
        sizeLabel: i.sizeLabel,
        quantity: i.quantity,
      })),
    }
    mutation.mutate(payload)
  }

  if (items.length === 0) return <EmptyCartCard />

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
        Checkout
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* ── Left column: steps + form sections ─────────────────────────── */}
        <div className="space-y-6">
          <StepsIndicator />

          {/* 1 · Contact & shipping address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-extrabold text-zinc-900">
                Contact &amp; shipping address
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="co-email">Email</Label>
                <Input
                  id="co-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'co-email-error' : undefined}
                  className={fieldCls(!!errors.email)}
                />
                <FieldError id="co-email-error" message={errors.email} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="co-first-name">First name</Label>
                <Input
                  id="co-first-name"
                  autoComplete="given-name"
                  placeholder="Alex"
                  value={form.firstName}
                  onChange={(e) => setField('firstName', e.target.value)}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'co-first-name-error' : undefined}
                  className={fieldCls(!!errors.firstName)}
                />
                <FieldError id="co-first-name-error" message={errors.firstName} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="co-last-name">Last name</Label>
                <Input
                  id="co-last-name"
                  autoComplete="family-name"
                  placeholder="Weber"
                  value={form.lastName}
                  onChange={(e) => setField('lastName', e.target.value)}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'co-last-name-error' : undefined}
                  className={fieldCls(!!errors.lastName)}
                />
                <FieldError id="co-last-name-error" message={errors.lastName} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="co-street">Street &amp; house no.</Label>
                <Input
                  id="co-street"
                  autoComplete="street-address"
                  placeholder="Musterstraße 12"
                  value={form.street}
                  onChange={(e) => setField('street', e.target.value)}
                  aria-invalid={!!errors.street}
                  aria-describedby={errors.street ? 'co-street-error' : undefined}
                  className={fieldCls(!!errors.street)}
                />
                <FieldError id="co-street-error" message={errors.street} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="co-zip">ZIP</Label>
                <Input
                  id="co-zip"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="80331"
                  value={form.zip}
                  onChange={(e) => setField('zip', e.target.value)}
                  aria-invalid={!!errors.zip}
                  aria-describedby={errors.zip ? 'co-zip-error' : undefined}
                  className={fieldCls(!!errors.zip)}
                />
                <FieldError id="co-zip-error" message={errors.zip} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="co-city">City</Label>
                <Input
                  id="co-city"
                  autoComplete="address-level2"
                  placeholder="München"
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'co-city-error' : undefined}
                  className={fieldCls(!!errors.city)}
                />
                <FieldError id="co-city-error" message={errors.city} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="co-country">Country</Label>
                <Select
                  value={form.country}
                  onValueChange={(v) => setField('country', v)}
                >
                  <SelectTrigger id="co-country" className="h-11 w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="AT">Austria</SelectItem>
                    <SelectItem value="CH">Switzerland</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 2 · Shipping method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-extrabold text-zinc-900">
                Shipping method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={shippingMethod}
                onValueChange={(v) => setShippingMethod(v as ShippingMethod)}
                className="grid gap-3"
                aria-label="Shipping method"
              >
                <Label
                  htmlFor="ship-standard"
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal transition-colors',
                    shippingMethod === 'standard'
                      ? 'border-primary bg-primary/5'
                      : 'border-zinc-200 hover:border-zinc-300'
                  )}
                >
                  <RadioGroupItem value="standard" id="ship-standard" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-zinc-900">
                      Standard
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      2–4 business days
                    </span>
                  </span>
                  {shippingCost === 0 && shippingMethod === 'standard' ? (
                    <span className="text-sm font-extrabold text-primary">FREE</span>
                  ) : (
                    <span className="text-sm font-extrabold text-zinc-900">
                      {formatEUR(STANDARD_SHIPPING)}
                    </span>
                  )}
                </Label>

                <Label
                  htmlFor="ship-express"
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal transition-colors',
                    shippingMethod === 'express'
                      ? 'border-primary bg-primary/5'
                      : 'border-zinc-200 hover:border-zinc-300'
                  )}
                >
                  <RadioGroupItem value="express" id="ship-express" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-zinc-900">
                      Express
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Next business day
                    </span>
                  </span>
                  <span className="text-sm font-extrabold text-zinc-900">
                    {formatEUR(EXPRESS_SHIPPING)}
                  </span>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* 3 · Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-extrabold text-zinc-900">
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                className="grid gap-3"
                aria-label="Payment method"
              >
                <Label
                  htmlFor="pay-paypal"
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal transition-colors',
                    paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/5'
                      : 'border-zinc-200 hover:border-zinc-300'
                  )}
                >
                  <RadioGroupItem value="paypal" id="pay-paypal" />
                  <Wallet className="size-5 shrink-0 text-zinc-500" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-zinc-900">
                      PayPal
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      You&rsquo;ll be redirected after placing the order
                    </span>
                  </span>
                </Label>

                <Label
                  htmlFor="pay-klarna"
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal transition-colors',
                    paymentMethod === 'klarna'
                      ? 'border-primary bg-primary/5'
                      : 'border-zinc-200 hover:border-zinc-300'
                  )}
                >
                  <RadioGroupItem value="klarna" id="pay-klarna" />
                  <Banknote className="size-5 shrink-0 text-zinc-500" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-zinc-900">
                      Klarna — Pay after delivery
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Pay in 30 days
                    </span>
                  </span>
                </Label>

                <Label
                  htmlFor="pay-card"
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal transition-colors',
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5'
                      : 'border-zinc-200 hover:border-zinc-300'
                  )}
                >
                  <RadioGroupItem value="card" id="pay-card" />
                  <CreditCard className="size-5 shrink-0 text-zinc-500" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-zinc-900">
                      Credit card
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Visa / Mastercard — demo checkout, no real charge
                    </span>
                  </span>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* ── Right column: order summary ────────────────────────────────── */}
        <aside
          className="self-start lg:sticky lg:top-24"
          aria-label="Order summary"
        >
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-base font-extrabold text-zinc-900">
                Order summary
              </h2>

              <ul className="space-y-3" aria-label="Items in this order">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.flavor}-${item.sizeLabel}`} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {item.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.flavor !== '—' ? `${item.flavor} · ` : ''}
                        {item.sizeLabel} · {item.quantity}×
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-zinc-900">
                      {formatEUR(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-zinc-900">
                  {formatEUR(subtotal)}
                </span>
              </div>

              {/* Promo code */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <Input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        applyPromo()
                      }
                    }}
                    placeholder="Promo code"
                    aria-label="Promo code"
                    className="h-10 bg-white uppercase"
                  />
                  <Button
                    variant="outline"
                    onClick={applyPromo}
                    className="h-10 font-bold"
                  >
                    Apply
                  </Button>
                </div>
                {promoMsg && (
                  <p
                    role="status"
                    className={cn(
                      'text-xs font-semibold',
                      promoMsg.ok ? 'text-primary' : 'text-destructive'
                    )}
                  >
                    {promoMsg.text}
                  </p>
                )}
              </div>

              {promoApplied && discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discount (WELCOME10)</span>
                  <span className="font-semibold text-primary">
                    - {formatEUR(discount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {shippingMethod === 'standard' ? 'Standard' : 'Express'} shipping
                </span>
                {shippingCost === 0 ? (
                  <span className="font-extrabold text-primary">FREE</span>
                ) : (
                  <span className="font-semibold text-zinc-900">
                    {formatEUR(shippingCost)}
                  </span>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-zinc-900">Total</span>
                <span className="text-lg font-extrabold text-zinc-900">
                  {formatEUR(total)}
                </span>
              </div>

              {checkoutError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600"
                >
                  Checkout failed: {checkoutError}
                </div>
              )}

              <Button
                onClick={placeOrder}
                disabled={mutation.isPending}
                className="h-12 w-full text-base font-extrabold"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Placing order…
                  </>
                ) : (
                  <>Place order · {formatEUR(total)}</>
                )}
              </Button>

              <div className="space-y-1 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-zinc-500">
                  <Lock className="size-3.5" aria-hidden />
                  SSL-encrypted checkout · 30-day returns
                </p>
                <p className="text-[11px] text-zinc-400">
                  Demo store — use any test data, no real payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
