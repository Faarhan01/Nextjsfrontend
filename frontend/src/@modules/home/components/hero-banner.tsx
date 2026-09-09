'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Star, 
  Play, 
  Pause,
  Zap,
  Layers,
  Compass,
  RotateCcw,
  Headphones,
  Flame,
  Search,
  BadgePercent
} from 'lucide-react';
import { SlideConfig } from '@/types';
import { SafeImage } from '@modules/common/components/safe-image';

interface HeroBannerProps {
  slides: SlideConfig[];
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  autoplay: boolean;
  setAutoplay?: (val: boolean) => void;
  restartAutoplay: () => void;
  currentTheme: {
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
  onNavigate: (page: string, category?: string, brand?: string) => void;
  freeShippingThreshold?: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  slides,
  currentSlideIndex,
  setCurrentSlideIndex,
  autoplay,
  setAutoplay,
  restartAutoplay,
  currentTheme,
  onNavigate,
  freeShippingThreshold = 1000
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    restartAutoplay();
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    restartAutoplay();
  };

  const toggleAutoplay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (setAutoplay) {
      setAutoplay(nextState);
    }
  };

  // Curated Eyebrow / Tag Capsule by Slide
  const getSlideBadge = (slide: SlideConfig, index: number) => {
    if (index === 0) {
      return {
        icon: <Sparkles className="w-3 h-3 text-amber-300" />,
        text: 'NEW SEASON 2026',
        highlight: 'Curated Designer Living'
      };
    }
    if (index === 1) {
      return {
        icon: <Zap className="w-3 h-3 text-emerald-300" />,
        text: 'AUDIOPHILE & SMART GEAR',
        highlight: 'Studio Master Quality'
      };
    }
    return {
      icon: <Compass className="w-3 h-3 text-sky-300" />,
      text: 'FLAGSHIP ATELIER',
      highlight: 'VIP Interior Consultation'
    };
  };

  const slideShortLabels = [
    { title: 'Modern Living', sub: 'Designer Furniture' },
    { title: 'Studio Audio', sub: 'Hi-Fi Electronics' },
    { title: 'Flagship Store', sub: 'Bespoke Atelier' }
  ];

  const currentBadge = getSlideBadge(currentSlide, currentSlideIndex);

  const handleSlideButtonClick = (e: React.MouseEvent, slide: SlideConfig) => {
    e.preventDefault();
    e.stopPropagation();
    const target = slide.targetPage || slide.buttonUrl;
    if (target === 'categories' || target === '#categories' || slide.id === 2) {
      onNavigate('categories');
    } else if (target === 'contact' || target === '#contact' || slide.id === 3) {
      onNavigate('contact');
    } else if (target === 'shop' || target === '#shop' || target === '#products' || slide.id === 1) {
      onNavigate('shop', 'All', 'All');
    } else if (slide.buttonUrl && (slide.buttonUrl.startsWith('http://') || slide.buttonUrl.startsWith('https://'))) {
      window.open(slide.buttonUrl, '_blank');
    } else {
      onNavigate('shop', 'All', 'All');
    }
  };

  const quickTrends = [
    { label: 'Minimalist Sofas', category: 'Living Room' },
    { label: 'Wireless Hi-Fi', category: 'Electronics' },
    { label: 'Smart Lighting', category: 'Home Decor' },
    { label: 'Ergonomic Seating', category: 'Office' },
    { label: 'Artisan Ceramics', category: 'Kitchen & Dining' }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5 sm:space-y-3 hero-slider-dark-scope">
      
      {/* Top Interactive Announcement Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl sm:rounded-2xl border border-slate-800 shadow-2xs text-xs font-medium">
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center justify-center p-1 rounded-md bg-amber-400/20 text-amber-300 shrink-0">
            <BadgePercent className="w-3 h-3" />
          </span>
          <span className="font-bold text-slate-100">Exclusive Welcome Privileges:</span>
          <span className="text-slate-300 truncate">Enjoy 15% off your first curated order with code <code className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-bold tracking-wider">FIRST15</code></span>
        </div>
        <button 
          onClick={() => onNavigate('shop', 'All', 'All')}
          className="shrink-0 text-blue-300 hover:text-blue-200 font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider transition cursor-pointer"
        >
          <span>Claim Offer</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Hero Banner Container */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full overflow-hidden bg-slate-900 select-none rounded-2xl sm:rounded-3xl shadow-none border border-slate-700/60 group"
      >
        {/* Dynamic banner canvas */}
        <div className="relative min-h-[400px] xs:min-h-[440px] sm:min-h-[480px] md:min-h-[500px] lg:min-h-[530px] w-full flex items-center">
          
          {/* Background Slides with smooth transitions */}
          <AnimatePresence mode="wait">
            {slides.map((slide, idx) => {
              if (idx !== currentSlideIndex) return null;

              return (
                <motion.div
                  key={slide.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 40;
                    if (info.offset.x < -swipeThreshold || info.velocity.x < -200) {
                      handleNextSlide();
                    } else if (info.offset.x > swipeThreshold || info.velocity.x > 200) {
                      handlePrevSlide();
                    }
                  }}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-pan-y overflow-hidden"
                >
                  {slide.backgroundType === 'gradient' ? (
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ background: slide.backgroundGradient }}
                    />
                  ) : slide.backgroundType === 'color' ? (
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ backgroundColor: slide.backgroundColor }}
                    />
                  ) : (
                    <div className="absolute inset-0 z-0">
                      <SafeImage 
                        src={slide.backgroundImage} 
                        alt={slide.title}
                        placeholderType="banner"
                        className="w-full h-full object-cover opacity-90 scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}

                  {/* Clean scrim for crisp text contrast without artificial dark splotches or uneven see-through */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/40 pointer-events-none z-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20 pointer-events-none z-0" />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Main Content Area */}
          <div className="relative z-10 w-full px-5 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-14 flex flex-col md:flex-row md:items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Column: Heading, Eyebrow, Subtitle & Action CTAs */}
            <div className="max-w-xl lg:max-w-2xl text-white">
              
              {/* Eyebrow Capsule */}
              <motion.div
                key={`badge-${currentSlideIndex}`}
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white mb-3.5 sm:mb-4.5"
              >
                {currentBadge.icon}
                <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase text-white/95">
                  {currentBadge.text}
                </span>
                <span className="hidden xs:inline-block w-1 h-1 rounded-full bg-white/40" />
                <span className="hidden xs:inline-block text-[10px] font-bold text-white/80">
                  {currentBadge.highlight}
                </span>
              </motion.div>

              {/* Animated Display Heading */}
              <motion.h1
                key={`title-${currentSlideIndex}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: '#ffffff' }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight !text-white leading-[1.12] mb-3 sm:mb-4"
              >
                {currentSlide.title}
              </motion.h1>

              {/* Animated Subtitle Description */}
              <motion.p
                key={`subtitle-${currentSlideIndex}`}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: '#e2e8f0' }}
                className="text-xs sm:text-sm md:text-base !text-slate-200 font-medium leading-relaxed max-w-xl mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-none"
              >
                {currentSlide.subtitle}
              </motion.p>

              {/* Action Buttons Row */}
              <motion.div
                key={`cta-${currentSlideIndex}`}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap items-center gap-3 sm:gap-4"
              >
                {/* Primary Button */}
                <button
                  type="button"
                  onClick={(e) => handleSlideButtonClick(e, currentSlide)}
                  className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 ${
                    currentSlide.buttonStyle === 'outline'
                      ? 'border-2 border-white text-white hover:bg-white hover:text-slate-950 bg-transparent rounded-2xl'
                      : currentSlide.buttonStyle === 'pill'
                      ? `rounded-full text-white ${currentTheme.bg} shadow-md hover:shadow-lg ${currentTheme.shadow}`
                      : `rounded-2xl text-white ${currentTheme.bg} shadow-md hover:shadow-lg ${currentTheme.shadow}`
                  }`}
                >
                  <span>{currentSlide.buttonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Secondary Discovery Button */}
                <button
                  type="button"
                  onClick={() => onNavigate(currentSlideIndex === 1 ? 'shop' : 'categories')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 rounded-2xl backdrop-blur-md transition-all cursor-pointer active:scale-95"
                >
                  <Layers className="w-4 h-4 text-white/80" />
                  <span>{currentSlideIndex === 1 ? 'Browse Tech & Audio' : 'Explore Collections'}</span>
                </button>
              </motion.div>

            </div>

            {/* Right Column: Editorial Highlight Bento Widget (Desktop & Tablet) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex flex-col gap-3 shrink-0 w-72 lg:w-80"
            >
              {/* Feature Box 1: Free Express Delivery */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-sm transition-all duration-300 group/card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-blue-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>Express Shipping</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">Free</span>
                    </div>
                    <div className="text-[11px] text-slate-300/80 truncate font-medium">
                      On all qualifying orders over R{freeShippingThreshold}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Box 2: Quality & Authenticity */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-sm transition-all duration-300 group/card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-300/30 flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>Verified Authenticity</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-400/30 text-amber-200 border border-amber-300/40">100%</span>
                    </div>
                    <div className="text-[11px] text-slate-300/80 truncate font-medium">
                      Guaranteed original brands with warranty
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Box 3: Customer Satisfaction */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-sm transition-all duration-300 group/card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-400/20 text-blue-300 border border-blue-300/30 flex items-center justify-center shrink-0 shadow-2xs">
                    <Star className="w-5 h-5 fill-blue-300 text-blue-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>4.9 / 5.0 Star Rating</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-blue-400/30 text-blue-200 border border-blue-300/40">Top Tier</span>
                    </div>
                    <div className="text-[11px] text-slate-300/80 truncate font-medium">
                      Rated by over 12,000+ satisfied clients
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Navigation Arrows (Desktop visible on hover or persistent) */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Bottom Bar: Interactive Direct Slide Switch Tabs + Slide Counter */}
          <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-20 px-5 sm:px-8 md:px-12 flex items-center justify-between gap-4">
            
            {/* Direct Slide Switch Tabs on Desktop / Minimal Dots on Mobile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {slides.map((s, idx) => {
                const isActive = idx === currentSlideIndex;
                const label = slideShortLabels[idx] || { title: `Slide 0${idx + 1}`, sub: 'Collection' };
                return (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      restartAutoplay();
                    }}
                    className={`transition-all duration-300 outline-none cursor-pointer text-left rounded-xl ${
                      isActive 
                        ? 'bg-white/25 backdrop-blur-md border border-white/35 px-3 py-1.5 text-white' 
                        : 'bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/10 px-2 sm:px-3 py-1.5 text-white/70 hover:text-white'
                    }`}
                    title={`Go to ${label.title}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400 ring-2 ring-amber-400/30 animate-pulse' : 'bg-white/40'}`} />
                      <span className="text-xs font-bold hidden sm:inline-block">{label.title}</span>
                      <span className="text-[10px] text-white/50 hidden lg:inline-block">• {label.sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Slide Counter & Autoplay Control */}
            <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-white">
              <span className="text-[11px] font-black tracking-wider text-white">
                0{currentSlideIndex + 1}
              </span>
              <span className="text-[10px] text-white/40 font-bold">/</span>
              <span className="text-[11px] font-bold text-white/60">
                0{slides.length}
              </span>
              <div className="w-px h-3 bg-white/20 mx-0.5" />
              <button
                type="button"
                onClick={toggleAutoplay}
                className="text-white/80 hover:text-white transition p-0.5 cursor-pointer"
                title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Hero Quick Search & Trending Tags Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 shrink-0">
          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Trending Explorations:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {quickTrends.map((trend, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onNavigate('shop', trend.category, 'All')}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              {trend.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className="text-xs font-bold px-3 py-1 rounded-lg text-blue-400 hover:underline transition cursor-pointer flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Hero 4-Pillar Trust Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-1">
        {/* Pillar 1 */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xs hover:shadow-md transition-all flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400 shrink-0">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">Express Delivery</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-0.5">Complimentary over R{freeShippingThreshold}</p>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xs hover:shadow-md transition-all flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-950/50 text-amber-400 border border-amber-900/60 shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">100% Certified</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-0.5">Authenticity & full warranty</p>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xs hover:shadow-md transition-all flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-900/60 shrink-0">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">30-Day Returns</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-0.5">Hassle-free return policy</p>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xs hover:shadow-md transition-all flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950/50 text-blue-400 border border-blue-900/60 shrink-0">
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">24/7 VIP Concierge</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-0.5">Dedicated live assistance</p>
          </div>
        </div>
      </div>

    </section>
  );
};
