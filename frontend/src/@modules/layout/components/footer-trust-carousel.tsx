'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Award,
  Leaf,
  PackageCheck,
  CreditCard
} from 'lucide-react';
import { useThemeContext } from '@/providers/theme-provider';
import { useCartContext } from '@/providers/cart-provider';
import { getThemeClasses } from '@/providers/theme-provider';

interface FooterTrustCarouselProps {
  freeShippingThreshold?: number;
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate' | string;
  currentTheme?: {
    bg: string;
    text: string;
    border: string;
    lightBg: string;
    badge: string;
    accent: string;
    primaryHex: string;
    shadow: string;
    ring: string;
  };
}

export const FooterTrustCarousel: React.FC<FooterTrustCarouselProps> = ({
  freeShippingThreshold: propThreshold,
  currentTheme: propCurrentTheme
}) => {
  const { themeColor, freeShippingThreshold: cartThreshold } = useThemeContext();
  const currentTheme = propCurrentTheme ?? getThemeClasses(themeColor);
  const threshold = propThreshold ?? cartThreshold ?? 1000;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const trustBadges = [
    {
      id: 'shipping',
      icon: Truck,
      title: 'Free Express Shipping',
      description: `On all orders over R${threshold}`
    },
    {
      id: 'security',
      icon: ShieldCheck,
      title: '100% Secure Checkout',
      description: 'Encrypted 256-bit SSL payments'
    },
    {
      id: 'returns',
      icon: RotateCcw,
      title: '30-Day Easy Returns',
      description: 'Hassle-free money-back guarantee'
    },
    {
      id: 'support',
      icon: Headphones,
      title: '24/7 Dedicated Support',
      description: 'Live assistance & email care team'
    },
    {
      id: 'authenticity',
      icon: Award,
      title: 'Authenticity Guaranteed',
      description: '100% verified original merchandise'
    },
    {
      id: 'tracking',
      icon: PackageCheck,
      title: 'Instant Order Tracking',
      description: 'Real-time SMS & dispatch updates'
    },
    {
      id: 'eco',
      icon: Leaf,
      title: 'Eco-Friendly Fulfillment',
      description: 'Carbon-conscious packing & logistics'
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: 'Flexible Payment Methods',
      description: 'Apple Pay, Cards, Instant EFT'
    }
  ];

  // Check scroll boundary limits
  const checkScrollBoundaries = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScrollBoundaries();
    window.addEventListener('resize', checkScrollBoundaries);
    return () => window.removeEventListener('resize', checkScrollBoundaries);
  }, [checkScrollBoundaries]);

  // Smooth mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.35;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
    checkScrollBoundaries();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div 
      id="footer-trust-carousel" 
      className="relative w-full pb-8 mb-8 border-b border-slate-200/80 dark:border-slate-800 select-none"
      aria-label="Customer Guarantees Carousel"
    >
      {/* Horizontal Carousel Track Wrapper with Subtle Fade Indicators */}
      <div className="relative">
        {/* Left Gradient Fade */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Right Gradient Fade */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Scrollable Container (matching smooth dragging behavior of category carousel) */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollBoundaries}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-1 px-1 select-none w-full ${
            isDragging ? 'scroll-auto cursor-grabbing' : 'scroll-smooth cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                id={`trust-badge-${badge.id}`}
                className="shrink-0 flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 w-[240px] sm:w-[260px] pointer-events-auto"
              >
                {/* Badge Icon with clean light theme background */}
                <div
                  className={`w-10 h-10 rounded-xl ${currentTheme.lightBg} ${currentTheme.text} dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col min-w-0">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate leading-snug">
                    {badge.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 line-clamp-1">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FooterTrustCarousel;
