'use client';

import React, { useState } from 'react';
import { 
  Home, 
  ShoppingBag, 
  Search, 
  Compass, 
  Sparkles, 
  HelpCircle, 
  Truck, 
  PhoneCall, 
  Heart, 
  Eye,
  Grid,
  Layers,
  ArrowRight,
  PackageX
} from 'lucide-react';
import { SafeImage } from '@modules/common/components/safe-image';
import { updateSEOMetadata } from '@/utils/seoUtils';
import { MockProduct } from '@/types';

interface NotFoundPageProps {
  themeColor?: string;
  getThemeClasses?: (color: string) => any;
  onNavigate: (page: string, params?: any) => void;
  showToast?: (msg: string) => void;
  logoText?: string;
  requestedPath?: string;
  products?: MockProduct[];
  categories?: { id: string | number; name: string; icon?: any }[];
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onAddToCart?: (product: MockProduct) => void;
  onQuickView?: (product: MockProduct) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  themeColor = 'blue',
  getThemeClasses,
  onNavigate,
  showToast,
  logoText = 'Mrbulk',
  requestedPath,
  products = [],
  categories = [],
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const [searchInput, setSearchInput] = useState('');

  // SEO Metadata for 404
  React.useEffect(() => {
    updateSEOMetadata(
      `404 — Page Not Found | ${logoText}`,
      `The page or product you requested could not be found at ${logoText}. Browse our catalog or search for items.`,
      '/404'
    );
  }, [logoText]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigate('search-results', { q: searchInput.trim() });
    }
  };

  const themeAccentClasses = {
    blue: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
      btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
      pillHover: 'hover:border-blue-500 hover:text-blue-600',
      heroGrad: 'from-blue-950 via-slate-900 to-blue-900',
      iconBox: 'bg-blue-100 text-blue-600',
      glow: 'shadow-blue-500/10'
    },
    indigo: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
      btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
      pillHover: 'hover:border-blue-500 hover:text-blue-600',
      heroGrad: 'from-blue-950 via-slate-900 to-blue-900',
      iconBox: 'bg-blue-100 text-blue-600',
      glow: 'shadow-blue-500/10'
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      pillHover: 'hover:border-emerald-500 hover:text-emerald-600',
      heroGrad: 'from-emerald-950 via-slate-900 to-emerald-900',
      iconBox: 'bg-emerald-100 text-emerald-600',
      glow: 'shadow-emerald-500/10'
    },
    rose: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
      btnPrimary: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
      pillHover: 'hover:border-rose-500 hover:text-rose-600',
      heroGrad: 'from-rose-950 via-slate-900 to-rose-900',
      iconBox: 'bg-rose-100 text-rose-600',
      glow: 'shadow-rose-500/10'
    },
    amber: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
      btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
      pillHover: 'hover:border-amber-500 hover:text-amber-600',
      heroGrad: 'from-amber-950 via-slate-900 to-amber-900',
      iconBox: 'bg-amber-100 text-amber-600',
      glow: 'shadow-amber-500/10'
    },
    slate: {
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
      btnPrimary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20',
      pillHover: 'hover:border-slate-800 hover:text-slate-900',
      heroGrad: 'from-slate-950 via-slate-900 to-slate-900',
      iconBox: 'bg-slate-200 text-slate-800',
      glow: 'shadow-slate-500/10'
    },
  }[themeColor] || {
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
    pillHover: 'hover:border-blue-500 hover:text-blue-600',
    heroGrad: 'from-blue-950 via-slate-900 to-blue-900',
    iconBox: 'bg-blue-100 text-blue-600',
    glow: 'shadow-blue-500/10'
  };

  // Popular recommendations
  const recommendedProducts = products.slice(0, 4);

  const displayPath = requestedPath || (typeof window !== 'undefined' ? window.location.pathname : '/unknown-page');

  const popularShortcuts = [
    { label: 'All Products', icon: <ShoppingBag className="w-4 h-4" />, action: () => onNavigate('shop'), desc: 'Browse entire catalog' },
    { label: 'Departments', icon: <Layers className="w-4 h-4" />, action: () => onNavigate('categories'), desc: 'Shop by category' },
    { label: 'Track Order', icon: <Truck className="w-4 h-4" />, action: () => onNavigate('order-tracking'), desc: 'Check shipment status' },
    { label: 'Help & FAQ', icon: <HelpCircle className="w-4 h-4" />, action: () => onNavigate('faq'), desc: 'Instant answers' },
    { label: 'Contact Us', icon: <PhoneCall className="w-4 h-4" />, action: () => onNavigate('contact'), desc: '24/7 VIP Concierge' },
    { label: 'Saved Wishlist', icon: <Heart className="w-4 h-4" />, action: () => onNavigate('wishlist'), desc: 'View favorited items' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14">
      {/* 1. HERO 404 DISPLAY BANNER */}
      <section 
        id="not-found-hero"
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${themeAccentClasses.heroGrad} text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl`}
      >
        {/* Background Ambient Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-white shadow-xs">
            <PackageX className="w-4 h-4 text-rose-400" />
            <span>404 ERROR — PAGE NOT FOUND</span>
          </div>

          {/* Headline Display */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-display">
              Lost in the Aisles?
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We couldn’t find the page or catalog item you’re looking for. The link may have expired, the URL may contain a typo, or the product may have been relocated.
            </p>
          </div>

          {/* Requested Path Callout Box */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/60 border border-slate-700/80 text-xs font-mono text-slate-400 max-w-full overflow-x-auto scrollbar-none">
            <span className="text-slate-500 select-none">Requested URL:</span>
            <span className="text-rose-300 font-bold break-all">{displayPath}</span>
          </div>

          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                id="not-found-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, brands, luxury items..."
                className="w-full pl-12 pr-32 py-3.5 bg-white text-slate-900 rounded-2xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
              <button
                id="not-found-search-submit-btn"
                type="submit"
                className={`absolute right-2 px-4 py-2 text-xs font-bold rounded-xl transition ${themeAccentClasses.btnPrimary}`}
              >
                Search
              </button>
            </div>
          </form>

          {/* Main Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              id="not-found-home-btn"
              onClick={() => onNavigate('home')}
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold shadow-md transition transform active:scale-95 ${themeAccentClasses.btnPrimary}`}
            >
              <Home className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
            <button
              id="not-found-shop-btn"
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore All Products</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. DIRECT SHORTCUT TILES */}
      <section id="not-found-shortcuts" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Popular Store Destinations</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Jump directly to key departments and shopping features.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {popularShortcuts.map((item, idx) => (
            <button
              key={idx}
              id={`not-found-shortcut-${idx}`}
              onClick={item.action}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400/80 dark:hover:border-blue-500 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center transition-colors mb-3">
                {item.icon}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  <span>{item.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY PILLS QUICK BAR */}
      {categories.length > 0 && (
        <section id="not-found-categories" className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Grid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Browse by Curated Category</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pick a department to explore authenticated merchandise.</p>
            </div>
            <button
              onClick={() => onNavigate('categories')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate('category-detail', { name: cat.name })}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center gap-1.5 shadow-2xs"
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. RECOMMENDED FEATURED PRODUCTS */}
      {recommendedProducts.length > 0 && (
        <section id="not-found-recommendations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/60 text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Trending Right Now</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Recommended While You’re Here
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <span>Shop All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const numPrice = parseFloat(product.price || '0');
              const numOrigPrice = product.originalPrice ? parseFloat(product.originalPrice) : 0;
              const discount = numOrigPrice > numPrice
                ? Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100)
                : 0;
              const prodImg = product.imageUrl || (product.images && product.images[0]) || '';

              return (
                <div
                  key={product.id}
                  id={`not-found-product-card-${product.id}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 group"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <SafeImage
                      src={prodImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {discount > 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-md shadow-xs">
                        -{discount}%
                      </span>
                    )}

                    {onToggleWishlist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition shadow-xs ${
                          isWishlisted
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                            : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800'
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                      </button>
                    )}

                    {onQuickView && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(product);
                        }}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-md flex items-center gap-1.5 backdrop-blur-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {product.category || 'Luxury'}
                    </div>
                    <h3 
                      onClick={() => onNavigate('product-detail', { id: product.id })}
                      className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">${numPrice.toFixed(2)}</span>
                      {numOrigPrice > numPrice && (
                        <span className="text-xs text-slate-400 line-through ml-1.5">
                          ${numOrigPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {onAddToCart && (
                      <button
                        onClick={() => onAddToCart(product)}
                        className={`p-2 rounded-xl text-xs font-bold transition ${themeAccentClasses.btnPrimary}`}
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. CONCIERGE HELP STRIP */}
      <section id="not-found-help-strip" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${themeAccentClasses.iconBox}`}>
            <PhoneCall className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Need personal assistance finding an item?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Our VIP shopping concierge and customer support team are available 24/7.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('contact')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition ${themeAccentClasses.btnPrimary}`}
          >
            Contact Support
          </button>
          <button
            onClick={() => onNavigate('faq')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
          >
            Read FAQs
          </button>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
