'use client'

import {
  FREE_SHIPPING_THRESHOLD,
  NO_FLAVOR_LABEL,
  PERCENT_MAX,
  PERCENT_SCALE,
  QTY_MAX,
  QTY_MIN,
} from '@/data/commerce'
import { HERO_CATEGORY_SLUG } from '@/data/categories'
import { CART_COPY } from '@/data/copy/cart'
import {
  cartCount,
  cartKey,
  cartSubtotal,
  useCartStore,
  type CartItem,
} from '@/store/cart-store'
import { useNavigate } from '@/hooks/use-nav'
import { useMoney } from '@/hooks/use-money'
import { Icon, ProductThumbnail, QuantityStepper } from '@/core'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

function CartRow({ item }: { item: CartItem }) {
  const money = useMoney()
  const setQty = useCartStore((s) => s.setQty)
  const remove = useCartStore((s) => s.remove)
  const key = cartKey(item)

  return (
    <div className="flex gap-3">
      <ProductThumbnail
        src={item.image}
        alt={item.name}
        size={64}
        className="bg-zinc-100"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-zinc-900">
          {item.brand} {item.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {item.flavor && item.flavor !== NO_FLAVOR_LABEL
            ? `${CART_COPY.flavorPrefix} ${item.flavor} · `
            : ''}
          {item.sizeLabel}
        </p>

        <div className="mt-2">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => setQty(key, q)}
            min={QTY_MIN}
            max={QTY_MAX}
            variant="outline"
            decreaseAriaLabel={CART_COPY.decreaseAriaLabel(item.name)}
            increaseAriaLabel={CART_COPY.increaseAriaLabel(item.name)}
            quantityAriaLabel={CART_COPY.quantityAriaLabel(item.quantity)}
          />
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between">
        <span className="text-sm font-bold text-zinc-900">
          {money(item.unitPrice * item.quantity)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-zinc-400 hover:text-red-600"
          aria-label={CART_COPY.removeAriaLabel(item.name)}
          onClick={() => remove(key)}
        >
          <Icon name="trash" size={16} />
        </Button>
      </div>
    </div>
  )
}

export function CartDrawer() {
  const money = useMoney()
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const close = useCartStore((s) => s.close)
  const navigate = useNavigate()

  const count = cartCount(items)
  const subtotal = cartSubtotal(items)
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal
  const progress = Math.min(
    PERCENT_MAX,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * PERCENT_SCALE)
  )
  const freeUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD

  const goCheckout = () => {
    close()
    navigate({ name: 'checkout' })
  }

  const shopProtein = () => {
    close()
    navigate({ name: 'category', slug: HERO_CATEGORY_SLUG })
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? close() : undefined)}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 sm:max-w-md"
        aria-describedby={CART_COPY.titleId}
      >
        <SheetHeader className="gap-3 border-b pr-12">
          <SheetTitle className="text-lg font-extrabold tracking-tight text-zinc-900">
            {CART_COPY.title(count)}
          </SheetTitle>
          <SheetDescription id={CART_COPY.titleId} className="sr-only">
            {CART_COPY.description}
          </SheetDescription>

          {freeUnlocked ? (
            <div className="space-y-2" aria-live="polite">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Icon name="badge-check" size={16} className="shrink-0" />
                {CART_COPY.freeShippingUnlocked}
              </p>
              <Progress value={PERCENT_MAX} aria-label={CART_COPY.progressAriaLabel} />
            </div>
          ) : (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm font-medium text-zinc-600">
                {CART_COPY.freeShippingRemaining(money(Math.max(0, remaining)))}
              </p>
              <Progress value={progress} aria-label={CART_COPY.progressAriaLabel} />
            </div>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100">
              <Icon name="shopping-bag" size={28} className="text-zinc-400" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-zinc-900">{CART_COPY.emptyTitle}</p>
              <p className="text-sm text-muted-foreground">{CART_COPY.emptyBody}</p>
            </div>
            <Button onClick={shopProtein} className="h-11 font-bold">
              {CART_COPY.emptyCta}
            </Button>
          </div>
        ) : (
          <>
            <ul
              className="scrollbar-slim flex-1 space-y-5 overflow-y-auto px-4 py-5"
              aria-label={CART_COPY.itemsAriaLabel}
            >
              {items.map((item) => (
                <li key={cartKey(item)}>
                  <CartRow item={item} />
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <Separator />
              <div className="space-y-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {CART_COPY.subtotal}
                  </span>
                  <span className="text-base font-bold text-zinc-900">
                    {money(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {CART_COPY.shippingNote(money)}
                </p>
                <Button
                  onClick={goCheckout}
                  className={cn('h-12 w-full text-base font-extrabold')}
                >
                  {CART_COPY.checkoutCta}
                </Button>
                <Button
                  variant="ghost"
                  onClick={close}
                  className="w-full font-semibold text-zinc-600"
                >
                  {CART_COPY.continueShopping}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
