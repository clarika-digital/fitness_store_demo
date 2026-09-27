/**
 * Public entry point for reusable UI.
 *
 * Anything used by more than one view lives here and is exported from this
 * barrel. Feature components in `components/store/**` should compose from
 * `@/core` and pull all copy from `@/data`.
 */

export { Icon, getIcon, ICON_REGISTRY, type IconProps, type IconName } from './icon'
export { RatingStars } from './rating-stars'
export { FlavorSwatch } from './flavor-swatch'
export { ProductCard, ProductCardSkeleton } from './product-card'
export { ProductGrid, ProductGridSkeleton } from './product-grid'
export { SectionHeading } from './section-heading'
export { BreadcrumbNav, type BreadcrumbItem } from './breadcrumb-nav'
export {
  ErrorState,
  EmptyState,
  LoadingLabel,
  type EmptyStateAction,
} from './state-view'
export { QuantityStepper } from './quantity-stepper'
export { PriceBlock } from './price-block'
export { ProductThumbnail } from './product-thumbnail'
