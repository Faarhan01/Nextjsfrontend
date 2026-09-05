'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import WishlistPage from '../../components/products/WishlistPage';
import { getProductUrl } from '../../utils/seoUtils';

export default function WishlistPageClient() {
  const router = useRouter();
  const {
    wishlist,
    products,
    handleToggleWishlist,
    handleAddToCart,
    themeColor,
    getThemeClasses,
    showToast,
    handleOpenQuickView,
    customWishlists,
    onToggleProductInLists,
    onCreateWishlist,
    onDeleteWishlist,
    onRenameWishlist,
    onResetDefaultWishlists
  } = useStore();

  return (
    <div className="w-full">
      <WishlistPage
        wishlist={wishlist}
        products={products}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onNavigate={(page, params) => {
          if (page === 'home') router.push('/');
          else if (page === 'shop') router.push('/shop');
          else if (page === 'product-detail' && params) router.push(getProductUrl(params));
          else router.push(`/${page}`);
        }}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        showToast={(msg) => showToast(msg)}
        onQuickView={handleOpenQuickView}
        customWishlists={customWishlists}
        onToggleProductInLists={onToggleProductInLists}
        onCreateWishlist={onCreateWishlist}
        onDeleteWishlist={onDeleteWishlist}
        onRenameWishlist={onRenameWishlist}
        onResetDefaultWishlists={onResetDefaultWishlists}
      />
    </div>
  );
}
