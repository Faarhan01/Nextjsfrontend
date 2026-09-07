'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCatalog } from '@/providers/catalog-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useThemeContext } from '@/providers/theme-provider';
import { useUI } from '@/providers/ui-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import SearchResultsPage from '@modules/products/templates/search-results-page';
import { getProductUrl, getCategoryUrl } from '@/utils/seoUtils';

export default function SearchResultsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const { products, categories } = useCatalog();
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();
  const { themeColor } = useThemeContext();
  const { openQuickView } = useUI();

  return (
    <div className="w-full">
      <SearchResultsPage
        searchQuery={query}
        onSearchQueryChange={(newQ) => {
          setQuery(newQ);
          router.replace(`/search?q=${encodeURIComponent(newQ)}`);
        }}
        products={products}
        categories={categories}
        wishlist={wishlist}
        handleToggleWishlist={toggleWishlist}
        handleAddToCart={addToCart}
        onSelectProduct={(id) => router.push(getProductUrl(id))}
        onSelectCategory={(catName) => router.push(getCategoryUrl(catName))}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        onQuickView={openQuickView}
        onBackToHome={() => router.push('/')}
      />
    </div>
  );
}
