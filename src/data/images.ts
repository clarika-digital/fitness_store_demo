/**
 * Every image path and its alt text.
 * Product imagery itself lives in the database (`Product.image`); these are the
 * static, editorial assets owned by the app.
 */

export const IMAGES = {
  hero: {
    src: '/images/hero.png',
    alt: 'ESN Designer Whey tubs in a dark gym scene',
  },
  sampleBox: {
    src: '/images/products/sample-box.png',
    alt: 'Whey Sample Box with assorted flavor sachets',
  },
  starterBundle: {
    src: '/images/products/starter-bundle.png',
    alt: 'Whey Starter Bundle: ESN Designer Whey 1 kg with Fuel’d Shaker',
  },
} as const

/** `sizes` hints for responsive image rendering. */
export const IMAGE_SIZES = {
  hero: '(max-width: 1024px) 100vw, 50vw',
  banner: '(max-width: 768px) 100vw, 50vw',
  productCard: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  productMain: '(max-width: 1024px) 100vw, 50vw',
  productThumb: '80px',
  productTile: '(max-width: 640px) 50vw, 25vw',
  productTileWide: '(max-width: 1024px) 100vw, 50vw',
  searchResult: '40px',
  cartRow: '64px',
  summaryRow: '48px',
} as const
