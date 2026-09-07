'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useThemeContext } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import { StoreHeader } from '@modules/layout/components/store-header';
import { StoreFooter } from '@modules/layout/components/store-footer';
import { CartDrawer } from '@modules/cart/components/cart-drawer';
import QuickViewModal from '@modules/products/components/quick-view-modal';
import AuthModal from '@modules/account/components/auth-modal';
import AiConciergeModal from '@modules/ai/components/ai-concierge-modal';
import NextjsExporterModal from '@components/admin/NextjsExporterModal';
import SEOInspectorModal from '@components/admin/SEOInspectorModal';
import { ToastContainer } from '@modules/common/components/toast';
import { Sparkles } from 'lucide-react';
import { getProductUrl } from '@/utils/seoUtils';

export const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { themeColor, logoText } = useThemeContext();
  const { toasts, handleDismissToast } = useToastContext();
  const { authModalOpen, setAuthModalOpen, quickViewOpen, setQuickViewOpen, quickViewProduct, aiConciergeOpen, setAiConciergeOpen, nextjsModalOpen, setNextjsModalOpen, seoModalOpen, setSeoModalOpen, setEditorOpen } = useUI();
  const { currentUser, signIn } = useAuthContext();
  const { cart, addToCart } = useCartContext();
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { products } = useCatalog();
  const currentTheme = getThemeClasses(themeColor);

  const isAdminPage = pathname.startsWith('/admin');

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 flex flex-col font-sans relative overflow-x-clip">
      {/* Dynamic Scoped Styles */}
      <style>{`
        ::selection {
          background-color: ${currentTheme.primaryHex};
          color: #ffffff;
        }
        ::-moz-selection {
          background-color: ${currentTheme.primaryHex};
          color: #ffffff;
        }
      `}</style>

      {/* Header */}
      <StoreHeader />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">{children}</main>

      {/* Footer */}
      <StoreFooter />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={quickViewProduct}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onViewFullDetails={(productId) => {
          setQuickViewOpen(false);
          router.push(getProductUrl(productId));
        }}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignIn={signIn}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        showToast={() => {}}
      />

      {/* AI Concierge Modal */}
      <AiConciergeModal
        isOpen={aiConciergeOpen}
        onClose={() => setAiConciergeOpen(false)}
        catalogProducts={products}
        cartItems={cart}
        onSelectProduct={(prod) => {
          router.push(getProductUrl(prod.id, prod.name));
        }}
        onAddToCart={(prod) => {
          addToCart({ id: prod.id, name: prod.name, price: prod.price, imageUrl: prod.imageUrl });
        }}
        currentThemeBg={currentTheme.bg}
      />

      {/* Next.js Exporter Modal */}
      <NextjsExporterModal
        isOpen={nextjsModalOpen}
        onClose={() => setNextjsModalOpen(false)}
        showToast={() => {}}
        storeName={logoText}
      />

      {/* SEO Inspector Modal */}
      <SEOInspectorModal
        isOpen={seoModalOpen}
        onClose={() => setSeoModalOpen(false)}
        showToast={() => {}}
        storeName={logoText}
      />

      {/* Interactive Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Floating AI Concierge Trigger Button */}
      {!isAdminPage && (
        <button
          onClick={() => setAiConciergeOpen(true)}
          className={`fixed bottom-5 right-5 z-40 p-3 sm:px-4 sm:py-3 rounded-full ${currentTheme.bg} text-white shadow-xl ${currentTheme.shadow} hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/20`}
          title="Open AI Shopping Concierge"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline font-bold text-xs">AI Concierge</span>
        </button>
      )}
    </div>
  );
};
