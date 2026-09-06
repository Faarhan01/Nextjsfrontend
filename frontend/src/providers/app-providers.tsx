'use client';

import React from 'react';
import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './toast-provider';
import { CartProvider } from './cart-provider';
import { WishlistProvider } from './wishlist-provider';
import { RecentlyViewedProvider } from './recently-viewed-provider';
import { AuthProvider } from './auth-provider';
import { CatalogProvider } from './catalog-provider';
import { UIProvider } from './ui-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <AuthProvider>
                <CatalogProvider>
                  <UIProvider>{children}</UIProvider>
                </CatalogProvider>
              </AuthProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}