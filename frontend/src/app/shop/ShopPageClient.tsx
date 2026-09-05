'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ShopPage from '../../components/products/ShopPage';
import { getProductUrl, formatCategoryName, decodeAndCleanText } from '../../utils/seoUtils';

export default function ShopPageClient({
  products,
  categories,
}: {
  products: any[]
  categories: any[]
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawCategoryParam = searchParams.get('category') || 'All';
  const rawBrandParam = searchParams.get('brand') || 'All';

  const categoryParam = React.useMemo(() => {
    return formatCategoryName(rawCategoryParam, categories);
  }, [rawCategoryParam, categories]);

  const brandParam = React.useMemo(() => {
    if (!rawBrandParam || rawBrandParam.toLowerCase() === 'all') return 'All';
    const cleaned = decodeAndCleanText(rawBrandParam);
    const matched = categories.find((b: any) => b.title?.toLowerCase() === cleaned.toLowerCase());
    return matched ? matched.title : cleaned;
  }, [rawBrandParam, categories]);

  return (
    <div className="w-full">
      <ShopPage
        themeColor="blue"
        getThemeClasses={() => ({
          bg: 'bg-blue-600',
          text: 'text-blue-600',
          border: 'border-blue-600',
          lightBg: 'bg-blue-50',
          shadow: 'shadow-blue-500/20',
        })}
        products={products}
        categories={categories}
        brands={[]}
        wishlist={[]}
        handleToggleWishlist={() => {}}
        handleAddToCart={() => {}}
        onQuickView={() => {}}
        initialCategoryFilter={categoryParam}
        initialBrandFilter={brandParam}
        onSelectProduct={(id) => router.push(getProductUrl(id))}
        onNavigate={(page) => router.push(page === 'home' ? '/' : `/${page}`)}
      />
    </div>
  );
}
