import { MOCK_CATEGORIES, MOCK_WOO_PRODUCTS } from '../../data/presets'
import CategoriesPageClient from './CategoriesPageClient'

export const dynamic = 'force-dynamic'

export default function CategoriesPage() {
  return (
    <CategoriesPageClient
      categories={MOCK_CATEGORIES}
      products={MOCK_WOO_PRODUCTS}
    />
  )
}

