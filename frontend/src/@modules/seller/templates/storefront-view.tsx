'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  Truck, 
  RotateCcw, 
  MessageSquare, 
  Mail, 
  Phone, 
  Share2, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ShoppingCart, 
  Heart, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  X, 
  Send, 
  Building2, 
  BadgeCheck, 
  ArrowLeft,
  ArrowRight,
  Tag,
  Clock,
  Layers,
  ArrowUpDown,
  Shuffle,
  Grid3X3,
  List,
  Eye,
  Check,
  ChevronDown,
  ShoppingBag,
  Crown,
  LayoutGrid,
  Laptop,
  Home,
  Shirt,
  Headphones,
  Watch,
  Car,
  Briefcase,
  Plug,
  PawPrint,
  Dumbbell,
  Gamepad2,
  Wrench,
  ShieldAlert,
  Footprints,
  Armchair,
  Lightbulb,
  Folder,
  Plus
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { SellerAccount, MockProduct, VendorOffer, ProductCondition } from '@/types';
import { formatCurrency, parsePriceNumber } from '@/utils/pricing';
import { getProductSaleDetails } from '@/utils/productUtils';
import { getProductRatingDetails } from '@/utils/productRating';
import { getProductUrl } from '@/utils/seoUtils';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { RecentlyViewedSection } from '@/components/shared';
import { useCatalog } from '@/providers/catalog-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useUI } from '@/providers/ui-provider';
import { useThemeContext, getThemeClasses } from '@/providers/theme-provider';

interface StorefrontViewProps {
  seller?: SellerAccount;
  sellerId?: string;
  allSellers?: SellerAccount[];
  products?: MockProduct[];
  wishlist?: string[];
  onToggleWishlist?: (id: string, name: string) => void;
  onAddToCart?: (product: MockProduct, qty?: number, offer?: VendorOffer) => void;
  onSelectProduct?: (productId: string) => void;
  onQuickView?: (product: MockProduct) => void;
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
}

const CategoryIcon: React.FC<{ category: string; className?: string }> = ({ category, className = 'w-3 h-3' }) => {
  const cat = category.toLowerCase().trim();

  if (cat === 'all') return <LayoutGrid className={className} />;
  if (cat.includes('sale') || cat.includes('deal')) return <Tag className={className} />;
  if (cat.includes('electron') || cat.includes('tech') || cat.includes('gadget')) return <Laptop className={className} />;
  if (cat.includes('audio') || cat.includes('headphone') || cat.includes('sound')) return <Headphones className={className} />;
  if (cat.includes('home') || cat.includes('kitchen') || cat.includes('living')) return <Home className={className} />;
  if (cat.includes('apparel') || cat.includes('fashion') || cat.includes('cloth')) return <Shirt className={className} />;
  if (cat.includes('personal') || cat.includes('wellness') || cat.includes('health') || cat.includes('care')) return <Heart className={className} />;
  if (cat.includes('beauty') || cat.includes('cosmetic')) return <Sparkles className={className} />;
  if (cat.includes('accessori') || cat.includes('jewelry') || cat.includes('watch')) return <Watch className={className} />;
  if (cat.includes('auto') || cat.includes('car')) return <Car className={className} />;
  if (cat.includes('station') || cat.includes('office')) return <Briefcase className={className} />;
  if (cat.includes('appliance')) return <Plug className={className} />;
  if (cat.includes('pet')) return <PawPrint className={className} />;
  if (cat.includes('sport') || cat.includes('outdoor') || cat.includes('fitness')) return <Dumbbell className={className} />;
  if (cat.includes('toy') || cat.includes('game')) return <Gamepad2 className={className} />;
  if (cat.includes('tool') || cat.includes('hardware')) return <Wrench className={className} />;
  if (cat.includes('food') || cat.includes('grocer')) return <ShoppingBag className={className} />;
  if (cat.includes('pest')) return <ShieldAlert className={className} />;
  if (cat.includes('shoe') || cat.includes('footwear') || cat.includes('sneaker')) return <Footprints className={className} />;
  if (cat.includes('furnit')) return <Armchair className={className} />;
  if (cat.includes('light') || cat.includes('lamp')) return <Lightbulb className={className} />;

  return <Folder className={className} />;
};

export function StorefrontView({
  seller: propSeller,
  sellerId: propSellerId,
  allSellers: propAllSellers,
  products: propProducts,
  wishlist: propWishlist,
  onToggleWishlist: propOnToggleWishlist,
  onAddToCart: propOnAddToCart,
  onSelectProduct: propOnSelectProduct,
  onQuickView: propOnQuickView,
  themeColor: propThemeColor,
}: StorefrontViewProps) {
  const router = useRouter();
  const params = useParams();
  const catalogCtx = useCatalog();
  const wishlistCtx = useWishlistContext();
  const cartCtx = useCartContext();
  const uiCtx = useUI();
  const themeCtx = useThemeContext();

  const allSellers = propAllSellers ?? catalogCtx.sellerAccounts;
  const products = propProducts ?? catalogCtx.products;
  const wishlist = propWishlist ?? wishlistCtx.wishlist;
  const onToggleWishlist = propOnToggleWishlist ?? wishlistCtx.toggleWishlist;
  const onAddToCart = propOnAddToCart ?? ((p, qty, offer) => cartCtx.addToCart(p, qty || 1, offer));
  const onSelectProduct = propOnSelectProduct ?? ((id: string) => router.push(getProductUrl(id)));
  const onQuickView = propOnQuickView ?? uiCtx.openQuickView;
  const themeColor = propThemeColor ?? themeCtx.themeColor;
  const currentTheme = getThemeClasses(themeColor);

  const rawSellerId = propSellerId || (params?.sellerId as string) || '';
  const seller = useMemo(() => {
    if (propSeller) return propSeller;
    if (!rawSellerId) return allSellers[0];
    const target = rawSellerId.toLowerCase().trim();
    const match = allSellers.find((s, idx) => {
      if (s.id.toLowerCase() === target) return true;
      if (s.userId?.toLowerCase() === target) return true;
      const storeSlug = s.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (storeSlug === target) return true;
      if (s.storeName.toLowerCase().replace(/\s+/g, '-') === target) return true;
      if (target === `seller-${idx + 1}` || target === `seller-0${idx + 1}`) return true;
      return false;
    });
    return match || allSellers[0];
  }, [propSeller, rawSellerId, allSellers]);

  // Active Store Tabs
  const [activeTab, setActiveTab] = useState<'catalog' | 'about' | 'reviews'>('catalog');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<'random' | 'price-asc' | 'price-desc' | 'newest' | 'rating-desc'>('random');
  const [gridView, setGridView] = useState<'cols-4' | 'list'>('cols-4');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Local Quick View state if onQuickView not supplied
  const [localQuickViewProduct, setLocalQuickViewProduct] = useState<{ product: MockProduct; offer: VendorOffer | null } | null>(null);

  // Contact Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [contactSubject, setContactSubject] = useState<string>('Product Inquiry');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSenderEmail, setContactSenderEmail] = useState<string>('');
  const [isMessageSent, setIsMessageSent] = useState<boolean>(false);

  // Random score mapping for genuine random sorting
  const [randomScores, setRandomScores] = useState<Record<string, number>>({});

  const reshuffleRandom = () => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.id] = Math.random();
    });
    setRandomScores(map);
  };

  useEffect(() => {
    reshuffleRandom();
  }, [products]);

  // Filter products listed by this seller (via product.offers or product.primarySellerId)
  const storeProductsWithOffers = useMemo(() => {
    const list: Array<{ product: MockProduct; offer: VendorOffer | null }> = [];

    products.forEach((prod) => {
      // Find offer by this seller
      const sellerOffer = prod.offers?.find((o) => o.sellerId === seller.id);
      if (sellerOffer) {
        list.push({ product: prod, offer: sellerOffer });
      } else if (prod.primarySellerId === seller.id) {
        const prodPriceNum = typeof prod.price === 'number' ? prod.price : parsePriceNumber(String(prod.price)) || 1999;
        list.push({
          product: prod,
          offer: {
            offerId: `off-${prod.id}-${seller.id}`,
            sellerId: seller.id,
            sellerName: seller.storeName,
            price: prodPriceNum,
            stockCount: prod.stock || 15,
            condition: 'Brand New',
            shippingDays: 2,
            rating: seller.rating || 4.9,
            reviewsCount: 20
          }
        });
      }
    });

    if (list.length === 0 && products.length > 0) {
      // Fallback: Show verified catalog products so the seller store is never empty
      products.slice(0, 8).forEach((prod) => {
        const prodPriceNum = typeof prod.price === 'number' ? prod.price : parsePriceNumber(String(prod.price)) || 999;
        list.push({
          product: prod,
          offer: {
            offerId: `off-${prod.id}-${seller.id}`,
            sellerId: seller.id,
            sellerName: seller.storeName,
            price: prodPriceNum,
            stockCount: prod.stock || 12,
            condition: 'Brand New',
            shippingDays: 2,
            rating: seller.rating || 4.9,
            reviewsCount: 15
          }
        });
      });
    }

    return list;
  }, [products, seller.id, seller.rating, seller.storeName]);

  // Categories present in this seller's catalog
  const storeCategories = useMemo(() => {
    const set = new Set<string>();
    storeProductsWithOffers.forEach(({ product }) => {
      if (product.category) set.add(product.category);
    });
    return ['All', ...Array.from(set)];
  }, [storeProductsWithOffers]);

  // Brands present in this seller's catalog
  const storeBrands = useMemo(() => {
    const set = new Set<string>();
    storeProductsWithOffers.forEach(({ product }) => {
      if (product.brand) set.add(product.brand);
    });
    return ['All', ...Array.from(set)];
  }, [storeProductsWithOffers]);

  // Max price calculation
  const maxStorePrice = useMemo(() => {
    let max = 5000;
    storeProductsWithOffers.forEach(({ product, offer }) => {
      const p = offer ? offer.price : parsePriceNumber(String(product.price));
      if (p > max) max = p;
    });
    return Math.ceil(max / 500) * 500;
  }, [storeProductsWithOffers]);

  // Synchronize price range ceiling on initial load
  useEffect(() => {
    setPriceRange([0, maxStorePrice]);
  }, [maxStorePrice]);

  // Filtered & Sorted products
  const processedProducts = useMemo(() => {
    return storeProductsWithOffers.filter(({ product, offer }) => {
      const price = offer ? offer.price : parsePriceNumber(String(product.price));

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = (product.description || '').toLowerCase().includes(q);
        const matchesBrand = (product.brand || '').toLowerCase().includes(q);
        const matchesCat = (product.category || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesCat) return false;
      }

      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      if (selectedBrand !== 'All' && product.brand?.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      if (selectedCondition !== 'All' && offer?.condition !== selectedCondition) {
        return false;
      }

      if (inStockOnly) {
        const stock = offer?.stockCount ?? product.stock ?? 10;
        if (stock <= 0) return false;
      }

      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      if (selectedRating !== 'all') {
        const minRating = parseFloat(selectedRating);
        const prodRating = offer?.rating || product.rating || 4.5;
        if (prodRating < minRating) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.offer ? a.offer.price : parsePriceNumber(String(a.product.price));
      const priceB = b.offer ? b.offer.price : parsePriceNumber(String(b.product.price));

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return (b.product.id > a.product.id ? 1 : -1);
      if (sortBy === 'rating-desc') {
        const rA = a.offer?.rating || a.product.rating || 4.5;
        const rB = b.offer?.rating || b.product.rating || 4.5;
        return rB - rA;
      }
      // 'random'
      const scoreA = randomScores[a.product.id] ?? 0.5;
      const scoreB = randomScores[b.product.id] ?? 0.5;
      return scoreA - scoreB;
    });
  }, [
    storeProductsWithOffers, 
    searchQuery, 
    selectedCategory, 
    selectedBrand, 
    selectedCondition, 
    inStockOnly, 
    priceRange, 
    selectedRating, 
    sortBy, 
    randomScores
  ]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCategory !== 'All') count++;
    if (selectedBrand !== 'All') count++;
    if (selectedCondition !== 'All') count++;
    if (selectedRating !== 'all') count++;
    if (inStockOnly) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxStorePrice) count++;
    return count;
  }, [searchQuery, selectedCategory, selectedBrand, selectedCondition, selectedRating, inStockOnly, priceRange, maxStorePrice]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedCondition('All');
    setSelectedRating('all');
    setInStockOnly(false);
    setPriceRange([0, maxStorePrice]);
    setSortBy('random');
    reshuffleRandom();
  };

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleShareStore = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMessageSent(true);
    setTimeout(() => {
      setIsContactModalOpen(false);
      setIsMessageSent(false);
      setContactMessage('');
    }, 2000);
  };

  const handleTriggerQuickView = (prod: MockProduct, offer: VendorOffer | null) => {
    if (onQuickView) {
      onQuickView(prod);
    } else {
      setLocalQuickViewProduct({ product: prod, offer });
    }
  };

  // Filter Sidebar UI renderer
  const renderFilterSidebar = () => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Filter Store Catalog
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Categories
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {storeCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All'
              ? storeProductsWithOffers.length
              : storeProductsWithOffers.filter(({ product }) => product.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <CategoryIcon
                    category={cat}
                    className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-500'} shrink-0`}
                  />
                  <span className="truncate">{cat}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                    {count}
                  </span>
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Filter */}
      {storeBrands.length > 2 && (
        <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
            Brand
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {storeBrands.map((brandName) => {
              const isSelected = selectedBrand.toLowerCase() === brandName.toLowerCase();
              const count = brandName === 'All'
                ? storeProductsWithOffers.length
                : storeProductsWithOffers.filter(({ product }) => product.brand?.toLowerCase() === brandName.toLowerCase()).length;

              return (
                <button
                  key={brandName}
                  type="button"
                  onClick={() => setSelectedBrand(brandName)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Tag className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-400'} shrink-0`} />
                    <span className="truncate">{brandName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                      {count}
                    </span>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Condition Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Item Condition
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {['All', 'Brand New', 'Like New', 'Refurbished', 'Open Box'].map((cond) => {
            const isSelected = selectedCondition === cond;
            return (
              <button
                key={cond}
                type="button"
                onClick={() => setSelectedCondition(cond)}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
                }`}
              >
                {cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Rating Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Minimum Rating
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'All Ratings' },
            { id: '4.8', label: '4.8 & Above' },
            { id: '4.5', label: '4.5 & Above' },
            { id: '4.0', label: '4.0 & Above' }
          ].map((opt) => {
            const isSelected = selectedRating === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRating(opt.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. In-Stock Switch */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> In-Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 rounded-sm cursor-pointer"
          />
        </label>
      </div>

      {/* 6. Price Range Slider */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <label className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Price Filter
          </label>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
            Up to {formatCurrency(priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={maxStorePrice}
          step="50"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
          <span>{formatCurrency(0)}</span>
          <span>{formatCurrency(maxStorePrice)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Back to Marketplace Breadcrumb Navigation Bar */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Merchant Storefront</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{seller.storeName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 sm:space-y-8">
        
        {/* ========================================================================= */}
        {/* STORE HERO BANNER & HEADER */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Cover Banner Stage */}
          <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 overflow-hidden">
            {seller.bannerUrl ? (
              <SafeImage
                src={seller.bannerUrl}
                alt={seller.storeName}
                className="w-full h-full object-cover opacity-85"
                placeholderType="banner"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-blue-950 to-indigo-900 opacity-90" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

            {/* Quick Share Action Top Right */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={handleShareStore}
                className={`px-3 py-2 rounded-xl backdrop-blur-md shadow-md transition cursor-pointer flex items-center gap-1.5 text-xs font-bold border ${
                  isCopied
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
                title="Share Store Link"
              >
                {isCopied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
                <span>{isCopied ? 'Link Copied!' : 'Share Store'}</span>
              </button>
            </div>
          </div>

          {/* Store Profile & Actions Row */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-20 mb-4">
              {/* Store Avatar + Identity Details */}
              <div className="flex items-end gap-4 sm:gap-5">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden shrink-0 relative flex items-center justify-center">
                  {seller.logoUrl ? (
                    <SafeImage
                      src={seller.logoUrl}
                      alt={seller.storeName}
                      className="w-full h-full object-cover"
                      placeholderType="product"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center text-4xl font-black">
                      {seller.storeName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="pb-1 sm:pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {seller.storeName}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {seller.verifiedBadgeText || 'Verified Merchant'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {seller.location || 'South Africa'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Member since {seller.joinedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {seller.rating?.toFixed(1) || '4.9'} ({seller.ordersCount || 50}+ orders fulfilled)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto pt-2 sm:pt-0">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className={`w-full sm:w-auto px-5 py-2.5 ${currentTheme.bg} text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-md ${currentTheme.shadow} cursor-pointer active:scale-95`}
                >
                  <Mail className="w-4 h-4" /> Message Merchant
                </button>
              </div>
            </div>

            {/* Seller Story / Bio */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl pt-2">
              {seller.description}
            </p>

            {/* Merchant Guarantee SLA Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${currentTheme.lightBg} flex items-center justify-center shrink-0`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fulfillment SLA</span>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{seller.dispatchSla || '1-2 Days'}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Return Window</span>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{seller.returnPolicyDays || 30}-Day Guarantee</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authenticity</span>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">100% Genuine Certified</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Store Catalog</span>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{storeProductsWithOffers.length} Products Listed</span>
                </div>
              </div>
            </div>

          </div>

          {/* STORE NAVIGATION TABS */}
          <div className="flex border-t border-slate-100 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-800/40">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-4 px-4 text-xs font-extrabold border-b-2 transition cursor-pointer outline-none ${
                activeTab === 'catalog'
                  ? `border-current ${currentTheme.text}`
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Product Catalog ({storeProductsWithOffers.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-4 text-xs font-extrabold border-b-2 transition cursor-pointer outline-none ${
                activeTab === 'about'
                  ? `border-current ${currentTheme.text}`
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              About & Policies
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-4 text-xs font-extrabold border-b-2 transition cursor-pointer outline-none ${
                activeTab === 'reviews'
                  ? `border-current ${currentTheme.text}`
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Customer Ratings ({seller.ordersCount || 42})
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PRODUCT CATALOG (SHOP ARCHIVE VIEW) */}
        {/* ========================================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Top Control Bar: Sort, Search, and Layout Toggler */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              
              {/* Search Inside Merchant Store */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search in ${seller.storeName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown & Layout Controls */}
              <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
                {/* Sort Dropdown Filter */}
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <label htmlFor="store-sort-select" className="text-xs font-extrabold text-slate-700 dark:text-slate-200 whitespace-nowrap flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer select-none">
                    <span className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 shadow-2xs">
                      <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </span>
                    <span className="hidden sm:inline">Sort By:</span>
                  </label>
                  <div className="relative w-44 sm:w-56">
                    <select
                      id="store-sort-select"
                      value={sortBy}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setSortBy(val);
                        if (val === 'random') {
                          reshuffleRandom();
                        }
                      }}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-slate-400 rounded-xl pl-3 pr-8 py-2 text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none transition shadow-2xs cursor-pointer w-full appearance-none"
                    >
                      <option value="random">Recommended / Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest Arrivals</option>
                      <option value="rating-desc">Highest Rated</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {sortBy === 'random' && (
                    <button
                      onClick={reshuffleRandom}
                      className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition cursor-pointer shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700 shadow-2xs"
                      title="Reshuffle products randomly"
                    >
                      <Shuffle className="w-3 h-3 text-slate-700 dark:text-slate-200" />
                    </button>
                  )}
                </div>

                {/* Mobile Filters Drawer Trigger */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Grid vs List View Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
                  <button
                    onClick={() => setGridView('cols-4')}
                    className={`p-1.5 rounded-lg transition cursor-pointer flex items-center justify-center ${
                      gridView === 'cols-4'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Grid View (4 Columns)"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridView('list')}
                    className={`p-1.5 rounded-lg transition cursor-pointer flex items-center justify-center ${
                      gridView === 'list'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* Desktop Side-by-Side Archive Layout (Products 9 Cols, Filters 3 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              
              {/* Main Products Display Area (9 Columns) */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* Results Count & Clear Banner */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase px-1">
                  <span>Displaying {processedProducts.length} {processedProducts.length === 1 ? 'product' : 'products'} from {seller.storeName}</span>
                  {activeFiltersCount > 0 && (
                    <button 
                      onClick={resetAllFilters} 
                      className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer lowercase flex items-center gap-1 font-bold"
                    >
                      <RotateCcw className="w-3 h-3" /> clear all filters ({activeFiltersCount})
                    </button>
                  )}
                </div>

                {/* Empty State */}
                {processedProducts.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl py-16 text-center shadow-xs space-y-3 px-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">No products match your criteria</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      We couldn&apos;t find any items matching &ldquo;{selectedCategory !== 'All' ? selectedCategory : ''} {selectedBrand !== 'All' ? selectedBrand : ''} {searchQuery}&rdquo; in {seller.storeName}&apos;s inventory.
                    </p>
                    <button
                      onClick={resetAllFilters}
                      className="mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : gridView === 'list' ? (
                  /* ========================================================================= */
                  /* LIST VIEW: One product on each line */
                  /* ========================================================================= */
                  <div className="space-y-4">
                    {processedProducts.map(({ product: prod, offer }) => {
                      const isWishlisted = wishlist.includes(prod.id);
                      const ratingInfo = getProductRatingDetails(prod);
                      const price = offer ? offer.price : parsePriceNumber(String(prod.price));
                      const originalPrice = offer?.originalPrice || (prod.originalPrice ? parsePriceNumber(String(prod.originalPrice)) : undefined);
                      const sale = getProductSaleDetails(prod);

                      return (
                        <div 
                          key={prod.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 overflow-hidden hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between"
                        >
                          {/* Left: Image Stage */}
                          <div 
                            onClick={() => onSelectProduct(prod.id)}
                            className="relative w-full sm:w-44 md:w-52 aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-xl sm:rounded-2xl shrink-0 cursor-pointer border border-slate-100 dark:border-slate-800"
                          >
                            <SafeImage 
                              src={prod.imageUrl} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              alt={prod.name} 
                              placeholderType="product"
                              fallbackTitle={prod.name}
                              loading="lazy"
                            />

                            {/* Badges Overlay */}
                            <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-extrabold text-[10px] tracking-wider uppercase backdrop-blur-xs">
                                {offer?.condition || 'Brand New'}
                              </span>
                              {sale.isSale && (
                                <div className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs flex items-center gap-1">
                                  <Tag className="w-2 h-2 text-white" />
                                  <span>{sale.badgeText || 'SALE'}</span>
                                </div>
                              )}
                            </div>

                            {/* Top-Right Action Stack */}
                            <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleWishlist(prod.id, prod.name);
                                }}
                                className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                              >
                                <Heart className={`w-4 h-4 stroke-[2.5] ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTriggerQuickView(prod, offer);
                                }}
                                className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-blue-600 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                                title="Quick View"
                              >
                                <Eye className="w-4 h-4 stroke-[2.5]" />
                              </button>
                            </div>
                          </div>

                          {/* Right: Details & Action Row */}
                          <div className="flex-1 min-w-0 space-y-2.5 w-full flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                {prod.category && (
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                                    {prod.category}
                                  </span>
                                )}
                                {prod.brand && (
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                                    • {prod.brand}
                                  </span>
                                )}
                              </div>
                              <h3 
                                onClick={() => onSelectProduct(prod.id)}
                                className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition line-clamp-2 cursor-pointer w-full leading-snug"
                              >
                                {prod.name}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {prod.description}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap pt-1">
                                <StockBadge product={prod} size="md" />
                                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200/60 dark:border-amber-900/50 text-amber-900 dark:text-amber-400 text-xs font-extrabold">
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
                                  <span>{offer?.rating?.toFixed(1) || ratingInfo.ratingFormatted}</span>
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  Ships in {offer?.shippingDays || 2} days
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap">
                              <div>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Store Offer Price</span>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(price)}</span>
                                  {originalPrice && originalPrice > price && (
                                    <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-semibold">{formatCurrency(originalPrice)}</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleTriggerQuickView(prod, offer)}
                                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <Eye className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                  <span className="hidden sm:inline">Quick View</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (offer) {
                                      onAddToCart(prod, 1, offer);
                                    } else {
                                      onAddToCart(prod, 1);
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                                >
                                  <ShoppingCart className="w-3 h-3" /> Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* GRID VIEW (4 Columns Responsive Matching ShopPage.tsx) */
                  /* ========================================================================= */
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4">
                    {processedProducts.map(({ product: prod, offer }) => {
                      const isWishlisted = wishlist.includes(prod.id);
                      const ratingInfo = getProductRatingDetails(prod);
                      const price = offer ? offer.price : parsePriceNumber(String(prod.price));
                      const originalPrice = offer?.originalPrice || (prod.originalPrice ? parsePriceNumber(String(prod.originalPrice)) : undefined);
                      const sale = getProductSaleDetails(prod);

                      return (
                        <div 
                          key={prod.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                        >
                          {/* Image Stage */}
                          <div 
                            onClick={() => onSelectProduct(prod.id)}
                            className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-950 cursor-pointer border-b border-slate-100 dark:border-slate-800"
                          >
                            <SafeImage 
                              src={prod.imageUrl} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                              alt={prod.name} 
                              placeholderType="product"
                              fallbackTitle={prod.name}
                              loading="lazy"
                            />

                            {/* Badges Overlay */}
                            <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-extrabold text-[10px] tracking-wider uppercase backdrop-blur-xs">
                                {offer?.condition || 'Brand New'}
                              </span>
                              {sale.isSale && (
                                <div className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs flex items-center gap-1">
                                  <Tag className="w-2 h-2 text-white" />
                                  <span>{sale.badgeText || 'SALE'}</span>
                                </div>
                              )}
                              {(prod.isFeatured || (!sale.isSale && prod.isFeatured !== false)) && (
                                <div className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[10px] tracking-wider uppercase border border-slate-700/50 shadow-2xs flex items-center gap-1">
                                  <Crown className="w-2 h-2 text-amber-400" />
                                  <span>Featured</span>
                                </div>
                              )}
                            </div>

                            {/* Top-Right Action Stack */}
                            <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleWishlist(prod.id, prod.name);
                                }}
                                className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                              >
                                <Heart className={`w-4 h-4 stroke-[2.5] ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTriggerQuickView(prod, offer);
                                }}
                                className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-blue-600 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                                title="Quick View"
                              >
                                <Eye className="w-4 h-4 stroke-[2.5]" />
                              </button>
                            </div>
                          </div>

                          {/* Content Container */}
                          <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
                            <div className="cursor-pointer" onClick={() => onSelectProduct(prod.id)}>
                              {prod.category && (
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-wider">
                                  <span>{prod.category}</span>
                                </div>
                              )}
                              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug w-full">
                                {prod.name}
                              </h3>
                              <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                                <StockBadge product={prod} />
                                <div className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/50 text-[10px] font-extrabold w-max">
                                  <Star className="w-2 h-2 fill-amber-400 text-amber-500 shrink-0" />
                                  <span>{offer?.rating?.toFixed(1) || ratingInfo.ratingFormatted}</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                              <div>
                                <div className="flex items-baseline gap-1 flex-wrap">
                                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{formatCurrency(price)}</span>
                                  {originalPrice && originalPrice > price && (
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-semibold">{formatCurrency(originalPrice)}</span>
                                  )}
                                </div>
                                <span className="text-[9px] text-slate-400 block">
                                  Ships in {offer?.shippingDays || 2}d
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  if (offer) {
                                    onAddToCart(prod, 1, offer);
                                  } else {
                                    onAddToCart(prod, 1);
                                  }
                                }}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer shadow-2xs active:scale-95"
                                title="Add to Cart"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Desktop Filter Sidebar (3 Columns on Right) */}
              <div className="hidden lg:block lg:col-span-3">
                {renderFilterSidebar()}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ABOUT & POLICIES */}
        {/* ========================================================================= */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              
              {/* Detailed Store Story */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-blue-600" /> About {seller.storeName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {seller.description}
                </p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[10px]">Business Registration / Tax ID</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{seller.taxOrRegistrationId}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[10px]">Merchant Category</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{seller.accountType.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Fulfillment SLA Policy */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" /> Shipping & Fulfillment Policy
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Orders placed with {seller.storeName} are dispatched directly from our regional fulfillment hub in {seller.location || 'South Africa'}. We adhere strictly to a {seller.dispatchSla || '1-2 business day'} handling turnaround. Once handed to courier partners (The Courier Guy / RAM Hand-to-Hand), a real-time waybill tracking link is automatically dispatched via email.
                </p>
              </div>

              {/* Returns & Warranty */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-purple-600" /> Return Guarantee & Warranty
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  All products sold by {seller.storeName} come backed by our verified {seller.returnPolicyDays || 30}-day return window. If items arrive damaged or do not meet condition specifications, full replacements or refunds are processed seamlessly through Mrbulk customer escrow.
                </p>
              </div>

            </div>

            {/* Merchant Verification Card */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" /> Merchant Verification
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>CIPC Company Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>FNB / Standard Bank Verified EFT Escrow</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>SARS Tax Compliance Validated</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>South African Consumer Protection Act Adherent</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" /> Message Merchant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CUSTOMER RATINGS */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Customer Reviews & Ratings</h3>
                <p className="text-xs text-slate-500">Verified buyer ratings from orders fulfilled by {seller.storeName}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{seller.rating?.toFixed(1) || '4.9'}</span>
                  <span className="text-xs text-slate-400 block font-semibold">out of 5.0</span>
                </div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Verified Reviews List */}
            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  author: 'Marthinus V.',
                  city: 'Pretoria East',
                  date: '2 weeks ago',
                  rating: 5,
                  comment: 'Lightning fast shipping. Ordered on Tuesday afternoon and received courier delivery in Pretoria by Thursday morning. Pristine packaging.',
                  verified: true
                },
                {
                  author: 'Naledi K.',
                  city: 'Sandton',
                  date: '1 month ago',
                  rating: 5,
                  comment: 'Item arrived in immaculate brand new condition with all factory seals intact. Excellent communication when I asked about specs.',
                  verified: true
                },
                {
                  author: 'David S.',
                  city: 'Cape Town',
                  date: '1 month ago',
                  rating: 4,
                  comment: 'Accurate description and competitive price compared to retail stores. Recommended seller.',
                  verified: true
                }
              ].map((rev, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">{rev.author}</span>
                      <span className="text-[11px] text-slate-400">({rev.city})</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          <CheckCircle2 className="w-2 h-2" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-400 mb-2">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Explore Other Verified Merchants Section */}
      {allSellers && allSellers.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Explore Other Verified Merchants
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse official brand distributors and certified South African partners
              </p>
            </div>
            <Link
              href="/store"
              className={`text-xs font-bold ${currentTheme.text} hover:underline flex items-center gap-1 transition`}
            >
              <span>View All Sellers Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSellers
              .filter((s) => s.id !== seller.id)
              .slice(0, 3)
              .map((other) => (
                <Link
                  key={other.id}
                  href={`/store/${other.id}`}
                  className="group p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                    <SafeImage
                      src={other.logoUrl}
                      alt={other.storeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      placeholderType="product"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-xs font-extrabold text-slate-900 dark:text-white truncate ${currentTheme.groupHoverText} transition-colors`}>
                        {other.storeName}
                      </h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {other.location || 'South Africa'} • {other.dispatchSla || '1-2 Days'}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{other.rating?.toFixed(1) || '4.9'}</span>
                      <span className="text-slate-400 font-normal">({other.ordersCount || 30}+ orders)</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        <RecentlyViewedSection products={products} />
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FILTERS DRAWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white dark:bg-slate-900 w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filter Store Products
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 overflow-y-auto space-y-4">
                {renderFilterSidebar()}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/40">
                <button
                  onClick={resetAllFilters}
                  className="w-1/3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer"
                >
                  Apply & View ({processedProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* LOCAL QUICK VIEW MODAL (Fallback if parent doesn't provide global handler) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {localQuickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setLocalQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <SafeImage
                    src={localQuickViewProduct.product.imageUrl}
                    alt={localQuickViewProduct.product.name}
                    className="w-full h-full object-cover"
                    placeholderType="product"
                  />
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {localQuickViewProduct.product.category || 'Product'} • {seller.storeName}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {localQuickViewProduct.product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 dark:bg-blue-600 text-white font-extrabold text-[10px]">
                      {localQuickViewProduct.offer?.condition || 'Brand New'}
                    </span>
                    <StockBadge product={localQuickViewProduct.product} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {localQuickViewProduct.product.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {formatCurrency(localQuickViewProduct.offer ? localQuickViewProduct.offer.price : parsePriceNumber(String(localQuickViewProduct.product.price)))}
                    </span>
                  </div>

                  <div className="pt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onAddToCart(localQuickViewProduct.product, 1, localQuickViewProduct.offer || undefined);
                        setLocalQuickViewProduct(null);
                      }}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        onSelectProduct(localQuickViewProduct.product.id);
                        setLocalQuickViewProduct(null);
                      }}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Full Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CONTACT MERCHANT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Message {seller.storeName}</h3>
                    <p className="text-xs text-slate-500">Direct verified inquiry via Mrbulk Escrow Portal</p>
                  </div>
                </div>

                {isMessageSent ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                    <h4 className="text-base font-black text-slate-900 dark:text-white">Message Sent Successfully!</h4>
                    <p className="text-xs text-slate-500">The merchant has received your inquiry and will respond within 4 business hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-3.5 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Contact Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. buyer@domain.co.za"
                        value={contactSenderEmail}
                        onChange={(e) => setContactSenderEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Inquiry Subject
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium cursor-pointer"
                      >
                        <option value="Product Inquiry">Product Inquiry / Specifications</option>
                        <option value="Bulk Order Request">Wholesale / Bulk Volume Order</option>
                        <option value="Delivery Question">Shipping & Waybill Inquiry</option>
                        <option value="Warranty Question">Warranty & Return Question</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write your message to the merchant..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                    >
                      <Send className="w-3 h-3" /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default StorefrontView;
