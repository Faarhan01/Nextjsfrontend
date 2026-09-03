'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';
import { NotFoundPage } from '../components/pages/NotFoundPage';
import { getProductUrl, getCategoryUrl } from '../utils/seoUtils';

export default function NotFound() {
  const router = useRouter();
  const {
    themeColor,
    getThemeClasses,
    products,
    categories,
    wishlist,
    handleToggleWishlist,
    handleAddToCart,
    handleOpenQuickView,
    logoText
  } = useStore();

  const handleNavigate = (page: string, params?: any) => {
    if (page === 'home') {
      router.push('/');
    } else if (page === 'shop') {
      router.push('/shop');
    } else if (page === 'categories') {
      router.push('/categories');
    } else if (page === 'category-detail' && params?.name) {
      router.push(getCategoryUrl(params.name));
    } else if (page === 'product-detail' && params?.id) {
      router.push(getProductUrl(params.id));
    } else if (page === 'search-results' && params?.q) {
      router.push(`/search?q=${encodeURIComponent(params.q)}`);
    } else if (page === 'order-tracking') {
      router.push('/order-tracking');
    } else if (page === 'faq') {
      router.push('/faq');
    } else if (page === 'contact') {
      router.push('/contact');
    } else if (page === 'wishlist') {
      router.push('/wishlist');
    } else if (page === 'cart') {
      router.push('/cart');
    } else if (page === 'checkout') {
      router.push('/checkout');
    } else if (page === 'about') {
      router.push('/about');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full">
      <NotFoundPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        onNavigate={handleNavigate}
        logoText={logoText || 'Mrbulk'}
        products={products}
        categories={categories}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={handleOpenQuickView}
      />
    </div>
  );
}
