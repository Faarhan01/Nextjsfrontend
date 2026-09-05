'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  MockWooProduct,
  SlideConfig,
  SliderSettings,
  CategoryCarouselSettings,
  BrandCarouselSettings,
  UserProfile,
  ProductsSettings,
  VendorApplication,
  SellerAccount,
  VendorOffer,
  ProductCondition,
  VendorProductSubmission
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
import { initGTM } from '../utils/gtm';
import { useThemeContext, getThemeClasses, ThemeColor, ThemeClasses } from '../providers/theme-provider';
import { useToastContext } from '../providers/toast-provider';
import { useCartContext } from '../providers/cart-provider';
import { useWishlistContext } from '../providers/wishlist-provider';
import { useRecentlyViewedContext } from '../providers/recently-viewed-provider';
import { useAuthContext } from '../providers/auth-provider';

export type { ThemeColor, ThemeClasses };
export { getThemeClasses };

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

export function generateRandomMerchantId(existingIds: string[] = []): string {
  let id: string;
  let attempts = 0;
  do {
    id = String(Math.floor(100000 + Math.random() * 900000));
    attempts++;
  } while (existingIds.includes(id) && attempts < 100);
  return id;
}

export interface StoreContextType {
  // Catalog & Content (still in StoreContext — admin-only mutations)
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
  productsSettings: ProductsSettings;
  setProductsSettings: React.Dispatch<React.SetStateAction<ProductsSettings>>;

  // Theme (delegated to ThemeProvider)
  logoText: string;
  setLogoText: (name: string) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  toggleDarkMode: () => void;
  freeShippingThreshold: number;
  setFreeShippingThreshold: (val: number) => void;

  // Cart (delegated to CartProvider)
  cart: any;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
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
  setCart: React.Dispatch<React.SetStateAction<any[]>>;

  // Wishlist (delegated to WishlistProvider)
  customWishlists: any[];
  setCustomWishlists: React.Dispatch<React.SetStateAction<any[]>>;
  wishlist: string[];
  handleToggleWishlist: (id: string, name?: string) => void;
  onToggleWishlist: (id: string, name?: string) => void;
  handleToggleProductInLists: (productId: string, listIds: string[]) => void;
  onToggleProductInLists: (productId: string, listIds: string[]) => void;
  handleCreateWishlist: (name: string, description?: string, icon?: string) => any;
  onCreateWishlist: (name: string, description?: string, icon?: string) => any;
  handleDeleteWishlist: (listId: string) => void;
  onDeleteWishlist: (listId: string) => void;
  handleRenameWishlist: (listId: string, newName: string, newDesc?: string) => void;
  onRenameWishlist: (listId: string, newName: string, newDesc?: string) => void;
  handleResetDefaultWishlists: () => void;
  onResetDefaultWishlists: () => void;

  // Multi-Vendor Ecosystem (still in StoreContext — admin-only)
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

  // User & Auth (delegated to AuthProvider)
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

  // Modals & Drawers (still in StoreContext)
  quickViewProduct: MockWooProduct | null;
  quickViewOpen: boolean;
  handleOpenQuickView: (prod: MockWooProduct) => void;
  onOpenQuickView: (prod: MockWooProduct) => void;
  setQuickViewOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  aiConciergeOpen: boolean;
  setAiConciergeOpen: (open: boolean) => void;
  nextjsModalOpen: boolean;
  setNextjsModalOpen: (open: boolean) => void;
  seoModalOpen: boolean;
  setSeoModalOpen: (open: boolean) => void;

  // Customizer Panel (still in StoreContext)
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
  activeEditorTab: 'settings' | 'codebase';
  setActiveEditorTab: (tab: 'settings' | 'codebase') => void;

  // Recently Viewed (delegated to RecentlyViewedProvider)
  recentlyViewedIds: string[];
  setRecentlyViewedIds: React.Dispatch<React.SetStateAction<string[]>>;
  trackProductView: (productId: string) => void;

  // Search & Navigation (still in StoreContext)
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handlePerformSearch: (queryToUse?: string) => void;
  navigateTo: (path: string) => void;

  // Toast (delegated to ToastProvider)
  toasts: any[];
  showToast: (messageOrTitle: string, type?: 'success' | 'error' | 'warning' | 'info', description?: string) => void;
  handleDismissToast: (id: string) => void;

  // Theme helpers
  getThemeClasses: (color: string) => ThemeClasses;
  currentTheme: ThemeClasses;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // ===== Provider-backed state =====
  const theme = useThemeContext();
  const toast = useToastContext();
  const cart = useCartContext();
  const wishlist = useWishlistContext();
  const recentlyViewed = useRecentlyViewedContext();
  const auth = useAuthContext();

  // ===== Catalog state (still local) =====
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
  const [productsSettings, setProductsSettings] = useState<ProductsSettings>({
    globalRetailMarkup: 50,
    globalWholesalePrice: 20,
    minWholesaleQuantity: 6
  });

  // ===== Modals & drawers (still local) =====
  const [quickViewProduct, setQuickViewProduct] = useState<MockWooProduct | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [aiConciergeOpen, setAiConciergeOpen] = useState<boolean>(false);
  const [nextjsModalOpen, setNextjsModalOpen] = useState<boolean>(false);
  const [seoModalOpen, setSeoModalOpen] = useState<boolean>(false);

  // ===== Customizer Panel =====
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'settings' | 'codebase'>('settings');

  // ===== Search =====
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ===== Multi-Vendor =====
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(INITIAL_VENDOR_APPLICATIONS);
  const [sellerAccounts, setSellerAccounts] = useState<SellerAccount[]>(INITIAL_SELLER_ACCOUNTS);
  const [productSubmissions, setProductSubmissions] = useState<VendorProductSubmission[]>(INITIAL_PRODUCT_SUBMISSIONS);

  // Initial catalog hydration from localStorage
  const isLoadedRef = useRef<boolean>(false);
  useEffect(() => {
    if (isLoadedRef.current) return;
    try {
      const savedSlides = localStorage.getItem('mrbulk_slides') || localStorage.getItem('luxestore_slides');
      if (savedSlides) {
        const parsed = JSON.parse(savedSlides);
        if (Array.isArray(parsed) && parsed.length > 0) setSlides(parsed);
      }
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
      initGTM();
    } catch (e) {
      console.error('[StoreContext] hydrate failed:', e);
    } finally {
      isLoadedRef.current = true;
    }
  }, []);

  // Persist catalog state
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('mrbulk_products_settings', JSON.stringify(productsSettings));
      localStorage.setItem('mrbulk_admin_products', JSON.stringify(products));
      localStorage.setItem('mrbulk_admin_categories', JSON.stringify(categories));
      localStorage.setItem('mrbulk_admin_brands', JSON.stringify(brands));
      localStorage.setItem('mrbulk_slides', JSON.stringify(slides));
      localStorage.setItem('mrbulk_vendor_applications', JSON.stringify(vendorApplications));
      localStorage.setItem('mrbulk_seller_accounts', JSON.stringify(sellerAccounts));
      localStorage.setItem('mrbulk_product_submissions', JSON.stringify(productSubmissions));
    } catch {}
  }, [productsSettings, products, categories, brands, slides, vendorApplications, sellerAccounts, productSubmissions]);

  // ===== Multi-Vendor Actions (still local) =====
  const handleApplyAsVendor = async (data: Omit<VendorApplication, 'id' | 'createdAt' | 'status'>) => {
    const newAppId = `app-${Date.now().toString().slice(-4)}`;
    const newApp: VendorApplication = { ...data, id: newAppId, status: 'pending_approval', createdAt: new Date().toISOString() };
    setVendorApplications((prev) => [newApp, ...prev]);
    if (auth.currentUser) {
      auth.setCurrentUser({ ...auth.currentUser, status: 'pending_approval' });
    }
    toast.showToast('Application submitted! Our compliance team will review your business documents within 24–48 hours.', 'success');
    return { success: true, applicationId: newAppId };
  };

  const handleApproveVendorApplication = (applicationId: string) => {
    const app = vendorApplications.find((a) => a.id === applicationId);
    if (!app) return;
    const newSellerId = generateRandomMerchantId(sellerAccounts.map((s) => s.id));
    setVendorApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? { ...a, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: auth.currentUser?.name || 'Alexander Sterling (Admin)' }
          : a
      )
    );
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
      if (exists) return prev.map((s) => (s.id === exists.id ? { ...s, status: 'active' } : s));
      return [newSellerAccount, ...prev];
    });
    if (auth.currentUser && (auth.currentUser.email.toLowerCase() === app.contactEmail.toLowerCase() || auth.currentUser.id === app.userId)) {
      auth.setCurrentUser({ ...auth.currentUser, role: 'seller', status: 'active', sellerId: newSellerId });
    }
    toast.showToast(`Application for ${app.storeName} approved! Vendor account activated.`, 'success');
  };

  const handleRejectVendorApplication = (applicationId: string, reason?: string) => {
    const app = vendorApplications.find((a) => a.id === applicationId);
    if (!app) return;
    setVendorApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? { ...a, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: auth.currentUser?.name || 'Alexander Sterling (Admin)', rejectionReason: reason || 'Application documents could not be verified by compliance.' }
          : a
      )
    );
    toast.showToast(`Application for ${app.storeName} was rejected.`, 'info');
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
    toast.showToast('Seller status updated successfully.', 'success');
  };

  const handleUpdateSellerProfile = (sellerId: string, updates: Partial<SellerAccount>) => {
    setSellerAccounts((prev) => prev.map((s) => (s.id === sellerId ? { ...s, ...updates } : s)));
    toast.showToast('Seller profile saved.', 'success');
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
          sellerId: offerData.sellerId || (auth.currentUser?.sellerId || '849201'),
          sellerName: offerData.sellerName || (auth.currentUser?.name || 'Verified Merchant'),
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
    toast.showToast('Product offer listed in catalog.', 'success');
  };

  const handleDeleteOffer = (productId: string, offerId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const updatedOffers = (prod.offers || []).filter((o) => o.offerId !== offerId);
        return { ...prod, offers: updatedOffers };
      })
    );
    toast.showToast('Offer removed from product.', 'info');
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
    toast.showToast(`"${submissionData.name}" submitted for Admin catalog review!`, 'success');
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
    setProducts((prev) => [newProduct, ...prev]);
    setProductSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: auth.currentUser?.name || 'Alexander Sterling (Admin)', approvedProductId: newProdId }
          : s
      )
    );
    setSellerAccounts((prev) =>
      prev.map((acc) => (acc.id === sub.sellerId ? { ...acc, activeListingsCount: (acc.activeListingsCount || 0) + 1 } : acc))
    );
    toast.showToast(`Approved "${sub.name}"! Now published in store catalog.`, 'success');
  };

  const handleRejectProductSubmission = (submissionId: string, reason?: string) => {
    const sub = productSubmissions.find((s) => s.id === submissionId);
    if (!sub) return;
    setProductSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: auth.currentUser?.name || 'Alexander Sterling (Admin)', rejectionReason: reason || 'Product details or specifications do not meet catalog compliance guidelines.' }
          : s
      )
    );
    toast.showToast(`Product submission "${sub.name}" rejected.`, 'info');
  };

  const handleDeleteProductSubmission = (submissionId: string) => {
    setProductSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    toast.showToast('Product submission removed.', 'success');
  };

  // ===== Quick view (delegates to RecentlyViewedProvider) =====
  const handleOpenQuickView = (prod: MockWooProduct) => {
    setQuickViewProduct(prod);
    setQuickViewOpen(true);
    recentlyViewed.trackProductView(prod.id);
  };

  // ===== Navigation & Search =====
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

  const currentTheme = getThemeClasses(theme.themeColor);

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
        productsSettings,
        setProductsSettings,

        logoText: theme.logoText,
        setLogoText: theme.setLogoText,
        themeColor: theme.themeColor,
        setThemeColor: theme.setThemeColor,
        darkMode: theme.darkMode,
        setDarkMode: theme.setDarkMode,
        toggleDarkMode: theme.toggleDarkMode,
        freeShippingThreshold: theme.freeShippingThreshold,
        setFreeShippingThreshold: theme.setFreeShippingThreshold,

        cart: cart.cart,
        cartOpen,
        setCartOpen,
        cartCount: cart.cartCount,
        cartSubtotal: cart.cartSubtotal,
        handleAddToCart: cart.addToCart,
        onAddToCart: cart.addToCart,
        handleAdjustQuantity: cart.adjustQuantity,
        onAdjustQuantity: cart.adjustQuantity,
        handleRemoveFromCart: cart.removeFromCart,
        onRemoveFromCart: cart.removeFromCart,
        handleClearCart: cart.clearCart,
        onClearCart: cart.clearCart,
        setCart: cart.setCart,

        customWishlists: wishlist.customWishlists,
        setCustomWishlists: wishlist.setCustomWishlists,
        wishlist: wishlist.wishlist,
        handleToggleWishlist: wishlist.toggleWishlist,
        onToggleWishlist: wishlist.toggleWishlist,
        handleToggleProductInLists: wishlist.toggleProductInLists,
        onToggleProductInLists: wishlist.toggleProductInLists,
        handleCreateWishlist: wishlist.createWishlist,
        onCreateWishlist: wishlist.createWishlist,
        handleDeleteWishlist: wishlist.deleteWishlist,
        onDeleteWishlist: wishlist.deleteWishlist,
        handleRenameWishlist: wishlist.renameWishlist,
        onRenameWishlist: wishlist.renameWishlist,
        handleResetDefaultWishlists: wishlist.resetDefaultWishlists,
        onResetDefaultWishlists: wishlist.resetDefaultWishlists,

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

        currentUser: auth.currentUser,
        setCurrentUser: auth.setCurrentUser,
        authModalOpen: auth.authModalOpen,
        setAuthModalOpen: (open: boolean) => {
          if (open) auth.openAuthModal();
          else auth.closeAuthModal();
        },
        authModalTab: auth.authModalTab,
        setAuthModalTab: (tab: 'login' | 'register') => auth.openAuthModal(tab),
        handleSignIn: auth.signIn,
        onSignIn: auth.signIn,
        handleSignOut: auth.signOut,
        onSignOut: auth.signOut,
        handleSwitchUser: auth.switchUser,
        onSwitchUser: auth.switchUser,

        quickViewProduct,
        quickViewOpen,
        handleOpenQuickView,
        onOpenQuickView: handleOpenQuickView,
        setQuickViewOpen,
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

        recentlyViewedIds: recentlyViewed.recentlyViewedIds,
        setRecentlyViewedIds: recentlyViewed.setRecentlyViewedIds,
        trackProductView: (id: string) => recentlyViewed.trackProductView(id),

        searchQuery,
        setSearchQuery,
        handlePerformSearch,
        navigateTo,

        toasts: toast.toasts,
        showToast: toast.showToast,
        handleDismissToast: toast.dismissToast,

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