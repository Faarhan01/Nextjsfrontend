'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { getThemeClasses, ThemeColor, ThemeClasses } from '@/providers/theme-provider';
import { useThemeContext } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useRecentlyViewedContext } from '@/providers/recently-viewed-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { useUI } from '@/providers/ui-provider';

import type {
  MockProduct,
  VendorOffer,
  ProductCondition,
  UserProfile,
  SlideConfig,
  SliderSettings,
  CategoryCarouselSettings,
  BrandCarouselSettings,
  ProductsSettings,
  VendorApplication,
  SellerAccount,
  VendorProductSubmission
} from '@/types';
import type { MockCategoryPreset, MockBrandPreset } from '@/data/presets';

export type { ThemeColor, ThemeClasses };
export { getThemeClasses };

export interface StoreContextType {
  // Catalog & Content
  products: MockProduct[];
  setProducts: React.Dispatch<React.SetStateAction<MockProduct[]>>;
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

  // Multi-Vendor Ecosystem (delegated to CatalogProvider)
  sellerAccounts: SellerAccount[];
  setSellerAccounts: React.Dispatch<React.SetStateAction<SellerAccount[]>>;
  vendorApplications: VendorApplication[];
  setVendorApplications: React.Dispatch<React.SetStateAction<VendorApplication[]>>;
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

  // Modals & Drawers (delegated to UIProvider)
  quickViewProduct: MockProduct | null;
  quickViewOpen: boolean;
  handleOpenQuickView: (prod: MockProduct) => void;
  onOpenQuickView: (prod: MockProduct) => void;
  setQuickViewOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  aiConciergeOpen: boolean;
  setAiConciergeOpen: (open: boolean) => void;
  nextjsModalOpen: boolean;
  setNextjsModalOpen: (open: boolean) => void;
  seoModalOpen: boolean;
  setSeoModalOpen: (open: boolean) => void;

  // Customizer Panel (delegated to UIProvider)
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
  activeEditorTab: 'settings' | 'codebase';
  setActiveEditorTab: (tab: 'settings' | 'codebase') => void;

  // Recently Viewed (delegated to RecentlyViewedProvider)
  recentlyViewedIds: string[];
  setRecentlyViewedIds: React.Dispatch<React.SetStateAction<string[]>>;
  trackProductView: (productId: string) => void;

  // Search & Navigation (delegated to UIProvider)
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
  const theme = useThemeContext();
  const toast = useToastContext();
  const cart = useCartContext();
  const wishlist = useWishlistContext();
  const recentlyViewed = useRecentlyViewedContext();
  const auth = useAuthContext();
  const catalog = useCatalog();
  const ui = useUI();

  const handleOpenQuickView = ui.handleOpenQuickView;

  const value: StoreContextType = {
    // Catalog
    products: catalog.products, setProducts: catalog.setProducts,
    categories: catalog.categories, setCategories: catalog.setCategories,
    brands: catalog.brands, setBrands: catalog.setBrands,
    slides: catalog.slides, setSlides: catalog.setSlides,
    sliderSettings: catalog.sliderSettings, setSliderSettings: catalog.setSliderSettings,
    categorySettings: catalog.categorySettings, setCategorySettings: catalog.setCategorySettings,
    brandSettings: catalog.brandSettings, setBrandSettings: catalog.setBrandSettings,
    productsSettings: catalog.productsSettings, setProductsSettings: catalog.setProductsSettings,

    // Theme
    logoText: theme.logoText, setLogoText: theme.setLogoText,
    themeColor: theme.themeColor, setThemeColor: theme.setThemeColor,
    darkMode: theme.darkMode, setDarkMode: theme.setDarkMode, toggleDarkMode: theme.toggleDarkMode,
    freeShippingThreshold: theme.freeShippingThreshold, setFreeShippingThreshold: theme.setFreeShippingThreshold,

    // Cart
    cart: cart.cart, cartOpen: ui.cartOpen, setCartOpen: ui.setCartOpen,
    cartCount: cart.cartCount, cartSubtotal: cart.cartSubtotal,
    handleAddToCart: cart.addToCart, onAddToCart: cart.addToCart,
    handleAdjustQuantity: cart.adjustQuantity, onAdjustQuantity: cart.adjustQuantity,
    handleRemoveFromCart: cart.removeFromCart, onRemoveFromCart: cart.removeFromCart,
    handleClearCart: cart.clearCart, onClearCart: cart.clearCart, setCart: cart.setCart,

    // Wishlist
    customWishlists: wishlist.customWishlists, setCustomWishlists: wishlist.setCustomWishlists,
    wishlist: wishlist.wishlist,
    handleToggleWishlist: wishlist.toggleWishlist, onToggleWishlist: wishlist.toggleWishlist,
    handleToggleProductInLists: wishlist.toggleProductInLists, onToggleProductInLists: wishlist.toggleProductInLists,
    handleCreateWishlist: wishlist.createWishlist, onCreateWishlist: wishlist.createWishlist,
    handleDeleteWishlist: wishlist.deleteWishlist, onDeleteWishlist: wishlist.deleteWishlist,
    handleRenameWishlist: wishlist.renameWishlist, onRenameWishlist: wishlist.renameWishlist,
    handleResetDefaultWishlists: wishlist.resetDefaultWishlists, onResetDefaultWishlists: wishlist.resetDefaultWishlists,

    // Multi-Vendor / Catalog admin mutations
    vendorApplications: catalog.vendorApplications, setVendorApplications: catalog.setVendorApplications,
    sellerAccounts: catalog.sellerAccounts, setSellerAccounts: catalog.setSellerAccounts,
    productSubmissions: catalog.productSubmissions, setProductSubmissions: catalog.setProductSubmissions,
    handleApplyAsVendor: catalog.handleApplyAsVendor,
    handleApproveVendorApplication: catalog.handleApproveVendorApplication,
    handleRejectVendorApplication: catalog.handleRejectVendorApplication,
    handleToggleSellerStatus: catalog.handleToggleSellerStatus,
    handleUpdateSellerProfile: catalog.handleUpdateSellerProfile,
    handleCreateOrUpdateOffer: catalog.handleCreateOrUpdateOffer,
    handleDeleteOffer: catalog.handleDeleteOffer,
    handleSubmitNewProduct: catalog.handleSubmitNewProduct,
    handleApproveProductSubmission: catalog.handleApproveProductSubmission,
    handleRejectProductSubmission: catalog.handleRejectProductSubmission,
    handleDeleteProductSubmission: catalog.handleDeleteProductSubmission,

    // Auth
    currentUser: auth.currentUser, setCurrentUser: auth.setCurrentUser,
    authModalOpen: auth.authModalOpen, setAuthModalOpen: auth.setAuthModalOpen,
    authModalTab: auth.authModalTab, setAuthModalTab: auth.setAuthModalTab,
    handleSignIn: auth.signIn, onSignIn: auth.signIn,
    handleSignOut: auth.signOut, onSignOut: auth.signOut,
    handleSwitchUser: auth.switchUser, onSwitchUser: auth.switchUser,

    // Modals & Drawers
    quickViewProduct: ui.quickViewProduct, quickViewOpen: ui.quickViewOpen,
    handleOpenQuickView, onOpenQuickView: handleOpenQuickView,
    setQuickViewOpen: ui.setQuickViewOpen,
    mobileMenuOpen: ui.mobileMenuOpen, setMobileMenuOpen: ui.setMobileMenuOpen,
    aiConciergeOpen: ui.aiConciergeOpen, setAiConciergeOpen: ui.setAiConciergeOpen,
    nextjsModalOpen: ui.nextjsModalOpen, setNextjsModalOpen: ui.setNextjsModalOpen,
    seoModalOpen: ui.seoModalOpen, setSeoModalOpen: ui.setSeoModalOpen,

    // Customizer
    editorOpen: ui.editorOpen, setEditorOpen: ui.setEditorOpen,
    activeEditorTab: ui.activeEditorTab, setActiveEditorTab: ui.setActiveEditorTab,

    // Recently Viewed
    recentlyViewedIds: recentlyViewed.recentlyViewedIds,
    setRecentlyViewedIds: recentlyViewed.setRecentlyViewedIds,
    trackProductView: recentlyViewed.trackProductView,

    // Search & Navigation
    searchQuery: ui.searchQuery, setSearchQuery: ui.setSearchQuery,
    handlePerformSearch: ui.handlePerformSearch, navigateTo: ui.navigateTo,

    // Toast
    toasts: toast.toasts, showToast: toast.showToast, handleDismissToast: toast.dismissToast,

    // Theme helpers
    getThemeClasses, currentTheme: getThemeClasses(theme.themeColor)
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) { throw new Error('useStore must be used within a StoreProvider'); }
  return context;
};

