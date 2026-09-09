'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { RecentlyViewedSection } from '@components/shared/recently-viewed';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Star, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronLeft,
  ChevronRight, 
  ChevronDown,
  ChevronUp, 
  Minus, 
  Plus,
  MessageSquare,
  Sparkles,
  Info,
  Building2,
  Barcode,
  SlidersHorizontal,
  Zap,
  Tag,
  Layers,
  Folder,
  Maximize2,
  Share2,
  Mail,
  Copy,
  Link2,
  X
} from 'lucide-react';
import { MockProduct, CustomWishlist, UserProfile, VendorOffer } from '@/types';
import { formatCurrency } from '@/utils/pricing';
import { MOCK_CATEGORIES } from '@/data/presets';
import { getProductSaleDetails } from '@/utils/productUtils';
import { getProductUrl, getCategoryUrl, getShopUrl, updateSEOMetadata } from '@/utils/seoUtils';
import { getProductRatingDetails, DEFAULT_STORE_REVIEWS } from '@/utils/productRating';
import { useCatalog } from '@/providers/catalog-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses } from '@/providers/theme-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { ProductReviews } from '@modules/products/components/product-reviews';
import { VendorOffersBuyBox } from '@modules/products/components/vendor-offers-buy-box';

interface ProductDetailPageProps {
  productId?: string;
  products?: MockProduct[];
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses?: (color: string) => any;
  wishlist?: string[];
  customWishlists?: CustomWishlist[];
  handleToggleWishlist?: (id: string, name: string) => void;
  onToggleProductInLists?: (productId: string, targetListIds: string[]) => void;
  onCreateWishlist?: (name: string, description?: string, icon?: string) => CustomWishlist;
  handleAddToCart?: (product: any, qty?: number, selectedOffer?: VendorOffer) => void;
  onBuyNow?: () => void;
  onBack?: () => void;
  onSelectProduct?: (id: string) => void;
  onSearch?: (query: string) => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
}

export default function ProductDetailPage({
  productId: propProductId,
  products: propProducts,
  themeColor: propThemeColor,
  getThemeClasses: propGetThemeClasses,
  wishlist: propWishlist,
  customWishlists: propCustomWishlists,
  handleToggleWishlist: propHandleToggleWishlist,
  onToggleProductInLists: propOnToggleProductInLists,
  onCreateWishlist: propOnCreateWishlist,
  handleAddToCart: propHandleAddToCart,
  onBuyNow: propOnBuyNow,
  onBack: propOnBack,
  onSelectProduct: propOnSelectProduct,
  onSearch,
  currentUser: propCurrentUser,
  onOpenAuth: propOnOpenAuth
}: ProductDetailPageProps) {
  const router = useRouter();
  const params = useParams();
  const catalogCtx = useCatalog();
  const cartCtx = useCartContext();
  const wishlistCtx = useWishlistContext();
  const themeCtx = useThemeContext();
  const authCtx = useAuthContext();

  const rawParamId = (params?.id as string) || '';
  const productId = propProductId || rawParamId;
  const products = propProducts || catalogCtx.products;
  const themeColor = propThemeColor || themeCtx.themeColor;
  const getThemeClasses = propGetThemeClasses || defaultGetThemeClasses;
  const wishlist = propWishlist || wishlistCtx.wishlist;
  const customWishlists = propCustomWishlists || wishlistCtx.customWishlists || [];
  const handleToggleWishlist = propHandleToggleWishlist || wishlistCtx.toggleWishlist;
  const onToggleProductInLists = propOnToggleProductInLists || wishlistCtx.toggleProductInLists;
  const onCreateWishlist = propOnCreateWishlist || wishlistCtx.createWishlist;
  const handleAddToCart = propHandleAddToCart || ((p, qty, offer) => cartCtx.addToCart(p, qty || 1, offer));
  const onBack = propOnBack || (() => router.back());
  const onSelectProduct = propOnSelectProduct || ((id: string) => router.push(getProductUrl(id)));
  const currentUser = propCurrentUser !== undefined ? propCurrentUser : authCtx.currentUser;
  const onOpenAuth = propOnOpenAuth || (() => authCtx.setAuthModalOpen(true));

  const onBuyNow = propOnBuyNow || (() => {
    if (product) {
      handleAddToCart(product, 1, selectedOffer || undefined);
      router.push('/checkout');
    }
  });

  const currentTheme = getThemeClasses(themeColor);
  const { sellerAccounts } = catalogCtx;
  const { addToCart } = cartCtx;
  
  // Find product
  const product = useMemo(() => {
    const target = (productId || '').toLowerCase().trim();
    if (!target) return products[0];
    return products.find(p => {
      const pId = p.id.toLowerCase();
      if (pId === target) return true;
      if (`prod-${pId}` === target) return true;
      if (pId.replace(/^prod-/, '') === target) return true;
      if (target.startsWith(`${pId}-`)) return true;
      const pSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (pSlug === target) return true;
      return false;
    }) || products[0];
  }, [productId, products]);

  // Multi-vendor offer selection
  const [selectedOffer, setSelectedOffer] = useState<VendorOffer | null>(null);

  useEffect(() => {
    if (product?.offers && product.offers.length > 0) {
      setSelectedOffer(product.offers[0]);
    } else {
      setSelectedOffer(null);
    }
  }, [product]);

  // Product Category Name lookup
  const categoryName = useMemo(() => {
    if (product.categoryId) {
      const found = MOCK_CATEGORIES.find(c => c.id === product.categoryId);
      if (found) return found.name;
    }
    const name = product.name.toLowerCase();
    if (name.includes('headphone') || name.includes('keyboard') || name.includes('camera') || name.includes('hub') || name.includes('watch') || name.includes('phone') || name.includes('speaker') || name.includes('drone')) {
      return 'Electronics';
    }
    if (name.includes('chair') || name.includes('desk') || name.includes('lamp') || name.includes('sofa') || name.includes('table') || name.includes('cookware')) {
      return 'Home & Kitchen';
    }
    if (name.includes('bag') || name.includes('jacket') || name.includes('wallet') || name.includes('shoe') || name.includes('shirt') || name.includes('wear')) {
      return 'Apparel & Fashion';
    }
    return 'General Collection';
  }, [product.categoryId, product.name]);

  // Record recently viewed items
  useEffect(() => {
    if (product?.id) {
      try {
        const saved = localStorage.getItem('luxestore_recently_viewed');
        let list: string[] = saved ? JSON.parse(saved) : [];
        list = [product.id, ...list.filter(id => id !== product.id)].slice(0, 10);
        localStorage.setItem('luxestore_recently_viewed', JSON.stringify(list));
      } catch (e) {
        console.error('Error saving recently viewed product:', e);
      }
    }
  }, [product?.id]);

  // Set document title, meta description, and canonical link
  useEffect(() => {
    if (product) {
      const title = `${product.name} | Mrbulk`;
      const description = product.description || `Shop ${product.name} at Mrbulk (mrbulk.co.za). Fast nationwide shipping across South Africa and easy returns.`;
      const canonicalPath = getProductUrl(product.id, product.name);
      updateSEOMetadata(title, description, canonicalPath);
    }
  }, [product]);

  // Options State
  const [selectedColor, setSelectedColor] = useState<string>('Default');
  const [selectedSize, setSelectedSize] = useState<string>('One Size');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  // Sticky Bar Scroll Tracking State
  const [showDesktopSticky, setShowDesktopSticky] = useState<boolean>(false);
  const mainCtaSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!mainCtaSectionRef.current) return;
      const rect = mainCtaSectionRef.current.getBoundingClientRect();
      // Show sticky bar when the bottom of the main CTA section is scrolled past the top viewport area
      setShowDesktopSticky(rect.bottom < 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Wishlist Selection Modal State
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);
  const [selectedListIdsForProduct, setSelectedListIdsForProduct] = useState<string[]>([]);
  const [isCreatingListInModal, setIsCreatingListInModal] = useState<boolean>(false);
  const [newListNameInModal, setNewListNameInModal] = useState<string>('');

  // Available custom wishlists with fallback basic lists
  const availableWishlists = useMemo(() => {
    if (customWishlists && customWishlists.length > 0) return customWishlists;
    return [
      {
        id: 'list-favourites',
        name: 'Favourites',
        description: 'Your primary saved items',
        icon: 'heart',
        productIds: wishlist,
        createdAt: new Date().toISOString(),
        isDefault: true
      },
      {
        id: 'list-gift-ideas',
        name: 'Gift Ideas',
        description: 'Presents for upcoming celebrations & holidays',
        icon: 'gift',
        productIds: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'list-dream-closet',
        name: 'Dream Closet',
        description: 'Luxury statement pieces saved for later',
        icon: 'sparkles',
        productIds: [],
        createdAt: new Date().toISOString()
      }
    ];
  }, [customWishlists, wishlist]);

  const handleOpenWishlistModal = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      handleToggleWishlist(product.id, product.name);
      return;
    }
    const currentContainedLists = availableWishlists
      .filter(l => l.productIds.includes(product.id))
      .map(l => l.id);

    setSelectedListIdsForProduct(currentContainedLists);
    setIsCreatingListInModal(false);
    setNewListNameInModal('');
    setIsWishlistModalOpen(true);
  };

  const handleToggleListSelection = (listId: string) => {
    setSelectedListIdsForProduct(prev =>
      prev.includes(listId) ? prev.filter(id => id !== listId) : [...prev, listId]
    );
  };

  const handleCreateNewListInModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListNameInModal.trim()) return;
    if (onCreateWishlist) {
      const created = onCreateWishlist(newListNameInModal.trim(), 'Custom wishlist collection');
      if (created) {
        setSelectedListIdsForProduct(prev => [...prev, created.id]);
      }
    } else {
      const mockId = `list-${Date.now()}`;
      setSelectedListIdsForProduct(prev => [...prev, mockId]);
    }
    setNewListNameInModal('');
    setIsCreatingListInModal(false);
  };

  const handleSaveWishlistModalChanges = () => {
    if (onToggleProductInLists) {
      onToggleProductInLists(product.id, selectedListIdsForProduct);
    } else {
      handleToggleWishlist(product.id, product.name);
    }
    setIsWishlistModalOpen(false);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };
  const tagsScrollRef = useRef<HTMLDivElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  // Hover state for previous / next product navigation preview dropdown
  const [hoveredNav, setHoveredNav] = useState<'prev' | 'next' | null>(null);

  // Calculate current product index and prev/next products for pagination
  const currentIndex = useMemo(() => {
    return products.findIndex(p => p.id === product.id);
  }, [product.id, products]);

  const prevProduct = useMemo(() => {
    if (!products || products.length <= 1) return null;
    const prevIdx = (currentIndex - 1 + products.length) % products.length;
    return products[prevIdx];
  }, [currentIndex, products]);

  const nextProduct = useMemo(() => {
    if (!products || products.length <= 1) return null;
    const nextIdx = (currentIndex + 1) % products.length;
    return products[nextIdx];
  }, [currentIndex, products]);

  // Computed product tags
  const productTags = useMemo(() => {
    if (product.tags && product.tags.length > 0) {
      return product.tags;
    }
    const derived = new Set<string>();
    if (product.brand) derived.add(product.brand);
    if (product.isFeatured) derived.add('Featured');
    if (product.isSale) derived.add('On Sale');
    product.name.split(' ').forEach(w => {
      const clean = w.replace(/[^a-zA-Z0-9]/g, '');
      if (clean.length >= 4 && !['With', 'From', 'This', 'That'].includes(clean)) {
        derived.add(clean);
      }
    });
    derived.add('Premium Quality');
    derived.add('Verified');
    return Array.from(derived).slice(0, 6);
  }, [product]);

  // Computed product categories for current product
  const productCategories = useMemo(() => {
    const list: Array<{ name: string }> = [];
    
    // Primary Category
    if (categoryName) {
      list.push({ name: categoryName });
    }

    // Category from MOCK_CATEGORIES by ID
    if (product.categoryId) {
      const match = MOCK_CATEGORIES.find(c => c.id === product.categoryId);
      if (match && !list.some(c => c.name.toLowerCase() === match.name.toLowerCase())) {
        list.push({ name: match.name });
      }
    }

    // Find other related categories from MOCK_CATEGORIES
    MOCK_CATEGORIES.forEach(cat => {
      if (!list.some(c => c.name.toLowerCase() === cat.name.toLowerCase())) {
        const text = (product.name + ' ' + (product.description || '')).toLowerCase();
        if (text.includes(cat.name.toLowerCase().split(' ')[0])) {
          list.push({ name: cat.name });
        }
      }
    });

    // Supplementary curated department tags
    const fallbackCategories = [
      'Featured Collections',
      'Best Sellers',
      'Smart Tech & Gadgets',
      'Home & Modern Living',
      'Luxury Essentials',
      'New Arrivals'
    ];

    fallbackCategories.forEach(cat => {
      if (list.length < 6 && !list.some(c => c.name === cat)) {
        list.push({ name: cat });
      }
    });

    return list;
  }, [categoryName, product]);

  const barcodeValue = useMemo(() => {
    let raw = '8901' + (product.id.charCodeAt(0) * 137).toString() + (product.id.charCodeAt(product.id.length - 1) * 89).toString();
    raw = raw.replace(/\D/g, '').padEnd(12, '4').slice(0, 12);
    return `${raw.slice(0, 1)} ${raw.slice(1, 6)} ${raw.slice(6, 12)}`;
  }, [product.id]);

  // Interactive gallery images
  const images = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [
      product.imageUrl,
      // Fallback alternatives for mock visual richness
      product.imageUrl.replace('q=80', 'q=80&sat=-50'),
      product.imageUrl.replace('q=80', 'q=80&hue=200'),
    ];
  }, [product]);

  const [mainImage, setMainImage] = useState<string>(product.imageUrl);

  // Sync main image when product changes
  React.useEffect(() => {
    setMainImage(product.imageUrl);
    setSelectedColor('Default');
    setSelectedSize('One Size');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const isWishlisted = wishlist.includes(product.id);

  // Related products (same category/tag or just other items)
  const relatedProducts = useMemo(() => {
    return products.filter(p => p.id !== product.id).slice(0, 4);
  }, [product, products]);

  // Hardcoded product color presets for immersive feel
  const colorOptions = useMemo(() => {
    switch (product.id) {
      case 'prod-1':
        return [
          { name: 'Matte Black', value: '#111827' },
          { name: 'Platinum Silver', value: '#9ca3af' },
          { name: 'Chambray Blue', value: '#3b82f6' }
        ];
      case 'prod-2':
        return [
          { name: 'Alabaster White', value: '#f9fafb' },
          { name: 'Cognac Leather', value: '#b45309' },
          { name: 'Classic Gold', value: '#fbbf24' }
        ];
      case 'prod-3':
        return [
          { name: 'Vintage Chrome', value: '#cbd5e1' },
          { name: 'Stealth Black', value: '#0f172a' }
        ];
      case 'prod-5':
        return [
          { name: 'Tortoise Shell', value: '#78350f' },
          { name: 'Gold Rimmed', value: '#f59e0b' },
          { name: 'Dark Obsidian', value: '#1e293b' }
        ];
      case 'prod-6':
        return [
          { name: 'Desert Sand', value: '#d97706' },
          { name: 'Forest Green', value: '#047857' },
          { name: 'Off-White', value: '#f1f5f9' }
        ];
      default:
        return [
          { name: 'Premium Edition', value: '#2563eb' },
          { name: 'Carbon Fiber', value: '#334155' }
        ];
    }
  }, [product]);

  // Sizes choices
  const sizeOptions = useMemo(() => {
    if (product.id === 'prod-6') return ['US 8', 'US 9', 'US 10', 'US 11']; // sneakers
    if (product.id === 'prod-5') return ['Standard', 'Wide-Fit']; // sunglasses
    return ['Standard Edition', 'Pro Bundle (+ R490)'];
  }, [product]);

  // Real Product Rating & Reviews
  const ratingDetails = useMemo(() => getProductRatingDetails(product), [product]);

  // Real Reviews from Admin / Customer reviews store
  const reviews = useMemo(() => {
    let allReviews: any[] = DEFAULT_STORE_REVIEWS;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('luxestore_admin_reviews');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            allReviews = parsed;
          }
        }
      } catch (e) {
        allReviews = DEFAULT_STORE_REVIEWS;
      }
    }
    return allReviews.filter((r: any) => r.productId === product.id && (r.status === 'approved' || !r.status));
  }, [product.id]);

  const productDescription = product.description && product.description.trim().length > 0 ? product.description.trim() : '';

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-28 sm:pb-32 md:pb-24">
      
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-3.5 pb-2 flex items-center justify-between gap-3">
        {/* Main "Back to Catalog" Action */}
        <a 
          href="/shop"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition px-3 sm:px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer outline-none shrink-0 no-underline"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Catalog</span>
        </a>

        {/* Previous / Next Product Controls */}
        <div className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-0.5 rounded-xl shadow-2xs relative shrink-0">
          
          {/* Previous Product Arrow & Hover Dropdown */}
          {prevProduct ? (
            <div 
              className="relative"
              onMouseEnter={() => setHoveredNav('prev')}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <a
                href={getProductUrl(prevProduct.id, prevProduct.name)}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectProduct(prevProduct.id);
                }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100/90 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer flex items-center gap-1 text-xs font-extrabold group/prev no-underline"
                title={`Previous: ${prevProduct.name}`}
              >
                <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover/prev:text-slate-900 dark:group-hover/prev:text-white group-hover/prev:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Prev</span>
              </a>

              {/* Hover Preview Dropdown */}
              <AnimatePresence>
                {hoveredNav === 'prev' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2.5 z-50 w-64 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl p-3 shadow-xl shadow-slate-950/10 dark:shadow-slate-950/50 pointer-events-none"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3 text-slate-400 dark:text-slate-500" /> Previous Product
                      </span>
                      <span className="text-slate-900 dark:text-white font-extrabold text-xs">
                        {typeof (prevProduct as any).price === 'number' ? `$${(prevProduct as any).price.toFixed(2)}` : String((prevProduct as any).price).startsWith('$') ? (prevProduct as any).price : `$${(prevProduct as any).price}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/80 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <SafeImage
                        src={prevProduct.imageUrl}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200/80 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-800"
                        alt={prevProduct.name}
                        placeholderType="product"
                        fallbackTitle={prevProduct.name}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate leading-snug">{prevProduct.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate capitalize">{prevProduct.category}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              disabled
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-300 dark:text-slate-700 cursor-not-allowed flex items-center gap-1 text-xs font-extrabold"
            >
              <ChevronLeft className="w-4 h-4 text-slate-300 dark:text-slate-700" />
              <span className="hidden sm:inline">Prev</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-200/80 dark:bg-slate-700 my-auto" />

          {/* Next Product Arrow & Hover Dropdown */}
          {nextProduct ? (
            <div 
              className="relative"
              onMouseEnter={() => setHoveredNav('next')}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <a
                href={getProductUrl(nextProduct.id, nextProduct.name)}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectProduct(nextProduct.id);
                }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100/90 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer flex items-center gap-1 text-xs font-extrabold group/next no-underline"
                title={`Next: ${nextProduct.name}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover/next:text-slate-900 dark:group-hover/next:text-white group-hover/next:translate-x-0.5 transition-transform" />
              </a>

              {/* Hover Preview Dropdown */}
              <AnimatePresence>
                {hoveredNav === 'next' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2.5 z-50 w-64 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl p-3 shadow-xl shadow-slate-950/10 dark:shadow-slate-950/50 pointer-events-none"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        Next Product <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      </span>
                      <span className="text-slate-900 dark:text-white font-extrabold text-xs">
                        {typeof (nextProduct as any).price === 'number' ? `$${(nextProduct as any).price.toFixed(2)}` : String((nextProduct as any).price).startsWith('$') ? (nextProduct as any).price : `$${(nextProduct as any).price}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/80 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <SafeImage
                        src={nextProduct.imageUrl}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200/80 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-800"
                        alt={nextProduct.name}
                        placeholderType="product"
                        fallbackTitle={nextProduct.name}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate leading-snug">{nextProduct.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate capitalize">{nextProduct.category}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              disabled
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-300 dark:text-slate-700 cursor-not-allowed flex items-center gap-1 text-xs font-extrabold"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700" />
            </button>
          )}

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-12">
        
        {/* Product Sheet Grid */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-12">
          
          {/* Left Block: Interactive Gallery Grid with Tablet Centering */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-2.5 sm:gap-4 items-center pb-3 sm:pb-5 border-b border-slate-100 dark:border-slate-700 md:border-b-0 md:pb-0 lg:border-r lg:border-slate-100 lg:dark:border-slate-700 lg:pr-8 w-full">
            
            {/* MOBILE PORTRAIT LAYOUT (< sm): Full-width Square Container */}
            <div className="block sm:hidden relative aspect-square w-full rounded-2xl bg-white dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 overflow-hidden group shadow-xs">
              <SafeImage 
                src={mainImage} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                alt={product.name}
                placeholderType="product"
                fallbackTitle={product.name}
                onClick={() => setIsLightboxOpen(true)}
              />
              
              {/* Mobile Top-Left Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
                {(product.isSale || product.originalPrice || product.id === 'prod-2' || product.id === 'prod-5') && (
                  <div className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1 border border-rose-500/50">
                    <Tag className="w-3 h-3 text-white" />
                    <span>{product.saleBadgeText || 'Sale'}</span>
                  </div>
                )}
                {(product.isFeatured || (!product.isSale && product.id !== 'prod-2' && product.id !== 'prod-5')) && (
                  <div className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1 border border-amber-400">
                    <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Mobile Top-Right Actions */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-800 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:scale-105 transition cursor-pointer border border-slate-200/80 dark:border-slate-700"
                  title="Expand Fullscreen"
                >
                  <Maximize2 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-800 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:scale-105 transition cursor-pointer border border-slate-200/80 dark:border-slate-700"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                </button>
                <button
                  onClick={handleOpenWishlistModal}
                  className={`w-8 h-8 rounded-full backdrop-blur-md shadow-md flex items-center justify-center hover:scale-105 transition cursor-pointer border ${
                    isWishlisted 
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' 
                      : 'bg-white/90 dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                  title={isWishlisted ? "Manage wishlist collections" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600 dark:fill-rose-400 dark:text-rose-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* TABLET & MOBILE LANDSCAPE LAYOUT (sm to md): Compact Pillarbox Stage with Centered Square Image */}
            <div className="hidden sm:flex md:hidden relative w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 sm:p-4 items-center justify-between gap-3">
              
              {/* Left Side: Product Badges Column */}
              <div className="flex flex-col gap-2 shrink-0 items-start z-10 self-center">
                {(product.isSale || product.originalPrice || product.id === 'prod-2' || product.id === 'prod-5') && (
                  <div className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] sm:text-[11px] tracking-wider uppercase shadow-2xs flex items-center gap-1 border border-rose-500/50">
                    <Tag className="w-3 h-3 text-white" />
                    <span>{product.saleBadgeText || 'Sale'}</span>
                  </div>
                )}
                {(product.isFeatured || (!product.isSale && product.id !== 'prod-2' && product.id !== 'prod-5')) && (
                  <div className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] sm:text-[11px] tracking-wider uppercase shadow-2xs flex items-center gap-1 border border-amber-400">
                    <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Center: Square Cropped Image Stage matching mobile scale */}
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="relative flex-1 aspect-square max-w-[220px] sm:max-w-[250px] mx-auto rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-slate-700/60 group cursor-pointer"
              >
                <SafeImage 
                  src={mainImage} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={product.name}
                  placeholderType="product"
                  fallbackTitle={product.name}
                />
                
                {/* Hover Expand Overlay Hint */}
                <div className="absolute inset-0 bg-slate-900/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-slate-900 dark:text-white font-extrabold text-xs px-3.5 py-2 rounded-full shadow-md flex items-center gap-1.5">
                    <Maximize2 className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Click to Expand
                  </span>
                </div>
              </div>

              {/* Right Side: Action Buttons Column */}
              <div className="flex flex-col gap-2.5 shrink-0 items-end z-10 self-center">
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 shadow-2xs flex items-center justify-center transition cursor-pointer group/btn"
                  title="Expand Fullscreen Image"
                >
                  <Maximize2 className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/btn:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 shadow-2xs flex items-center justify-center transition cursor-pointer group/btn"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/btn:scale-110 transition-transform" />
                </button>
                <button
                  onClick={handleOpenWishlistModal}
                  className={`w-10 h-10 rounded-2xl border shadow-2xs flex items-center justify-center transition cursor-pointer group/btn ${
                    isWishlisted 
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' 
                      : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  title={isWishlisted ? "Manage wishlist collections" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600 dark:fill-rose-400 dark:text-rose-400' : 'group-hover/btn:scale-110 transition-transform'}`} />
                </button>
              </div>

            </div>

            {/* DESKTOP LAYOUT (>= md): Full-width Square Container */}
            <div className="hidden md:block relative aspect-square w-full rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 overflow-hidden group shadow-xs">
              <SafeImage 
                src={mainImage} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                alt={product.name}
                placeholderType="product"
                fallbackTitle={product.name}
                onClick={() => setIsLightboxOpen(true)}
              />
              
              {/* Desktop Top-Left Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
                {(product.isSale || product.originalPrice || product.id === 'prod-2' || product.id === 'prod-5') && (
                  <div className="px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-md flex items-center gap-1 border border-rose-500/50">
                    <Tag className="w-3 h-3 text-white" />
                    <span>{product.saleBadgeText || 'Sale'}</span>
                  </div>
                )}
                {(product.isFeatured || (!product.isSale && product.id !== 'prod-2' && product.id !== 'prod-5')) && (
                  <div className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[11px] tracking-wider uppercase shadow-md flex items-center gap-1 border border-amber-400">
                    <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Desktop Top-Right Actions */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-800 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:scale-108 transition cursor-pointer border border-slate-200/80 dark:border-slate-700"
                  title="Expand Fullscreen Image"
                >
                  <Maximize2 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-800 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:scale-108 transition cursor-pointer border border-slate-200/80 dark:border-slate-700"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                </button>
                <button
                  onClick={handleOpenWishlistModal}
                  className={`w-9 h-9 rounded-full backdrop-blur-md shadow-md flex items-center justify-center hover:scale-108 transition cursor-pointer border ${
                    isWishlisted 
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' 
                      : 'bg-white/90 dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                  title={isWishlisted ? "Manage wishlist collections" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600 dark:fill-rose-400 dark:text-rose-400' : ''}`} />
                </button>
              </div>

              {/* Desktop Hover Hint */}
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="absolute inset-0 bg-slate-900/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none cursor-pointer"
              >
                <span className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-slate-900 dark:text-white font-extrabold text-xs px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Click to Expand
                </span>
              </div>
            </div>

            {/* Gallery Image Pagination Controls */}
            {images.length > 0 && (
              <div className="flex items-center justify-between w-full pt-2 pb-1 px-1">
                {/* Previous Image Button */}
                <button
                  onClick={() => {
                    const currentIdx = images.indexOf(mainImage);
                    const prevIdx = currentIdx > 0 ? currentIdx - 1 : images.length - 1;
                    setMainImage(images[prevIdx]);
                  }}
                  disabled={images.length <= 1}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                  title="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Pagination Dots & Image Index Counter */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {images.map((img, idx) => {
                      const isActive = mainImage === img || (images.indexOf(mainImage) === -1 && idx === 0);
                      return (
                        <button
                          key={idx}
                          onClick={() => setMainImage(img)}
                          className={`transition-all duration-200 rounded-full cursor-pointer outline-none ${
                            isActive
                              ? 'w-6 h-2 bg-slate-900 dark:bg-white'
                              : 'w-2 h-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                          title={`Go to image ${idx + 1}`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1.5">
                    {Math.max(1, images.indexOf(mainImage) + 1)} / {images.length}
                  </span>
                </div>

                {/* Next Image Button */}
                <button
                  onClick={() => {
                    const currentIdx = images.indexOf(mainImage);
                    const nextIdx = currentIdx < images.length - 1 ? currentIdx + 1 : 0;
                    setMainImage(images[nextIdx]);
                  }}
                  disabled={images.length <= 1}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                  title="Next image"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            )}

          </div>

          {/* Right Block: Actions Panel details */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
            
            {/* Middle Section: Name, Price, Description */}
            <div className="lg:col-span-6 space-y-3.5 sm:space-y-5 pt-0 sm:pt-2 pb-2 flex flex-col justify-start">
              
              {/* Product Title, Ratings, Brand Header */}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-[1.75rem] font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug sm:leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating line */}
                <div className="flex items-center gap-2 mt-2.5" suppressHydrationWarning>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          ratingDetails.hasReviews && star <= Math.round(ratingDetails.rating)
                            ? 'fill-current text-amber-400'
                            : 'text-slate-200 dark:text-slate-700 fill-slate-100 dark:fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-bold ${ratingDetails.hasReviews ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    {ratingDetails.ratingFormatted}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700 text-xs">|</span>
                  <span className={`text-xs font-medium flex items-center gap-1 ${ratingDetails.hasReviews ? 'text-slate-600 dark:text-slate-300 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                    <MessageSquare className="w-3 h-3 text-slate-400 dark:text-slate-500" /> {ratingDetails.reviewCount} {ratingDetails.reviewCount === 1 ? 'verified review' : 'verified reviews'}
                  </span>
                </div>

                {/* Stock info box under reviews info */}
                <div className="mt-3 flex items-center gap-2">
                  <StockBadge product={product} size="lg" />
                </div>
              </div>

              {/* Price Tag with Stock State & Sale Badge */}
              {(() => {
                const sale = getProductSaleDetails(product);
                const wholesaleDisplay = product.wholesalePrice || product.price;
                const retailDisplay = product.retailMarkupPrice || product.retailPrice;

                return (
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(wholesaleDisplay)}</span>
                      <span className="text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                        Wholesale Price
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-400 dark:text-slate-500 line-through font-semibold">{formatCurrency(product.originalPrice)}</span>
                      )}
                      {sale.isSale && (
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          {sale.badgeText}
                        </span>
                      )}
                    </div>

                    {retailDisplay && retailDisplay !== wholesaleDisplay && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>Retail Price: <span className="font-extrabold text-slate-700 dark:text-slate-200">{formatCurrency(retailDisplay)}</span></span>
                        <span>•</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">Min. Purchase: {product.minWholesaleQuantity || 6} pieces for Wholesale</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Description Snippet with Expand/Collapse Toggle */}
              {productDescription ? (
                <div className="space-y-1.5 pt-1">
                  <div className="relative">
                    <p className={`text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-all duration-300 ${!isDescriptionExpanded && productDescription.length > 140 ? 'line-clamp-3' : ''}`}>
                      {productDescription}
                    </p>
                    {!isDescriptionExpanded && productDescription.length > 140 && (
                      <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
                    )}
                  </div>
                  {productDescription.length > 140 && (
                    <button
                      type="button"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition cursor-pointer outline-none pt-0.5 group"
                    >
                      <span>{isDescriptionExpanded ? 'Show Less' : 'Read Full Description'}</span>
                      {isDescriptionExpanded ? (
                        <ChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
                      ) : (
                        <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                      )}
                    </button>
                  )}
                </div>
              ) : null}

              {/* Brand info under short description */}
              {product.brand && (
                <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800">
                  <span>Brand:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{product.brand}</span>
                </div>
              )}

            </div>

            {/* Right Section: Interactive Swatches, Specs & Actions Panel */}
            <div className="lg:col-span-6 space-y-6 py-2 flex flex-col justify-between border-t border-slate-100 dark:border-slate-800 pt-6 lg:border-t-0 lg:pt-0 lg:pl-8 lg:border-l lg:border-slate-100 lg:dark:border-slate-800">
              
              <div className="space-y-6">
                {/* Color Swatch Options */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Select Shade: <span className="text-slate-700 dark:text-slate-200 normal-case font-bold">{selectedColor}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {colorOptions.map((opt) => {
                      const isSelected = selectedColor === opt.name;
                      return (
                        <button
                          key={opt.name}
                          onClick={() => setSelectedColor(opt.name)}
                          className={`w-8 h-8 rounded-full border-2 transition relative flex items-center justify-center cursor-pointer outline-none ${
                            isSelected ? 'border-slate-800 dark:border-white scale-108' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                          style={{ backgroundColor: opt.value }}
                          title={opt.name}
                        >
                          {isSelected && (
                            <Check className={`w-3 h-3 ${opt.value === '#f9fafb' ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sizing/Package Options */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Select Specification:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-2 border rounded-xl text-xs font-bold transition cursor-pointer outline-none ${
                            isSelected
                              ? `${currentTheme.bg} border-transparent text-white shadow-md`
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Multi-Vendor Offers & Storefront Buy Box */}
              <div className="pt-2">
                <VendorOffersBuyBox
                  product={product}
                  sellers={sellerAccounts}
                  selectedOfferId={selectedOffer?.offerId}
                  onSelectOffer={(offer) => {
                    setSelectedOffer(offer);
                  }}
                  onAddToCartWithOffer={(prod, qty, offer) => {
                    addToCart(
                      {
                        ...prod,
                        name: `${prod.name} (${selectedColor} / ${selectedSize})`,
                        price: offer.price
                      },
                      qty,
                      offer
                    );
                  }}
                />
              </div>

              {/* Quantity, Buy CTAs, and Safety guarantees */}
              <div ref={mainCtaSectionRef} className="space-y-3.5 pt-5 border-t border-slate-100 dark:border-slate-800">
                
                {/* Line 1: Quantity with Label */}
                <div className="flex items-center justify-between py-1 bg-slate-50/60 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 rounded-xl px-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">Quantity</span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 p-1 shrink-0 shadow-2xs">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 px-3 min-w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Line 2: Add to Cart Button */}
                <button
                  onClick={() => {
                    addToCart(
                      {
                        ...product,
                        name: `${product.name} (${selectedColor} / ${selectedSize})`,
                        price: selectedOffer ? selectedOffer.price : product.price
                      },
                      quantity,
                      selectedOffer || undefined
                    );
                  }}
                  className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white cursor-pointer shadow-md active:scale-98 transition flex items-center justify-center gap-2 ${currentTheme.bg} ${currentTheme.shadow}`}
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>

                {/* Line 3: Buy Now Button */}
                <button
                  onClick={() => {
                    addToCart(
                      {
                        ...product,
                        name: `${product.name} (${selectedColor} / ${selectedSize})`,
                        price: selectedOffer ? selectedOffer.price : product.price
                      },
                      quantity,
                      selectedOffer || undefined
                    );
                    if (onBuyNow) {
                      onBuyNow();
                    }
                  }}
                  className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-md active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Buy Now
                </button>

                {/* Line 4: Wishlist Button */}
                <button
                  onClick={handleOpenWishlistModal}
                  className={`w-full py-3 rounded-xl border text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer outline-none flex items-center justify-center gap-2 ${
                    isWishlisted 
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-2xs hover:bg-rose-100/70 dark:hover:bg-rose-900/60' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {isWishlisted ? 'Saved in Wishlists' : 'Save to Wishlist'}
                </button>

                {/* Micro benefits badges */}
                <div className="grid grid-cols-3 gap-2.5 pt-4 text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider text-center">
                  <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-700/50 rounded-xl">
                    <Truck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-700/50 rounded-xl">
                    <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-700/50 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Secure Checkout</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Informational Tabs Block (Full Description) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm mt-8">
          
          <div className="flex border-b border-slate-100 dark:border-slate-700 text-xs font-bold gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 transition border-b-2 cursor-pointer outline-none ${
                activeTab === 'details' ? 'border-blue-600 text-slate-900 dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Full Description
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 transition border-b-2 cursor-pointer outline-none ${
                activeTab === 'shipping' ? 'border-blue-600 text-slate-900 dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="py-6 min-h-28">
            {activeTab === 'details' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description && product.description.trim().length > 0 ? (
                  <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {product.description}
                  </div>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 italic">No description has been added for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                <p>
                  We provide premium express shipping on all wholesale orders. All collections are packaged in drop-tested, reinforced container panels to prevent shipping stress.
                </p>
                <p>
                  Standard fulfillment cycles complete in 1-2 business days, and estimated carrier transit intervals span 3-5 calendar days with live door-to-door tracking links provided instantly via email.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Dedicated Product Information Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className={`w-5 h-5 ${currentTheme?.text || 'text-blue-600 dark:text-blue-400'}`} /> Product Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs">
            {/* Barcode Block */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Barcode className="w-3 h-3 text-blue-500 dark:text-blue-400" /> Barcode (EAN / UPC)
                </span>
                <span className="font-mono font-extrabold text-slate-800 dark:text-slate-100 text-sm tracking-widest">
                  {product.barcode || product.sku || (product.id ? `EAN-${product.id.replace(/[^0-9]/g, '') || '8801'}` : 'N/A')}
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-0.5 opacity-80 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <div className="w-1 h-7 bg-slate-900 dark:bg-slate-200 rounded-xs"></div>
                <div className="w-0.5 h-7 bg-slate-900 dark:bg-slate-200"></div>
                <div className="w-1 h-7 bg-slate-900 dark:bg-slate-200 rounded-xs"></div>
                <div className="w-0.5 h-7 bg-slate-900 dark:bg-slate-200"></div>
                <div className="w-2 h-7 bg-slate-900 dark:bg-slate-200 rounded-xs"></div>
                <div className="w-0.5 h-7 bg-slate-900 dark:bg-slate-200"></div>
                <div className="w-1 h-7 bg-slate-900 dark:bg-slate-200 rounded-xs"></div>
                <div className="w-1 h-7 bg-slate-900 dark:bg-slate-200 rounded-xs"></div>
              </div>
            </div>

            {/* Brand / Manufacturer */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70 rounded-2xl space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-blue-500 dark:text-blue-400" /> Brand / Manufacturer
              </span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wide">{product.brand || 'No brand'}</span>
            </div>

            {/* SKU / Item Code */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70 rounded-2xl space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">SKU / Item Code</span>
              <span className="font-mono font-extrabold text-slate-800 dark:text-slate-100 text-xs uppercase">{product.sku || product.id || 'N/A'}</span>
            </div>

            {/* Stock Inventory */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70 rounded-2xl space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Stock Inventory</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{product.stock !== undefined ? `${product.stock} units available` : 'In Stock'}</span>
            </div>

            {/* Category */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70 rounded-2xl space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Category</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wide">{categoryName || 'No Category'}</span>
            </div>

            {/* Wholesale Price */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70 rounded-2xl space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Wholesale Price</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{formatCurrency(product.wholesalePrice || product.price)}</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> Customer Reviews
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Check the feedback of customers that have bought this product
              </p>
            </div>
          </div>

          <ProductReviews productId={product.id} productTitle={product.name} themeColor={themeColor} />
        </div>

        {/* Related Products Carousel Showcase */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">Recommended Collections</h2>
            <a 
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition no-underline"
            >
              See all storefront catalog <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {relatedProducts.map((prod) => {
              return (
                <a 
                  key={prod.id}
                  href={getProductUrl(prod.id, prod.name)}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectProduct(prod.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col justify-between block no-underline"
                >
                  <div className="relative aspect-square bg-white dark:bg-slate-700/60 overflow-hidden">
                    <SafeImage src={prod.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out" alt={prod.name} placeholderType="product" fallbackTitle={prod.name} />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {prod.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-slate-50 dark:border-slate-700">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">{prod.price}</span>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">View &rarr;</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Product Categories Horizontal Carousel Card */}
        {productCategories.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 rounded-xl">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Product Categories</h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Browse related departments & store collections</p>
                </div>
              </div>
              
              {/* Carousel scroll chevron controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (categoriesScrollRef.current) {
                      categoriesScrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
                    }
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer active:scale-95"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (categoriesScrollRef.current) {
                      categoriesScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
                    }
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer active:scale-95"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Carousel Categories track */}
            <div 
              ref={categoriesScrollRef}
              className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 scroll-smooth"
            >
              {productCategories.map((cat, idx) => (
                <a
                  key={idx}
                  href={getCategoryUrl(cat.name)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSearch) {
                      onSearch(cat.name);
                    }
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50/80 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-200 dark:hover:border-blue-800 border border-slate-200/80 dark:border-slate-700 px-4 py-2.5 rounded-2xl transition-all duration-200 shrink-0 cursor-pointer shadow-2xs hover:scale-102 no-underline"
                >
                  <Folder className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Product Tags Horizontal Carousel Card */}
        {productTags.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 rounded-xl">
                  <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Product Tags</h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Explore related keywords</p>
                </div>
              </div>
              
              {/* Carousel scroll chevron controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (tagsScrollRef.current) {
                      tagsScrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
                    }
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer active:scale-95"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (tagsScrollRef.current) {
                      tagsScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
                    }
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer active:scale-95"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Carousel Tags track */}
            <div 
              ref={tagsScrollRef}
              className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 scroll-smooth"
            >
              {productTags.map((tag, idx) => (
                <a
                  key={idx}
                  href={getShopUrl({ search: tag })}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSearch) {
                      onSearch(tag);
                    }
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50/80 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-200 dark:hover:border-blue-800 border border-slate-200/80 dark:border-slate-700 px-4 py-2.5 rounded-2xl transition-all duration-200 shrink-0 cursor-pointer shadow-2xs hover:scale-102 no-underline"
                >
                  <span className="text-blue-500 font-black">#</span>
                  {tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* RECENTLY VIEWED PRODUCTS STRIP */}
        <RecentlyViewedSection
          products={products}
          currentProductId={product.id}
          onSelectProduct={onSelectProduct}
          title="Recently Viewed Items"
          maxItems={10}
        />

      </div>

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Card Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-3xl bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col space-y-4 max-h-[92vh] overflow-y-auto scrollbar-none"
            >
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      Product Gallery
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Image {images.indexOf(mainImage) + 1} of {images.length}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Image Stage */}
              <div className="relative w-full rounded-2xl bg-slate-50/80 dark:bg-slate-700/60 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-4 sm:p-6 min-h-[280px] sm:min-h-[380px] max-h-[48vh] overflow-hidden">
                {images.length > 1 && (
                  <button
                    onClick={() => {
                      const currentIdx = images.indexOf(mainImage);
                      const prevIdx = (currentIdx - 1 + images.length) % images.length;
                      setMainImage(images[prevIdx]);
                    }}
                    className="absolute left-3 z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-md border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition cursor-pointer hover:scale-108"
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-800 dark:text-slate-100" />
                  </button>
                )}

                <SafeImage
                  src={mainImage}
                  className="max-h-[42vh] max-w-full w-auto object-contain rounded-xl shadow-xs"
                  alt={product.name}
                  placeholderType="product"
                  fallbackTitle={product.name}
                />

                {images.length > 1 && (
                  <button
                    onClick={() => {
                      const currentIdx = images.indexOf(mainImage);
                      const nextIdx = (currentIdx + 1) % images.length;
                      setMainImage(images[nextIdx]);
                    }}
                    className="absolute right-3 z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-md border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition cursor-pointer hover:scale-108"
                    title="Next Image"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-800 dark:text-slate-100" />
                  </button>
                )}
              </div>

              {/* Product Info Section (Placed directly under the Product Image) */}
              <div className="text-center space-y-1.5 pt-1">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 flex-wrap">
                  <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm sm:text-base">{product.price}</span>
                  {product.category && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] uppercase tracking-wider">
                      {product.category}
                    </span>
                  )}
                  {product.sku && (
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">SKU: {product.sku}</span>
                  )}
                </div>
              </div>

              {/* Bottom Gallery Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex items-center justify-center gap-2.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
                  {images.map((img, idx) => {
                    const isSelected = mainImage === img;
                    return (
                      <button
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                          isSelected
                            ? 'border-rose-500 ring-2 ring-rose-500/20 scale-105 shadow-2xs'
                            : 'border-slate-200/80 dark:border-slate-700 opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <SafeImage src={img} className="w-full h-full object-cover" alt="" placeholderType="product" fallbackTitle={product.name} />
                      </button>
                    );
                  })}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Social Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 dark:border-slate-700 space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100/80 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Share Product</h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Spread the word or save for later</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Card Preview */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-700 shrink-0 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                  <SafeImage src={mainImage} className="w-full h-full object-cover" alt="" placeholderType="product" fallbackTitle={product.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{product.name}</h4>
                  <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">{product.price}</p>
                </div>
              </div>

              {/* Social Media Buttons Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name}: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 border border-emerald-200/70 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <span className="text-xs font-extrabold">WhatsApp</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name}`)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-extrabold">Twitter / X</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 border border-blue-200/70 dark:border-blue-800 text-blue-900 dark:text-blue-200 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-extrabold">Facebook</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Check out ${product.name}`)}&body=${encodeURIComponent(`Check out this product: ${product.name}\n\n${window.location.href}`)}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 border border-blue-200/70 dark:border-blue-800 text-blue-950 dark:text-blue-200 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-extrabold">Email</span>
                </a>
              </div>

              {/* Copy Link Section */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Copy Product Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/90 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 truncate flex items-center gap-2">
                    <Link2 className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{window.location.href}</span>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isCopied 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white shadow-xs'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wishlist Selection Modal Popup */}
      <AnimatePresence>
        {isWishlistModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 dark:border-slate-700 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100/80 dark:border-rose-800 text-rose-600 dark:text-rose-400">
                    <Heart className="w-5 h-5 fill-rose-500/30 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Save to Wishlist</h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Choose a list or create a new collection</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWishlistModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Card Preview */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-700 shrink-0 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                  <SafeImage src={mainImage} className="w-full h-full object-cover" alt="" placeholderType="product" fallbackTitle={product.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{product.name}</h4>
                  <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">{formatCurrency(product.price)}</p>
                </div>
              </div>

              {/* Custom Wishlists Selection List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-none">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Your Collections</p>
                {availableWishlists.map((list) => {
                  const isChecked = selectedListIdsForProduct.includes(list.id);
                  return (
                    <div
                      key={list.id}
                      onClick={() => handleToggleListSelection(list.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer select-none ${
                        isChecked
                          ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200/90 dark:border-rose-800 text-slate-900 dark:text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-700/60 border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-xl border ${isChecked ? 'bg-rose-500 text-white border-rose-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                          <Heart className={`w-4 h-4 ${isChecked ? 'fill-white text-white' : ''}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                            <span>{list.name}</span>
                            {list.isDefault && (
                              <span className="px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-extrabold text-[9px] uppercase tracking-wider">Default</span>
                            )}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{list.productIds.length} {list.productIds.length === 1 ? 'item' : 'items'}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inline Create New List Option */}
              {isCreatingListInModal ? (
                <form onSubmit={handleCreateNewListInModal} className="p-3 bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2.5">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Create New Wishlist</p>
                  <input
                    type="text"
                    value={newListNameInModal}
                    onChange={(e) => setNewListNameInModal(e.target.value)}
                    placeholder="Collection Name (e.g., Summer Looks)"
                    autoFocus
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingListInModal(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newListNameInModal.trim()}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-xs transition cursor-pointer"
                    >
                      Create & Select
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreatingListInModal(true)}
                  className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-750 hover:bg-slate-100/80 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Create New Wishlist</span>
                </button>
              )}

              {/* Save / Done CTA */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWishlistModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveWishlistModalChanges}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md active:scale-98 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Done</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Quantity & Add to Cart Bar for Mobile Screens (Always visible at bottom) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-700 px-3.5 py-2.5 shadow-[0_-6px_25px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          {/* Stepper */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-700/60 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white rounded-lg transition hover:bg-white dark:hover:bg-slate-700 cursor-pointer active:scale-95"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 px-2.5 min-w-7 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white rounded-lg transition hover:bg-white dark:hover:bg-slate-700 cursor-pointer active:scale-95"
              title="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={() => {
              for (let i = 0; i < quantity; i++) {
                handleAddToCart({
                  id: product.id,
                  name: `${product.name} (${selectedColor} / ${selectedSize})`,
                  price: product.price,
                  imageUrl: product.imageUrl
                });
              }
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white cursor-pointer shadow-md active:scale-98 transition flex items-center justify-center gap-1.5 ${currentTheme.bg} ${currentTheme.shadow}`}
          >
            <ShoppingCart className="w-3 h-3 shrink-0" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Sticky Quantity & Add to Cart Bar for Desktop Screens (Appears when scrolled past main CTA) */}
      <AnimatePresence>
        {showDesktopSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="hidden md:block fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] py-3 px-6 lg:px-8"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
              {/* Left: Product Thumbnail, Title, Options, Price */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs">
                  <SafeImage src={mainImage} className="w-full h-full object-cover" alt={product.name} placeholderType="product" fallbackTitle={product.name} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{product.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{formatCurrency(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through font-semibold">{formatCurrency(product.originalPrice)}</span>
                    )}
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-600 dark:text-slate-300 truncate">{selectedColor} / {selectedSize}</span>
                  </div>
                </div>
              </div>

              {/* Right: Quantity Stepper + Add to Cart + Buy Now */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-700/60 p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white rounded-lg transition hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 px-3 min-w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white rounded-lg transition hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                    title="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      handleAddToCart({
                        id: product.id,
                        name: `${product.name} (${selectedColor} / ${selectedSize})`,
                        price: product.price,
                        imageUrl: product.imageUrl
                      });
                    }
                  }}
                  className={`py-2.5 px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white cursor-pointer shadow-md active:scale-98 transition flex items-center gap-2 ${currentTheme.bg} ${currentTheme.shadow}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {onBuyNow && (
                  <button
                    type="button"
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) {
                        handleAddToCart({
                          id: product.id,
                          name: `${product.name} (${selectedColor} / ${selectedSize})`,
                          price: product.price,
                          imageUrl: product.imageUrl
                        });
                      }
                      onBuyNow();
                    }}
                    className="py-2.5 px-5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-md active:scale-98 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Buy Now</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
