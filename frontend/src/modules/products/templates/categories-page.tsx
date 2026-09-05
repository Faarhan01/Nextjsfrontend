'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  Search, 
  X, 
  Package, 
  Grid2X2, 
  SlidersHorizontal,
  RotateCcw,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { MockCategory, MockProduct } from '@/types';
import { SafeImage } from '@modules/common/components/safe-image';
import { getCategoryUrl, getCategoriesUrl, updateSEOMetadata } from '@/utils/seoUtils';
import { CategoryBarCarousel } from '@modules/home/components/category-bar-carousel';

interface CategoriesPageProps {
  categories: MockCategory[];
  products?: MockProduct[];
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses: (color: string) => any;
  onSelectCategory: (categoryName: string) => void;
  onNavigate?: (page: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  products = [],
  themeColor,
  getThemeClasses,
  onSelectCategory,
  onNavigate
}) => {
  const currentTheme = getThemeClasses(themeColor);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');

  // Compute product count per category
  const categoryProductCounts = useMemo(() => {
    const map: Record<string, number> = {};
    if (!products || products.length === 0) return map;

    products.forEach((p) => {
      // Check match by categoryId or category string
      if (p.categoryId) {
        map[p.categoryId] = (map[p.categoryId] || 0) + 1;
      }
      if (p.category) {
        const catNameLower = p.category.toLowerCase();
        map[catNameLower] = (map[catNameLower] || 0) + 1;
      }
    });

    return map;
  }, [products]);

  const getCategoryCount = (cat: MockCategory): number => {
    if (categoryProductCounts[cat.id]) return categoryProductCounts[cat.id];
    if (categoryProductCounts[cat.name.toLowerCase()]) return categoryProductCounts[cat.name.toLowerCase()];
    // Default fallback based on subcategories or estimated catalog count
    if (cat.subcategories && cat.subcategories.length > 0) {
      return cat.subcategories.length * 4;
    }
    return 8;
  };

  // Filtered categories based on search query and department filter tag
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Department filter
      if (selectedFilterCategory !== 'All' && cat.name.toLowerCase() !== selectedFilterCategory.toLowerCase()) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameMatch = cat.name.toLowerCase().includes(q);
      const descMatch = cat.description?.toLowerCase().includes(q);
      const subMatch = cat.subcategories?.some((s) => s.name.toLowerCase().includes(q));

      return nameMatch || descMatch || subMatch;
    });
  }, [categories, searchQuery, selectedFilterCategory]);

  useEffect(() => {
    const title = 'Browse All Categories & Departments | Mrbulk';
    const description = 'Explore all store categories and departments including Electronics, Fashion, Home Living, and wholesale collections at Mrbulk (mrbulk.co.za).';
    const canonicalPath = getCategoriesUrl();
    updateSEOMetadata(title, description, canonicalPath);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-16 sm:pb-24 space-y-6 sm:space-y-8">
      
      {/* Category Quick Navigation Control Bar */}
      <CategoryBarCarousel
        categories={categories}
        products={products}
        themeColor={themeColor}
        currentTheme={currentTheme}
        selectedCategory={selectedFilterCategory}
        onSelectCategory={(categoryName) => {
          if (categoryName.toLowerCase() === 'all') {
            setSelectedFilterCategory('All');
          } else {
            onSelectCategory(categoryName);
          }
        }}
        onViewAllCategories={() => {
          setSelectedFilterCategory('All');
        }}
      />

      {/* Category Parallax Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full py-8 sm:py-12 px-4 sm:px-8 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm dark:shadow-lg border border-slate-200/90 dark:border-slate-800">
          <div className="absolute inset-0 z-0">
            <SafeImage 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&fm=webp" 
              alt="Department Categories"
              placeholderType="banner"
              className="w-full h-full object-cover opacity-60 dark:opacity-75 scale-105 transition-transform duration-700"
            />
            {/* Luminous scrim: clear center visibility with balanced readability overlay */}
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
              <span className="text-slate-900 dark:text-white font-extrabold">All Categories</span>
            </div>

            {/* Badge Pill */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/90 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300/80 dark:border-white/20 backdrop-blur-md shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Mrbulk Department Catalog
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Explore All Categories
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              Browse our structured collections of high-grade electronics, fashion apparel, interior lifestyle, and luxury specialty items.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Mobile-Friendly Search & Quick Department Filter Bar */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories or collections..."
                className="w-full bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:border-blue-500 rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none transition shadow-2xs"
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

            {/* Quick Stats Counter */}
            <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-extrabold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                <Grid2X2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Showing {filteredCategories.length} of {categories.length} Categories</span>
              </span>
              {(searchQuery || selectedFilterCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilterCategory('All');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 text-xs font-bold cursor-pointer transition"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Department Filter Chips (Horizontal Touch Scroll on Mobile) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-1 px-1 touch-pan-x">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" /> Filter:
            </span>
            <button
              onClick={() => setSelectedFilterCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                selectedFilterCategory === 'All'
                  ? `${currentTheme.lightBg} ${currentTheme.border} ${currentTheme.text} font-black shadow-2xs`
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600 border border-transparent'
              }`}
            >
              All Categories ({categories.length})
            </button>
            {categories.map((cat) => {
              const isSelected = selectedFilterCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilterCategory(isSelected ? 'All' : cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    isSelected
                      ? `${currentTheme.lightBg} ${currentTheme.border} ${currentTheme.text} font-black shadow-2xs`
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600 border border-transparent'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCategories.map((cat) => {
              const productCount = getCategoryCount(cat);
              const categoryUrl = getCategoryUrl(cat.name);
              return (
                <a
                  key={cat.id}
                  href={categoryUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory(cat.name);
                  }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col active:scale-[0.99] touch-manipulation no-underline"
                >
                  {/* Top Image Banner Area */}
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <SafeImage
                      src={cat.imageUrl}
                      alt={cat.name}
                      placeholderType="category"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                    
                    {/* Top Right Product Count Badge */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-900/80 text-white border border-white/20 backdrop-blur-md shadow-xs">
                        <Package className="w-3 h-3 text-amber-400" /> {productCount} Products
                      </span>
                    </div>

                    {/* Bottom Title & Arrow on Image */}
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2">
                      <div>
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-300 mb-0.5">
                          Department
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-xs">
                          {cat.name}
                        </h3>
                      </div>
                      <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {cat.description || `Explore our curated list of top-rated ${cat.name.toLowerCase()} products, designed for high durability and performance.`}
                    </p>

                    {/* Subcategories Tags */}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                          Featured Sub-Collections
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategories.slice(0, 5).map((sub) => (
                            <span
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCategory(cat.name);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Action Link */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Browse Collection</span>
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-extrabold group-hover:translate-x-1 transition-transform">
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto my-8 space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching categories found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We couldn't find any category or subcategory matching "{searchQuery}".
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilterCategory('All');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Category Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;

