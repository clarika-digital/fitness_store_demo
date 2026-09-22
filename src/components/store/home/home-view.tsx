'use client'

import { Hero } from './hero'
import { TrustStrip } from './trust-strip'
import { CategoryTiles } from './category-tiles'
import { Bestsellers } from './bestsellers'
import { BundleBanner } from './bundle-banner'
import { BrandStrip } from './brand-strip'
import { ReviewsSection } from './reviews-section'
import { Newsletter } from './newsletter'

export function HomeView() {
  return (
    <div>
      <Hero />
      <TrustStrip />
      <CategoryTiles />
      <Bestsellers />
      <BundleBanner />
      <BrandStrip />
      <ReviewsSection />
      <Newsletter />
    </div>
  )
}
