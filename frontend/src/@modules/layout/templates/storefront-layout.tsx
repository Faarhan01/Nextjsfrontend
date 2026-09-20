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
import { Nav } from '@modules/layout/templates/nav';
import { Footer } from '@modules/layout/templates/footer';
import { CartDrawer } from '@modules/cart/components/cart-drawer';
import QuickViewModal from '@modules/products/components/quick-view-modal';
import AuthModal from '@modules/account/components/auth-modal';
import NextjsExporterModal from '@components/admin/NextjsExporterModal';
import SEOInspectorModal from '@components/admin/SEOInspectorModal';
import { ToastContainer } from '@modules/common/components/toast';
import { Download } from 'lucide-react';
import { getProductUrl } from '@/utils/seoUtils';
import { downloadHtmlTemplate } from '@/utils/htmlTemplateGenerator';

export const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { themeColor, logoText } = useThemeContext();
  const { toasts, handleDismissToast, showToast } = useToastContext();
  const { authModalOpen, setAuthModalOpen, quickViewOpen, setQuickViewOpen, quickViewProduct, nextjsModalOpen, setNextjsModalOpen, seoModalOpen, setSeoModalOpen, setEditorOpen } = useUI();
  const { currentUser, signIn, authModalOpen: authCtxModalOpen, setAuthModalOpen: setAuthCtxModalOpen } = useAuthContext();
  const { cart, addToCart } = useCartContext();
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { products, categories, slides } = useCatalog();
  const currentTheme = getThemeClasses(themeColor);

  const handleDownloadHtml = () => {
    showToast('Generating complete multi-page HTML website package...');
    try {
      downloadHtmlTemplate({
        storeName: logoText,
        themeColor,
        products,
        categories,
        slides,
      });
      showToast('Multi-page HTML website ZIP downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Failed to download website package.');
    }
  };

  const isAuthModalVisible = authModalOpen || authCtxModalOpen;
  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
    setAuthCtxModalOpen(false);
  };

  const isAdminPage = pathname ? pathname.startsWith('/admin') : false;

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

      {/* Header Navigation */}
      {!isAdminPage && <Nav />}

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">{children}</main>

      {/* Footer */}
      {!isAdminPage && <Footer />}

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
        isOpen={isAuthModalVisible}
        onClose={handleCloseAuthModal}
        onSignIn={signIn}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        showToast={showToast}
      />

      {/* Next.js Exporter Modal */}
      <NextjsExporterModal
        isOpen={nextjsModalOpen}
        onClose={() => setNextjsModalOpen(false)}
        showToast={showToast}
        storeName={logoText}
      />

      {/* SEO Inspector Modal */}
      <SEOInspectorModal
        isOpen={seoModalOpen}
        onClose={() => setSeoModalOpen(false)}
        showToast={showToast}
        storeName={logoText}
      />

      {/* Interactive Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Floating Download HTML Site Trigger Button */}
      {!isAdminPage && (
        <button
          onClick={handleDownloadHtml}
          className={`fixed bottom-5 right-5 z-40 p-3 sm:px-4 sm:py-3 rounded-full ${currentTheme.bg} text-white shadow-xl ${currentTheme.shadow} hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/20 group`}
          title="Download Multi-Page HTML Website (ZIP)"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="hidden sm:inline font-bold text-xs">Download Multi-Page Site</span>
        </button>
      )}
    </div>
  );
};
