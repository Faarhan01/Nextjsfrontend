'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCatalog } from '@/providers/catalog-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useThemeContext } from '@/providers/theme-provider';
import { useUI } from '@/providers/ui-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import CategoryDetailPage from '@modules/products/templates/category-detail-page';
import { getProductUrl, getCategoryUrl, formatCategoryName } from '@/utils/seoUtils';

interface CategoryDetailPageClientProps {
  initialSlug?: string;
}

export default function CategoryDetailPageClient({ initialSlug }: CategoryDetailPageClientProps) {
  const router = useRouter();
  const params = useParams();
  const rawSlug = initialSlug || (params?.slug as string) || 'all';
  
  const { products, categories } = useCatalog();
  const { themeColor } = useThemeContext();
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();
  const { openQuickView } = useUI();

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
        handleToggleWishlist={toggleWishlist}
        handleAddToCart={addToCart}
        onBack={() => router.push('/categories')}
        onSelectProduct={(id) => router.push(getProductUrl(id))}
        onQuickView={openQuickView}
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
