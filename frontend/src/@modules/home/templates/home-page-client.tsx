'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/providers/theme-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useUI } from '@/providers/ui-provider';
import { useRecentlyViewedContext } from '@/providers/recently-viewed-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Zap, ArrowRight } from 'lucide-react';
import { SafeImage } from '@modules/common/components/safe-image';
import { CategoryBarCarousel } from '@components/shared/category-bar';
import { RecentlyViewedSection } from '@components/shared/recently-viewed';
import { PromoBannersGrid } from '@modules/layout/components/promo-banners-grid';
import { FlashDealsSection } from '@modules/products/components/flash-deals-section';
import { BestsellersTabSection } from '@modules/products/components/bestsellers-tab-section';
import CategoryProductCarousel from '@modules/products/components/category-product-carousel';
import { TechElectronicsShowcase } from '@modules/products/components/tech-electronics-showcase';
import { HomeLivingShowcase } from '@modules/products/components/home-living-showcase';
import { TestimonialsSection } from '@modules/layout/components/testimonials-section';
import { getProductUrl, getCategoryUrl } from '@/utils/seoUtils';
import { MockWooProduct } from '@/types';

interface HomePageClientProps {
  _initialProducts?: MockWooProduct[];
  _initialCategories?: any[];
  _initialBrands?: any[];
  _initialSlides?: any[];
}

export default function HomePageClient({
  _initialProducts,
  _initialCategories,
  _initialBrands,
  _initialSlides,
}: HomePageClientProps) {
  const router = useRouter();
  const { themeColor } = useThemeContext();
  const { products, categories, brands, slides } = useCatalog();
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();
  const { handleOpenQuickView } = useUI();
  const { recentlyViewedIds } = useRecentlyViewedContext();
  const currentTheme = getThemeClasses(themeColor);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const restartAutoplay = () => {
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    if (slides.length > 1) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, 5500);
    }
  };

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [slides.length]);

  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  const updateCategoriesScrollState = () => {
    if (!categoriesScrollRef.current) return;
  };

  const brandsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollBrandsLeft, setCanScrollBrandsLeft] = useState(false);
  const [canScrollBrandsRight, setCanScrollBrandsRight] = useState(true);
  const [isDraggingBrands, setIsDraggingBrands] = useState(false);
  const [brandsStartX, setBrandsStartX] = useState(0);
  const [brandsScrollLeft, setBrandsScrollLeft] = useState(0);

  const updateBrandsScrollState = () => {
    if (!brandsScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = brandsScrollRef.current;
    setCanScrollBrandsLeft(scrollLeft > 10);
    setCanScrollBrandsRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollBrands = (direction: 'left' | 'right') => {
    if (!brandsScrollRef.current) return;
    const scrollAmount = brandsScrollRef.current.clientWidth * 0.75;
    brandsScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleBrandsMouseDown = (e: React.MouseEvent) => {
    if (!brandsScrollRef.current) return;
    setIsDraggingBrands(true);
    setBrandsStartX(e.pageX - brandsScrollRef.current.offsetLeft);
    setBrandsScrollLeft(brandsScrollRef.current.scrollLeft);
  };

  const handleBrandsMouseLeave = () => {
    setIsDraggingBrands(false);
  };

  const handleBrandsMouseUp = () => {
    setIsDraggingBrands(false);
  };

  const handleBrandsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingBrands || !brandsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - brandsScrollRef.current.offsetLeft;
    const walk = (x - brandsStartX) * 1.5;
    brandsScrollRef.current.scrollLeft = brandsScrollLeft - walk;
    updateBrandsScrollState();
  };

  const recentProducts = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is MockWooProduct => Boolean(p))
    .slice(0, 10);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      <div className="space-y-4 sm:space-y-5">
        <CategoryBarCarousel
          categories={categories}
          products={products}
          themeColor={themeColor}
          currentTheme={currentTheme}
          onSelectCategory={(categoryName) => {
            if (categoryName.toLowerCase() === 'all') {
              router.push('/shop');
            } else {
              router.push(getCategoryUrl(categoryName));
            }
          }}
          onViewAllCategories={() => router.push('/categories')}
        />

        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hero-slider-dark-scope">
          <div className="relative w-full overflow-hidden bg-slate-900 select-none rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/60">
          <div className="h-[210px] xs:h-[260px] sm:h-[320px] lg:h-[380px] w-full relative">
            <AnimatePresence mode="wait">
              {slides.map((slide, idx) => {
                if (idx !== currentSlideIndex) return null;

                const titleAnim =
                  slide.titleAnimation === 'slideInLeft'
                    ? { x: [-50, 0], opacity: [0, 1] }
                    : slide.titleAnimation === 'zoomIn'
                    ? { scale: [0.95, 1], opacity: [0, 1] }
                    : { y: [20, 0], opacity: [0, 1] };

                const subAnim =
                  slide.subtitleAnimation === 'slideInLeft'
                    ? { x: [-30, 0], opacity: [0, 1] }
                    : slide.subtitleAnimation === 'zoomIn'
                    ? { scale: [0.95, 1], opacity: [0, 1] }
                    : { y: [15, 0], opacity: [0, 1] };

                return (
                  <motion.div
                    key={slide.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      const swipeThreshold = 40;
                      if (info.offset.x < -swipeThreshold || info.velocity.x < -200) {
                        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
                        restartAutoplay();
                      } else if (info.offset.x > swipeThreshold || info.velocity.x > 200) {
                        setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
                        restartAutoplay();
                      }
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full flex items-center cursor-grab active:cursor-grabbing touch-pan-y"
                    style={
                      slide.backgroundType === 'gradient'
                        ? { background: slide.backgroundGradient }
                        : slide.backgroundType === 'color'
                        ? { backgroundColor: slide.backgroundColor }
                        : {
                            backgroundImage: `url(${slide.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/40 z-0 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20 z-0 pointer-events-none" />

                    <div className="w-full px-6 sm:px-12 lg:px-16 relative z-10 pointer-events-none">
                      <div className="max-w-xl !text-white pointer-events-auto">
                        <motion.h2
                          animate={titleAnim}
                          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                          style={{ color: '#ffffff' }}
                          className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3 !text-white leading-tight drop-shadow-md"
                        >
                          {slide.title}
                        </motion.h2>

                        <motion.p
                          animate={subAnim}
                          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          style={{ color: '#f1f5f9' }}
                          className="text-xs sm:text-sm md:text-base !text-slate-100 font-medium mb-4 sm:mb-6 leading-relaxed max-w-lg line-clamp-2 drop-shadow-sm"
                        >
                          {slide.subtitle}
                        </motion.p>

                        <motion.div
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <Link
                            href={
                              slide.targetPage === 'categories'
                                ? '/categories'
                                : slide.targetPage === 'contact'
                                ? '/contact'
                                : '/shop'
                            }
                            className={`inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-extrabold tracking-wide text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg ${
                              slide.buttonStyle === 'pill'
                                ? 'rounded-full'
                                : slide.buttonStyle === 'outline'
                                ? 'border-2 border-white hover:bg-white hover:text-slate-900 bg-transparent'
                                : 'rounded-2xl'
                            } ${slide.buttonStyle !== 'outline' ? currentTheme.bg : ''} ${currentTheme.shadow}`}
                          >
                            <span>{slide.buttonText}</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {slides.length > 1 && (
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      restartAutoplay();
                    }}
                    className={`h-2 rounded-full transition-all duration-300 outline-none cursor-pointer ${
                      idx === currentSlideIndex ? 'w-6 bg-white shadow' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      </div>

      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Categories
          </h2>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div
          ref={categoriesScrollRef}
          onScroll={updateCategoriesScrollState}
          className="w-full overflow-x-auto scrollbar-none py-2 scroll-smooth snap-x snap-mandatory flex gap-4 sm:gap-6"
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={getCategoryUrl(cat.name)}
              className="snap-start shrink-0 w-24 sm:w-28 md:w-32 flex flex-col items-center group cursor-pointer text-center"
            >
              <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-transparent group-hover:${currentTheme.border} transition-all duration-300 shadow-sm group-hover:scale-105`}>
                <SafeImage
                  src={cat.imageUrl}
                  alt={cat.name}
                  placeholderType="category"
                  fallbackTitle={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className={`text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:${currentTheme.text} transition mt-2.5 truncate max-w-full`}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <PromoBannersGrid
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        onSelectCategory={(cat) => router.push(getCategoryUrl(cat))}
        onNavigateShop={() => router.push('/shop')}
      />

      <FlashDealsSection
        products={products}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onSelectProduct={(id) => router.push(getProductUrl(id))}
        onQuickView={handleOpenQuickView}
      />

      <BestsellersTabSection
        products={products}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onSelectProduct={(productId) => router.push(getProductUrl(productId))}
        onQuickView={handleOpenQuickView}
        onNavigateShop={() => router.push('/shop')}
      />

      <CategoryProductCarousel
        categories={categories}
        products={products}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onSelectProduct={(productId) => router.push(getProductUrl(productId))}
        onQuickView={handleOpenQuickView}
        onViewMoreCategory={(categoryName) => router.push(getCategoryUrl(categoryName))}
      />

      <TechElectronicsShowcase
        products={products}
        categories={categories}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onSelectProduct={(productId) => router.push(getProductUrl(productId))}
        onQuickView={handleOpenQuickView}
        onViewCategory={(categoryName) => router.push(getCategoryUrl(categoryName))}
      />

      <HomeLivingShowcase
        products={products}
        categories={categories}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onSelectProduct={(productId) => router.push(getProductUrl(productId))}
        onQuickView={handleOpenQuickView}
        onViewCategory={(categoryName) => router.push(getCategoryUrl(categoryName))}
      />

      {recentProducts.length > 0 && (
        <RecentlyViewedSection
          products={products as any}
          recentlyViewedIds={recentlyViewedIds}
          onSelectProduct={(productId) => router.push(getProductUrl(productId))}
          title="Recently Viewed Items"
          maxItems={10}
        />
      )}

      <section id="featured-brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200/70 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white select-text">
              Explore Brands
            </h2>
            <div className="flex items-center gap-2">
              <Link
                href="/shop"
                className={`text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:${currentTheme.text} transition flex items-center gap-1 mr-1`}
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => scrollBrands('left')}
                disabled={!canScrollBrandsLeft}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
                aria-label="Previous brands"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => scrollBrands('right')}
                disabled={!canScrollBrandsRight}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
                aria-label="Next brands"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div
            ref={brandsScrollRef}
            onScroll={updateBrandsScrollState}
            onMouseDown={handleBrandsMouseDown}
            onMouseLeave={handleBrandsMouseLeave}
            onMouseUp={handleBrandsMouseUp}
            onMouseMove={handleBrandsMouseMove}
            className="w-full overflow-x-auto scrollbar-none py-2 scroll-smooth snap-x snap-mandatory flex gap-3.5 sm:gap-4 items-stretch cursor-grab active:cursor-grabbing"
          >
            {brands.map((brand) => {
              let decodedSvg: string | null = null;
              if (brand.imageUrl && brand.imageUrl.startsWith('data:image/svg+xml')) {
                try {
                  const commaIndex = brand.imageUrl.indexOf(',');
                  if (commaIndex !== -1) {
                    const baseData = brand.imageUrl.substring(commaIndex + 1);
                    decodedSvg = decodeURIComponent(baseData);
                  }
                } catch {}
              }

              return (
                <div
                  key={brand.id}
                  onClick={() => router.push(`/shop?brand=${encodeURIComponent(brand.name)}`)}
                  className={`snap-start shrink-0 w-36 sm:w-44 lg:w-48 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer text-center aspect-3/2 min-h-[96px] sm:min-h-[110px]`}
                >
                  <div className="w-full h-10 sm:h-12 flex items-center justify-center">
                    {decodedSvg ? (
                      <div
                        className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto text-slate-700 dark:text-slate-200 group-hover:scale-105 transition-transform duration-200"
                        dangerouslySetInnerHTML={{ __html: decodedSvg }}
                      />
                    ) : brand.imageUrl ? (
                      <img
                        src={brand.imageUrl}
                        alt={brand.name}
                        className="max-h-10 sm:max-h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${currentTheme.lightBg} ${currentTheme.text} flex items-center justify-center font-black text-sm`}>
                        {brand.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:${currentTheme.text} transition truncate max-w-full mt-2 select-text`}>
                    {brand.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TestimonialsSection themeColor={themeColor} getThemeClasses={getThemeClasses} />
    </div>
  );
}
