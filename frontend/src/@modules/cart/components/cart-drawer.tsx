'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Truck, Trash2, ArrowRight } from 'lucide-react';
import { useCartContext } from '@/providers/cart-provider';
import { useThemeContext } from '@/providers/theme-provider';
import { useUI } from '@/providers/ui-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { useToastContext } from '@/providers/toast-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import { SafeImage } from '@modules/common/components/safe-image';
import { formatCurrency, getCartItemUnitPrice } from '@/utils/pricing';
import { getProductUrl } from '@/utils/seoUtils';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { cart, cartCount, cartSubtotal, adjustQuantity, removeFromCart, clearCart } = useCartContext();
  const { themeColor, freeShippingThreshold } = useThemeContext();
  const { cartOpen, setCartOpen } = useUI();
  const { products, productsSettings } = useCatalog();
  const { showToast } = useToastContext();
  const currentTheme = getThemeClasses(themeColor);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 pointer-events-auto"
            onClick={() => setCartOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
          />

          <motion.div
            initial={{ x: '100%', opacity: 0.95 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md drawer-surface border-l border-card shadow-2xl z-50 flex flex-col justify-between"
          >
            {/* Cart Drawer Header */}
            <div className="px-5 py-3.5 border-b border-card flex items-center justify-between bg-card shrink-0">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${currentTheme.lightBg} ${currentTheme.text} dark:bg-slate-800`}>
                  <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                    <span>Shopping Cart</span>
                    {cartCount > 0 && (
                      <span className={`px-2 py-0.5 rounded-full ${currentTheme.badge} text-white text-[10px] font-black`}>
                        {cartCount}
                      </span>
                    )}
                  </h2>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">Quick order review</p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Slim Bar */}
            {cart.length > 0 && (
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border-b border-emerald-100/80 dark:border-emerald-900/40 px-5 py-2 flex items-center justify-between gap-3 shrink-0 text-xs">
                <div className="flex items-center gap-1.5 min-w-0 font-semibold text-emerald-900 dark:text-emerald-300">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  {cartSubtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] truncate">🎉 Free Shipping Unlocked!</span>
                  ) : (
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 truncate">
                      Add <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{formatCurrency(freeShippingThreshold - cartSubtotal)}</strong> for <strong className="text-emerald-600 dark:text-emerald-400 font-bold">FREE Shipping</strong>
                    </span>
                  )}
                </div>
                <div className="w-20 bg-emerald-200/70 dark:bg-emerald-900/60 rounded-full h-1.5 overflow-hidden shrink-0">
                  <div
                    className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center select-none">
                  <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-3">
                    <ShoppingCart className="w-7 h-7" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Your shopping cart is empty</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mt-1 leading-normal">Browse our catalog to discover premium wholesale & retail products!</p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push('/shop');
                    }}
                    className="mt-3 px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const catalogProd = products.find((p) => p.id === item.id);
                  const unitPrice = getCartItemUnitPrice(item, catalogProd, productsSettings);
                  const minWholesaleQty =
                    item.minWholesaleQuantity ||
                    catalogProd?.minWholesaleQuantity ||
                    productsSettings?.minWholesaleQuantity ||
                    6;
                  const isWholesaleActive = item.quantity >= minWholesaleQty;
                  const productLink = getProductUrl(item.id, item.name);

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 p-2.5 border border-slate-200/70 dark:border-slate-700 rounded-xl relative group transition"
                    >
                      <Link
                        href={productLink}
                        onClick={() => setCartOpen(false)}
                        className="shrink-0 hover:opacity-90 transition"
                      >
                        <SafeImage
                          src={item.imageUrl}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                          alt={item.name}
                          placeholderType="product"
                          fallbackTitle={item.name}
                        />
                      </Link>

                      <div className="flex-1 min-w-0 pr-5">
                        <Link
                          href={productLink}
                          onClick={() => setCartOpen(false)}
                          className="block hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-snug">{item.name}</h4>
                        </Link>

                        {item.sellerName && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                            <span>Sold by:</span>
                            {item.sellerId ? (
                              <Link
                                href={`/store/${item.sellerId}`}
                                onClick={() => setCartOpen(false)}
                                className="font-bold text-blue-600 dark:text-blue-400 hover:underline truncate"
                              >
                                {item.sellerName}
                              </Link>
                            ) : (
                              <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{item.sellerName}</span>
                            )}
                            {item.condition && (
                              <span className="px-1 py-0.2 rounded bg-slate-200/70 dark:bg-slate-700 text-[9px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                {item.condition}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {formatCurrency(unitPrice * item.quantity)}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">({formatCurrency(unitPrice)} ea)</span>
                          {isWholesaleActive && (
                            <span className="text-[8px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-1 py-0.2 rounded border border-blue-200 dark:border-blue-800 uppercase">
                              Wholesale
                            </span>
                          )}
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-2 mt-1.5">
                          <button
                            onClick={() => adjustQuantity(item.id, -1)}
                            className="w-5.5 h-5.5 rounded-md bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold transition select-none active:scale-95 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => adjustQuantity(item.id, 1)}
                            className="w-5.5 h-5.5 rounded-md bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold transition select-none active:scale-95 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute right-2.5 top-2.5 p-1 text-slate-300 dark:text-slate-500 hover:text-rose-500 rounded-md hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Compact Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-200/80 dark:border-slate-700/80 px-5 py-3.5 bg-slate-50 dark:bg-slate-800/90 shrink-0 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold">Subtotal</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">{formatCurrency(cartSubtotal)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      router.push('/cart');
                    }}
                    className="w-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer text-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    <span>View Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      if (cart.length === 0) {
                        showToast('Your cart is empty. Add items to checkout!', 'error');
                        return;
                      }
                      setCartOpen(false);
                      router.push('/checkout');
                    }}
                    className={`w-full ${currentTheme.bg} hover:opacity-95 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md ${currentTheme.shadow} active:scale-95 transition cursor-pointer text-xs`}
                  >
                    <span>Checkout &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
