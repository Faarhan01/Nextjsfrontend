'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  User, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  Code, 
  Download, 
  Check, 
  Clipboard, 
  Settings, 
  Plus, 
  Minus, 
  RefreshCw, 
  Eye, 
  Clock,
  RotateCcw,
  LayoutGrid,
  Trash2,
  Sliders,
  Play,
  Pause,
  ExternalLink,
  ChevronDown,
  Flame,
  Star,
  Crown,
  Tag,
  ArrowRight,
  Package,
  Building2,
  Mail,
  HelpCircle,
  Truck,
  ShieldCheck,
  Send,
  Folder,
  FileCode,
  Archive,
  Zap
} from 'lucide-react';
import JSZip from 'jszip';
import { generateNextjsProject } from './utils/nextjsCodeGenerator';
import { generateFrontendExportFiles } from './utils/frontendExportGenerator';
import { SlideConfig, MockCategory, MockBrand, MockWooProduct, UserProfile, CartItem, CustomWishlist, ProductsSettings } from './types';
import { MOCK_CATEGORIES, MOCK_BRANDS, MOCK_WOO_PRODUCTS, MockCategoryPreset, MockBrandPreset } from './data/presets';
import { generateEcommerceTemplate } from './utils/templateGenerator';
import { getProductPrices, getCartItemUnitPrice, parsePriceNumber, formatCurrency } from './utils/pricing';
import { initGTM, trackViewItem, trackAddToCart, trackBeginCheckout } from './utils/gtm';
import { getProductRatingDetails } from './utils/productRating';
import { 
  slugify, 
  deslugify, 
  getProductUrl, 
  getCategoryUrl, 
  getBrandUrl, 
  getShopUrl, 
  getSearchUrl, 
  getPageUrl, 
  updateSEOMetadata, 
  parseLocation,
  formatCategoryName,
  decodeAndCleanText
} from './utils/seoUtils';
import MyAccountPage from './components/account/MyAccountPage';
import SafeImage from './components/ui/SafeImage';
import StockBadge from './components/ui/StockBadge';
import CategoriesPage from './components/products/CategoriesPage';
import ShopPage from './components/products/ShopPage';
import ProductDetailPage from './components/products/ProductDetailPage';
import CategoryDetailPage from './components/products/CategoryDetailPage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import CategoryProductCarousel from './components/products/CategoryProductCarousel';
import { TechElectronicsShowcase } from './components/products/TechElectronicsShowcase';
import ReturnsPolicyPage from './components/pages/ReturnsPolicyPage';
import TermsAndConditionsPage from './components/pages/TermsAndConditionsPage';
import MarketplaceSellerPolicyPage from './components/pages/MarketplaceSellerPolicyPage';
import FaqPage from './components/pages/FaqPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import NotFoundPage from './components/pages/NotFoundPage';
import AuthModal from './components/auth/AuthModal';
import AdminPage from './components/admin/AdminPage';
import OrderTrackingPage from './components/account/OrderTrackingPage';
import WishlistPage from './components/products/WishlistPage';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/cart/CheckoutPage';
import SearchResultsPage from './components/products/SearchResultsPage';
import NextjsExporterModal from './components/admin/NextjsExporterModal';
import SEOInspectorModal from './components/admin/SEOInspectorModal';
import QuickViewModal from './components/products/QuickViewModal';
import AiConciergeModal from './components/ai/AiConciergeModal';
import { FooterTrustCarousel } from './components/layout/FooterTrustCarousel';
import { CategoryBarCarousel } from './components/home/CategoryBarCarousel';
import { PromoBannersGrid } from './components/layout/PromoBannersGrid';
import { FlashDealsSection } from './components/products/FlashDealsSection';
import { BestsellersTabSection } from './components/products/BestsellersTabSection';
import { TestimonialsSection } from './components/layout/TestimonialsSection';
import { NewsletterSection } from './components/layout/NewsletterSection';
import { HeroBanner } from './components/home/HeroBanner';
import { ToastContainer, ToastMessage } from './components/ui/Toast';
import { LogIn, LogOut, Server, Boxes } from 'lucide-react';

// Dynamic default state slides
const DEFAULT_SLIDES: SlideConfig[] = [
  {
    id: 1,
    title: "Elevate Your Lifestyle with Modern Luxury",
    subtitle: "Discover curated designer furniture, audiophile sound systems, and premium lifestyle essentials crafted for modern living.",
    buttonText: "Explore Collection",
    buttonUrl: "shop",
    targetPage: "shop",
    backgroundType: "image",
    backgroundImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
    backgroundColor: "#1e1b4b",
    backgroundGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
    titleAnimation: "fadeInUp",
    subtitleAnimation: "fadeInUp",
    buttonStyle: "pill",
    buttonColor: "#2563eb",
    buttonTextColor: "#ffffff"
  },
  {
    id: 2,
    title: "Next-Gen Audio & Smart Electronics",
    subtitle: "Experience studio-grade active noise cancellation, lossless acoustics, and intuitive smart home gear.",
    buttonText: "Browse Tech & Audio",
    buttonUrl: "categories",
    targetPage: "categories",
    backgroundType: "image",
    backgroundImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
    backgroundColor: "#051937",
    backgroundGradient: "linear-gradient(135deg, #051937 0%, #004d7a 40%, #008793 70%, #00bf72 100%)",
    titleAnimation: "slideInLeft",
    subtitleAnimation: "zoomIn",
    buttonStyle: "pill",
    buttonColor: "#10b981",
    buttonTextColor: "#ffffff"
  },
  {
    id: 3,
    title: "Shop Our Physical Flagship Store",
    subtitle: "Visit our showroom, get in touch with our dedicated team, or receive personalized interior consultations.",
    buttonText: "Contact & Store Location",
    buttonUrl: "contact",
    targetPage: "contact",
    backgroundType: "image",
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    backgroundColor: "#065f46",
    backgroundGradient: "linear-gradient(135deg, #022c22 0%, #065f46 50%, #115e59 100%)",
    titleAnimation: "zoomIn",
    subtitleAnimation: "fadeIn",
    buttonStyle: "outline",
    buttonColor: "#ffffff",
    buttonTextColor: "#ffffff"
  }
];

export default function App() {
  const isLoadedRef = useRef<boolean>(false);

  // Storefront Branding and Customizer Settings State
  const [logoText, setLogoText] = useState<string>("Mrbulk");
  const [themeColor, setThemeColor] = useState<'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate'>('blue');
  const [aiConciergeOpen, setAiConciergeOpen] = useState<boolean>(false);
  const [autoplay, setAutoplay] = useState<boolean>(true);
  const [autoplaySpeed, setAutoplaySpeed] = useState<number>(5000);
  const [slides, setSlides] = useState<SlideConfig[]>(DEFAULT_SLIDES);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_logo_text', logoText);
    } catch (e) {}
  }, [logoText]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_slides', JSON.stringify(slides));
    } catch (e) {}
  }, [slides]);

  // Free Shipping Threshold State
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(1000);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_free_shipping_threshold', freeShippingThreshold.toString());
    } catch (e) {
      console.error('Failed to save free shipping threshold:', e);
    }
  }, [freeShippingThreshold]);

  // Products Settings State
  const [productsSettings, setProductsSettings] = useState<ProductsSettings>({
    globalRetailMarkup: 50,
    globalWholesalePrice: 20,
    minWholesaleQuantity: 6
  });

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_products_settings', JSON.stringify(productsSettings));
    } catch (e) {
      console.error('Failed to save products settings:', e);
    }
  }, [productsSettings]);

  // Dynamic Product, Category & Brand Catalog State
  const [products, setProducts] = useState<MockWooProduct[]>(MOCK_WOO_PRODUCTS);
  const [categories, setCategories] = useState<MockCategoryPreset[]>(MOCK_CATEGORIES);
  const [brands, setBrands] = useState<MockBrandPreset[]>(MOCK_BRANDS);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_admin_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage:', e);
      try {
        const fallbackProducts = products.map(p => ({
          ...p,
          imageUrl: p.imageUrl && p.imageUrl.startsWith('data:') && p.imageUrl.length > 50000 
            ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' 
            : p.imageUrl,
          images: p.images ? p.images.map(img => img && img.startsWith('data:') && img.length > 50000 
            ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' 
            : img) : []
        }));
        localStorage.setItem('mrbulk_admin_products', JSON.stringify(fallbackProducts));
      } catch (err) {
        console.error('Critical failure saving products to localStorage', err);
      }
    }
  }, [products]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_admin_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  }, [categories]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_admin_brands', JSON.stringify(brands));
    } catch (e) {
      console.error('Failed to save brands:', e);
    }
  }, [brands]);
  
  // Custom Page State Routing
  const [currentPage, setCurrentPage] = useState<'home' | 'categories' | 'shop' | 'account' | 'product-detail' | 'category-detail' | 'search-results' | 'privacy-policy' | 'returns-policy' | 'terms-and-conditions' | 'seller-policy' | 'faq' | 'about' | 'contact' | 'admin' | 'order-tracking' | 'wishlist' | 'cart' | 'checkout' | 'not-found'>('home');
  const [selectedShopCategory, setSelectedShopCategory] = useState<string>('All');
  const [selectedShopBrand, setSelectedShopBrand] = useState<string>('All');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const prevPageKeyRef = useRef<string>('home');

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_current_page', currentPage);
      if (selectedProductId) localStorage.setItem('mrbulk_selected_product_id', selectedProductId);
      else localStorage.removeItem('mrbulk_selected_product_id');
      if (selectedCategoryName) localStorage.setItem('mrbulk_selected_category_name', selectedCategoryName);
      else localStorage.removeItem('mrbulk_selected_category_name');
    } catch (e) {}
  }, [currentPage, selectedProductId, selectedCategoryName]);

  // Next.js Exporter & SEO Inspector Modal States
  const [nextjsModalOpen, setNextjsModalOpen] = useState<boolean>(false);
  const [seoModalOpen, setSeoModalOpen] = useState<boolean>(false);

  // Authentication State
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      if (currentUser) {
        localStorage.setItem('mrbulk_user', JSON.stringify(currentUser));
      } else {
        localStorage.setItem('mrbulk_user', 'null');
      }
    } catch (e) {
      console.error('Failed to save user to localStorage:', e);
    }
  }, [currentUser]);

  const handleSignIn = (user: UserProfile) => {
    // Merge guest cart items into the signing-in user's cart
    try {
      const guestCartRaw = localStorage.getItem('mrbulk_cart_guest') || localStorage.getItem('luxestore_cart_guest');
      const guestCart: CartItem[] = guestCartRaw ? JSON.parse(guestCartRaw) : [];
      const currentMemoryCart = !currentUser ? cart : [];
      const combinedGuest = [...guestCart];
      currentMemoryCart.forEach(item => {
        if (!combinedGuest.some(c => c.id === item.id)) {
          combinedGuest.push(item);
        }
      });

      if (combinedGuest.length > 0) {
        const userSavedCart = loadUserCart(user);
        const mergedMap = new Map<string, CartItem>();
        userSavedCart.forEach(item => mergedMap.set(item.id, { ...item }));
        
        combinedGuest.forEach(item => {
          if (mergedMap.has(item.id)) {
            const existing = mergedMap.get(item.id)!;
            existing.quantity += item.quantity;
          } else {
            mergedMap.set(item.id, { ...item });
          }
        });

        const mergedCart = Array.from(mergedMap.values());
        localStorage.setItem(`mrbulk_cart_${user.id}`, JSON.stringify(mergedCart));
        localStorage.removeItem('mrbulk_cart_guest');
        localStorage.removeItem('luxestore_cart_guest');
        setCart(mergedCart);
      } else {
        setCart(loadUserCart(user));
      }
    } catch (e) {
      console.error('Failed to merge guest cart on sign in:', e);
      setCart(loadUserCart(user));
    }

    setCurrentUser(user);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    showToast("Signed out successfully.");
    if (currentPage === 'admin') {
      setCurrentPage('home');
    }
  };

  // Scroll to top and clear search input when navigating to non-search pages
  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentPage !== 'search-results') {
      setSearchQuery('');
    }
  }, [currentPage]);

  const handleNavigatePage = (page: typeof currentPage) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePerformSearch = (queryToUse?: string) => {
    if (queryToUse !== undefined) {
      setSearchQuery(queryToUse);
    }
    setShowSearchResults(false);
    setMobileMenuOpen(false);
    handleNavigatePage('search-results');
  };
  
  // Carousel Slide Index State
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // User-isolated Cart & Wishlist Helper Functions
  const loadUserCart = (user: UserProfile | null): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const key = user ? `mrbulk_cart_${user.id}` : 'mrbulk_cart_guest';
    const fallbackKey = user ? `luxestore_cart_${user.id}` : 'luxestore_cart_guest';
    try {
      const saved = localStorage.getItem(key) || localStorage.getItem(fallbackKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load cart:', e);
    }
    return [];
  };

  const loadUserCustomWishlists = (user: UserProfile | null): CustomWishlist[] => {
    if (typeof window === 'undefined') return [];
    if (!user) return [];
    try {
      const saved = localStorage.getItem(`mrbulk_custom_wishlists_${user.id}`) || localStorage.getItem(`luxestore_custom_wishlists_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load user custom wishlists:', e);
    }

    // Migration or fallback check for legacy simple wishlist array
    let legacyProdIds: string[] = [];
    try {
      const legacySaved = localStorage.getItem(`mrbulk_wishlist_${user.id}`) || localStorage.getItem(`luxestore_wishlist_${user.id}`);
      if (legacySaved) {
        const parsed = JSON.parse(legacySaved);
        if (Array.isArray(parsed)) legacyProdIds = parsed;
      }
    } catch (e) {}

    let initialProdIds = legacyProdIds.length > 0 ? legacyProdIds : ['prod-1', 'prod-4'];
    if (user.id === 'usr-vip-02' && legacyProdIds.length === 0) initialProdIds = ['prod-2', 'prod-5'];
    if (user.id === 'usr-cust-03' && legacyProdIds.length === 0) initialProdIds = ['prod-3'];

    return [
      {
        id: 'list-favourites',
        name: 'Favourites',
        description: 'Your primary saved items',
        icon: 'heart',
        productIds: initialProdIds,
        createdAt: new Date().toISOString(),
        isDefault: true
      },
      {
        id: 'list-gift-ideas',
        name: 'Gift Ideas',
        description: 'Presents for upcoming celebrations & holidays',
        icon: 'gift',
        productIds: ['prod-2'],
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
  };

  // Cart & Wishlist Interactive States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customWishlists, setCustomWishlists] = useState<CustomWishlist[]>([]);

  // Derived flat array of unique product IDs across all custom lists
  const wishlist: string[] = Array.from(new Set(customWishlists.flatMap(l => l.productIds)));

  // Quick View Modal state
  const [quickViewProduct, setQuickViewProduct] = useState<MockWooProduct | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState<boolean>(false);

  // Recently Viewed Products state
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Initial client-side mount effect: load saved localStorage state into React state AFTER hydration
  useEffect(() => {
    if (isLoadedRef.current) return;
    try {
      const savedLogo = localStorage.getItem('luxestore_logo_text');
      if (savedLogo) setLogoText(savedLogo);

      const savedSlides = localStorage.getItem('luxestore_slides');
      if (savedSlides) {
        const parsed = JSON.parse(savedSlides);
        if (Array.isArray(parsed)) {
          const isLegacy = parsed.some((s: any) => 
            s.buttonUrl === '#products' || 
            s.title?.includes('Next-Gen') || 
            s.buttonText?.includes('Shop the Collection') ||
            s.buttonText?.includes('Order Setup Desk')
          );
          if (!isLegacy) setSlides(parsed);
        }
      }

      const savedFreeShipping = localStorage.getItem('luxestore_free_shipping_threshold');
      if (savedFreeShipping) setFreeShippingThreshold(Number(savedFreeShipping));

      const savedProdSettings = localStorage.getItem('luxestore_products_settings');
      if (savedProdSettings) {
        const parsed = JSON.parse(savedProdSettings);
        if (parsed && typeof parsed === 'object') setProductsSettings(parsed);
      }

      const savedProducts = localStorage.getItem('luxestore_admin_products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }

      const savedCategories = localStorage.getItem('luxestore_admin_categories');
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
      }

      const savedBrands = localStorage.getItem('luxestore_admin_brands');
      if (savedBrands) {
        const parsed = JSON.parse(savedBrands);
        if (Array.isArray(parsed) && parsed.length > 0) setBrands(parsed);
      }

      const savedPage = localStorage.getItem('luxestore_current_page');
      if (savedPage) setCurrentPage(savedPage as any);

      const savedProdId = localStorage.getItem('luxestore_selected_product_id');
      if (savedProdId) setSelectedProductId(savedProdId);

      const savedCatName = localStorage.getItem('luxestore_selected_category_name');
      if (savedCatName) setSelectedCategoryName(savedCatName);

      const savedUserRaw = localStorage.getItem('luxestore_user');
      let user: UserProfile | null = null;
      if (savedUserRaw && savedUserRaw !== 'null' && savedUserRaw !== 'none') {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed && typeof parsed === 'object') {
          user = parsed;
          setCurrentUser(user);
        }
      }

      const userCart = loadUserCart(user);
      setCart(userCart);

      const userWishlists = loadUserCustomWishlists(user);
      setCustomWishlists(userWishlists);

      const savedRecent = localStorage.getItem('luxestore_recently_viewed');
      if (savedRecent) {
        const parsed = JSON.parse(savedRecent);
        if (Array.isArray(parsed)) setRecentlyViewedIds(parsed);
      }

      // Initialize Google Tag Manager if ID is configured
      initGTM();
    } catch (e) {
      console.error('Failed to load initial state from localStorage:', e);
    } finally {
      isLoadedRef.current = true;
    }
  }, []);

  // Save recently viewed products to localStorage
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('luxestore_recently_viewed', JSON.stringify(recentlyViewedIds));
    } catch (e) {
      console.error('Failed to save recently viewed items:', e);
    }
  }, [recentlyViewedIds]);

  // Track product views when selectedProductId or product detail page changes
  useEffect(() => {
    if (selectedProductId) {
      setRecentlyViewedIds((prev) => {
        const filtered = prev.filter((id) => id !== selectedProductId);
        return [selectedProductId, ...filtered].slice(0, 10);
      });

      // GA4 DataLayer Event: view_item on Product Detail Page (PDP)
      if (currentPage === 'product-detail') {
        const prod = products.find((p) => p.id === selectedProductId);
        if (prod) {
          const { retailPrice } = getProductPrices(prod, productsSettings);
          trackViewItem({
            id: prod.id,
            name: prod.name,
            price: retailPrice,
            category: prod.category,
            brand: (prod as any).brand
          }, 'ZAR');
        }
      }
    }
  }, [selectedProductId, currentPage, products, productsSettings]);

  // Track product views when quick view modal is opened
  useEffect(() => {
    if (quickViewProduct?.id) {
      const qId = quickViewProduct.id;
      setRecentlyViewedIds((prev) => {
        const filtered = prev.filter((id) => id !== qId);
        return [qId, ...filtered].slice(0, 10);
      });
    }
  }, [quickViewProduct]);

  const handleOpenQuickView = (prod: MockWooProduct) => {
    setQuickViewProduct(prod);
    setQuickViewOpen(true);
    const { retailPrice } = getProductPrices(prod, productsSettings);
    trackViewItem({
      id: prod.id,
      name: prod.name,
      price: retailPrice,
      category: prod.category,
      brand: (prod as any).brand
    }, 'ZAR');
  };

  // Sync cart & wishlist whenever currentUser changes
  useEffect(() => {
    if (!isLoadedRef.current) return;
    setCart(loadUserCart(currentUser));
    setCustomWishlists(loadUserCustomWishlists(currentUser));
  }, [currentUser?.id]);

  // Persist cart changes for current user or guest
  useEffect(() => {
    if (!isLoadedRef.current) return;
    const key = currentUser ? `luxestore_cart_${currentUser.id}` : 'luxestore_cart_guest';
    try {
      localStorage.setItem(key, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart, currentUser?.id]);

  // Persist custom wishlists changes for current user
  useEffect(() => {
    if (!isLoadedRef.current) return;
    if (currentUser) {
      try {
        localStorage.setItem(`luxestore_custom_wishlists_${currentUser.id}`, JSON.stringify(customWishlists));
      } catch (e) {
        console.error('Failed to save custom wishlists to localStorage:', e);
      }
    }
  }, [customWishlists, currentUser?.id]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");

  const handleNewsletterSubscribe = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newsletterEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      showToast("Invalid email format. Please enter a valid email address.");
      return;
    }
    showToast("Thank you for subscribing to our newsletter!");
    setNewsletterEmail("");
  };

  // UI View Drawer Toggles
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState<boolean>(false);
  const [mobileUserOpen, setMobileUserOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Scroll listener for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Maintain stable page layout and mutual exclusivity when dropdown/drawer overlays are active
  useEffect(() => {
    if (cartOpen) {
      setShowSearchResults(false);
      setMobileMenuOpen(false);
    }
  }, [cartOpen]);

  useEffect(() => {
    if (showSearchResults) {
      setCartOpen(false);
      setMobileMenuOpen(false);
    }
  }, [showSearchResults]);

  useEffect(() => {
    if (mobileMenuOpen) {
      setCartOpen(false);
      setShowSearchResults(false);
    }
  }, [mobileMenuOpen]);

  // Lock background scroll and touch interaction when any overlay is open
  useEffect(() => {
    const isAnyOverlayOpen = cartOpen || mobileMenuOpen || showSearchResults;
    if (isAnyOverlayOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [cartOpen, mobileMenuOpen, showSearchResults]);

  // Close active overlays on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
        setShowSearchResults(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Customizer Panel States
  const [editorOpen, setEditorOpen] = useState<boolean>(false); // Starts closed
  const [activeEditorTab, setActiveEditorTab] = useState<'settings' | 'codebase'>('settings');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [showHtmlPreview, setShowHtmlPreview] = useState<boolean>(false);

  // Toast notification manager state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    messageOrTitle: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'success', 
    description?: string
  ) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type,
      title: messageOrTitle,
      description
    };

    setToasts(prev => [...prev.slice(-4), newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Categories Carousel Ref
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [categoriesCanScrollLeft, setCategoriesCanScrollLeft] = useState(false);
  const [categoriesCanScrollRight, setCategoriesCanScrollRight] = useState(true);
  const [categoriesPage, setCategoriesPage] = useState(0);
  const [totalCategoriesPages, setTotalCategoriesPages] = useState(1);

  const updateCategoriesScrollState = () => {
    if (categoriesScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesScrollRef.current;
      setCategoriesCanScrollLeft(scrollLeft > 10);
      setCategoriesCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      
      if (clientWidth > 0) {
        const pages = Math.max(1, Math.ceil(scrollWidth / clientWidth));
        const currentPage = Math.min(pages - 1, Math.round(scrollLeft / clientWidth));
        setTotalCategoriesPages(pages);
        setCategoriesPage(currentPage);
      }
    }
  };

  useEffect(() => {
    updateCategoriesScrollState();
    window.addEventListener('resize', updateCategoriesScrollState);
    return () => window.removeEventListener('resize', updateCategoriesScrollState);
  }, [categories]);

  // Brands Carousel Ref
  const brandsScrollRef = useRef<HTMLDivElement>(null);

  // Home Recently Viewed Carousel Ref
  const recentlyViewedScrollRef = useRef<HTMLDivElement>(null);

  // Map theme colors to CSS Tailwind classes
  const getThemeClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-600 hover:bg-emerald-700',
          text: 'text-emerald-600',
          border: 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20',
          lightBg: 'bg-emerald-50 text-emerald-700',
          badge: 'bg-emerald-500',
          accent: 'emerald',
          primaryHex: '#10b981',
          shadow: 'shadow-emerald-500/25',
          ring: 'focus:ring-emerald-500/30'
        };
      case 'rose':
        return {
          bg: 'bg-rose-600 hover:bg-rose-700',
          text: 'text-rose-600',
          border: 'border-rose-200 focus:border-rose-500 focus:ring-rose-500/20',
          lightBg: 'bg-rose-50 text-rose-700',
          badge: 'bg-rose-500',
          accent: 'rose',
          primaryHex: '#f43f5e',
          shadow: 'shadow-rose-500/25',
          ring: 'focus:ring-rose-500/30'
        };
      case 'amber':
        return {
          bg: 'bg-amber-600 hover:bg-amber-700',
          text: 'text-amber-600',
          border: 'border-amber-200 focus:border-amber-500 focus:ring-amber-500/20',
          lightBg: 'bg-amber-50 text-amber-700',
          badge: 'bg-amber-500',
          accent: 'amber',
          primaryHex: '#f59e0b',
          shadow: 'shadow-amber-500/25',
          ring: 'focus:ring-amber-500/30'
        };
      case 'slate':
        return {
          bg: 'bg-slate-800 hover:bg-slate-900',
          text: 'text-slate-800',
          border: 'border-slate-300 focus:border-slate-800 focus:ring-slate-800/20',
          lightBg: 'bg-slate-100 text-slate-800',
          badge: 'bg-slate-800',
          accent: 'slate',
          primaryHex: '#1f2937',
          shadow: 'shadow-slate-800/25',
          ring: 'focus:ring-slate-800/30'
        };
      case 'blue':
      case 'indigo':
      default:
        return {
          bg: 'bg-blue-600 hover:bg-blue-700',
          text: 'text-blue-600',
          border: 'border-blue-200 focus:border-blue-500 focus:ring-blue-500/20',
          lightBg: 'bg-blue-50 text-blue-700',
          badge: 'bg-blue-600',
          accent: 'blue',
          primaryHex: '#2563eb',
          shadow: 'shadow-blue-500/25',
          ring: 'focus:ring-blue-500/30'
        };
    }
  };

  const currentTheme = getThemeClasses(themeColor);

  // Manage Autoplay Slider timer
  const restartAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, autoplaySpeed);
    }
  };

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [currentSlideIndex, autoplay, autoplaySpeed, slides]);

  // Add Item to cart
  const handleAddToCart = (
    product: {
      id: string;
      name: string;
      price?: string | number;
      imageUrl: string;
      costPrice?: string | number;
      retailPrice?: string | number;
      retailMarkupPrice?: string | number;
      wholesalePrice?: string | number;
      minWholesaleQuantity?: number;
    },
    quantityToAdd: number = 1
  ) => {
    const catalogProd = products.find((p) => p.id === product.id) || product;
    const { retailPrice, wholesalePrice, minWholesaleQuantity } = getProductPrices(catalogProd, productsSettings);

    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        const newQty = exists.quantity + (quantityToAdd || 1);
        const newUnitPrice = newQty < minWholesaleQuantity ? retailPrice : wholesalePrice;
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQty,
                price: newUnitPrice,
                retailPrice,
                wholesalePrice,
                minWholesaleQuantity
              }
            : item
        );
      } else {
        const newQty = Math.max(1, quantityToAdd || 1);
        const newUnitPrice = newQty < minWholesaleQuantity ? retailPrice : wholesalePrice;
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: newUnitPrice,
            imageUrl: product.imageUrl,
            quantity: newQty,
            retailPrice,
            wholesalePrice,
            minWholesaleQuantity
          }
        ];
      }
    });

    showToast(`Added ${product.name} to cart!`);

    // GA4 DataLayer Event: add_to_cart
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: retailPrice,
      brand: (catalogProd as any)?.brand,
      category: (catalogProd as any)?.category,
      variant: (catalogProd as any)?.variant
    }, quantityToAdd, 'ZAR');

    // Automatically reveal the cart drawer with a tiny delay
    setTimeout(() => {
      setCartOpen(true);
    }, 400);
  };

  // Remove Item from cart
  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed item from cart.');
  };

  // Increase / Decrease Item Quantity
  const handleAdjustQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return { ...item, quantity: 0 };

            const catalogProd = products.find((p) => p.id === id);
            const { retailPrice, wholesalePrice, minWholesaleQuantity } = getProductPrices(catalogProd || item, productsSettings);
            const newUnitPrice = newQuantity < minWholesaleQuantity ? retailPrice : wholesalePrice;

            return {
              ...item,
              quantity: newQuantity,
              price: newUnitPrice,
              retailPrice,
              wholesalePrice,
              minWholesaleQuantity
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Create new Custom Wishlist
  const handleCreateWishlist = (name: string, description?: string, icon?: string): CustomWishlist => {
    const newList: CustomWishlist = {
      id: `list-${Date.now()}`,
      name: name.trim() || 'New Wishlist',
      description: description?.trim() || '',
      icon: icon || 'heart',
      productIds: [],
      createdAt: new Date().toISOString()
    };
    setCustomWishlists((prev) => [...prev, newList]);
    showToast(`Created wishlist "${newList.name}"!`);
    return newList;
  };

  // Delete Custom Wishlist
  const handleDeleteWishlist = (listId: string) => {
    setCustomWishlists((prev) => {
      const target = prev.find(l => l.id === listId);
      if (!target) return prev;
      if (target.isDefault && prev.length === 1) {
        showToast("Cannot delete your primary default wishlist.");
        return prev;
      }
      showToast(`Deleted wishlist "${target.name}".`);
      return prev.filter(l => l.id !== listId);
    });
  };

  // Rename Custom Wishlist
  const handleRenameWishlist = (listId: string, newName: string) => {
    if (!newName.trim()) return;
    setCustomWishlists((prev) => 
      prev.map(l => l.id === listId ? { ...l, name: newName.trim() } : l)
    );
    showToast(`Wishlist renamed to "${newName.trim()}".`);
  };

  // Toggle or Sync Product across specific Custom Wishlists
  const handleToggleProductInLists = (productId: string, targetListIds: string[]) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      showToast("Please sign in to save items to your wishlist.");
      return;
    }
    setCustomWishlists((prev) =>
      prev.map(list => {
        const shouldInclude = targetListIds.includes(list.id);
        const hasProduct = list.productIds.includes(productId);

        if (shouldInclude && !hasProduct) {
          return { ...list, productIds: [...list.productIds, productId] };
        } else if (!shouldInclude && hasProduct) {
          return { ...list, productIds: list.productIds.filter(id => id !== productId) };
        }
        return list;
      })
    );
    if (targetListIds.length > 0) {
      showToast(`Saved to ${targetListIds.length} ${targetListIds.length === 1 ? 'wishlist' : 'wishlists'}!`);
    } else {
      showToast(`Removed product from all wishlists.`);
    }
  };

  // Restore or Add basic starter wishlists if missing
  const handleResetDefaultWishlists = () => {
    const basicLists = [
      {
        id: 'list-favourites',
        name: 'Favourites',
        description: 'Your primary saved items',
        icon: 'heart',
        productIds: ['prod-1', 'prod-4'],
        createdAt: new Date().toISOString(),
        isDefault: true
      },
      {
        id: 'list-gift-ideas',
        name: 'Gift Ideas',
        description: 'Presents for upcoming celebrations & holidays',
        icon: 'gift',
        productIds: ['prod-2'],
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

    setCustomWishlists((prev) => {
      const existingNames = new Set(prev.map(l => l.name.toLowerCase()));
      const toAdd = basicLists.filter(b => !existingNames.has(b.name.toLowerCase()));
      if (toAdd.length === 0) {
        showToast("All basic wishlists are already present.");
        return prev;
      }
      showToast(`Added ${toAdd.length} standard starter wishlists!`);
      return [...prev, ...toAdd];
    });
  };

  // Toggle Wishlist item (Fallback quick toggle for non-modal contexts)
  const handleToggleWishlist = (productId: string, name?: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      showToast("Please sign in to save items to your wishlist.");
      return;
    }
    const isWishlisted = customWishlists.some(l => l.productIds.includes(productId));
    if (isWishlisted) {
      setCustomWishlists((prev) =>
        prev.map(l => ({ ...l, productIds: l.productIds.filter(id => id !== productId) }))
      );
      showToast(`Removed ${name} from Wishlists`);
    } else {
      setCustomWishlists((prev) => {
        const defaultList = prev.find(l => l.isDefault) || prev[0];
        if (!defaultList) return prev;
        return prev.map(l => l.id === defaultList.id ? { ...l, productIds: [...l.productIds, productId] } : l);
      });
      showToast(`Added ${name} to Wishlist!`);
    }
  };

  // Handle slide input field updates
  const handleUpdateSlideField = (index: number, key: keyof SlideConfig, value: string) => {
    setSlides((prev) => prev.map((s, idx) => idx === index ? { ...s, [key]: value } : s));
  };

  // Run Carousel scrolling
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const container = categoriesScrollRef.current;
      const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Run Brands Carousel scrolling
  const scrollBrands = (direction: 'left' | 'right') => {
    if (brandsScrollRef.current) {
      const amount = brandsScrollRef.current.clientWidth * 0.75;
      const scrollAmount = direction === 'left' ? -amount : amount;
      brandsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Drag scroll state for Categories
  const categoriesDragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });
  
  const handleCategoriesMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!categoriesScrollRef.current) return;
    categoriesDragState.current.isDown = true;
    categoriesDragState.current.moved = false;
    categoriesScrollRef.current.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
    categoriesScrollRef.current.style.scrollSnapType = 'none'; // Temporarily disable snap type while dragging
    categoriesDragState.current.startX = e.pageX - categoriesScrollRef.current.offsetLeft;
    categoriesDragState.current.scrollLeft = categoriesScrollRef.current.scrollLeft;
  };

  const handleCategoriesMouseLeave = () => {
    if (!categoriesDragState.current.isDown) return;
    categoriesDragState.current.isDown = false;
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.style.scrollBehavior = 'smooth';
      categoriesScrollRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  const handleCategoriesMouseUp = () => {
    if (!categoriesDragState.current.isDown) return;
    categoriesDragState.current.isDown = false;
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.style.scrollBehavior = 'smooth';
      categoriesScrollRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  const handleCategoriesMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!categoriesDragState.current.isDown || !categoriesScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesScrollRef.current.offsetLeft;
    const walk = (x - categoriesDragState.current.startX) * 1.5; // scroll speed multiplier
    if (Math.abs(walk) > 5) {
      categoriesDragState.current.moved = true;
    }
    categoriesScrollRef.current.scrollLeft = categoriesDragState.current.scrollLeft - walk;
  };

  // Drag scroll state for Brands
  const brandsDragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const handleBrandsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!brandsScrollRef.current) return;
    brandsDragState.current.isDown = true;
    brandsScrollRef.current.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
    brandsDragState.current.startX = e.pageX - brandsScrollRef.current.offsetLeft;
    brandsDragState.current.scrollLeft = brandsScrollRef.current.scrollLeft;
  };

  const handleBrandsMouseLeave = () => {
    brandsDragState.current.isDown = false;
    if (brandsScrollRef.current) {
      brandsScrollRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleBrandsMouseUp = () => {
    brandsDragState.current.isDown = false;
    if (brandsScrollRef.current) {
      brandsScrollRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleBrandsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!brandsDragState.current.isDown || !brandsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - brandsScrollRef.current.offsetLeft;
    const walk = (x - brandsDragState.current.startX) * 2; // scroll speed multiplier
    brandsScrollRef.current.scrollLeft = brandsDragState.current.scrollLeft - walk;
  };

  // Generate Standalone Template Code
  const generatedTemplateCode = generateEcommerceTemplate(
    {
      themeColor,
      autoplay,
      autoplaySpeed,
      logoText
    },
    slides,
    categories as any,
    brands as any,
    products
  );

  // Copy to Clipboard helper
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTemplateCode);
      setCopied(true);
      showToast("Template HTML code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // File Download helper for index.html
  const handleDownloadFile = () => {
    const blob = new Blob([generatedTemplateCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `index.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Downloaded index.html storefront successfully!");
  };

  // ZIP Codebase Package Download helper
  const handleDownloadZipPackage = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      // Add index.html
      zip.file("index.html", generatedTemplateCode, { createFolders: true, unixPermissions: "0644" });

      // Add Next.js project files
      const projectFiles = generateNextjsProject(logoText || "Mrbulk");
      projectFiles.forEach((file) => {
        const cleanPath = file.path.replace(/^[/\\]+/, '');
        zip.file(cleanPath, file.code, { createFolders: true, unixPermissions: "0644" });
      });

      zip.file("README.md", `# ${logoText || "Mrbulk"} Storefront Codebase Package\n\nIncludes:\n- index.html (Standalone HTML5 Storefront)\n- Next.js 15 App Router source codebase\n`, { createFolders: true, unixPermissions: "0644" });

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
        platform: "UNIX",
        mimeType: "application/zip"
      });
      
      const zipBlob = new Blob([content], { type: "application/zip" });
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "storefront-source.zip";
      link.setAttribute("download", "storefront-source.zip");
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 8000);

      showToast("Downloaded storefront-source.zip codebase package!");
    } catch (err) {
      console.error("Error creating ZIP package: ", err);
      showToast("Error generating ZIP archive.");
    } finally {
      setIsZipping(false);
    }
  };

  // Frontend Export Package Download helper (Tailwind CSS, HTML, React 19, TypeScript, Dropdowns & All Pages)
  const handleDownloadFrontendExport = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const files = generateFrontendExportFiles(logoText || "Mrbulk", generatedTemplateCode);

      files.forEach((file) => {
        const cleanPath = file.path.replace(/^[/\\]+/, '');
        zip.file(cleanPath, file.code, { createFolders: true, unixPermissions: "0644" });
      });

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
        platform: "UNIX",
        mimeType: "application/zip"
      });

      const zipBlob = new Blob([content], { type: "application/zip" });
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "frontend-export.zip";
      link.setAttribute("download", "frontend-export.zip");
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 8000);

      showToast("Downloaded frontend-export.zip package!");
    } catch (err) {
      console.error("Error creating frontend-export package: ", err);
      showToast("Error generating frontend-export archive.");
    } finally {
      setIsZipping(false);
    }
  };

  // Search Results filtering
  const filteredProducts = searchQuery.trim() === '' ? [] : products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // SEO & Document Title updates with Canonical Links & URL Sync
  useEffect(() => {
    let urlPath = getPageUrl(currentPage);
    let title = `${logoText} — Luxury E-Commerce Storefront`;
    let description = `Discover handcrafted interior decor, high-fidelity audio, luxury tech, and custom apparel at ${logoText}.`;

    if (currentPage === 'shop') {
      urlPath = (selectedShopBrand && selectedShopBrand !== 'All') 
        ? getBrandUrl(selectedShopBrand, { category: selectedShopCategory })
        : getShopUrl({ category: selectedShopCategory, brand: selectedShopBrand });
      title = `Shop Catalog & Collections — ${logoText}`;
      description = `Browse luxury catalog, electronics, interior decor, and lifestyle products at ${logoText}.`;
    } else if (currentPage === 'category-detail' && selectedCategoryName) {
      urlPath = getCategoryUrl(selectedCategoryName);
      title = `${selectedCategoryName} Department — ${logoText}`;
      description = `Explore top-rated ${selectedCategoryName} collections and products at ${logoText}.`;
    } else if (currentPage === 'product-detail' && selectedProductId) {
      const prod = products.find(p => p.id === selectedProductId);
      urlPath = getProductUrl(selectedProductId, prod?.name);
      if (prod) {
        title = `${prod.name} | Buy Online at ${logoText}`;
        description = prod.description || `Buy ${prod.name} online with fast shipping and luxury guarantee at ${logoText}.`;
      }
    } else if (currentPage === 'search-results') {
      urlPath = getSearchUrl(searchQuery);
      title = searchQuery ? `Search: "${searchQuery}" — ${logoText}` : `Product Search — ${logoText}`;
    } else if (currentPage === 'cart') {
      title = `Shopping Cart (${cart.length}) — ${logoText}`;
    } else if (currentPage === 'admin') {
      title = `Admin Portal & Management — ${logoText}`;
    } else if (currentPage === 'account') {
      title = `My Account & Orders — ${logoText}`;
    } else if (currentPage === 'wishlist') {
      title = `My Wishlist (${wishlist.length}) — ${logoText}`;
    } else if (currentPage === 'categories') {
      title = `Browse All Departments — ${logoText}`;
      description = `Browse all department categories including Electronics, Apparel, Furniture, and Tech at ${logoText}.`;
    } else if (currentPage === 'about') {
      title = `About Us — ${logoText}`;
      description = `Learn about ${logoText}'s mission, craftsmanship, and commitment to luxury design.`;
    } else if (currentPage === 'contact') {
      title = `Contact Us — ${logoText}`;
      description = `Get in touch with ${logoText} customer support, sales, and inquiry desk.`;
    } else if (currentPage === 'faq') {
      title = `Frequently Asked Questions — ${logoText}`;
      description = `Find answers to common questions about orders, shipping, and returns at ${logoText}.`;
    } else if (currentPage === 'privacy-policy') {
      title = `Privacy Policy — ${logoText}`;
    } else if (currentPage === 'terms-and-conditions') {
      title = `Terms & Conditions — ${logoText}`;
    } else if (currentPage === 'returns-policy') {
      title = `Returns & Refund Policy — ${logoText}`;
    } else if (currentPage === 'not-found') {
      urlPath = window.location.pathname;
      title = `404 — Page Not Found — ${logoText}`;
      description = `The page you requested could not be found at ${logoText}.`;
    }

    // Sync browser address bar URL without reloading page
    if (currentPage !== 'not-found' && window.location.pathname + window.location.search !== urlPath) {
      window.history.pushState(null, '', urlPath);
    }

    // Dynamic SEO Metadata and Canonical Link Injection
    updateSEOMetadata({
      title,
      description,
      canonicalPath: urlPath
    });
  }, [currentPage, selectedCategoryName, selectedProductId, selectedShopCategory, selectedShopBrand, searchQuery, logoText, products, cart.length, wishlist.length]);

  // Initial URL Location Parsing & Browser PopState listener
  useEffect(() => {
    const handleUrlRoute = () => {
      const loc = parseLocation(window.location.pathname, window.location.search);
      if (loc.currentPage === 'product-detail' && loc.rawProductId) {
        const found = products.find(p => 
          p.id === loc.rawProductId || 
          loc.rawProductId.startsWith(p.id) ||
          slugify(p.name) === loc.rawProductId ||
          loc.rawProductId.includes(p.id)
        );
        if (found) {
          setSelectedProductId(found.id);
          setCurrentPage('product-detail');
        } else if (products.length > 0) {
          setCurrentPage('not-found');
        } else {
          setSelectedProductId(loc.rawProductId.split('-')[0] + '-' + loc.rawProductId.split('-')[1]);
          setCurrentPage('product-detail');
        }
      } else if (loc.currentPage === 'category-detail' && loc.categorySlug) {
        const resolvedCategory = formatCategoryName(loc.categorySlug, categories);
        setSelectedCategoryName(resolvedCategory);
        setCurrentPage('category-detail');
      } else if (loc.currentPage === 'shop') {
        setCurrentPage('shop');
        if (loc.categorySlug) {
          const resolvedCat = formatCategoryName(loc.categorySlug, categories);
          setSelectedShopCategory(resolvedCat);
        }
        if (loc.brandSlug) {
          const cleanedBrand = decodeAndCleanText(loc.brandSlug);
          const foundBrand = brands.find(b => slugify(b.name) === slugify(cleanedBrand) || b.name.toLowerCase() === cleanedBrand.toLowerCase());
          setSelectedShopBrand(foundBrand ? foundBrand.name : deslugify(cleanedBrand));
        }
        if (loc.q) setSearchQuery(loc.q);
      } else if (loc.currentPage === 'search-results') {
        setCurrentPage('search-results');
        if (loc.q) setSearchQuery(loc.q);
      } else if (loc.currentPage === 'not-found') {
        setCurrentPage('not-found');
      } else if (loc.currentPage !== 'home' || window.location.pathname !== '/') {
        setCurrentPage(loc.currentPage);
      } else {
        setCurrentPage('home');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, [products, categories, brands]);

  const cartSubtotal = cart.reduce((acc, curr) => {
    const catalogProd = products.find((p) => p.id === curr.id);
    const unitPrice = getCartItemUnitPrice(curr, catalogProd, productsSettings);
    return acc + unitPrice * curr.quantity;
  }, 0);

  return (
    <div className="bg-white min-h-screen text-slate-800 flex flex-col font-sans relative overflow-x-clip">
      
      {/* Dynamic Scoped Styles (Selection text color and theme overrides) */}
      <style>{`
        ::selection {
          background-color: ${currentTheme.primaryHex};
          color: #ffffff;
        }
        ::-moz-selection {
          background-color: ${currentTheme.primaryHex};
          color: #ffffff;
        }
      `}</style>
      
      {/* 1. STICKY FLOATING CENTERED POPUP BAR HEADER */}
      <header className="sticky top-2 sm:top-3.5 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto transition-all duration-300 pointer-events-none mb-2 sm:mb-4 relative">
        <div className={`pointer-events-auto transition-all duration-300 rounded-2xl sm:rounded-full border backdrop-blur-2xl px-4 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4 relative z-50 ${
          mobileMenuOpen || showSearchResults || isScrolled
            ? 'bg-white border-slate-300 text-slate-900 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/10'
            : 'bg-white/90 border-slate-300/80 text-slate-900 shadow-lg shadow-slate-900/5 hover:bg-white/95 hover:border-slate-300'
        }`}>
          <div className="w-full flex items-center justify-between gap-2 sm:gap-4 h-9 sm:h-10">
            
            {/* 1. Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNavigatePage('home'); }}
                className="group flex items-center gap-2 text-slate-900 focus:outline-none"
              >
                <div className={`w-7.5 h-7.5 rounded-full ${currentTheme.bg} text-white flex items-center justify-center shadow-xs ${currentTheme.shadow} group-hover:scale-105 transition-transform duration-200`}>
                  <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="font-sans font-extrabold text-sm sm:text-lg tracking-tight text-slate-900">
                  {logoText}
                </span>
              </a>
            </div>

            {/* 2. Desktop Navigation Links (Page Names) */}
            <nav className="hidden lg:flex items-center space-x-1 lg:space-x-1.5 text-xs sm:text-sm font-semibold flex-shrink-0">
              <a 
                href="/"
                onClick={(e) => { e.preventDefault(); handleNavigatePage('home'); }}
                className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none no-underline ${
                  currentPage === 'home' 
                    ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Home
              </a>

              <a 
                href="/shop"
                onClick={(e) => { e.preventDefault(); setSelectedShopCategory('All'); setSelectedShopBrand('All'); setCurrentPage('shop'); }}
                className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none no-underline ${
                  currentPage === 'shop' 
                    ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Shop
              </a>

              <a 
                href="/categories"
                onClick={(e) => { e.preventDefault(); setCurrentPage('categories'); }}
                className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none no-underline ${
                  currentPage === 'categories' 
                    ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Categories
              </a>

              {/* Company Dropdown */}
              <div className="relative group">
                <a 
                  href="/about"
                  onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}
                  className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1 no-underline ${
                    ['about', 'contact', 'faq'].includes(currentPage)
                      ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs` 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span>Company</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-slate-700" />
                </a>

                {/* Hover bridge to bridge gap */}
                <div className="absolute top-full left-0 w-full h-2.5 pointer-events-auto" />

                {/* Company Dropdown Menu */}
                <div className="absolute top-[calc(100%+6px)] left-0 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left group-hover:translate-y-0 translate-y-1">
                  <a
                    href="/about"
                    onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer no-underline ${
                      currentPage === 'about'
                        ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg ${currentPage === 'about' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'about' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-extrabold">About Us</div>
                      <div className="text-[10px] text-slate-400 font-medium">Our story & brand</div>
                    </div>
                  </a>

                  <a
                    href="/contact"
                    onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer no-underline ${
                      currentPage === 'contact'
                        ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg ${currentPage === 'contact' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'contact' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-extrabold">Contact</div>
                      <div className="text-[10px] text-slate-400 font-medium">Get in touch with us</div>
                    </div>
                  </a>

                  <a
                    href="/faq"
                    onClick={(e) => { e.preventDefault(); setCurrentPage('faq'); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer no-underline ${
                      currentPage === 'faq'
                        ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg ${currentPage === 'faq' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'faq' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-extrabold">FAQ</div>
                      <div className="text-[10px] text-slate-400 font-medium">Help center & answers</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* User Dropdown */}
              <div className="relative group">
                <a 
                  href="/account"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!currentUser) {
                      setAuthModalOpen(true);
                    } else {
                      setCurrentPage('account');
                    }
                  }}
                  className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1.5 no-underline ${
                    ['account', 'order-tracking', 'wishlist'].includes(currentPage)
                      ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs` 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>User</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-slate-700" />
                </a>

                {/* Hover bridge to bridge gap */}
                <div className="absolute top-full left-0 w-full h-2.5 pointer-events-auto" />

                {/* User Dropdown Menu */}
                <div className="absolute top-[calc(100%+6px)] left-0 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left group-hover:translate-y-0 translate-y-1">
                  
                  {/* My Account */}
                  <a
                    href="/account"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!currentUser) {
                        setAuthModalOpen(true);
                      } else {
                        setCurrentPage('account');
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer no-underline ${
                      currentPage === 'account'
                        ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg ${currentPage === 'account' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'account' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-extrabold">My Account</div>
                        <div className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                          {currentUser ? currentUser.name : "Sign In / Profile"}
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Track Order */}
                  <a
                    href="/order-tracking"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!currentUser) {
                        setAuthModalOpen(true);
                        showToast("Please sign in to track your order.");
                        return;
                      }
                      setCurrentPage('order-tracking');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer no-underline ${
                      currentPage === 'order-tracking'
                        ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg ${currentPage === 'order-tracking' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'order-tracking' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-extrabold">Track Order</div>
                        <div className="text-[10px] text-slate-400 font-medium">Live package tracking</div>
                      </div>
                    </div>
                  </a>

                  {/* Wishlist */}
                  <a
                    href="/wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage('wishlist');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer no-underline ${
                      currentPage === 'wishlist'
                        ? 'bg-rose-50 text-rose-700 font-extrabold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg ${currentPage === 'wishlist' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-500'} flex items-center justify-center shrink-0`}>
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div>
                        <div className="font-extrabold">Wishlist</div>
                        <div className="text-[10px] text-slate-400 font-medium">Saved favorites</div>
                      </div>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-2xs">
                        {wishlist.length}
                      </span>
                    )}
                  </a>

                  {/* Cart */}
                  <button
                    onClick={() => setCartOpen(true)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg ${currentTheme.lightBg} ${currentTheme.text} flex items-center justify-center shrink-0`}>
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-extrabold">Cart</div>
                        <div className="text-[10px] text-slate-400 font-medium">View shopping bag</div>
                      </div>
                    </div>
                    {cart.length > 0 && (
                      <span className={`px-2 py-0.5 rounded-full ${currentTheme.badge} text-white text-[10px] font-black shadow-2xs`}>
                        {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
                      </span>
                    )}
                  </button>

                </div>
              </div>

              {(currentUser?.role === 'admin' || currentPage === 'admin') && (
                <a 
                  href="/admin"
                  onClick={(e) => { e.preventDefault(); setCurrentPage('admin'); }}
                  className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1.5 no-underline ${
                    currentPage === 'admin' 
                      ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold shadow-2xs` 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                  <span>Admin</span>
                </a>
              )}
            </nav>

            {/* 3. Product Search Bar (positioned in the middle between page names and action icons on desktop screens) */}
            <div className="relative hidden lg:block flex-1 max-w-[200px] lg:max-w-xs xl:max-w-md mx-2 lg:mx-3">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePerformSearch();
                  }
                }}
                className="w-full text-xs pl-8 pr-3.5 py-1.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-300/30 rounded-full transition-all font-medium placeholder-slate-400"
              />
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* 4. Action Icons (Right Side) */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
              
              {/* My Account Icon Button */}
              <button 
                onClick={() => {
                  if (!currentUser) {
                    setAuthModalOpen(true);
                  } else {
                    setCurrentPage('account');
                  }
                }}
                className={`hidden lg:inline-flex p-2 rounded-full transition cursor-pointer relative hover:scale-105 active:scale-95 ${currentPage === 'account' ? `${currentTheme.lightBg} ${currentTheme.text} border ${currentTheme.border}` : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'}`}
                title={currentUser ? `My Account (${currentUser.name})` : "My Account"}
              >
                {currentUser ? (
                  <SafeImage src={currentUser.avatarUrl} className="w-4.5 h-4.5 rounded-full object-cover border border-slate-300" alt={currentUser.name} placeholderType="avatar" fallbackTitle={currentUser.name} />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              {/* Wishlist Icon Button */}
              <button 
                onClick={() => setCurrentPage('wishlist')}
                className={`hidden lg:inline-flex p-2 rounded-full transition cursor-pointer relative hover:scale-105 active:scale-95 ${currentPage === 'wishlist' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'}`}
                title="Saved Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border-2 border-white shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Icon Button */}
              <button 
                onClick={() => {
                  setCartOpen(prev => !prev);
                }}
                className="p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition cursor-pointer relative hover:scale-105 active:scale-95"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {cart.length > 0 && (
                  <span className={`absolute -top-1 -right-1 ${currentTheme.badge} text-white text-[9px] font-extrabold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs`}>
                    {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Search Icon - Compact Screens */}
              <button
                onClick={() => {
                  setShowSearchResults(prev => {
                    const next = !prev;
                    if (next) setMobileMenuOpen(false);
                    return next;
                  });
                }}
                className={`lg:hidden p-2 rounded-full transition cursor-pointer ${showSearchResults ? `${currentTheme.text} ${currentTheme.lightBg} border ${currentTheme.border}` : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'}`}
                title="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button 
                onClick={() => {
                  setMobileMenuOpen(prev => {
                    const next = !prev;
                    if (next) {
                      setShowSearchResults(false);
                      setMobileCompanyOpen(false);
                      setMobileUserOpen(false);
                    }
                    return next;
                  });
                }}
                className={`lg:hidden p-2 rounded-full transition cursor-pointer ${mobileMenuOpen ? `${currentTheme.text} ${currentTheme.lightBg} border ${currentTheme.border}` : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'}`}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>

            </div>
          </div>
        </div>

        {/* Catalog Search Megamenu Dropdown Menu */}
        <AnimatePresence>
          {showSearchResults && (
            <>
              {/* Dark backdrop overlay for the page beneath header */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 pointer-events-auto" 
                onClick={() => setShowSearchResults(false)} 
                onTouchMove={(e) => e.preventDefault()}
              />

              {/* Scrollable Search Megamenu Dropdown Container */}
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-full left-3 right-3 sm:left-6 sm:right-6 mt-2 bg-white border border-slate-200/90 text-slate-800 shadow-2xl rounded-2xl sm:rounded-3xl z-50 p-5 sm:p-7 max-h-[75vh] overflow-y-auto overscroll-contain touch-pan-y pointer-events-auto"
              >
                <div className="max-w-7xl mx-auto space-y-6">
                  
                  {/* Top Section: Product Search Header & Action */}
                  <div className="space-y-3 pb-6 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`text-[11px] sm:text-xs font-extrabold ${currentTheme.text} uppercase tracking-wider flex items-center gap-1.5`}>
                          <Search className="w-3.5 h-3.5" /> Product Search
                        </span>
                        {searchQuery.trim() !== '' && (
                          <span className="text-[10px] sm:text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            Press Enter ↵ to search for &ldquo;{searchQuery}&rdquo;
                          </span>
                        )}
                      </div>

                      <button 
                        onClick={() => setShowSearchResults(false)}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" /> Close
                      </button>
                    </div>

                    {/* Embedded Search Input Bar inside Product Search Dropdown (Compact Screens) */}
                    <div className="relative w-full lg:hidden">
                      <input 
                        type="text" 
                        placeholder="Search for products, categories, keywords..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handlePerformSearch();
                          }
                        }}
                        autoFocus
                        className="w-full text-xs sm:text-sm pl-9 pr-24 py-2.5 sm:py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-300/30 rounded-xl sm:rounded-2xl transition font-medium text-slate-900 placeholder-slate-400"
                      />
                      <Search className="absolute left-3 top-3 sm:top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                      <div className="absolute right-1.5 top-1.5 sm:top-2 flex items-center gap-1">
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="px-2 py-1 text-slate-400 hover:text-slate-600 text-xs font-bold transition"
                          >
                            ✕
                          </button>
                        )}
                        <button
                          onClick={() => handlePerformSearch()}
                          className={`px-3 py-1.5 ${currentTheme.bg} text-white text-xs font-extrabold rounded-lg sm:rounded-xl transition cursor-pointer shadow-2xs`}
                        >
                          Search
                        </button>
                      </div>
                    </div>

                    <div>
                      {searchQuery.trim() === '' ? (
                        <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Trending Searches
                            </span>
                            <span className={`text-[10px] ${currentTheme.text} font-extrabold ${currentTheme.lightBg} px-2.5 py-0.5 rounded-full border ${currentTheme.border}`}>
                              Popular Keywords
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {[
                              'Wooden Chair',
                              'Wireless Headphones',
                              'Mechanical Keyboard',
                              'Leather Wallet',
                              'Ceramic Lamp',
                              'Smartwatch',
                              'Ergonomic Desk',
                              'Smart Home Hub'
                            ].map((tag) => (
                              <button
                                key={tag}
                                onClick={() => handlePerformSearch(tag)}
                                className={`px-3.5 py-1.5 rounded-full bg-white hover:${currentTheme.bg} hover:text-white border border-slate-200/80 text-slate-700 text-xs font-extrabold transition shadow-2xs cursor-pointer flex items-center gap-1.5 group`}
                              >
                                <Search className="w-3 h-3 text-slate-400 group-hover:text-white transition" />
                                <span>{tag}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className={`p-4 sm:p-5 ${currentTheme.lightBg} rounded-2xl border ${currentTheme.border} space-y-3`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Search className={`w-4 h-4 ${currentTheme.text}`} />
                              <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                                Product Search for &ldquo;{searchQuery}&rdquo;
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 hidden sm:inline-block">
                              Press <kbd className={`font-mono font-extrabold ${currentTheme.text}`}>Enter ↵</kbd> to view results
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Press <strong className="text-slate-800">Enter</strong> on your keyboard or click below to open full product search results for <strong className={currentTheme.text}>&ldquo;{searchQuery}&rdquo;</strong>.
                          </p>
                          <div className="pt-1">
                            <button
                              onClick={() => handlePerformSearch()}
                              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl ${currentTheme.bg} text-white text-xs sm:text-sm font-extrabold transition shadow-xs cursor-pointer`}
                            >
                              <Search className="w-4 h-4" />
                              <span>View All Results for &ldquo;{searchQuery}&rdquo; &rarr;</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Section: Trending & Suggested Products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Column 1: Trending Products */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Trending Products
                        </span>
                        <span className="text-[10px] text-amber-700 font-extrabold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Hot Right Now
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {products.slice(0, 4).map((p) => (
                          <button
                            key={`trending-${p.id}`}
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setCurrentPage('product-detail');
                              setShowSearchResults(false);
                            }}
                            className="flex items-center gap-3 p-2.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl transition text-left cursor-pointer group border border-slate-200/80 hover:border-amber-400"
                          >
                            <div className="relative shrink-0">
                              <SafeImage src={p.imageUrl} className="w-12 h-12 object-cover rounded-xl border border-slate-200 group-hover:scale-105 transition" alt={p.name} placeholderType="product" fallbackTitle={p.name} />
                              <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center">🔥</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 truncate transition">{p.name}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-amber-600 font-extrabold">{p.price}</span>
                                <span className="text-[10px] text-slate-500 font-bold">★ 4.9</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Suggested Products */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-blue-500" /> Suggested Products
                        </span>
                        <span className="text-[10px] text-blue-700 font-extrabold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          Editor Picks
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {products.slice(2, 6).map((p) => (
                          <button
                            key={`suggested-${p.id}`}
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setCurrentPage('product-detail');
                              setShowSearchResults(false);
                            }}
                            className="flex items-center gap-3 p-2.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl transition text-left cursor-pointer group border border-slate-200/80 hover:border-blue-400"
                          >
                            <SafeImage src={p.imageUrl} className="w-12 h-12 object-cover rounded-xl border border-slate-200 group-hover:scale-105 transition shrink-0" alt={p.name} placeholderType="product" fallbackTitle={p.name} />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate transition">{p.name}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-blue-600 font-extrabold">{p.price}</span>
                                <span className="text-[10px] text-slate-500 font-bold">★ 4.8</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Dark backdrop overlay for the page beneath header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                onTouchMove={(e) => e.preventDefault()}
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden pointer-events-auto"
              />

              {/* Scrollable Mobile Dropdown Menu Container */}
              <motion.div 
                initial={{ opacity: 0, y: -10, scaleY: 0.98 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-full left-3 right-3 sm:left-6 sm:right-6 mt-2 bg-white border border-slate-200/90 text-slate-800 shadow-2xl rounded-2xl sm:rounded-3xl z-50 lg:hidden max-h-[75vh] overflow-y-auto overscroll-contain touch-pan-y pointer-events-auto"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
                  
                  {/* Navigation links */}
                  <nav className="space-y-1">
                    <button 
                      onClick={() => { setMobileMenuOpen(false); setShowSearchResults(true); }} 
                      className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer outline-none transition bg-slate-50/90 text-slate-800 hover:bg-slate-100 border border-slate-200/80 mb-2"
                    >
                      <span className="flex items-center gap-2">
                        <Search className={`w-4 h-4 ${currentTheme.text}`} />
                        <span>Product Search</span>
                      </span>
                      <span className={`text-[10px] font-extrabold ${currentTheme.text} ${currentTheme.lightBg} px-2 py-0.5 rounded-full border ${currentTheme.border}`}>
                        Open Search
                      </span>
                    </button>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); handleNavigatePage('home'); }} 
                      className={`w-full text-left block px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer outline-none transition ${currentPage === 'home' ? `${currentTheme.lightBg} ${currentTheme.text} font-bold border ${currentTheme.border}` : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); setSelectedShopCategory('All'); setSelectedShopBrand('All'); setCurrentPage('shop'); }} 
                      className={`w-full text-left block px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer outline-none transition ${currentPage === 'shop' ? `${currentTheme.lightBg} ${currentTheme.text} font-bold border ${currentTheme.border}` : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                      Shop
                    </button>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); setCurrentPage('categories'); }} 
                      className={`w-full text-left block px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer outline-none transition ${currentPage === 'categories' ? `${currentTheme.lightBg} ${currentTheme.text} font-bold border ${currentTheme.border}` : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                      Categories
                    </button>

                    {/* Company Dropdown Accordion Section */}
                    <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-slate-50/50 my-1.5">
                      <button
                        onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                        className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between cursor-pointer outline-none transition ${
                          ['about', 'contact', 'faq'].includes(currentPage)
                            ? `${currentTheme.lightBg} ${currentTheme.text}`
                            : 'text-slate-800 hover:bg-slate-100/80'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className={`w-4 h-4 ${['about', 'contact', 'faq'].includes(currentPage) ? currentTheme.text : 'text-slate-500'}`} />
                          <span>Company</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${mobileCompanyOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {mobileCompanyOpen && (
                        <div className="p-2 space-y-1 bg-white border-t border-slate-200/80">
                          <button
                            onClick={() => { setMobileMenuOpen(false); setCurrentPage('about'); }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                              currentPage === 'about'
                                ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg ${currentPage === 'about' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'about' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                              <Building2 className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-extrabold text-xs">About Us</div>
                              <div className="text-[10px] text-slate-400 font-medium">Our story & brand</div>
                            </div>
                          </button>

                          <button
                            onClick={() => { setMobileMenuOpen(false); setCurrentPage('contact'); }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                              currentPage === 'contact'
                                ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg ${currentPage === 'contact' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'contact' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                              <Mail className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-extrabold text-xs">Contact</div>
                              <div className="text-[10px] text-slate-400 font-medium">Get in touch with us</div>
                            </div>
                          </button>

                          <button
                            onClick={() => { setMobileMenuOpen(false); setCurrentPage('faq'); }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                              currentPage === 'faq'
                                ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg ${currentPage === 'faq' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'faq' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                              <HelpCircle className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-extrabold text-xs">FAQ</div>
                              <div className="text-[10px] text-slate-400 font-medium">Help center & answers</div>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* User Dropdown Accordion Section */}
                    <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-slate-50/50 my-1.5">
                      <button
                        onClick={() => setMobileUserOpen(!mobileUserOpen)}
                        className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between cursor-pointer outline-none transition ${
                          ['account', 'order-tracking', 'wishlist'].includes(currentPage)
                            ? `${currentTheme.lightBg} ${currentTheme.text}`
                            : 'text-slate-800 hover:bg-slate-100/80'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <User className={`w-4 h-4 ${['account', 'order-tracking', 'wishlist'].includes(currentPage) ? currentTheme.text : 'text-slate-500'}`} />
                          <span>User</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${mobileUserOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {mobileUserOpen && (
                        <div className="p-2 space-y-1 bg-white border-t border-slate-200/80">
                          
                          {/* My Account */}
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              if (!currentUser) {
                                setAuthModalOpen(true);
                              } else {
                                setCurrentPage('account');
                              }
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer ${
                              currentPage === 'account'
                                ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg ${currentPage === 'account' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'account' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-extrabold text-xs">My Account</div>
                                <div className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                                  {currentUser ? currentUser.name : "Sign In / Profile"}
                                </div>
                              </div>
                            </div>
                          </button>

                          {/* Track Order */}
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              if (!currentUser) {
                                setAuthModalOpen(true);
                                showToast("Please sign in to track your order.");
                                return;
                              }
                              setCurrentPage('order-tracking');
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer ${
                              currentPage === 'order-tracking'
                                ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold`
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg ${currentPage === 'order-tracking' ? currentTheme.bg : 'bg-slate-100'} ${currentPage === 'order-tracking' ? 'text-white' : 'text-slate-600'} flex items-center justify-center shrink-0`}>
                                <Truck className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-extrabold text-xs">Track Order</div>
                                <div className="text-[10px] text-slate-400 font-medium">Live package tracking</div>
                              </div>
                            </div>
                          </button>

                          {/* Wishlist */}
                          <button
                            onClick={() => { setMobileMenuOpen(false); setCurrentPage('wishlist'); }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer ${
                              currentPage === 'wishlist'
                                ? 'bg-rose-50 text-rose-700 font-extrabold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg ${currentPage === 'wishlist' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-500'} flex items-center justify-center shrink-0`}>
                                <Heart className="w-3.5 h-3.5 fill-current" />
                              </div>
                              <div>
                                <div className="font-extrabold text-xs">Wishlist</div>
                                <div className="text-[10px] text-slate-400 font-medium">Saved favorites</div>
                              </div>
                            </div>
                            {wishlist.length > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-2xs">
                                {wishlist.length}
                              </span>
                            )}
                          </button>

                          {/* Cart */}
                          <button
                            onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }}
                            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer text-slate-700 hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg ${currentTheme.lightBg} ${currentTheme.text} flex items-center justify-center shrink-0`}>
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-extrabold text-xs">Cart</div>
                                <div className="text-[10px] text-slate-400 font-medium">View shopping bag</div>
                              </div>
                            </div>
                            {cart.length > 0 && (
                              <span className={`px-2 py-0.5 rounded-full ${currentTheme.badge} text-white text-[10px] font-black shadow-2xs`}>
                                {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
                              </span>
                            )}
                          </button>

                        </div>
                      )}
                    </div>
                  </nav>

                  {/* Quick Shortcuts inside Dropdown */}
                  <div className="pt-4 border-t border-slate-200">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-3">Quick Shortcuts</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (wishlist.length === 0) {
                            showToast("Your wishlist is empty!");
                          } else {
                            const wishlistedNames = MOCK_WOO_PRODUCTS
                              .filter(p => wishlist.includes(p.id))
                              .map(p => p.name)
                              .join(', ');
                            showToast(`Wishlist items: ${wishlistedNames}`);
                          }
                        }}
                        className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 rounded-2xl transition cursor-pointer"
                      >
                        <Heart className="w-5 h-5 text-rose-500 transition mb-1" />
                        <span className="text-[10px] font-bold text-slate-700">Wishlist ({wishlist.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCartOpen(true);
                        }}
                        className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 rounded-2xl transition cursor-pointer"
                      >
                        <ShoppingCart className={`w-5 h-5 ${currentTheme.text} mb-1`} />
                        <span className="text-[10px] font-bold text-slate-700">My Cart ({cart.reduce((acc, curr) => acc + curr.quantity, 0)})</span>
                      </button>
                    </div>
                  </div>

                  {/* Logged in User Bar */}
                  {currentUser && (
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <SafeImage src={currentUser.avatarUrl} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt={currentUser.name} placeholderType="avatar" fallbackTitle={currentUser.name} />
                        <div>
                          <div className="font-bold text-slate-800 text-xs">{currentUser.name}</div>
                          <div className="text-[10px] text-slate-500">{currentUser.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Sign Out"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  )}

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {currentPage === 'home' ? (
            <div className="space-y-12 sm:space-y-16 pb-16">
              {/* CATEGORY QUICK NAV CAROUSEL & HERO BANNER GROUP */}
              <div className="space-y-4 sm:space-y-5">
                <CategoryBarCarousel
                  categories={categories}
                  products={products}
                  themeColor={themeColor}
                  currentTheme={currentTheme}
                  selectedCategory={selectedShopCategory}
                  onSelectCategory={(categoryName) => {
                    if (categoryName.toLowerCase() === 'all') {
                      setSelectedShopCategory('All');
                      setCurrentPage('shop');
                    } else {
                      setSelectedCategoryName(categoryName);
                      setCurrentPage('category-detail');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onViewAllCategories={() => {
                    setCurrentPage('categories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                {/* 2. DYNAMIC HERO SLIDER BANNER */}
                <HeroBanner
                  slides={slides}
                  currentSlideIndex={currentSlideIndex}
                  setCurrentSlideIndex={setCurrentSlideIndex}
                  autoplay={autoplay}
                  setAutoplay={setAutoplay}
                  restartAutoplay={restartAutoplay}
                  currentTheme={currentTheme}
                  freeShippingThreshold={freeShippingThreshold}
                  onNavigate={(page, category, brand) => {
                    if (category) setSelectedShopCategory(category);
                    if (brand) setSelectedShopBrand(brand);
                    setCurrentPage(page as any);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>

              {/* 3. CATEGORIES SECTION WITH CAROUSEL */}
              <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 w-full">
            <div className="text-center mb-10 max-w-xl mx-auto">
              <span className={`text-xs font-extrabold uppercase tracking-widest ${currentTheme.text}`}>Top Collections</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">Product categories</h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-2 leading-relaxed">Explore our custom selected categories for top-tier collections.</p>
            </div>

            {/* Carousel Slider Horizontal scroll Wrapper */}
            <div className="relative group/carousel">
              {/* Left Arrow (Desktop only) */}
              <button 
                onClick={() => scrollCategories('left')}
                disabled={!categoriesCanScrollLeft}
                className={`hidden md:flex absolute -left-4 xl:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 items-center justify-center hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95 shadow-md cursor-pointer ${
                  !categoriesCanScrollLeft ? 'opacity-30 cursor-not-allowed hover:bg-white hover:text-slate-700' : 'opacity-100'
                }`}
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Carousel Slider Horizontal scroll */}
              <div 
                ref={categoriesScrollRef}
                onScroll={updateCategoriesScrollState}
                onMouseDown={handleCategoriesMouseDown}
                onMouseLeave={handleCategoriesMouseLeave}
                onMouseUp={handleCategoriesMouseUp}
                onMouseMove={handleCategoriesMouseMove}
                className="w-full overflow-x-auto scrollbar-none py-3 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
              >
                <div className="grid grid-flow-col auto-cols-[calc((100%-2*0.75rem)/3)] sm:auto-cols-[calc((100%-3*1rem)/4)] md:auto-cols-[calc((100%-4*1rem)/5)] lg:auto-cols-[calc((100%-5*1.25rem)/6)] xl:auto-cols-[calc((100%-7*1.25rem)/8)] gap-3 sm:gap-4 lg:gap-5 w-full">
                  {categories.map((cat) => {
                    return (
                      <div 
                        key={cat.id}
                        onClick={() => {
                          if (categoriesDragState.current.moved) return;
                          setSelectedCategoryName(cat.name);
                          setCurrentPage('category-detail');
                        }}
                        className="snap-start snap-always w-full flex flex-col items-center cursor-pointer group transition-all duration-300"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-slate-100 border-2 border-transparent flex items-center justify-center transition-all duration-300 shadow-xs group-hover:scale-105 group-hover:shadow-md group-hover:border-blue-600">
                          <SafeImage 
                            src={cat.imageUrl} 
                            alt={cat.name} 
                            placeholderType="category"
                            fallbackTitle={cat.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight text-center mt-3 truncate max-w-full px-1 group-hover:text-blue-600 transition">{cat.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Arrow (Desktop only) */}
              <button 
                onClick={() => scrollCategories('right')}
                disabled={!categoriesCanScrollRight}
                className={`hidden md:flex absolute -right-4 xl:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 items-center justify-center hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95 shadow-md cursor-pointer ${
                  !categoriesCanScrollRight ? 'opacity-30 cursor-not-allowed hover:bg-white hover:text-slate-700' : 'opacity-100'
                }`}
                aria-label="Scroll categories right"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Page Indicators (if multiple pages exist) */}
            {totalCategoriesPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                {Array.from({ length: totalCategoriesPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (categoriesScrollRef.current) {
                        categoriesScrollRef.current.scrollTo({
                          left: idx * categoriesScrollRef.current.clientWidth,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === categoriesPage
                        ? 'w-6 bg-blue-600'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Go to category slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </section>

          {/* PROMOTIONAL BANNERS GRID */}
          <PromoBannersGrid 
            themeColor={themeColor} 
            getThemeClasses={getThemeClasses} 
            onSelectCategory={(cat) => {
              setSelectedCategoryName(cat);
              setCurrentPage('category-detail');
            }} 
            onNavigateShop={() => {
              setSelectedShopCategory('All');
              setSelectedShopBrand('All');
              setCurrentPage('shop');
            }} 
          />

          {/* FLASH DEALS COUNTDOWN SECTION */}
          <FlashDealsSection
            products={products}
            themeColor={themeColor}
            getThemeClasses={getThemeClasses}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setCurrentPage('product-detail');
            }}
            onQuickView={handleOpenQuickView}
          />

          {/* BESTSELLERS TABBED SECTION */}
          <BestsellersTabSection
            products={products}
            themeColor={themeColor}
            getThemeClasses={getThemeClasses}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={(productId) => {
              setSelectedProductId(productId);
              setCurrentPage('product-detail');
            }}
            onQuickView={handleOpenQuickView}
            onNavigateShop={() => {
              setSelectedShopCategory('All');
              setSelectedShopBrand('All');
              setCurrentPage('shop');
            }}
          />

          {/* DYNAMIC CATEGORY PRODUCT CAROUSEL */}
          <CategoryProductCarousel
            categories={categories}
            products={products}
            themeColor={themeColor}
            getThemeClasses={getThemeClasses}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={(productId) => {
              setSelectedProductId(productId);
              setCurrentPage('product-detail');
            }}
            onQuickView={handleOpenQuickView}
            onViewMoreCategory={(categoryName) => {
              setSelectedCategoryName(categoryName);
              setCurrentPage('category-detail');
            }}
          />

          {/* NEW ELECTRONICS & HIGH-TECH SHOWCASE CAROUSEL WITH MINI BANNER & PAGINATION */}
          <TechElectronicsShowcase
            products={products}
            categories={categories}
            themeColor={themeColor}
            getThemeClasses={getThemeClasses}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={(productId) => {
              setSelectedProductId(productId);
              setCurrentPage('product-detail');
            }}
            onQuickView={handleOpenQuickView}
            onViewCategory={(categoryName) => {
              setSelectedCategoryName(categoryName);
              setCurrentPage('category-detail');
            }}
          />

          {/* CUSTOMER REVIEWS & TESTIMONIALS */}
          <TestimonialsSection themeColor={themeColor} getThemeClasses={getThemeClasses} />

          {/* RECENTLY VIEWED PRODUCTS STRIP (COPIED FROM PRODUCT PAGE) */}
          {recentlyViewedIds.length > 0 && (() => {
            const recentProds = recentlyViewedIds
              .map((id: string) => products.find((p) => p.id === id))
              .filter((p): p is MockWooProduct => Boolean(p))
              .slice(0, 10);
            if (recentProds.length === 0) return null;

            return (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                      Recently Viewed Items
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 mr-1">{recentProds.length} {recentProds.length === 1 ? 'item' : 'items'}</span>
                      <button
                        onClick={() => {
                          if (recentlyViewedScrollRef.current) {
                            recentlyViewedScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition cursor-pointer active:scale-95"
                        aria-label="Scroll left"
                        title="Scroll Left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (recentlyViewedScrollRef.current) {
                            recentlyViewedScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition cursor-pointer active:scale-95"
                        aria-label="Scroll right"
                        title="Scroll Right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div 
                    ref={recentlyViewedScrollRef}
                    className="flex items-stretch gap-3.5 overflow-x-auto scrollbar-none py-1 scroll-smooth snap-x snap-mandatory"
                  >
                    {recentProds.map((rp) => (
                      <a
                        key={rp.id}
                        href={getProductUrl(rp.id, rp.name)}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedProductId(rp.id);
                          setCurrentPage('product-detail');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="group bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-3 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between w-44 sm:w-52 shrink-0 snap-start snap-always block no-underline"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-white mb-2 border border-slate-100">
                          <SafeImage
                            src={rp.imageUrl}
                            alt={rp.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            placeholderType="product"
                            fallbackTitle={rp.name}
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">{rp.name}</h4>
                          <p className="text-xs font-extrabold text-slate-700 mt-0.5">{rp.price}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            );
          })()}

          {/* 5. BRANDS CAROUSEL SECTION */}
          <section id="brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 w-full">
            {/* Outer Boxed Card Wrapper */}
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-xs relative">
              
              {/* Isolated Background Glow Container */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl sm:rounded-3xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl -ml-16 -mb-16" />
              </div>

              {/* Section Header */}
              <div className="relative z-10 flex items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900 select-text">
                  Explore brands
                </h2>

                {/* Carousel Navigation Buttons & View all */}
                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => { setSelectedShopCategory('All'); setSelectedShopBrand('All'); setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-1 mr-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => scrollBrands('left')}
                      className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white transition active:scale-95 shadow-2xs cursor-pointer shrink-0"
                      aria-label="Scroll brands left"
                      title="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button 
                      onClick={() => scrollBrands('right')}
                      className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white transition active:scale-95 shadow-2xs cursor-pointer shrink-0"
                      aria-label="Scroll brands right"
                      title="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Brands Carousel Track */}
              <div className="relative z-10 pt-4 sm:pt-5">
                <div 
                  ref={brandsScrollRef}
                  onMouseDown={handleBrandsMouseDown}
                  onMouseLeave={handleBrandsMouseLeave}
                  onMouseUp={handleBrandsMouseUp}
                  onMouseMove={handleBrandsMouseMove}
                  className="w-full overflow-x-auto scrollbar-none py-2 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
                >
                  <div className="flex gap-3 sm:gap-4 items-center min-w-full">
                    {brands.map((brand) => {
                      let decodedSvg: string | null = null;
                      if (brand.imageUrl && brand.imageUrl.startsWith('data:image/svg+xml')) {
                        try {
                          const commaIndex = brand.imageUrl.indexOf(',');
                          if (commaIndex !== -1) {
                            const baseData = brand.imageUrl.substring(commaIndex + 1);
                            decodedSvg = decodeURIComponent(baseData);
                          }
                        } catch(e) {}
                      }

                      return (
                        <div 
                          key={brand.id}
                          onClick={() => {
                            showToast(`Filtering storefront by partner: ${brand.name}`);
                            setSelectedShopBrand(brand.name);
                            setSelectedShopCategory('All');
                            setCurrentPage('shop');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="snap-center shrink-0 w-36 sm:w-44 h-20 sm:h-24 bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center p-3 sm:p-4 hover:border-slate-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-2xs cursor-pointer group/brand relative overflow-hidden"
                          title={`Explore ${brand.name} Collection`}
                        >
                          {/* Top accent bar on hover */}
                          <div className={`absolute top-0 inset-x-0 h-1 ${currentTheme.badge} opacity-0 group-hover/brand:opacity-100 transition-opacity duration-300`} />
                          
                          {decodedSvg ? (
                            <div className={`w-full h-9 sm:h-11 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto text-slate-700 group-hover/brand:${currentTheme.text} transition-colors duration-300`} dangerouslySetInnerHTML={{ __html: decodedSvg }} />
                          ) : brand.imageUrl ? (
                            <SafeImage src={brand.imageUrl} alt={brand.name} placeholderType="brand" fallbackTitle={brand.name} className="max-h-9 sm:max-h-11 w-auto object-contain group-hover/brand:scale-105 transition-transform duration-300" />
                          ) : (
                            <span className={`font-extrabold text-sm sm:text-base tracking-wide text-slate-800 group-hover/brand:${currentTheme.text} transition-colors`}>{brand.name}</span>
                          )}
                          <span className="text-[10px] font-semibold text-slate-400 group-hover/brand:text-slate-700 transition mt-1 truncate max-w-full">
                            {brand.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* VIP CLUB NEWSLETTER SIGNUP */}
          <NewsletterSection 
            themeColor={themeColor} 
            getThemeClasses={getThemeClasses} 
            showToast={showToast} 
          />
        </div>
      ) : currentPage === 'categories' ? (
        <CategoriesPage 
          themeColor={themeColor} 
          getThemeClasses={getThemeClasses} 
          categories={categories} 
          products={products}
          onSelectCategory={(catName) => {
            setSelectedCategoryName(catName);
            setCurrentPage('category-detail');
          }}
          onNavigate={(page) => setCurrentPage(page as any)}
        />
      ) : currentPage === 'shop' ? (
        <ShopPage 
          themeColor={themeColor} 
          getThemeClasses={getThemeClasses} 
          products={products} 
          categories={categories}
          brands={brands}
          wishlist={wishlist} 
          handleToggleWishlist={handleToggleWishlist} 
          handleAddToCart={handleAddToCart} 
          initialCategoryFilter={selectedShopCategory} 
          initialBrandFilter={selectedShopBrand}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            setCurrentPage('product-detail');
          }}
          onQuickView={handleOpenQuickView}
          onNavigate={(page) => setCurrentPage(page as any)}
        />
      ) : currentPage === 'account' ? (
        <MyAccountPage 
          themeColor={themeColor} 
          getThemeClasses={getThemeClasses} 
          wishlist={wishlist} 
          wishlistProducts={products.filter(p => wishlist.includes(p.id))} 
          handleToggleWishlist={handleToggleWishlist} 
          handleAddToCart={handleAddToCart} 
          showToast={showToast} 
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onOpenAuth={() => setAuthModalOpen(true)}
          onNavigate={(page) => setCurrentPage(page as any)}
          customWishlists={customWishlists}
          onCreateWishlist={handleCreateWishlist}
          onDeleteWishlist={handleDeleteWishlist}
          onRenameWishlist={handleRenameWishlist}
          onToggleProductInLists={handleToggleProductInLists}
          onResetDefaultWishlists={handleResetDefaultWishlists}
          allProducts={products}
        />
      ) : currentPage === 'admin' ? (
        <AdminPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page) => setCurrentPage(page as any)}
          showToast={showToast}
          currentUser={currentUser}
          onOpenSeoInspector={() => setSeoModalOpen(true)}
          onOpenExportNextjs={() => setNextjsModalOpen(true)}
          freeShippingThreshold={freeShippingThreshold}
          onUpdateFreeShippingThreshold={(val) => setFreeShippingThreshold(val)}
          logoText={logoText}
          onUpdateLogoText={(txt) => setLogoText(txt)}
          products={products}
          categories={categories}
          brands={brands}
          productsSettings={productsSettings}
          onUpdateProductsSettings={(settings) => setProductsSettings(settings)}
          onUpdateProducts={(newProds) => setProducts(newProds)}
          onUpdateCategories={(newCats) => setCategories(newCats)}
          onUpdateBrands={(newBrands) => setBrands(newBrands)}
        />
      ) : currentPage === 'product-detail' && selectedProductId ? (

        <ProductDetailPage
          productId={selectedProductId}
          products={products}
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          wishlist={wishlist}
          customWishlists={customWishlists}
          handleToggleWishlist={handleToggleWishlist}
          onToggleProductInLists={handleToggleProductInLists}
          onCreateWishlist={handleCreateWishlist}
          handleAddToCart={handleAddToCart}
          onBuyNow={() => {
            setCurrentPage('cart');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBack={() => {
            setCurrentPage('shop');
          }}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            setCurrentPage('product-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSearch={(query) => handlePerformSearch(query)}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      ) : currentPage === 'category-detail' && selectedCategoryName ? (
        <CategoryDetailPage
          categoryName={selectedCategoryName}
          categories={categories}
          products={products}
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          wishlist={wishlist}
          handleToggleWishlist={handleToggleWishlist}
          handleAddToCart={handleAddToCart}
          onBack={() => {
            setCurrentPage('categories');
          }}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            setCurrentPage('product-detail');
          }}
          onQuickView={handleOpenQuickView}
          onSelectCategory={(cat) => setSelectedCategoryName(cat)}
        />
      ) : currentPage === 'search-results' ? (
        <SearchResultsPage
          searchQuery={searchQuery}
          onSearchQueryChange={(q) => setSearchQuery(q)}
          products={products}
          categories={categories}
          wishlist={wishlist}
          handleToggleWishlist={handleToggleWishlist}
          handleAddToCart={handleAddToCart}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            setCurrentPage('product-detail');
          }}
          onSelectCategory={(catName) => {
            setSelectedCategoryName(catName);
            setCurrentPage('category-detail');
          }}
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onQuickView={handleOpenQuickView}
          onBackToHome={() => handleNavigatePage('home')}
        />
      ) : currentPage === 'privacy-policy' ? (
        <PrivacyPolicyPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page) => setCurrentPage(page as any)}
          showToast={showToast}
          logoText={logoText}
        />
      ) : currentPage === 'returns-policy' ? (
        <ReturnsPolicyPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page) => setCurrentPage(page as any)}
          showToast={showToast}
          logoText={logoText}
        />
      ) : currentPage === 'terms-and-conditions' ? (
        <TermsAndConditionsPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page) => setCurrentPage(page as any)}
          showToast={showToast}
          logoText={logoText}
        />
      ) : currentPage === 'seller-policy' ? (
        <MarketplaceSellerPolicyPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page) => setCurrentPage(page as any)}
          showToast={showToast}
          logoText={logoText}
        />
      ) : currentPage === 'faq' ? (
        <FaqPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page) => setCurrentPage(page as any)}
          showToast={showToast}
          logoText={logoText}
        />
      ) : currentPage === 'about' ? (
        <AboutPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page) => setCurrentPage(page as any)}
          showToast={showToast}
          logoText={logoText}
        />
      ) : currentPage === 'contact' ? (
        <ContactPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page) => setCurrentPage(page as any)}
          showToast={showToast}
          logoText={logoText}
        />
      ) : currentPage === 'order-tracking' ? (
        <OrderTrackingPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page) => setCurrentPage(page as any)}
          showToast={showToast}
          currentUser={currentUser}
        />
      ) : currentPage === 'wishlist' ? (
        <WishlistPage
          wishlist={wishlist}
          customWishlists={customWishlists}
          products={products}
          onToggleWishlist={handleToggleWishlist}
          onToggleProductInLists={handleToggleProductInLists}
          onCreateWishlist={handleCreateWishlist}
          onDeleteWishlist={handleDeleteWishlist}
          onRenameWishlist={handleRenameWishlist}
          onAddToCart={handleAddToCart}
          onNavigate={(page, params) => {
            if (page === 'product-detail' && params?.id) {
              setSelectedProductId(params.id);
            }
            setCurrentPage(page as any);
          }}
          onClearWishlist={() => {
            setCustomWishlists(prev => prev.map(l => ({ ...l, productIds: [] })));
            showToast('Wishlist cleared.');
          }}
          onAddAllToCart={() => {
            const wishlistedProds = products.filter(p => wishlist.includes(p.id));
            wishlistedProds.forEach(p => handleAddToCart(p));
            showToast(`Added ${wishlistedProds.length} items to your shopping cart!`);
          }}
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          showToast={showToast}
          onQuickView={handleOpenQuickView}
        />
      ) : currentPage === 'cart' ? (
        <CartPage
          cart={cart}
          onAdjustQuantity={handleAdjustQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={() => setCart([])}
          onNavigate={(page, params) => {
            if (page === 'product-detail' && params?.id) {
              setSelectedProductId(params.id);
            }
            setCurrentPage(page as any);
          }}
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          showToast={showToast}
          currentUser={currentUser}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          freeShippingThreshold={freeShippingThreshold}
        />
      ) : currentPage === 'checkout' ? (
        <CheckoutPage
          cart={cart}
          onClearCart={() => setCart([])}
          onNavigate={(page, params) => {
            if (page === 'product-detail' && params?.id) {
              setSelectedProductId(params.id);
            }
            setCurrentPage(page as any);
          }}
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          showToast={showToast}
          currentUser={currentUser}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          freeShippingThreshold={freeShippingThreshold}
        />
      ) : (
        <NotFoundPage
          themeColor={themeColor}
          getThemeClasses={getThemeClasses}
          onNavigate={(page, params) => {
            if (page === 'product-detail' && params?.id) {
              setSelectedProductId(params.id);
            } else if (page === 'category-detail' && params?.name) {
              setSelectedCategoryName(params.name);
            } else if (page === 'search-results' && params?.q) {
              setSearchQuery(params.q);
            }
            setCurrentPage(page as any);
          }}
          showToast={showToast}
          logoText={logoText}
          products={products}
          categories={categories}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onQuickView={handleOpenQuickView}
        />
      )}

      {/* FOOTER SECTION */}
      <footer className="bg-white text-slate-800 mt-auto border-t border-slate-200/90 relative overflow-hidden">
        {/* Dynamic Theme Accent Top Glow Bar */}
        <div className={`h-1 w-full ${currentTheme.bg}`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          
          {/* Top Features / Value Props Horizontal Carousel */}
          <FooterTrustCarousel 
            freeShippingThreshold={freeShippingThreshold}
            themeColor={themeColor}
            currentTheme={currentTheme}
          />

          {/* Main Footer Links Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pb-8">
            
            {/* Store Name & Description Card */}
            <div className="lg:col-span-4 bg-white border border-slate-200/90 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${currentTheme.bg} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                    {logoText.charAt(0)}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{logoText}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Your destination for premium lifestyle goods, smart electronics, and curated designer essentials. Quality guaranteed.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-semibold border-t border-slate-100">
                <ShieldCheck className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                <span>Verified Authentic &amp; Secure Checkout</span>
              </div>
            </div>

            {/* Structured Page Navigation Links Grid Card (8 cols width) */}
            <div className="lg:col-span-8 bg-white border border-slate-200/90 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              
                {/* 1. Shopping */}
                <div className="space-y-3">
                  <h4 className={`text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5`}>
                    <ShoppingCart className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                    <span>Shopping</span>
                  </h4>
                  <ul className="space-y-2 text-xs font-semibold text-slate-600">
                    <li>
                      <a 
                        href="/"
                        onClick={(e) => { e.preventDefault(); setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/shop"
                        onClick={(e) => { e.preventDefault(); setSelectedShopCategory('All'); setSelectedShopBrand('All'); setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        Shop
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/categories"
                        onClick={(e) => { e.preventDefault(); setCurrentPage('categories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        Category Page
                      </a>
                    </li>
                  </ul>
                </div>

                {/* 2. User */}
                <div className="space-y-3">
                  <h4 className={`text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5`}>
                    <User className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                    <span>User</span>
                  </h4>
                  <ul className="space-y-2 text-xs font-semibold text-slate-600">
                    <li>
                      <a 
                        href="/account"
                        onClick={(e) => { 
                          e.preventDefault();
                          if (!currentUser) { setAuthModalOpen(true); } else { setCurrentPage('account'); } 
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        My Account
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/wishlist"
                        onClick={(e) => { e.preventDefault(); setCurrentPage('wishlist'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left flex items-center justify-between w-full py-0.5 hover:translate-x-1 transform duration-200 group"
                      >
                        <span className="group-hover:text-slate-900">Wishlist</span>
                        {wishlist.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black border border-rose-200">
                            {wishlist.length}
                          </span>
                        )}
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/order-tracking"
                        onClick={(e) => { 
                          e.preventDefault();
                          if (!currentUser) { 
                            setAuthModalOpen(true); 
                            showToast("Please sign in to track your order."); 
                          } else { 
                            setCurrentPage('order-tracking'); 
                          } 
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        Track Order
                      </a>
                    </li>
                  </ul>
                </div>

                {/* 3. Company */}
                <div className="space-y-3">
                  <h4 className={`text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5`}>
                    <Building2 className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                    <span>Company</span>
                  </h4>
                  <ul className="space-y-2 text-xs font-semibold text-slate-600">
                    <li>
                      <a 
                        href="/about"
                        onClick={(e) => { e.preventDefault(); setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/contact"
                        onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        Contact
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/faq"
                        onClick={(e) => { e.preventDefault(); setCurrentPage('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>

                {/* 4. Policies */}
                <div className="space-y-3">
                  <h4 className={`text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5`}>
                    <ShieldCheck className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                    <span>Policies</span>
                  </h4>
                  <ul className="space-y-2 text-xs font-semibold text-slate-600">
                    <li>
                      <a 
                        href="/privacy-policy"
                        onClick={(e) => { e.preventDefault(); setCurrentPage('privacy-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/terms-and-conditions"
                        onClick={(e) => { e.preventDefault(); setCurrentPage('terms-and-conditions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        Terms &amp; Conditions
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/returns-policy"
                        onClick={(e) => { e.preventDefault(); setCurrentPage('returns-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="hover:text-slate-900 transition cursor-pointer text-left block py-0.5 hover:translate-x-1 transform duration-200"
                      >
                        Returns &amp; Refund Policy
                      </a>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>

          {/* Newsletter Subscription Row (Responsive: stacked on mobile, text left / form right on larger screens) */}
          <div className="pb-10 border-b border-slate-200/90">
            <div className="bg-white border border-slate-200/90 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-8">
              {/* Left side: Heading and description text */}
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2 text-slate-900">
                  <Mail className={`w-4 h-4 ${currentTheme.text}`} />
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">Join Store Newsletter</h4>
                </div>
                <p className="text-xs text-slate-500 leading-normal font-medium">
                  Subscribe for exclusive discounts, new arrivals, and special member updates.
                </p>
              </div>

              {/* Right side: Input field & Subscribe button */}
              <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto lg:min-w-[420px] shrink-0">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white w-full placeholder:text-slate-400 font-medium" 
                  required
                />
                <button 
                  type="submit" 
                  className={`px-5 py-2.5 ${currentTheme.bg} hover:brightness-110 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md active:scale-95`}
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Copyright & Security Line */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div>
              © {new Date().getFullYear()} <strong className="text-slate-900 font-bold">{logoText}</strong>. All rights reserved.
            </div>

            {/* Payment Method Badges */}
            <div className="flex items-center gap-2">
              {['Visa', 'Mastercard', 'Apple Pay', 'PayPal', 'EFT'].map((pay) => (
                <span 
                  key={pay} 
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-extrabold text-slate-700 shadow-2xs tracking-tight"
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>

        </div>
      </footer>



      {/* 8. SHOPPING CART DRAWED PANEL SLIDE OUT (SLIDES FROM THE RIGHT) */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop Overlay with dynamic blurring */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 pointer-events-auto"
              onClick={() => setCartOpen(false)}
              onTouchMove={(e) => e.preventDefault()}
            />

            <motion.div 
              initial={{ x: '100%', opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 flex flex-col justify-between"
            >
              {/* Cart Drawer Header */}
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${currentTheme.lightBg} ${currentTheme.text}`}>
                    <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
                      <span>Shopping Cart</span>
                      {cart.length > 0 && (
                        <span className={`px-2 py-0.5 rounded-full ${currentTheme.badge} text-white text-[10px] font-black`}>
                          {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
                        </span>
                      )}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Quick order review</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Slim Bar */}
              {cart.length > 0 && (
                <div className="bg-emerald-50/80 border-b border-emerald-100/80 px-5 py-2 flex items-center justify-between gap-3 shrink-0 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0 font-semibold text-emerald-900">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {cartSubtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-700 font-extrabold text-[11px] truncate">🎉 Free Shipping Unlocked!</span>
                    ) : (
                      <span className="text-[11px] text-slate-700 truncate">
                        Add <strong className="text-blue-600 font-extrabold">{formatCurrency(freeShippingThreshold - cartSubtotal)}</strong> for <strong className="text-emerald-600 font-bold">FREE Shipping</strong>
                      </span>
                    )}
                  </div>
                  <div className="w-20 bg-emerald-200/70 rounded-full h-1.5 overflow-hidden shrink-0">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center select-none">
                    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
                      <ShoppingCart className="w-7 h-7" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">Your shopping cart is empty</h4>
                    <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-normal">Browse our catalog to discover luxury products!</p>
                    <button 
                      onClick={() => setCartOpen(false)} 
                      className="mt-3 px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition cursor-pointer"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  cart.map((item) => {
                    const catalogProd = products.find((p) => p.id === item.id);
                    const unitPrice = getCartItemUnitPrice(item, catalogProd, productsSettings);
                    const minWholesaleQty = item.minWholesaleQuantity || catalogProd?.minWholesaleQuantity || productsSettings?.minWholesaleQuantity || 6;
                    const isWholesaleActive = item.quantity >= minWholesaleQty;

                    return (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-3 bg-slate-50/70 hover:bg-slate-50 p-2.5 border border-slate-200/70 rounded-xl relative group transition"
                      >
                        <SafeImage src={item.imageUrl} className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-white shrink-0" alt={item.name} placeholderType="product" fallbackTitle={item.name} />
                        
                        <div className="flex-1 min-w-0 pr-5">
                          <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{item.name}</h4>

                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-extrabold text-slate-900 font-mono">
                              {formatCurrency(unitPrice * item.quantity)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">({formatCurrency(unitPrice)} ea)</span>
                            {isWholesaleActive && (
                              <span className="text-[8px] font-extrabold text-blue-700 bg-blue-50 px-1 py-0.2 rounded border border-blue-200 uppercase">
                                Wholesale
                              </span>
                            )}
                          </div>

                          {/* Quantity Counter */}
                          <div className="flex items-center space-x-2 mt-1.5">
                            <button 
                              onClick={() => handleAdjustQuantity(item.id, -1)}
                              className="w-5.5 h-5.5 rounded-md bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-xs font-bold transition select-none active:scale-95 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-extrabold text-slate-800 font-mono w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleAdjustQuantity(item.id, 1)}
                              className="w-5.5 h-5.5 rounded-md bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-xs font-bold transition select-none active:scale-95 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Remove item button */}
                        <button 
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="absolute right-2.5 top-2.5 p-1 text-slate-300 hover:text-rose-500 rounded-md hover:bg-white transition cursor-pointer"
                          title="Remove Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Compact Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-slate-200/80 px-5 py-3.5 bg-slate-50 shrink-0 space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">Subtotal</span>
                    <span className="font-mono text-base font-extrabold text-slate-900">{formatCurrency(cartSubtotal)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setCartOpen(false);
                        setCurrentPage('cart');
                      }}
                      className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-2.5 rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer text-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
                      <span>View Cart</span>
                    </button>

                    <button 
                      onClick={() => {
                        if (cart.length === 0) {
                          showToast("Your cart is empty. Add items to checkout!");
                          return;
                        }
                        setCartOpen(false);
                        setCurrentPage('checkout');
                      }}
                      className={`w-full ${currentTheme.bg} hover:opacity-95 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md ${currentTheme.shadow} active:scale-95 transition cursor-pointer text-xs`}
                    >
                      <span>Checkout &rarr;</span>
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 9. INTERACTIVE FEEDBACK NOTIFICATION BANNER TOASTS */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* 10. AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignIn={handleSignIn}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        showToast={showToast}
      />

      {/* 11. NEXT.JS 15 CODE BASE EXPORTER MODAL */}
      <NextjsExporterModal
        isOpen={nextjsModalOpen}
        onClose={() => setNextjsModalOpen(false)}
        showToast={showToast}
        storeName={logoText}
      />

      {/* 12. NEXT.JS 15 SEO INSPECTOR MODAL */}
      <SEOInspectorModal
        isOpen={seoModalOpen}
        onClose={() => setSeoModalOpen(false)}
        showToast={showToast}
        storeName={logoText}
      />

      {/* 14. PRODUCT QUICK VIEW MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onAddToCart={(prod, qty) => {
          for (let i = 0; i < (qty || 1); i++) {
            handleAddToCart({ id: prod.id, name: prod.name, price: prod.price, imageUrl: prod.imageUrl });
          }
        }}
        onToggleWishlist={(id, name) => handleToggleWishlist(id, name)}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onViewFullDetails={(id) => {
          setSelectedProductId(id);
          setCurrentPage('product-detail');
        }}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
      />

      {/* 15. AI SHOPPING CONCIERGE MODAL */}
      <AiConciergeModal
        isOpen={aiConciergeOpen}
        onClose={() => setAiConciergeOpen(false)}
        catalogProducts={products}
        cartItems={cart}
        onSelectProduct={(prod) => {
          setSelectedProductId(prod.id);
          setCurrentPage('product-detail');
        }}
        onAddToCart={(prod) => {
          handleAddToCart({ id: prod.id, name: prod.name, price: prod.price, imageUrl: prod.imageUrl });
        }}
        currentThemeBg={currentTheme.bg}
      />

    </div>
  );
}

