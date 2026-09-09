'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  MockProduct,
  SlideConfig,
  SliderSettings,
  CategoryCarouselSettings,
  BrandCarouselSettings,
  ProductsSettings,
  VendorApplication,
  SellerAccount,
  VendorProductSubmission,
  VendorOffer,
  ProductCondition
} from '@/types';
import {
  MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS, DEFAULT_SLIDES,
  MockCategoryPreset, MockBrandPreset, INITIAL_VENDOR_APPLICATIONS,
  INITIAL_SELLER_ACCOUNTS, INITIAL_PRODUCT_SUBMISSIONS
} from '@/data/presets';
import { initGTM } from '@/utils/gtm';
import { useToastContext } from '@/providers/toast-provider';
import { useAuthContext } from '@/providers/auth-provider';

export interface CatalogContextType {
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
  handleCreateOrUpdateOffer: (productId: string, offerData: Partial<VendorOffer> & { price: number; stockCount: number; condition: ProductCondition }) => void;
  handleDeleteOffer: (productId: string, offerId: string) => void;
  handleSubmitNewProduct: (submissionData: Omit<VendorProductSubmission, 'id' | 'status' | 'createdAt'>) => VendorProductSubmission;
  handleApproveProductSubmission: (submissionId: string) => void;
  handleRejectProductSubmission: (submissionId: string, reason?: string) => void;
  handleDeleteProductSubmission: (submissionId: string) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

const OLD_SELLER_ID_MAP: Record<string, string> = {
  'sel-01': '849201', 'sel-02': '592834', 'sel-03': '710492',
  'sel-04': '385920', 'sel-05': '924183', 'sel-06': '461952', 'sel-07': '638205'
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
  do { id = String(Math.floor(100000 + Math.random() * 900000)); attempts++; }
  while (existingIds.includes(id) && attempts < 100);
  return id;
}

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<MockProduct[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<MockCategoryPreset[]>(MOCK_CATEGORIES);
  const [brands, setBrands] = useState<MockBrandPreset[]>(MOCK_BRANDS);
  const [slides, setSlides] = useState<SlideConfig[]>(DEFAULT_SLIDES);
  const [sliderSettings, setSliderSettings] = useState<SliderSettings>({
    height: '600px', autoplay: true, autoplaySpeed: 5000, dotStyle: 'expand',
    dotColor: '#ffffff', activeDotColor: '#2563eb', arrowStyle: 'rounded',
    arrowColor: '#ffffff', textColor: 'light', bannerType: 'advanced'
  });
  const [categorySettings, setCategorySettings] = useState<CategoryCarouselSettings>({
    showCategories: true, showTitle: true, title: 'Explore Categories',
    subtitle: 'Browse our curated product catalog by department', count: 12,
    hoverEffect: 'zoom', titleColor: '#0f172a', labelColor: '#1e293b',
    columnsDesktop: 6, useFirstAsSale: true, displayStyle: 'both'
  });
  const [brandSettings, setBrandSettings] = useState<BrandCarouselSettings>({
    showBrands: true, showTitle: true, title: 'Featured Premium Brands',
    subtitle: 'Discover authentic collections from world-renowned partner brands', count: 6,
    hoverEffect: 'zoom', titleColor: '#0f172a', columnsDesktop: 6, cardShape: 'squircle'
  });
  const [productsSettings, setProductsSettings] = useState<ProductsSettings>({
    globalRetailMarkup: 50, globalWholesalePrice: 20, minWholesaleQuantity: 6
  });
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(INITIAL_VENDOR_APPLICATIONS);
  const [sellerAccounts, setSellerAccounts] = useState<SellerAccount[]>(INITIAL_SELLER_ACCOUNTS);
  const [productSubmissions, setProductSubmissions] = useState<VendorProductSubmission[]>(INITIAL_PRODUCT_SUBMISSIONS);

  const toast = useToastContext();
  const auth = useAuthContext();

  const isLoadedRef = useRef(false);
  useEffect(() => {
    if (isLoadedRef.current) return;
    try {
      const savedSlides = localStorage.getItem('mrbulk_slides') || localStorage.getItem('luxestore_slides');
      if (savedSlides) { const p = JSON.parse(savedSlides); if (Array.isArray(p) && p.length > 0) setSlides(p); }
      const savedProdSettings = localStorage.getItem('mrbulk_products_settings') || localStorage.getItem('luxestore_products_settings');
      if (savedProdSettings) { const p = JSON.parse(savedProdSettings); if (p && typeof p === 'object') setProductsSettings(p); }
      const savedProducts = localStorage.getItem('mrbulk_admin_products') || localStorage.getItem('luxestore_admin_products');
      if (savedProducts) { const p = JSON.parse(savedProducts); if (Array.isArray(p) && p.length > 0) setProducts(p); }
      const savedCategories = localStorage.getItem('mrbulk_admin_categories') || localStorage.getItem('luxestore_admin_categories');
      if (savedCategories) { const p = JSON.parse(savedCategories); if (Array.isArray(p) && p.length > 0) setCategories(p); }
      const savedBrands = localStorage.getItem('mrbulk_admin_brands') || localStorage.getItem('luxestore_admin_brands');
      if (savedBrands) { const p = JSON.parse(savedBrands); if (Array.isArray(p) && p.length > 0) setBrands(p); }
      const savedVendorApps = localStorage.getItem('mrbulk_vendor_applications') || localStorage.getItem('luxestore_vendor_applications');
      if (savedVendorApps) { const p = JSON.parse(savedVendorApps); if (Array.isArray(p) && p.length > 0) setVendorApplications(p); }
      const savedSellerAccounts = localStorage.getItem('mrbulk_seller_accounts') || localStorage.getItem('luxestore_seller_accounts');
      if (savedSellerAccounts) {
        const p = JSON.parse(savedSellerAccounts);
        if (Array.isArray(p) && p.length > 0) {
          setSellerAccounts(p.map((acc: SellerAccount) => ({ ...acc, id: sanitizeMerchantId(acc.id) })));
        }
      }
      const savedSubmissions = localStorage.getItem('mrbulk_product_submissions') || localStorage.getItem('luxestore_product_submissions');
      if (savedSubmissions) { const p = JSON.parse(savedSubmissions); if (Array.isArray(p) && p.length > 0) setProductSubmissions(p); }
      initGTM();
    } catch (e) { console.error('[CatalogProvider] hydrate failed:', e); }
    finally { isLoadedRef.current = true; }
  }, []);

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

  const handleApplyAsVendor = async (data: Omit<VendorApplication, 'id' | 'createdAt' | 'status'>) => {
    const newAppId = `app-${Date.now().toString().slice(-4)}`;
    const newApp: VendorApplication = { ...data, id: newAppId, status: 'pending_approval', createdAt: new Date().toISOString() };
    setVendorApplications((prev) => [newApp, ...prev]);
    if (auth.currentUser) auth.setCurrentUser({ ...auth.currentUser, status: 'pending_approval' });
    toast.showToast('Application submitted! Our compliance team will review your business documents within 24-48 hours.', 'success');
    return { success: true, applicationId: newAppId };
  };

  const handleApproveVendorApplication = (applicationId: string) => {
    const app = vendorApplications.find((a) => a.id === applicationId);
    if (!app) return;
    const newSellerId = generateRandomMerchantId(sellerAccounts.map((s) => s.id));
    setVendorApplications((prev) => prev.map((a) => a.id === applicationId ? { ...a, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: auth.currentUser?.name || 'Alexander Sterling (Admin)' } : a));
    setSellerAccounts((prev) => {
      const exists = prev.find((s) => s.contactEmail.toLowerCase() === app.contactEmail.toLowerCase());
      if (exists) return prev.map((s) => (s.id === exists.id ? { ...s, status: 'active' } : s));
      return [{
        id: newSellerId, userId: app.userId || `usr-${newSellerId}`, storeName: app.storeName, contactName: app.contactName,
        contactEmail: app.contactEmail, phone: app.phone, accountType: app.accountType, taxOrRegistrationId: app.taxOrRegistrationId,
        description: app.description, status: 'active', rating: 5.0, totalSales: 0, ordersCount: 0, activeListingsCount: 0,
        commissionRate: 10, joinedDate: new Date().toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }),
        bankDetails: { bankName: 'First National Bank (FNB)', accountNumber: '62800192834', branchCode: '250655', accountHolder: app.storeName, accountType: 'Business Cheque' }
      }, ...prev];
    });
    if (auth.currentUser && (auth.currentUser.email.toLowerCase() === app.contactEmail.toLowerCase() || auth.currentUser.id === app.userId)) {
      auth.setCurrentUser({ ...auth.currentUser, role: 'seller', status: 'active', sellerId: newSellerId });
    }
    toast.showToast(`Application for ${app.storeName} approved! Vendor account activated.`, 'success');
  };

  const handleRejectVendorApplication = (applicationId: string, reason?: string) => {
    const app = vendorApplications.find((a) => a.id === applicationId);
    if (!app) return;
    setVendorApplications((prev) => prev.map((a) => a.id === applicationId ? { ...a, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: auth.currentUser?.name || 'Alexander Sterling (Admin)', rejectionReason: reason || 'Application documents could not be verified by compliance.' } : a));
    toast.showToast(`Application for ${app.storeName} was rejected.`, 'info');
  };

  const handleToggleSellerStatus = (sellerId: string, status?: 'active' | 'suspended') => {
    setSellerAccounts((prev) => prev.map((s) => {
      if (s.id === sellerId) { const n = status || (s.status === 'active' ? 'suspended' : 'active'); return { ...s, status: n }; }
      return s;
    }));
    toast.showToast('Seller status updated successfully.', 'success');
  };

  const handleUpdateSellerProfile = (sellerId: string, updates: Partial<SellerAccount>) => {
    setSellerAccounts((prev) => prev.map((s) => (s.id === sellerId ? { ...s, ...updates } : s)));
    toast.showToast('Seller profile saved.', 'success');
  };

  const handleCreateOrUpdateOffer = (productId: string, offerData: Partial<VendorOffer> & { price: number; stockCount: number; condition: ProductCondition }) => {
    setProducts((prev) => prev.map((prod) => {
      if (prod.id !== productId) return prod;
      const currentOffers = prod.offers || [];
      const offerId = offerData.offerId || `off-${Date.now().toString().slice(-5)}`;
      const existingOfferIndex = currentOffers.findIndex((o) => o.offerId === offerId || (offerData.sellerId && o.sellerId === offerData.sellerId));
      const fullOffer: VendorOffer = {
        offerId, sellerId: offerData.sellerId || (auth.currentUser?.sellerId || '849201'),
        sellerName: offerData.sellerName || (auth.currentUser?.name || 'Verified Merchant'),
        price: offerData.price, originalPrice: offerData.originalPrice, stockCount: offerData.stockCount,
        condition: offerData.condition, shippingDays: offerData.shippingDays || 2, rating: offerData.rating || 5.0,
        reviewsCount: offerData.reviewsCount || 1, isFeatured: offerData.isFeatured, notes: offerData.notes
      };
      const updatedOffers = existingOfferIndex >= 0 ? [...currentOffers] : [fullOffer, ...currentOffers];
      if (existingOfferIndex >= 0) updatedOffers[existingOfferIndex] = { ...updatedOffers[existingOfferIndex], ...fullOffer };
      const inStockOffers = updatedOffers.filter((o) => o.stockCount > 0);
      const lowestOffer = inStockOffers.length > 0 ? inStockOffers.reduce((min, o) => (o.price < min.price ? o : min), inStockOffers[0]) : updatedOffers[0];
      return { ...prod, offers: updatedOffers, primarySellerId: lowestOffer?.sellerId || prod.primarySellerId, primarySellerName: lowestOffer?.sellerName || prod.primarySellerName };
    }));
    toast.showToast('Product offer listed in catalog.', 'success');
  };

  const handleDeleteOffer = (productId: string, offerId: string) => {
    setProducts((prev) => prev.map((prod) => prod.id !== productId ? prod : { ...prod, offers: ((prod.offers || []).filter((o) => o.offerId !== offerId)) }));
    toast.showToast('Offer removed from product.', 'info');
  };

  const handleSubmitNewProduct = (submissionData: Omit<VendorProductSubmission, 'id' | 'status' | 'createdAt'>) => {
    const newSubmissionId = `sub-${Date.now().toString().slice(-4)}`;
    const newSubmission: VendorProductSubmission = { ...submissionData, id: newSubmissionId, status: 'pending_approval', createdAt: new Date().toISOString() };
    setProductSubmissions((prev) => [newSubmission, ...prev]);
    toast.showToast(`"${submissionData.name}" submitted for Admin catalog review!`, 'success');
    return newSubmission;
  };

  const handleApproveProductSubmission = (submissionId: string) => {
    const sub = productSubmissions.find((s) => s.id === submissionId);
    if (!sub) return;
    const newProdId = `prod-${Date.now().toString().slice(-4)}`;
    const newProduct: MockProduct = {
      id: newProdId, name: sub.name, price: `R ${sub.price.toFixed(2)}`,
      originalPrice: sub.originalPrice ? `R ${sub.originalPrice.toFixed(2)}` : undefined,
      isSale: !!sub.originalPrice && sub.originalPrice > sub.price,
      imageUrl: sub.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
      images: sub.additionalImages && sub.additionalImages.length > 0 ? sub.additionalImages : [sub.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'],
      stock: sub.stockCount, url: `/product/${newProdId}`, description: sub.description, brand: sub.brand,
      categoryId: sub.categoryId || 2, category: sub.categoryName || 'Tech & Audio', sku: sub.sku || `SKU-${Date.now().toString().slice(-6)}`,
      rating: 5.0, reviewsCount: 1, tags: sub.tags && sub.tags.length > 0 ? sub.tags : ['New Arrival', sub.brand],
      primarySellerId: sub.sellerId, primarySellerName: sub.sellerName,
      offers: [{ offerId: `off-${Date.now().toString().slice(-4)}`, sellerId: sub.sellerId, sellerName: sub.sellerName, price: sub.price, originalPrice: sub.originalPrice, stockCount: sub.stockCount, condition: sub.condition, shippingDays: sub.shippingDays || 2, rating: 5.0, reviewsCount: 1, isFeatured: true, notes: sub.notes || 'Verified Merchant Offering' }]
    };
    setProducts((prev) => [newProduct, ...prev]);
    setProductSubmissions((prev) => prev.map((s) => s.id === submissionId ? { ...s, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: auth.currentUser?.name || 'Alexander Sterling (Admin)', approvedProductId: newProdId } : s));
    setSellerAccounts((prev) => prev.map((acc) => (acc.id === sub.sellerId ? { ...acc, activeListingsCount: (acc.activeListingsCount || 0) + 1 } : acc)));
    toast.showToast(`Approved "${sub.name}"! Now published in store catalog.`, 'success');
  };

  const handleRejectProductSubmission = (submissionId: string, reason?: string) => {
    const sub = productSubmissions.find((s) => s.id === submissionId);
    if (!sub) return;
    setProductSubmissions((prev) => prev.map((s) => s.id === submissionId ? { ...s, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: auth.currentUser?.name || 'Alexander Sterling (Admin)', rejectionReason: reason || 'Product details or specifications do not meet catalog compliance guidelines.' } : s));
    toast.showToast(`Product submission "${sub.name}" rejected.`, 'info');
  };

  const handleDeleteProductSubmission = (submissionId: string) => {
    setProductSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    toast.showToast('Product submission removed.', 'success');
  };

  return (
    <CatalogContext.Provider value={{
      products, setProducts, categories, setCategories, brands, setBrands, slides, setSlides,
      sliderSettings, setSliderSettings, categorySettings, setCategorySettings, brandSettings, setBrandSettings,
      productsSettings, setProductsSettings, vendorApplications, setVendorApplications, sellerAccounts, setSellerAccounts,
      productSubmissions, setProductSubmissions, handleApplyAsVendor, handleApproveVendorApplication,
      handleRejectVendorApplication, handleToggleSellerStatus, handleUpdateSellerProfile, handleCreateOrUpdateOffer,
      handleDeleteOffer, handleSubmitNewProduct, handleApproveProductSubmission, handleRejectProductSubmission,
      handleDeleteProductSubmission
    }}>{children}</CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within a CatalogProvider');
  return context;
};

