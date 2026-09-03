'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import MyAccountPage from '../../components/account/MyAccountPage';

export default function AccountRoute() {
  const router = useRouter();
  const {
    themeColor,
    getThemeClasses,
    wishlist,
    products,
    handleToggleWishlist,
    handleAddToCart,
    showToast,
    currentUser,
    handleSignOut,
    setAuthModalOpen,
    customWishlists,
    onCreateWishlist,
    onDeleteWishlist,
    onRenameWishlist,
    onToggleProductInLists,
    onResetDefaultWishlists
  } = useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="w-full">
      <MyAccountPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        wishlist={wishlist}
        wishlistProducts={wishlistProducts}
        handleToggleWishlist={handleToggleWishlist}
        handleAddToCart={handleAddToCart}
        showToast={(msg) => showToast(msg)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
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
        onCreateWishlist={onCreateWishlist}
        onDeleteWishlist={onDeleteWishlist}
        onRenameWishlist={onRenameWishlist}
        onToggleProductInLists={onToggleProductInLists}
        onResetDefaultWishlists={onResetDefaultWishlists}
        allProducts={products}
      />
    </div>
  );
}
