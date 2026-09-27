'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  CHECKOUT_ACTIVE_STEP_COUNT,
  CHECKOUT_STEPS,
  COUNTRIES,
  DEFAULT_COUNTRY,
  DEFAULT_PAYMENT_METHOD,
  DEFAULT_SHIPPING_METHOD,
  ENTER_KEY,
  EXPRESS_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  NO_FLAVOR_LABEL,
  PAYMENT_METHODS,
  PERCENT_FACTOR,
  PROMO_CODES,
  SHIPPING_METHODS,
  STANDARD_SHIPPING,
  type PaymentMethodId,
  type ShippingMethodId,
} from '@/data/commerce'
import { HERO_CATEGORY_SLUG } from '@/data/categories'
import { CHECKOUT_COPY } from '@/data/copy/checkout'
import { GLYPH_COPY } from '@/data/copy/chrome'
import {
  CHECKOUT_FIELD_AUTOCOMPLETE,
  CHECKOUT_FIELD_IDS,
  CHECKOUT_FIELD_PLACEHOLDERS,
  EMAIL_PATTERN,
  PROMO_INPUT_PLACEHOLDER,
  VALIDATION_MESSAGES,
  checkoutFieldErrorId,
} from '@/data/validation'
import { cartSubtotal, useCartStore } from '@/store/cart-store'
import { useNavStore } from '@/store/nav-store'
import { submitCheckout } from '@/lib/api-client'
import { formatEUR, roundMoney } from '@/lib/format'
import type { CheckoutPayload } from '@/lib/types'
import { Icon, ProductThumbnail } from '@/core'
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
  country: DEFAULT_COUNTRY,
}

const STEP_NUMBER_OFFSET = 1

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
    <ol className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label={CHECKOUT_COPY.stepsAriaLabel}>
      {CHECKOUT_STEPS.map((label, idx) => {
        const n = idx + STEP_NUMBER_OFFSET
        const active = n <= CHECKOUT_ACTIVE_STEP_COUNT
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <span
              aria-current={n === STEP_NUMBER_OFFSET ? 'step' : undefined}
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
            {idx < CHECKOUT_STEPS.length - STEP_NUMBER_OFFSET && (
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
            <Icon name="shopping-bag" size={28} className="text-zinc-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-zinc-900">
              {CHECKOUT_COPY.emptyTitle}
            </h1>
            <p className="text-sm text-muted-foreground">{CHECKOUT_COPY.emptyBody}</p>
          </div>
          <Button
            onClick={() => navigate({ name: 'category', slug: HERO_CATEGORY_SLUG })}
            className="h-11 w-full font-bold"
          >
            {CHECKOUT_COPY.emptyCta}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function optionBorder(selected: boolean) {
  return cn(
    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal transition-colors',
    selected ? 'border-primary bg-primary/5' : 'border-zinc-200 hover:border-zinc-300'
  )
}

export function CheckoutView() {
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const navigate = useNavStore((s) => s.navigate)
  const { toast } = useToast()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>(
    DEFAULT_SHIPPING_METHOD
  )
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>(
    DEFAULT_PAYMENT_METHOD
  )
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const subtotal = cartSubtotal(items)
  const discountRate = PROMO_CODES[promoInput.trim().toUpperCase()] ?? 0
  const discount =
    promoApplied && discountRate > 0 ? roundMoney(subtotal * discountRate) : 0
  const afterDiscount = Math.max(0, roundMoney(subtotal - discount))
  const shippingCost =
    shippingMethod === 'express'
      ? EXPRESS_SHIPPING
      : afterDiscount >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING
  const total = roundMoney(afterDiscount + shippingCost)

  const setField = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    const email = form.email.trim()
    if (!email) next.email = VALIDATION_MESSAGES.emailRequired
    else if (!EMAIL_PATTERN.test(email)) next.email = VALIDATION_MESSAGES.emailInvalid
    if (!form.firstName.trim()) next.firstName = VALIDATION_MESSAGES.firstNameRequired
    if (!form.lastName.trim()) next.lastName = VALIDATION_MESSAGES.lastNameRequired
    if (!form.street.trim()) next.street = VALIDATION_MESSAGES.streetRequired
    if (!form.zip.trim()) next.zip = VALIDATION_MESSAGES.zipRequired
    if (!form.city.trim()) next.city = VALIDATION_MESSAGES.cityRequired
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
      setPromoMsg({
        ok: true,
        text: CHECKOUT_COPY.promo.applied(Math.round(rate * PERCENT_FACTOR)),
      })
    } else {
      setPromoApplied(false)
      setPromoMsg({ ok: false, text: CHECKOUT_COPY.promo.invalid })
    }
  }

  const mutation = useMutation({
    mutationFn: submitCheckout,
    onSuccess: (res) => {
      clear()
      toast({
        title: CHECKOUT_COPY.toast.successTitle,
        description: CHECKOUT_COPY.toast.successBody(res.orderNumber),
      })
      navigate({ name: 'confirmation', orderNumber: res.orderNumber })
    },
    onError: (err: Error) => {
      setCheckoutError(err.message)
      toast({
        variant: 'destructive',
        title: CHECKOUT_COPY.toast.errorTitle,
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
        {CHECKOUT_COPY.title}
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* ── Left column: steps + form sections ─────────────────────────── */}
        <div className="space-y-6">
          <StepsIndicator />

          {/* 1 · Contact & shipping address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-extrabold text-zinc-900">
                {CHECKOUT_COPY.contactTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={CHECKOUT_FIELD_IDS.email}>
                  {CHECKOUT_COPY.fields.email}
                </Label>
                <Input
                  id={CHECKOUT_FIELD_IDS.email}
                  type="email"
                  autoComplete={CHECKOUT_FIELD_AUTOCOMPLETE.email}
                  placeholder={CHECKOUT_FIELD_PLACEHOLDERS.email}
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? checkoutFieldErrorId('email') : undefined
                  }
                  className={fieldCls(!!errors.email)}
                />
                <FieldError
                  id={checkoutFieldErrorId('email')}
                  message={errors.email}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={CHECKOUT_FIELD_IDS.firstName}>
                  {CHECKOUT_COPY.fields.firstName}
                </Label>
                <Input
                  id={CHECKOUT_FIELD_IDS.firstName}
                  autoComplete={CHECKOUT_FIELD_AUTOCOMPLETE.firstName}
                  placeholder={CHECKOUT_FIELD_PLACEHOLDERS.firstName}
                  value={form.firstName}
                  onChange={(e) => setField('firstName', e.target.value)}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? checkoutFieldErrorId('firstName') : undefined
                  }
                  className={fieldCls(!!errors.firstName)}
                />
                <FieldError
                  id={checkoutFieldErrorId('firstName')}
                  message={errors.firstName}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={CHECKOUT_FIELD_IDS.lastName}>
                  {CHECKOUT_COPY.fields.lastName}
                </Label>
                <Input
                  id={CHECKOUT_FIELD_IDS.lastName}
                  autoComplete={CHECKOUT_FIELD_AUTOCOMPLETE.lastName}
                  placeholder={CHECKOUT_FIELD_PLACEHOLDERS.lastName}
                  value={form.lastName}
                  onChange={(e) => setField('lastName', e.target.value)}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={
                    errors.lastName ? checkoutFieldErrorId('lastName') : undefined
                  }
                  className={fieldCls(!!errors.lastName)}
                />
                <FieldError
                  id={checkoutFieldErrorId('lastName')}
                  message={errors.lastName}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={CHECKOUT_FIELD_IDS.street}>
                  {CHECKOUT_COPY.fields.street}
                </Label>
                <Input
                  id={CHECKOUT_FIELD_IDS.street}
                  autoComplete={CHECKOUT_FIELD_AUTOCOMPLETE.street}
                  placeholder={CHECKOUT_FIELD_PLACEHOLDERS.street}
                  value={form.street}
                  onChange={(e) => setField('street', e.target.value)}
                  aria-invalid={!!errors.street}
                  aria-describedby={
                    errors.street ? checkoutFieldErrorId('street') : undefined
                  }
                  className={fieldCls(!!errors.street)}
                />
                <FieldError
                  id={checkoutFieldErrorId('street')}
                  message={errors.street}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={CHECKOUT_FIELD_IDS.zip}>{CHECKOUT_COPY.fields.zip}</Label>
                <Input
                  id={CHECKOUT_FIELD_IDS.zip}
                  inputMode="numeric"
                  autoComplete={CHECKOUT_FIELD_AUTOCOMPLETE.zip}
                  placeholder={CHECKOUT_FIELD_PLACEHOLDERS.zip}
                  value={form.zip}
                  onChange={(e) => setField('zip', e.target.value)}
                  aria-invalid={!!errors.zip}
                  aria-describedby={errors.zip ? checkoutFieldErrorId('zip') : undefined}
                  className={fieldCls(!!errors.zip)}
                />
                <FieldError id={checkoutFieldErrorId('zip')} message={errors.zip} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={CHECKOUT_FIELD_IDS.city}>{CHECKOUT_COPY.fields.city}</Label>
                <Input
                  id={CHECKOUT_FIELD_IDS.city}
                  autoComplete={CHECKOUT_FIELD_AUTOCOMPLETE.city}
                  placeholder={CHECKOUT_FIELD_PLACEHOLDERS.city}
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  aria-invalid={!!errors.city}
                  aria-describedby={
                    errors.city ? checkoutFieldErrorId('city') : undefined
                  }
                  className={fieldCls(!!errors.city)}
                />
                <FieldError id={checkoutFieldErrorId('city')} message={errors.city} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={CHECKOUT_FIELD_IDS.country}>
                  {CHECKOUT_COPY.fields.country}
                </Label>
                <Select
                  value={form.country}
                  onValueChange={(v) => setField('country', v)}
                >
                  <SelectTrigger id={CHECKOUT_FIELD_IDS.country} className="h-11 w-full">
                    <SelectValue placeholder={CHECKOUT_COPY.countryPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 2 · Shipping method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-extrabold text-zinc-900">
                {CHECKOUT_COPY.shippingTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={shippingMethod}
                onValueChange={(v) => setShippingMethod(v as ShippingMethodId)}
                className="grid gap-3"
                aria-label={CHECKOUT_COPY.shippingAriaLabel}
              >
                {SHIPPING_METHODS.map((method) => (
                  <Label
                    key={method.id}
                    htmlFor={`ship-${method.id}`}
                    className={optionBorder(shippingMethod === method.id)}
                  >
                    <RadioGroupItem value={method.id} id={`ship-${method.id}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-zinc-900">
                        {method.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {method.description}
                      </span>
                    </span>
                    {method.id === DEFAULT_SHIPPING_METHOD && shippingCost === 0 ? (
                      <span className="text-sm font-extrabold text-primary">
                        {CHECKOUT_COPY.free}
                      </span>
                    ) : (
                      <span className="text-sm font-extrabold text-zinc-900">
                        {formatEUR(method.cost)}
                      </span>
                    )}
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* 3 · Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-extrabold text-zinc-900">
                {CHECKOUT_COPY.paymentTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethodId)}
                className="grid gap-3"
                aria-label={CHECKOUT_COPY.paymentAriaLabel}
              >
                {PAYMENT_METHODS.map((method) => (
                  <Label
                    key={method.id}
                    htmlFor={`pay-${method.id}`}
                    className={optionBorder(paymentMethod === method.id)}
                  >
                    <RadioGroupItem value={method.id} id={`pay-${method.id}`} />
                    <Icon
                      name={method.icon}
                      size={20}
                      className="shrink-0 text-zinc-500"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-zinc-900">
                        {method.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {method.description}
                      </span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* ── Right column: order summary ────────────────────────────────── */}
        <aside
          className="self-start lg:sticky lg:top-24"
          aria-label={CHECKOUT_COPY.summaryAriaLabel}
        >
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-base font-extrabold text-zinc-900">
                {CHECKOUT_COPY.summaryTitle}
              </h2>

              <ul className="space-y-3" aria-label={CHECKOUT_COPY.itemsAriaLabel}>
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.flavor}-${item.sizeLabel}`}
                    className="flex items-center gap-3"
                  >
                    <ProductThumbnail
                      src={item.image}
                      alt={item.name}
                      size={48}
                      rounded="rounded-md"
                      className="bg-zinc-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {item.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.flavor !== NO_FLAVOR_LABEL
                          ? `${item.flavor} ${GLYPH_COPY.separator} `
                          : ''}
                        {item.sizeLabel} {GLYPH_COPY.separator} {item.quantity}
                        {GLYPH_COPY.times}
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
                <span className="text-muted-foreground">{CHECKOUT_COPY.subtotal}</span>
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
                      if (e.key === ENTER_KEY) {
                        e.preventDefault()
                        applyPromo()
                      }
                    }}
                    placeholder={PROMO_INPUT_PLACEHOLDER}
                    aria-label={CHECKOUT_COPY.promo.ariaLabel}
                    className="h-10 bg-white uppercase"
                  />
                  <Button
                    variant="outline"
                    onClick={applyPromo}
                    className="h-10 font-bold"
                  >
                    {CHECKOUT_COPY.promoApply}
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
                  <span className="text-muted-foreground">
                    {CHECKOUT_COPY.discount(CHECKOUT_COPY.promo.welcomeCode)}
                  </span>
                  <span className="font-semibold text-primary">
                    {CHECKOUT_COPY.discountPrefix}
                    {formatEUR(discount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {CHECKOUT_COPY.shippingRow(
                    SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.label ?? ''
                  )}
                </span>
                {shippingCost === 0 ? (
                  <span className="font-extrabold text-primary">{CHECKOUT_COPY.free}</span>
                ) : (
                  <span className="font-semibold text-zinc-900">
                    {formatEUR(shippingCost)}
                  </span>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-zinc-900">
                  {CHECKOUT_COPY.total}
                </span>
                <span className="text-lg font-extrabold text-zinc-900">
                  {formatEUR(total)}
                </span>
              </div>

              {checkoutError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600"
                >
                  {CHECKOUT_COPY.errorPrefix}: {checkoutError}
                </div>
              )}

              <Button
                onClick={placeOrder}
                disabled={mutation.isPending}
                className="h-12 w-full text-base font-extrabold"
              >
                {mutation.isPending ? (
                  <>
                    <Icon name="loader" size={16} className="animate-spin" />
                    {CHECKOUT_COPY.placingOrder}
                  </>
                ) : (
                  CHECKOUT_COPY.placeOrder(formatEUR(total))
                )}
              </Button>

              <div className="space-y-1 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-zinc-500">
                  <Icon name="lock" size={14} />
                  {CHECKOUT_COPY.secureLine}
                </p>
                <p className="text-[11px] text-zinc-400">{CHECKOUT_COPY.demoLine}</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
