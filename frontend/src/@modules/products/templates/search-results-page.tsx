'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/utils/pricing';
import { getProductSaleDetails } from '@/utils/productUtils';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Plus, 
  ShoppingBag, 
  Check, 
  RotateCcw, 
  X, 
  Star, 
  ArrowUpDown,
  Crown,
  Tag,
  Grid3X3,
  List,
  Eye,
  Shuffle
} from 'lucide-react';
import { MockCategory, MockProduct } from '@/types';
import { getProductUrl, getCategoryUrl, getShopUrl, updateSEOMetadata } from '@/utils/seoUtils';
import { CategoryBarCarousel } from '@components/shared/category-bar';
import { PageBanner } from '@components/shared/page-banner';
import { useCatalog } from '@/providers/catalog-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses } from '@/providers/theme-provider';
import { useUI } from '@/providers/ui-provider';

interface SearchResultsPageProps {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  products?: MockProduct[];
  categories?: MockCategory[];
  wishlist?: string[];
  handleToggleWishlist?: (id: string, name: string) => void;
  handleAddToCart?: (product: any) => void;
  onSelectProduct?: (productId: string) => void;
  onSelectCategory?: (categoryName: string) => void;
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses?: (color: string) => any;
  onQuickView?: (product: MockProduct) => void;
  onBackToHome?: () => void;
}

const TRENDING_TAGS = [
  'Wooden Chair',
  'Wireless Headphones',
  'Mechanical Keyboard',
  'Leather Wallet',
  'Ceramic Lamp',
  'Smartwatch',
  'Ergonomic Desk',
  'Smart Home Hub'
];

export default function SearchResultsPage({
  searchQuery: propSearchQuery,
  onSearchQueryChange: propOnSearchQueryChange,
  products: propProducts,
  categories: propCategories,
  wishlist: propWishlist,
  handleToggleWishlist: propHandleToggleWishlist,
  handleAddToCart: propHandleAddToCart,
  onSelectProduct: propOnSelectProduct,
  onSelectCategory: propOnSelectCategory,
  themeColor: propThemeColor,
  getThemeClasses: propGetThemeClasses,
  onQuickView: propOnQuickView,
  onBackToHome: propOnBackToHome,
}: SearchResultsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catalogCtx = useCatalog();
  const wishlistCtx = useWishlistContext();
  const cartCtx = useCartContext();
  const themeCtx = useThemeContext();
  const uiCtx = useUI();

  const urlQuery = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(propSearchQuery ?? urlQuery);

  useEffect(() => {
    if (propSearchQuery !== undefined) {
      setLocalQuery(propSearchQuery);
    } else if (urlQuery) {
      setLocalQuery(urlQuery);
    }
  }, [propSearchQuery, urlQuery]);

  const searchQuery = propSearchQuery ?? localQuery;
  const onSearchQueryChange = propOnSearchQueryChange ?? ((q: string) => {
    setLocalQuery(q);
    const newParams = new URLSearchParams(searchParams.toString());
    if (q) newParams.set('q', q);
    else newParams.delete('q');
    router.replace(`/search?${newParams.toString()}`);
  });

  const products = propProducts ?? catalogCtx.products;
  const categories = propCategories ?? catalogCtx.categories;
  const wishlist = propWishlist ?? wishlistCtx.wishlist;
  const handleToggleWishlist = propHandleToggleWishlist ?? wishlistCtx.toggleWishlist;
  const handleAddToCart = propHandleAddToCart ?? cartCtx.addToCart;
  const onSelectProduct = propOnSelectProduct ?? ((id: string) => router.push(getProductUrl(id)));
  const onSelectCategory = propOnSelectCategory ?? ((cat: string) => router.push(getCategoryUrl(cat)));
  const themeColor = propThemeColor ?? themeCtx.themeColor;
  const getThemeClasses = propGetThemeClasses ?? defaultGetThemeClasses;
  const onQuickView = propOnQuickView ?? uiCtx.openQuickView;
  const onBackToHome = propOnBackToHome ?? (() => router.push('/'));

  const currentTheme = getThemeClasses(themeColor);

  // Filters State copied from ShopPage
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'random' | 'price-asc' | 'price-desc' | 'newest' | 'rating-desc'>('random');
  const [gridView, setGridView] = useState<'cols-4' | 'list'>('cols-4');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [addedProductIds, setAddedProductIds] = useState<Record<string, boolean>>({});

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

  // Update SEO metadata dynamically for search results page
  useEffect(() => {
    const title = searchQuery.trim() 
      ? `Search results for "${searchQuery}" | Mrbulk`
      : 'Product Search & Discovery | Mrbulk';
    const description = `Find wholesale and retail products for "${searchQuery || 'all categories'}" with fast delivery across South Africa at Mrbulk (mrbulk.co.za).`;
    const canonicalPath = getShopUrl({
      search: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      sort: sortBy
    });
    updateSEOMetadata(title, description, canonicalPath);
  }, [searchQuery, selectedCategory, sortBy]);

  // Color options copied from ShopPage
  const colorOptions = [
    { id: 'all', label: 'All Colors', bg: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' },
    { id: 'black', label: 'Black', bg: 'bg-slate-900' },
    { id: 'silver', label: 'Silver', bg: 'bg-slate-300' },
    { id: 'gold', label: 'Gold', bg: 'bg-amber-400' },
    { id: 'white', label: 'White', bg: 'bg-white border border-slate-300' },
    { id: 'blue', label: 'Blue', bg: 'bg-blue-600' },
    { id: 'brown', label: 'Brown', bg: 'bg-amber-800' },
  ];

  // Rating options copied from ShopPage
  const ratingOptions = [
    { id: 'all', label: 'All Reviews' },
    { id: '4.5', label: '4.5★ & above' },
    { id: '4.0', label: '4.0★ & above' },
    { id: '3.5', label: '3.5★ & above' },
  ];

  // Helper to map categoryId to Category Name
  const getCategoryName = (catId?: number) => {
    if (!catId) return 'General';
    const match = categories.find((c) => c.id === catId);
    return match ? match.name : 'General';
  };

  // Product rating helper
  const getProductRating = (prodId: string): number => {
    switch (prodId) {
      case 'prod-1': return 4.9;
      case 'prod-2': return 4.8;
      case 'prod-3': return 4.9;
      case 'prod-4': return 4.7;
      case 'prod-5': return 4.8;
      case 'prod-6': return 4.9;
      default: {
        const num = parseInt(prodId.replace(/[^0-9]/g, ''), 10) || 1;
        return parseFloat((4.2 + (num % 8) * 0.1).toFixed(1));
      }
    }
  };

  // Product colors helper
  const getProductColors = (prodId: string): string[] => {
    switch (prodId) {
      case 'prod-1': return ['black', 'silver', 'blue'];
      case 'prod-2': return ['gold', 'black', 'brown'];
      case 'prod-3': return ['black', 'silver'];
      case 'prod-4': return ['white', 'silver', 'red'];
      case 'prod-5': return ['black', 'gold'];
      case 'prod-6': return ['white', 'black', 'blue'];
      default: return ['black', 'silver', 'white'];
    }
  };

  // Parse numeric price for sorting
  const getNumericPrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  const getProductBrand = (p: MockProduct): string => {
    if (p.brand) return p.brand;
    switch (p.id) {
      case 'prod-1': return 'Nova';
      case 'prod-2': return 'Reddison';
      case 'prod-3': return 'Wetell';
      case 'prod-4': return 'Apex Labs';
      case 'prod-5': return 'Condere';
      case 'prod-6': return 'Sunlight';
      default: return 'Unbranded';
    }
  };

  // Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let result = [...products];
    const query = searchQuery.trim().toLowerCase();

    // 1. Filter by search query
    if (query !== '') {
      result = result.filter((p) => {
        const catName = getCategoryName(p.categoryId);
        const brandName = getProductBrand(p);
        return (
          p.name.toLowerCase().includes(query) ||
          catName.toLowerCase().includes(query) ||
          brandName.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
        );
      });
    }

    // 2. Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => getCategoryName(p.categoryId).toLowerCase() === selectedCategory.toLowerCase());
    }

    // 3. Filter by rating
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      result = result.filter((p) => getProductRating(p.id) >= minRating);
    }

    // 4. Filter by color
    if (selectedColor !== 'all') {
      result = result.filter((p) => getProductColors(p.id).includes(selectedColor));
    }

    // 5. Sorting
    if (sortBy === 'random') {
      result.sort((a, b) => (randomScores[a.id] ?? 0) - (randomScores[b.id] ?? 0));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => getProductRating(b.id) - getProductRating(a.id));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedRating, selectedColor, sortBy, categories, randomScores]);

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + 
                             (selectedRating !== 'all' ? 1 : 0) + 
                             (selectedColor !== 'all' ? 1 : 0) +
                             (sortBy !== 'random' ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedRating('all');
    setSelectedColor('all');
    setSortBy('random');
  };

  const handleAddWithFeedback = (p: MockProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(p);
    setAddedProductIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedProductIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
  };

  const categoryNameList = ['All', ...categories.map((c) => c.name)];

  // Render Filter Sidebar Component (matches ShopPage)
  const renderFilterSidebar = () => (
    <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
          <SlidersHorizontal className={`w-4 h-4 ${currentTheme.text}`} /> Filter Results
        </h3>
        {activeFiltersCount > 0 && (
          <button 
            onClick={resetAllFilters}
            className={`text-[11px] font-extrabold ${currentTheme.text} flex items-center gap-1 cursor-pointer transition`}
          >
            <RotateCcw className="w-3 h-3" /> Reset ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* 1. Category Select */}
      <div className="space-y-3">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Select Category
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1.5 scrollbar-thin">
          {categoryNameList.map((catName) => {
            const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();
            return (
              <a
                key={catName}
                href={getShopUrl({ search: searchQuery, category: catName, sort: sortBy })}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(catName);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left no-underline block ${
                  isSelected 
                    ? `${currentTheme.bg} text-white shadow-xs` 
                    : 'bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent'
                }`}
              >
                <span>{catName}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </a>
            );
          })}
        </div>
      </div>

      {/* 2. Filter by Reviews */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Customer Reviews
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1.5 scrollbar-thin">
          {ratingOptions.map((opt) => {
            const isSelected = selectedRating === opt.id;
            return (
              <a
                key={opt.id}
                href={getShopUrl({ search: searchQuery, category: selectedCategory, rating: opt.id, sort: sortBy })}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedRating(opt.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer no-underline block ${
                  isSelected 
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold' 
                    : 'bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              </a>
            );
          })}
        </div>
      </div>

      {/* 3. Filter by Color */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Filter by Color
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1.5 scrollbar-thin">
          {colorOptions.map((color) => {
            const isSelected = selectedColor === color.id;
            return (
              <a
                key={color.id}
                href={getShopUrl({ search: searchQuery, category: selectedCategory, color: color.id, sort: sortBy })}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border no-underline ${
                  isSelected 
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-200 font-bold shadow-2xs' 
                    : 'bg-slate-50 dark:bg-slate-700/60 border-slate-200/80 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${color.bg}`} />
                <span className="truncate">{color.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-16 sm:pb-24 space-y-6 sm:space-y-8">
      
      {/* Category Quick Navigation Control Bar */}
      <CategoryBarCarousel
        categories={categories}
        products={products}
        themeColor={themeColor}
        currentTheme={currentTheme}
        selectedCategory={selectedCategory}
        onSelectCategory={(categoryName) => {
          setSelectedCategory(categoryName);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewAllCategories={() => {
          if (onSelectCategory) {
            onSelectCategory('All');
          }
        }}
      />

      {/* Search Header Banner */}
      <PageBanner
        title={searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Explore All Search Results'}
        description={`${processedProducts.length} ${processedProducts.length === 1 ? 'item' : 'items'} found matching your search criteria across our luxury departments.`}
        badge="Catalog Search"
        themeColor="blue"
        onBack={onBackToHome}
        backLabel="Back to Home"
        backgroundImage="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1400&fm=webp"
        backgroundAlt="Search Catalog"
        overlayGradient="bg-gradient-to-b from-white/70 via-white/40 to-white/70 dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-950/85"
        actions={
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
              Popular Searches:
            </span>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {TRENDING_TAGS.map((tag) => (
                <a
                  key={tag}
                  href={getShopUrl({ search: tag })}
                  onClick={(e) => {
                    e.preventDefault();
                    onSearchQueryChange(tag);
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition cursor-pointer no-underline ${
                    searchQuery.toLowerCase() === tag.toLowerCase()
                      ? 'bg-blue-600 text-white border-blue-500 shadow-2xs font-bold'
                      : 'bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 border-slate-300/80 dark:border-white/15 shadow-2xs'
                  }`}
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Control Bar (Copied from ShopPage) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Sort Dropdown Selector */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <label htmlFor="search-sort-select" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className={`w-3.5 h-3.5 ${currentTheme.text}`} />
              <span>Sort By:</span>
            </label>
            <select
              id="search-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:border-slate-400 rounded-xl px-3.5 py-2 text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none transition shadow-2xs cursor-pointer w-full sm:w-64"
            >
              <option value="random">Random</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filters Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold shadow-xs hover:bg-slate-800 dark:hover:bg-slate-600 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className={`${currentTheme.bg} text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center`}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Layout Grid vs List view toggler */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 p-1 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <button 
                onClick={() => setGridView('cols-4')}
                className={`p-1.5 px-3 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  gridView === 'cols-4' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button 
                onClick={() => setGridView('list')}
                className={`p-1.5 px-3 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  gridView === 'list' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="List View (1 per line)"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

        </div>

        {/* Desktop Layout Grid (Filters Sidebar Right or Left + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Main Products Grid Column */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Count & Reset Header */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase px-1">
              <span>Displaying {processedProducts.length} items found</span>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={resetAllFilters} 
                  className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer lowercase"
                >
                  clear active filters ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Empty State vs Products Grid */}
            {processedProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-8 sm:p-12 text-center my-4 space-y-4 shadow-xs">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  No matching products found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  We couldn't find any products matching your filters or search term &ldquo;<span className="font-bold text-slate-700 dark:text-slate-300">{searchQuery}</span>&rdquo;. Try resetting rating, color, or category filters.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
                  </button>
                </div>
              </div>
            ) : gridView === 'list' ? (
              /* LIST VIEW: One product on each line */
              <div className="space-y-4">
                {processedProducts.map((prod) => {
                  const ratingScore = getProductRating(prod.id);

                  return (
                    <a 
                      key={prod.id}
                      href={getProductUrl(prod.id, prod.name)}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProduct(prod.id);
                      }}
                      className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between no-underline block"
                    >
                      {/* Left: Image Container */}
                      <div 
                        className="relative w-full sm:w-44 md:w-52 aspect-square overflow-hidden bg-slate-50 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl shrink-0"
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
                        {onQuickView && (
                          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onQuickView(prod);
                              }}
                              className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer"
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Details & Action Row */}
                      <div className="flex-1 min-w-0 space-y-2.5 w-full flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h3 
                            className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 w-full leading-snug"
                          >
                            {prod.name}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <StockBadge product={prod} size="md" />
                            <div className="flex items-center gap-0.5 bg-amber-50/80 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[10px] sm:text-[11px] font-extrabold w-max">
                              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400 shrink-0" />
                              <span>{ratingScore}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex-wrap">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Price</span>
                            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(prod.price)}</span>
                          </div>

                          {onQuickView && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onQuickView(prod);
                                }}
                                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                <span>Quick View</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </a>
                  );
                })}
              </div>
            ) : (
              /* GRID VIEW (4-Column dense grid) */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
                {processedProducts.map((prod) => {
                  const ratingScore = getProductRating(prod.id);

                  return (
                    <a 
                      key={prod.id}
                      href={getProductUrl(prod.id, prod.name)}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProduct(prod.id);
                      }}
                      className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer relative no-underline block"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-700/50">
                        <SafeImage 
                          src={prod.imageUrl} 
                          alt={prod.name}
                          placeholderType="product"
                          fallbackTitle={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                          loading="lazy"
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
                        {onQuickView && (
                          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onQuickView(prod);
                              }}
                              className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 bg-white dark:bg-slate-800">
                        <div className="space-y-1.5">
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-snug w-full transition-colors">
                            {prod.name}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <StockBadge product={prod} />
                            <div className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-200/50 dark:border-amber-800 text-[9px] sm:text-[10px] font-extrabold w-max">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500 shrink-0" />
                              <span>{ratingScore}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/80 mt-1">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                            {formatCurrency(prod.price)}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

          </div>

          {/* Desktop Filter Sidebar Column */}
          <div className="hidden lg:block lg:col-span-3">
            {renderFilterSidebar()}
          </div>

        </div>

      </div>

      {/* Mobile Filter Slideover Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-slate-800 z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto border-l border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filter Results
                  </h3>
                  <button 
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {renderFilterSidebar()}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-6">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white text-xs font-extrabold rounded-2xl shadow-md cursor-pointer hover:bg-slate-800 dark:hover:bg-slate-600"
                >
                  Apply & View {processedProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
