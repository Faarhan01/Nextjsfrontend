'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { CartItem, ProductsSettings, UserProfile } from '@/types';
import { formatCurrency, parsePriceNumber } from '@/utils/pricing';
import { SafeImage } from '@modules/common/components/safe-image';
import { useCartContext } from '@/providers/cart-provider';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { RecentlyViewedSection } from '@/components/shared';
import { getProductUrl } from '@/utils/seoUtils';

interface CartPageProps {
  cart?: CartItem[];
  onAdjustQuantity?: (id: string, delta: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onClearCart?: () => void;
  onNavigate?: (page: string, params?: any) => void;
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses?: (color: string) => any;
  showToast?: (msg: string) => void;
  productsSettings?: ProductsSettings;
  currentUser?: UserProfile;
  freeShippingThreshold?: number;
  onOpenAuthModal?: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart: propCart,
  onAdjustQuantity: propOnAdjustQuantity,
  onRemoveFromCart: propOnRemoveFromCart,
  onClearCart: propOnClearCart,
  onNavigate: propOnNavigate,
  themeColor: propThemeColor,
  getThemeClasses: propGetThemeClasses,
  showToast: propShowToast,
  productsSettings: propProductsSettings,
  currentUser: propCurrentUser,
  freeShippingThreshold: propFreeShippingThreshold,
  onOpenAuthModal: propOnOpenAuthModal,
}) => {
  const router = useRouter();
  const cartCtx = useCartContext();
  const themeCtx = useThemeContext();
  const toastCtx = useToastContext();
  const authCtx = useAuthContext();
  const catalogCtx = useCatalog();

  const cart = propCart ?? cartCtx.cart;
  const onAdjustQuantity = propOnAdjustQuantity ?? cartCtx.adjustQuantity;
  const onRemoveFromCart = propOnRemoveFromCart ?? cartCtx.removeFromCart;
  const onClearCart = propOnClearCart ?? cartCtx.clearCart;
  const themeColor = propThemeColor ?? themeCtx.themeColor;
  const getThemeClasses = propGetThemeClasses ?? defaultGetThemeClasses;
  const showToast = propShowToast ?? toastCtx.showToast;
  const productsSettings = propProductsSettings ?? catalogCtx.productsSettings;
  const currentUser = propCurrentUser ?? authCtx.currentUser ?? undefined;
  const freeShippingThreshold = propFreeShippingThreshold ?? themeCtx.freeShippingThreshold;
  const onOpenAuthModal = propOnOpenAuthModal ?? (() => authCtx.setAuthModalOpen(true));

  const onNavigate = (page: string, params?: any) => {
    if (propOnNavigate) {
      propOnNavigate(page, params);
      return;
    }
    if (page === 'home' || page === '') router.push('/');
    else if (page === 'shop' || page === 'products') router.push('/shop');
    else if (page === 'checkout') router.push('/checkout');
    else if (page === 'product-detail' && params?.id) router.push(getProductUrl(params.id, params.name));
    else router.push(page.startsWith('/') ? page : `/${page}`);
  };
  const currentTheme = getThemeClasses(themeColor);

  const subtotal = cart.reduce((acc, item) => {
    const p = typeof item.price === 'number' ? item.price : parsePriceNumber(String(item.price));
    return acc + p * item.quantity;
  }, 0);

  const shippingThreshold = freeShippingThreshold || 500;
  const shipping = subtotal >= shippingThreshold || cart.length === 0 ? 0 : 75;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Your Cart is Currently Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Explore our store and add wholesale or retail items to your cart.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {catalogCtx.products.length > 0 && (
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <RecentlyViewedSection
              products={catalogCtx.products}
              title="Pick Up Where You Left Off"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
      <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">{cart.length} item{cart.length > 1 ? 's' : ''} in your cart</p>
        </div>
        <button
          onClick={onClearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 transition flex items-center gap-1 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
        >
          <Trash2 className="w-3 h-3" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.map((item) => {
            const unitPrice = typeof item.price === 'number' ? item.price : parsePriceNumber(String(item.price));
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="card-base p-3.5 sm:p-5 hover:border-card hover:shadow-sm transition"
              >
                {/* Top Section */}
                <div className="flex gap-3 sm:gap-4 items-start sm:items-center">
                  <div 
                    onClick={() => onNavigate('product-detail', { id: item.id, name: item.name })}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 cursor-pointer border border-slate-100 dark:border-slate-700 hover:opacity-90 transition"
                  >
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 
                        onClick={() => onNavigate('product-detail', { id: item.id, name: item.name })}
                        className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 sm:truncate cursor-pointer hover:text-blue-600 transition"
                      >
                        {item.name}
                      </h3>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="p-1.5 -mr-1 text-slate-400 hover:text-rose-600 transition shrink-0 sm:hidden cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.sellerName && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                        <span>Sold & Fulfilled by:</span>
                        <button
                          onClick={() => {
                            if (item.sellerId) {
                              onNavigate(`store/${item.sellerId}`);
                            }
                          }}
                          className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          {item.sellerName}
                        </button>
                        {item.condition && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                            {item.condition}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(unitPrice)} <span className="text-[10px] text-slate-400 font-normal">/ unit</span>
                    </div>
                  </div>

                  {/* Desktop Controls & Total */}
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <button
                        onClick={() => onAdjustQuantity(item.id, -1)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => onAdjustQuantity(item.id, 1)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(itemTotal)}</span>
                    </div>

                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile Controls & Total Row */}
                <div className="flex sm:hidden items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => onAdjustQuantity(item.id, -1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:bg-slate-300 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3.5 text-xs font-black text-slate-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => onAdjustQuantity(item.id, 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:bg-slate-300 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 mr-1.5">Total:</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(itemTotal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="order-summary-surface space-y-5 sm:space-y-6 h-fit">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/80 pb-3">Order Summary</h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Shipping</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            {shipping === 0 && (
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50 p-2.5 rounded-xl font-medium flex items-center gap-1.5">
                <Tag className="w-3 h-3 shrink-0" /> Free Shipping unlocked on orders over {formatCurrency(shippingThreshold)}!
              </div>
            )}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex justify-between text-sm font-black text-slate-900 dark:text-white">
              <span>Total Amount</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>256-bit SSL encrypted checkout</span>
          </div>
        </div>
      </div>

      {catalogCtx.products.length > 0 && (
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800">
          <RecentlyViewedSection
            products={catalogCtx.products}
            title="Recently Viewed Items"
          />
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:hidden bg-white/95 dark:bg-slate-850/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700/80 z-30 shadow-lg flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
          <p className="text-base font-black text-slate-900 dark:text-white">{formatCurrency(total)}</p>
        </div>
        <button
          onClick={() => onNavigate('checkout')}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <span>Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartPage;
