'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProductSaleDetails } from '@/utils/productUtils';
import { getProductUrl, getCategoryUrl, getBrandUrl, getShopUrl, updateSEOMetadata, formatCategoryName, decodeAndCleanText } from '@/utils/seoUtils';
import { getProductRating, getProductRatingDetails } from '@/utils/productRating';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { useCartContext } from '@/providers/cart-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses } from '@/providers/theme-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { useUI } from '@/providers/ui-provider';
import { 
  Heart, 
  Plus, 
  Search,
  SlidersHorizontal, 
  Grid3X3,
  List, 
  ShoppingBag,
  Sparkles,
  Star,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  Tag,
  Crown,
  ArrowUpDown,
  Eye,
  Shuffle,
  LayoutGrid,
  Layers,
  Laptop,
  Home,
  Shirt,
  Percent,
  Car,
  Briefcase,
  Plug,
  PawPrint,
  Dumbbell,
  Gamepad2,
  Wrench,
  ShieldAlert,
  Headphones,
  Watch,
  Footprints,
  Armchair,
  Lightbulb,
  Folder
} from 'lucide-react';
import { MockProduct } from '@/types';
import { formatCurrency } from '@/utils/pricing';
import { CategoryBarCarousel } from '@components/shared/category-bar';

interface ShopPageProps {
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses?: (color: string) => any;
  products?: MockProduct[];
  categories?: any[];
  brands?: any[];
  wishlist?: string[];
  handleToggleWishlist?: (id: string, name: string) => void;
  handleAddToCart?: (product: any) => void;
  initialCategoryFilter?: string;
  initialBrandFilter?: string;
  onSelectProduct?: (id: string) => void;
  onQuickView?: (product: MockProduct) => void;
  onNavigate?: (page: string) => void;
}

const CategoryIcon: React.FC<{ category: string; className?: string }> = ({ category, className = 'w-3.5 h-3.5' }) => {
  const cat = category.toLowerCase().trim();

  if (cat === 'all') return <LayoutGrid className={className} />;
  if (cat.includes('sale') || cat.includes('deal')) return <Percent className={className} />;
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

export default function ShopPage({
  themeColor: propThemeColor,
  getThemeClasses: propGetThemeClasses,
  products: propProducts,
  categories: categoriesProp,
  brands: brandsProp,
  wishlist: propWishlist,
  handleToggleWishlist: propHandleToggleWishlist,
  handleAddToCart: propHandleAddToCart,
  initialCategoryFilter,
  initialBrandFilter,
  onSelectProduct: propOnSelectProduct,
  onQuickView: propOnQuickView,
  onNavigate: propOnNavigate
}: ShopPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartCtx = useCartContext();
  const wishlistCtx = useWishlistContext();
  const themeCtx = useThemeContext();
  const catalogCtx = useCatalog();
  const uiCtx = useUI();

  const products = propProducts ?? catalogCtx.products;
  const categories = categoriesProp ?? catalogCtx.categories;
  const brands = brandsProp ?? catalogCtx.brands;
  const wishlist = propWishlist ?? wishlistCtx.wishlist;
  const themeColor = propThemeColor ?? themeCtx.themeColor;
  const getThemeClasses = propGetThemeClasses ?? defaultGetThemeClasses;
  const handleToggleWishlist = propHandleToggleWishlist ?? wishlistCtx.toggleWishlist;
  const handleAddToCart = propHandleAddToCart ?? cartCtx.addToCart;
  const onQuickView = propOnQuickView ?? uiCtx.openQuickView;
  const onSelectProduct = propOnSelectProduct ?? ((id: string) => router.push(getProductUrl(id)));
  const onNavigate = propOnNavigate ?? ((page: string) => router.push(page === 'home' ? '/' : `/${page}`));

  const categoryFromUrl = searchParams.get('category');
  const brandFromUrl = searchParams.get('brand');
  const effectiveCategoryFilter = initialCategoryFilter ?? (categoryFromUrl || 'All');
  const effectiveBrandFilter = initialBrandFilter ?? (brandFromUrl || 'All');

  const currentTheme = getThemeClasses(themeColor);
  
  // Search, Sorting, Categorization state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => formatCategoryName(effectiveCategoryFilter, categories));
  const [selectedBrand, setSelectedBrand] = useState<string>(() => {
    if (!effectiveBrandFilter || effectiveBrandFilter.toLowerCase() === 'all') return 'All';
    const cleaned = decodeAndCleanText(effectiveBrandFilter);
    const matched = brands.find(b => b.name?.toLowerCase() === cleaned.toLowerCase() || b.title?.toLowerCase() === cleaned.toLowerCase());
    return matched ? (matched.name || matched.title) : cleaned;
  });
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'random' | 'price-asc' | 'price-desc' | 'newest' | 'rating-desc'>('random');
  const [gridView, setGridView] = useState<'cols-4' | 'list'>('cols-4');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

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

  useEffect(() => {
    if (initialCategoryFilter) {
      setSelectedCategory(formatCategoryName(initialCategoryFilter, categoriesProp));
    }
  }, [initialCategoryFilter, categoriesProp]);

  useEffect(() => {
    if (initialBrandFilter) {
      if (initialBrandFilter.toLowerCase() === 'all') {
        setSelectedBrand('All');
      } else {
        const cleaned = decodeAndCleanText(initialBrandFilter);
        const matched = brandsProp.find(b => b.name.toLowerCase() === cleaned.toLowerCase());
        setSelectedBrand(matched ? matched.name : cleaned);
      }
    }
  }, [initialBrandFilter, brandsProp]);

  // Dynamically derive available categories from props and catalog
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    
    // Add from categoriesProp
    if (Array.isArray(categoriesProp)) {
      categoriesProp.forEach((c) => {
        const name = typeof c === 'string' ? c : c?.name;
        if (name) cats.add(name);
      });
    }

    // Add from products catalog
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });

    return Array.from(cats);
  }, [categoriesProp, products]);

  // Dynamically derive available brands from props and catalog
  const availableBrands = useMemo(() => {
    const brs = new Set<string>();
    brs.add('All');

    // Add from brandsProp
    if (Array.isArray(brandsProp)) {
      brandsProp.forEach((b) => {
        const name = typeof b === 'string' ? b : b?.name;
        if (name) brs.add(name);
      });
    }

    // Add from products catalog
    products.forEach((p) => {
      if (p.brand) brs.add(p.brand);
    });

    return Array.from(brs);
  }, [brandsProp, products]);

  // Update document title, description and canonical link
  useEffect(() => {
    let title = 'Shop All Collections | Mrbulk';
    if (selectedCategory !== 'All' && selectedBrand !== 'All') {
      title = `${selectedBrand} ${selectedCategory} | Shop Mrbulk`;
    } else if (selectedCategory !== 'All') {
      title = `${selectedCategory} Collection | Shop Mrbulk`;
    } else if (selectedBrand !== 'All') {
      title = `${selectedBrand} Store | Mrbulk`;
    }
    const description = `Explore our curated selection of ${selectedCategory !== 'All' ? selectedCategory.toLowerCase() : 'wholesale & retail'} products at Mrbulk. Fast delivery across South Africa.`;
    const canonicalPath = getShopUrl({
      category: selectedCategory,
      brand: selectedBrand,
      sort: sortBy,
      search: searchQuery
    });
    updateSEOMetadata(title, description, canonicalPath);
  }, [selectedCategory, selectedBrand, sortBy, searchQuery]);

  const colorOptions = [
    { id: 'all', label: 'All Colors', bg: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' },
    { id: 'black', label: 'Black', bg: 'bg-slate-900' },
    { id: 'silver', label: 'Silver', bg: 'bg-slate-300' },
    { id: 'gold', label: 'Gold', bg: 'bg-amber-400' },
    { id: 'white', label: 'White', bg: 'bg-white border border-slate-300' },
    { id: 'blue', label: 'Blue', bg: 'bg-blue-600' },
    { id: 'brown', label: 'Brown', bg: 'bg-amber-800' },
  ];

  const ratingOptions = [
    { id: 'all', label: 'All Reviews' },
    { id: '4.5', label: '4.5★ & above' },
    { id: '4.0', label: '4.0★ & above' },
    { id: '3.5', label: '3.5★ & above' },
  ];

  // Parse numeric price for sorting
  const getNumericPrice = (priceStr: string | number): number => {
    if (typeof priceStr === 'number') return priceStr;
    return parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
  };

  // Filtered and sorted products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => {
        if (!p.category) return false;
        return p.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
      });
    }

    // 2. Filter by brand
    if (selectedBrand && selectedBrand !== 'All') {
      result = result.filter(p => {
        if (!p.brand) return false;
        return p.brand.toLowerCase().trim() === selectedBrand.toLowerCase().trim();
      });
    }

    // 3. Filter by rating
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      result = result.filter(p => {
        const rating = getProductRating(p.id) || (p.rating ? parseFloat(String(p.rating)) : 4.8);
        return rating >= minRating;
      });
    }

    // 4. Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        const catMatch = p.category?.toLowerCase().includes(query);
        const brandMatch = p.brand?.toLowerCase().includes(query);
        const tagMatch = p.tags?.some((t: string) => t.toLowerCase().includes(query));
        return nameMatch || descMatch || catMatch || brandMatch || tagMatch;
      });
    }

    // 5. Sort
    if (sortBy === 'random') {
      result.sort((a, b) => (randomScores[a.id] ?? 0) - (randomScores[b.id] ?? 0));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => (getProductRating(b.id) || 4.8) - (getProductRating(a.id) || 4.8));
    }

    return result;
  }, [products, selectedCategory, selectedBrand, selectedRating, searchQuery, sortBy, randomScores]);

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + 
                             (selectedBrand !== 'All' ? 1 : 0) + 
                             (selectedRating !== 'all' ? 1 : 0) + 
                             (searchQuery ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedRating('all');
    setSelectedColor('all');
    setSearchQuery('');
    setSortBy('random');
  };

  const renderFilterSidebar = () => (
    <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
          <SlidersHorizontal className={`w-4 h-4 ${currentTheme.text}`} /> Filter Catalog
        </h3>
        {activeFiltersCount > 0 && (
          <button 
            onClick={resetAllFilters}
            className={`text-[11px] font-extrabold ${currentTheme.text} flex items-center gap-1 cursor-pointer transition hover:underline`}
          >
            <RotateCcw className="w-3 h-3" /> Reset ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Search Input Box */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Search Products
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Select */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Select Category
        </label>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1.5 scrollbar-thin">
          {availableCategories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const count = cat === 'All' 
              ? products.length 
              : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                  isSelected 
                    ? `${currentTheme.bg} text-white shadow-xs` 
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <CategoryIcon
                    category={cat}
                    className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-500'} shrink-0`}
                  />
                  <span className="truncate">{cat}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                    {count}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Select */}
      {availableBrands.length > 1 && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
            Filter by Brand
          </label>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1.5 scrollbar-thin">
            {availableBrands.map((brandName) => {
              const isSelected = selectedBrand.toLowerCase() === brandName.toLowerCase();
              const count = brandName === 'All'
                ? products.length
                : products.filter(p => p.brand?.toLowerCase() === brandName.toLowerCase()).length;

              return (
                <button
                  key={brandName}
                  type="button"
                  onClick={() => setSelectedBrand(brandName)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                    isSelected 
                      ? `${currentTheme.bg} text-white shadow-xs` 
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Tag className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-400'} shrink-0`} />
                    <span className="truncate">{brandName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                      {count}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Rating Filter */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Filter by Rating
        </label>
        <div className="space-y-1">
          {ratingOptions.map((opt) => {
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
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              </button>
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
        categories={categoriesProp}
        products={products}
        themeColor={themeColor}
        currentTheme={currentTheme}
        selectedCategory={selectedCategory}
        onSelectCategory={(categoryName) => {
          setSelectedCategory(categoryName);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewAllCategories={() => {
          if (onNavigate) {
            onNavigate('categories');
          }
        }}
      />

      {/* Category-Style Parallax Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full py-8 sm:py-12 px-4 sm:px-8 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm dark:shadow-xl border border-slate-200/90 dark:border-slate-800">
          <div className="absolute inset-0 z-0">
            <SafeImage 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&fm=webp" 
              alt="Shop Catalog"
              placeholderType="banner"
              className="w-full h-full object-cover opacity-60 dark:opacity-75 scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/70 dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-950/85" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3 sm:space-y-4">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400 select-none">
              <a 
                href="/" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (onNavigate) onNavigate('home');
                }} 
                className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 font-semibold no-underline text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Home
              </a>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-extrabold">Shop</span>
            </div>

            {/* Badge Pill */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/90 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300/80 dark:border-white/20 backdrop-blur-md shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Mrbulk Catalog
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {selectedCategory !== 'All' ? `${selectedCategory} Collection` : 'All Products & Collections'}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              Browse our complete catalog of {products.length} luxury products with real-time stock and fast delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Control Bar: Sort Dropdown & Layout Toggler */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Sort Dropdown Filter */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <label htmlFor="shop-sort-select" className="text-xs font-extrabold text-slate-700 dark:text-slate-200 whitespace-nowrap flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className={`w-3.5 h-3.5 ${currentTheme.text}`} />
              <span>Sort By:</span>
            </label>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-60">
                <select
                  id="shop-sort-select"
                  value={sortBy}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setSortBy(val);
                    if (val === 'random') {
                      reshuffleRandom();
                    }
                  }}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 rounded-xl pl-3.5 pr-9 py-2 text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none transition shadow-2xs cursor-pointer w-full appearance-none"
                >
                  <option value="random">Recommended / Random</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {sortBy === 'random' && (
                <button
                  onClick={reshuffleRandom}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700 shadow-2xs"
                  title="Reshuffle products randomly"
                >
                  <Shuffle className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold shadow-xs hover:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className={`${currentTheme.bg} text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center`}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Active filters pill list */}
            {activeFiltersCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200/60 dark:border-blue-800">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="hover:text-blue-900 dark:hover:text-blue-200 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700">
                    Brand: {selectedBrand}
                    <button onClick={() => setSelectedBrand('All')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Layout Grid vs List view toggler */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 p-1 rounded-xl bg-slate-50 dark:bg-slate-800">
              <button 
                onClick={() => setGridView('cols-4')}
                className={`p-1.5 px-2.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  gridView === 'cols-4' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button 
                onClick={() => setGridView('list')}
                className={`p-1.5 px-2.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  gridView === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

        </div>

        {/* Desktop Side-By-Side Layout (Products Left, Filters Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Main Products Grid or List */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Results count header */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase px-1">
              <span>Displaying {processedProducts.length} {processedProducts.length === 1 ? 'product' : 'products'}</span>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={resetAllFilters} 
                  className={`${currentTheme.text} hover:underline cursor-pointer lowercase flex items-center gap-1 font-bold`}
                >
                  <RotateCcw className="w-3 h-3" /> clear all filters
                </button>
              )}
            </div>

            {processedProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl py-16 text-center shadow-xs space-y-3 px-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">No products matched your criteria</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  We couldn&apos;t find any items matching &ldquo;{selectedCategory !== 'All' ? selectedCategory : ''} {selectedBrand !== 'All' ? selectedBrand : ''} {searchQuery}&rdquo;. Try resetting your filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  className={`mt-3 px-5 py-2.5 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs ${currentTheme.bg}`}
                >
                  Reset All Filters
                </button>
              </div>
            ) : gridView === 'list' ? (
              /* LIST VIEW: One product on each line */
              <div className="space-y-4">
                {processedProducts.map((prod) => {
                  const isWishlisted = wishlist.includes(prod.id);
                  const ratingInfo = getProductRatingDetails(prod);

                  return (
                    <div 
                      key={prod.id}
                      className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between"
                    >
                      {/* Left: Image Container */}
                      <div 
                        onClick={() => onSelectProduct(prod.id)}
                        className="relative w-full sm:w-40 md:w-48 aspect-square overflow-hidden bg-slate-50 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl shrink-0 cursor-pointer"
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
                        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWishlist(prod.id, prod.name);
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
                              className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-blue-600 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer"
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right: Details & Action Row */}
                      <div className="flex-1 min-w-0 space-y-2.5 w-full flex flex-col justify-between">
                        <div className="space-y-1.5">
                          {prod.category && (
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                              {prod.category}
                            </div>
                          )}
                          <h3 
                            onClick={() => onSelectProduct(prod.id)}
                            className={`text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:${currentTheme.text} transition line-clamp-2 cursor-pointer w-full leading-snug`}
                          >
                            {prod.name}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap" suppressHydrationWarning>
                            <StockBadge product={prod} size="md" />
                            {ratingInfo.hasReviews ? (
                              <div className="flex items-center gap-0.5 bg-amber-50/80 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/50 text-amber-900 dark:text-amber-400 text-[10px] sm:text-[11px] font-extrabold w-max" suppressHydrationWarning>
                                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400 shrink-0" />
                                <span>{ratingInfo.ratingFormatted} ({ratingInfo.reviewCount})</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px] font-medium w-max" suppressHydrationWarning>
                                <Star className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600 shrink-0" />
                                <span>0.0 (0)</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap">
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Price</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(prod.price)}</span>
                              {prod.originalPrice && (
                                <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-semibold">{formatCurrency(prod.originalPrice)}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {onQuickView && (
                              <button
                                onClick={() => onQuickView(prod)}
                                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                <span className="hidden sm:inline">Quick View</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              /* GRID VIEW (4-Column dense grid) */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
                {processedProducts.map((prod) => {
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
                              handleToggleWishlist(prod.id, prod.name);
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
                              className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-blue-600 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer"
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
                              <div className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 text-[9px] sm:text-[10px] font-medium w-max" suppressHydrationWarning>
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
            )}

          </div>

          {/* Right Filters Sidebar (Desktop Screen Only) */}
          <div className="hidden lg:block lg:col-span-3">
            {renderFilterSidebar()}
          </div>

        </div>

      </div>

      {/* Mobile Drawer Filter Sidebar */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden" 
              onClick={() => setMobileFiltersOpen(false)} 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-800 shadow-2xl p-5 overflow-y-auto lg:hidden flex flex-col justify-between border-l border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Filter Catalog
                  </h3>
                  <button 
                    onClick={() => setMobileFiltersOpen(false)} 
                    className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderFilterSidebar()}
              </div>

              <button 
                onClick={() => setMobileFiltersOpen(false)} 
                className={`w-full py-3 text-white font-bold text-xs rounded-xl mt-6 shadow-md cursor-pointer ${currentTheme.bg}`}
              >
                Apply & View ({processedProducts.length}) Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
