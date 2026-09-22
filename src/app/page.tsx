'use client'

import { useEffect } from 'react'
import { useNavStore, viewKey } from '@/store/nav-store'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { CartDrawer } from '@/components/store/cart/cart-drawer'
import { HomeView } from '@/components/store/home/home-view'
import { BrandPage } from '@/components/store/home/brand-page'
import { CategoryView } from '@/components/store/shop/category-view'
import { ProductView } from '@/components/store/product/product-view'
import { CheckoutView } from '@/components/store/checkout/checkout-view'
import { OrderConfirmation } from '@/components/store/checkout/order-confirmation'
import { StaticPage } from '@/components/store/pages/static-page'

export default function Page() {
  const view = useNavStore((s) => s.view)
  const key = viewKey(view)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [key])

  let content: React.ReactNode = null
  switch (view.name) {
    case 'home':
      content = <HomeView />
      break
    case 'category':
      content = <CategoryView slug={view.slug} q={view.q} />
      break
    case 'product':
      content = <ProductView slug={view.slug} />
      break
    case 'checkout':
      content = <CheckoutView />
      break
    case 'confirmation':
      content = <OrderConfirmation orderNumber={view.orderNumber} />
      break
    case 'brand':
      content = <BrandPage slug={view.slug} />
      break
    case 'page':
      content = <StaticPage slug={view.slug} />
      break
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{content}</main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
