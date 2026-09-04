'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  MockWooProduct,
  MockCategory,
  MockBrand,
  SlideConfig,
  SliderSettings,
  CategoryCarouselSettings,
  BrandCarouselSettings,
  UserProfile,
  CartItem,
  CustomWishlist,
  ProductsSettings,
  VendorApplication,
  SellerAccount,
  VendorOffer,
  ProductCondition,
  VendorProductSubmission,
  ProductSubmissionStatus
} from '../types';
import {
  MOCK_WOO_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_BRANDS,
  DEFAULT_SLIDES,
  MockCategoryPreset,
  MockBrandPreset,
  INITIAL_VENDOR_APPLICATIONS,
  INITIAL_SELLER_ACCOUNTS,
  INITIAL_PRODUCT_SUBMISSIONS,
  MOCK_USERS
} from '../data/presets';
import { ToastMessage } from '../components/ui/Toast';
import { initGTM, trackViewItem, trackAddToCart, trackBeginCheckout } from '../utils/gtm';
import { getProductPrices, getCartItemUnitPrice, parsePriceNumber } from '../utils/pricing';
import { slugify, deslugify, getProductUrl, getCategoryUrl, getBrandUrl, getShopUrl } from '../utils/seoUtils';

export interface ThemeClasses {
  bg: string;
  text: string;
  border: string;
  lightBg: string;
  badge: string;
  accent: string;
  primaryHex: string;
  shadow: string;
  ring: string;
}

export interface StoreContextType {
  // Catalog & Content
  products: MockWooProduct[];
  setProducts: React.Dispatch<React.SetStateAction<MockWooProduct[]>>;
  categories: MockCategoryPreset[];
  setCategories: React.Dispatch<React.SetStateAction<MockCategoryPreset[]>>;
  brands: MockBrandPreset[];
  setBrands: React.Dispatch<React.SetStateAction<MockBrandPreset[]>>;
  slides: SlideConfig[];
  setSlides: React.Dispatch<React.SetStateAction<SlideConfig[]>>;
  sliderSettings: SliderSettings;
  setSliderSettings: React.Dispatch<React.SetStateAction<SliderSettings>>;
  categorySettings: CategoryCarouselSettings;
  setCategorySettings: React.Dispatch<React.SetStateAction<CategoryCarouselSettings>>;
  brandSettings: BrandCarouselSettings;
  setBrandSettings: React.Dispatch<React.SetStateAction<BrandCarouselSettings>>;

  // Store Settings & Branding
  logoText: string;
  setLogoText: (name: string) => void;
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  setThemeColor: (color: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate') => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  toggleDarkMode: () => void;
  freeShippingThreshold: number;
  setFreeShippingThreshold: (val: number) => void;
  productsSettings: ProductsSettings;
  setProductsSettings: React.Dispatch<React.SetStateAction<ProductsSettings>>;

  // Cart
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartCount: number;
  cartSubtotal: number;
  handleAddToCart: (product: any, qty?: number, selectedOffer?: VendorOffer) => void;
  onAddToCart: (product: any, qty?: number, selectedOffer?: VendorOffer) => void;
  handleAdjustQuantity: (id: string, delta: number) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  handleRemoveFromCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
  handleClearCart: () => void;
  onClearCart: () => void;

  // Wishlist
  customWishlists: CustomWishlist[];
  setCustomWishlists: React.Dispatch<React.SetStateAction<CustomWishlist[]>>;
  wishlist: string[];
  handleToggleWishlist: (id: string, name?: string) => void;
  onToggleWishlist: (id: string, name?: string) => void;
  handleToggleProductInLists: (productId: string, listIds: string[]) => void;
  onToggleProductInLists: (productId: string, listIds: string[]) => void;
  handleCreateWishlist: (name: string, description?: string, icon?: string) => CustomWishlist;
  onCreateWishlist: (name: string, description?: string, icon?: string) => CustomWishlist;
  handleDeleteWishlist: (listId: string) => void;
  onDeleteWishlist: (listId: string) => void;
  handleRenameWishlist: (listId: string, newName: string, newDesc?: string) => void;
  onRenameWishlist: (listId: string, newName: string, newDesc?: string) => void;
  handleResetDefaultWishlists: () => void;
  onResetDefaultWishlists: () => void;

  // Multi-Vendor Ecosystem
  vendorApplications: VendorApplication[];
  setVendorApplications: React.Dispatch<React.SetStateAction<VendorApplication[]>>;
  sellerAccounts: SellerAccount[];
  setSellerAccounts: React.Dispatch<React.SetStateAction<SellerAccount[]>>;
  productSubmissions: VendorProductSubmission[];
  setProductSubmissions: React.Dispatch<React.SetStateAction<VendorProductSubmission[]>>;
  handleApplyAsVendor: (data: Omit<VendorApplication, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; applicationId?: string; error?: string }>;
  handleApproveVendorApplication: (applicationId: string) => void;
  handleRejectVendorApplication: (applicationId: string, reason?: string) => void;
  handleToggleSellerStatus: (sellerId: string, status?: 'active' | 'suspended') => void;
  handleUpdateSellerProfile: (sellerId: string, updates: Partial<SellerAccount>) => void;
  handleCreateOrUpdateOffer: (productId: string, offer: Partial<VendorOffer> & { price: number; stockCount: number; condition: ProductCondition }) => void;
  handleDeleteOffer: (productId: string, offerId: string) => void;
  handleSubmitNewProduct: (submissionData: Omit<VendorProductSubmission, 'id' | 'status' | 'createdAt'>) => VendorProductSubmission;
  handleApproveProductSubmission: (submissionId: string) => void;
  handleRejectProductSubmission: (submissionId: string, reason?: string) => void;
  handleDeleteProductSubmission: (submissionId: string) => void;

  // User & Auth
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  handleSignIn: (user: UserProfile) => void;
  onSignIn: (user: UserProfile) => void;
  handleSignOut: () => void;
  onSignOut: () => void;
  handleSwitchUser: (userId: string) => void;
  onSwitchUser: (userId: string) => void;

  // Modals & Drawers
  quickViewProduct: MockWooProduct | null;
  quickViewOpen: boolean;
  handleOpenQuickView: (prod: MockWooProduct) => void;
  onOpenQuickView: (prod: MockWooProduct) => void;
  setQuickViewOpen: (open: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  aiConciergeOpen: boolean;
  setAiConciergeOpen: (open: boolean) => void;
  nextjsModalOpen: boolean;
  setNextjsModalOpen: (open: boolean) => void;
  seoModalOpen: boolean;
  setSeoModalOpen: (open: boolean) => void;

  // Customizer Panel
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
  activeEditorTab: 'settings' | 'codebase';
  setActiveEditorTab: (tab: 'settings' | 'codebase') => void;

  // Recently Viewed
  recentlyViewedIds: string[];
  setRecentlyViewedIds: React.Dispatch<React.SetStateAction<string[]>>;
  trackProductView: (productId: string) => void;

  // Search & Navigation
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handlePerformSearch: (queryToUse?: string) => void;
  navigateTo: (path: string) => void;

  // Notifications
  toasts: ToastMessage[];
  showToast: (messageOrTitle: string, type?: 'success' | 'error' | 'warning' | 'info', description?: string) => void;
  handleDismissToast: (id: string) => void;

  // Theme Helpers
  getThemeClasses: (color: string) => ThemeClasses;
  currentTheme: ThemeClasses;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function getThemeClasses(color: string): ThemeClasses {
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
        border: 'border-slate-300 focus:border-slate-600 focus:ring-slate-600/20',
        lightBg: 'bg-slate-100 text-slate-900',
        badge: 'bg-slate-800',
        accent: 'slate',
        primaryHex: '#1e293b',
        shadow: 'shadow-slate-500/25',
        ring: 'focus:ring-slate-500/30'
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
}

// Helper function to generate a unique random numeric merchant ID (6-digit)
export function generateRandomMerchantId(existingIds: string[] = []): string {
  let id: string;
  let attempts = 0;
  do {
    id = String(Math.floor(100000 + Math.random() * 900000));
    attempts++;
  } while (existingIds.includes(id) && attempts < 100);
  return id;
}

const OLD_SELLER_ID_MAP: Record<string, string> = {
  'sel-01': '849201',
  'sel-02': '592834',
  'sel-03': '710492',
  'sel-04': '385920',
  'sel-05': '924183',
  'sel-06': '461952',
  'sel-07': '638205'
};

const sanitizeMerchantId = (id?: string): string => {
  if (!id) return generateRandomMerchantId();
  if (OLD_SELLER_ID_MAP[id]) return OLD_SELLER_ID_MAP[id];
  if (id.startsWith('sel-')) return generateRandomMerchantId();
  return id;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLoadedRef = useRef<boolean>(false);

  // Storefront Branding and Customizer Settings State
  const [logoText, setLogoText] = useState<string>("Mrbulk");
  const [themeColor, setThemeColor] = useState<'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate'>('blue');
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(1000);

  const setDarkMode = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setDarkModeState((prev) => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      try {
        if (typeof document !== 'undefined') {
          // Add transition suppression class to prevent white line border flashes
          document.documentElement.classList.add('disable-transitions');
          
          if (nextVal) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
            document.body?.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
            document.body?.classList.remove('dark');
          }

          // Force reflow
          if (document.body) {
            void window.getComputedStyle(document.body).opacity;
          }

          // Re-enable transitions smoothly after React renders and paints
          setTimeout(() => {
            document.documentElement.classList.remove('disable-transitions');
          }, 80);
        }
        localStorage.setItem('luxestore_dark_mode', nextVal ? 'true' : 'false');
      } catch (e) {}
      return nextVal;
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, [setDarkMode]);
  const [productsSettings, setProductsSettings] = useState<ProductsSettings>({
    globalRetailMarkup: 50,
    globalWholesalePrice: 20,
    minWholesaleQuantity: 6
  });

  // Dynamic Product, Category & Brand Catalog State
  const [products, setProducts] = useState<MockWooProduct[]>(MOCK_WOO_PRODUCTS);
  const [categories, setCategories] = useState<MockCategoryPreset[]>(MOCK_CATEGORIES);
  const [brands, setBrands] = useState<MockBrandPreset[]>(MOCK_BRANDS);
  const [slides, setSlides] = useState<SlideConfig[]>(DEFAULT_SLIDES);

  const [sliderSettings, setSliderSettings] = useState<SliderSettings>({
    height: '600px',
    autoplay: true,
    autoplaySpeed: 5000,
    dotStyle: 'expand',
    dotColor: '#ffffff',
    activeDotColor: '#2563eb',
    arrowStyle: 'rounded',
    arrowColor: '#ffffff',
    textColor: 'light',
    bannerType: 'advanced'
  });

  const [categorySettings, setCategorySettings] = useState<CategoryCarouselSettings>({
    showCategories: true,
    showTitle: true,
    title: 'Explore Categories',
    subtitle: 'Browse our curated product catalog by department',
    count: 12,
    hoverEffect: 'zoom',
    titleColor: '#0f172a',
    labelColor: '#1e293b',
    columnsDesktop: 6,
    useFirstAsSale: true,
    displayStyle: 'both'
  });

  const [brandSettings, setBrandSettings] = useState<BrandCarouselSettings>({
    showBrands: true,
    showTitle: true,
    title: 'Featured Premium Brands',
    subtitle: 'Discover authentic collections from world-renowned partner brands',
    count: 6,
    hoverEffect: 'zoom',
    titleColor: '#0f172a',
    columnsDesktop: 6,
    cardShape: 'squircle'
  });

  // Authentication State
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Multi-Vendor Ecosystem State
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(INITIAL_VENDOR_APPLICATIONS);
  const [sellerAccounts, setSellerAccounts] = useState<SellerAccount[]>(INITIAL_SELLER_ACCOUNTS);
  const [productSubmissions, setProductSubmissions] = useState<VendorProductSubmission[]>(INITIAL_PRODUCT_SUBMISSIONS);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customWishlists, setCustomWishlists] = useState<CustomWishlist[]>([]);
  const wishlist: string[] = Array.from(new Set(customWishlists.flatMap((l) => l.productIds)));

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<MockWooProduct | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [aiConciergeOpen, setAiConciergeOpen] = useState<boolean>(false);
  const [nextjsModalOpen, setNextjsModalOpen] = useState<boolean>(false);
  const [seoModalOpen, setSeoModalOpen] = useState<boolean>(false);

  // Customizer Panel
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'settings' | 'codebase'>('settings');

  // Recently Viewed & Search
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast Notifications
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
    setToasts((prev) => [...prev.slice(-4), newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper: load cart for user
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
    } catch (e) {}
    return [];
  };

  // Helper: load wishlists for user
  const loadUserCustomWishlists = (user: UserProfile | null): CustomWishlist[] => {
    if (typeof window === 'undefined') return [];
    if (!user) return [];
    try {
      const saved = localStorage.getItem(`mrbulk_custom_wishlists_${user.id}`) || localStorage.getItem(`luxestore_custom_wishlists_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}

    let initialProdIds = ['prod-1', 'prod-4'];
    if (user.id === 'usr-vip-02') initialProdIds = ['prod-2', 'prod-5'];
    if (user.id === 'usr-cust-03') initialProdIds = ['prod-3'];

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
        description: 'Curated products saved for later',
        icon: 'sparkles',
        productIds: [],
        createdAt: new Date().toISOString()
      }
    ];
  };

  // Initial client-side state hydration
  useEffect(() => {
    if (isLoadedRef.current) return;
    try {
      // Load and sanitize logo text
      const savedLogo = localStorage.getItem('mrbulk_logo_text') || localStorage.getItem('luxestore_logo_text');
      if (savedLogo && savedLogo !== 'LuxeStore') {
        setLogoText(savedLogo);
      } else {
        setLogoText('Mrbulk');
        try {
          localStorage.setItem('mrbulk_logo_text', 'Mrbulk');
          localStorage.removeItem('luxestore_logo_text');
        } catch (e) {}
      }

      const savedDarkMode = localStorage.getItem('mrbulk_dark_mode') ?? localStorage.getItem('luxestore_dark_mode');
      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === 'true';
        setDarkModeState(isDark);
        if (typeof document !== 'undefined') {
          if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
            document.body?.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
            document.body?.classList.remove('dark');
          }
        }
      } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkModeState(true);
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
          document.body?.classList.add('dark');
        }
      }

      const savedTheme = localStorage.getItem('mrbulk_theme_color') || localStorage.getItem('luxestore_theme_color');
      if (savedTheme === 'indigo') {
        setThemeColor('blue');
      } else if (savedTheme && ['blue', 'emerald', 'rose', 'amber', 'slate'].includes(savedTheme)) {
        setThemeColor(savedTheme as any);
      }

      const savedSlides = localStorage.getItem('mrbulk_slides') || localStorage.getItem('luxestore_slides');
      if (savedSlides) {
        const parsed = JSON.parse(savedSlides);
        if (Array.isArray(parsed) && parsed.length > 0) setSlides(parsed);
      }

      const savedFreeShipping = localStorage.getItem('mrbulk_free_shipping_threshold') || localStorage.getItem('luxestore_free_shipping_threshold');
      if (savedFreeShipping) setFreeShippingThreshold(Number(savedFreeShipping));

      const savedProdSettings = localStorage.getItem('mrbulk_products_settings') || localStorage.getItem('luxestore_products_settings');
      if (savedProdSettings) {
        const parsed = JSON.parse(savedProdSettings);
        if (parsed && typeof parsed === 'object') setProductsSettings(parsed);
      }

      const savedProducts = localStorage.getItem('mrbulk_admin_products') || localStorage.getItem('luxestore_admin_products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }

      const savedCategories = localStorage.getItem('mrbulk_admin_categories') || localStorage.getItem('luxestore_admin_categories');
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
      }

      const savedBrands = localStorage.getItem('mrbulk_admin_brands') || localStorage.getItem('luxestore_admin_brands');
      if (savedBrands) {
        const parsed = JSON.parse(savedBrands);
        if (Array.isArray(parsed) && parsed.length > 0) setBrands(parsed);
      }

      const savedVendorApps = localStorage.getItem('mrbulk_vendor_applications') || localStorage.getItem('luxestore_vendor_applications');
      if (savedVendorApps) {
        const parsed = JSON.parse(savedVendorApps);
        if (Array.isArray(parsed) && parsed.length > 0) setVendorApplications(parsed);
      }

      const savedSellerAccounts = localStorage.getItem('mrbulk_seller_accounts') || localStorage.getItem('luxestore_seller_accounts');
      if (savedSellerAccounts) {
        const parsed = JSON.parse(savedSellerAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((acc: SellerAccount) => ({
            ...acc,
            id: sanitizeMerchantId(acc.id)
          }));
          setSellerAccounts(sanitized);
        }
      }

      const savedSubmissions = localStorage.getItem('mrbulk_product_submissions') || localStorage.getItem('luxestore_product_submissions');
      if (savedSubmissions) {
        const parsed = JSON.parse(savedSubmissions);
        if (Array.isArray(parsed) && parsed.length > 0) setProductSubmissions(parsed);
      }

      const savedUserRaw = localStorage.getItem('mrbulk_user') || localStorage.getItem('luxestore_user');
      let user: UserProfile | null = null;
      if (savedUserRaw && savedUserRaw !== 'null' && savedUserRaw !== 'none') {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed && typeof parsed === 'object') {
          user = {
            ...parsed,
            sellerId: parsed.sellerId ? sanitizeMerchantId(parsed.sellerId) : undefined
          };
          setCurrentUser(user);
        }
      }

      setCart(loadUserCart(user));
      setCustomWishlists(loadUserCustomWishlists(user));

      const savedRecent = localStorage.getItem('mrbulk_recently_viewed') || localStorage.getItem('luxestore_recently_viewed');
      if (savedRecent) {
        const parsed = JSON.parse(savedRecent);
        if (Array.isArray(parsed)) setRecentlyViewedIds(parsed);
      }

      initGTM();
    } catch (e) {
      console.error('Failed to load initial state from localStorage:', e);
    } finally {
      isLoadedRef.current = true;
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_logo_text', logoText);
      localStorage.setItem('mrbulk_theme_color', themeColor);
      localStorage.setItem('mrbulk_free_shipping_threshold', freeShippingThreshold.toString());
      localStorage.setItem('mrbulk_products_settings', JSON.stringify(productsSettings));
      localStorage.setItem('mrbulk_admin_products', JSON.stringify(products));
      localStorage.setItem('mrbulk_admin_categories', JSON.stringify(categories));
      localStorage.setItem('mrbulk_admin_brands', JSON.stringify(brands));
      localStorage.setItem('mrbulk_slides', JSON.stringify(slides));
      localStorage.setItem('mrbulk_recently_viewed', JSON.stringify(recentlyViewedIds));
      localStorage.setItem('mrbulk_vendor_applications', JSON.stringify(vendorApplications));
      localStorage.setItem('mrbulk_seller_accounts', JSON.stringify(sellerAccounts));
      localStorage.setItem('mrbulk_product_submissions', JSON.stringify(productSubmissions));
    } catch (e) {}
  }, [logoText, themeColor, freeShippingThreshold, productsSettings, products, categories, brands, slides, recentlyViewedIds, vendorApplications, sellerAccounts, productSubmissions]);

  // Dynamic CSS variables sync for theme color changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const theme = getThemeClasses(themeColor);
    const root = document.documentElement;
    root.style.setProperty('--text-accent', theme.primaryHex);
    root.style.setProperty('--border-focus', theme.primaryHex);
    root.style.setProperty('--btn-primary-bg', theme.primaryHex);
    root.style.setProperty('--focus-ring', `${theme.primaryHex}40`);
    root.style.setProperty('--input-ring', `${theme.primaryHex}33`);
    root.style.setProperty('--badge-new-text', theme.primaryHex);
    root.style.setProperty('--badge-new-bg', `${theme.primaryHex}20`);
  }, [themeColor]);

  // Persist User & Cart/Wishlist
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      if (currentUser) {
        localStorage.setItem('mrbulk_user', JSON.stringify(currentUser));
        localStorage.setItem(`mrbulk_cart_${currentUser.id}`, JSON.stringify(cart));
        localStorage.setItem(`mrbulk_custom_wishlists_${currentUser.id}`, JSON.stringify(customWishlists));
      } else {
        localStorage.setItem('mrbulk_user', 'null');
        localStorage.setItem('mrbulk_cart_guest', JSON.stringify(cart));
      }
    } catch (e) {}
  }, [currentUser, cart, customWishlists]);

  // Track product view helper
  const trackProductView = (productId: string) => {
    if (!productId) return;
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });

    const prod = products.find((p) => p.id === productId);
    if (prod) {
      const { retailPrice } = getProductPrices(prod, productsSettings);
      trackViewItem(
        {
          id: prod.id,
          name: prod.name,
          price: retailPrice,
          category: prod.category,
          brand: (prod as any).brand
        },
        'ZAR'
      );
    }
  };

  // Cart actions
  const handleAddToCart = (product: any, qty: number = 1, selectedOffer?: VendorOffer) => {
    const p = selectedOffer ? selectedOffer.price : (typeof product.price === 'number' ? product.price : parsePriceNumber(String(product.price)));
    const targetSellerId = selectedOffer?.sellerId || product.primarySellerId || '849201';
    const targetSellerName = selectedOffer?.sellerName || product.primarySellerName || 'Verified Merchant';
    const cartItemId = selectedOffer ? `${product.id}__offer_${selectedOffer.offerId}` : product.id;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);

      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + qty } : item
        );
      }

      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: p,
          imageUrl: product.imageUrl,
          quantity: qty,
          retailPrice: p,
          wholesalePrice: product.wholesalePrice ? parsePriceNumber(String(product.wholesalePrice)) : undefined,
          minWholesaleQuantity: product.minWholesaleQuantity,
          selectedOfferId: selectedOffer?.offerId,
          sellerId: targetSellerId,
          sellerName: targetSellerName,
          sellerPrice: p,
          condition: selectedOffer?.condition || 'Brand New'
        }
      ];
    });

    trackAddToCart({ id: product.id, name: product.name, price: p }, qty, 'ZAR');
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const handleAdjustQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    const item = cart.find((c) => c.id === id);
    setCart((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      showToast(`Removed ${item.name} from cart`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared', 'info');
  };

  // Multi-Vendor Ecosystem Actions
  const handleApplyAsVendor = async (data: Omit<VendorApplication, 'id' | 'createdAt' | 'status'>) => {
    const newAppId = `app-${Date.now().toString().slice(-4)}`;
    const newApp: VendorApplication = {
      ...data,
      id: newAppId,
      status: 'pending_approval',
      createdAt: new Date().toISOString()
    };

    setVendorApplications((prev) => [newApp, ...prev]);

    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, status: 'pending_approval' } : null);
    }

    showToast('Application submitted! Our compliance team will review your business documents within 24–48 hours.', 'success');
    return { success: true, applicationId: newAppId };
  };

  const handleApproveVendorApplication = (applicationId: string) => {
    const app = vendorApplications.find((a) => a.id === applicationId);
    if (!app) return;

    const newSellerId = generateRandomMerchantId(sellerAccounts.map((s) => s.id));

    // 1. Update application status
    setVendorApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser?.name || 'Alexander Sterling (Admin)'
            }
          : a
      )
    );

    // 2. Create or activate SellerAccount
    const newSellerAccount: SellerAccount = {
      id: newSellerId,
      userId: app.userId || `usr-${newSellerId}`,
      storeName: app.storeName,
      contactName: app.contactName,
      contactEmail: app.contactEmail,
      phone: app.phone,
      accountType: app.accountType,
      taxOrRegistrationId: app.taxOrRegistrationId,
      description: app.description,
      status: 'active',
      rating: 5.0,
      totalSales: 0,
      ordersCount: 0,
      activeListingsCount: 0,
      commissionRate: 10,
      joinedDate: new Date().toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }),
      bankDetails: {
        bankName: 'First National Bank (FNB)',
        accountNumber: '62800192834',
        branchCode: '250655',
        accountHolder: app.storeName,
        accountType: 'Business Cheque'
      }
    };

    setSellerAccounts((prev) => {
      const exists = prev.find((s) => s.contactEmail.toLowerCase() === app.contactEmail.toLowerCase());
      if (exists) {
        return prev.map((s) => (s.id === exists.id ? { ...s, status: 'active' } : s));
      }
      return [newSellerAccount, ...prev];
    });

    // 3. Elevate user role if logged in
    if (currentUser && (currentUser.email.toLowerCase() === app.contactEmail.toLowerCase() || currentUser.id === app.userId)) {
      setCurrentUser((prev) => (prev ? { ...prev, role: 'seller', status: 'active', sellerId: newSellerId } : null));
    }

    showToast(`Application for ${app.storeName} approved! Vendor account activated.`, 'success');
  };

  const handleRejectVendorApplication = (applicationId: string, reason?: string) => {
    const app = vendorApplications.find((a) => a.id === applicationId);
    if (!app) return;

    setVendorApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser?.name || 'Alexander Sterling (Admin)',
              rejectionReason: reason || 'Application documents could not be verified by compliance.'
            }
          : a
      )
    );

    showToast(`Application for ${app.storeName} was rejected.`, 'info');
  };

  const handleToggleSellerStatus = (sellerId: string, status?: 'active' | 'suspended') => {
    setSellerAccounts((prev) =>
      prev.map((s) => {
        if (s.id === sellerId) {
          const nextStatus = status || (s.status === 'active' ? 'suspended' : 'active');
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    showToast('Seller status updated successfully.', 'success');
  };

  const handleUpdateSellerProfile = (sellerId: string, updates: Partial<SellerAccount>) => {
    setSellerAccounts((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, ...updates } : s))
    );
    showToast('Seller profile saved.', 'success');
  };

  const handleCreateOrUpdateOffer = (productId: string, offerData: Partial<VendorOffer> & { price: number; stockCount: number; condition: ProductCondition }) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;

        const currentOffers = prod.offers || [];
        const offerId = offerData.offerId || `off-${Date.now().toString().slice(-5)}`;
        const existingOfferIndex = currentOffers.findIndex((o) => o.offerId === offerId || (offerData.sellerId && o.sellerId === offerData.sellerId));

        const fullOffer: VendorOffer = {
          offerId,
          sellerId: offerData.sellerId || (currentUser?.sellerId || '849201'),
          sellerName: offerData.sellerName || (currentUser?.name || 'Verified Merchant'),
          price: offerData.price,
          originalPrice: offerData.originalPrice,
          stockCount: offerData.stockCount,
          condition: offerData.condition,
          shippingDays: offerData.shippingDays || 2,
          rating: offerData.rating || 5.0,
          reviewsCount: offerData.reviewsCount || 1,
          isFeatured: offerData.isFeatured,
          notes: offerData.notes
        };

        let updatedOffers: VendorOffer[];
        if (existingOfferIndex >= 0) {
          updatedOffers = [...currentOffers];
          updatedOffers[existingOfferIndex] = { ...updatedOffers[existingOfferIndex], ...fullOffer };
        } else {
          updatedOffers = [fullOffer, ...currentOffers];
        }

        const inStockOffers = updatedOffers.filter((o) => o.stockCount > 0);
        const lowestOffer = inStockOffers.length > 0
          ? inStockOffers.reduce((min, o) => (o.price < min.price ? o : min), inStockOffers[0])
          : updatedOffers[0];

        return {
          ...prod,
          offers: updatedOffers,
          primarySellerId: lowestOffer?.sellerId || prod.primarySellerId,
          primarySellerName: lowestOffer?.sellerName || prod.primarySellerName
        };
      })
    );
    showToast('Product offer listed in catalog.', 'success');
  };

  const handleDeleteOffer = (productId: string, offerId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const updatedOffers = (prod.offers || []).filter((o) => o.offerId !== offerId);
        return { ...prod, offers: updatedOffers };
      })
    );
    showToast('Offer removed from product.', 'info');
  };

  const handleSubmitNewProduct = (submissionData: Omit<VendorProductSubmission, 'id' | 'status' | 'createdAt'>) => {
    const newSubmissionId = `sub-${Date.now().toString().slice(-4)}`;
    const newSubmission: VendorProductSubmission = {
      ...submissionData,
      id: newSubmissionId,
      status: 'pending_approval',
      createdAt: new Date().toISOString()
    };

    setProductSubmissions((prev) => [newSubmission, ...prev]);
    showToast(`"${submissionData.name}" submitted for Admin catalog review!`, 'success');
    return newSubmission;
  };

  const handleApproveProductSubmission = (submissionId: string) => {
    const sub = productSubmissions.find((s) => s.id === submissionId);
    if (!sub) return;

    const newProdId = `prod-${Date.now().toString().slice(-4)}`;

    const newProduct: MockWooProduct = {
      id: newProdId,
      name: sub.name,
      price: `R ${sub.price.toFixed(2)}`,
      originalPrice: sub.originalPrice ? `R ${sub.originalPrice.toFixed(2)}` : undefined,
      isSale: !!sub.originalPrice && sub.originalPrice > sub.price,
      imageUrl: sub.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
      images: sub.additionalImages && sub.additionalImages.length > 0 ? sub.additionalImages : [sub.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'],
      stock: sub.stockCount,
      url: `/product/${newProdId}`,
      description: sub.description,
      brand: sub.brand,
      categoryId: sub.categoryId || 2,
      category: sub.categoryName || 'Tech & Audio',
      sku: sub.sku || `SKU-${Date.now().toString().slice(-6)}`,
      rating: 5.0,
      reviewsCount: 1,
      tags: sub.tags && sub.tags.length > 0 ? sub.tags : ['New Arrival', sub.brand],
      primarySellerId: sub.sellerId,
      primarySellerName: sub.sellerName,
      offers: [
        {
          offerId: `off-${Date.now().toString().slice(-4)}`,
          sellerId: sub.sellerId,
          sellerName: sub.sellerName,
          price: sub.price,
          originalPrice: sub.originalPrice,
          stockCount: sub.stockCount,
          condition: sub.condition,
          shippingDays: sub.shippingDays || 2,
          rating: 5.0,
          reviewsCount: 1,
          isFeatured: true,
          notes: sub.notes || 'Verified Merchant Offering'
        }
      ]
    };

    // 1. Add to live catalog
    setProducts((prev) => [newProduct, ...prev]);

    // 2. Mark submission as approved
    setProductSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser?.name || 'Alexander Sterling (Admin)',
              approvedProductId: newProdId
            }
          : s
      )
    );

    // 3. Increment seller active listings count
    setSellerAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sub.sellerId
          ? { ...acc, activeListingsCount: (acc.activeListingsCount || 0) + 1 }
          : acc
      )
    );

    showToast(`Approved "${sub.name}"! Now published in store catalog.`, 'success');
  };

  const handleRejectProductSubmission = (submissionId: string, reason?: string) => {
    const sub = productSubmissions.find((s) => s.id === submissionId);
    if (!sub) return;

    setProductSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser?.name || 'Alexander Sterling (Admin)',
              rejectionReason: reason || 'Product details or specifications do not meet catalog compliance guidelines.'
            }
          : s
      )
    );

    showToast(`Product submission "${sub.name}" rejected.`, 'info');
  };

  const handleDeleteProductSubmission = (submissionId: string) => {
    setProductSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    showToast('Product submission removed.', 'success');
  };

  // Wishlist actions
  const handleToggleWishlist = (id: string, name?: string) => {
    const isSaved = wishlist.includes(id);
    setCustomWishlists((prev) => {
      let lists = [...prev];
      if (lists.length === 0) {
        lists = [
          {
            id: 'list-favourites',
            name: 'Favourites',
            description: 'Your primary saved items',
            icon: 'heart',
            productIds: [],
            createdAt: new Date().toISOString(),
            isDefault: true
          }
        ];
      }

      const defaultIdx = lists.findIndex((l) => l.isDefault) !== -1 ? lists.findIndex((l) => l.isDefault) : 0;
      const targetList = { ...lists[defaultIdx] };

      if (isSaved) {
        return lists.map((l) => ({
          ...l,
          productIds: l.productIds.filter((pId) => pId !== id)
        }));
      } else {
        targetList.productIds = Array.from(new Set([...targetList.productIds, id]));
        const updated = [...lists];
        updated[defaultIdx] = targetList;
        return updated;
      }
    });

    if (isSaved) {
      showToast(`Removed ${name || 'item'} from wishlist`, 'info');
    } else {
      showToast(`Saved ${name || 'item'} to wishlist!`, 'success');
    }
  };

  const handleToggleProductInLists = (productId: string, listIds: string[]) => {
    setCustomWishlists((prev) =>
      prev.map((list) => {
        const shouldInclude = listIds.includes(list.id);
        const alreadyHas = list.productIds.includes(productId);
        if (shouldInclude && !alreadyHas) {
          return { ...list, productIds: [...list.productIds, productId] };
        } else if (!shouldInclude && alreadyHas) {
          return { ...list, productIds: list.productIds.filter((id) => id !== productId) };
        }
        return list;
      })
    );
  };

  const handleCreateWishlist = (name: string, description?: string, icon: string = 'heart'): CustomWishlist => {
    const newList: CustomWishlist = {
      id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      description: description?.trim(),
      icon,
      productIds: [],
      createdAt: new Date().toISOString()
    };
    setCustomWishlists((prev) => [...prev, newList]);
    showToast(`Created new wishlist: "${name}"`, 'success');
    return newList;
  };

  const handleDeleteWishlist = (listId: string) => {
    const listToDelete = customWishlists.find((l) => l.id === listId);
    if (listToDelete?.isDefault) {
      showToast('Cannot delete default Favourites list', 'error');
      return;
    }
    setCustomWishlists((prev) => prev.filter((l) => l.id !== listId));
    showToast(`Deleted wishlist "${listToDelete?.name}"`, 'info');
  };

  const handleRenameWishlist = (listId: string, newName: string, newDesc?: string) => {
    setCustomWishlists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, name: newName.trim(), description: newDesc?.trim() } : l))
    );
    showToast('Wishlist updated successfully', 'success');
  };

  const handleResetDefaultWishlists = () => {
    setCustomWishlists([
      {
        id: 'list-favourites',
        name: 'Favourites',
        description: 'Your primary saved items',
        icon: 'heart',
        productIds: [],
        createdAt: new Date().toISOString(),
        isDefault: true
      }
    ]);
    showToast('Wishlists reset to default', 'info');
  };

  // Auth actions
  const handleSignIn = (user: UserProfile) => {
    setCurrentUser(user);
    setCart(loadUserCart(user));
    setCustomWishlists(loadUserCustomWishlists(user));
    setAuthModalOpen(false);
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCart(loadUserCart(null));
    setCustomWishlists([]);
    showToast('Signed out successfully', 'info');
  };

  const handleSwitchUser = (userId: string) => {
    const users: UserProfile[] = MOCK_USERS;

    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      handleSignIn(targetUser);
    }
  };

  // Quick view
  const handleOpenQuickView = (prod: MockWooProduct) => {
    setQuickViewProduct(prod);
    setQuickViewOpen(true);
    trackProductView(prod.id);
  };

  // Navigation and Search
  const navigateTo = (path: string) => {
    setMobileMenuOpen(false);
    setCartOpen(false);
    router.push(path);
  };

  const handlePerformSearch = (queryToUse?: string) => {
    const q = queryToUse !== undefined ? queryToUse : searchQuery;
    setSearchQuery(q);
    setMobileMenuOpen(false);
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  // Derived calculations
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cart.reduce((acc, curr) => {
    const catalogProd = products.find((p) => p.id === curr.id);
    const unitPrice = getCartItemUnitPrice(curr, catalogProd, productsSettings);
    return acc + unitPrice * curr.quantity;
  }, 0);

  const currentTheme = getThemeClasses(themeColor);

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        categories,
        setCategories,
        brands,
        setBrands,
        slides,
        setSlides,
        sliderSettings,
        setSliderSettings,
        categorySettings,
        setCategorySettings,
        brandSettings,
        setBrandSettings,

        logoText,
        setLogoText,
        themeColor,
        setThemeColor,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        freeShippingThreshold,
        setFreeShippingThreshold,
        productsSettings,
        setProductsSettings,

        cart,
        setCart,
        cartCount,
        cartSubtotal,
        handleAddToCart,
        onAddToCart: handleAddToCart,
        handleAdjustQuantity,
        onAdjustQuantity: handleAdjustQuantity,
        handleRemoveFromCart,
        onRemoveFromCart: handleRemoveFromCart,
        handleClearCart,
        onClearCart: handleClearCart,

        customWishlists,
        setCustomWishlists,
        wishlist,
        handleToggleWishlist,
        onToggleWishlist: handleToggleWishlist,
        handleToggleProductInLists,
        onToggleProductInLists: handleToggleProductInLists,
        handleCreateWishlist,
        onCreateWishlist: handleCreateWishlist,
        handleDeleteWishlist,
        onDeleteWishlist: handleDeleteWishlist,
        handleRenameWishlist,
        onRenameWishlist: handleRenameWishlist,
        handleResetDefaultWishlists,
        onResetDefaultWishlists: handleResetDefaultWishlists,

        // Multi-Vendor Ecosystem
        vendorApplications,
        setVendorApplications,
        sellerAccounts,
        setSellerAccounts,
        productSubmissions,
        setProductSubmissions,
        handleApplyAsVendor,
        handleApproveVendorApplication,
        handleRejectVendorApplication,
        handleToggleSellerStatus,
        handleUpdateSellerProfile,
        handleCreateOrUpdateOffer,
        handleDeleteOffer,
        handleSubmitNewProduct,
        handleApproveProductSubmission,
        handleRejectProductSubmission,
        handleDeleteProductSubmission,

        currentUser,
        setCurrentUser,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        handleSignIn,
        onSignIn: handleSignIn,
        handleSignOut,
        onSignOut: handleSignOut,
        handleSwitchUser,
        onSwitchUser: handleSwitchUser,

        quickViewProduct,
        quickViewOpen,
        handleOpenQuickView,
        onOpenQuickView: handleOpenQuickView,
        setQuickViewOpen,
        cartOpen,
        setCartOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        aiConciergeOpen,
        setAiConciergeOpen,
        nextjsModalOpen,
        setNextjsModalOpen,
        seoModalOpen,
        setSeoModalOpen,

        editorOpen,
        setEditorOpen,
        activeEditorTab,
        setActiveEditorTab,

        recentlyViewedIds,
        setRecentlyViewedIds,
        trackProductView,

        searchQuery,
        setSearchQuery,
        handlePerformSearch,
        navigateTo,

        toasts,
        showToast,
        handleDismissToast,

        getThemeClasses,
        currentTheme
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
