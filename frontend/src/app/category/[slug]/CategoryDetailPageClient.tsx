'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import CategoryDetailPage from '../../../components/products/CategoryDetailPage';
import { getProductUrl, getCategoryUrl, formatCategoryName } from '../../../utils/seoUtils';

interface CategoryDetailPageClientProps {
  initialSlug?: string;
}

export default function CategoryDetailPageClient({ initialSlug }: CategoryDetailPageClientProps) {
  const router = useRouter();
  const params = useParams();
  const rawSlug = initialSlug || (params?.slug as string) || 'all';
  
  const {
    products,
    categories,
    themeColor,
    getThemeClasses,
    wishlist,
    handleToggleWishlist,
    handleAddToCart,
    handleOpenQuickView
  } = useStore();

  // Find matching category name cleanly
  const resolvedCategoryName = React.useMemo(() => {
    return formatCategoryName(rawSlug, categories);
  }, [rawSlug, categories]);

  return (
    <div className="w-full">
      <CategoryDetailPage
        categoryName={resolvedCategoryName}
        categories={categories}
        products={products}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        wishlist={wishlist}
        handleToggleWishlist={handleToggleWishlist}
        handleAddToCart={handleAddToCart}
        onBack={() => router.push('/categories')}
        onSelectProduct={(id) => router.push(getProductUrl(id))}
        onQuickView={handleOpenQuickView}
        onSelectCategory={(cat) => {
          if (cat.toLowerCase() === 'all') {
            router.push('/shop');
          } else {
            router.push(getCategoryUrl(cat));
          }
        }}
      />
    </div>
  );
}
