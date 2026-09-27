/**
 * Public entry point for all application data.
 *
 * Rule for this codebase: components must not contain raw copy, labels, slugs,
 * prices, icons or other literals. Import them from `@/data` instead.
 *
 * This barrel re-exports every module so callers have a single import site.
 */

export * from './commerce'
export * from './icons'
export * from './site'
export * from './images'
export * from './categories'
export * from './products'
export * from './navigation'
export * from './validation'
export * from './api'
export * from './storage'
export * from './copy'
