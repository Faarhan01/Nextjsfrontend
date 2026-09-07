'use client';

import React, { useState, useMemo, useRef } from 'react';
import { 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Eye, 
  Heart, 
  ShoppingCart, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Truck, 
  Coffee, 
  Lamp, 
  Armchair
} from 'lucide-react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { MockProduct, MockCategory } from '@/types';
import { formatCurrency } from '@/utils/pricing';
import { getProductSaleDetails } from '@/utils/productUtils';
import { getProductRatingDetails } from '@/utils/productRating';

interface HomeLivingShowcaseProps {
  products: MockProduct[];
  categories?: MockCategory[];
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses?: (color?: string) => any;
  wishlist: string[];
  onToggleWishlist: (productId: string, productName?: string) => void;
  onAddToCart: (product: any) => void;
  onSelectProduct: (productId: string) => void;
  onQuickView: (product: MockProduct) => void;
  onViewCategory?: (categoryName: string) => void;
}

export interface HomeProductItem extends MockProduct {
  curatedBadge?: string;
  material?: string;
  subCategory?: string;
}

export function HomeLivingShowcase({
  products,
  themeColor = 'emerald',
  getThemeClasses,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onQuickView,
  onViewCategory
}: HomeLivingShowcaseProps) {
  const currentTheme = getThemeClasses ? getThemeClasses(themeColor) : null;
  const carouselRef = useRef<HTMLDivElement>(null);

  // Added To Cart feedback animation state
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Active sub-filter pill state
  const [selectedSubfilter, setSelectedSubfilter] = useState<'all' | 'kitchen' | 'decor' | 'furniture'>('all');

  // Scroll state for carousel buttons
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Curated category products for Home & Living
  const homeProducts: HomeProductItem[] = useMemo(() => {
    const matchedFromStore = products.filter(p => {
      const nameLower = (p.name || '').toLowerCase();
      const tags = (p.tags || []).map(t => t.toLowerCase());
      const catId = p.categoryId;
      return (
        catId === 3 || // Home & Kitchen
        p.id.includes('prod-2') ||
        p.id.includes('prod-4') ||
        p.id.includes('hk') ||
        tags.includes('home') ||
        tags.includes('kitchen') ||
        tags.includes('decor') ||
        nameLower.includes('mug') ||
        nameLower.includes('lamp') ||
        nameLower.includes('bottle') ||
        nameLower.includes('ceramic') ||
        nameLower.includes('linen') ||
        nameLower.includes('furniture')
      );
    });

    const curatedList: HomeProductItem[] = [
      {
        id: 'home-showcase-1',
        name: 'Handcrafted Ceramic Pour-Over Coffee Dripper Set',
        price: 'R649.00',
        originalPrice: 'R799.00',
        isSale: true,
        saleBadgeText: 'SAVE R150',
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Matte glaze artisanal ceramic carafe and micro-mesh dripper for the ultimate morning brew.',
        material: 'Hand-thrown stoneware ceramic',
        subCategory: 'kitchen',
        curatedBadge: 'Artisan Crafted'
      },
      {
        id: 'home-showcase-2',
        name: 'Nordic Oak & Matte White Hanging Pendant Light',
        price: 'R1,299.00',
        originalPrice: 'R1,599.00',
        isSale: true,
        saleBadgeText: '20% OFF',
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Warm ambient illumination with solid FSC-certified Scandinavian oak trim and spun aluminum shade.',
        material: 'Solid Oak & Spun Aluminum',
        subCategory: 'decor',
        curatedBadge: 'Bestseller'
      },
      {
        id: 'home-showcase-3',
        name: 'French Cast Iron Enameled Dutch Oven (4.5L)',
        price: 'R1,450.00',
        originalPrice: 'R1,850.00',
        isSale: true,
        saleBadgeText: 'HOT DEAL',
        imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Heavyweight enameled cast iron for superior heat retention, slow braising, and sourdough baking.',
        material: 'Enameled Heavy Cast Iron',
        subCategory: 'kitchen',
        curatedBadge: 'Chef Choice'
      },
      {
        id: 'home-showcase-4',
        name: 'Pure Stonewashed French Linen Table Runner & Napkins',
        price: 'R499.00',
        imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: '100% natural organic flax linen pre-washed for effortless drape and relaxed dining elegance.',
        material: '100% Organic French Linen',
        subCategory: 'decor',
        curatedBadge: 'Eco Certified'
      },
      {
        id: 'home-showcase-5',
        name: 'Ultrasonic Ceramic Aromatherapy Essential Oil Diffuser',
        price: 'R780.00',
        originalPrice: 'R920.00',
        isSale: true,
        saleBadgeText: '15% OFF',
        imageUrl: 'https://images.unsplash.com/photo-1602928321679-560b4139c907?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Quiet ultrasonic cool-mist technology with ambient warm LED night glow and auto shut-off.',
        material: 'Textured Matte Ceramic',
        subCategory: 'decor',
        curatedBadge: 'Relaxation'
      },
      {
        id: 'home-showcase-6',
        name: 'Modern Sculptural Solid Ash Wood Lounge Stool',
        price: 'R2,150.00',
        originalPrice: 'R2,600.00',
        isSale: true,
        saleBadgeText: 'DESIGNER',
        imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Ergonomic saddle contour seat carved from sustainable solid white ash with natural oil finish.',
        material: 'Solid White Ash',
        subCategory: 'furniture',
        curatedBadge: 'Handmade'
      },
      {
        id: 'home-showcase-7',
        name: 'Smart Double-Wall Thermal Flask with Temp Display',
        price: 'R450.00',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Touch-sensitive digital LED lid display for real-time beverage temperature tracking.',
        material: '18/8 Stainless Steel & Silicone',
        subCategory: 'kitchen',
        curatedBadge: 'Smart Kitchen'
      }
    ];

    // Combine existing products with curated items ensuring uniqueness
    const combined: HomeProductItem[] = [
      ...matchedFromStore.map(p => ({
        ...p,
        subCategory: p.name.toLowerCase().includes('chair') || p.name.toLowerCase().includes('bench') ? 'furniture' : 'kitchen',
        curatedBadge: 'Curated Item'
      }))
    ];

    for (const item of curatedList) {
      if (!combined.some(p => p.id === item.id || p.name === item.name)) {
        combined.push(item);
      }
    }

    return combined;
  }, [products]);

  // Filter products by subfilter if requested
  const filteredProducts = useMemo(() => {
    if (selectedSubfilter === 'all') return homeProducts;
    return homeProducts.filter(p => p.subCategory === selectedSubfilter);
  }, [homeProducts, selectedSubfilter]);

  const handleAddToCartWithFeedback = (e: React.MouseEvent, product: MockProduct) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-20">
      {/* Dedicated Section Card Background */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-amber-50/40 via-white to-slate-50 dark:from-slate-800/90 dark:via-slate-800/95 dark:to-slate-850 border border-amber-200/70 dark:border-slate-700 p-5 sm:p-7 md:p-9 shadow-sm">
        
        {/* Subtle Ambient Background Lighting Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* ========================================================================= */}
        {/* 1. CATEGORY SHOWCASE BANNER */}
        {/* ========================================================================= */}
        <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white p-6 sm:p-8 md:p-10 mb-8 border border-amber-800/30 shadow-md">
          {/* Background image overlay with seamless scrim */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-7/12 pointer-events-none overflow-hidden">
            <SafeImage
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop"
              alt="Curated Home & Living Showcase"
              className="w-full h-full object-cover object-center opacity-40 md:opacity-60 scale-105"
              placeholderType="banner"
              loading="lazy"
            />
            {/* Consistent Left Scrim to ensure crisp typography contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 md:via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-2xs backdrop-blur-xs">
                <Home className="w-3.5 h-3.5 text-amber-400" />
                Living Essentials
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-200/90 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-300" /> Curated Collection
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Modern Home &amp; Living Essentials
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed max-w-lg">
              Elevate your everyday spaces with handcrafted ceramics, Scandinavian lighting, sustainable cookware, and heirloom-quality furniture.
            </p>

            {/* Quick Value Props Tags */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" /> Free Shipping over R500
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 30-Day Quality Guarantee
              </span>
            </div>

            {/* CTA Button */}
            <div className="pt-3">
              <button
                onClick={() => onViewCategory ? onViewCategory('Home & Kitchen') : null}
                className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group"
              >
                <span>Explore Home &amp; Kitchen</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SECTION CONTROLS & SUB-FILTER BAR */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Featured Products in Home &amp; Living
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {filteredProducts.length} items
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Swipe or use controls to discover trending lifestyle additions
            </p>
          </div>

          {/* Carousel Scroll Navigation Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition cursor-pointer active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
              aria-label="Previous home products"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition cursor-pointer active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
              aria-label="Next home products"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PRODUCT CAROUSEL */}
        {/* ========================================================================= */}
        <div
          ref={carouselRef}
          onScroll={updateScrollState}
          className="relative z-10 flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none py-2 scroll-smooth snap-x snap-mandatory"
        >
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isAdded = !!addedItemIds[product.id];
            const saleDetails = getProductSaleDetails(product);
            const ratingDetails = getProductRatingDetails(product);

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className="group snap-start shrink-0 w-64 sm:w-72 bg-white dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/80 hover:border-amber-400 dark:hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                {/* Product Image Stage */}
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-700/50 mb-3 border border-slate-100 dark:border-slate-700">
                    <SafeImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      placeholderType="product"
                      fallbackTitle={product.name}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                      {product.curatedBadge && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
                          {product.curatedBadge}
                        </span>
                      )}
                      {saleDetails.isSale && (
                        <span className="inline-flex items-center text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
                          {saleDetails.badgeText || 'SALE'}
                        </span>
                      )}
                    </div>

                    {/* Quick Action Overlay Buttons */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id, product.name);
                        }}
                        className={`p-2 rounded-xl transition-all shadow-md active:scale-90 cursor-pointer ${
                          isWishlisted
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-200 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-700'
                        }`}
                        aria-label="Wishlist"
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(product);
                        }}
                        className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-md active:scale-90 cursor-pointer"
                        aria-label="Quick View"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata & Title */}
                  <div className="space-y-1">
                    {product.material && (
                      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block truncate">
                        {product.material}
                      </span>
                    )}

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h4>

                    {/* Ratings */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {ratingDetails.rating.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({ratingDetails.reviewCount || 24})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Add to Cart Action */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="block text-xs text-slate-400 line-through font-medium">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddToCartWithFeedback(e, product)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950'
                    }`}
                    title="Add to Cart"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default HomeLivingShowcase;
