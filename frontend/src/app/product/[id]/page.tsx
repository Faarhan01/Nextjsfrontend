import { MOCK_WOO_PRODUCTS } from '../../../data/presets'
import ProductDetailPageClient from './ProductDetailPageClient'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = MOCK_WOO_PRODUCTS.find(p => p.id === id || p.id === `prod-${id}` || (p as any).slug === id) || MOCK_WOO_PRODUCTS[0]

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <p className="text-slate-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return <ProductDetailPageClient product={product} />
}

