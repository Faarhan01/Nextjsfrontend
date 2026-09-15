'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useCatalog } from '@/providers/catalog-provider';
import { useThemeContext, getThemeClasses, ThemeClasses } from '@/providers/theme-provider';
import { SlideConfig } from '@/types';

/**
 * Hero Component Props
 * Adheres to MedusaJS Next.js storefront module conventions.
 */
export interface HeroProps {
  slides?: SlideConfig[];
  className?: string;
  autoplayInterval?: number;
}

/**
 * Slide Animation Variants
 * Returns easing and translation animation states based on slide configuration.
 */
const getTitleAnimation = (type?: SlideConfig['titleAnimation']) => {
  switch (type) {
    case 'slideInLeft':
      return { x: [-50, 0], opacity: [0, 1] };
    case 'zoomIn':
      return { scale: [0.95, 1], opacity: [0, 1] };
    default:
      return { y: [20, 0], opacity: [0, 1] };
  }
};

const getSubtitleAnimation = (type?: SlideConfig['subtitleAnimation']) => {
  switch (type) {
    case 'slideInLeft':
      return { x: [-30, 0], opacity: [0, 1] };
    case 'zoomIn':
      return { scale: [0.95, 1], opacity: [0, 1] };
    default:
      return { y: [15, 0], opacity: [0, 1] };
  }
};

const resolveSlideHref = (targetPage?: string) => {
  switch (targetPage) {
    case 'categories':
      return '/categories';
    case 'contact':
      return '/contact';
    default:
      return '/shop';
  }
};

/**
 * HeroSlide Sub-Component
 * Renders an active slide item with background scrim, animated typography, and CTA.
 */
interface HeroSlideItemProps {
  slide: SlideConfig;
  currentTheme: ThemeClasses;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
}

const HeroSlideItem: React.FC<HeroSlideItemProps> = React.memo(({
  slide,
  currentTheme,
  onSwipeNext,
  onSwipePrev,
}) => {
  const titleAnim = useMemo(() => getTitleAnimation(slide.titleAnimation), [slide.titleAnimation]);
  const subAnim = useMemo(() => getSubtitleAnimation(slide.subtitleAnimation), [slide.subtitleAnimation]);
  const href = useMemo(() => resolveSlideHref(slide.targetPage), [slide.targetPage]);

  const backgroundStyles = useMemo(() => {
    if (slide.backgroundType === 'gradient') {
      return { background: slide.backgroundGradient };
    }
    if (slide.backgroundType === 'color') {
      return { backgroundColor: slide.backgroundColor };
    }
    return {
      backgroundImage: `url(${slide.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }, [slide.backgroundType, slide.backgroundGradient, slide.backgroundColor, slide.backgroundImage]);

  const buttonStyleClass = useMemo(() => {
    if (slide.buttonStyle === 'pill') {
      return 'rounded-full';
    }
    if (slide.buttonStyle === 'outline') {
      return 'border-2 border-white hover:bg-white hover:text-slate-900 bg-transparent';
    }
    return 'rounded-2xl';
  }, [slide.buttonStyle]);

  return (
    <motion.div
      key={slide.id}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        const swipeThreshold = 40;
        if (info.offset.x < -swipeThreshold || info.velocity.x < -200) {
          onSwipeNext();
        } else if (info.offset.x > swipeThreshold || info.velocity.x > 200) {
          onSwipePrev();
        }
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 w-full h-full flex items-center cursor-grab active:cursor-grabbing touch-pan-y"
      style={backgroundStyles}
      role="group"
      aria-roledescription="slide"
      aria-label={slide.title}
    >
      {/* Background Gradient Scrims */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/40 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20 z-0 pointer-events-none" />

      {/* Slide Content */}
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
              href={href}
              className={`inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-extrabold tracking-wide text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg ${buttonStyleClass} ${
                slide.buttonStyle !== 'outline' ? currentTheme.bg : ''
              } ${currentTheme.shadow}`}
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

HeroSlideItem.displayName = 'HeroSlideItem';

/**
 * HeroNavigation Sub-Component
 * Renders previous and next chevron buttons.
 */
interface HeroNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

const HeroNavigation: React.FC<HeroNavigationProps> = React.memo(({ onPrev, onNext }) => (
  <>
    <button
      type="button"
      onClick={onPrev}
      className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border border-white/10 shadow-lg"
      aria-label="Previous Slide"
    >
      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
    </button>
    <button
      type="button"
      onClick={onNext}
      className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border border-white/10 shadow-lg"
      aria-label="Next Slide"
    >
      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
    </button>
  </>
));

HeroNavigation.displayName = 'HeroNavigation';

/**
 * HeroPagination Sub-Component
 * Renders bottom indicator dots for slides.
 */
interface HeroPaginationProps {
  totalSlides: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

const HeroPagination: React.FC<HeroPaginationProps> = React.memo(({
  totalSlides,
  activeIndex,
  onSelect,
}) => (
  <div
    className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2"
    role="tablist"
    aria-label="Slide Selector"
  >
    {Array.from({ length: totalSlides }).map((_, idx) => (
      <button
        key={idx}
        type="button"
        role="tab"
        aria-selected={idx === activeIndex}
        aria-label={`Go to slide ${idx + 1}`}
        onClick={() => onSelect(idx)}
        className={`h-2 rounded-full transition-all duration-300 outline-none cursor-pointer ${
          idx === activeIndex ? 'w-6 bg-white shadow' : 'w-2 bg-white/40 hover:bg-white/70'
        }`}
      />
    ))}
  </div>
));

HeroPagination.displayName = 'HeroPagination';

/**
 * MedusaJS Storefront Hero Component
 * 
 * Implements the Medusa Next.js starter hero module pattern:
 * - Clean separation of concerns with atomic sub-components (HeroSlideItem, HeroNavigation, HeroPagination)
 * - Self-contained carousel lifecycle with clean autoplay timer management
 * - Preserves pixel-for-pixel responsive layout, dark theme scoping, drag swipe, and animations
 */
export const Hero: React.FC<HeroProps> = ({
  slides: propSlides,
  className = '',
  autoplayInterval = 5500,
}) => {
  const { slides: catalogSlides } = useCatalog();
  const { themeColor } = useThemeContext();
  const currentTheme = useMemo(() => getThemeClasses(themeColor), [themeColor]);

  const activeSlides = propSlides && propSlides.length > 0 ? propSlides : catalogSlides;
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safe slide index within bounds
  const totalSlides = activeSlides.length;
  const safeIndex = totalSlides > 0 ? currentSlideIndex % totalSlides : 0;

  const restartAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    if (totalSlides > 1) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
      }, autoplayInterval);
    }
  }, [totalSlides, autoplayInterval]);

  const handleNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    restartAutoplay();
  }, [totalSlides, restartAutoplay]);

  const handlePrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    restartAutoplay();
  }, [totalSlides, restartAutoplay]);

  const handleSelect = useCallback((index: number) => {
    setCurrentSlideIndex(index);
    restartAutoplay();
  }, [restartAutoplay]);

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [restartAutoplay]);

  if (!activeSlides || activeSlides.length === 0) {
    return null;
  }

  const activeSlide = activeSlides[safeIndex] || activeSlides[0];

  return (
    <section
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hero-slider-dark-scope ${className}`}
      aria-roledescription="carousel"
      role="region"
      aria-label="Promotional Hero Showcase"
    >
      <div className="relative w-full overflow-hidden bg-slate-900 select-none rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/60">
        <div className="h-[210px] xs:h-[260px] sm:h-[320px] lg:h-[380px] w-full relative">
          <AnimatePresence mode="wait">
            {activeSlide && (
              <HeroSlideItem
                key={activeSlide.id}
                slide={activeSlide}
                currentTheme={currentTheme}
                onSwipeNext={handleNext}
                onSwipePrev={handlePrev}
              />
            )}
          </AnimatePresence>

          {totalSlides > 1 && (
            <>
              <HeroNavigation onPrev={handlePrev} onNext={handleNext} />
              <HeroPagination
                totalSlides={totalSlides}
                activeIndex={safeIndex}
                onSelect={handleSelect}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
