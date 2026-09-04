'use client';

import React from 'react';
import ProductDetailPage from '../../../components/products/ProductDetailPage';

export default function ProductDetailPageClient({
  product,
}: {
  product: any
}) {
  return (
    <ProductDetailPage
      productId={product.id}
      products={[product]}
      themeColor="blue"
      getThemeClasses={() => ({
        bg: 'bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-600',
        lightBg: 'bg-blue-50',
        shadow: 'shadow-blue-500/20',
      })}
      wishlist={[]}
      handleToggleWishlist={() => {}}
      handleAddToCart={() => {}}
      onBuyNow={() => {}}
      onBack={() => history.back()}
      onSelectProduct={() => {}}
      currentUser={null}
      onOpenAuth={() => {}}
    />
  )
}
