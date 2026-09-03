'use client';

import React from 'react';

// ============================================================================
// BASE SHIMMER & SKELETON PRIMITIVES
// ============================================================================

export const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-shimmer rounded-xl bg-slate-200/80 dark:bg-slate-800/80 ${className}`} />
);

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-shimmer bg-slate-200/90 dark:bg-slate-800/90 ${className}`} />
);

export const SkeletonText: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-shimmer rounded-md bg-slate-200/80 dark:bg-slate-800/80 ${className}`} />
);

export const SkeletonCircle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-shimmer rounded-full bg-slate-200/90 dark:bg-slate-800/90 ${className}`} />
);

// ============================================================================
// 1. STANDALONE PRODUCT CARD SKELETON
// ============================================================================
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 space-y-3 shadow-2xs ${className}`}
  >
    {/* Product Image Area */}
    <div className="aspect-square w-full rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 relative overflow-hidden animate-shimmer">
      <div className="absolute top-2.5 left-2.5 h-5 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/80 dark:bg-slate-700/80" />
    </div>

    {/* Product Info */}
    <div className="space-y-2 pt-0.5">
      <div className="flex items-center justify-between">
        <SkeletonText className="h-3 w-16" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 animate-shimmer" />
          ))}
        </div>
      </div>
      <SkeletonText className="h-4 w-5/6" />
      <SkeletonText className="h-3.5 w-3/5" />
    </div>

    {/* Price & Action Row */}
    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
      <div className="space-y-1">
        <SkeletonText className="h-5 w-20" />
        <SkeletonText className="h-3 w-12" />
      </div>
      <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-shimmer" />
    </div>
  </div>
);

// ============================================================================
// 2. HERO BANNER SKELETON
// ============================================================================
export const HeroBannerSkeleton: React.FC = () => (
  <div className="w-full bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden border border-slate-800 shadow-xl">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Column: Content */}
      <div className="lg:col-span-7 space-y-6">
        {/* Pill Badge */}
        <div className="h-7 w-36 bg-slate-800 rounded-full animate-shimmer" />

        {/* Big Display Headline */}
        <div className="space-y-3">
          <div className="h-10 sm:h-14 w-11/12 bg-slate-800 rounded-2xl animate-shimmer" />
          <div className="h-10 sm:h-14 w-3/4 bg-slate-800 rounded-2xl animate-shimmer" />
        </div>

        {/* Subtitle */}
        <div className="space-y-2 pt-1">
          <div className="h-4 sm:h-5 w-5/6 bg-slate-800/80 rounded-lg animate-shimmer" />
          <div className="h-4 sm:h-5 w-3/5 bg-slate-800/70 rounded-lg animate-shimmer" />
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-12 w-40 bg-blue-600/50 rounded-2xl animate-shimmer" />
          <div className="h-12 w-32 bg-slate-800 rounded-2xl border border-slate-700/60 animate-shimmer" />
        </div>
      </div>

      {/* Right Column: Hero Preview Card (Desktop) */}
      <div className="lg:col-span-5 hidden lg:block">
        <div className="aspect-4/3 w-full bg-slate-800/90 rounded-2xl border border-slate-700/60 p-5 space-y-4 shadow-lg animate-shimmer">
          <div className="h-48 w-full bg-slate-700/70 rounded-xl" />
          <div className="flex items-center justify-between pt-1">
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-slate-700 rounded" />
              <div className="h-5 w-20 bg-slate-700 rounded" />
            </div>
            <div className="h-9 w-24 bg-blue-600/50 rounded-xl" />
          </div>
        </div>
      </div>
    </div>

    {/* Hero Bottom Slide Tabs & Controls */}
    <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
      <div className="flex gap-2">
        <div className="h-8 w-28 bg-slate-800 rounded-xl animate-shimmer" />
        <div className="h-8 w-28 bg-slate-800/60 rounded-xl animate-shimmer" />
        <div className="h-8 w-28 bg-slate-800/40 rounded-xl animate-shimmer" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-slate-800 animate-shimmer" />
        <div className="h-8 w-8 rounded-full bg-slate-800 animate-shimmer" />
      </div>
    </div>
  </div>
);

// ============================================================================
// 3. CATEGORY BAR CAROUSEL SKELETON
// ============================================================================
export const CategoryBarSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-2xs">
    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 shrink-0"
        >
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 animate-shimmer shrink-0" />
          <SkeletonText className="h-3.5 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// 4. TRUST BADGES BAR SKELETON
// ============================================================================
export const TrustBadgesSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs"
      >
        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 animate-shimmer" />
        <div className="flex-1 space-y-1.5">
          <SkeletonText className="h-4 w-3/4" />
          <SkeletonText className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// 5. EXPLORE CATEGORIES CIRCLES SKELETON
// ============================================================================
export const CategoriesSectionSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <SkeletonText className="h-7 sm:h-8 w-48" />
      <SkeletonText className="h-4 w-16" />
    </div>
    <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 scrollbar-none">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="shrink-0 w-24 sm:w-28 flex flex-col items-center space-y-2.5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200/70 dark:border-slate-700/80 animate-shimmer" />
          <SkeletonText className="h-3.5 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// 6. PROMO BANNERS GRID SKELETON
// ============================================================================
export const PromoBannersSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
    {[...Array(2)].map((_, i) => (
      <div
        key={i}
        className="h-52 sm:h-60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden"
      >
        <div className="space-y-2.5">
          <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
          <SkeletonText className="h-7 sm:h-8 w-3/4" />
          <SkeletonText className="h-4 w-1/2" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-slate-200 dark:bg-slate-800 animate-shimmer" />
      </div>
    ))}
  </div>
);

// ============================================================================
// 7. FLASH DEALS SECTION SKELETON
// ============================================================================
export const FlashDealsSkeleton: React.FC = () => (
  <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-xl">
    {/* Header with Flame & Countdown */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-amber-500/50 animate-shimmer" />
        </div>
        <div className="space-y-1">
          <div className="h-6 w-36 bg-slate-800 rounded-lg animate-shimmer" />
          <div className="h-3.5 w-48 bg-slate-800/70 rounded animate-shimmer" />
        </div>
      </div>
      {/* Countdown Timer Boxes */}
      <div className="flex items-center gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-12 rounded-xl bg-slate-800 border border-slate-700/80 animate-shimmer" />
        ))}
      </div>
    </div>

    {/* Flash Deal Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-slate-800/80 rounded-2xl p-3.5 space-y-3 border border-slate-700/60 shadow-xs"
        >
          <div className="aspect-square w-full rounded-xl bg-slate-700/70 relative overflow-hidden animate-shimmer">
            <div className="absolute top-2 left-2 h-5 w-12 rounded-full bg-rose-500/50" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-3/4 bg-slate-700 rounded animate-shimmer" />
            <div className="h-4 w-1/2 bg-slate-700/70 rounded animate-shimmer" />
          </div>
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <div className="h-2.5 w-16 bg-slate-700 rounded animate-shimmer" />
              <div className="h-2.5 w-8 bg-slate-700 rounded animate-shimmer" />
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full animate-shimmer" />
          </div>
          <div className="h-9 w-full rounded-xl bg-blue-600/50 animate-shimmer" />
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// 8. BESTSELLERS TAB SECTION SKELETON
// ============================================================================
export const BestsellersSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <SkeletonText className="h-7 sm:h-8 w-44" />
        <SkeletonText className="h-4 w-60" />
      </div>
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 shrink-0 animate-shimmer"
          />
        ))}
      </div>
    </div>

    {/* 4-5 Column Product Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {[...Array(10)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// ============================================================================
// 9. TECH & ELECTRONICS SHOWCASE SKELETON
// ============================================================================
export const TechElectronicsShowcaseSkeleton: React.FC = () => (
  <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-xl">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="h-6 w-48 bg-slate-800 rounded-lg animate-shimmer" />
        <div className="h-3.5 w-64 bg-slate-800/70 rounded animate-shimmer" />
      </div>
      <div className="h-9 w-28 bg-slate-800 rounded-xl animate-shimmer" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Feature Card */}
      <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-slate-700/60 animate-shimmer">
        <div className="space-y-2">
          <div className="h-5 w-24 bg-blue-500/40 rounded-full" />
          <div className="h-7 w-3/4 bg-slate-700 rounded-xl" />
          <div className="h-4 w-5/6 bg-slate-700/70 rounded" />
        </div>
        <div className="aspect-4/3 w-full bg-slate-700/60 rounded-xl" />
        <div className="h-11 w-full bg-blue-600/50 rounded-xl" />
      </div>

      {/* Right 4 Grid Cards */}
      <div className="lg:col-span-7 grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/80 rounded-2xl p-3.5 space-y-3 border border-slate-700/60"
          >
            <div className="aspect-square w-full rounded-xl bg-slate-700/70 animate-shimmer" />
            <div className="space-y-1">
              <div className="h-4 w-3/4 bg-slate-700 rounded animate-shimmer" />
              <div className="h-4 w-1/2 bg-slate-700/70 rounded animate-shimmer" />
            </div>
            <div className="h-8 w-full bg-slate-700 rounded-xl animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// 10. CATEGORY PRODUCT CAROUSEL SKELETON
// ============================================================================
export const CategoryCarouselSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <SkeletonText className="h-7 sm:h-8 w-44" />
        <SkeletonText className="h-4 w-56" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-shimmer" />
        <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-shimmer" />
      </div>
    </div>
    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-56 sm:w-64 shrink-0">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// 11. TESTIMONIALS SECTION SKELETON
// ============================================================================
export const TestimonialsSkeleton: React.FC = () => (
  <div className="space-y-8">
    <div className="text-center max-w-2xl mx-auto space-y-2.5">
      <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto animate-shimmer" />
      <SkeletonText className="h-8 sm:h-9 w-80 max-w-full mx-auto" />
      <SkeletonText className="h-4 w-96 max-w-full mx-auto" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="w-3.5 h-3.5 rounded-full bg-amber-400/50 animate-shimmer" />
              ))}
            </div>
            <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 animate-shimmer" />
          </div>
          <div className="space-y-2">
            <SkeletonText className="h-4 w-full" />
            <SkeletonText className="h-4 w-5/6" />
            <SkeletonText className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer shrink-0" />
            <div className="space-y-1">
              <SkeletonText className="h-3.5 w-24" />
              <SkeletonText className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// 12. FEATURED BRANDS SECTION SKELETON
// ============================================================================
export const FeaturedBrandsSkeleton: React.FC = () => (
  <div className="bg-slate-50/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6">
    <div className="flex items-center justify-between pb-4 border-b border-slate-200/70 dark:border-slate-800">
      <SkeletonText className="h-7 sm:h-8 w-40" />
      <div className="flex items-center gap-2">
        <SkeletonText className="h-4 w-16 mr-2" />
        <div className="h-8 w-8 rounded-xl bg-white dark:bg-slate-800 animate-shimmer" />
        <div className="h-8 w-8 rounded-xl bg-white dark:bg-slate-800 animate-shimmer" />
      </div>
    </div>
    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-36 sm:w-44 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 aspect-3/2 animate-shimmer"
        >
          <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// 13. NEWSLETTER SECTION SKELETON
// ============================================================================
export const NewsletterSkeleton: React.FC = () => (
  <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl text-center max-w-3xl mx-auto space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 mx-auto animate-shimmer" />
    <div className="h-8 w-72 max-w-full bg-slate-800 rounded-xl mx-auto animate-shimmer" />
    <div className="h-4 w-96 max-w-full bg-slate-800/70 rounded mx-auto animate-shimmer" />
    <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
      <div className="h-12 flex-1 rounded-2xl bg-slate-800 border border-slate-700 animate-shimmer" />
      <div className="h-12 w-32 rounded-2xl bg-blue-600/60 animate-shimmer" />
    </div>
  </div>
);

// ============================================================================
// 14. FOOTER TRUST CAROUSEL SKELETON
// ============================================================================
export const FooterTrustSkeleton: React.FC = () => (
  <div className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 py-6">
    <div className="flex items-center justify-around gap-6 max-w-7xl mx-auto px-4 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-shimmer" />
          <div className="space-y-1">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer" />
            <div className="h-2.5 w-14 bg-slate-200/60 dark:bg-slate-800/60 rounded animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// FULL PAGE SKELETONS (1-to-1 Shape of Every Page)
// ============================================================================

// 1. MASTER HOME PAGE SKELETON
export const HomePageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-12 sm:space-y-16">
    {/* 0. Top Category Quick Bar */}
    <CategoryBarSkeleton />

    {/* 1. Full Hero Banner */}
    <HeroBannerSkeleton />

    {/* 2. Trust Badges Bar */}
    <TrustBadgesSkeleton />

    {/* 3. Explore Categories Circles */}
    <CategoriesSectionSkeleton />

    {/* 4. Promo Banners Grid */}
    <PromoBannersSkeleton />

    {/* 5. Flash Deals Section */}
    <FlashDealsSkeleton />

    {/* 6. Bestsellers Tab Section */}
    <BestsellersSkeleton />

    {/* 7. Tech & Electronics Showcase */}
    <TechElectronicsShowcaseSkeleton />

    {/* 8. Category Product Carousel */}
    <CategoryCarouselSkeleton />

    {/* 9. Testimonials Customer Stories */}
    <TestimonialsSkeleton />

    {/* 10. Featured Brands Grid */}
    <FeaturedBrandsSkeleton />

    {/* 11. Newsletter Capture */}
    <NewsletterSkeleton />
  </div>
);

// 2. SHOP PAGE SKELETON
export const ShopPageSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-950 min-h-screen pb-16 sm:pb-24 space-y-6 sm:space-y-8">
    {/* Category Quick Nav Bar Carousel */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <CategoryBarSkeleton />
    </div>

    {/* Hero Parallax Banner */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full py-8 sm:py-12 px-4 sm:px-8 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-2">
            <SkeletonText className="h-3.5 w-12" />
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <SkeletonText className="h-3.5 w-14" />
          </div>
          <div className="flex justify-center">
            <div className="h-6 w-36 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-shimmer" />
          </div>
          <SkeletonText className="h-8 sm:h-10 w-72 max-w-full mx-auto" />
          <SkeletonText className="h-4 w-96 max-w-full mx-auto" />
        </div>
      </div>
    </div>

    {/* Main Container */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Top Control Bar: Sort Dropdown & Layout Toggler */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <SkeletonText className="h-4 w-16" />
          <div className="h-10 w-52 sm:w-60 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 animate-shimmer" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer sm:hidden" />
          <div className="flex items-center border border-slate-200 dark:border-slate-700 p-1 rounded-xl bg-slate-50 dark:bg-slate-800 gap-1">
            <div className="h-8 w-16 bg-white dark:bg-slate-700 rounded-lg animate-shimmer" />
            <div className="h-8 w-16 bg-transparent rounded-lg" />
          </div>
        </div>
      </div>

      {/* Desktop Side-By-Side Layout (Products Left, Filters Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Main Products Grid (Left) */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between px-1">
            <SkeletonText className="h-4 w-36" />
            <SkeletonText className="h-3.5 w-24" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Sticky Filters Sidebar (Right) */}
        <div className="hidden lg:block lg:col-span-3 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-4 w-20" />
              <SkeletonText className="h-3.5 w-16" />
            </div>
            {/* Search */}
            <div className="space-y-2">
              <SkeletonText className="h-3 w-28" />
              <div className="h-9 w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
            </div>
            {/* Categories */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-3 w-28" />
              <div className="space-y-1.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/80 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
            {/* Brands */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-3 w-24" />
              <div className="space-y-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/80 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
            {/* Rating */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-3 w-24" />
              <div className="space-y-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/80 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 3. CATEGORIES PAGE SKELETON
export const CategoriesPageSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-950 min-h-screen pb-16 sm:pb-24 space-y-6 sm:space-y-8">
    {/* Category Quick Nav Bar */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <CategoryBarSkeleton />
    </div>

    {/* Parallax Banner */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full py-8 sm:py-12 px-4 sm:px-8 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-2">
            <SkeletonText className="h-3.5 w-12" />
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <SkeletonText className="h-3.5 w-24" />
          </div>
          <div className="flex justify-center">
            <div className="h-6 w-48 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-shimmer" />
          </div>
          <SkeletonText className="h-8 sm:h-10 w-72 max-w-full mx-auto" />
          <SkeletonText className="h-4 w-96 max-w-full mx-auto" />
        </div>
      </div>
    </div>

    {/* Main Container */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Search & Department Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="h-10 w-full md:w-80 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-28 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
          </div>
        </div>
        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 animate-shimmer" />
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 space-y-4 shadow-2xs"
          >
            <div className="aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl relative overflow-hidden animate-shimmer">
              <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/80 dark:bg-slate-700" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <SkeletonText className="h-5 w-32" />
                <SkeletonText className="h-4 w-12 rounded-full" />
              </div>
              <SkeletonText className="h-3.5 w-full" />
              <SkeletonText className="h-3.5 w-2/3" />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg animate-shimmer" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 4. CATEGORY DETAIL PAGE SKELETON
export const CategoryDetailPageSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-950 min-h-screen pb-16 sm:pb-24 space-y-6 sm:space-y-8">
    {/* Category Hero Banner */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full py-8 sm:py-12 px-4 sm:px-8 flex items-center justify-center overflow-hidden bg-slate-900 text-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-800">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-2">
            <SkeletonText className="h-3.5 w-24 bg-slate-800" />
            <span className="text-slate-600">/</span>
            <SkeletonText className="h-3.5 w-20 bg-slate-800" />
          </div>
          <div className="flex justify-center">
            <div className="h-6 w-36 rounded-full bg-white/10 border border-white/20 animate-shimmer" />
          </div>
          <div className="h-8 sm:h-10 w-56 max-w-full bg-slate-800 rounded-xl mx-auto animate-shimmer" />
          <div className="h-4 w-96 max-w-full bg-slate-800/80 rounded mx-auto animate-shimmer" />
        </div>
      </div>
    </div>

    {/* Main Container */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-6 sm:space-y-8">
      {/* Top Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <SkeletonText className="h-4 w-16" />
          <div className="h-10 w-52 sm:w-64 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 animate-shimmer" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 dark:border-slate-700 p-1 rounded-xl bg-slate-50 dark:bg-slate-800 gap-1">
            <div className="h-8 w-16 bg-white dark:bg-slate-700 rounded-lg animate-shimmer" />
            <div className="h-8 w-16 bg-transparent rounded-lg" />
          </div>
        </div>
      </div>

      {/* Highlights Banner Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 animate-shimmer shrink-0" />
            <div className="space-y-1.5 flex-1">
              <SkeletonText className="h-3.5 w-28" />
              <SkeletonText className="h-2.5 w-40" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Products Grid (Left) */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between px-1">
            <SkeletonText className="h-4 w-40" />
            <SkeletonText className="h-3.5 w-24" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Sticky Filters Sidebar (Right) */}
        <div className="hidden lg:block lg:col-span-3 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-4 w-24" />
              <SkeletonText className="h-3.5 w-16" />
            </div>
            {/* Search */}
            <div className="space-y-2">
              <SkeletonText className="h-3 w-28" />
              <div className="h-9 w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
            </div>
            {/* Select Department */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-3 w-32" />
              <div className="space-y-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/80 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
            {/* Brands */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-3 w-24" />
              <div className="space-y-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/80 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
            {/* Reviews */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-3 w-28" />
              <div className="space-y-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/80 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
            {/* Colors */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-3 w-24" />
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/80 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 5. PRODUCT DETAIL PAGE SKELETON
export const ProductDetailPageSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-950 min-h-screen pb-16 sm:pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <SkeletonText className="h-4 w-12" />
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <SkeletonText className="h-4 w-20" />
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <SkeletonText className="h-4 w-36" />
      </div>

      {/* Main Product Showcase (2-Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square w-full bg-slate-100 dark:bg-slate-900 rounded-3xl animate-shimmer relative overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="absolute top-4 left-4 h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="absolute top-4 right-4 h-9 w-9 bg-white/80 dark:bg-slate-700 rounded-full" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-2xl shrink-0 border border-slate-200/80 dark:border-slate-800 animate-shimmer"
              />
            ))}
          </div>
          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-3 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 animate-shimmer shrink-0" />
                <div className="space-y-1">
                  <SkeletonText className="h-3.5 w-16" />
                  <SkeletonText className="h-2.5 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="h-5 w-24 bg-blue-100 dark:bg-blue-950/60 rounded-full animate-shimmer" />
            <SkeletonText className="h-8 sm:h-10 w-11/12" />
            <div className="flex items-center gap-3">
              <div className="h-4 w-24 bg-amber-100 dark:bg-amber-950/50 rounded animate-shimmer" />
              <SkeletonText className="h-4 w-20" />
            </div>
          </div>

          {/* Price Card */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div className="flex items-baseline gap-3">
              <SkeletonText className="h-8 w-32" />
              <SkeletonText className="h-5 w-20" />
              <div className="h-5 w-16 bg-rose-100 dark:bg-rose-950/50 rounded-full animate-shimmer" />
            </div>
            <div className="h-4 w-40 bg-emerald-100 dark:bg-emerald-950/50 rounded-full animate-shimmer" />
          </div>

          {/* Swatches / Selectors */}
          <div className="space-y-3">
            <SkeletonText className="h-4 w-24" />
            <div className="flex gap-2.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-shimmer border border-slate-200 dark:border-slate-700"
                />
              ))}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
              <div className="h-12 flex-1 bg-blue-600/50 rounded-2xl animate-shimmer" />
            </div>
            <div className="h-12 w-full bg-slate-900 dark:bg-slate-800 rounded-2xl animate-shimmer" />
          </div>

          {/* Metadata SKU */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex justify-between">
              <SkeletonText className="h-3 w-16" />
              <SkeletonText className="h-3 w-24" />
            </div>
            <div className="flex justify-between">
              <SkeletonText className="h-3 w-16" />
              <SkeletonText className="h-3 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Info & Specs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <SkeletonText className="h-6 w-28" />
          <SkeletonText className="h-6 w-32" />
          <SkeletonText className="h-6 w-24" />
          <SkeletonText className="h-6 w-28" />
        </div>
        <div className="space-y-3">
          <SkeletonText className="h-4 w-full" />
          <SkeletonText className="h-4 w-5/6" />
          <SkeletonText className="h-4 w-4/6" />
        </div>
      </div>

      {/* Related Products Carousel */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <SkeletonText className="h-7 sm:h-8 w-48" />
          <SkeletonText className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 6. CART PAGE SKELETON
export const CartPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="space-y-1">
        <SkeletonText className="h-8 w-44" />
        <SkeletonText className="h-4 w-28" />
      </div>
      <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer" />
    </div>

    {/* 2-Column: Left Cart Table + Right Summary */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {/* Free shipping threshold bar */}
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-2xl p-4 space-y-2">
          <div className="h-4 w-48 bg-blue-200 dark:bg-blue-800 rounded animate-shimmer" />
          <div className="h-2.5 w-full bg-blue-200/60 dark:bg-blue-800/60 rounded-full animate-shimmer" />
        </div>

        {/* Cart Item Cards */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 flex gap-4 items-center shadow-2xs"
          >
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 animate-shimmer" />
            <div className="flex-1 space-y-2">
              <SkeletonText className="h-5 w-3/5" />
              <SkeletonText className="h-3.5 w-1/4" />
              <SkeletonText className="h-5 w-20" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
              <div className="h-8 w-8 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-100 dark:border-rose-900/40 animate-shimmer" />
            </div>
          </div>
        ))}

        {/* Coupon Input */}
        <div className="flex gap-2 pt-2">
          <div className="h-11 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
          <div className="h-11 w-28 bg-slate-900 dark:bg-slate-800 rounded-xl animate-shimmer" />
        </div>
      </div>

      {/* Right Order Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5 shadow-2xs h-fit">
        <SkeletonText className="h-6 w-36" />
        <div className="space-y-3 pt-2">
          <div className="flex justify-between">
            <SkeletonText className="h-4 w-20" />
            <SkeletonText className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <SkeletonText className="h-4 w-20" />
            <SkeletonText className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <SkeletonText className="h-4 w-16" />
            <SkeletonText className="h-4 w-12" />
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            <SkeletonText className="h-6 w-24" />
            <SkeletonText className="h-6 w-24" />
          </div>
        </div>
        <div className="h-12 w-full bg-blue-600/60 rounded-2xl animate-shimmer" />
      </div>
    </div>
  </div>
);

// 7. CHECKOUT PAGE SKELETON
export const CheckoutPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
    {/* Step Progress Wizard */}
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex justify-around">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600/50 animate-shimmer" />
          <SkeletonText className="h-4 w-24" />
        </div>
      ))}
    </div>

    {/* 2-Column: Left Form + Right Summary */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-6">
        {/* Contact Info Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
          <SkeletonText className="h-5 w-36" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
            <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
          <SkeletonText className="h-5 w-44" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
              <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
            </div>
            <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
              <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
              <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
          <SkeletonText className="h-5 w-40" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
            <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
            <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
          </div>
          <div className="h-12 w-full bg-emerald-600/60 rounded-2xl animate-shimmer" />
        </div>
      </div>

      {/* Right Column: Order Preview */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
          <SkeletonText className="h-5 w-32" />
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 animate-shimmer" />
                <div className="flex-1 space-y-1.5">
                  <SkeletonText className="h-4 w-3/4" />
                  <SkeletonText className="h-3 w-1/3" />
                </div>
                <SkeletonText className="h-4 w-14" />
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <SkeletonText className="h-4 w-20" />
              <SkeletonText className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <SkeletonText className="h-4 w-20" />
              <SkeletonText className="h-4 w-16" />
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-6 w-24" />
              <SkeletonText className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 8. WISHLIST PAGE SKELETON
export const WishlistPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="space-y-1.5">
        <SkeletonText className="h-8 w-48" />
        <SkeletonText className="h-4 w-36" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-32 bg-blue-600/50 rounded-xl animate-shimmer" />
        <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer" />
      </div>
    </div>

    {/* Folder Tabs */}
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <div className="h-9 w-32 bg-blue-600/40 rounded-full animate-shimmer" />
      <div className="h-9 w-28 bg-slate-200/80 dark:bg-slate-800/80 rounded-full animate-shimmer" />
      <div className="h-9 w-28 bg-slate-200/80 dark:bg-slate-800/80 rounded-full animate-shimmer" />
    </div>

    {/* Wishlisted Product Cards Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(8)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// 9. MY ACCOUNT PAGE SKELETON
export const MyAccountPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
    {/* Profile Header Banner */}
    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 animate-shimmer shrink-0" />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <SkeletonText className="h-6 w-44" />
          <SkeletonText className="h-4 w-36" />
          <div className="h-5 w-24 bg-amber-100 dark:bg-amber-950/50 rounded-full animate-shimmer" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 text-center space-y-1"
            >
              <div className="h-5 w-10 bg-slate-200 dark:bg-slate-700 rounded mx-auto animate-shimmer" />
              <div className="h-3 w-14 bg-slate-200/60 dark:bg-slate-700/60 rounded mx-auto animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 2-Column: Left Nav + Right Main Panel */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 flex items-center gap-3 animate-shimmer"
          >
            <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0" />
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
          <SkeletonText className="h-5 w-36" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-28 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
            <div className="h-28 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
          <SkeletonText className="h-5 w-40" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 animate-shimmer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 10. ORDER TRACKING PAGE SKELETON
export const OrderTrackingPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
    {/* Header */}
    <div className="text-center max-w-md mx-auto space-y-2">
      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 mx-auto animate-shimmer" />
      <SkeletonText className="h-7 w-48 mx-auto" />
      <SkeletonText className="h-4 w-72 mx-auto" />
    </div>

    {/* Order Lookup Card */}
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
        <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
      </div>
      <div className="h-11 w-full bg-blue-600/60 rounded-xl animate-shimmer" />
    </div>

    {/* Order Timeline Progress Card */}
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-8 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <SkeletonText className="h-5 w-40" />
          <SkeletonText className="h-4 w-28" />
        </div>
        <div className="h-6 w-32 bg-emerald-100 dark:bg-emerald-950/50 rounded-full animate-shimmer" />
      </div>

      {/* 5-Step Timeline */}
      <div className="grid grid-cols-5 gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-2 text-center">
            <div className="w-8 h-8 rounded-full bg-blue-600/50 animate-shimmer" />
            <SkeletonText className="h-3.5 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 11. ADMIN PAGE SKELETON
export const AdminPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
    {/* Admin Top Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="space-y-1">
        <SkeletonText className="h-8 w-56" />
        <SkeletonText className="h-4 w-36" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer" />
        <div className="h-10 w-36 bg-blue-600/50 rounded-xl animate-shimmer" />
      </div>
    </div>

    {/* 4 Metric KPI Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-3 shadow-2xs"
        >
          <div className="flex justify-between">
            <SkeletonText className="h-4 w-20" />
            <div className="h-4 w-12 bg-emerald-100 dark:bg-emerald-950/50 rounded-full animate-shimmer" />
          </div>
          <SkeletonText className="h-7 w-28" />
          <SkeletonText className="h-3 w-32" />
        </div>
      ))}
    </div>

    {/* Tab Nav Bar */}
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-9 w-28 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl shrink-0 animate-shimmer"
        />
      ))}
    </div>

    {/* Data Table Skeleton */}
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between gap-4 pb-2">
        <div className="h-10 w-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
        <div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
      </div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-14 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 animate-shimmer"
          />
        ))}
      </div>
    </div>
  </div>
);

// 12. SEARCH RESULTS PAGE SKELETON
export const SearchResultsPageSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-950 min-h-screen pb-16 sm:pb-24 space-y-6 sm:space-y-8">
    {/* Top Category Nav */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <CategoryBarSkeleton />
    </div>

    {/* Search Input Banner */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4 text-center max-w-4xl mx-auto">
        <SkeletonText className="h-7 sm:h-9 w-64 mx-auto" />
        <div className="h-12 w-full max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-7 w-24 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full animate-shimmer"
            />
          ))}
        </div>
      </div>
    </div>

    {/* Main Container */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <SkeletonText className="h-4 w-16" />
          <div className="h-10 w-52 sm:w-60 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 dark:border-slate-700 p-1 rounded-xl bg-slate-50 dark:bg-slate-800 gap-1">
            <div className="h-8 w-16 bg-white dark:bg-slate-700 rounded-lg animate-shimmer" />
            <div className="h-8 w-16 bg-transparent rounded-lg" />
          </div>
        </div>
      </div>

      {/* Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between px-1">
            <SkeletonText className="h-4 w-36" />
            <SkeletonText className="h-3.5 w-24" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-3 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-5 shadow-xs">
            <SkeletonText className="h-4 w-28" />
            <div className="space-y-2">
              <SkeletonText className="h-3 w-28" />
              <div className="h-9 w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
            </div>
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-3 w-24" />
              <div className="space-y-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/80 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <SkeletonText className="h-3 w-24" />
              <div className="space-y-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/80 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 13. ABOUT PAGE SKELETON
export const AboutPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-12">
    {/* Hero Banner */}
    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 space-y-4 text-center max-w-3xl mx-auto">
      <div className="h-5 w-28 bg-blue-100 dark:bg-blue-950/60 rounded-full mx-auto animate-shimmer" />
      <SkeletonText className="h-9 sm:h-12 w-3/4 mx-auto" />
      <SkeletonText className="h-4 w-5/6 mx-auto" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1"
          >
            <SkeletonText className="h-6 w-14 mx-auto" />
            <SkeletonText className="h-3 w-18 mx-auto" />
          </div>
        ))}
      </div>
    </div>

    {/* 4 Pillars Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-3 shadow-2xs"
        >
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer" />
          <SkeletonText className="h-5 w-3/4" />
          <SkeletonText className="h-3.5 w-full" />
        </div>
      ))}
    </div>
  </div>
);

// 14. CONTACT PAGE SKELETON
export const ContactPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
    {/* Header */}
    <div className="text-center max-w-md mx-auto space-y-2">
      <div className="h-4 w-28 bg-blue-100 dark:bg-blue-950/60 rounded-full mx-auto animate-shimmer" />
      <SkeletonText className="h-8 w-56 mx-auto" />
      <SkeletonText className="h-4 w-72 mx-auto" />
    </div>

    {/* 3 Channels Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs"
        >
          <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer" />
          <SkeletonText className="h-4 w-28" />
          <SkeletonText className="h-3 w-40" />
        </div>
      ))}
    </div>

    {/* 2-Column: Contact Form + Store Locations */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-2xs">
        <SkeletonText className="h-5 w-36" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
          <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
        </div>
        <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-shimmer" />
        <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-shimmer" />
        <div className="h-11 w-full bg-blue-600/60 rounded-xl animate-shimmer" />
      </div>

      <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
        <SkeletonText className="h-5 w-32" />
        <div className="h-44 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl animate-shimmer" />
        <div className="space-y-2">
          <SkeletonText className="h-4 w-3/4" />
          <SkeletonText className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  </div>
);

// 15. FAQ PAGE SKELETON
export const FaqPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
    {/* Header & Search */}
    <div className="text-center max-w-lg mx-auto space-y-3">
      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/60 rounded-xl mx-auto animate-shimmer" />
      <SkeletonText className="h-8 w-64 mx-auto" />
      <div className="h-11 w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-shimmer" />
    </div>

    {/* Topic Filter Tabs */}
    <div className="flex gap-2 overflow-x-auto justify-center pb-2 scrollbar-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-8 w-28 bg-slate-200/80 dark:bg-slate-800/80 rounded-full shrink-0 animate-shimmer"
        />
      ))}
    </div>

    {/* FAQ Accordion List */}
    <div className="max-w-4xl mx-auto space-y-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <SkeletonText className="h-5 w-3/5" />
            <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded-full animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 16. POLICY PAGE SKELETON (Privacy, Returns, Terms)
export const PolicyPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
    {/* Header Banner */}
    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 space-y-3">
      <div className="h-5 w-32 bg-blue-100 dark:bg-blue-950/60 rounded-full animate-shimmer" />
      <SkeletonText className="h-8 sm:h-10 w-72" />
      <SkeletonText className="h-4 w-40" />
    </div>

    {/* Table of Contents Bar */}
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-8 w-32 bg-slate-200/80 dark:bg-slate-800/80 rounded-full shrink-0 animate-shimmer"
        />
      ))}
    </div>

    {/* Policy Structured Document Cards */}
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/60 rounded-lg animate-shimmer shrink-0" />
            <SkeletonText className="h-6 w-56" />
          </div>
          <div className="space-y-2 pt-2">
            <SkeletonText className="h-4 w-full" />
            <SkeletonText className="h-4 w-5/6" />
            <SkeletonText className="h-4 w-4/6" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 17. 404 NOT FOUND PAGE SKELETON
export const NotFoundPageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    <div className="w-full bg-slate-900 rounded-3xl p-8 sm:p-14 text-center space-y-6 border border-slate-800 shadow-xl">
      <div className="h-6 w-48 bg-slate-800 rounded-full mx-auto animate-shimmer" />
      <div className="h-10 sm:h-14 w-80 max-w-full bg-slate-800 rounded-2xl mx-auto animate-shimmer" />
      <div className="h-4 w-96 max-w-full bg-slate-800/80 rounded mx-auto animate-shimmer" />
      <div className="h-12 w-full max-w-lg bg-slate-800 rounded-2xl mx-auto animate-shimmer" />
      <div className="flex justify-center gap-3 pt-2">
        <div className="h-11 w-40 bg-blue-600/60 rounded-2xl animate-shimmer" />
        <div className="h-11 w-40 bg-slate-800 rounded-2xl animate-shimmer" />
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 animate-shimmer"
        />
      ))}
    </div>
  </div>
);

// ============================================================================
// MASTER PAGE SKELETON DISPATCHER
// ============================================================================
export const PageSkeleton: React.FC<{ page?: string }> = ({ page = 'home' }) => {
  switch (page) {
    case 'home':
      return <HomePageSkeleton />;
    case 'shop':
      return <ShopPageSkeleton />;
    case 'categories':
      return <CategoriesPageSkeleton />;
    case 'category-detail':
    case 'category':
      return <CategoryDetailPageSkeleton />;
    case 'product-detail':
    case 'product':
      return <ProductDetailPageSkeleton />;
    case 'cart':
      return <CartPageSkeleton />;
    case 'checkout':
      return <CheckoutPageSkeleton />;
    case 'wishlist':
      return <WishlistPageSkeleton />;
    case 'account':
      return <MyAccountPageSkeleton />;
    case 'order-tracking':
      return <OrderTrackingPageSkeleton />;
    case 'admin':
      return <AdminPageSkeleton />;
    case 'search-results':
    case 'search':
      return <SearchResultsPageSkeleton />;
    case 'about':
      return <AboutPageSkeleton />;
    case 'contact':
      return <ContactPageSkeleton />;
    case 'faq':
      return <FaqPageSkeleton />;
    case 'privacy-policy':
    case 'returns-policy':
    case 'terms-and-conditions':
      return <PolicyPageSkeleton />;
    case 'not-found':
    case '404':
      return <NotFoundPageSkeleton />;
    default:
      return <HomePageSkeleton />;
  }
};

export default PageSkeleton;
