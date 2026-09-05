'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { StorefrontView } from '@modules/seller/templates/storefront-view';
import { getProductUrl } from '../../../utils/seoUtils';
import { Store } from 'lucide-react';

interface StorefrontPageClientProps {
  initialSellerId?: string;
}

export default function StorefrontPageClient({ initialSellerId }: StorefrontPageClientProps) {
  const params = useParams();
  const router = useRouter();
  const rawSellerId = initialSellerId || (params?.sellerId as string);

  const {
    sellerAccounts,
    products,
    wishlist,
    handleToggleWishlist,
    handleAddToCart,
    handleOpenQuickView,
    themeColor
  } = useStore();

  const currentSeller = React.useMemo(() => {
    if (!rawSellerId) return sellerAccounts[0];
    const match = sellerAccounts.find(
      (s) => s.id.toLowerCase() === rawSellerId.toLowerCase() || s.storeName.toLowerCase().replace(/\s+/g, '-') === rawSellerId.toLowerCase()
    );
    return match || sellerAccounts[0];
  }, [rawSellerId, sellerAccounts]);

  if (!currentSeller) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-md space-y-4">
          <Store className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Storefront Not Found</h2>
          <p className="text-xs text-slate-500">The requested merchant store could not be located in our verified directory.</p>
          <button
            onClick={() => router.push('/shop')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <StorefrontView
      seller={currentSeller}
      allSellers={sellerAccounts}
      products={products}
      wishlist={wishlist}
      onToggleWishlist={handleToggleWishlist}
      onAddToCart={(product, qty, offer) => {
        handleAddToCart(product, qty || 1, offer);
      }}
      onSelectProduct={(id) => {
        router.push(getProductUrl(id));
      }}
      onQuickView={handleOpenQuickView}
      themeColor={themeColor}
    />
  );
}
