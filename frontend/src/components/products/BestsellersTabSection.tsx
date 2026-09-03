'use client';

import React, { useState } from 'react';
import { Star, Eye, Heart, Flame, Crown, Tag, ArrowRight } from 'lucide-react';
import { MockProduct } from '../../types';
import { SafeImage } from '../ui/SafeImage';
import { StockBadge } from '../ui/StockBadge';
import { getProductSaleDetails } from '../../utils/productUtils';
import { getProductRatingDetails } from '../../utils/productRating';
import { formatCurrency } from '../../utils/pricing';

interface BestsellersTabSectionProps {
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
  onAddToCart?: (product: MockProduct) => void;
  onSelectProduct: (productId: string) => void;
  onQuickView?: (product: MockProduct) => void;
  onNavigateShop: () => void;
}

export const BestsellersTabSection: React.FC<BestsellersTabSectionProps> = ({
  products,
  themeColor,
  getThemeClasses,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onQuickView,
  onNavigateShop
}) => {
  const currentTheme = getThemeClasses(themeColor);
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'new' | 'rated' | 'sale'>('bestsellers');

  // Filter products according to active tab
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'sale') return p.isSale || p.originalPrice;
    if (activeTab === 'new') return p.isFeatured || (p as any).stockStatus === 'lowstock' || (p as any).stockQuantity < 20;
    if (activeTab === 'rated') return p.id === 'prod-1' || p.id === 'prod-3' || p.id === 'prod-6' || p.id === 'prod-8';
    return true; // bestsellers default
  }).slice(0, 8);

  const tabs = [
    { id: 'bestsellers', label: 'Bestsellers', icon: Flame },
    { id: 'new', label: 'New Arrivals', icon: Crown },
    { id: 'rated', label: 'Top Rated', icon: Star },
    { id: 'sale', label: 'Special Deals', icon: Tag }
  ] as const;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Tabs bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className={`text-xs font-extrabold uppercase tracking-widest ${currentTheme.text}`}>
            Curated Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            Top Picked Products
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Handpicked quality items trending across our storefront.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? `${currentTheme.bg} text-white shadow-md shadow-blue-500/15`
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Filtered Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 pt-6">
        {filteredProducts.map((prod) => {
          const isWishlisted = wishlist.includes(prod.id);
          const ratingInfo = getProductRatingDetails(prod);

          return (
            <div 
              key={prod.id}
              className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Image Container */}
              <div 
                onClick={() => onSelectProduct(prod.id)}
                className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-700/50 cursor-pointer"
              >
                <SafeImage 
                  src={prod.imageUrl} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  alt={prod.name} 
                  placeholderType="product"
                  fallbackTitle={prod.name}
                />

                {/* Badges Overlay */}
                {(() => {
                  const sale = getProductSaleDetails(prod);
                  return (
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                      {sale.isSale && (
                        <div className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs flex items-center gap-1 border border-rose-500/50">
                          <Tag className="w-2.5 h-2.5 text-white" />
                          <span>{sale.badgeText}</span>
                        </div>
                      )}
                      {(prod.isFeatured || (!sale.isSale && prod.isFeatured !== false)) && (
                        <div className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[10px] tracking-wider uppercase border border-slate-700/50 shadow-2xs flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-amber-400" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Top-Right Action Stack */}
                <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(prod.id);
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-4 h-4 stroke-[2.5] ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  {onQuickView && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(prod);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-800">
                <div className="cursor-pointer" onClick={() => onSelectProduct(prod.id)}>
                  {prod.category && (
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1">
                      <span>{prod.category}</span>
                    </div>
                  )}
                  <h3 className={`text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:${currentTheme.text} transition-colors line-clamp-2 leading-snug w-full`}>
                    {prod.name}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5" suppressHydrationWarning>
                    <StockBadge product={prod} />
                    {ratingInfo.hasReviews ? (
                      <div className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/50 px-1 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/50 text-[9px] sm:text-[10px] font-extrabold w-max" suppressHydrationWarning>
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500 shrink-0" />
                        <span>{ratingInfo.ratingFormatted}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/80 px-1 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 text-[9px] sm:text-[10px] font-medium w-max" suppressHydrationWarning>
                        <Star className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600 shrink-0" />
                        <span>0.0</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-700/80">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{formatCurrency(prod.price)}</span>
                    {prod.originalPrice && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-semibold">{formatCurrency(prod.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer link to full shop */}
      <div className="text-center pt-8">
        <button
          onClick={onNavigateShop}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl ${currentTheme.bg} text-white font-bold text-xs sm:text-sm shadow-md transition hover:scale-102 active:scale-98 cursor-pointer`}
        >
          <span>Explore All Store Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

