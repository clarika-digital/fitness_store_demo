/**
 * Category metadata, mosaic tiles and the protein comparison table.
 *
 * Titles/descriptions duplicate `Category.name`/`Category.description` in the
 * database. The DB stays the source of truth for *which* categories exist; this
 * file owns the marketing copy the listing pages render.
 */

export const CATEGORY_META = {
  protein: {
    title: 'Protein',
    description:
      'Whey protein, isolates & vegan blends — the foundation of every training goal.',
  },
  'pre-workout': {
    title: 'Pre-Workout',
    description:
      'Booster and pump supplements for maximum focus, energy and performance.',
  },
  creatine: {
    title: 'Creatine',
    description:
      'Creapure® creatine monohydrate — the most researched supplement in sports nutrition.',
  },
  amino: {
    title: 'Amino Acids',
    description: 'EAAs and citrulline for recovery, pump and muscle protection.',
  },
  vitamins: {
    title: 'Vitamins & Health',
    description: 'ZMA and micronutrients to cover your daily basics.',
  },
  accessories: {
    title: 'Accessories',
    description: 'Shakers and everything around the shaker cup.',
  },
  equipment: {
    title: 'Equipment',
    description:
      'Training gear that earns its place in the rack — bands, belts, sleeves and ropes.',
  },
  bundles: {
    title: 'Bundles & Sets',
    description: 'Curated stacks at a better price — the easy way to start.',
  },
} as const

export type CategorySlug = keyof typeof CATEGORY_META

export const CATEGORY_SLUGS = Object.keys(CATEGORY_META) as CategorySlug[]

/** The category treated as the store's hero; gets the extra comparison table. */
export const HERO_CATEGORY_SLUG: CategorySlug = 'protein'
/** Virtual slug used by search results; never a real category. */
export const SEARCH_CATEGORY_SLUG = 'search'

export function categoryTitle(slug: string): string {
  return (CATEGORY_META[slug as CategorySlug]?.title ?? slug)
}

export function categoryMeta(slug: string) {
  return CATEGORY_META[slug as CategorySlug]
}

/** Home-page mosaic. `big` spans 2×2, `wide` spans two columns. */
export type CategoryTile = {
  slug: CategorySlug
  label: string
  sub?: string
  image: string
  big?: boolean
  wide?: boolean
}

export const CATEGORY_TILES: readonly CategoryTile[] = [
  {
    slug: 'protein',
    label: 'Protein',
    sub: 'Whey · Isolate · Vegan',
    image: '/images/products/designer-whey.png',
    big: true,
  },
  {
    slug: 'pre-workout',
    label: 'Pre-Workout',
    image: '/images/products/ultra-booster.png',
  },
  {
    slug: 'creatine',
    label: 'Creatine',
    image: '/images/products/creatine.png',
  },
  {
    slug: 'amino',
    label: 'Amino Acids',
    image: '/images/products/eaa.png',
  },
  {
    slug: 'vitamins',
    label: 'Vitamins',
    image: '/images/products/zma.png',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    image: '/images/products/shaker.png',
    wide: true,
  },
  {
    slug: 'bundles',
    label: 'Bundles',
    image: '/images/products/starter-bundle.png',
    wide: true,
  },
]

/** Protein-only client-side filter chips. */
export const PROTEIN_TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'whey', label: 'Whey' },
  { value: 'isolate', label: 'Isolate' },
  { value: 'vegan', label: 'Vegan' },
] as const

export type ProteinTypeFilter = (typeof PROTEIN_TYPE_FILTERS)[number]['value']

/** Protein-only spec comparison shown above the grid. */
export const PROTEIN_COMPARISON = {
  columns: [
    { slug: 'esn-designer-whey', name: 'Designer Whey' },
    { slug: 'esn-isoclear', name: 'Isoclear' },
    { slug: 'esn-vegan-protein', name: 'Vegan Protein' },
  ],
  rows: [
    { label: 'Protein per 100 g', values: ['76 g', '82 g', '68 g'], emphasis: false },
    {
      label: 'Texture',
      values: ['Creamy shake', 'Crystal-clear drink', 'Smooth & creamy'],
      emphasis: false,
    },
    { label: 'Lactose-free', values: ['No', 'Yes', 'Yes'], emphasis: false },
    {
      label: 'Best for',
      values: ['Taste & everyday', 'Cutting & summer', 'Plant-based diets'],
      emphasis: false,
    },
    { label: 'From', values: ['€29.90', '€34.90', '€32.90'], emphasis: true },
  ],
  sampleBoxSlug: 'whey-sample-box',
} as const
