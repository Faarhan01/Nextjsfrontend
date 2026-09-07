'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useThemeContext } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import WishlistPage from '@modules/products/templates/wishlist-page';
import { getProductUrl } from '@/utils/seoUtils';

export default function WishlistPageClient() {
  const router = useRouter();
  const { wishlist, customWishlists, toggleWishlist, toggleProductInLists, createWishlist, deleteWishlist, renameWishlist, resetDefaultWishlists } = useWishlistContext();
  const { products } = useCatalog();
  const { addToCart } = useCartContext();
  const { themeColor } = useThemeContext();
  const { showToast } = useToastContext();
  const { openQuickView } = useUI();

  return (
    <div className="w-full">
      <WishlistPage
        wishlist={wishlist}
        products={products}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onNavigate={(page, params) => {
          if (page === 'home') router.push('/');
          else if (page === 'shop') router.push('/shop');
          else if (page === 'product-detail' && params) router.push(getProductUrl(params));
          else router.push(`/${page}`);
        }}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        showToast={(msg) => showToast(msg)}
        onQuickView={openQuickView}
        customWishlists={customWishlists}
        onToggleProductInLists={toggleProductInLists}
        onCreateWishlist={createWishlist}
        onDeleteWishlist={deleteWishlist}
        onRenameWishlist={renameWishlist}
        onResetDefaultWishlists={resetDefaultWishlists}
      />
    </div>
  );
}
