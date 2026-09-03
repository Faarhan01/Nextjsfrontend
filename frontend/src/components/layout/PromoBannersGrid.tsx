import React from 'react';
import { ArrowRight, Sparkles, Tag, Zap, ShieldCheck, Truck } from 'lucide-react';
import { SafeImage } from '../ui/SafeImage';

interface PromoBannersGridProps {
  themeColor?: string;
  getThemeClasses?: (color?: string) => any;
  onSelectCategory?: (categoryName: string) => void;
  onNavigateShop?: () => void;
}

export const PromoBannersGrid: React.FC<PromoBannersGridProps> = ({
  themeColor = 'blue',
  getThemeClasses,
  onSelectCategory,
  onNavigateShop
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
        {/* ========================================================================= */}
        {/* Banner 1: Premium Audio & Tech Showcase */}
        {/* ========================================================================= */}
        <div 
          onClick={() => onSelectCategory ? onSelectCategory('Electronics') : onNavigateShop?.()}
          className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[240px] sm:min-h-[270px] p-6 sm:p-8 flex flex-col justify-between group cursor-pointer border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300"
        >
          {/* Subtle Ambient Theme Background Tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-slate-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-850 pointer-events-none" />

          {/* Right Side Visual Showcase Image with Consistent Blend */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-5/12 overflow-hidden pointer-events-none">
            <div className="relative w-full h-full">
              <SafeImage
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
                alt="Next-Gen Wireless Audio & Gadgets"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                placeholderType="product"
                loading="lazy"
              />
              {/* Smooth, consistent left fade mask matching the background to avoid any harsh cutoff or see-through gaps */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent dark:from-slate-800 dark:via-slate-800/40 dark:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/20 dark:from-slate-800/60 dark:via-transparent dark:to-slate-800/20" />
            </div>
          </div>

          {/* Left / Main Text Content (Relative z-10 for high contrast and readability) */}
          <div className="relative z-10 max-w-[65%] sm:max-w-[62%] space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 shadow-2xs">
                <Zap className="w-3 h-3 fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400" /> Premium Tech
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Up to 30% Off
              </span>
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Next-Gen Wireless Audio &amp; Gadgets
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-2">
              Upgrade your setup with active noise cancellation, studio-grade drivers, and ergonomic devices.
            </p>
          </div>

          {/* Bottom Action CTA */}
          <div className="relative z-10 pt-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-blue-700 dark:text-blue-400 group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
              Explore Tech Showcase <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Banner 2: Modern Home & Living Furniture */}
        {/* ========================================================================= */}
        <div 
          onClick={() => onSelectCategory ? onSelectCategory('Home & Kitchen') : onNavigateShop?.()}
          className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[240px] sm:min-h-[270px] p-6 sm:p-8 flex flex-col justify-between group cursor-pointer border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all duration-300"
        >
          {/* Subtle Ambient Theme Background Tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-slate-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-850 pointer-events-none" />

          {/* Right Side Visual Showcase Image with Consistent Blend */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-5/12 overflow-hidden pointer-events-none">
            <div className="relative w-full h-full">
              <SafeImage
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop"
                alt="Modern Home & Living Furniture"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                placeholderType="product"
                loading="lazy"
              />
              {/* Smooth, consistent left fade mask matching the background to avoid any harsh cutoff or see-through gaps */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent dark:from-slate-800 dark:via-slate-800/40 dark:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/20 dark:from-slate-800/60 dark:via-transparent dark:to-slate-800/20" />
            </div>
          </div>

          {/* Left / Main Text Content (Relative z-10 for high contrast and readability) */}
          <div className="relative z-10 max-w-[65%] sm:max-w-[62%] space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 shadow-2xs">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Living Essentials
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Artisan Crafted
              </span>
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Modern Home &amp; Living Furniture
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-2">
              Crafted for comfort, aesthetic harmony, and everyday luxury in every curated space.
            </p>
          </div>

          {/* Bottom Action CTA */}
          <div className="relative z-10 pt-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-900 dark:group-hover:text-emerald-300 transition-colors">
              Shop Furniture Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PromoBannersGrid;

