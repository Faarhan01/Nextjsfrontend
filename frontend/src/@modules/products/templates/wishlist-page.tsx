'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/utils/pricing';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Crown,
  Tag,
  Package, 
  ArrowRight,
  Filter,
  RefreshCw,
  ShoppingBasket,
  Eye
} from 'lucide-react';
import { MockProduct, CustomWishlist } from '@/types';
import { useRouter } from 'next/navigation';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';

interface WishlistPageProps {
  wishlist?: string[];
  products?: MockProduct[];
  onToggleWishlist?: (productId: string, productName: string) => void;
  onAddToCart?: (product: MockProduct) => void;
  onNavigate?: (page: string, params?: any) => void;
  onClearWishlist?: () => void;
  onAddAllToCart?: () => void;
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses?: (color: string) => any;
  showToast?: (msg: string) => void;
  onQuickView?: (product: MockProduct) => void;
  customWishlists?: CustomWishlist[];
  onToggleProductInLists?: (productId: string, targetListIds: string[]) => void;
  onCreateWishlist?: (name: string, description?: string, icon?: string) => CustomWishlist;
  onDeleteWishlist?: (listId: string) => void;
  onRenameWishlist?: (listId: string, newName: string) => void;
  onResetDefaultWishlists?: () => void;
}

export default function WishlistPage({
  wishlist: propWishlist,
  products: propProducts,
  onToggleWishlist: propOnToggleWishlist,
  onAddToCart: propOnAddToCart,
  onNavigate: propOnNavigate,
  onClearWishlist: propOnClearWishlist,
  onAddAllToCart: propOnAddAllToCart,
  themeColor: propThemeColor,
  getThemeClasses: propGetThemeClasses,
  showToast: propShowToast,
  onQuickView: propOnQuickView,
  customWishlists: propCustomWishlists,
  onToggleProductInLists: propOnToggleProductInLists,
  onCreateWishlist: propOnCreateWishlist,
  onDeleteWishlist: propOnDeleteWishlist,
  onRenameWishlist: propOnRenameWishlist,
  onResetDefaultWishlists: propOnResetDefaultWishlists,
}: WishlistPageProps) {
  const router = useRouter();
  const wishlistCtx = useWishlistContext();
  const catalogCtx = useCatalog();
  const cartCtx = useCartContext();
  const themeCtx = useThemeContext();
  const toastCtx = useToastContext();
  const uiCtx = useUI();

  const wishlist = propWishlist ?? wishlistCtx.wishlist;
  const products = propProducts ?? catalogCtx.products;
  const onToggleWishlist = propOnToggleWishlist ?? wishlistCtx.toggleWishlist;
  const onAddToCart = propOnAddToCart ?? cartCtx.addToCart;
  const themeColor = propThemeColor ?? themeCtx.themeColor;
  const getThemeClasses = propGetThemeClasses ?? defaultGetThemeClasses;
  const showToast = propShowToast ?? toastCtx.showToast;
  const onQuickView = propOnQuickView ?? uiCtx.openQuickView;
  const customWishlists = propCustomWishlists ?? wishlistCtx.customWishlists ?? [];
  const onClearWishlist = propOnClearWishlist ?? wishlistCtx.clearWishlist;
  const onToggleProductInLists = propOnToggleProductInLists ?? wishlistCtx.toggleProductInLists;
  const onCreateWishlist = propOnCreateWishlist ?? wishlistCtx.createWishlist;
  const onDeleteWishlist = propOnDeleteWishlist ?? wishlistCtx.deleteWishlist;
  const onRenameWishlist = propOnRenameWishlist ?? wishlistCtx.renameWishlist;
  const onResetDefaultWishlists = propOnResetDefaultWishlists ?? wishlistCtx.resetDefaultWishlists;

  const onNavigate = (page: string, params?: any) => {
    if (propOnNavigate) {
      propOnNavigate(page, params);
      return;
    }
    if (page === 'home' || page === '') router.push('/');
    else if (page === 'shop' || page === 'products') router.push('/shop');
    else router.push(page.startsWith('/') ? page : `/${page}`);
  };

  const onAddAllToCart = propOnAddAllToCart ?? (() => {
    const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));
    wishlistedProducts.forEach((p) => cartCtx.addToCart(p, 1));
    showToast(`Added ${wishlistedProducts.length} items to your cart.`);
  });

  const currentTheme = getThemeClasses(themeColor);

  // Local filter & sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListId, setSelectedListId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'name'>('default');

  // Filter products by selected list collection
  const activeWishlist = customWishlists.find(l => l.id === selectedListId);
  const targetProductIds = selectedListId === 'all' || !activeWishlist 
    ? wishlist 
    : activeWishlist.productIds;

  // Wishlisted products filtering
  const wishlistedProducts = products.filter(p => targetProductIds.includes(p.id));

  // Applied filtered wishlist items
  const filteredWishlist = wishlistedProducts
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleAddAll = () => {
    if (wishlistedProducts.length === 0) return;
    if (onAddAllToCart) {
      onAddAllToCart();
    } else {
      wishlistedProducts.forEach(p => onAddToCart(p));
      showToast(`Added all ${wishlistedProducts.length} saved items to your shopping cart!`);
    }
  };

  const handleClearAll = () => {
    if (wishlistedProducts.length === 0) return;
    if (onClearWishlist) {
      onClearWishlist();
    } else {
      wishlistedProducts.forEach(p => onToggleWishlist(p.id, p.name));
      showToast('Cleared all items from your wishlist.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-24 space-y-6 sm:space-y-8">
      
      {/* Wishlist Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="relative w-full py-8 sm:py-12 px-4 sm:px-8 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm dark:shadow-lg border border-slate-200/90 dark:border-slate-800 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <SafeImage 
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1400&fm=webp" 
              alt="Saved Wishlist"
              placeholderType="banner"
              className="w-full h-full object-cover opacity-60 dark:opacity-75 scale-105 transition-transform duration-700"
            />
            {/* Luminous scrim: clear center visibility with balanced readability overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/70 dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-950/85" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
          
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400 select-none">
              <a 
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('shop');
                }}
                className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 font-semibold no-underline text-slate-600 dark:text-slate-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
              </a>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-extrabold">Wishlist</span>
            </div>

            {/* Badge Pill */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/90 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300/80 dark:border-white/20 backdrop-blur-md shadow-2xs">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Saved Collections
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3">
              My Wishlist
              <span className="text-xs sm:text-sm font-black px-3 py-1 bg-rose-100 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-rose-700 dark:text-rose-300 rounded-full shadow-2xs">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              Keep track of your favorite design items, save price drops, or move them directly into your shopping cart whenever you're ready.
            </p>

            {/* Quick Action Buttons */}
            {wishlistedProducts.length > 0 && (
              <div className="pt-2 flex items-center justify-center gap-3 shrink-0 flex-wrap">
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 border border-slate-300 dark:border-slate-700 shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Clear Wishlist
                </button>

                <button
                  onClick={handleAddAll}
                  className={`px-5 py-2 ${currentTheme.bg} text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs hover:opacity-90`}
                >
                  <ShoppingBag className="w-4 h-4" /> Move All to Cart
                </button>
              </div>
            )}

        </div>
      </div>
    </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Wishlist Collections Filter Pills */}
        {customWishlists.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedListId('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                selectedListId === 'all'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>All Collections</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${selectedListId === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                {wishlist.length}
              </span>
            </button>

            {customWishlists.map((list) => {
              const isSelected = selectedListId === list.id;
              return (
                <button
                  key={list.id}
                  onClick={() => setSelectedListId(list.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-white' : 'text-slate-400'}`} />
                  <span>{list.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${isSelected ? 'bg-rose-700 text-rose-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {list.productIds.length}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search & Sort Controls Bar (Visible when wishlist has items) */}
        {wishlistedProducts.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search within Wishlist */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search saved items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Sort Select & Count */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing {filteredWishlist.length} of {wishlistedProducts.length}
              </span>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-xs px-3 py-2 text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="default">Recently Added</option>
                  <option value="name">Product Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

          </div>
        )}

        {/* Wishlist Items Grid */}
        {filteredWishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredWishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/8 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Image Area */}
                    <div 
                      onClick={() => onNavigate('product-detail', { id: product.id })}
                      className="relative h-56 bg-slate-50 dark:bg-slate-700/50 overflow-hidden cursor-pointer"
                    >
                      <SafeImage 
                        src={product.imageUrl} 
                        alt={product.name} 
                        placeholderType="product"
                        fallbackTitle={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                      />

                      {/* Badges Overlay */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                        {(product.isSale || product.originalPrice || product.id === 'prod-2' || product.id === 'prod-5') && (
                          <div className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs flex items-center gap-1 border border-rose-500/50">
                            <Tag className="w-2.5 h-2.5 text-white" />
                            <span>{product.saleBadgeText || 'Sale'}</span>
                          </div>
                        )}
                        {(product.isFeatured || (!product.isSale && product.id !== 'prod-2' && product.id !== 'prod-5')) && (
                          <div className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[10px] tracking-wider uppercase border border-slate-700/50 shadow-2xs flex items-center gap-1">
                            <Crown className="w-2.5 h-2.5 text-amber-400" />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>

                      {/* Top Right Action Stack */}
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product.id, product.name);
                          }}
                          title="Remove from Wishlist"
                          className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200 hover:scale-110 active:scale-90 shadow-2xs flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {onQuickView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickView(product);
                            }}
                            title="Quick View"
                            className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 shadow-2xs flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="cursor-pointer" onClick={() => onNavigate('product-detail', { id: product.id })}>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition cursor-pointer line-clamp-2 leading-snug w-full">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          <StockBadge product={product} />
                          <div className="flex items-center gap-0.5 text-amber-600 bg-amber-50/80 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200/50 dark:border-amber-700/50 text-[10px] sm:text-[11px] font-extrabold w-max">
                            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400 shrink-0" />
                            <span>4.9</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-baseline justify-between">
                        <div>
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/80 flex gap-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className={`flex-1 py-2.5 ${currentTheme.bg} text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : wishlistedProducts.length > 0 && filteredWishlist.length === 0 ? (
          /* Filter No Match State */
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-700 space-y-4 max-w-md mx-auto">
            <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No items match "{searchTerm}"</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try searching for another keyword or clear your filter.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          /* Empty Wishlist Banner State */
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 dark:border-slate-700 space-y-6 max-w-2xl mx-auto shadow-xs">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50 dark:ring-rose-950/20">
              <Heart className="w-10 h-10 fill-rose-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Your Wishlist is Empty</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                You haven't saved any items yet. Browse our store products and tap the heart icon to save your favorites for later!
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => onNavigate('shop')}
                className={`px-8 py-3.5 ${currentTheme.bg} text-white font-bold text-sm rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-98`}
              >
                <ShoppingBasket className="w-4 h-4" /> Explore Shop Collection
              </button>
            </div>
          </div>
        )}

        {/* Featured Recommendation Grid when wishlist is empty or short */}
        {wishlistedProducts.length <= 2 && (
          <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Recommended For Your Saved Collection
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Popular items loved by other design enthusiasts.</p>
              </div>

              <button
                onClick={() => onNavigate('shop')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 4).map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-3 group hover:border-slate-300 dark:hover:border-slate-600 transition">
                  <SafeImage src={item.imageUrl} alt={item.name} placeholderType="product" fallbackTitle={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition">{item.name}</h4>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">{formatCurrency(item.price)}</span>
                    <button
                      onClick={() => onToggleWishlist(item.id, item.name)}
                      className="text-[11px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <Heart className={`w-3 h-3 ${wishlist.includes(item.id) ? 'fill-rose-500' : ''}`} /> 
                      {wishlist.includes(item.id) ? 'Saved' : 'Save to Wishlist'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
