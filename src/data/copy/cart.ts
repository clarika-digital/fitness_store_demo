/** Copy for the cart drawer. */

import { FREE_SHIPPING_THRESHOLD } from '../commerce'
import { NO_FLAVOR_LABEL } from '../commerce'

export const CART_COPY = {
  titleId: 'cart-drawer-description',
  openAriaLabel: 'Open cart',
  title: (count: number) => `Your cart (${count})`,
  description: 'Review, adjust or remove the items in your shopping cart.',
  freeShippingUnlocked: 'You’ve unlocked free shipping!',
  freeShippingRemaining: (amount: string) => `Only ${amount} away from free shipping`,
  progressAriaLabel: 'Free shipping progress',
  emptyTitle: 'Your cart is empty',
  emptyBody: 'The good stuff is one click away.',
  emptyCta: 'Shop whey protein',
  itemsAriaLabel: 'Cart items',
  flavorPrefix: 'Flavor:',
  noFlavorLabel: NO_FLAVOR_LABEL,
  subtotal: 'Subtotal',
  shippingNote: `Shipping calculated at checkout — free over €${FREE_SHIPPING_THRESHOLD}.`,
  checkoutCta: 'Go to checkout',
  continueShopping: 'Continue shopping',
  decreaseAriaLabel: (name: string) => `Decrease quantity of ${name}`,
  increaseAriaLabel: (name: string) => `Increase quantity of ${name}`,
  quantityAriaLabel: (qty: number) => `Quantity: ${qty}`,
  removeAriaLabel: (name: string) => `Remove ${name} from cart`,
} as const
