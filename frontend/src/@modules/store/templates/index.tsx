'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MockProduct } from '@/types';
import { getProductUrl } from '@/utils/seoUtils';
import { useCartContext } from '@/providers/cart-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses, ThemeClasses } from '@/providers/theme-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { useUI } from '@/providers/ui-provider';
import { CategoryBarCarousel } from '@components/shared/category-bar';
import { StoreBanner } from '@modules/store/components/store-banner';
import { ControlBar } from '@modules/store/components/refinement-list/control-bar';
import { RefinementList } from '@modules/store/components/refinement-list';
import { MobileFilterDrawer } from '@modules/store/components/refinement-list/mobile-filter-drawer';
import { PaginatedProducts } from '@modules/store/templates/paginated-products';
import { useStoreFilters } from '@modules/store/templates/use-store-filters';

export interface StoreTemplateProps {
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses?: (color: string) => ThemeClasses;
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

export type ShopPageProps = StoreTemplateProps;

/**
 * MedusaJS Storefront Store / Shop Template
 * 
 * Modular architectural layout for the catalog browsing experience:
 * - Category quick navigation carousel
 * - Store hero banner with dynamic breadcrumbs and catalog stats
 * - Refinement list and sort control bar
 * - Responsive products grid / list with real-time stock & ratings
 * - Accessible mobile slide-out filter drawer
 */
export const StoreTemplate: React.FC<StoreTemplateProps> = ({
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
  onNavigate: propOnNavigate,
}) => {
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
  const onQuickView = propOnQuickView ?? uiCtx.openQuickView;
  const onSelectProduct = propOnSelectProduct ?? ((id: string) => router.push(getProductUrl(id)));
  const onNavigate = propOnNavigate ?? ((page: string) => router.push(page === 'home' ? '/' : `/${page}`));

  const categoryFromUrl = searchParams.get('category');
  const brandFromUrl = searchParams.get('brand');
  const effectiveCategoryFilter = initialCategoryFilter ?? (categoryFromUrl || 'All');
  const effectiveBrandFilter = initialBrandFilter ?? (brandFromUrl || 'All');

  const currentTheme = getThemeClasses(themeColor);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    selectedBrand,
    setSelectedBrand,
    availableBrands,
    selectedRating,
    setSelectedRating,
    sortBy,
    setSortBy,
    gridView,
    setGridView,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    reshuffleRandom,
    processedProducts,
    activeFiltersCount,
    resetAllFilters,
  } = useStoreFilters({
    products,
    categoriesProp: categories,
    brandsProp: brands,
    initialCategoryFilter: effectiveCategoryFilter,
    initialBrandFilter: effectiveBrandFilter,
  });

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
          if (onNavigate) {
            onNavigate('categories');
          }
        }}
      />

      {/* Category-Style Parallax Banner */}
      <StoreBanner
        selectedCategory={selectedCategory}
        totalProductsCount={products.length}
        onNavigateHome={() => onNavigate('home')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Top Control Bar: Sort Dropdown, Active Chips & Layout Toggler */}
        <ControlBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReshuffle={reshuffleRandom}
          gridView={gridView}
          setGridView={setGridView}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          activeFiltersCount={activeFiltersCount}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          currentTheme={currentTheme}
        />

        {/* Desktop Side-By-Side Layout (Products Left, Filters Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Products Grid or List */}
          <main className="lg:col-span-9" aria-label="Product Catalog">
            <PaginatedProducts
              products={processedProducts}
              wishlist={wishlist}
              gridView={gridView}
              activeFiltersCount={activeFiltersCount}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              searchQuery={searchQuery}
              onResetFilters={resetAllFilters}
              onSelectProduct={onSelectProduct}
              onToggleWishlist={handleToggleWishlist}
              onQuickView={onQuickView}
              currentTheme={currentTheme}
            />
          </main>

          {/* Right Filters Sidebar (Desktop Screen Only) */}
          <aside className="hidden lg:block lg:col-span-3" aria-label="Catalog Filters">
            <RefinementList
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              availableCategories={availableCategories}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              availableBrands={availableBrands}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              products={products}
              activeFiltersCount={activeFiltersCount}
              resetAllFilters={resetAllFilters}
              currentTheme={currentTheme}
            />
          </aside>
        </div>
      </div>

      {/* Mobile Drawer Filter Sidebar */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        resultCount={processedProducts.length}
        currentTheme={currentTheme}
      >
        <RefinementList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={availableCategories}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          availableBrands={availableBrands}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          products={products}
          activeFiltersCount={activeFiltersCount}
          resetAllFilters={resetAllFilters}
          currentTheme={currentTheme}
        />
      </MobileFilterDrawer>
    </div>
  );
};

export default StoreTemplate;
