'use client'

import Image from 'next/image'
import { BadgeCheck, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import {
  cartCount,
  cartKey,
  cartSubtotal,
  useCartStore,
  type CartItem,
} from '@/store/cart-store'
import { useNavStore } from '@/store/nav-store'
import { formatEUR, FREE_SHIPPING_THRESHOLD } from '@/lib/format'
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

const QTY_MIN = 1
const QTY_MAX = 20

function CartRow({ item }: { item: CartItem }) {
  const setQty = useCartStore((s) => s.setQty)
  const remove = useCartStore((s) => s.remove)
  const key = cartKey(item)

  return (
    <div className="flex gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-zinc-900">
          {item.brand} {item.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {item.flavor && item.flavor !== '—' ? `Flavor: ${item.flavor} · ` : ''}
          {item.sizeLabel}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-md"
            aria-label={`Decrease quantity of ${item.name}`}
            disabled={item.quantity <= QTY_MIN}
            onClick={() => setQty(key, Math.max(QTY_MIN, item.quantity - 1))}
          >
            <Minus className="size-3.5" />
          </Button>
          <span
            className="w-7 text-center text-sm font-bold tabular-nums"
            aria-live="polite"
            aria-label={`Quantity: ${item.quantity}`}
          >
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-md"
            aria-label={`Increase quantity of ${item.name}`}
            disabled={item.quantity >= QTY_MAX}
            onClick={() => setQty(key, Math.min(QTY_MAX, item.quantity + 1))}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between">
        <span className="text-sm font-bold text-zinc-900">
          {formatEUR(item.unitPrice * item.quantity)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-zinc-400 hover:text-red-600"
          aria-label={`Remove ${item.name} from cart`}
          onClick={() => remove(key)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function CartDrawer() {
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const close = useCartStore((s) => s.close)
  const navigate = useNavStore((s) => s.navigate)

  const count = cartCount(items)
  const subtotal = cartSubtotal(items)
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))
  const freeUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD

  const goCheckout = () => {
    close()
    navigate({ name: 'checkout' })
  }

  const shopProtein = () => {
    close()
    navigate({ name: 'category', slug: 'protein' })
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? close() : undefined)}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 sm:max-w-md"
        aria-describedby="cart-drawer-description"
      >
        <SheetHeader className="gap-3 border-b pr-12">
          <SheetTitle className="text-lg font-extrabold tracking-tight text-zinc-900">
            Your cart ({count})
          </SheetTitle>
          <SheetDescription id="cart-drawer-description" className="sr-only">
            Review, adjust or remove the items in your shopping cart.
          </SheetDescription>

          {freeUnlocked ? (
            <div className="space-y-2" aria-live="polite">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                <BadgeCheck className="size-4 shrink-0" aria-hidden />
                You&rsquo;ve unlocked free shipping!
              </p>
              <Progress value={100} aria-label="Free shipping progress" />
            </div>
          ) : (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm font-medium text-zinc-600">
                Only{' '}
                <span className="font-bold text-primary">
                  {formatEUR(Math.max(0, remaining))}
                </span>{' '}
                away from free shipping
              </p>
              <Progress value={progress} aria-label="Free shipping progress" />
            </div>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100">
              <ShoppingBag className="size-7 text-zinc-400" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-zinc-900">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                The good stuff is one click away.
              </p>
            </div>
            <Button onClick={shopProtein} className="h-11 font-bold">
              Shop whey protein
            </Button>
          </div>
        ) : (
          <>
            <ul
              className="scrollbar-slim flex-1 space-y-5 overflow-y-auto px-4 py-5"
              aria-label="Cart items"
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
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-base font-bold text-zinc-900">
                    {formatEUR(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping calculated at checkout — free over €59.
                </p>
                <Button
                  onClick={goCheckout}
                  className={cn('h-12 w-full text-base font-extrabold')}
                >
                  Go to checkout
                </Button>
                <Button
                  variant="ghost"
                  onClick={close}
                  className="w-full font-semibold text-zinc-600"
                >
                  Continue shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
