'use client';

import React, { Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import ProductDetailPage from '../../../components/products/ProductDetailPage';
import { getProductUrl } from '../../../utils/seoUtils';
import ProductLoading from './loading';

function ProductDetailContent() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id as string;
  
  const {
    products,
    themeColor,
    getThemeClasses,
    wishlist,
    handleToggleWishlist,
    handleAddToCart,
    setAuthModalOpen,
    currentUser
  } = useStore();

  // Handle URL slug ID format (e.g. "1-audiophile-over-ear-headphones" -> "1" or exact "prod-1")
  const resolvedProductId = React.useMemo(() => {
    if (!rawId) return products[0]?.id || '1';
    
    // Exact match
    const exactMatch = products.find((p) => p.id === rawId || (p as any).slug === rawId);
    if (exactMatch) return exactMatch.id;

    // Split slug by first dash if numeric ID prefix
    const firstDashIndex = rawId.indexOf('-');
    if (firstDashIndex !== -1) {
      const prefix = rawId.substring(0, firstDashIndex);
      const prefixMatch = products.find((p) => p.id === prefix);
      if (prefixMatch) return prefixMatch.id;
    }

    return rawId;
  }, [rawId, products]);

  return (
    <div className="w-full">
      <ProductDetailPage
        productId={resolvedProductId}
        products={products}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        wishlist={wishlist}
        handleToggleWishlist={handleToggleWishlist}
        handleAddToCart={handleAddToCart}
        onBuyNow={() => {
          router.push('/checkout');
        }}
        onBack={() => router.back()}
        onSelectProduct={(id) => router.push(getProductUrl(id))}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />
    </div>
  );
}

export default function ProductRoute() {
  return <ProductDetailContent />;
}
