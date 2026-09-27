/** Copy for the checkout form and order summary. */

import { PROMO_CODES, WELCOME_PROMO_CODE } from '../commerce'
import { CHECKOUT_FIELD_PLACEHOLDERS } from '../validation'

export const CHECKOUT_COPY = {
  title: 'Checkout',
  stepsAriaLabel: 'Checkout steps',
  contactTitle: 'Contact & shipping address',
  fields: {
    email: 'Email',
    firstName: 'First name',
    lastName: 'Last name',
    street: 'Street & house no.',
    zip: 'ZIP',
    city: 'City',
    country: 'Country',
  },
  placeholders: CHECKOUT_FIELD_PLACEHOLDERS,
  countryPlaceholder: 'Select country',
  shippingTitle: 'Shipping method',
  shippingAriaLabel: 'Shipping method',
  paymentTitle: 'Payment',
  paymentAriaLabel: 'Payment method',
  summaryTitle: 'Order summary',
  summaryAriaLabel: 'Order summary',
  itemsAriaLabel: 'Items in this order',
  subtotal: 'Subtotal',
  promoApply: 'Apply',
  discount: (code: string) => `Discount (${code})`,
  discountPrefix: '- ',
  shippingRow: (label: string) => `${label} shipping`,
  free: 'FREE',
  total: 'Total',
  placeOrder: (total: string) => `Place order · ${total}`,
  placingOrder: 'Placing order…',
  secureLine: 'SSL-encrypted checkout · 30-day returns',
  demoLine: 'Demo store — use any test data, no real payment.',
  emptyTitle: 'Your cart is empty',
  emptyBody: 'Add some fuel first — then come back to check out.',
  emptyCta: 'Shop whey protein',
  errorPrefix: 'Checkout failed',
  promo: {
    placeholder: 'Promo code',
    ariaLabel: 'Promo code',
    applied: (percent: number) => `${percent}% applied ✓`,
    invalid: 'Code not valid',
    welcomeCode: WELCOME_PROMO_CODE,
    rate: PROMO_CODES[WELCOME_PROMO_CODE],
  },
  toast: {
    successTitle: 'Order placed!',
    successBody: (orderNumber: string) =>
      `Order ${orderNumber} is confirmed. Time to refuel.`,
    errorTitle: 'Checkout failed',
  },
} as const

export const ORDER_CONFIRMATION_COPY = {
  ariaLabel: 'Order confirmation',
  title: 'Order confirmed!',
  subtitle: 'Thanks — we’re getting your fuel ready.',
  orderNumberAriaLabel: (orderNumber: string) => `Order number ${orderNumber}`,
  copyAriaLabel: 'Copy order number',
  copiedAriaLabel: 'Order number copied',
  copyError: 'Please copy the order number manually.',
  copyErrorTitle: 'Copy failed',
  estimatedDelivery: 'Estimated delivery:',
  emailNote: 'A confirmation email is on its way to you.',
  nextStepsAriaLabel: 'What happens next',
  nextSteps: [
    { icon: 'mail', text: 'Order confirmation via email' },
    { icon: 'package', text: 'Packed & dispatched within 24h' },
    { icon: 'truck', text: 'Tracking link as soon as it ships' },
  ] as { icon: import('../icons').IconName; text: string }[],
  backToHome: 'Back to home',
  continueShopping: 'Continue shopping',
  copyResetDelay_MS: 2000,
} as const
