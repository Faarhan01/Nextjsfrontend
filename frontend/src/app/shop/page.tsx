import { MOCK_WOO_PRODUCTS, MOCK_CATEGORIES } from '../../data/presets'
import ShopPageClient from './ShopPageClient'

export const dynamic = 'force-dynamic'

export default function ShopPage() {
  return <ShopPageClient products={MOCK_WOO_PRODUCTS} categories={MOCK_CATEGORIES} />
}

