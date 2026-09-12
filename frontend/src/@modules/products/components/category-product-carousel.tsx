'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getProductSaleDetails } from '@/utils/productUtils';
import { formatCurrency } from '@/utils/pricing';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Heart, 
  Search, 
  Plus, 
  Star,
  Grid,
  Sparkles,
  Crown,
  Tag,
  Eye,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { MockCategory, MockProduct } from '@/types';

interface CategoryProductCarouselProps {
  categories: MockCategory[];
  products: MockProduct[];
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses: (color: string) => any;
  wishlist: string[];
  onToggleWishlist: (productId: string, productName: string) => void;
  onAddToCart: (product: any) => void;
  onSelectProduct: (productId: string) => void;
  onQuickView: (product: MockProduct) => void;
  onViewMoreCategory: (categoryName: string) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop';

export function getCarouselCategoryProducts(
  categoryName: string, 
  allProducts: MockProduct[], 
  categories: MockCategory[]
): MockProduct[] {
  const getCoreCategory = (id: string): string => {
    if (id === 'prod-1' || id === 'prod-3') return 'Electronics';
    if (id === 'prod-2' || id === 'prod-4') return 'Home & Kitchen';
    if (id === 'prod-5' || id === 'prod-6') return 'Apparel & Fashion';
    return 'Other';
  };

  const matched = allProducts.filter(p => getCoreCategory(p.id) === categoryName);

  if (categoryName === 'Sale Items') {
    return [
      {
        id: 'sale-1',
        name: 'Premium Wireless Headphones (Spring Sale)',
        price: '$149.00',
        imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop',
        url: '/product/premium-wireless-headphones',
        description: 'Special seasonal price reduction.'
      },
      {
        id: 'sale-2',
        name: 'Designer Retro Sunglasses (Flash Sale)',
        price: '$59.00',
        imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=600&auto=format&fit=crop',
        url: '/product/designer-retro-sunglasses',
        description: 'Limited inventory sale.'
      },
      {
        id: 'sale-3',
        name: 'Smart Thermal Bottle (Clearance)',
        price: '$29.00',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
        url: '/product/smart-thermal-bottle',
        description: 'End of season clearance.'
      },
      {
        id: 'sale-4',
        name: 'Minimalist White Watch (Limited Edition)',
        price: '$119.00',
        imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop',
        url: '/product/minimalist-white-watch',
        description: 'Exclusive bundle deal.'
      }
    ];
  }

  if (matched.length >= 3) {
    return matched;
  }

  const catInfo = categories.find(c => c.name === categoryName);
  const catId = catInfo ? catInfo.id : 99;

  switch (categoryName) {
    case 'Electronics':
      return [
        ...matched,
        { id: 'elec-1', name: 'High-Fidelity Noise Canceling Earbuds', price: '$129.00', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'elec-2', name: 'Ultra-Slim Aluminum Bluetooth Keyboard', price: '$79.00', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'elec-3', name: 'Smart Wireless Desk Charging Station', price: '$49.00', imageUrl: 'https://images.unsplash.com/photo-1622445268121-ac11f17a2834?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'elec-4', name: 'Portable HD Cinema Projector', price: '$229.00', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Home & Kitchen':
      return [
        ...matched,
        { id: 'hk-1', name: 'Handcrafted Ceramic Dripper Coffee Set', price: '$58.00', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'hk-2', name: 'Nordic Oak & Matte White Pendant Lamp', price: '$115.00', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'hk-3', name: 'Aesthetic Linen Table Cloth & Runner Set', price: '$42.00', imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'hk-4', name: 'Minimalist Cast Iron Dutch Oven', price: '$89.00', imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Apparel & Fashion':
      return [
        ...matched,
        { id: 'apparel-1', name: 'Heavyweight Organic Cotton Relaxed Hoodie', price: '$88.00', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'apparel-2', name: 'Tailored Wool-Blend Oversized Trench', price: '$210.00', imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'apparel-3', name: 'Minimalist Unstructured Canvas Tote Bag', price: '$34.00', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'apparel-4', name: 'Italian Leather Everyday Sneaker', price: '$145.00', imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Personal Care & Wellness':
      return [
        { id: 'wellness-1', name: 'Artisan Bamboo Beard Grooming Kit', price: '$39.00', imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'wellness-2', name: 'Cold-Pressed Eucalyptus Essential Oil Set', price: '$25.00', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'wellness-3', name: 'Organic Herbal Sleep Bath Salts', price: '$18.00', imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'wellness-4', name: 'Ultrasonic Aromatherapy Diffuser', price: '$48.00', imageUrl: 'https://images.unsplash.com/photo-1602928321679-560b4139c907?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Beauty & Accessories':
      return [
        { id: 'beauty-1', name: 'Rose Quartz Facial Roller & Gua Sha Set', price: '320.00', imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'beauty-2', name: 'Sandalwood & Neroli Organic Face Mist', price: '220.00', imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'beauty-3', name: 'Hydrating Botanical Lip Serum', price: '160.00', imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'beauty-4', name: 'Velvet Soft Travel Cosmetics Pouch', price: '280.00', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Pest Control':
      return [
        { id: 'pest-1', name: 'Ultrasonic Eco Insect & Rodent Repeller', price: '290.00', imageUrl: 'https://images.unsplash.com/photo-1587334206496-114272446ecd?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'pest-2', name: 'Non-Toxic Botanical Garden Barrier Spray', price: '190.00', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'pest-3', name: 'Solar Outdoor LED Mosquito Zapper Lamp', price: '350.00', imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'pest-4', name: 'Organic Citrus & Neem Household Deterrent', price: '160.00', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Automotive':
      return [
        { id: 'auto-1', name: 'Compact High-Pressure Wireless Air Inflator', price: '650.00', imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'auto-2', name: 'Ergonomic Memory Foam Seat Cushion', price: '380.00', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'auto-3', name: 'Premium Ceramic Car Coating Spray', price: '240.00', imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1beb6d?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'auto-4', name: 'Magnetic Universal Smartphone Mount', price: '190.00', imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Stationery & Office':
      return [
        { id: 'stat-1', name: 'Minimalist Vegan Leather Desk Mat', price: '320.00', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'stat-2', name: 'Brass Executive Rollerball Pen Set', price: '280.00', imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'stat-3', name: 'Hardcover Linen Grid Journal Planner', price: '220.00', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'stat-4', name: 'Architectural Solid Aluminum Ruler', price: '180.00', imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Appliances':
      return [
        { id: 'app-1', name: 'Compact Retro Air Fryer Oven', price: '990.00', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'app-2', name: 'Aesthetic Electric Temperature Glass Kettle', price: '580.00', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'app-3', name: 'Ultra-Quiet HEPA Room Air Purifier', price: '1290.00', imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'app-4', name: 'Handheld Garment Steamer & Iron', price: '450.00', imageUrl: 'https://images.unsplash.com/photo-1585336261026-8f5786372969?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Pet Supplies':
      return [
        { id: 'pet-1', name: 'Orthopedic Memory Foam Pet Bed', price: '680.00', imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'pet-2', name: 'Automatic Stainless Water Fountain', price: '390.00', imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'pet-3', name: 'Reflective Padded No-Pull Dog Harness', price: '260.00', imageUrl: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'pet-4', name: 'Interactive Sisal Cat Scratching Post', price: '340.00', imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Sports & Outdoors':
      return [
        { id: 'sport-1', name: 'Eco-Friendly High-Grip TPE Yoga Mat', price: '340.00', imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'sport-2', name: 'Heavy Duty Latex Resistance Band Set', price: '220.00', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'sport-3', name: 'Insulated Stainless Hydration Canteen', price: '380.00', imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'sport-4', name: 'Compact Trail Running Fanny Pack', price: '290.00', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Toys & Games':
      return [
        { id: 'toy-1', name: 'Architectural Wooden Building Blocks', price: '420.00', imageUrl: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'toy-2', name: 'Classic Wooden Chess & Checkers Set', price: '350.00', imageUrl: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'toy-3', name: 'Aesthetic Illustrated 1000-Piece Puzzle', price: '240.00', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'toy-4', name: 'Retro Handheld Arcade Game Console', price: '490.00', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Tools & Hardware':
      return [
        { id: 'tool-1', name: 'Precision Screwdriver & Maintenance Kit', price: '290.00', imageUrl: 'https://images.unsplash.com/photo-1581147036324-c17da419a9a2?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'tool-2', name: 'Compact Cordless 12V Power Drill', price: '790.00', imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'tool-3', name: 'Digital Laser Measure Tape Device', price: '360.00', imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'tool-4', name: 'Heavy Duty Multi-Tool Pocket Plier', price: '320.00', imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    case 'Food & Groceries':
      return [
        { id: 'food-1', name: 'Cold-Pressed Extra Virgin Olive Oil', price: '280.00', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'food-2', name: 'Organic Japanese Ceremonial Matcha', price: '340.00', imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'food-3', name: 'Artisan Raw Wildflower Honey Jar', price: '180.00', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: 'food-4', name: 'Single-Origin Specialty Whole Bean Coffee', price: '220.00', imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop', url: '' }
      ];

    default:
      return [
        { id: `generic-${catId}-1`, name: `${categoryName} Premium Edition Item`, price: '890.00', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: `generic-${catId}-2`, name: `Aesthetic ${categoryName} Craft Design`, price: '350.00', imageUrl: 'https://images.unsplash.com/photo-1513507688996-c75259e8ae5b?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: `generic-${catId}-3`, name: `Handcrafted ${categoryName} Accent`, price: '520.00', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', url: '' },
        { id: `generic-${catId}-4`, name: `Minimalist ${categoryName} Essentials`, price: '680.00', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', url: '' }
      ];
  }
}

export default function CategoryProductCarousel({
  categories,
  products,
  themeColor,
  getThemeClasses,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onQuickView,
  onViewMoreCategory
}: CategoryProductCarouselProps) {
  const currentTheme = getThemeClasses(themeColor);

  // Pick a category initially from categories list
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (categories && categories.length > 0) {
      return categories[0].name;
    }
    return 'Electronics';
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pillsContainerRef = useRef<HTMLDivElement>(null);

  // Get current category products
  const categoryProducts = useMemo(() => {
    return getCarouselCategoryProducts(selectedCategory, products, categories);
  }, [selectedCategory, products, categories]);

  // Scroll controls for products carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Scroll active category pill horizontally within container when selectedCategory changes
  useEffect(() => {
    if (pillsContainerRef.current) {
      const activeEl = pillsContainerRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
      if (activeEl) {
        const container = pillsContainerRef.current;
        const scrollLeft = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
        container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
      }
    }
  }, [selectedCategory]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 w-full">
      {/* Outer Boxed Card Wrapper */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-xs relative">
        
        {/* Isolated Background Glow Container to prevent clipping navigation controls */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl sm:rounded-3xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/30 dark:bg-amber-900/15 rounded-full blur-3xl -ml-16 -mb-16" />
        </div>

        {/* Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200/70 dark:border-slate-700">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Products by category
          </h2>

          {/* Carousel Controls Header Group */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 w-full sm:w-auto">
            {/* Left / Right Scroll Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={() => scrollCarousel('left')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition active:scale-95 shadow-2xs cursor-pointer shrink-0"
                aria-label="Scroll left"
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition active:scale-95 shadow-2xs cursor-pointer shrink-0"
                aria-label="Scroll right"
                title="Scroll right"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Explore All Button */}
            <button
              onClick={() => onViewMoreCategory(selectedCategory)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 dark:bg-slate-800 ${currentTheme.hoverBg} text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all duration-200 flex items-center gap-1 sm:gap-1.5 cursor-pointer group hover:scale-[1.02] active:scale-95 shrink-0 whitespace-nowrap`}
            >
              <span>Explore All</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Category Selector Tabs / Pills */}
        <div className="relative z-10 py-2.5 sm:py-3">
          <div 
            ref={pillsContainerRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth touch-auto"
          >
            {categories.map((cat) => {
              const isActive = cat.name === selectedCategory;
              return (
                <button
                  key={cat.id}
                  data-active={isActive ? 'true' : 'false'}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1 sm:gap-1.5 cursor-pointer select-none ${
                    isActive
                      ? `${currentTheme.bg} text-white shadow-xs scale-102`
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700'
                  }`}
                >
                  {cat.imageUrl && (
                    <SafeImage 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      placeholderType="category"
                      className="w-3 h-3 rounded-full object-cover shrink-0" 
                    />
                  )}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative z-10 mt-1 group/carousel">
          {/* Side Floating Left Arrow (Visible on sm and up to prevent clipping on mobile) */}
          <button 
            onClick={() => scrollCarousel('left')}
            className="hidden sm:flex absolute -left-3 lg:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition-all duration-200 active:scale-95 shadow-md cursor-pointer shrink-0"
            aria-label="Scroll left"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Side Floating Right Arrow (Visible on sm and up to prevent clipping on mobile) */}
          <button 
            onClick={() => scrollCarousel('right')}
            className="hidden sm:flex absolute -right-3 lg:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition-all duration-200 active:scale-95 shadow-md cursor-pointer shrink-0"
            aria-label="Scroll right"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {/* Carousel Track */}
              <div 
                ref={scrollContainerRef}
                className="w-full overflow-x-auto scrollbar-none py-1.5 sm:py-2 px-0.5 sm:px-1 scroll-smooth snap-x snap-mandatory touch-auto"
              >
                <div className="flex gap-2.5 sm:gap-4 min-w-full px-0.5 pr-4 sm:pr-6">
                  {categoryProducts.map((prod) => {
                    const isWishlisted = wishlist.includes(prod.id);
                    const ratingScore = '4.9';
                    const ratingCount = '88';

                    return (
                      <div 
                        key={prod.id}
                        className="snap-start shrink-0 w-[160px] sm:w-[220px] lg:w-[240px] bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/8 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                      >
                        {/* Image Block */}
                        <div 
                          onClick={() => onSelectProduct(prod.id)}
                          className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-700/50 cursor-pointer"
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
                              <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
                                {sale.isSale && (
                                  <div className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] sm:text-[10px] tracking-wider uppercase shadow-2xs flex items-center gap-1 border border-rose-500/50">
                                    <Tag className="w-2 h-2 text-white" />
                                    <span>{sale.badgeText}</span>
                                  </div>
                                )}
                                {(prod.isFeatured || (!sale.isSale && prod.isFeatured !== false)) && (
                                  <div className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[9px] sm:text-[10px] tracking-wider uppercase border border-slate-700/50 shadow-2xs flex items-center gap-1">
                                    <Crown className="w-2 h-2 text-amber-400" />
                                    <span>Featured</span>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* Action Stack (Quick View) */}
                          {onQuickView && (
                            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onQuickView(prod);
                                }}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-200 ${currentTheme.hoverText} ${currentTheme.hoverLightBg} shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer`}
                                title="Quick View"
                              >
                                <Eye className="w-3 h-3 stroke-[2.5]" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Content Block */}
                        <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-800">
                          <div className="cursor-pointer" onClick={() => onSelectProduct(prod.id)}>
                            <h3 className={`text-xs sm:text-xs font-extrabold text-slate-900 dark:text-white ${currentTheme.groupHoverText} transition-colors duration-200 line-clamp-2 leading-tight sm:leading-snug w-full`}>
                              {prod.name}
                            </h3>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                              <StockBadge product={prod} />
                              <div className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/50 px-1 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/50 text-[9px] sm:text-[10px] font-extrabold w-max">
                                <Star className="w-2 h-2 text-amber-500 fill-amber-400 shrink-0" />
                                <span>{ratingScore}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/80">
                            <div>
                              <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Price</span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{formatCurrency(prod.price)}</span>
                            </div>
                            {onAddToCart && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToCart(prod);
                                }}
                                className={`p-1.5 sm:p-2 rounded-xl ${currentTheme.bg} text-white hover:opacity-90 active:scale-95 transition-all shadow-xs flex items-center justify-center shrink-0 cursor-pointer`}
                                title="Add to Cart"
                              >
                                <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}

                  {/* View More End Card */}
                  <div className="snap-start shrink-0 w-[140px] sm:w-[180px] bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-300 group/end relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 flex items-center justify-center mb-2 sm:mb-2.5 group-hover/end:scale-110 transition-transform">
                      <Grid className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
                    </div>

                    <h4 className="font-extrabold text-[11px] sm:text-xs mb-0.5">
                      Explore All
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-300 mb-2.5 sm:mb-3 leading-tight font-medium">
                      See full {selectedCategory} collection
                    </p>

                    <button
                      onClick={() => onViewMoreCategory(selectedCategory)}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white text-slate-900 hover:bg-blue-400 hover:text-white text-[11px] sm:text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

