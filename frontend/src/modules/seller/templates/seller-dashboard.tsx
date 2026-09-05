'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/context/StoreContext';
import {
  SellerAccount,
  VendorOffer,
  ProductCondition,
  MockWooProduct,
  VendorProductSubmission
} from '@/types';
import { formatCurrency } from '@/utils/pricing';
import {
  Store,
  Building2,
  Package,
  TrendingUp,
  DollarSign,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  Sliders,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CreditCard,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Eye,
  X,
  FileText,
  Percent,
  Check,
  AlertTriangle,
  Layers,
  ShoppingBag,
  Inbox,
  Star,
  Image as ImageIcon,
  CheckCircle,
  Tag,
  Info,
  Send
} from 'lucide-react';

interface SellerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  province: string;
  orderDate: string;
  status: 'Pending Dispatch' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  courier: string;
  trackingNumber?: string;
  items: {
    productId: string;
    productName: string;
    condition: ProductCondition;
    quantity: number;
    price: number;
    imageUrl: string;
  }[];
  totalAmount: number;
  commissionAmount: number;
  netPayout: number;
}

interface EftPayoutRecord {
  id: string;
  reference: string;
  date: string;
  grossAmount: number;
  commissionFee: number;
  netPaid: number;
  status: 'Paid' | 'Processing' | 'Scheduled';
  bankName: string;
  accountEnding: string;
}

const INITIAL_SELLER_ORDERS: Record<string, SellerOrder[]> = {
  '849201': [
    {
      id: 'sord-101',
      orderNumber: 'ZA-ORD-88219',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.j@gmail.com',
      customerPhone: '+27 82 491 0021',
      shippingAddress: '42 Kloof Street, Gardens',
      city: 'Cape Town',
      province: 'Western Cape',
      orderDate: '2026-08-29T14:30:00Z',
      status: 'Pending Dispatch',
      courier: 'The Courier Guy',
      trackingNumber: 'TCG-882190-ZA',
      items: [
        {
          productId: 'prod-1',
          productName: 'Premium Wireless Headphones',
          condition: 'Brand New',
          quantity: 1,
          price: 1999,
          imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop&fm=webp'
        }
      ],
      totalAmount: 1999,
      commissionAmount: 159.92,
      netPayout: 1839.08
    },
    {
      id: 'sord-102',
      orderNumber: 'ZA-ORD-87941',
      customerName: 'Marcus Ndlovu',
      customerEmail: 'marcus.n@outlook.com',
      customerPhone: '+27 71 883 2910',
      shippingAddress: '15 Sandton Drive, Morningside',
      city: 'Johannesburg',
      province: 'Gauteng',
      orderDate: '2026-08-27T10:15:00Z',
      status: 'Shipped',
      courier: 'DHL Express SA',
      trackingNumber: 'DHL-ZA-992019',
      items: [
        {
          productId: 'prod-1',
          productName: 'Premium Wireless Headphones',
          condition: 'Brand New',
          quantity: 2,
          price: 1999,
          imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop&fm=webp'
        }
      ],
      totalAmount: 3998,
      commissionAmount: 319.84,
      netPayout: 3678.16
    },
    {
      id: 'sord-103',
      orderNumber: 'ZA-ORD-86402',
      customerName: 'Claire Van Zyl',
      customerEmail: 'claire.vz@iafrica.com',
      customerPhone: '+27 83 220 9941',
      shippingAddress: '78 Umhlanga Rocks Dr, Durban North',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      orderDate: '2026-08-22T08:45:00Z',
      status: 'Delivered',
      courier: 'The Courier Guy',
      trackingNumber: 'TCG-864021-ZA',
      items: [
        {
          productId: 'prod-1',
          productName: 'Premium Wireless Headphones',
          condition: 'Brand New',
          quantity: 1,
          price: 1999,
          imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop&fm=webp'
        }
      ],
      totalAmount: 1999,
      commissionAmount: 159.92,
      netPayout: 1839.08
    }
  ],
  '592834': [
    {
      id: 'sord-201',
      orderNumber: 'ZA-ORD-88301',
      customerName: 'Devan Pillay',
      customerEmail: 'devan.p@icloud.com',
      customerPhone: '+27 84 901 2288',
      shippingAddress: '12 Musgrave Rd, Berea',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      orderDate: '2026-08-29T16:20:00Z',
      status: 'Packed',
      courier: 'The Courier Guy',
      trackingNumber: 'TCG-883011-ZA',
      items: [
        {
          productId: 'prod-1',
          productName: 'Premium Wireless Headphones',
          condition: 'Brand New',
          quantity: 1,
          price: 1899,
          imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop&fm=webp'
        }
      ],
      totalAmount: 1899,
      commissionAmount: 189.9,
      netPayout: 1709.1
    }
  ],
  '710492': [
    {
      id: 'sord-301',
      orderNumber: 'ZA-ORD-88410',
      customerName: 'Annelize Coetzee',
      customerEmail: 'annelize.c@gmail.com',
      customerPhone: '+27 82 911 3400',
      shippingAddress: '19 Dorp Street',
      city: 'Stellenbosch',
      province: 'Western Cape',
      orderDate: '2026-08-28T11:00:00Z',
      status: 'Shipped',
      courier: 'Fastway Couriers SA',
      trackingNumber: 'FW-ZA-77192',
      items: [
        {
          productId: 'prod-3',
          productName: 'Retro Film Camera',
          condition: 'Refurbished',
          quantity: 1,
          price: 2750,
          imageUrl: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=600&auto=format&fit=crop&fm=webp'
        }
      ],
      totalAmount: 2750,
      commissionAmount: 275,
      netPayout: 2475
    }
  ]
};

const INITIAL_EFT_RECORDS: Record<string, EftPayoutRecord[]> = {
  '849201': [
    {
      id: 'payout-101',
      reference: 'EFT-ZA-2026-8812',
      date: '2026-08-25',
      grossAmount: 18450,
      commissionFee: 1476,
      netPaid: 16974,
      status: 'Paid',
      bankName: 'First National Bank (FNB)',
      accountEnding: '••• 4721'
    },
    {
      id: 'payout-102',
      reference: 'EFT-ZA-2026-8290',
      date: '2026-08-18',
      grossAmount: 22100,
      commissionFee: 1768,
      netPaid: 20332,
      status: 'Paid',
      bankName: 'First National Bank (FNB)',
      accountEnding: '••• 4721'
    },
    {
      id: 'payout-103',
      reference: 'EFT-ZA-2026-7910',
      date: '2026-08-11',
      grossAmount: 14200,
      commissionFee: 1136,
      netPaid: 13064,
      status: 'Paid',
      bankName: 'First National Bank (FNB)',
      accountEnding: '••• 4721'
    }
  ],
  '592834': [
    {
      id: 'payout-201',
      reference: 'EFT-ZA-2026-9021',
      date: '2026-08-24',
      grossAmount: 12500,
      commissionFee: 1250,
      netPaid: 11250,
      status: 'Paid',
      bankName: 'Standard Bank',
      accountEnding: '••• 9102'
    }
  ]
};

export function SellerDashboard() {
  const {
    currentTheme,
    currentUser,
    setCurrentUser,
    sellerAccounts,
    products,
    productSubmissions,
    categories,
    brands,
    handleCreateOrUpdateOffer,
    handleDeleteOffer,
    handleSubmitNewProduct,
    handleDeleteProductSubmission,
    handleUpdateSellerProfile,
    showToast
  } = useStore();

  // Active seller account uniquely locked to the current authenticated seller/merchant
  const activeSeller = useMemo<SellerAccount>(() => {
    // 1. Direct match by user's assigned sellerId
    if (currentUser?.sellerId) {
      const found = sellerAccounts.find((s) => s.id === currentUser.sellerId);
      if (found) return found;
    }
    // 2. Match by user's email or user ID if registered
    if (currentUser?.email) {
      const found = sellerAccounts.find(
        (s) =>
          s.contactEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
          s.userId === currentUser.id
      );
      if (found) return found;
    }
    // 3. Fallback to the primary active seller in the system
    return (
      sellerAccounts[0] || {
        id: '849201',
        userId: 'usr-seller-01',
        storeName: 'Nova Official Store',
        contactName: 'Liam Botha',
        contactEmail: 'liam@novaofficial.co.za',
        phone: '+27 82 459 1029',
        accountType: 'sa_business',
        taxOrRegistrationId: '2019/482910/07',
        description: 'Direct manufacturer and licensed distributor for Nova acoustics, studio electronics, and audio accessories in South Africa.',
        status: 'active',
        rating: 4.9,
        totalSales: 148500,
        ordersCount: 84,
        activeListingsCount: 18,
        commissionRate: 8,
        joinedDate: 'Jan 2025',
        bankDetails: {
          bankName: 'First National Bank (FNB)',
          accountNumber: '62819384721',
          branchCode: '250655',
          accountHolder: 'Nova Official Distribution Pty Ltd',
          accountType: 'Business Cheque'
        }
      }
    );
  }, [sellerAccounts, currentUser]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'orders' | 'payouts' | 'profile'>('overview');

  // Orders State
  const [ordersMap, setOrdersMap] = useState<Record<string, SellerOrder[]>>(INITIAL_SELLER_ORDERS);
  const currentSellerOrders = ordersMap[activeSeller.id] || [];

  // Payouts State
  const [payoutsMap, setPayoutsMap] = useState<Record<string, EftPayoutRecord[]>>(INITIAL_EFT_RECORDS);
  const currentSellerPayouts = payoutsMap[activeSeller.id] || [];

  // Offer Sub-tabs: Live Offers vs Product Submissions (Admin Review)
  const [offersSubTab, setOffersSubTab] = useState<'live_offers' | 'submissions'>('live_offers');

  // Submissions for this seller
  const mySubmissions = useMemo(() => {
    return productSubmissions.filter((s) => s.sellerId === activeSeller.id);
  }, [productSubmissions, activeSeller.id]);

  const pendingSubmissionsCount = mySubmissions.filter((s) => s.status === 'pending_approval').length;

  // Dual-Method Add Product / Offer Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalTab, setAddModalTab] = useState<'existing' | 'new_product'>('existing');

  // Option 1: Search Existing Products State
  const [existingSearchQuery, setExistingSearchQuery] = useState('');
  const [existingCategoryFilter, setExistingCategoryFilter] = useState<string>('all');
  const [selectedExistingProduct, setSelectedExistingProduct] = useState<MockWooProduct | null>(null);

  // Filtered existing products available on the platform
  const filteredPlatformProducts = useMemo(() => {
    const q = existingSearchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchesCat =
        existingCategoryFilter === 'all' ||
        (p.category && p.category.toLowerCase() === existingCategoryFilter.toLowerCase()) ||
        (p.categoryId && p.categoryId.toString() === existingCategoryFilter);
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
      return matchesCat && matchesQ;
    });
  }, [products, existingSearchQuery, existingCategoryFilter]);

  // Option 2: New Product Submission Form State
  const initialNewProductState = {
    name: '',
    brand: activeSeller.storeName.includes('Nova') ? 'Nova Acoustics' : 'Apex Tech',
    categoryId: 2,
    categoryName: 'Tech & Audio',
    price: 999,
    originalPrice: 1299,
    stockCount: 25,
    condition: 'Brand New' as ProductCondition,
    shippingDays: 2,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop&fm=webp',
    additionalImages: [] as string[],
    tags: 'Electronics, Premium, Warranty',
    sku: '',
    notes: 'Direct manufacturer authenticated stock. Includes complete retail packaging.'
  };

  const [newProductForm, setNewProductForm] = useState(initialNewProductState);

  // Curated Luxury Preset Photos for quick testing
  const LUXURY_IMAGE_PRESETS = [
    { label: 'Pro ANC Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop&fm=webp' },
    { label: 'Titanium Chrono Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop&fm=webp' },
    { label: 'Smart Fitness Band', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop&fm=webp' },
    { label: 'Studio Studio Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop&fm=webp' },
    { label: 'Polarized Sunglasses', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop&fm=webp' },
    { label: 'Artisan Leather Bag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop&fm=webp' }
  ];

  // Offer Creation/Editing Modal (Direct edit or attach)
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<{
    productId: string;
    offerId?: string;
    price: number;
    originalPrice?: number;
    stockCount: number;
    condition: ProductCondition;
    shippingDays: number;
    notes?: string;
  } | null>(null);

  // Profile Edit State
  const [profileFormData, setProfileFormData] = useState<Partial<SellerAccount>>({
    storeName: activeSeller.storeName,
    contactName: activeSeller.contactName,
    contactEmail: activeSeller.contactEmail,
    phone: activeSeller.phone,
    description: activeSeller.description,
    bankDetails: activeSeller.bankDetails || {
      bankName: 'Standard Bank South Africa',
      accountNumber: '1092839182',
      branchCode: '051001',
      accountHolder: 'Nova Tech Distribution Pty Ltd',
      accountType: 'Cheque / Current'
    }
  });

  // Sync profile form when active seller changes
  React.useEffect(() => {
    setProfileFormData({
      storeName: activeSeller.storeName,
      contactName: activeSeller.contactName,
      contactEmail: activeSeller.contactEmail,
      phone: activeSeller.phone,
      description: activeSeller.description,
      bankDetails: activeSeller.bankDetails || {
        bankName: 'Standard Bank South Africa',
        accountNumber: '1092839182',
        branchCode: '051001',
        accountHolder: 'Nova Tech Distribution Pty Ltd',
        accountType: 'Cheque / Current'
      }
    });
  }, [activeSeller]);

  // Offers belonging to this seller across all products
  const sellerOffers = useMemo(() => {
    const list: {
      product: MockWooProduct;
      offer: VendorOffer;
    }[] = [];

    products.forEach((prod) => {
      if (prod.offers && prod.offers.length > 0) {
        prod.offers.forEach((off) => {
          if (off.sellerId === activeSeller.id) {
            list.push({ product: prod, offer: off });
          }
        });
      }
    });
    return list;
  }, [products, activeSeller.id]);

  // Order filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const filteredOrders = currentSellerOrders.filter((ord) => {
    if (orderStatusFilter === 'all') return true;
    return ord.status.toLowerCase().includes(orderStatusFilter.toLowerCase());
  });

  // Calculations for KPI cards
  const totalSalesGMV = activeSeller.totalSales;
  const commissionRate = activeSeller.commissionRate || 10;
  const netEarnings = totalSalesGMV * (1 - commissionRate / 100);
  const pendingOrdersCount = currentSellerOrders.filter((o) => o.status === 'Pending Dispatch' || o.status === 'Packed').length;

  // Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: SellerOrder['status']) => {
    setOrdersMap((prev) => {
      const currentList = prev[activeSeller.id] || [];
      const updated = currentList.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
      return { ...prev, [activeSeller.id]: updated };
    });
    showToast(`Order status updated to "${newStatus}"`, 'success');
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    handleCreateOrUpdateOffer(editingOffer.productId, {
      offerId: editingOffer.offerId,
      sellerId: activeSeller.id,
      sellerName: activeSeller.storeName,
      price: Number(editingOffer.price),
      originalPrice: editingOffer.originalPrice ? Number(editingOffer.originalPrice) : undefined,
      stockCount: Number(editingOffer.stockCount),
      condition: editingOffer.condition,
      shippingDays: Number(editingOffer.shippingDays) || 2,
      notes: editingOffer.notes
    });

    setOfferModalOpen(false);
    setEditingOffer(null);
  };

  const handleOpenAddModal = (initialTab: 'existing' | 'new_product' = 'existing') => {
    setAddModalTab(initialTab);
    setSelectedExistingProduct(null);
    setExistingSearchQuery('');
    setAddModalOpen(true);
  };

  const handleSelectExistingProduct = (prod: MockWooProduct) => {
    setSelectedExistingProduct(prod);
    const basePrice = Number(prod.price.replace(/[^0-9.]/g, '')) || 999;
    const baseOriginal = prod.originalPrice ? Number(prod.originalPrice.replace(/[^0-9.]/g, '')) : undefined;
    setEditingOffer({
      productId: prod.id,
      price: basePrice,
      originalPrice: baseOriginal,
      stockCount: 15,
      condition: 'Brand New',
      shippingDays: 2,
      notes: ''
    });
  };

  const handleSubmitNewProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) {
      showToast('Please enter a product title.', 'error');
      return;
    }
    if (!newProductForm.brand.trim()) {
      showToast('Please enter the product brand.', 'error');
      return;
    }
    if (newProductForm.price <= 0) {
      showToast('Please enter a valid price.', 'error');
      return;
    }

    handleSubmitNewProduct({
      sellerId: activeSeller.id,
      sellerName: activeSeller.storeName,
      sellerEmail: activeSeller.contactEmail,
      name: newProductForm.name.trim(),
      brand: newProductForm.brand.trim(),
      categoryId: newProductForm.categoryId,
      categoryName: newProductForm.categoryName,
      price: Number(newProductForm.price),
      originalPrice: newProductForm.originalPrice ? Number(newProductForm.originalPrice) : undefined,
      stockCount: Number(newProductForm.stockCount) || 10,
      condition: newProductForm.condition,
      shippingDays: Number(newProductForm.shippingDays) || 2,
      description: newProductForm.description.trim() || `${newProductForm.name} - official merchandise distributed with warranty.`,
      imageUrl: newProductForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
      additionalImages: newProductForm.additionalImages,
      tags: newProductForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sku: newProductForm.sku.trim() || `${newProductForm.brand.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      notes: newProductForm.notes.trim()
    });

    setAddModalOpen(false);
    setOffersSubTab('submissions');
    setNewProductForm(initialNewProductState);
  };

  const handleOpenNewOfferModal = () => {
    handleOpenAddModal('existing');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateSellerProfile(activeSeller.id, profileFormData);
    showToast('Store profile & banking details updated.', 'success');
  };

  const handleRequestInstantPayout = () => {
    const availableNet = 4250;
    const newRecord: EftPayoutRecord = {
      id: `payout-${Date.now().toString().slice(-4)}`,
      reference: `EFT-ZA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      grossAmount: availableNet / 0.9,
      commissionFee: (availableNet / 0.9) * 0.1,
      netPaid: availableNet,
      status: 'Processing',
      bankName: activeSeller.bankDetails?.bankName || 'Standard Bank',
      accountEnding: `••• ${(activeSeller.bankDetails?.accountNumber || '8291').slice(-4)}`
    };

    setPayoutsMap((prev) => ({
      ...prev,
      [activeSeller.id]: [newRecord, ...(prev[activeSeller.id] || [])]
    }));

    showToast('EFT Payout request submitted to clearing bank queue!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Top Seller Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
            {/* Store Badge & Switcher */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-slate-900 dark:text-white">
                    {activeSeller.storeName}
                  </h1>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      activeSeller.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                    }`}
                  >
                    {activeSeller.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Merchant ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{activeSeller.id}</strong></span>
                  <span>•</span>
                  <span>Commission: <strong>{activeSeller.commissionRate}%</strong></span>
                </div>
              </div>
            </div>

            {/* Unique Merchant Identity & Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl text-xs border border-slate-200/60 dark:border-slate-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Unique Merchant Account
                </span>
                <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
                  #{activeSeller.id}
                </span>
              </div>

              <Link
                href={`/store/${activeSeller.id}`}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>View Storefront</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Tabs (< lg) */}
          <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'offers'
                  ? 'bg-emerald-600 text-white font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Offers ({sellerOffers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Orders ({currentSellerOrders.length})</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'payouts'
                  ? 'bg-emerald-600 text-white font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Payouts</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Desktop 2-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="lg:grid lg:grid-cols-[250px_1fr] xl:grid-cols-[270px_1fr] lg:gap-8 items-start">
          
          {/* Desktop Left Vertical Navigation Sidebar */}
          <aside className="hidden lg:block sticky top-20 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-3.5 shadow-2xs space-y-3">
            <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Seller Portal
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>Overview &amp; Metrics</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('offers')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'offers'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className={`w-4 h-4 shrink-0 ${activeTab === 'offers' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>My Offers &amp; Stock</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'offers' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {sellerOffers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'orders'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>Orders &amp; Courier</span>
                </div>
                <div className="flex items-center gap-1">
                  {pendingOrdersCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse">
                      {pendingOrdersCount}
                    </span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {currentSellerOrders.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('payouts')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'payouts'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className={`w-4 h-4 shrink-0 ${activeTab === 'payouts' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>Payouts &amp; EFT Bank</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'profile'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building className={`w-4 h-4 shrink-0 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>Store Profile &amp; Policies</span>
                </div>
              </button>
            </nav>

            {/* Merchant Summary in Sidebar */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 px-2 space-y-3">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Merchant Rating</span>
                  <span className="font-black text-amber-500 flex items-center gap-0.5">
                    4.9 <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Commission</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeSeller.commissionRate}% fee</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Payout SLA</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">T+2 Daily EFT</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Merchant Active
                </span>
                <span className="text-slate-400">ZA Regional</span>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="min-w-0 space-y-6">
        {/* TAB 1: OVERVIEW & PERFORMANCE */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Gross GMV Sales</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(totalSalesGMV)}
                </div>
                <div className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% this month</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Net Payouts (Est.)</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(netEarnings)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  After {commissionRate}% marketplace commission
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {pendingOrdersCount}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400/90 mt-1">
                  Require packaging &amp; courier dispatch
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Offers</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {sellerOffers.length}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Listed across {products.length} catalog items
                </div>
              </div>
            </div>

            {/* Quick Actions & Action Required Banner */}
            {pendingOrdersCount > 0 && (
              <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-amber-900 dark:text-amber-200">
                      You have {pendingOrdersCount} order(s) awaiting fulfillment
                    </h3>
                    <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                      Ensure orders are packed and dispatched within 2 working days to maintain your 4.9★ rating.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Open Orders Queue</span>
                </button>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Recent Customer Orders
                  </h3>
                  <p className="text-xs text-slate-500">
                    Latest sales for {activeSeller.storeName}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Orders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Item(s)</th>
                      <th className="p-3 text-right">Order Value</th>
                      <th className="p-3 text-right">Net Payout</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {currentSellerOrders.slice(0, 4).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                          {ord.orderNumber}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{ord.customerName}</div>
                          <div className="text-[10px] text-slate-400">{ord.city}, {ord.province}</div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="truncate max-w-xs">
                              {it.quantity}x {it.productName} ({it.condition})
                            </div>
                          ))}
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                          {formatCurrency(ord.totalAmount)}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(ord.netPayout)}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              ord.status === 'Pending Dispatch'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                                : ord.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                                : ord.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFERS & INVENTORY / SUBMISSIONS */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Inventory, Offers &amp; Product Submissions
                </h3>
                <p className="text-xs text-slate-500">
                  Manage live prices, stock levels, or submit brand new luxury products for marketplace admin approval.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddModal('existing')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Choose Existing Product</span>
                </button>
                <button
                  onClick={() => handleOpenAddModal('new_product')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit New Product</span>
                </button>
              </div>
            </div>

            {/* Sub Tabs Selector */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <button
                onClick={() => setOffersSubTab('live_offers')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                  offersSubTab === 'live_offers'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Live Catalog Offers</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  offersSubTab === 'live_offers'
                    ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {sellerOffers.length}
                </span>
              </button>

              <button
                onClick={() => setOffersSubTab('submissions')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                  offersSubTab === 'submissions'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Product Submissions</span>
                {pendingSubmissionsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                    {pendingSubmissionsCount} pending
                  </span>
                )}
                {pendingSubmissionsCount === 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    offersSubTab === 'submissions'
                      ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {mySubmissions.length}
                  </span>
                )}
              </button>
            </div>

            {/* SUB TAB 1: LIVE OFFERS */}
            {offersSubTab === 'live_offers' && (
              <>
                {sellerOffers.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                    <Package className="w-12 h-12 text-slate-400 mx-auto" />
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No active offers listed yet
                    </div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Attach your inventory offer to an existing Mrbulk catalog item or submit a brand new wholesale/retail product for approval.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => handleOpenAddModal('existing')}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Search Catalog</span>
                      </button>
                      <button
                        onClick={() => handleOpenAddModal('new_product')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Submit New Product</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {sellerOffers.map(({ product, offer }) => (
                      <div
                        key={offer.offerId}
                        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-100"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                {product.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase">
                                {offer.condition}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                              <span>Product ID: <strong>{product.id}</strong></span>
                              <span>•</span>
                              <span>Dispatch SLA: <strong>{offer.shippingDays} Day(s)</strong></span>
                              <span>•</span>
                              <span>Rating: <strong>{offer.rating}★</strong></span>
                            </div>
                            {offer.notes && (
                              <div className="text-[11px] text-slate-400 mt-1 italic">
                                &quot;{offer.notes}&quot;
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 self-end md:self-center">
                          <div className="text-right">
                            <div className="text-xs font-black text-slate-900 dark:text-white">
                              {formatCurrency(offer.price)}
                            </div>
                            {offer.originalPrice && offer.originalPrice > offer.price && (
                              <div className="text-[10px] text-slate-400 line-through">
                                {formatCurrency(offer.originalPrice)}
                              </div>
                            )}
                            <div className="text-[10px] text-slate-500 font-semibold">
                              Stock: <strong className={offer.stockCount < 5 ? 'text-amber-600' : 'text-emerald-600'}>{offer.stockCount} left</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingOffer({
                                  productId: product.id,
                                  offerId: offer.offerId,
                                  price: offer.price,
                                  originalPrice: offer.originalPrice,
                                  stockCount: offer.stockCount,
                                  condition: offer.condition,
                                  shippingDays: offer.shippingDays,
                                  notes: offer.notes
                                });
                                setOfferModalOpen(true);
                              }}
                              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                              title="Edit Offer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(product.id, offer.offerId)}
                              className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title="Delete Offer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* SUB TAB 2: PRODUCT SUBMISSIONS (ADMIN APPROVAL QUEUE) */}
            {offersSubTab === 'submissions' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                    <div className="font-bold">How Product Submissions Work</div>
                    <p className="text-blue-800/80 dark:text-blue-300/80">
                      When you submit a new product not currently in the Mrbulk master catalog, our compliance admin team reviews your media, branding, and pricing. Once approved, the product is published to the live storefront and your store offer is attached automatically.
                    </p>
                  </div>
                </div>

                {mySubmissions.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                    <Send className="w-12 h-12 text-slate-400 mx-auto" />
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No product submissions yet
                    </div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Have a unique luxury product or exclusive SKU? Submit it now for swift verification and marketplace publication.
                    </p>
                    <button
                      onClick={() => handleOpenAddModal('new_product')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Submit Your First Product</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {mySubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={sub.imageUrl}
                              alt={sub.name}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-100"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                  {sub.name}
                                </h4>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase">
                                  {sub.brand}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                                <span>Category: <strong>{sub.categoryName}</strong></span>
                                <span>•</span>
                                <span>SKU: <strong className="font-mono">{sub.sku || 'N/A'}</strong></span>
                                <span>•</span>
                                <span>Submitted: <strong>{new Date(sub.createdAt).toLocaleDateString()}</strong></span>
                              </div>
                              {sub.description && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-1 max-w-xl">
                                  {sub.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 self-end md:self-center">
                            <div className="text-right">
                              <div className="text-xs font-black text-slate-900 dark:text-white">
                                {formatCurrency(sub.price)}
                              </div>
                              {sub.originalPrice && sub.originalPrice > sub.price && (
                                <div className="text-[10px] text-slate-400 line-through">
                                  {formatCurrency(sub.originalPrice)}
                                </div>
                              )}
                              <div className="text-[10px] text-slate-500 font-semibold">
                                Stock: {sub.stockCount} units • {sub.condition}
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                              {sub.status === 'pending_approval' && (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black">
                                  <Clock className="w-3.5 h-3.5 animate-spin" />
                                  <span>Pending Admin Review</span>
                                </div>
                              )}
                              {sub.status === 'approved' && (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approved &amp; Live</span>
                                </div>
                              )}
                              {sub.status === 'rejected' && (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-black">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Rejected</span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteProductSubmission(sub.id)}
                              className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Admin Feedback notes if rejected */}
                        {sub.status === 'rejected' && sub.rejectionReason && (
                          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300">
                            <strong>Admin Feedback:</strong> {sub.rejectionReason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS & FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Orders &amp; Courier Fulfillment
                </h3>
                <p className="text-xs text-slate-500">
                  Track buyer purchases, update fulfillment milestones, and assign courier waybills
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none"
                >
                  <option value="all">All Orders ({currentSellerOrders.length})</option>
                  <option value="Pending Dispatch">Pending Dispatch</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">In Transit / Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <Truck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No orders match the selected filter
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              ord.status === 'Pending Dispatch'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                                : ord.status === 'Packed'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                                : ord.status === 'Shipped'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Ordered: {new Date(ord.orderDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* Status Transition Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {ord.status === 'Pending Dispatch' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Packed')}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark as Packed</span>
                          </button>
                        )}

                        {ord.status === 'Packed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Shipped')}
                            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Dispatch with Courier</span>
                          </button>
                        )}

                        {ord.status === 'Shipped' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Delivery</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Customer & Courier Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Delivery Destination
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {ord.customerName}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                          {ord.shippingAddress}, {ord.city}, {ord.province}
                        </div>
                        <div className="text-slate-400 mt-1 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{ord.customerPhone}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Courier Logistics
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {ord.courier}
                        </div>
                        <div className="font-mono text-slate-600 dark:text-slate-400 mt-0.5">
                          Waybill: {ord.trackingNumber || 'Pending pickup'}
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold mt-1">
                          Insured National Courier Delivery
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Financial Settlement
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Order GMV:</span>
                          <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(ord.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 mt-0.5">
                          <span>Commission ({commissionRate}%):</span>
                          <span>-{formatCurrency(ord.commissionAmount)}</span>
                        </div>
                        <div className="flex justify-between font-black text-emerald-600 dark:text-emerald-400 mt-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                          <span>Net Payout:</span>
                          <span>{formatCurrency(ord.netPayout)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Ordered Items
                      </div>
                      {ord.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={it.imageUrl}
                              alt={it.productName}
                              className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {it.productName}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Condition: {it.condition} • Qty: {it.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="font-black text-slate-900 dark:text-white">
                            {formatCurrency(it.price * it.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PAYOUTS & EFT BANK */}
        {activeTab === 'payouts' && (
          <div className="space-y-6">
            {/* Payout Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Available for EFT Payout
                </div>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCurrency(4250)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Cleared funds ready for weekly disbursement
                </div>
                <button
                  onClick={handleRequestInstantPayout}
                  className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Request Instant EFT Payout</span>
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Lifetime Paid Out
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {formatCurrency(currentSellerPayouts.reduce((acc, p) => acc + p.netPaid, 0) || 49275)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Total electronic bank transfers completed
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Linked South African Bank
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {activeSeller.bankDetails?.bankName || 'Standard Bank SA'}
                </div>
                <div className="font-mono text-xs text-slate-500 mt-0.5">
                  Acc: •••• {(activeSeller.bankDetails?.accountNumber || '8291').slice(-4)} ({activeSeller.bankDetails?.accountType || 'Cheque'})
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-3 block cursor-pointer"
                >
                  Update Banking Details →
                </button>
              </div>
            </div>

            {/* Payouts Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    EFT Payout History &amp; Remittances
                  </h3>
                  <p className="text-xs text-slate-500">
                    Electronic Funds Transfer disbursements processed by Mrbulk Finance
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="p-3">Reference ID</th>
                      <th className="p-3">Disbursement Date</th>
                      <th className="p-3 text-right">Gross GMV</th>
                      <th className="p-3 text-right">Commission Fee</th>
                      <th className="p-3 text-right">Net Amount Paid</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {currentSellerPayouts.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                          {pay.reference}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {new Date(pay.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                          {formatCurrency(pay.grossAmount)}
                        </td>
                        <td className="p-3 text-right text-rose-600 dark:text-rose-400 font-semibold">
                          -{formatCurrency(pay.commissionFee)}
                        </td>
                        <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(pay.netPaid)}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              pay.status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                            }`}
                          >
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE & STORE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6 max-w-4xl">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Store Profile &amp; Banking Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Update how your storefront appears to buyers and where EFT payouts are deposited
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Storefront Identity */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Storefront Branding
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Store Display Name
                    </label>
                    <input
                      type="text"
                      value={profileFormData.storeName || ''}
                      onChange={(e) => setProfileFormData({ ...profileFormData, storeName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={profileFormData.contactName || ''}
                      onChange={(e) => setProfileFormData({ ...profileFormData, contactName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={profileFormData.contactEmail || ''}
                      onChange={(e) => setProfileFormData({ ...profileFormData, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Support Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileFormData.phone || ''}
                      onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store Bio &amp; About Description
                  </label>
                  <textarea
                    rows={3}
                    value={profileFormData.description || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, description: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* South African Banking Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CreditCard className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    South African Bank Details (EFT Payouts)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Name
                    </label>
                    <select
                      value={profileFormData.bankDetails?.bankName || 'Standard Bank South Africa'}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          bankDetails: {
                            bankName: e.target.value,
                            accountNumber: profileFormData.bankDetails?.accountNumber || '',
                            branchCode: profileFormData.bankDetails?.branchCode || '',
                            accountHolder: profileFormData.bankDetails?.accountHolder || '',
                            accountType: profileFormData.bankDetails?.accountType || 'Cheque / Current'
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Standard Bank South Africa">Standard Bank</option>
                      <option value="First National Bank (FNB)">First National Bank (FNB)</option>
                      <option value="ABSA Bank">ABSA Bank</option>
                      <option value="Nedbank">Nedbank</option>
                      <option value="Capitec Bank">Capitec Bank</option>
                      <option value="Investec Private Bank">Investec Private Bank</option>
                      <option value="Discovery Bank">Discovery Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Account Type
                    </label>
                    <select
                      value={profileFormData.bankDetails?.accountType || 'Cheque / Current'}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          bankDetails: {
                            bankName: profileFormData.bankDetails?.bankName || 'Standard Bank South Africa',
                            accountNumber: profileFormData.bankDetails?.accountNumber || '',
                            branchCode: profileFormData.bankDetails?.branchCode || '',
                            accountHolder: profileFormData.bankDetails?.accountHolder || '',
                            accountType: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Cheque / Current">Cheque / Current</option>
                      <option value="Savings">Savings</option>
                      <option value="Transmission">Transmission</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={profileFormData.bankDetails?.accountNumber || ''}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          bankDetails: {
                            bankName: profileFormData.bankDetails?.bankName || 'Standard Bank South Africa',
                            accountNumber: e.target.value,
                            branchCode: profileFormData.bankDetails?.branchCode || '',
                            accountHolder: profileFormData.bankDetails?.accountHolder || '',
                            accountType: profileFormData.bankDetails?.accountType || 'Cheque / Current'
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Branch Code (Universal)
                    </label>
                    <input
                      type="text"
                      value={profileFormData.bankDetails?.branchCode || ''}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          bankDetails: {
                            bankName: profileFormData.bankDetails?.bankName || 'Standard Bank South Africa',
                            accountNumber: profileFormData.bankDetails?.accountNumber || '',
                            branchCode: e.target.value,
                            accountHolder: profileFormData.bankDetails?.accountHolder || '',
                            accountType: profileFormData.bankDetails?.accountType || 'Cheque / Current'
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition cursor-pointer"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          </div>
        )}
          </main>
        </div>
      </div>

      {/* DUAL METHOD ADD PRODUCT / OFFER MODAL */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-5 shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Add Product to Your Inventory
                    </h3>
                    <p className="text-xs text-slate-500">
                      Choose an existing catalog item to sell or submit a brand new luxury product
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAddModalTab('existing');
                    setSelectedExistingProduct(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                    addModalTab === 'existing'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Search className="w-4 h-4 text-emerald-600" />
                  <span>1. Choose Existing Product</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalTab('new_product')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                    addModalTab === 'new_product'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Send className="w-4 h-4 text-blue-600" />
                  <span>2. Submit New Product</span>
                </button>
              </div>

              {/* METHOD 1: SEARCH & CHOOSE EXISTING PRODUCT */}
              {addModalTab === 'existing' && (
                <div className="space-y-4 overflow-y-auto pr-1">
                  {!selectedExistingProduct ? (
                    <div className="space-y-4">
                      {/* Search Bar and Category Filter */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="relative sm:col-span-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search catalog by name, brand, SKU or keyword..."
                            value={existingSearchQuery}
                            onChange={(e) => setExistingSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <select
                            value={existingCategoryFilter}
                            onChange={(e) => setExistingCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="all">All Categories</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id.toString()}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Product Grid Results */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Select a catalog product to sell ({filteredPlatformProducts.length} available)
                        </div>
                        {filteredPlatformProducts.length === 0 ? (
                          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs space-y-2">
                            <div>No matching products found in catalog.</div>
                            <button
                              type="button"
                              onClick={() => setAddModalTab('new_product')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Submit as a new product instead</span>
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                            {filteredPlatformProducts.map((prod) => (
                              <div
                                key={prod.id}
                                onClick={() => handleSelectExistingProduct(prod)}
                                className="group p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-3"
                              >
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-white"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                                    {prod.brand || 'Mrbulk'}
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {prod.name}
                                  </div>
                                  <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 mt-0.5">
                                    {formatCurrency(Number(prod.price.replace(/[^0-9.]/g, '')) || 999)}
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition shrink-0" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Chosen Product Offer Pricing Form */
                    <form onSubmit={handleSaveOffer} className="space-y-4">
                      <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={selectedExistingProduct.imageUrl}
                            alt={selectedExistingProduct.name}
                            className="w-12 h-12 rounded-xl object-cover border border-emerald-200 dark:border-emerald-800 shrink-0 bg-white"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                              Selected Product
                            </span>
                            <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {selectedExistingProduct.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Brand: {selectedExistingProduct.brand || 'Mrbulk'} • ID: {selectedExistingProduct.id}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedExistingProduct(null)}
                          className="px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition cursor-pointer shrink-0"
                        >
                          Change Product
                        </button>
                      </div>

                      {editingOffer && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Your Offer Price (ZAR)
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R</span>
                                <input
                                  type="number"
                                  required
                                  min="1"
                                  step="0.01"
                                  value={editingOffer.price}
                                  onChange={(e) => setEditingOffer({ ...editingOffer, price: Number(e.target.value) })}
                                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Original / MSRP (ZAR)
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R</span>
                                <input
                                  type="number"
                                  min="1"
                                  step="0.01"
                                  value={editingOffer.originalPrice || ''}
                                  onChange={(e) => setEditingOffer({ ...editingOffer, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                                  placeholder="Optional"
                                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Condition Grading
                              </label>
                              <select
                                value={editingOffer.condition}
                                onChange={(e) => setEditingOffer({ ...editingOffer, condition: e.target.value as ProductCondition })}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="Brand New">Brand New</option>
                                <option value="Like New">Like New</option>
                                <option value="Refurbished">Refurbished</option>
                                <option value="Open Box">Open Box</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Available Warehouse Stock
                              </label>
                              <input
                                type="number"
                                required
                                min="1"
                                value={editingOffer.stockCount}
                                onChange={(e) => setEditingOffer({ ...editingOffer, stockCount: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Dispatch SLA (Working Days)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="14"
                              value={editingOffer.shippingDays}
                              onChange={(e) => setEditingOffer({ ...editingOffer, shippingDays: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Offer Notes / Packaging / Warranty
                            </label>
                            <input
                              type="text"
                              value={editingOffer.notes || ''}
                              onChange={(e) => setEditingOffer({ ...editingOffer, notes: e.target.value })}
                              placeholder="e.g. Official distributor unit with full 2-year warranty."
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => setSelectedExistingProduct(null)}
                              className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              onClick={() => setAddModalOpen(false)}
                              className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition cursor-pointer"
                            >
                              Publish Live Offer
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  )}
                </div>
              )}

              {/* METHOD 2: SUBMIT BRAND NEW PRODUCT (FOR ADMIN APPROVAL) */}
              {addModalTab === 'new_product' && (
                <form onSubmit={handleSubmitNewProductForm} className="space-y-4 overflow-y-auto pr-1">
                  <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      This product will be submitted to the <strong>Mrbulk Compliance Admin</strong> queue for verification. Once approved, it appears in the master catalog and your store offer goes live automatically.
                    </p>
                  </div>

                  {/* Product Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Product Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master &amp; Dynamic MW08 Wireless Earbuds"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Brand & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nova Acoustics, Horology Works"
                        value={newProductForm.brand}
                        onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Category *
                      </label>
                      <select
                        value={newProductForm.categoryId}
                        onChange={(e) => {
                          const catId = Number(e.target.value);
                          const catObj = categories.find((c) => c.id === catId);
                          setNewProductForm({
                            ...newProductForm,
                            categoryId: catId,
                            categoryName: catObj ? catObj.name : 'Tech & Audio'
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pricing & Stock */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Selling Price (ZAR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R</span>
                        <input
                          type="number"
                          required
                          min="1"
                          step="0.01"
                          value={newProductForm.price}
                          onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Original MSRP (ZAR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R</span>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Optional"
                          value={newProductForm.originalPrice || ''}
                          onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Initial Stock Qty *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProductForm.stockCount}
                        onChange={(e) => setNewProductForm({ ...newProductForm, stockCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Condition & SLA */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Condition Grading
                      </label>
                      <select
                        value={newProductForm.condition}
                        onChange={(e) => setNewProductForm({ ...newProductForm, condition: e.target.value as ProductCondition })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Brand New">Brand New (Factory Sealed)</option>
                        <option value="Like New">Like New (Mint Condition)</option>
                        <option value="Refurbished">Refurbished (Certified A-Grade)</option>
                        <option value="Open Box">Open Box (Inspected Complete)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Dispatch SLA (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        value={newProductForm.shippingDays}
                        onChange={(e) => setNewProductForm({ ...newProductForm, shippingDays: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Primary Image & Presets */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Product Image (High Resolution URL)
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          required
                          value={newProductForm.imageUrl}
                          onChange={(e) => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      {newProductForm.imageUrl && (
                        <img
                          src={newProductForm.imageUrl}
                          alt="Preview"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-white"
                        />
                      )}
                    </div>

                    {/* Image Preset Pills */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Quick Luxury Image Presets:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {LUXURY_IMAGE_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewProductForm({ ...newProductForm, imageUrl: preset.url })}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/70 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-500 transition cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Product Description &amp; Technical Highlights
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the materials, craftsmanship, key features, and specifications..."
                      value={newProductForm.description}
                      onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Tags and Custom SKU */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Keywords / Search Tags
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wireless, Titanium, Noise-Cancelling"
                        value={newProductForm.tags}
                        onChange={(e) => setNewProductForm({ ...newProductForm, tags: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Merchant Custom SKU (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. NOVA-MW08-BLK"
                        value={newProductForm.sku}
                        onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Submission Footer */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(false)}
                      className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Admin Approval</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT EXISTING OFFER MODAL */}
      <AnimatePresence>
        {offerModalOpen && editingOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Update Product Offer
                  </h3>
                </div>
                <button
                  onClick={() => setOfferModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveOffer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Catalog Product
                  </label>
                  <select
                    disabled
                    value={editingOffer.productId}
                    onChange={(e) => setEditingOffer({ ...editingOffer, productId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-xs font-bold focus:outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.brand || 'Mrbulk'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Offer Price (ZAR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R</span>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={editingOffer.price}
                        onChange={(e) => setEditingOffer({ ...editingOffer, price: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Original / MSRP (ZAR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={editingOffer.originalPrice || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="Optional"
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Condition Grading
                    </label>
                    <select
                      value={editingOffer.condition}
                      onChange={(e) => setEditingOffer({ ...editingOffer, condition: e.target.value as ProductCondition })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Like New">Like New</option>
                      <option value="Refurbished">Refurbished</option>
                      <option value="Open Box">Open Box</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Available Stock Qty
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingOffer.stockCount}
                      onChange={(e) => setEditingOffer({ ...editingOffer, stockCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dispatch SLA (Working Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={editingOffer.shippingDays}
                    onChange={(e) => setEditingOffer({ ...editingOffer, shippingDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Seller Notes / Warranty Details
                  </label>
                  <input
                    type="text"
                    value={editingOffer.notes || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, notes: e.target.value })}
                    placeholder="e.g. Includes 12-month manufacturer warranty and sealed box."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setOfferModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition cursor-pointer"
                  >
                    Save &amp; Update Offer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
