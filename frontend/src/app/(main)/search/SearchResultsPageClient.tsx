'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
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

  const {
    products,
    categories,
    wishlist,
    handleToggleWishlist,
    handleAddToCart,
    themeColor,
    getThemeClasses,
    handleOpenQuickView
  } = useStore();

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
        handleToggleWishlist={handleToggleWishlist}
        handleAddToCart={handleAddToCart}
        onSelectProduct={(id) => router.push(getProductUrl(id))}
        onSelectCategory={(catName) => router.push(getCategoryUrl(catName))}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        onQuickView={handleOpenQuickView}
        onBackToHome={() => router.push('/')}
      />
    </div>
  );
}
