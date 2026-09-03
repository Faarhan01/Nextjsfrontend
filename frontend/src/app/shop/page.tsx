'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import ShopPage from '../../components/products/ShopPage';
import { getProductUrl, formatCategoryName, decodeAndCleanText } from '../../utils/seoUtils';
import ShopLoading from './loading';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    themeColor,
    getThemeClasses,
    products,
    categories,
    brands,
    wishlist,
    handleToggleWishlist,
    handleAddToCart,
    handleOpenQuickView
  } = useStore();

  const rawCategoryParam = searchParams.get('category') || 'All';
  const rawBrandParam = searchParams.get('brand') || 'All';

  const categoryParam = React.useMemo(() => {
    return formatCategoryName(rawCategoryParam, categories);
  }, [rawCategoryParam, categories]);

  const brandParam = React.useMemo(() => {
    if (!rawBrandParam || rawBrandParam.toLowerCase() === 'all') return 'All';
    const cleaned = decodeAndCleanText(rawBrandParam);
    const matched = brands.find(b => b.name.toLowerCase() === cleaned.toLowerCase());
    return matched ? matched.name : cleaned;
  }, [rawBrandParam, brands]);

  return (
    <div className="w-full">
      <ShopPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        products={products}
        categories={categories}
        brands={brands}
        wishlist={wishlist}
        handleToggleWishlist={handleToggleWishlist}
        handleAddToCart={handleAddToCart}
        initialCategoryFilter={categoryParam}
        initialBrandFilter={brandParam}
        onSelectProduct={(id) => router.push(getProductUrl(id))}
        onQuickView={handleOpenQuickView}
        onNavigate={(page) => router.push(page === 'home' ? '/' : `/${page}`)}
      />
    </div>
  );
}

export default function ShopRoute() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  );
}
