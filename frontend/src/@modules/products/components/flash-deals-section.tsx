'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingCart, Heart, Eye, Sparkles, Tag, Check } from 'lucide-react';
import { MockProduct } from '@/types';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { formatCurrency } from '@/utils/pricing';

interface FlashDealsSectionProps {
  products: MockProduct[];
  themeColor?: string;
  getThemeClasses: (color?: string) => {
    bg: string;
    text: string;
    lightBg: string;
    border: string;
    badge: string;
    shadow: string;
  };
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: MockProduct) => void;
  onSelectProduct: (productId: string) => void;
  onQuickView: (product: MockProduct) => void;
}

export const FlashDealsSection: React.FC<FlashDealsSectionProps> = ({
  products,
  themeColor,
  getThemeClasses,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onQuickView
}) => {
  const currentTheme = getThemeClasses(themeColor);

  // Live ticking countdown timer state (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Pick top 2 items for flash sale (or sale products)
  const flashProducts = products.filter(p => p.isSale || p.originalPrice).slice(0, 2);
  const displayProducts = flashProducts.length > 0 ? flashProducts : products.slice(0, 2);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50/50 dark:bg-slate-800/90 border border-rose-200/80 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-slate-900 dark:text-white relative overflow-hidden shadow-sm dark:shadow-xl">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Section Header with Countdown Timer */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-200/70 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                <Flame className="w-3 h-3 fill-rose-600 text-rose-600 dark:fill-rose-500 dark:text-rose-500" />
                Limited Time Offer
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Flash Deal of the Day
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              Grab exclusive discounted items before time runs out!
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/90 dark:bg-slate-800/95 border border-slate-300/80 dark:border-slate-700 rounded-2xl p-3 shrink-0 self-start md:self-auto shadow-2xs dark:shadow-inner">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider pr-2 border-r border-slate-200 dark:border-slate-700">
              <Clock className="w-4 h-4 text-rose-500 dark:text-rose-400 animate-pulse" />
              <span>Ends In:</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-center">
              <div className="bg-slate-100 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1 min-w-[36px]">
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block">Hrs</span>
              </div>
              <span className="text-rose-500 font-bold">:</span>
              <div className="bg-slate-100 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1 min-w-[36px]">
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block">Min</span>
              </div>
              <span className="text-rose-500 font-bold">:</span>
              <div className="bg-slate-100 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1 min-w-[36px]">
                <span className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block">Sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Cards Grid */}
        <div className="relative z-10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayProducts.map((product, idx) => {
            const isWishlisted = wishlist.includes(product.id);
            const claimedPct = idx === 0 ? 78 : 64;

            return (
              <div 
                key={product.id}
                className="bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 hover:border-rose-500/50 shadow-xs hover:shadow-md transition-all duration-300 group relative"
              >
                {/* Product Image */}
                <div 
                  onClick={() => onSelectProduct(product.id)}
                  className="relative w-full sm:w-44 h-48 sm:h-auto rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700/60 shrink-0 cursor-pointer border border-slate-200 dark:border-slate-600/80"
                >
                  <SafeImage 
                    src={product.imageUrl} 
                    alt={product.name}
                    placeholderType="product"
                    fallbackTitle={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border border-rose-500/50 shadow-md">
                    SAVE {idx === 0 ? '25%' : '30%'}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView(product);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 dark:bg-slate-700/90 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition text-xs font-bold flex items-center gap-1 border border-slate-300 dark:border-slate-600 shadow-2xs"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>

                {/* Product Details & Stock Progress Bar */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                        {product.category}
                      </span>
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isWishlisted ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <h3 
                      onClick={() => onSelectProduct(product.id)}
                      className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition cursor-pointer line-clamp-1 mt-0.5"
                    >
                      {product.name}
                    </h3>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-semibold">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Claimed Stock Progress Bar */}
                  <div className="space-y-1.5 bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-600/60">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Items Claimed:</span>
                      <span className="text-rose-600 dark:text-rose-400 font-extrabold">{claimedPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${claimedPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart - Flash Deal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
