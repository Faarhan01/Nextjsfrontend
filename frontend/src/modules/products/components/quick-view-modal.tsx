'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { getProductSaleDetails } from '@/utils/productUtils';
import { formatCurrency } from '@/utils/pricing';
import { X, Heart, Plus, Minus, ShoppingBag, Star, Check, ArrowRight, Eye, ShieldCheck, Truck, Building2 } from 'lucide-react';
import { MockProduct } from '@/types';

interface QuickViewModalProps {
  product: MockProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: MockProduct, qty?: number) => void;
  onToggleWishlist: (productId: string, productName: string) => void;
  isWishlisted: boolean;
  onViewFullDetails: (productId: string) => void;
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses: (color: string) => any;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onViewFullDetails,
  themeColor,
  getThemeClasses
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Default');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const currentTheme = getThemeClasses(themeColor);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const colors = ['Default', 'Space Gray', 'Pure White', 'Matte Black'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden z-10 my-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              title="Close Quick View"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image Area */}
              <div className="relative aspect-square md:aspect-auto w-full bg-slate-50/50 dark:bg-slate-800/80 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700/80">
                <SafeImage
                  src={product.imageUrl}
                  alt={product.name}
                  placeholderType="product"
                  fallbackTitle={product.name}
                  className="w-full h-full object-cover rounded-2xl max-h-[380px] shadow-xs bg-slate-50 dark:bg-slate-700/60"
                />
                
                {/* Wishlist Floating Toggle */}
                <button
                  onClick={() => onToggleWishlist(product.id, product.name)}
                  className={`absolute top-4 left-4 w-11 h-11 rounded-full bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 shadow-md transition cursor-pointer flex items-center justify-center shrink-0 ${
                    isWishlisted ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500 hover:text-rose-500'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Product Information & Controls */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {product.name}
                  </h2>

                  {/* Rating & Stock Badge */}
                  <div className="flex items-center justify-between gap-2 mt-2.5 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9 Rating</span>
                      </div>
                      <StockBadge product={product} size="md" />
                    </div>
                  </div>

                  {/* Brand Name as normal text */}
                  {product.brand && (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                      <span>Brand:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{product.brand}</span>
                    </div>
                  )}

                  {/* Price */}
                  {(() => {
                    const sale = getProductSaleDetails(product);
                    const wholesaleDisplay = product.wholesalePrice || product.price;
                    const retailDisplay = product.retailMarkupPrice || product.retailPrice;

                    return (
                      <div className="mt-3 space-y-1">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(wholesaleDisplay)}</span>
                          <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                            Wholesale Price
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium">{formatCurrency(product.originalPrice)}</span>
                          )}
                          {sale.isSale && (
                            <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                              {sale.badgeText}
                            </span>
                          )}
                        </div>

                        {retailDisplay && retailDisplay !== wholesaleDisplay && (
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Retail Price: <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(retailDisplay)}</span> (Min. {product.minWholesaleQuantity || 6} pieces for wholesale rate)
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {product.description || 'Crafted with premium materials, high-precision construction, and engineered durability designed to fit seamlessly into modern lifestyle spaces.'}
                  </p>

                  {/* Color selector */}
                  <div className="mt-5 space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Color Variant: <span className="text-slate-900 dark:text-white font-extrabold">{selectedColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            selectedColor === c
                              ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="mt-5 space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Quantity</label>
                    <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-xs font-extrabold text-slate-900 dark:text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAdd}
                      className={`py-3 px-7 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                        addedAnimation ? 'bg-emerald-600' : currentTheme.bg
                      }`}
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-4 h-4" /> Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onViewFullDetails(product.id);
                    }}
                    className="w-full text-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1 transition py-1 cursor-pointer"
                  >
                    View Full Product Details <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
