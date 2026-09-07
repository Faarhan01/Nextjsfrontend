'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/providers/theme-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import MyAccountPage from '@modules/account/templates/my-account-page';

export default function AccountPageClient() {
  const router = useRouter();
  const { themeColor } = useThemeContext();
  const { wishlist, customWishlists, toggleWishlist, toggleProductInLists, createWishlist, deleteWishlist, renameWishlist, resetDefaultWishlists } = useWishlistContext();
  const { products } = useCatalog();
  const { addToCart } = useCartContext();
  const { showToast } = useToastContext();
  const { currentUser, signOut, setAuthModalOpen } = useAuthContext();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="w-full">
      <MyAccountPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        wishlist={wishlist}
        wishlistProducts={wishlistProducts}
        handleToggleWishlist={toggleWishlist}
        handleAddToCart={addToCart}
        showToast={(msg) => showToast(msg)}
        currentUser={currentUser}
        onSignOut={signOut}
        onOpenAuth={() => setAuthModalOpen(true)}
        onNavigate={(page) => {
          if (page === 'home') router.push('/');
          else if (page === 'shop') router.push('/shop');
          else if (page === 'order-tracking') router.push('/order-tracking');
          else if (page === 'cart') router.push('/cart');
          else if (page === 'wishlist') router.push('/wishlist');
          else router.push(`/${page}`);
        }}
        customWishlists={customWishlists}
        onCreateWishlist={createWishlist}
        onDeleteWishlist={deleteWishlist}
        onRenameWishlist={renameWishlist}
        onToggleProductInLists={toggleProductInLists}
        onResetDefaultWishlists={resetDefaultWishlists}
        allProducts={products}
      />
    </div>
  );
}
