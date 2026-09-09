'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { getProductSaleDetails } from '@/utils/productUtils';
import { 
  Heart, 
  Plus, 
  SlidersHorizontal, 
  ShoppingBag,
  Award,
  BookOpen,
  Tag,
  Crown,
  Star,
  Check,
  RotateCcw,
  X,
  Search,
  List,
  Grid3X3,
  Eye,
  ArrowUpDown,
  Shuffle,
  ChevronDown
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { MockCategory, MockProduct } from '@/types';
import { formatCurrency } from '@/utils/pricing';
import { getProductUrl, getCategoryUrl, getBrandUrl, getShopUrl, getCategoriesUrl, updateSEOMetadata, formatCategoryName } from '@/utils/seoUtils';
import { CategoryBarCarousel, PageBanner, RecentlyViewedSection } from '@/components/shared';
import { useCatalog } from '@/providers/catalog-provider';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses } from '@/providers/theme-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useUI } from '@/providers/ui-provider';

interface CategoryDetailPageProps {
  categoryName?: string;
  slug?: string;
  categories?: MockCategory[];
  products?: MockProduct[];
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses?: (color: string) => any;
  wishlist?: string[];
  handleToggleWishlist?: (id: string, name: string) => void;
  handleAddToCart?: (product: any) => void;
  onBack?: () => void;
  onSelectProduct?: (productId: string) => void;
  onQuickView?: (product: MockProduct) => void;
  onSelectCategory?: (categoryName: string) => void;
}

export default function CategoryDetailPage({
  categoryName: propCategoryName,
  slug: propSlug,
  categories: propCategories,
  products: propProducts,
  themeColor: propThemeColor,
  getThemeClasses: propGetThemeClasses,
  wishlist: propWishlist,
  handleToggleWishlist: propHandleToggleWishlist,
  handleAddToCart: propHandleAddToCart,
  onBack: propOnBack,
  onSelectProduct: propOnSelectProduct,
  onQuickView: propOnQuickView,
  onSelectCategory: propOnSelectCategory
}: CategoryDetailPageProps) {
  const router = useRouter();
  const params = useParams();
  const catalogCtx = useCatalog();
  const themeCtx = useThemeContext();
  const wishlistCtx = useWishlistContext();
  const cartCtx = useCartContext();
  const uiCtx = useUI();

  const categories = propCategories ?? catalogCtx.categories;
  const products = propProducts ?? catalogCtx.products;
  const themeColor = propThemeColor ?? themeCtx.themeColor;
  const getThemeClasses = propGetThemeClasses ?? defaultGetThemeClasses;
  const wishlist = propWishlist ?? wishlistCtx.wishlist;
  const handleToggleWishlist = propHandleToggleWishlist ?? wishlistCtx.toggleWishlist;
  const handleAddToCart = propHandleAddToCart ?? cartCtx.addToCart;
  const onBack = propOnBack ?? (() => router.push('/categories'));
  const onSelectProduct = propOnSelectProduct ?? ((id: string) => router.push(getProductUrl(id)));
  const onQuickView = propOnQuickView ?? uiCtx.openQuickView;
  const onSelectCategory = propOnSelectCategory ?? ((cat: string) => {
    if (cat.toLowerCase() === 'all') {
      router.push('/shop');
    } else {
      router.push(getCategoryUrl(cat));
    }
  });

  const slug = propSlug || (params?.slug as string) || '';
  const categoryName = propCategoryName || (slug ? formatCategoryName(slug, categories) : 'All');

  const currentTheme = getThemeClasses(themeColor);

  // Active Category State
  const initialResolvedCategory = formatCategoryName(categoryName, categories);
  const [activeCategory, setActiveCategory] = useState<string>(initialResolvedCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
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
    setActiveCategory(formatCategoryName(categoryName, categories));
  }, [categoryName, categories]);

  // Find category info
  const categoryInfo = useMemo(() => {
    return categories.find(c => c.name.toLowerCase() === activeCategory.toLowerCase()) || {
      id: 99,
      name: activeCategory,
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&fm=webp",
      description: `Premium and custom collections in our specialized ${activeCategory.toLowerCase()} department.`
    };
  }, [activeCategory, categories]);

  // Update SEO Title, Meta Description and Canonical Link dynamically
  useEffect(() => {
    let title = `${activeCategory} Department | Mrbulk`;
    if (selectedBrand !== 'All') {
      title = `${selectedBrand} ${activeCategory} | Mrbulk`;
    }
    const description = categoryInfo.description || `Browse quality retail and wholesale ${activeCategory} at Mrbulk (mrbulk.co.za). Discover top-rated items with fast delivery across South Africa.`;
    const canonicalPath = getCategoryUrl(activeCategory, {
      brand: selectedBrand,
      sort: sortBy
    });
    updateSEOMetadata(title, description, canonicalPath);
  }, [activeCategory, selectedBrand, sortBy, categoryInfo]);

  // Helper mappings
  const getProductCategoryName = (prodId: string): string => {
    switch (prodId) {
      case 'prod-1':
      case 'prod-3':
        return 'Electronics';
      case 'prod-2':
      case 'prod-4':
        return 'Home & Kitchen';
      case 'prod-5':
      case 'prod-6':
        return 'Apparel & Fashion';
      default:
        return 'General';
    }
  };

  const getProductRating = (prodId: string, name: string): number => {
    switch (prodId) {
      case 'prod-1': return 4.9;
      case 'prod-2': return 4.8;
      case 'prod-3': return 4.9;
      case 'prod-4': return 4.7;
      case 'prod-5': return 4.8;
      case 'prod-6': return 4.9;
      default: {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return parseFloat((4.6 + (Math.abs(hash) % 4) / 10).toFixed(1));
      }
    }
  };

  const getProductColors = (prodId: string, name: string): string[] => {
    switch (prodId) {
      case 'prod-1': return ['black', 'silver', 'blue'];
      case 'prod-2': return ['gold', 'black', 'brown'];
      case 'prod-3': return ['black', 'silver'];
      case 'prod-4': return ['white', 'silver', 'red'];
      case 'prod-5': return ['black', 'gold'];
      case 'prod-6': return ['white', 'black', 'blue'];
      default: {
        const lname = name.toLowerCase();
        if (lname.includes('black') || lname.includes('dark')) return ['black'];
        if (lname.includes('gold') || lname.includes('rose')) return ['gold'];
        if (lname.includes('silver') || lname.includes('clear')) return ['silver', 'white'];
        return ['black', 'silver', 'white'];
      }
    }
  };

  const getProductBrand = (prod: MockProduct): string => {
    if (prod.brand) return prod.brand;
    switch (prod.id) {
      case 'prod-1': return 'Nova';
      case 'prod-2': return 'Reddison';
      case 'prod-3': return 'Wetell';
      case 'prod-4': return 'Apex Labs';
      case 'prod-5': return 'Condere';
      case 'prod-6': return 'Sunlight';
      default: return 'Unbranded';
    }
  };

  const getNumericPrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  // List of all categories for sidebar
  const categoryNamesList = useMemo(() => {
    const list = ['All', ...categories.map(c => c.name)];
    if (!list.includes(activeCategory) && activeCategory !== 'All') {
      list.push(activeCategory);
    }
    return Array.from(new Set(list));
  }, [categories, activeCategory]);

  const brandsList = ['All', 'Nova', 'Reddison', 'Wetell', 'Apex Labs', 'Condere', 'Sunlight'];

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

  // Base raw items for the category
  const baseCategoryProducts = useMemo(() => {
    if (activeCategory === 'All') return products;

    if (activeCategory === 'Sale Items') {
      return products.filter(p => p.isSale || p.originalPrice).concat([
        {
          id: 'sale-1',
          name: 'Premium Wireless Headphones (Spring Sale)',
          price: '$149.00',
          imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop&fm=webp',
          url: '',
          description: 'Special seasonal price reduction.',
          isSale: true
        },
        {
          id: 'sale-2',
          name: 'Designer Retro Sunglasses (Flash Sale)',
          price: '$59.00',
          imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=600&auto=format&fit=crop&fm=webp',
          url: '',
          description: 'Limited inventory sale.',
          isSale: true
        }
      ]);
    }

    const currentCatObj = categories.find(c => c.name.toLowerCase() === activeCategory.toLowerCase());
    let matched = products.filter(p => {
      const pCatName = p.category || (p as any).categoryName || getProductCategoryName(p.id);
      const matchName = pCatName.toLowerCase() === activeCategory.toLowerCase();
      const matchId = currentCatObj && p.categoryId && Number(p.categoryId) === Number(currentCatObj.id);
      return matchName || matchId;
    });

    if (matched.length > 0) return matched;

    // Fallback populated lists per department
    switch (activeCategory) {
      case 'Personal Care & Wellness':
        return [
          { id: 'wellness-1', name: 'Artisan Bamboo Beard Grooming Kit', price: '$39.00', imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=600&fm=webp', url: '', brand: 'Condere' },
          { id: 'wellness-2', name: 'Cold-Pressed Eucalyptus Essential Oil Set', price: '$25.00', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&fm=webp', url: '', brand: 'Sunlight' },
          { id: 'wellness-3', name: 'Organic Herbal Sleep Bath Salts', price: '$18.00', imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&fm=webp', url: '', brand: 'Apex Labs' }
        ];
      case 'Beauty & Accessories':
        return [
          { id: 'beauty-1', name: 'Rose Quartz Facial Roller & Gua Sha Set', price: '$32.00', imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&fm=webp', url: '', brand: 'Nova' },
          { id: 'beauty-2', name: 'Sandalwood & Neroli Organic Face Mist', price: '$22.00', imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&fm=webp', url: '', brand: 'Wetell' }
        ];
      case 'Sports & Outdoors':
        return [
          { id: 'sport-1', name: 'Eco-Friendly High-Grip TPE Yoga Mat', price: '$34.00', imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=600&fm=webp', url: '', brand: 'Apex Labs' },
          { id: 'sport-2', name: 'Heavy Duty Latex Resistance Band Set', price: '$22.00', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&fm=webp', url: '', brand: 'Sunlight' }
        ];
      default:
        return [
          { id: `generic-${categoryInfo.id}-1`, name: `${activeCategory} Premium Starter Set`, price: '$89.00', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&fm=webp', url: '', brand: 'Nova' },
          { id: `generic-${categoryInfo.id}-2`, name: `Aesthetic ${activeCategory} Craft Accessory`, price: '$35.00', imageUrl: 'https://images.unsplash.com/photo-1513507688996-c75259e8ae5b?q=80&w=600&fm=webp', url: '', brand: 'Reddison' },
          { id: `generic-${categoryInfo.id}-3`, name: `Minimalist ${activeCategory} Designer Piece`, price: '$120.00', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&fm=webp', url: '', brand: 'Wetell' }
        ];
    }
  }, [activeCategory, products, categoryInfo]);

  // Filtered & Sorted List
  const processedList = useMemo(() => {
    let result = [...baseCategoryProducts];

    // 1. Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || getProductBrand(p).toLowerCase().includes(q));
    }

    // 2. Brand
    if (selectedBrand !== 'All') {
      result = result.filter(p => getProductBrand(p).toLowerCase() === selectedBrand.toLowerCase());
    }

    // 3. Rating
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      result = result.filter(p => getProductRating(p.id, p.name) >= minRating);
    }

    // 4. Color
    if (selectedColor !== 'all') {
      result = result.filter(p => getProductColors(p.id, p.name).includes(selectedColor));
    }

    // 5. Sort By
    if (sortBy === 'random') {
      result.sort((a, b) => (randomScores[a.id] ?? 0) - (randomScores[b.id] ?? 0));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => getProductRating(b.id, b.name) - getProductRating(a.id, a.name));
    }

    return result;
  }, [baseCategoryProducts, searchQuery, selectedBrand, selectedRating, selectedColor, sortBy, randomScores]);

  const activeFiltersCount = (activeCategory !== categoryName ? 1 : 0) + 
                             (selectedBrand !== 'All' ? 1 : 0) + 
                             (selectedRating !== 'all' ? 1 : 0) + 
                             (selectedColor !== 'all' ? 1 : 0) +
                             (searchQuery ? 1 : 0);

  const resetAllFilters = () => {
    setActiveCategory(categoryName);
    setSelectedBrand('All');
    setSelectedRating('all');
    setSelectedColor('all');
    setSearchQuery('');
    setSortBy('random');
  };

  const headerBackground = useMemo(() => {
    return categoryInfo.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&fm=webp";
  }, [categoryInfo]);

  // Filter Sidebar Render (identical to ShopPage)
  const renderFilterSidebar = () => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/80">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
          <SlidersHorizontal className={`w-4 h-4 ${currentTheme.text}`} /> Department Filters
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

      {/* Search Input Box */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Search Department
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within items..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Department Category Select */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Select Department
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1.5 scrollbar-thin">
          {categoryNamesList.map((cat) => {
            const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
            const catUrl = cat === 'All' ? getShopUrl({ brand: selectedBrand, sort: sortBy }) : getCategoryUrl(cat, { brand: selectedBrand, sort: sortBy });
            return (
              <a
                key={cat}
                href={catUrl}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCategory(cat);
                  if (onSelectCategory && cat !== 'All') {
                    onSelectCategory(cat);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                  isSelected 
                    ? `${currentTheme.bg} text-white shadow-xs` 
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </a>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Select */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Filter by Brand
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1.5 scrollbar-thin">
          {brandsList.map((brandName) => {
            const isSelected = selectedBrand === brandName;
            const brandUrl = brandName === 'All' 
              ? getCategoryUrl(activeCategory, { sort: sortBy }) 
              : getBrandUrl(brandName, { category: activeCategory, sort: sortBy });
            return (
              <a
                key={brandName}
                href={brandUrl}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedBrand(brandName);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                  isSelected 
                    ? `${currentTheme.bg} text-white shadow-xs` 
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-blue-400 shrink-0" />
                  <span>{brandName}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </a>
            );
          })}
        </div>
      </div>

      {/* 3. Reviews Filter */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Store by Reviews
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1.5 scrollbar-thin">
          {ratingOptions.map((opt) => {
            const isSelected = selectedRating === opt.id;
            const filterUrl = getCategoryUrl(activeCategory, { brand: selectedBrand, sort: sortBy });
            return (
              <a
                key={opt.id}
                href={filterUrl}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedRating(opt.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 font-bold' 
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
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

      {/* 4. Color Filter */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Sort by Color
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1.5 scrollbar-thin">
          {colorOptions.map((color) => {
            const isSelected = selectedColor === color.id;
            const filterUrl = getCategoryUrl(activeCategory, { brand: selectedBrand, sort: sortBy });
            return (
              <a
                key={color.id}
                href={filterUrl}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  isSelected 
                    ? `${currentTheme.lightBg} ${currentTheme.border} ${currentTheme.text} font-bold shadow-2xs` 
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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
        selectedCategory={activeCategory}
        onSelectCategory={(catName) => {
          if (catName.toLowerCase() === 'all') {
            onBack();
          } else if (onSelectCategory) {
            onSelectCategory(catName);
          } else {
            setActiveCategory(catName);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onViewAllCategories={() => onBack()}
      />

      {/* Category Header Hero */}
      <PageBanner
        title={activeCategory}
        description={categoryInfo.description || `Explore our high-end, premium collection of luxury items handpicked to upgrade your lifestyle in the ${activeCategory.toLowerCase()} category.`}
        badge="Curated Department"
        themeColor="slate"
        onBack={onBack}
        backLabel="All Departments"
        backgroundImage={headerBackground}
        backgroundAlt={activeCategory}
        overlayGradient="bg-gradient-to-t from-slate-950/90 via-slate-950/65 to-slate-900/70"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-6 sm:space-y-8">
        
        {/* Top Control Bar with Sorting & View Toggle (Matches ShopPage) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Sort Dropdown Selector */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <label htmlFor="category-sort-select" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className={`w-3.5 h-3.5 ${currentTheme.text}`} />
              <span>Sort By:</span>
            </label>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <select
                  id="category-sort-select"
                  value={sortBy}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setSortBy(val);
                    if (val === 'random') {
                      reshuffleRandom();
                    }
                  }}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-slate-400 rounded-xl pl-3.5 pr-9 py-2 text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none transition shadow-2xs cursor-pointer w-full appearance-none"
                >
                  <option value="random">Random</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {sortBy === 'random' && (
                <button
                  onClick={reshuffleRandom}
                  className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700 shadow-2xs"
                  title="Reshuffle products randomly"
                >
                  <Shuffle className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Button */}
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
            <div className="flex items-center border border-slate-200 dark:border-slate-700 p-1 rounded-xl bg-slate-50 dark:bg-slate-800">
              <button 
                onClick={() => setGridView('cols-4')}
                className={`p-1.5 px-3 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  gridView === 'cols-4' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button 
                onClick={() => setGridView('list')}
                className={`p-1.5 px-3 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  gridView === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="List View (1 per line)"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

        </div>

        {/* Highlights Banner Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl flex items-center gap-3.5 shadow-xs">
            <div className={`p-2 rounded-xl ${currentTheme.lightBg} text-blue-600`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Quality Approved</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">100% Certified authentic line</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl flex items-center gap-3.5 shadow-xs">
            <div className={`p-2 rounded-xl ${currentTheme.lightBg} text-blue-600`}>
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Exclusive Pricing</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Direct partnership manufacturer value</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl flex items-center gap-3.5 shadow-xs">
            <div className={`p-2 rounded-xl ${currentTheme.lightBg} text-blue-600`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Department Details</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Includes luxury unboxing package</p>
            </div>
          </div>
        </div>

        {/* Main Side by Side Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Main Products Grid (Left) */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase px-1">
              <span>Active Items: {processedList.length} products found</span>
              {activeFiltersCount > 0 && (
                <button onClick={resetAllFilters} className={`${currentTheme.text} hover:underline cursor-pointer lowercase`}>
                  clear active filters ({activeFiltersCount})
                </button>
              )}
            </div>

            {processedList.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl py-20 text-center shadow-xs space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No products matched your department filter</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Try clearing selected filters to display all items.</p>
                <button
                  onClick={resetAllFilters}
                  className={`mt-2 px-5 py-2.5 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs ${currentTheme.bg}`}
                >
                  Reset Department Filters
                </button>
              </div>
            ) : gridView === 'list' ? (
              /* LIST VIEW: One product on each line (Identical to ShopPage) */
              <div className="space-y-4">
                {processedList.map((prod) => {
                  const isWishlisted = wishlist.includes(prod.id);
                  const ratingScore = getProductRating(prod.id, prod.name);

                  return (
                    <div 
                      key={prod.id}
                      className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between"
                    >
                      {/* Left: Image Container */}
                      <a 
                        href={getProductUrl(prod.id, prod.name)}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectProduct(prod.id);
                        }}
                        className="relative w-full sm:w-44 md:w-52 aspect-square overflow-hidden bg-slate-50 dark:bg-slate-900/60 rounded-xl sm:rounded-2xl shrink-0 cursor-pointer block"
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
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleWishlist(prod.id, prod.name);
                            }}
                            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
                            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart className={`w-4 h-4 stroke-[2.5] ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                          {onQuickView && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onQuickView(prod);
                              }}
                              className={`w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:${currentTheme.text} hover:${currentTheme.lightBg} shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer`}
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          )}
                        </div>
                      </a>

                      {/* Right: Details & Action Row */}
                      <div className="flex-1 min-w-0 space-y-2.5 w-full flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <a 
                            href={getProductUrl(prod.id, prod.name)}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelectProduct(prod.id);
                            }}
                            className={`text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:${currentTheme.text} transition line-clamp-2 cursor-pointer w-full leading-snug block`}
                          >
                            {prod.name}
                          </a>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <StockBadge product={prod} size="md" />
                            <div className="flex items-center gap-0.5 bg-amber-50/80 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-700/50 text-amber-900 dark:text-amber-300 text-[10px] sm:text-[11px] font-extrabold w-max">
                              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400 shrink-0" />
                              <span>{ratingScore}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Price</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(prod.price)}</span>
                              {prod.originalPrice && (
                                <span className="text-xs text-slate-400 line-through font-semibold">{formatCurrency(prod.originalPrice)}</span>
                              )}
                            </div>
                          </div>

                          {onQuickView && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onQuickView(prod)}
                                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                <span className="hidden sm:inline">Quick View</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              /* GRID VIEW: 4-Column dense grid (Identical to ShopPage) */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
                {processedList.map((prod) => {
                  const isWishlisted = wishlist.includes(prod.id);
                  const ratingScore = getProductRating(prod.id, prod.name);

                  return (
                    <div 
                      key={prod.id}
                      className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <a 
                        href={getProductUrl(prod.id, prod.name)}
                        className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-900/60 cursor-pointer block"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectProduct(prod.id);
                        }}
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
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleWishlist(prod.id, prod.name);
                            }}
                            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
                            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart className={`w-4 h-4 stroke-[2.5] ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                          {onQuickView && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onQuickView(prod);
                              }}
                              className={`w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:${currentTheme.text} hover:${currentTheme.lightBg} shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer`}
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          )}
                        </div>
                      </a>

                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-white dark:bg-slate-800">
                        <a 
                          href={getProductUrl(prod.id, prod.name)}
                          className="cursor-pointer block no-underline" 
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectProduct(prod.id);
                          }}
                        >
                          <h3 className={`text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:${currentTheme.text} transition-colors line-clamp-2 leading-snug w-full`}>
                            {prod.name}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                            <StockBadge product={prod} />
                            <div className="flex items-center gap-0.5 text-amber-600 bg-amber-50/80 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-200/50 dark:border-amber-700/50 text-[9px] sm:text-[10px] font-extrabold w-max">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500 shrink-0" />
                              <span>{ratingScore}</span>
                            </div>
                          </div>
                        </a>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/80">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Price</span>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">{formatCurrency(prod.price)}</span>
                              {prod.originalPrice && (
                                <span className="text-xs text-slate-400 line-through font-semibold">{formatCurrency(prod.originalPrice)}</span>
                              )}
                            </div>
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

      {/* Recently Viewed Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        <RecentlyViewedSection products={products} />
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
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-800 shadow-2xl p-6 overflow-y-auto lg:hidden flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/80">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    Department Filters
                  </h3>
                  <button 
                    onClick={() => setMobileFiltersOpen(false)} 
                    className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg cursor-pointer"
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
                Apply & View ({processedList.length}) Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
