/**
 * Client-side validation rules and messages.
 * The API routes validate the same shape with zod; messages live here so the
 * wording cannot drift between the form and the server response.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const VALIDATION_MESSAGES = {
  emailRequired: 'Email is required.',
  emailInvalid: 'Enter a valid email address.',
  emailEmpty: 'Please enter your email address.',
  emailLooksWrong: 'That doesn’t look like a valid email address.',
  firstNameRequired: 'First name is required.',
  lastNameRequired: 'Last name is required.',
  streetRequired: 'Street and house no. are required.',
  zipRequired: 'ZIP code is required.',
  cityRequired: 'City is required.',
} as const

/** Form field ids, so `Label htmlFor` / `aria-describedby` stay in sync. */
export const CHECKOUT_FIELD_IDS = {
  email: 'co-email',
  firstName: 'co-first-name',
  lastName: 'co-last-name',
  street: 'co-street',
  zip: 'co-zip',
  city: 'co-city',
  country: 'co-country',
} as const

export function checkoutFieldErrorId(field: string): string {
  return `${CHECKOUT_FIELD_IDS[field as keyof typeof CHECKOUT_FIELD_IDS] ?? field}-error`
}

export const CHECKOUT_FIELD_AUTOCOMPLETE = {
  email: 'email',
  firstName: 'given-name',
  lastName: 'family-name',
  street: 'street-address',
  zip: 'postal-code',
  city: 'address-level2',
} as const

export const CHECKOUT_FIELD_PLACEHOLDERS = {
  email: 'you@example.com',
  firstName: 'Alex',
  lastName: 'Weber',
  street: 'Musterstraße 12',
  zip: '80331',
  city: 'München',
} as const

export const PROMO_INPUT_PLACEHOLDER = 'Promo code'
