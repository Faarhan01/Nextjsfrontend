'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '../ui/SafeImage';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Plus, 
  Download, 
  MoreVertical, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Crown, 
  BarChart3, 
  Calendar, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Eye, 
  RefreshCw, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  PieChart as PieIcon,
  Activity,
  UserPlus,
  Server,
  Boxes,
  Settings,
  Truck,
  Globe,
  Sliders,
  Percent,
  Check,
  Tag,
  Edit3,
  Trash2,
  Layers,
  Bookmark,
  Image as ImageIcon,
  FolderTree,
  Building2,
  X,
  PlusCircle,
  Copy,
  Star,
  Upload,
  ImagePlus,
  MessageSquare,
  Ticket,
  MessageCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  Bell,
  Zap,
  ThumbsUp,
  Gift,
  Printer,
  FileText,
  Edit,
  ExternalLink,
  Save,
  FileSpreadsheet,
  Minus,
  ShieldAlert,
  Shield,
  Lock,
  Terminal,
  Ban,
  AlertTriangle,
  Key,
  Cpu,
  Bug,
  Megaphone,
  Send,
  KeyRound,
  EyeOff,
  Layout,
  SendHorizontal,
  Inbox,
  FileCode,
  Store
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { UserProfile, ProductsSettings, MockProduct } from '../../types';
import { formatCurrency } from '../../utils/pricing';
import { MockCategoryPreset, MockBrandPreset, MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '../../data/presets';
import { GoogleMarketingHub } from './GoogleMarketingHub';
import { GoogleAnalyticsHub } from './GoogleAnalyticsHub';
import { PayloadHub } from '../payload/PayloadHub';
import { VendorComplianceAdmin } from './VendorComplianceAdmin';
import { getStoredGtmId, setStoredGtmId, initGTM } from '../../utils/gtm';

interface AdminPageProps {
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses: (color: string) => any;
  onNavigate: (page: string) => void;
  showToast: (msg: string) => void;
  currentUser: UserProfile | null;
  onOpenWooConnector?: () => void;
  onOpenSeoInspector?: () => void;
  onOpenExportNextjs?: () => void;
  isConnectedToWoo?: boolean;
  freeShippingThreshold?: number;
  onUpdateFreeShippingThreshold?: (value: number) => void;
  logoText?: string;
  onUpdateLogoText?: (text: string) => void;
  products?: MockProduct[];
  categories?: MockCategoryPreset[];
  brands?: MockBrandPreset[];
  productsSettings?: ProductsSettings;
  onUpdateProductsSettings?: (settings: ProductsSettings) => void;
  onUpdateProducts?: (products: MockProduct[]) => void;
  onUpdateCategories?: (categories: MockCategoryPreset[]) => void;
  onUpdateBrands?: (brands: MockBrandPreset[]) => void;
}

// Initial Mock Customer Database
const INITIAL_CUSTOMERS: UserProfile[] = [
  {
    id: 'usr-1001',
    name: 'Alexander Vance',
    email: 'alexander.vance@luxestore.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    status: 'vip',
    totalOrders: 28,
    totalSpent: 8900.00,
    joinedDate: 'Jan 15, 2025',
    lastActive: '2 mins ago',
    phone: '+1 (555) 992-1083',
    address: { street: '1 Executive Plaza', city: 'New York', state: 'NY', zip: '10001' }
  },
  {
    id: 'usr-1002',
    name: 'Sophia Laurent',
    email: 'sophia.laurent@example.com',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    status: 'vip',
    totalOrders: 14,
    totalSpent: 4250.00,
    joinedDate: 'Feb 02, 2025',
    lastActive: '12 mins ago',
    phone: '+1 (555) 349-2041',
    address: { street: '742 Evergreen Terrace', city: 'Springfield', state: 'OR', zip: '97477' }
  },
  {
    id: 'usr-1003',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    status: 'active',
    totalOrders: 6,
    totalSpent: 1120.00,
    joinedDate: 'Mar 10, 2025',
    lastActive: '1 hour ago',
    phone: '+1 (555) 019-2834',
    address: { street: '123 Luxury Avenue', city: 'Beverly Hills', state: 'CA', zip: '90210' }
  },
  {
    id: 'usr-1004',
    name: 'Elena Rostova',
    email: 'elena.rostova@design.co',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
    status: 'vip',
    totalOrders: 19,
    totalSpent: 6400.00,
    joinedDate: 'Apr 22, 2025',
    lastActive: '3 hours ago',
    phone: '+1 (555) 882-9901',
    address: { street: '88 Design Street', city: 'Chicago', state: 'IL', zip: '60601' }
  },
  {
    id: 'usr-1005',
    name: 'Marcus Chen',
    email: 'm.chen@techventures.io',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    status: 'active',
    totalOrders: 8,
    totalSpent: 1980.00,
    joinedDate: 'May 04, 2025',
    lastActive: 'Yesterday',
    phone: '+1 (555) 234-5678',
    address: { street: '456 Silicon Way', city: 'San Jose', state: 'CA', zip: '95110' }
  },
  {
    id: 'usr-1006',
    name: 'Camila Rodriguez',
    email: 'camila.r@studio.net',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
    status: 'active',
    totalOrders: 5,
    totalSpent: 850.00,
    joinedDate: 'Jun 18, 2025',
    lastActive: '2 days ago',
    phone: '+1 (555) 345-6789',
    address: { street: '12 Ocean Drive', city: 'Miami', state: 'FL', zip: '33139' }
  },
  {
    id: 'usr-1007',
    name: 'David Miller',
    email: 'david.miller@gmail.com',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    status: 'inactive',
    totalOrders: 1,
    totalSpent: 140.00,
    joinedDate: 'Jul 01, 2025',
    lastActive: '2 weeks ago',
    phone: '+1 (555) 456-7890',
    address: { street: '99 Main Street', city: 'Austin', state: 'TX', zip: '78701' }
  },
  {
    id: 'usr-1008',
    name: 'Hannah Abbott',
    email: 'hannah.abbott@creative.org',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    status: 'vip',
    totalOrders: 11,
    totalSpent: 3200.00,
    joinedDate: 'Aug 14, 2025',
    lastActive: '3 days ago',
    phone: '+1 (555) 567-8901',
    address: { street: '303 Artists Lane', city: 'Seattle', state: 'WA', zip: '98101' }
  }
];

// Mock Customer Reviews Database
export interface StoreReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'spam';
  verifiedPurchase: boolean;
  storeReply?: string;
  storeReplyDate?: string;
}

const INITIAL_REVIEWS: StoreReview[] = [
  {
    id: 'rev-101',
    productId: 'prod-1',
    productName: 'Luxe Velvet Accent Armchair',
    productImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600',
    authorName: 'Sophia Laurent',
    authorEmail: 'sophia.laurent@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    rating: 5,
    title: 'Absolute masterpiece of design!',
    comment: 'The velvet texture is incomparably smooth and the gold-finished legs give my lounge an instant editorial look. Fast delivery too!',
    date: 'Aug 02, 2026',
    status: 'approved',
    verifiedPurchase: true,
    storeReply: 'Thank you so much Sophia! We are thrilled to hear the velvet armchair elevates your living room.',
    storeReplyDate: 'Aug 02, 2026'
  },
  {
    id: 'rev-102',
    productId: 'prod-2',
    productName: 'Nordic Minimalist Oak Desk',
    productImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600',
    authorName: 'Marcus Chen',
    authorEmail: 'm.chen@techventures.io',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    rating: 5,
    title: 'Clean aesthetic, exceptional solidity',
    comment: 'Solid white oak wood with precise cable management routing. Built in under 20 minutes.',
    date: 'Jul 29, 2026',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-103',
    productId: 'prod-3',
    productName: 'Acoustic Ceramic Pendant Lamp',
    productImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600',
    authorName: 'Elena Rostova',
    authorEmail: 'elena.rostova@design.co',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
    rating: 4,
    title: 'Warm ambient glow',
    comment: 'Beautiful textured shade. The cord length was slightly long for my ceiling height but easily adjustable.',
    date: 'Jul 25, 2026',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-104',
    productId: 'prod-4',
    productName: 'Titanium Automatic Chronograph',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
    authorName: 'David Vance',
    authorEmail: 'david.vance@example.com',
    rating: 5,
    title: 'Worth every penny',
    comment: 'The movement is whisper quiet and the titanium body is remarkably lightweight.',
    date: 'Aug 03, 2026',
    status: 'pending',
    verifiedPurchase: true
  },
  {
    id: 'rev-105',
    productId: 'prod-1',
    productName: 'Luxe Velvet Accent Armchair',
    productImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600',
    authorName: 'CryptoBot99',
    authorEmail: 'promo@freecrypto.net',
    rating: 1,
    title: 'Claim 100 free tokens!',
    comment: 'Visit our link for instant crypto reward http://spam-link.net',
    date: 'Aug 01, 2026',
    status: 'spam',
    verifiedPurchase: false
  }
];

// Mock Promo Codes & Coupons Database
export interface StoreCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minSpend: number;
  usageCount: number;
  maxUsage: number;
  expiryDate: string;
  isActive: boolean;
  description: string;
}

const INITIAL_COUPONS: StoreCoupon[] = [
  {
    id: 'cpn-1',
    code: 'SUMMER20',
    type: 'percentage',
    value: 20,
    minSpend: 100,
    usageCount: 42,
    maxUsage: 100,
    expiryDate: '2026-08-31',
    isActive: true,
    description: '20% discount on all orders over $100'
  },
  {
    id: 'cpn-2',
    code: 'WELCOME10',
    type: 'fixed',
    value: 10,
    minSpend: 50,
    usageCount: 128,
    maxUsage: 500,
    expiryDate: '2026-12-31',
    isActive: true,
    description: '$10 off for new email subscribers'
  },
  {
    id: 'cpn-3',
    code: 'FREESHIP',
    type: 'shipping',
    value: 0,
    minSpend: 75,
    usageCount: 89,
    maxUsage: 200,
    expiryDate: '2026-10-15',
    isActive: true,
    description: 'Free expedited shipping on orders over $75'
  },
  {
    id: 'cpn-4',
    code: 'VIPLUXE50',
    type: 'fixed',
    value: 50,
    minSpend: 300,
    usageCount: 15,
    maxUsage: 20,
    expiryDate: '2026-09-30',
    isActive: true,
    description: 'Exclusive $50 reward for VIP tier members'
  },
  {
    id: 'cpn-5',
    code: 'BLACKFRIDAY',
    type: 'percentage',
    value: 35,
    minSpend: 200,
    usageCount: 250,
    maxUsage: 250,
    expiryDate: '2025-11-30',
    isActive: false,
    description: 'Seasonal 35% off promotional campaign'
  }
];

// Mock Store Orders Database
export interface AdminOrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sku?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending Payment' | 'Refunded';
  paymentMethod: string;
  shippingCarrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: AdminOrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  staffNotes?: string;
  customerNote?: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'LX-9402',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 019-2834',
    orderDate: 'Aug 03, 2026',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card (Stripe)',
    shippingCarrier: 'FedEx Express',
    trackingNumber: 'FX-9821038491',
    trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=FX-9821038491',
    shippingAddress: {
      street: '123 Luxury Avenue',
      city: 'Beverly Hills',
      state: 'CA',
      zip: '90210',
      country: 'USA'
    },
    items: [
      {
        id: 'item-101',
        productId: 'prod-1',
        name: 'Luxe Velvet Accent Armchair',
        price: 349.00,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600',
        sku: 'ARM-VEL-01'
      },
      {
        id: 'item-102',
        productId: 'prod-2',
        name: 'Nordic Minimalist Desk Setup',
        price: 499.00,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600',
        sku: 'DSK-NOR-02'
      }
    ],
    subtotal: 848.00,
    tax: 67.84,
    shippingCost: 0.00,
    discount: 0.00,
    total: 915.84,
    staffNotes: 'VIP customer order — priority white-glove packaging applied.',
    customerNote: 'Please deliver to rear porch if no answer.'
  },
  {
    id: 'LX-9401',
    customerName: 'Sophia Laurent',
    customerEmail: 'sophia.laurent@example.com',
    customerPhone: '+1 (555) 349-2041',
    orderDate: 'Aug 02, 2026',
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Apple Pay',
    shippingCarrier: 'DHL Express',
    trackingNumber: 'DHL-481902381',
    trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=DHL-481902381',
    shippingAddress: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zip: '97477',
      country: 'USA'
    },
    items: [
      {
        id: 'item-201',
        productId: 'prod-3',
        name: 'Brass Chandelier Architectural Light',
        price: 450.00,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600',
        sku: 'LGT-BRS-03'
      }
    ],
    subtotal: 450.00,
    tax: 36.00,
    shippingCost: 15.00,
    discount: 0.00,
    total: 501.00,
    staffNotes: 'Dispatched via local fulfillment center #2.',
    customerNote: 'Fragile handling required.'
  },
  {
    id: 'LX-9400',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@luxestore.com',
    customerPhone: '+1 (555) 882-9901',
    orderDate: 'July 21, 2026',
    status: 'Processing',
    paymentStatus: 'Pending Payment',
    paymentMethod: 'PayPal Express',
    shippingCarrier: 'USPS Priority Mail',
    trackingNumber: 'USPS-940011189956',
    shippingAddress: {
      street: '88 Design Street',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    items: [
      {
        id: 'item-301',
        productId: 'prod-4',
        name: 'Monolithic Marble Coffee Table',
        price: 320.00,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600',
        sku: 'TBL-MRB-04'
      }
    ],
    subtotal: 320.00,
    tax: 25.60,
    shippingCost: 0.00,
    discount: 0.00,
    total: 345.60,
    staffNotes: 'Awaiting PayPal payment clearance before dispatch.',
    customerNote: ''
  },
  {
    id: 'LX-9399',
    customerName: 'Marcus Chen',
    customerEmail: 'm.chen@techventures.io',
    customerPhone: '+1 (555) 234-5678',
    orderDate: 'July 20, 2026',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card (Stripe)',
    shippingCarrier: 'UPS Ground',
    trackingNumber: '1Z9999999999999999',
    shippingAddress: {
      street: '456 Silicon Way',
      city: 'San Jose',
      state: 'CA',
      zip: '95110',
      country: 'USA'
    },
    items: [
      {
        id: 'item-401',
        productId: 'prod-5',
        name: 'Ergonomic Mesh Task Chair',
        price: 280.00,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?q=80&w=600',
        sku: 'CHR-ERG-05'
      }
    ],
    subtotal: 280.00,
    tax: 22.40,
    shippingCost: 0.00,
    discount: 0.00,
    total: 302.40,
    staffNotes: 'Delivered and confirmed via carrier API signature.',
    customerNote: ''
  }
];

// Mock Analytics Time Series Data
const REVENUE_DATA = [
  { month: 'Jan', revenue: 18400, customers: 120, orders: 310 },
  { month: 'Feb', revenue: 22100, customers: 145, orders: 380 },
  { month: 'Mar', revenue: 26800, customers: 190, orders: 450 },
  { month: 'Apr', revenue: 31500, customers: 230, orders: 520 },
  { month: 'May', revenue: 29400, customers: 210, orders: 490 },
  { month: 'Jun', revenue: 38900, customers: 310, orders: 640 },
  { month: 'Jul', revenue: 44200, customers: 380, orders: 780 }
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Lighting & Decor', value: 42, color: '#2563eb' },
  { name: 'Furniture & Living', value: 28, color: '#10b981' },
  { name: 'Audio & Tech', value: 18, color: '#f59e0b' },
  { name: 'Accessories', value: 12, color: '#ec4899' }
];

export default function AdminPage({
  themeColor,
  getThemeClasses,
  onNavigate,
  showToast,
  currentUser,
  onOpenWooConnector,
  onOpenSeoInspector,
  onOpenExportNextjs,
  isConnectedToWoo,
  freeShippingThreshold = 150,
  onUpdateFreeShippingThreshold,
  logoText = 'Mrbulk',
  onUpdateLogoText,
  products,
  categories,
  brands,
  productsSettings,
  onUpdateProductsSettings,
  onUpdateProducts,
  onUpdateCategories,
  onUpdateBrands
}: AdminPageProps) {
  const currentTheme = getThemeClasses(themeColor);

  // Temporary local state for products settings card in site settings tab
  const [tempProductsSettings, setTempProductsSettings] = useState<ProductsSettings>(() => {
    return productsSettings || {
      globalRetailMarkup: 50,
      globalWholesalePrice: 20,
      minWholesaleQuantity: 6
    };
  });

  useEffect(() => {
    if (productsSettings) {
      setTempProductsSettings(productsSettings);
    }
  }, [productsSettings]);

  const lightBannerBg = {
    blue: 'bg-gradient-to-br from-blue-200/90 via-blue-100/75 to-blue-50/85 dark:from-blue-950/90 dark:via-blue-900/60 dark:to-blue-950/80 border-blue-300/80 dark:border-blue-700/60',
    indigo: 'bg-gradient-to-br from-indigo-200/90 via-indigo-100/75 to-indigo-50/85 dark:from-indigo-950/90 dark:via-indigo-900/60 dark:to-indigo-950/80 border-indigo-300/80 dark:border-indigo-700/60',
    emerald: 'bg-gradient-to-br from-emerald-200/90 via-emerald-100/75 to-emerald-50/85 dark:from-emerald-950/90 dark:via-emerald-900/60 dark:to-emerald-950/80 border-emerald-300/80 dark:border-emerald-700/60',
    rose: 'bg-gradient-to-br from-rose-200/90 via-rose-100/75 to-rose-50/85 dark:from-rose-950/90 dark:via-rose-900/60 dark:to-rose-950/80 border-rose-300/80 dark:border-rose-700/60',
    amber: 'bg-gradient-to-br from-amber-200/90 via-amber-100/75 to-amber-50/85 dark:from-amber-950/90 dark:via-amber-900/60 dark:to-amber-950/80 border-amber-300/80 dark:border-amber-700/60',
    slate: 'bg-gradient-to-br from-slate-200/90 via-slate-100/80 to-slate-50/90 dark:from-slate-800/90 dark:via-slate-850 dark:to-slate-800/80 border-slate-300/90 dark:border-slate-700/70',
  }[themeColor] || 'bg-gradient-to-br from-blue-200/90 via-blue-100/75 to-blue-50/85 dark:from-blue-950/90 dark:via-blue-900/60 dark:to-blue-950/80 border-blue-300/80 dark:border-blue-700/60';

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'customers' | 'vendors' | 'orders' | 'reviews' | 'coupons' | 'analytics' | 'settings' | 'site-settings' | 'security' | 'marketing' | 'outreach' | 'payload'>('overview');
  const [marketingMainTab, setMarketingMainTab] = useState<'emails' | 'google'>('emails');
  const [settingsSubTab, setSettingsSubTab] = useState<'store' | 'site'>('store');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'store' | 'google'>('store');

  // SMTP Settings State
  const [smtpSettings, setSmtpSettings] = useState({
    host: 'smtp.mailgun.org',
    port: '587',
    encryption: 'TLS (STARTTLS)',
    username: 'postmaster@mrbulk.co.za',
    password: 'mrbulk_smtp_secret_pass_88201',
    fromEmail: 'orders@mrbulk.co.za',
    fromName: 'Mrbulk Official Admin',
    status: 'Connected & Verified'
  });
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [smtpTestRecipient, setSmtpTestRecipient] = useState('admin@mrbulk.co.za');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // Email Layouts Management State
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<
    'welcome' | 'order_created' | 'order_completed' | 'order_adjusted' | 'password_reset' | 'promo'
  >('welcome');

  const [emailTemplateCustomizations, setEmailTemplateCustomizations] = useState({
    welcome: {
      subject: 'Welcome to Mrbulk! Your Exclusive Experience Begins',
      bannerText: 'Welcome to the Mrbulk Community',
      accentColor: '#1d4ed8',
      previewBody: 'Thank you for creating your account with Mrbulk. We are delighted to welcome you to our South African retail and wholesale marketplace. Enjoy R150 off your inaugural order with code WELCOME15.'
    },
    order_created: {
      subject: 'Order Confirmation #LX-9402 — Thank You for Your Purchase',
      bannerText: 'Order Received & Verified',
      accentColor: '#059669',
      previewBody: 'We have received your order #LX-9402. Our fulfillment team is carefully preparing your items for express delivery. You will receive tracking updates as soon as your package ships.'
    },
    order_completed: {
      subject: 'Your Order #LX-9402 Has Been Fulfilled & Shipped',
      bannerText: 'Order In Transit via Express Courier',
      accentColor: '#2563eb',
      previewBody: 'Great news! Your order #LX-9402 has been fulfilled and handed over to FedEx Express (Tracking #TRK-882910-US). Estimated delivery is 2 business days.'
    },
    order_adjusted: {
      subject: 'Important Notice: Your Order #LX-9402 Has Been Updated',
      bannerText: 'Order Details Adjusted',
      accentColor: '#d97706',
      previewBody: 'An adjustment or price update was made to your recent order #LX-9402. A partial refund of $45.00 has been credited back to your original payment method.'
    },
    password_reset: {
      subject: 'Password Reset Request for Your Mrbulk Account',
      bannerText: 'Secure Password Reset',
      accentColor: '#e11d48',
      previewBody: 'We received a request to reset the password for your Mrbulk account. Click the button below to establish a new secure password. This link expires in 30 minutes.'
    },
    promo: {
      subject: '✨ Exclusive VIP Offer: 20% Off New Designer Arrivals',
      bannerText: 'VIP Early Access Invitation',
      accentColor: '#7c3aed',
      previewBody: 'As one of our most valued shoppers, enjoy exclusive early access to our Autumn Handcrafted Leather Collection. Save 20% on orders over $200 with code LUXE20.'
    }
  });

  // Marketing Tab State
  const [marketingSubTab, setMarketingSubTab] = useState<'emails' | 'campaigns' | 'subscribers'>('emails');
  const [emailAudience, setEmailAudience] = useState<'all' | 'vip' | 'active' | 'custom'>('all');
  const [customRecipientEmail, setCustomRecipientEmail] = useState('customer@example.com');
  const [composerTemplate, setComposerTemplate] = useState<'welcome' | 'order_created' | 'order_completed' | 'order_adjusted' | 'password_reset' | 'promo' | 'custom'>('promo');
  const [composerSubject, setComposerSubject] = useState('✨ Exclusive VIP Offer: 20% Off New Designer Arrivals');
  const [composerBody, setComposerBody] = useState(
    `Dear Valued Luxe Customer,\n\nWe are excited to share our latest handcrafted arrivals with you. Enjoy an exclusive 20% discount on all orders over $200.\n\nUse Code: LUXE20 at checkout.\n\nThank you for being part of our community!`
  );
  const [attachCouponCode, setAttachCouponCode] = useState('LUXE20');
  const [isSendingMarketingEmail, setIsSendingMarketingEmail] = useState(false);

  // Sent Email Logs State
  const [sentEmailLogs, setSentEmailLogs] = useState([
    { id: 'eml-101', subject: '✨ VIP Autumn Collection Early Access', audience: 'VIP Customers (180)', template: 'VIP Discount Promo', sentDate: 'Today at 10:15 AM', recipientCount: 180, openRate: '74.2%', clickRate: '28.5%', status: 'Delivered' },
    { id: 'eml-102', subject: 'Welcome to Mrbulk - Claim Your R150 Voucher', audience: 'All Customers (1,240)', template: 'Welcome Series', sentDate: 'Yesterday at 14:30', recipientCount: 1240, openRate: '69.8%', clickRate: '31.2%', status: 'Delivered' },
    { id: 'eml-103', subject: 'Order Confirmation #LX-9402', audience: 'Single Customer (john@example.com)', template: 'Order Confirmation', sentDate: '2 days ago', recipientCount: 1, openRate: '100%', clickRate: '100%', status: 'Delivered' }
  ]);

  // Security & Threat Center State
  const [wafStrictMode, setWafStrictMode] = useState(true);
  const [securitySearchQuery, setSecuritySearchQuery] = useState('');
  
  // 1. Bad Words State
  const [badWordsList, setBadWordsList] = useState([
    { id: 'bw-1', word: 'scam', category: 'Fraud Allegation', severity: 'high', count: 18, status: 'blocked', autoFlag: true },
    { id: 'bw-2', word: 'fake', category: 'Counterfeit Allegation', severity: 'high', count: 14, status: 'blocked', autoFlag: true },
    { id: 'bw-3', word: 'stole', category: 'Financial Accusation', severity: 'critical', count: 7, status: 'blocked', autoFlag: true },
    { id: 'bw-4', word: 'cheap knockoff', category: 'Defamation', severity: 'high', count: 9, status: 'blocked', autoFlag: true },
    { id: 'bw-5', word: 'garbage', category: 'Abuse', severity: 'medium', count: 11, status: 'flagged', autoFlag: false },
    { id: 'bw-6', word: 'damn', category: 'Profanity', severity: 'low', count: 22, status: 'flagged', autoFlag: false }
  ]);
  const [newBadWordInput, setNewBadWordInput] = useState('');
  const [newBadWordCategory, setNewBadWordCategory] = useState('Abuse');
  const [newBadWordSeverity, setNewBadWordSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  // Flagged Review Snippets Feed
  const [flaggedReviewSnippets, setFlaggedReviewSnippets] = useState([
    { id: 'frs-1', reviewId: 'rev-109', author: 'Anonymous Buyer (IP 185.220.101.4)', text: 'This product is a total scam and stole my money!', wordMatched: 'scam', date: '12 mins ago', status: 'held' },
    { id: 'frs-2', reviewId: 'rev-112', author: 'bot_spammer_99', text: 'Fake item garbage quality damn vendor do not buy', wordMatched: 'fake', date: '1 hour ago', status: 'blocked' },
    { id: 'frs-3', reviewId: 'rev-115', author: 'john_doe_test', text: 'Feels like a cheap knockoff compared to genuine leather.', wordMatched: 'cheap knockoff', date: '3 hours ago', status: 'held' }
  ]);

  // 2. Hack Attempts (WAF Logs) State
  const [hackAttemptsList, setHackAttemptsList] = useState([
    { id: 'hk-101', timestamp: 'Today at 02:14:02', attackType: 'SQL Injection (SQLi)', targetUrl: "/api/products?id=1' OR 1=1--", originIp: '185.220.101.5', country: 'Ukraine 🇺🇦', status: 'Blocked by WAF', severity: 'Critical', userAgent: 'Mozilla/5.0 (sqlmap/1.6.12#stable)' },
    { id: 'hk-102', timestamp: 'Today at 01:52:19', attackType: 'Cross-Site Scripting (XSS)', targetUrl: '/admin/reviews?title=<script>document.cookie</script>', originIp: '194.26.29.112', country: 'Russia 🇷🇺', status: 'Blocked by WAF', severity: 'High', userAgent: 'Python-urllib/3.10' },
    { id: 'hk-103', timestamp: 'Yesterday at 23:40:11', attackType: 'Directory Traversal Payload', targetUrl: '/api/download?file=../../../../etc/passwd', originIp: '45.154.255.87', country: 'Netherlands 🇳🇱', status: 'Blocked by WAF', severity: 'Critical', userAgent: 'Nmap Scripting Engine' },
    { id: 'hk-104', timestamp: 'Yesterday at 21:05:40', attackType: 'Admin Brute Force Login', targetUrl: '/api/admin/auth (85 failed attempts)', originIp: '103.152.220.12', country: 'Vietnam 🇻🇳', status: 'IP Banned (24h)', severity: 'Critical', userAgent: 'Hydra v9.2' },
    { id: 'hk-105', timestamp: 'Yesterday at 18:30:15', attackType: 'Remote Code Execution (RCE)', targetUrl: '/api/upload?cmd=$(whoami)', originIp: '192.241.220.40', country: 'United States 🇺🇸', status: 'Blocked by WAF', severity: 'Critical', userAgent: 'Go-http-client/1.1' }
  ]);

  // 3. Suspicious Behavior State
  const [suspiciousBehaviorsList, setSuspiciousBehaviorsList] = useState([
    { id: 'susp-201', timestamp: '12 mins ago', user: 'usr-9041 (anon_checkout_412)', riskScore: 92, behaviorType: 'High Velocity Carding Attack', details: '14 failed card checkout attempts with 12 different credit cards in 3 minutes', ip: '198.51.100.45', location: 'Frankfurt, DE 🇩🇪', actionTaken: 'Checkout Session Locked & IP Banned', status: 'critical' },
    { id: 'susp-202', timestamp: '45 mins ago', user: 'usr-8812 (promo_hunter_x)', riskScore: 84, behaviorType: 'Coupon Code Brute Forcing', details: 'Automated submission of 65 invalid coupon code payloads in 90 seconds', ip: '185.191.171.18', location: 'Warsaw, PL 🇵🇱', actionTaken: 'Rate Limit Applied (429 Too Many Requests)', status: 'high' },
    { id: 'susp-203', timestamp: '2 hours ago', user: 'usr-1002 (David Miller)', riskScore: 78, behaviorType: 'Impossible Travel Login Anomaly', details: 'Login from New York, USA followed 5 mins later by login from Tokyo, JP', ip: '104.28.192.22', location: 'Tokyo, JP 🇯🇵', actionTaken: '2FA Re-verification Mandatory', status: 'high' },
    { id: 'susp-204', timestamp: '4 hours ago', user: 'usr-7719 (bot_crawler_node)', riskScore: 75, behaviorType: 'Aggressive Product Scraping', details: 'Scraped 450 product pages and inventory API endpoints in 20 seconds', ip: '23.95.122.8', location: 'Chicago, USA 🇺🇸', actionTaken: 'CAPTCHA Challenge Issued', status: 'medium' },
    { id: 'susp-205', timestamp: '6 hours ago', user: 'usr-3301 (temp_mail_buyer)', riskScore: 68, behaviorType: 'Disposable Email & TOR Proxy Reg', details: 'Registered using throwaway domain @10minutemail.com behind anonymous TOR proxy', ip: '185.220.101.4', location: 'Zurich, CH 🇨🇭', actionTaken: 'Order Placed on Manual Fraud Hold', status: 'medium' }
  ]);

  // Security handlers
  const handleAddBadWord = () => {
    if (!newBadWordInput.trim()) return;
    const term = newBadWordInput.trim().toLowerCase();
    if (badWordsList.some(bw => bw.word.toLowerCase() === term)) {
      showToast(`"${term}" is already in the bad words list!`);
      return;
    }
    const newEntry = {
      id: `bw-${Date.now()}`,
      word: term,
      category: newBadWordCategory,
      severity: newBadWordSeverity,
      count: 0,
      status: 'blocked',
      autoFlag: true
    };
    setBadWordsList([newEntry, ...badWordsList]);
    setNewBadWordInput('');
    showToast(`Added "${term}" to prohibited bad words filter!`);
  };

  const handleDeleteBadWord = (id: string, word: string) => {
    setBadWordsList(badWordsList.filter(bw => bw.id !== id));
    showToast(`Removed "${word}" from prohibited bad words filter.`);
  };

  const handleBanIp = (ip: string) => {
    showToast(`IP Address ${ip} has been permanently blocked in WAF Firewall rules!`);
  };

  const handleDismissSuspicious = (id: string) => {
    setSuspiciousBehaviorsList(suspiciousBehaviorsList.filter(s => s.id !== id));
    showToast('Suspicious behavior alert resolved and cleared.');
  };

  // Reviews Management State
  const [reviewsList, setReviewsList] = useState<StoreReview[]>(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('luxestore_admin_reviews', JSON.stringify(reviewsList));
    } catch (e) {}
  }, [reviewsList]);

  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<string>('all');
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | 'approved' | 'pending' | 'spam'>('all');
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState('');
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    productId: '',
    authorName: '',
    authorEmail: '',
    rating: 5,
    title: '',
    comment: ''
  });

  // Coupons & Promo Codes State
  const [couponsList, setCouponsList] = useState<StoreCoupon[]>(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_coupons');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_COUPONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('luxestore_admin_coupons', JSON.stringify(couponsList));
    } catch (e) {}
  }, [couponsList]);

  const [couponSearch, setCouponSearch] = useState('');
  const [couponStatusFilter, setCouponStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<StoreCoupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'shipping',
    value: 15,
    minSpend: 50,
    maxUsage: 100,
    expiryDate: '2026-12-31',
    description: ''
  });

  // Extended Site Settings State
  const [paymentGateways, setPaymentGateways] = useState(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_gateways');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      stripe: true,
      bankPayment: true,
      paypal: false,
      applePay: true,
      cod: false,
      klarna: true
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('luxestore_admin_gateways', JSON.stringify(paymentGateways));
    } catch (e) {}
  }, [paymentGateways]);

  // Bank Details State for EFT Transfers
  const [bankDetails, setBankDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('mrbulk_admin_bank_details') || localStorage.getItem('luxestore_admin_bank_details');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      bankName: 'First National Bank (FNB)',
      accountName: 'Mr Cheap General Dealer ZA (Mrbulk)',
      accountNumber: '62894102948',
      branchCode: '250655',
      accountType: 'Cheque Account',
      referenceInstructions: 'Use your Order Number (e.g. MB-10294) as reference'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('mrbulk_admin_bank_details', JSON.stringify(bankDetails));
    } catch (e) {}
  }, [bankDetails]);

  const [emailNotifications, setEmailNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_email_notifs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      orderConfirmation: true,
      dispatchTracking: true,
      lowStockAlert: true,
      reviewInvites: true
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('luxestore_admin_email_notifs', JSON.stringify(emailNotifications));
    } catch (e) {}
  }, [emailNotifications]);

  // Store Orders Management State
  const [ordersList, setOrdersList] = useState<AdminOrder[]>(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('luxestore_admin_orders', JSON.stringify(ordersList));
    } catch (e) {}
  }, [ordersList]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<'all' | 'Paid' | 'Pending Payment' | 'Refunded'>('all');
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<AdminOrder | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<AdminOrder | null>(null);
  const [newItemProductId, setNewItemProductId] = useState('');

  // Recalculate order totals helper
  const recalculateOrderTotals = (order: AdminOrder): AdminOrder => {
    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.max(0, subtotal + tax + (order.shippingCost || 0) - (order.discount || 0));
    return {
      ...order,
      subtotal,
      tax,
      total
    };
  };

  const handleUpdateEditingOrder = (updatedFields: Partial<AdminOrder>) => {
    if (!selectedOrderForEdit) return;
    const updated = recalculateOrderTotals({
      ...selectedOrderForEdit,
      ...updatedFields
    });
    setSelectedOrderForEdit(updated);
  };

  const handleUpdateOrderItemQuantity = (itemId: string, delta: number) => {
    if (!selectedOrderForEdit) return;
    const updatedItems = selectedOrderForEdit.items.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    handleUpdateEditingOrder({ items: updatedItems });
  };

  const handleRemoveOrderItem = (itemId: string) => {
    if (!selectedOrderForEdit) return;
    const updatedItems = selectedOrderForEdit.items.filter(item => item.id !== itemId);
    handleUpdateEditingOrder({ items: updatedItems });
  };

  const handleAddProductToOrder = () => {
    if (!selectedOrderForEdit || !newItemProductId) return;
    const prodToAdd = catalogProducts.find(p => p.id === newItemProductId);
    if (!prodToAdd) return;

    const existingIndex = selectedOrderForEdit.items.findIndex(i => i.productId === prodToAdd.id);
    let updatedItems = [...selectedOrderForEdit.items];

    if (existingIndex >= 0) {
      updatedItems[existingIndex].quantity += 1;
    } else {
      updatedItems.push({
        id: 'item-' + Date.now(),
        productId: prodToAdd.id,
        name: prodToAdd.name,
        price: Number(prodToAdd.price) || 0,
        quantity: 1,
        imageUrl: prodToAdd.imageUrl,
        sku: 'SKU-' + prodToAdd.id.toUpperCase()
      });
    }

    handleUpdateEditingOrder({ items: updatedItems });
    setNewItemProductId('');
    showToast(`Added "${prodToAdd.name}" to Order #${selectedOrderForEdit.id}`);
  };

  const handleSaveOrderChanges = () => {
    if (!selectedOrderForEdit) return;
    setOrdersList(prev => prev.map(o => o.id === selectedOrderForEdit.id ? selectedOrderForEdit : o));
    showToast(`Order #${selectedOrderForEdit.id} successfully updated!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to delete Order #${orderId}?`)) {
      setOrdersList(prev => prev.filter(o => o.id !== orderId));
      if (selectedOrderForEdit?.id === orderId) {
        setSelectedOrderForEdit(null);
      }
      showToast(`Order #${orderId} deleted`);
    }
  };

  const handleDownloadInvoice = (order: AdminOrder) => {
    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #${order.id} - ${logoText}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 40px; background: #fff; margin: 0; }
    .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 32px; }
    .logo { font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { margin: 0; font-size: 24px; color: #475569; }
    .invoice-title p { margin: 4px 0 0 0; color: #94a3b8; font-size: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
    .box h3 { margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
    .box p { margin: 2px 0; font-size: 14px; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { text-align: left; padding: 12px 16px; background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .totals { width: 300px; margin-left: auto; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #475569; }
    .totals-row.grand { border-top: 2px solid #0f172a; font-size: 18px; font-weight: 800; color: #0f172a; padding-top: 12px; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .paid { background: #dcfce7; color: #166534; }
    .pending { background: #fef3c7; color: #92400e; }
    .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo">${logoText}</div>
        <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Official Tax Invoice & Receipt</p>
      </div>
      <div class="invoice-title">
        <h1>INVOICE #${order.id}</h1>
        <p>Date: ${order.orderDate}</p>
        <div style="margin-top: 8px;">
          <span class="badge ${order.paymentStatus === 'Paid' ? 'paid' : 'pending'}">${order.paymentStatus}</span>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="box">
        <h3>Billed To (Customer)</h3>
        <p style="font-weight: 700; color: #0f172a;">${order.customerName}</p>
        <p>${order.customerEmail}</p>
        <p>${order.customerPhone}</p>
        <p style="margin-top: 8px;">${order.shippingAddress.street}</p>
        <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
        <p>${order.shippingAddress.country}</p>
      </div>
      <div class="box">
        <h3>Order Logistics</h3>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Order Status:</strong> ${order.status}</p>
        <p><strong>Carrier:</strong> ${order.shippingCarrier || 'Standard Delivery'}</p>
        <p><strong>Tracking No:</strong> ${order.trackingNumber || 'Pending'}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th>SKU</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td><strong>${item.name}</strong></td>
            <td style="color: #64748b; font-family: monospace;">${item.sku || 'N/A'}</td>
            <td style="text-align: right;">$${item.price.toFixed(2)}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right; font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>$${order.subtotal.toFixed(2)}</span>
      </div>
      ${order.discount > 0 ? `
      <div class="totals-row" style="color: #16a34a;">
        <span>Discount</span>
        <span>-$${order.discount.toFixed(2)}</span>
      </div>
      ` : ''}
      <div class="totals-row">
        <span>Tax</span>
        <span>$${order.tax.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>Shipping Cost</span>
        <span>${order.shippingCost === 0 ? 'FREE' : '$' + order.shippingCost.toFixed(2)}</span>
      </div>
      <div class="totals-row grand">
        <span>Total Paid</span>
        <span>$${order.total.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for shopping with ${logoText}! If you have questions about this order, contact support.</p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Official Invoice for Order #${order.id}`);
  };

  // Product Catalog Sub-Tab State
  const [productSubTab, setProductSubTab] = useState<'products' | 'categories' | 'brands' | 'tags'>('products');

  // Catalog State initialized from props or presets
  const [catalogProducts, setCatalogProducts] = useState<MockProduct[]>(() => products || MOCK_PRODUCTS);
  const [catalogCategories, setCatalogCategories] = useState<MockCategoryPreset[]>(() => categories || MOCK_CATEGORIES);
  const [catalogBrands, setCatalogBrands] = useState<MockBrandPreset[]>(() => brands || MOCK_BRANDS);

  // Sync with props
  useEffect(() => {
    if (products) setCatalogProducts(products);
  }, [products]);

  useEffect(() => {
    if (categories) setCatalogCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (brands) setCatalogBrands(brands);
  }, [brands]);

  // Handler helpers
  const handleSetProducts = (newProds: MockProduct[]) => {
    setCatalogProducts(newProds);
    if (onUpdateProducts) onUpdateProducts(newProds);
  };

  const handleSetCategories = (newCats: MockCategoryPreset[]) => {
    setCatalogCategories(newCats);
    if (onUpdateCategories) onUpdateCategories(newCats);
  };

  const handleSetBrands = (newBrands: MockBrandPreset[]) => {
    setCatalogBrands(newBrands);
    if (onUpdateBrands) onUpdateBrands(newBrands);
  };

  // Product Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productBrandFilter, setProductBrandFilter] = useState<string>('all');
  const [productFilterStatus, setProductFilterStatus] = useState<'all' | 'sale' | 'featured'>('all');

  // Modals State for Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MockProduct | null>(null);
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    price: '',
    costPrice: '',
    retailPrice: '',
    retailMarkupPrice: '',
    wholesalePrice: '',
    originalPrice: '',
    isFeatured: false,
    imageUrl: '',
    galleryImages: [] as string[],
    newGalleryUrl: '',
    stock: 0,
    categoryId: 0,
    brandId: 0,
    brand: 'No brand',
    tagsString: '',
    description: ''
  });

  const handleCostPriceChange = (costStr: string) => {
    const costNum = parseFloat(costStr);
    if (!isNaN(costNum) && costNum > 0) {
      const gRetail = productsSettings?.globalRetailMarkup ?? tempProductsSettings.globalRetailMarkup ?? 50;
      const gWholesale = productsSettings?.globalWholesalePrice ?? tempProductsSettings.globalWholesalePrice ?? 20;
      const calculatedRetail = (costNum * (1 + gRetail / 100)).toFixed(2);
      const calculatedWholesale = (costNum * (1 + gWholesale / 100)).toFixed(2);

      setProductForm(prev => ({
        ...prev,
        costPrice: costStr,
        retailMarkupPrice: calculatedRetail,
        retailPrice: calculatedRetail,
        wholesalePrice: calculatedWholesale,
        price: calculatedWholesale
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        costPrice: costStr
      }));
    }
  };

  // Helper to compress image files before storing as data URLs to prevent hitting localStorage quota limits
  const compressImageFile = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve((e.target?.result as string) || '');
          }
        };
        img.onerror = () => resolve((e.target?.result as string) || '');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Helper handlers for product image uploads and gallery management
  const handleMainImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedDataUrl = await compressImageFile(file);
      if (compressedDataUrl) {
        setProductForm(prev => ({
          ...prev,
          imageUrl: compressedDataUrl,
          galleryImages: prev.galleryImages.length === 0 ? [compressedDataUrl] : prev.galleryImages
        }));
      }
    }
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const compressedDataUrl = await compressImageFile(file);
          if (compressedDataUrl) {
            setProductForm(prev => ({
              ...prev,
              galleryImages: [...prev.galleryImages, compressedDataUrl]
            }));
          }
        }
      }
    }
  };

  const handleAddGalleryUrl = () => {
    if (!productForm.newGalleryUrl.trim()) return;
    setProductForm(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, prev.newGalleryUrl.trim()],
      newGalleryUrl: ''
    }));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  // Helper handlers for category and brand image uploads
  const handleCategoryImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.85);
      if (compressedDataUrl) {
        setCategoryForm(prev => ({
          ...prev,
          imageUrl: compressedDataUrl
        }));
      }
    }
  };

  const handleBrandImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedDataUrl = await compressImageFile(file, 600, 600, 0.85);
      if (compressedDataUrl) {
        setBrandForm(prev => ({
          ...prev,
          imageUrl: compressedDataUrl
        }));
      }
    }
  };

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MockCategoryPreset | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    id: 0,
    name: '',
    imageUrl: '',
    description: '',
    icon: ''
  });

  // Brand Modal State
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<MockBrandPreset | null>(null);
  const [brandForm, setBrandForm] = useState({
    id: 0,
    name: '',
    imageUrl: ''
  });

  // Tag Modal State
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Derived unique tags from current products
  const uniqueTagsList: string[] = Array.from(
    new Set(catalogProducts.flatMap(p => p.tags || []))
  );

  // Review Handlers
  const handleToggleReviewStatus = (id: string, nextStatus: 'approved' | 'pending' | 'spam') => {
    setReviewsList(prev => prev.map(rev => rev.id === id ? { ...rev, status: nextStatus } : rev));
    showToast(`Review status updated to ${nextStatus.toUpperCase()}`);
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setReviewsList(prev => prev.filter(rev => rev.id !== id));
      showToast('Review permanently deleted');
    }
  };

  const handleSaveReviewReply = (id: string) => {
    if (!replyInputText.trim()) return;
    setReviewsList(prev => prev.map(rev => {
      if (rev.id === id) {
        return {
          ...rev,
          storeReply: replyInputText.trim(),
          storeReplyDate: 'Just now'
        };
      }
      return rev;
    }));
    setReplyingReviewId(null);
    setReplyInputText('');
    showToast('Store response posted to customer review');
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.productId || !newReviewForm.authorName || !newReviewForm.title || !newReviewForm.comment) {
      showToast('Please fill out all required review fields.');
      return;
    }
    const matchedProduct = catalogProducts.find(p => p.id === newReviewForm.productId) || catalogProducts[0];
    const createdReview: StoreReview = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      productId: matchedProduct.id,
      productName: matchedProduct.name,
      productImage: matchedProduct.imageUrl,
      authorName: newReviewForm.authorName,
      authorEmail: newReviewForm.authorEmail || 'customer@example.com',
      rating: Number(newReviewForm.rating),
      title: newReviewForm.title,
      comment: newReviewForm.comment,
      date: 'Just now',
      status: 'approved',
      verifiedPurchase: true
    };
    setReviewsList([createdReview, ...reviewsList]);
    setShowAddReviewModal(false);
    setNewReviewForm({ productId: '', authorName: '', authorEmail: '', rating: 5, title: '', comment: '' });
    showToast(`Posted verified review for "${matchedProduct.name}"`);
  };

  // Coupon Handlers
  const handleToggleCouponActive = (id: string) => {
    setCouponsList(prev => prev.map(c => {
      if (c.id === id) {
        const nextState = !c.isActive;
        showToast(`Promo code "${c.code}" ${nextState ? 'activated' : 'deactivated'}`);
        return { ...c, isActive: nextState };
      }
      return c;
    }));
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete promo code "${code}"?`)) {
      setCouponsList(prev => prev.filter(c => c.id !== id));
      showToast(`Deleted promo code "${code}"`);
    }
  };

  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({
      code: '',
      type: 'percentage',
      value: 15,
      minSpend: 50,
      maxUsage: 100,
      expiryDate: '2026-12-31',
      description: ''
    });
    setShowCouponModal(true);
  };

  const handleOpenEditCoupon = (coupon: StoreCoupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minSpend: coupon.minSpend,
      maxUsage: coupon.maxUsage,
      expiryDate: coupon.expiryDate,
      description: coupon.description
    });
    setShowCouponModal(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedCode = couponForm.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!formattedCode) {
      showToast('A valid promo code is required.');
      return;
    }

    if (editingCoupon) {
      setCouponsList(prev => prev.map(c => {
        if (c.id === editingCoupon.id) {
          return {
            ...c,
            code: formattedCode,
            type: couponForm.type,
            value: Number(couponForm.value) || 0,
            minSpend: Number(couponForm.minSpend) || 0,
            maxUsage: Number(couponForm.maxUsage) || 1,
            expiryDate: couponForm.expiryDate,
            description: couponForm.description || `${formattedCode} promo offer`
          };
        }
        return c;
      }));
      showToast(`Updated promo code "${formattedCode}"`);
    } else {
      const newCoupon: StoreCoupon = {
        id: `cpn-${Date.now().toString().slice(-4)}`,
        code: formattedCode,
        type: couponForm.type,
        value: Number(couponForm.value) || 0,
        minSpend: Number(couponForm.minSpend) || 0,
        usageCount: 0,
        maxUsage: Number(couponForm.maxUsage) || 100,
        expiryDate: couponForm.expiryDate,
        isActive: true,
        description: couponForm.description || `${formattedCode} promo code offer`
      };
      setCouponsList([newCoupon, ...couponsList]);
      showToast(`Created new promo code "${formattedCode}"`);
    }
    setShowCouponModal(false);
  };

  // Filtered Products
  const filteredProductsList = catalogProducts.filter(p => {
    const searchLower = productSearch.toLowerCase();
    const matchesSearch = !productSearch || 
      p.name.toLowerCase().includes(searchLower) ||
      p.brand?.toLowerCase().includes(searchLower) ||
      p.tags?.some(t => t.toLowerCase().includes(searchLower)) ||
      p.description?.toLowerCase().includes(searchLower);

    const matchesCategory = productCategoryFilter === 'all' || p.categoryId === Number(productCategoryFilter);
    const matchesBrand = productBrandFilter === 'all' || (productBrandFilter === '0' ? (p.brandId === 0 || p.brand === 'No brand') : (p.brandId === Number(productBrandFilter) || p.brand === productBrandFilter));
    
    let matchesStatus = true;
    if (productFilterStatus === 'sale') matchesStatus = !!p.isSale;
    if (productFilterStatus === 'featured') matchesStatus = !!p.isFeatured;

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  // Handlers for Products
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      id: `prod-${Date.now().toString().slice(-4)}`,
      name: '',
      price: '',
      costPrice: '',
      retailPrice: '',
      retailMarkupPrice: '',
      wholesalePrice: '',
      originalPrice: '',
      isFeatured: false,
      imageUrl: '',
      galleryImages: [],
      newGalleryUrl: '',
      stock: 0,
      categoryId: 0,
      brandId: 0,
      brand: 'No brand',
      tagsString: '',
      description: ''
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: MockProduct) => {
    setEditingProduct(prod);
    const cleanPrice = prod.price ? prod.price.replace(/[^0-9.]/g, '') : '';
    const cleanCost = prod.costPrice ? prod.costPrice.replace(/[^0-9.]/g, '') : '';
    const cleanRetail = (prod.retailMarkupPrice || prod.retailPrice) ? (prod.retailMarkupPrice || prod.retailPrice)!.replace(/[^0-9.]/g, '') : '';
    const cleanWholesale = prod.wholesalePrice ? prod.wholesalePrice.replace(/[^0-9.]/g, '') : cleanPrice;

    setProductForm({
      id: prod.id,
      name: prod.name,
      price: cleanPrice,
      costPrice: cleanCost,
      retailPrice: cleanRetail,
      retailMarkupPrice: cleanRetail,
      wholesalePrice: cleanWholesale,
      originalPrice: prod.originalPrice ? prod.originalPrice.replace(/[^0-9.]/g, '') : '',
      isFeatured: !!prod.isFeatured,
      imageUrl: prod.imageUrl || '',
      galleryImages: prod.images && prod.images.length > 0 ? [...prod.images] : (prod.imageUrl ? [prod.imageUrl] : []),
      newGalleryUrl: '',
      stock: prod.stock !== undefined ? prod.stock : 0,
      categoryId: prod.categoryId !== undefined ? prod.categoryId : 0,
      brandId: prod.brandId !== undefined ? prod.brandId : (prod.brand === 'No brand' || !prod.brand ? 0 : catalogBrands[0]?.id || 1),
      brand: prod.brand || 'No brand',
      tagsString: prod.tags ? prod.tags.join(', ') : '',
      description: prod.description || ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || (!productForm.price && !productForm.wholesalePrice)) {
      showToast('Please provide a name and price.');
      return;
    }

    const tagsArr = productForm.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const bIdNum = Number(productForm.brandId);
    const selectedBrandObj = bIdNum === 0 ? null : catalogBrands.find(b => b.id === bIdNum);
    const resolvedBrandName = bIdNum === 0 ? 'No brand' : (selectedBrandObj?.name || productForm.brand || 'No brand');

    // Prices calculation
    const costVal = parseFloat(productForm.costPrice) || 0;
    const retailVal = parseFloat(productForm.retailMarkupPrice || productForm.retailPrice) || 0;
    const wholesaleVal = parseFloat(productForm.wholesalePrice) || 0;
    const sellingPriceVal = wholesaleVal > 0 ? wholesaleVal : (parseFloat(productForm.price) || 0);

    // Automatic sale badge calculation
    const origPriceVal = productForm.originalPrice ? parseFloat(productForm.originalPrice) || 0 : 0;
    const isAutoSale = origPriceVal > sellingPriceVal;
    
    let autoPercentOff = 0;
    if (isAutoSale && origPriceVal > 0) {
      autoPercentOff = Math.round(((origPriceVal - sellingPriceVal) / origPriceVal) * 100);
    }
    const autoBadgeText = isAutoSale && autoPercentOff > 0 ? `${autoPercentOff}% OFF` : undefined;

    const mainImg = productForm.imageUrl || '';
    const finalGallery = productForm.galleryImages.length > 0 ? productForm.galleryImages : (mainImg ? [mainImg] : []);

    const updatedItem: MockProduct = {
      id: productForm.id || `prod-${Date.now()}`,
      name: productForm.name,
      price: sellingPriceVal > 0 ? `${sellingPriceVal.toFixed(2)}` : '$0.00',
      costPrice: costVal > 0 ? `${costVal.toFixed(2)}` : undefined,
      retailPrice: retailVal > 0 ? `${retailVal.toFixed(2)}` : undefined,
      retailMarkupPrice: retailVal > 0 ? `${retailVal.toFixed(2)}` : undefined,
      wholesalePrice: wholesaleVal > 0 ? `${wholesaleVal.toFixed(2)}` : `${sellingPriceVal.toFixed(2)}`,
      minWholesaleQuantity: productsSettings?.minWholesaleQuantity || 6,
      originalPrice: origPriceVal > 0 ? `${origPriceVal.toFixed(2)}` : undefined,
      isSale: isAutoSale,
      saleBadgeText: autoBadgeText,
      isFeatured: productForm.isFeatured,
      imageUrl: mainImg,
      images: finalGallery,
      stock: Math.max(0, parseInt(String(productForm.stock)) || 0),
      url: `/product/${productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      brand: resolvedBrandName,
      brandId: bIdNum,
      categoryId: Number(productForm.categoryId) || 0,
      tags: tagsArr,
      description: productForm.description || ''
    };

    if (editingProduct) {
      const updatedList = catalogProducts.map(p => p.id === editingProduct.id ? updatedItem : p);
      handleSetProducts(updatedList);
      showToast(`Updated product "${updatedItem.name}"`);
    } else {
      const updatedList = [updatedItem, ...catalogProducts];
      handleSetProducts(updatedList);
      showToast(`Created new product "${updatedItem.name}"`);
    }
    setShowProductModal(false);
  };

  const handleToggleProductFeatured = (id: string) => {
    const updatedList = catalogProducts.map(p => {
      if (p.id === id) {
        const nextState = !p.isFeatured;
        showToast(`${p.name} ${nextState ? 'marked as Featured' : 'removed from Featured'}`);
        return { ...p, isFeatured: nextState };
      }
      return p;
    });
    handleSetProducts(updatedList);
  };

  const handleToggleProductSale = (id: string) => {
    const updatedList = catalogProducts.map(p => {
      if (p.id === id) {
        const nextState = !p.isSale;
        showToast(`${p.name} ${nextState ? 'marked On Sale' : 'removed from Sale'}`);
        return { ...p, isSale: nextState, saleBadgeText: nextState ? 'SALE' : undefined };
      }
      return p;
    });
    handleSetProducts(updatedList);
  };

  const handleDuplicateProduct = (prod: MockProduct) => {
    const duplicated: MockProduct = {
      ...prod,
      id: `prod-${Date.now().toString().slice(-4)}`,
      name: `${prod.name} (Copy)`,
      url: `/product/${prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-copy`
    };
    handleSetProducts([duplicated, ...catalogProducts]);
    showToast(`Duplicated "${prod.name}"`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      handleSetProducts(catalogProducts.filter(p => p.id !== id));
      showToast(`Deleted product "${name}"`);
    }
  };

  // Category Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: Date.now(),
      name: '',
      imageUrl: '',
      description: '',
      icon: ''
    });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: MockCategoryPreset) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      imageUrl: cat.imageUrl || '',
      description: cat.description || '',
      icon: cat.icon || ''
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Category name is required.');
      return;
    }
    const catItem: MockCategoryPreset = {
      id: categoryForm.id || Date.now(),
      name: categoryForm.name.trim(),
      imageUrl: categoryForm.imageUrl.trim(),
      description: categoryForm.description.trim(),
      icon: categoryForm.icon
    };
    if (editingCategory) {
      handleSetCategories(catalogCategories.map(c => c.id === editingCategory.id ? catItem : c));
      showToast(`Updated category "${catItem.name}"`);
    } else {
      handleSetCategories([...catalogCategories, catItem]);
      showToast(`Created category "${catItem.name}"`);
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      handleSetCategories(catalogCategories.filter(c => c.id !== id));
      showToast(`Deleted category "${name}"`);
    }
  };

  // Brand Handlers
  const handleOpenAddBrand = () => {
    setEditingBrand(null);
    setBrandForm({
      id: Date.now(),
      name: '',
      imageUrl: ''
    });
    setShowBrandModal(true);
  };

  const handleOpenEditBrand = (brand: MockBrandPreset) => {
    setEditingBrand(brand);
    setBrandForm({
      id: brand.id,
      name: brand.name,
      imageUrl: brand.imageUrl || ''
    });
    setShowBrandModal(true);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name) {
      showToast('Brand name is required.');
      return;
    }
    const brandItem: MockBrandPreset = {
      id: brandForm.id || Date.now(),
      name: brandForm.name,
      imageUrl: brandForm.imageUrl || ''
    };
    if (editingBrand) {
      handleSetBrands(catalogBrands.map(b => b.id === editingBrand.id ? brandItem : b));
      showToast(`Updated brand "${brandItem.name}"`);
    } else {
      handleSetBrands([...catalogBrands, brandItem]);
      showToast(`Created brand "${brandItem.name}"`);
    }
    setShowBrandModal(false);
  };

  const handleDeleteBrand = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete brand "${name}"?`)) {
      handleSetBrands(catalogBrands.filter(b => b.id !== id));
      showToast(`Deleted brand "${name}"`);
    }
  };

  // Tag Handlers
  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const cleanTag = newTagName.trim().replace(/^#/, '');
    showToast(`Added tag #${cleanTag} to catalog registry`);
    setNewTagName('');
    setShowTagModal(false);
  };

  const handleDeleteTagGlobal = (tagToDelete: string) => {
    if (confirm(`Remove tag #${tagToDelete} from all products?`)) {
      const updated = catalogProducts.map(p => ({
        ...p,
        tags: (p.tags || []).filter(t => t !== tagToDelete)
      }));
      handleSetProducts(updated);
      showToast(`Removed tag #${tagToDelete} from catalog`);
    }
  };

  // Site Settings Local Form State
  const [shippingPriceInput, setShippingPriceInput] = useState<number>(freeShippingThreshold);
  const [storeTitleInput, setStoreTitleInput] = useState<string>(logoText);
  const [storeCurrency, setStoreCurrency] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storeCurrency) return parsed.storeCurrency;
      }
    } catch (e) {}
    return 'USD ($)';
  });
  const [defaultTaxRate, setDefaultTaxRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.defaultTaxRate !== undefined) return parsed.defaultTaxRate;
      }
    } catch (e) {}
    return 8.0;
  });
  const [storeSupportEmail, setStoreSupportEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storeSupportEmail) return parsed.storeSupportEmail;
      }
    } catch (e) {}
    return 'support@luxestore.com';
  });
  const [enableAnnouncement, setEnableAnnouncement] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.enableAnnouncement !== undefined) return parsed.enableAnnouncement;
      }
    } catch (e) {}
    return true;
  });
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.announcementText) return parsed.announcementText;
      }
    } catch (e) {}
    return '✨ Complimentary Worldwide Express Shipping on Orders Over $' + freeShippingThreshold;
  });

  useEffect(() => {
    try {
      const siteSettings = {
        storeCurrency,
        defaultTaxRate,
        storeSupportEmail,
        enableAnnouncement,
        announcementText
      };
      localStorage.setItem('luxestore_admin_site_settings', JSON.stringify(siteSettings));
    } catch (e) {}
  }, [storeCurrency, defaultTaxRate, storeSupportEmail, enableAnnouncement, announcementText]);

  // Google Tag Manager ID state for Store Admin Settings
  const [adminGtmId, setAdminGtmId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getStoredGtmId();
    }
    return '';
  });

  const handleSaveAdminGtmId = () => {
    const clean = adminGtmId.trim().toUpperCase();
    setStoredGtmId(clean);
    initGTM(clean);
    showToast(`Saved Google Tag Manager ID: ${clean || '(Disabled)'}`);
  };

  // Customer Management State
  const [customers, setCustomers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('luxestore_admin_customers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CUSTOMERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('luxestore_admin_customers', JSON.stringify(customers));
    } catch (e) {}
  }, [customers]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'vip' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'spent' | 'orders' | 'joined'>('spent');
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);
  
  // Add Customer Modal
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'vip' | 'inactive'
  });

  // Filtered and sorted customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
    if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
    return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
  });

  // Derived Stats
  const totalCustomersCount = customers.length;
  const vipCount = customers.filter(c => c.status === 'vip').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Handlers
  const handleToggleCustomerStatus = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'vip' ? 'active' : c.status === 'active' ? 'inactive' : 'vip';
        showToast(`Updated ${c.name}'s status to ${nextStatus.toUpperCase()}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) {
      showToast('Please provide a name and email.');
      return;
    }

    const created: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone || '+1 (555) 000-0000',
      role: 'customer',
      status: newCustomer.status,
      totalOrders: 0,
      totalSpent: 0,
      joinedDate: 'Just now',
      lastActive: 'Just now',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200`
    };

    setCustomers([created, ...customers]);
    setShowAddCustomerModal(false);
    setNewCustomer({ name: '', email: '', phone: '', status: 'active' });
    showToast(`Added new customer ${created.name}!`);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Status,Role,Total Orders,Total Spent ($),Joined Date'];
    const rows = customers.map(c => 
      `"${c.id}","${c.name}","${c.email}","${c.status}","${c.role}",${c.totalOrders},${c.totalSpent},"${c.joinedDate}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customers_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer directory exported to CSV!');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Top Admin Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className={`relative w-full py-6 sm:py-8 px-4 sm:px-8 ${lightBannerBg} text-slate-900 rounded-2xl sm:rounded-3xl shadow-xs border overflow-hidden mb-6`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={() => onNavigate('home')} 
                  className="text-xs text-slate-500 hover:text-slate-900 transition flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-xs text-blue-700 font-extrabold flex items-center gap-1 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Admin Management Suite
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                Store Admin & Customer Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Real-time store metrics, customer database management, and conversion analytics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" /> Export CSV
              </button>

              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                className={`px-3.5 py-2 ${currentTheme.bg} text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-102 active:scale-98`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs (visible only on screens < lg) */}
        <div className="lg:hidden flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'overview' 
                ? `${currentTheme.bg} text-white shadow-xs font-black` 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Overview
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'products' 
                ? `${currentTheme.bg} text-white shadow-xs font-black` 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Products ({catalogProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'customers' 
                ? `${currentTheme.bg} text-white shadow-xs font-black` 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Customers ({totalCustomersCount})
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'vendors' 
                ? 'bg-emerald-600 text-white shadow-xs font-black' 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-300" /> Vendors
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'analytics' 
                ? `${currentTheme.bg} text-white shadow-xs font-black` 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Analytics
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'orders' 
                ? `${currentTheme.bg} text-white shadow-xs font-black` 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Orders ({ordersList.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'reviews' 
                ? `${currentTheme.bg} text-white shadow-xs font-black` 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Reviews ({reviewsList.length})
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'coupons' 
                ? `${currentTheme.bg} text-white shadow-xs font-black` 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" /> Coupons ({couponsList.length})
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'marketing' || activeTab === 'outreach'
                ? 'bg-amber-600 text-white shadow-xs font-black' 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" /> Marketing
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'settings' || activeTab === 'site-settings' 
                ? `${currentTheme.bg} text-white shadow-xs font-black` 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'security' 
                ? 'bg-rose-600 text-white shadow-xs font-black' 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-300" /> Security
          </button>

          <button
            onClick={() => setActiveTab('payload')}
            className={`px-3.5 py-2 text-xs font-bold transition rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'payload' 
                ? 'bg-indigo-600 text-white shadow-xs font-black' 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Payload CMS
          </button>
        </div>

        {/* Desktop 2-Column Layout (Vertical Tabs on Left, Content on Right) */}
        <div className="lg:grid lg:grid-cols-[250px_1fr] xl:grid-cols-[270px_1fr] lg:gap-8 items-start">
          
          {/* Desktop Left Vertical Navigation Sidebar */}
          <aside className="hidden lg:block sticky top-6 bg-slate-50/90 border border-slate-200/80 rounded-3xl p-3.5 shadow-2xs space-y-2">
            <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Admin Menu
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'overview' 
                    ? `${currentTheme.bg} text-white shadow-xs font-black` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span>Overview</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'products' 
                    ? `${currentTheme.bg} text-white shadow-xs font-black` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className={`w-4 h-4 shrink-0 ${activeTab === 'products' ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span>Products</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {catalogProducts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'customers' 
                    ? `${currentTheme.bg} text-white shadow-xs font-black` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className={`w-4 h-4 shrink-0 ${activeTab === 'customers' ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span>Customers</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'customers' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {totalCustomersCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('vendors')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'vendors' 
                    ? 'bg-emerald-600 text-white shadow-xs font-black' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'vendors' ? 'text-white' : 'text-emerald-600'}`} />
                  <span>Vendors & Compliance</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'analytics' 
                    ? `${currentTheme.bg} text-white shadow-xs font-black` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className={`w-4 h-4 shrink-0 ${activeTab === 'analytics' ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span>Analytics & Charts</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'orders' 
                    ? `${currentTheme.bg} text-white shadow-xs font-black` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span>Store Orders</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {ordersList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'reviews' 
                    ? `${currentTheme.bg} text-white shadow-xs font-black` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${activeTab === 'reviews' ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span>Reviews</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'reviews' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {reviewsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'coupons' 
                    ? `${currentTheme.bg} text-white shadow-xs font-black` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Ticket className={`w-4 h-4 shrink-0 ${activeTab === 'coupons' ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span>Coupons & Promos</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'coupons' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {couponsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('marketing')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'marketing' || activeTab === 'outreach'
                    ? 'bg-amber-600 text-white shadow-xs font-black' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Megaphone className={`w-4 h-4 shrink-0 ${activeTab === 'marketing' || activeTab === 'outreach' ? 'text-white' : 'text-amber-600'}`} />
                  <span>Marketing</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'settings' || activeTab === 'site-settings' 
                    ? `${currentTheme.bg} text-white shadow-xs font-black` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'settings' || activeTab === 'site-settings' ? 'text-white' : 'text-blue-600'}`} />
                  <span>Settings</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'security' 
                    ? 'bg-rose-600 text-white shadow-xs font-black' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className={`w-4 h-4 shrink-0 ${activeTab === 'security' ? 'text-white' : 'text-rose-600'}`} />
                  <span>Security</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('payload')}
                className={`w-full px-3.5 py-2.5 text-xs font-bold transition-all rounded-2xl flex items-center justify-between group cursor-pointer text-left ${
                  activeTab === 'payload' 
                    ? 'bg-indigo-600 text-white shadow-xs font-black' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === 'payload' ? 'text-white' : 'text-indigo-600'}`} />
                  <span>Payload CMS 3.88</span>
                </div>
              </button>
            </nav>

            <div className="mt-4 pt-3 border-t border-slate-200/70 px-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Admin Online
                </span>
                <span className="font-mono text-slate-400">v3.88</span>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="min-w-0 space-y-8">
        
        {/* TAB 1: OVERVIEW & DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metrics Cards (Visible only in overview tab) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Customers</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-slate-900">{totalCustomersCount}</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">{vipCount} VIP members</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Store Revenue</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-slate-900">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +18.6%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">All processed transactions</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Completed Orders</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-slate-900">{totalOrders}</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +9.8%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">Avg. ${(avgOrderValue).toFixed(2)} / order</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-slate-900">3.84%</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +0.6%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">3,420 monthly visitors</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Quick Sales Chart & Top Customers */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Revenue Chart Preview */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Revenue Growth Trend</h3>
                    <p className="text-xs text-slate-400">Monthly breakdown of store revenue and orders.</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">
                    Year 2026
                  </span>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_DATA}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Customers Highlights */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Top Spending Customers</h3>
                    <p className="text-xs text-slate-400">VIP & highest lifetime value clientele.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('customers')}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    View All Directory →
                  </button>
                </div>

                <div className="space-y-3">
                  {customers.slice(0, 4).map((cust) => (
                    <div 
                      key={cust.id} 
                      onClick={() => setSelectedCustomer(cust)}
                      className="p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200/70 hover:border-blue-200 rounded-2xl flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <SafeImage src={cust.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-slate-200" alt={cust.name} placeholderType="avatar" fallbackTitle={cust.name} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{cust.name}</h4>
                            {cust.status === 'vip' && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-extrabold rounded-full flex items-center gap-1">
                                <Crown className="w-2.5 h-2.5" /> VIP
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">{cust.email}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-slate-900 block">${cust.totalSpent.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400">{cust.totalOrders} completed orders</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Category Distribution & Quick Controls */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Category Breakdown Donut Chart */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Category Sales Share</h3>
                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {CATEGORY_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {CATEGORY_DISTRIBUTION.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Admin Operations
                </div>
                <h3 className="text-base font-bold text-white">Store Health Status</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All payment gateways, inventory sync, and customer notification queues are operating normally.
                </p>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      showToast('Store catalog cache flushed & re-indexed!');
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Flush Store Cache
                  </button>
                  <button
                    onClick={() => {
                      showToast('Generated summary store health report!');
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Activity className="w-3.5 h-3.5" /> Run Diagnostic Check
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
        )}

        {/* TAB 2: PRODUCTS & CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Catalog Sub-Navigation & KPI Bar */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Package className="w-6 h-6 text-blue-600" /> Catalog & Inventory Manager
                  </h2>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    Manage products, categories, brands, and search tags across your store.
                  </p>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0 overflow-x-auto">
                  <button
                    onClick={() => setProductSubTab('products')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      productSubTab === 'products' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5 text-blue-500" /> Products ({catalogProducts.length})
                  </button>

                  <button
                    onClick={() => setProductSubTab('categories')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      productSubTab === 'categories' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FolderTree className="w-3.5 h-3.5 text-emerald-500" /> Categories ({catalogCategories.length})
                  </button>

                  <button
                    onClick={() => setProductSubTab('brands')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      productSubTab === 'brands' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-500" /> Brands ({catalogBrands.length})
                  </button>

                  <button
                    onClick={() => setProductSubTab('tags')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      productSubTab === 'tags' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5 text-rose-500" /> Tags ({uniqueTagsList.length})
                  </button>
                </div>
              </div>

              {/* SUB TAB 1: PRODUCTS TABLE */}
              {productSubTab === 'products' && (
                <div className="space-y-6">
                  {/* Search, Filter & Add Button Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      {/* Search */}
                      <div className="relative flex-1 min-w-[220px]">
                        <input
                          type="text"
                          placeholder="Search products by title, tag, brand..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        {productSearch && (
                          <button 
                            onClick={() => setProductSearch('')}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Category Filter */}
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        {catalogCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>

                      {/* Brand Filter */}
                      <select
                        value={productBrandFilter}
                        onChange={(e) => setProductBrandFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="all">All Brands</option>
                        {catalogBrands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>

                      {/* Status Filter */}
                      <select
                        value={productFilterStatus}
                        onChange={(e) => setProductFilterStatus(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="all">All Badges</option>
                        <option value="featured">Featured Only ⭐</option>
                        <option value="sale">On Sale Only 🏷️</option>
                      </select>
                    </div>

                    <button
                      onClick={handleOpenAddProduct}
                      className={`px-4 py-2.5 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer hover:scale-102 shrink-0`}
                    >
                      <Plus className="w-4 h-4" /> Add Product
                    </button>
                  </div>

                  {/* Mobile Card View for Products */}
                  <div className="block md:hidden space-y-4">
                    {filteredProductsList.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 bg-white border border-slate-200/80 rounded-2xl">
                        <Package className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                        <p className="font-bold text-slate-600 text-sm">No products found matching your filters.</p>
                        <p className="text-xs mt-1 text-slate-400">Try adjusting your search criteria or add a new product.</p>
                      </div>
                    ) : (
                      filteredProductsList.map(prod => {
                        const matchedCategory = catalogCategories.find(c => c.id === prod.categoryId);
                        const matchedBrand = catalogBrands.find(b => b.id === prod.brandId) || { name: prod.brand || 'LuxeBrand' };

                        return (
                          <div key={prod.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/80 shrink-0">
                                <SafeImage
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</h4>
                                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">ID: {prod.id}</span>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  <span className="font-extrabold text-slate-900 text-xs">${prod.price}</span>
                                  {prod.originalPrice && (
                                    <span className="text-[10px] text-slate-400 line-through">${prod.originalPrice}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                                <FolderTree className="w-3 h-3 text-emerald-500" />
                                {matchedCategory?.name || 'Uncategorized'}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                                <Building2 className="w-3 h-3 text-slate-400" />
                                {matchedBrand.name}
                              </span>
                            </div>

                            {/* Badges and Actions */}
                            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 gap-2">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleToggleProductFeatured(prod.id)}
                                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                    prod.isFeatured 
                                      ? 'bg-amber-50 border-amber-200 text-amber-600' 
                                      : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-amber-500'
                                  }`}
                                  title={prod.isFeatured ? 'Featured Product' : 'Mark as Featured'}
                                >
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                </button>

                                <button
                                  onClick={() => handleToggleProductSale(prod.id)}
                                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                    prod.isSale 
                                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                      : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-rose-500'
                                  }`}
                                  title={prod.isSale ? 'On Sale' : 'Set On Sale'}
                                >
                                  <Tag className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Edit Product
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Desktop Products List Table */}
                  <div className="hidden md:block border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-4">Product Details</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Brand</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Tags</th>
                            <th className="py-3 px-4 text-center">Badges</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {filteredProductsList.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-400">
                                <Package className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                                <p className="font-bold text-slate-600 text-sm">No products found matching your filters.</p>
                                <p className="text-xs mt-1 text-slate-400">Try adjusting your search criteria or add a new product.</p>
                              </td>
                            </tr>
                          ) : (
                            filteredProductsList.map(prod => {
                              const matchedCategory = catalogCategories.find(c => c.id === prod.categoryId);
                              const matchedBrand = catalogBrands.find(b => b.id === prod.brandId) || { name: prod.brand || 'LuxeBrand' };

                              return (
                                <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                                  {/* Details */}
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/80 shrink-0">
                                        <SafeImage
                                          src={prod.imageUrl}
                                          alt={prod.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</p>
                                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">ID: {prod.id}</span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Category */}
                                  <td className="py-3 px-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-100">
                                      <FolderTree className="w-3 h-3 text-emerald-500" />
                                      {matchedCategory?.name || 'Uncategorized'}
                                    </span>
                                  </td>

                                  {/* Brand */}
                                  <td className="py-3 px-4">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                      <Building2 className="w-3 h-3 text-slate-400" />
                                      {matchedBrand.name}
                                    </span>
                                  </td>

                                  {/* Price */}
                                  <td className="py-3 px-4">
                                    <div>
                                      <span className="font-bold text-slate-900 text-xs">{prod.price}</span>
                                      {prod.originalPrice && (
                                        <span className="text-[10px] text-slate-400 line-through block">{prod.originalPrice}</span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Tags */}
                                  <td className="py-3 px-4">
                                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                                      {(prod.tags || ['Catalog']).slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                                          #{tag}
                                        </span>
                                      ))}
                                      {(prod.tags?.length || 0) > 3 && (
                                        <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                                          +{(prod.tags?.length || 0) - 3}
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Badges Toggles */}
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => handleToggleProductFeatured(prod.id)}
                                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                          prod.isFeatured 
                                            ? 'bg-amber-50 border-amber-200 text-amber-600' 
                                            : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-amber-500'
                                        }`}
                                        title={prod.isFeatured ? 'Featured Product (Click to toggle)' : 'Mark as Featured'}
                                      >
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                      </button>

                                      <button
                                        onClick={() => handleToggleProductSale(prod.id)}
                                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                          prod.isSale 
                                            ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                            : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-rose-500'
                                        }`}
                                        title={prod.isSale ? 'On Sale (Click to toggle)' : 'Set On Sale'}
                                      >
                                        <Tag className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>

                                  {/* Actions */}
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        onClick={() => handleOpenEditProduct(prod)}
                                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                                        title="Edit Product"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" /> Edit
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB 2: CATEGORIES MANAGEMENT */}
              {productSubTab === 'categories' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Product Categories</h3>
                      <p className="text-xs text-slate-500">Organize your store inventory into intuitive navigation categories.</p>
                    </div>
                    <button
                      onClick={handleOpenAddCategory}
                      className={`px-3.5 py-2 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catalogCategories.map(cat => {
                      const count = catalogProducts.filter(p => p.categoryId === cat.id).length;
                      return (
                        <div key={cat.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/80 shrink-0">
                              <SafeImage src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-xs truncate">{cat.name}</h4>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{count} {count === 1 ? 'Product' : 'Products'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB TAB 3: BRANDS MANAGEMENT */}
              {productSubTab === 'brands' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Partner Brands</h3>
                      <p className="text-xs text-slate-500">Manage designer brand profiles and featured manufacturer labels.</p>
                    </div>
                    <button
                      onClick={handleOpenAddBrand}
                      className={`px-3.5 py-2 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Brand
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catalogBrands.map(brand => {
                      const count = catalogProducts.filter(p => p.brandId === brand.id || p.brand === brand.name).length;
                      return (
                        <div key={brand.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              <Building2 className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-xs truncate">{brand.name}</h4>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{count} {count === 1 ? 'Product' : 'Products'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditBrand(brand)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Edit Brand"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(brand.id, brand.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Brand"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB TAB 4: TAGS MANAGEMENT */}
              {productSubTab === 'tags' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Product Tags & Keywords</h3>
                      <p className="text-xs text-slate-500">Keyword tags used for product recommendation engines and instant search filters.</p>
                    </div>
                    <button
                      onClick={() => setShowTagModal(true)}
                      className={`px-3.5 py-2 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {uniqueTagsList.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4">No tags created yet. Add tags to products to organize keywords.</p>
                    ) : (
                      uniqueTagsList.map((tag, idx) => {
                        const count = catalogProducts.filter(p => p.tags?.includes(tag)).length;
                        return (
                          <div key={idx} className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
                            <Tag className="w-3.5 h-3.5 text-blue-500" />
                            <span>#{tag}</span>
                            <span className="bg-slate-200 text-slate-600 px-1.5 py-0.2 text-[10px] rounded-full font-extrabold">{count}</span>
                            <button
                              onClick={() => handleDeleteTagGlobal(tag)}
                              className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                              title="Remove Tag from Store"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: FULL CUSTOMERS DIRECTORY & MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            
            {/* Search & Filter Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search customers by name or email address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {(['all', 'active', 'vip', 'inactive'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                      statusFilter === st 
                        ? `${currentTheme.bg} text-white shadow-xs` 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

            </div>

            {/* Mobile Card View for Customers */}
            <div className="block md:hidden space-y-4">
              {filteredCustomers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                  <p className="font-bold text-slate-600 text-sm">No customers match your search criteria.</p>
                </div>
              ) : (
                filteredCustomers.map((cust) => (
                  <div key={cust.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <SafeImage src={cust.avatarUrl} className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" alt={cust.name} placeholderType="avatar" fallbackTitle={cust.name} />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{cust.name}</h4>
                        <span className="text-xs text-slate-500 block truncate">{cust.email}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                            cust.status === 'vip' 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : cust.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {cust.status === 'vip' && <Crown className="w-3 h-3" />}
                            {cust.status}
                          </span>
                          {cust.role === 'admin' && (
                            <span className="text-[9px] font-bold text-blue-600 uppercase">Admin User</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Spent</span>
                        <span className="font-extrabold text-slate-900">${cust.totalSpent.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed Orders</span>
                        <span className="font-bold text-slate-800">{cust.totalOrders} orders</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-[10px] text-slate-400">Joined: {cust.joinedDate}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                        <button
                          onClick={() => handleToggleCustomerStatus(cust.id)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Toggle VIP / Active Status"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Customers Table */}
            <div className="hidden md:block overflow-x-auto scrollbar-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4 rounded-l-xl">Customer Details</th>
                    <th className="py-3 px-4">Status & Role</th>
                    <th className="py-3 px-4">Total Orders</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No customers match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-slate-50/80 transition group">
                        
                        {/* Customer Profile info */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <SafeImage src={cust.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-slate-200" alt={cust.name} placeholderType="avatar" fallbackTitle={cust.name} />
                            <div>
                              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition">{cust.name}</h4>
                              <span className="text-[11px] text-slate-500">{cust.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Status & Role */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                              cust.status === 'vip' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : cust.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {cust.status === 'vip' && <Crown className="w-3 h-3" />}
                              {cust.status}
                            </span>
                            {cust.role === 'admin' && (
                              <span className="text-[9px] font-bold text-blue-600 uppercase">Admin User</span>
                            )}
                          </div>
                        </td>

                        {/* Total Orders */}
                        <td className="py-4 px-4 font-bold text-slate-800">
                          {cust.totalOrders} orders
                        </td>

                        {/* Total Spent */}
                        <td className="py-4 px-4 font-extrabold text-slate-900">
                          ${cust.totalSpent.toFixed(2)}
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-4 text-slate-500 text-[11px]">
                          {cust.joinedDate}
                        </td>

                        {/* Interactive Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="View Customer Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleToggleCustomerStatus(cust.id)}
                              className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                              title="Toggle VIP / Active Status"
                            >
                              <Crown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: ADVANCED ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">

            {/* Analytics Sub-Navigation Tabs */}
            <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setAnalyticsSubTab('store')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    analyticsSubTab === 'store'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Store Analysis
                </button>
                <button
                  onClick={() => setAnalyticsSubTab('google')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    analyticsSubTab === 'google'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Globe className="w-4 h-4" /> Google Analytics
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 text-xs text-slate-400 font-bold">
                <span>Analytics Hub</span>
              </div>
            </div>

            {/* STORE ANALYSIS SUB-TAB CONTENT */}
            {analyticsSubTab === 'store' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Bar chart for Customer Cohort Growth */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Customer Acquisition & Orders</h3>
                      <p className="text-xs text-slate-400">Monthly new customer registrations vs order volume.</p>
                    </div>
                  </div>

                  <div className="h-72 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={REVENUE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                        <Bar dataKey="customers" fill="#2563eb" radius={[6, 6, 0, 0]} name="New Customers" />
                        <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Retention & Device Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Customer Retention</span>
                    <h4 className="text-2xl font-extrabold text-slate-900">76.4%</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Repeat customer rate across 90-day purchase windows.
                    </p>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[76.4%]" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Average Order Value</span>
                    <h4 className="text-2xl font-extrabold text-slate-900">${avgOrderValue.toFixed(2)}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Basket size across mobile and desktop checkouts.
                    </p>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[68%]" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">VIP Member Ratio</span>
                    <h4 className="text-2xl font-extrabold text-slate-900">{((vipCount/totalCustomersCount)*100).toFixed(1)}%</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Proportion of registered clients in VIP status.
                    </p>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[37.5%]" />
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* GOOGLE ANALYTICS & GOOGLE TAG MANAGER HUB */}
            {analyticsSubTab === 'google' && (
              <div className="space-y-6 animate-fadeIn">
                <GoogleAnalyticsHub
                  products={catalogProducts}
                  storeCurrency={storeCurrency}
                  showToast={showToast}
                />
              </div>
            )}

          </div>
        )}

        {/* TAB 4: STORE ORDERS OVERVIEW & WORKSPACE */}
        {activeTab === 'orders' && (
          <div>
            {selectedOrderForEdit ? (
              /* DEDICATED EDIT ORDER PAGE WORKSPACE */
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-8 animate-fadeIn">
                
                {/* Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedOrderForEdit(null)}
                      className="p-2.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Orders
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-slate-900">Order #{selectedOrderForEdit.id}</h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          selectedOrderForEdit.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          selectedOrderForEdit.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          selectedOrderForEdit.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                          selectedOrderForEdit.status === 'Pending' ? 'bg-sky-100 text-sky-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {selectedOrderForEdit.status}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          selectedOrderForEdit.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          selectedOrderForEdit.paymentStatus === 'Pending Payment' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {selectedOrderForEdit.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Placed on {selectedOrderForEdit.orderDate}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowInvoiceModal(selectedOrderForEdit)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Invoice
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(selectedOrderForEdit)}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Invoice
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(selectedOrderForEdit.id)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    <button
                      onClick={handleSaveOrderChanges}
                      className={`px-4 py-2 ${currentTheme.bg} text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer`}
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </div>

                {/* Main Edit Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Order Line Items & Financial Totals */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Line Items Card */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-blue-600" /> Purchased Items ({selectedOrderForEdit.items.length})
                        </h3>
                        <span className="text-xs font-bold text-slate-500">Edit quantities or prices</span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-3">
                        {selectedOrderForEdit.items.map((item) => (
                          <div key={item.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                            <div className="flex items-center gap-3">
                              <SafeImage
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200'}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-extrabold text-slate-900 text-xs block">{item.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku || item.productId}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-0 border-slate-100 pt-2 sm:pt-0">
                              {/* Price Editable */}
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Unit Price</span>
                                <div className="flex items-center text-xs font-bold text-slate-800">
                                  <span>$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.price}
                                    onChange={(e) => {
                                      const newPrice = Math.max(0, parseFloat(e.target.value) || 0);
                                      const updatedItems = selectedOrderForEdit.items.map(i => i.id === item.id ? { ...i, price: newPrice } : i);
                                      handleUpdateEditingOrder({ items: updatedItems });
                                    }}
                                    className="w-16 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs text-right font-bold ml-0.5 focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              {/* Quantity Counter */}
                              <div className="text-center">
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Qty</span>
                                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderItemQuantity(item.id, -1)}
                                    className="p-1 text-slate-600 hover:bg-slate-200 cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-xs font-extrabold text-slate-800">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderItemQuantity(item.id, 1)}
                                    className="p-1 text-slate-600 hover:bg-slate-200 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Item Total */}
                              <div className="text-right min-w-[70px]">
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Line Total</span>
                                <span className="text-xs font-extrabold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>

                              {/* Delete Item */}
                              <button
                                type="button"
                                onClick={() => handleRemoveOrderItem(item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Remove item from order"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Product Selector */}
                      <div className="border-t border-slate-200/80 pt-3 flex flex-col sm:flex-row items-center gap-2">
                        <select
                          value={newItemProductId}
                          onChange={(e) => setNewItemProductId(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">-- Add Product to Order --</option>
                          {catalogProducts.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (${Number(p.price).toFixed(2)})</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleAddProductToOrder}
                          disabled={!newItemProductId}
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Item
                        </button>
                      </div>
                    </div>

                    {/* Financial Summary Calculation Card */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                      <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200/80 pb-2">Order Financial Calculations</h3>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-600">
                          <span>Items Subtotal</span>
                          <span className="font-bold text-slate-900">${selectedOrderForEdit.subtotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-slate-600">
                          <span>Shipping Fee</span>
                          <div className="flex items-center gap-1">
                            <span>$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={selectedOrderForEdit.shippingCost}
                              onChange={(e) => handleUpdateEditingOrder({ shippingCost: Math.max(0, parseFloat(e.target.value) || 0) })}
                              className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs text-right font-bold focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-slate-600">
                          <span>Discount Applied</span>
                          <div className="flex items-center gap-1">
                            <span>-$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={selectedOrderForEdit.discount}
                              onChange={(e) => handleUpdateEditingOrder({ discount: Math.max(0, parseFloat(e.target.value) || 0) })}
                              className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs text-right font-bold text-emerald-600 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-slate-600">
                          <span>Estimated Tax (8%)</span>
                          <span className="font-bold text-slate-900">${selectedOrderForEdit.tax.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm font-black text-slate-900 border-t border-slate-200/80 pt-2">
                          <span>Grand Total Charged</span>
                          <span className="text-base text-blue-600">${selectedOrderForEdit.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Order Logistics & Customer Settings */}
                  <div className="space-y-6">
                    
                    {/* Status & Payment Settings */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Order Status & Payment
                      </h3>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Fulfillment Status</label>
                        <select
                          value={selectedOrderForEdit.status}
                          onChange={(e) => handleUpdateEditingOrder({ status: e.target.value as any })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Payment Status</label>
                        <select
                          value={selectedOrderForEdit.paymentStatus}
                          onChange={(e) => handleUpdateEditingOrder({ paymentStatus: e.target.value as any })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending Payment">Pending Payment</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Payment Method</label>
                        <input
                          type="text"
                          value={selectedOrderForEdit.paymentMethod}
                          onChange={(e) => handleUpdateEditingOrder({ paymentMethod: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Shipping & Tracking Logistics */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
                        <Truck className="w-4 h-4 text-blue-600" /> Carrier & Tracking
                      </h3>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Shipping Carrier</label>
                        <input
                          type="text"
                          placeholder="e.g. FedEx Express, DHL, UPS"
                          value={selectedOrderForEdit.shippingCarrier}
                          onChange={(e) => handleUpdateEditingOrder({ shippingCarrier: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Tracking Number</label>
                        <input
                          type="text"
                          placeholder="e.g. FX-9821038491"
                          value={selectedOrderForEdit.trackingNumber}
                          onChange={(e) => handleUpdateEditingOrder({ trackingNumber: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {selectedOrderForEdit.trackingNumber && (
                        <a
                          href={selectedOrderForEdit.trackingUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1 pt-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Track Shipment with Carrier
                        </a>
                      )}
                    </div>

                    {/* Customer & Shipping Address */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
                        <Users className="w-4 h-4 text-blue-600" /> Customer & Shipping Address
                      </h3>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Customer Full Name</label>
                        <input
                          type="text"
                          value={selectedOrderForEdit.customerName}
                          onChange={(e) => handleUpdateEditingOrder({ customerName: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Email</label>
                          <input
                            type="email"
                            value={selectedOrderForEdit.customerEmail}
                            onChange={(e) => handleUpdateEditingOrder({ customerEmail: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone</label>
                          <input
                            type="text"
                            value={selectedOrderForEdit.customerPhone}
                            onChange={(e) => handleUpdateEditingOrder({ customerPhone: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200/80">
                        <label className="text-[11px] font-bold text-slate-700 block">Shipping Address</label>
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={selectedOrderForEdit.shippingAddress.street}
                          onChange={(e) => handleUpdateEditingOrder({
                            shippingAddress: { ...selectedOrderForEdit.shippingAddress, street: e.target.value }
                          })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={selectedOrderForEdit.shippingAddress.city}
                            onChange={(e) => handleUpdateEditingOrder({
                              shippingAddress: { ...selectedOrderForEdit.shippingAddress, city: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={selectedOrderForEdit.shippingAddress.state}
                            onChange={(e) => handleUpdateEditingOrder({
                              shippingAddress: { ...selectedOrderForEdit.shippingAddress, state: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="ZIP Code"
                            value={selectedOrderForEdit.shippingAddress.zip}
                            onChange={(e) => handleUpdateEditingOrder({
                              shippingAddress: { ...selectedOrderForEdit.shippingAddress, zip: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Country"
                            value={selectedOrderForEdit.shippingAddress.country}
                            onChange={(e) => handleUpdateEditingOrder({
                              shippingAddress: { ...selectedOrderForEdit.shippingAddress, country: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Staff & Customer Notes */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                      <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200/80 pb-2">Staff & Internal Notes</h3>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Staff Internal Note</label>
                        <textarea
                          rows={2}
                          placeholder="Internal team notes (e.g. VIP handling, white-glove requested)..."
                          value={selectedOrderForEdit.staffNotes || ''}
                          onChange={(e) => handleUpdateEditingOrder({ staffNotes: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              /* ALL ORDERS LIST TABLE & SUMMARY */
              <div className="space-y-6">
                
                {/* Orders Summary KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Store Revenue</span>
                      <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                        ${ordersList.reduce((acc, o) => acc + o.total, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Store Orders</span>
                      <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{ordersList.length}</span>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Processing</span>
                      <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                        {ordersList.filter(o => o.status === 'Processing' || o.status === 'Pending').length}
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fulfilled & Delivered</span>
                      <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                        {ordersList.filter(o => o.status === 'Delivered' || o.status === 'Shipped').length}
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Store Orders Directory</h3>
                      <p className="text-xs text-slate-400">View, edit, change status, or download tax invoices for customer purchases.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search Bar */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search Order #, customer name, email..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-64 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      </div>

                      {/* Status Filter */}
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                      >
                        <option value="all">All Order Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {/* Payment Filter */}
                      <select
                        value={orderPaymentFilter}
                        onChange={(e) => setOrderPaymentFilter(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                      >
                        <option value="all">All Payment Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending Payment">Pending Payment</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>
                  </div>

                  {/* Mobile Card View for Store Orders */}
                  <div className="block md:hidden space-y-4">
                    {ordersList
                      .filter(o => {
                        const matchSearch = !orderSearch || 
                          o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.items.some(i => i.name.toLowerCase().includes(orderSearch.toLowerCase()));
                        const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                        const matchPayment = orderPaymentFilter === 'all' || o.paymentStatus === orderPaymentFilter;
                        return matchSearch && matchStatus && matchPayment;
                      }).length === 0 ? (
                        <div className="p-8 text-center text-slate-400 bg-slate-50 border border-slate-200/80 rounded-2xl">
                          <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                          <p className="font-bold text-slate-600 text-sm">No orders match your filter criteria.</p>
                        </div>
                      ) : (
                        ordersList
                          .filter(o => {
                            const matchSearch = !orderSearch || 
                              o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                              o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                              o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
                              o.items.some(i => i.name.toLowerCase().includes(orderSearch.toLowerCase()));
                            const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                            const matchPayment = orderPaymentFilter === 'all' || o.paymentStatus === orderPaymentFilter;
                            return matchSearch && matchStatus && matchPayment;
                          })
                          .map((ord) => (
                            <div key={ord.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
                              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                                <div>
                                  <span className="font-extrabold text-slate-900 text-sm">#{ord.id}</span>
                                  <span className="text-[10px] text-slate-400 block">{ord.orderDate}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-extrabold text-slate-900">${ord.total.toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-2 text-xs">
                                <div>
                                  <span className="font-bold text-slate-800 block">{ord.customerName}</span>
                                  <span className="text-[11px] text-slate-400">{ord.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                    ord.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                    ord.paymentStatus === 'Pending Payment' ? 'bg-amber-100 text-amber-800' :
                                    'bg-rose-100 text-rose-800'
                                  }`}>
                                    {ord.paymentStatus}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                    ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                    ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                    ord.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                                    'bg-slate-200 text-slate-700'
                                  }`}>
                                    {ord.status}
                                  </span>
                                </div>
                              </div>

                              {/* Items summary */}
                              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/70">
                                {ord.items[0]?.imageUrl && (
                                  <SafeImage
                                    src={ord.items[0].imageUrl}
                                    alt={ord.items[0].name}
                                    className="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                                  />
                                )}
                                <div className="min-w-0 flex-1 text-xs">
                                  <span className="font-medium text-slate-800 truncate block">{ord.items[0]?.name || 'Item'}</span>
                                  {ord.items.length > 1 && (
                                    <span className="text-[10px] text-blue-600 font-bold">+{ord.items.length - 1} more item(s)</span>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                                <button
                                  onClick={() => setSelectedOrderForEdit(ord)}
                                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <Edit className="w-3.5 h-3.5" /> Manage Order
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDownloadInvoice(ord)}
                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                                    title="Download Tax Invoice"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setShowInvoiceModal(ord)}
                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                                    title="Print Tax Invoice"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOrder(ord.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                  </div>

                  {/* Desktop Orders Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                          <th className="py-3 px-4">Order Details</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Purchased Items</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4">Fulfillment</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {ordersList
                          .filter(o => {
                            const matchSearch = !orderSearch || 
                              o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                              o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                              o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
                              o.items.some(i => i.name.toLowerCase().includes(orderSearch.toLowerCase()));
                            const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                            const matchPayment = orderPaymentFilter === 'all' || o.paymentStatus === orderPaymentFilter;
                            return matchSearch && matchStatus && matchPayment;
                          })
                          .map((ord) => (
                            <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                              
                              {/* Order ID & Date */}
                              <td className="py-4 px-4 font-extrabold text-slate-900">
                                <div className="flex flex-col">
                                  <span className="text-slate-900 font-extrabold text-xs">#{ord.id}</span>
                                  <span className="text-[10px] text-slate-400 font-normal">{ord.orderDate}</span>
                                </div>
                              </td>

                              {/* Customer */}
                              <td className="py-4 px-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-800 text-xs">{ord.customerName}</span>
                                  <span className="text-[10px] text-slate-400">{ord.customerEmail}</span>
                                </div>
                              </td>

                              {/* Items */}
                              <td className="py-4 px-4 max-w-xs">
                                <div className="flex items-center gap-2">
                                  {ord.items[0]?.imageUrl && (
                                    <SafeImage
                                      src={ord.items[0].imageUrl}
                                      alt={ord.items[0].name}
                                      className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                                    />
                                  )}
                                  <div className="truncate">
                                    <span className="font-medium text-slate-700 block truncate">{ord.items[0]?.name || 'Item'}</span>
                                    {ord.items.length > 1 && (
                                      <span className="text-[10px] text-blue-600 font-bold">+{ord.items.length - 1} more item(s)</span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Payment Status */}
                              <td className="py-4 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  ord.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                  ord.paymentStatus === 'Pending Payment' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                  'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}>
                                  {ord.paymentStatus}
                                </span>
                              </td>

                              {/* Fulfillment Status */}
                              <td className="py-4 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                  ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                  ord.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                                  ord.status === 'Pending' ? 'bg-sky-100 text-sky-800' :
                                  'bg-rose-100 text-rose-800'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>

                              {/* Total */}
                              <td className="py-4 px-4 font-black text-slate-900">
                                ${ord.total.toFixed(2)}
                              </td>

                              {/* Action Buttons */}
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedOrderForEdit(ord)}
                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                                    title="Edit & Manage Order Details"
                                  >
                                    <Edit className="w-3.5 h-3.5" /> Manage
                                  </button>

                                  <button
                                    onClick={() => handleDownloadInvoice(ord)}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                    title="Download Tax Invoice HTML"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => setShowInvoiceModal(ord)}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                    title="Print Tax Invoice"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteOrder(ord.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* REVIEWS MANAGEMENT TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Customer Reviews</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{reviewsList.length}</span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Satisfaction</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {(reviewsList.reduce((acc, r) => acc + r.rating, 0) / (reviewsList.length || 1)).toFixed(1)}
                    </span>
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved Reviews</span>
                  <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                    {reviewsList.filter(r => r.status === 'approved').length}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Moderation</span>
                  <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
                    {reviewsList.filter(r => r.status === 'pending').length}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Filter Controls Header */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search reviews by customer name, email, product..."
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={reviewRatingFilter}
                    onChange={(e) => setReviewRatingFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Star Ratings</option>
                    <option value="5">5 Stars Only</option>
                    <option value="4">4 Stars Only</option>
                    <option value="3">3 Stars Only</option>
                    <option value="2">2 Stars Only</option>
                    <option value="1">1 Star Only</option>
                  </select>

                  <select
                    value={reviewStatusFilter}
                    onChange={(e) => setReviewStatusFilter(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Moderation Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending Moderation</option>
                    <option value="spam">Flagged Spam</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddReviewModal(true)}
                className={`w-full md:w-auto px-5 py-2.5 ${currentTheme.bg} text-white font-extrabold text-xs rounded-xl shadow-md transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-2 shrink-0`}
              >
                <Plus className="w-4 h-4" /> Add Verified Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList
                .filter(rev => {
                  const query = reviewSearch.toLowerCase();
                  const matchesSearch = !query || 
                    rev.authorName.toLowerCase().includes(query) ||
                    rev.authorEmail.toLowerCase().includes(query) ||
                    rev.productName.toLowerCase().includes(query) ||
                    rev.title.toLowerCase().includes(query) ||
                    rev.comment.toLowerCase().includes(query);
                  const matchesRating = reviewRatingFilter === 'all' || rev.rating === Number(reviewRatingFilter);
                  const matchesStatus = reviewStatusFilter === 'all' || rev.status === reviewStatusFilter;
                  return matchesSearch && matchesRating && matchesStatus;
                })
                .map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      
                      {/* Product Thumbnail & Name */}
                      <div className="flex items-center gap-3">
                        <SafeImage
                          src={rev.productImage}
                          alt={rev.productName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                          fallbackTitle={rev.productName}
                        />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reviewed Product</span>
                          <h4 className="text-sm font-extrabold text-slate-900">{rev.productName}</h4>
                        </div>
                      </div>

                      {/* Status Badge & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          rev.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {rev.status}
                        </span>

                        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                          {rev.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleToggleReviewStatus(rev.id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                              title="Approve Review"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}

                          {rev.status !== 'spam' && (
                            <button
                              type="button"
                              onClick={() => handleToggleReviewStatus(rev.id, 'spam')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                              title="Flag as Spam"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Spam
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Review Body */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200 fill-slate-100'
                              }`}
                            />
                          ))}
                        </div>

                        <h5 className="font-extrabold text-sm text-slate-900">{rev.title}</h5>

                        {rev.verifiedPurchase && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-blue-600" /> Verified Purchase
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="font-semibold text-slate-700">By {rev.authorName}</span>
                        <span>•</span>
                        <span>{rev.authorEmail}</span>
                        <span>•</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    {/* Store Response Section */}
                    {rev.storeReply ? (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" /> Official Store Reply ({rev.storeReplyDate})
                          </span>
                          <button
                            onClick={() => {
                              setReplyingReviewId(rev.id);
                              setReplyInputText(rev.storeReply || '');
                            }}
                            className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            Edit Reply
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">{rev.storeReply}</p>
                      </div>
                    ) : (
                      <div className="pt-2">
                        {replyingReviewId === rev.id ? (
                          <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                            <textarea
                              rows={2}
                              placeholder="Write an official store response to this review..."
                              value={replyInputText}
                              onChange={(e) => setReplyInputText(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingReviewId(null);
                                  setReplyInputText('');
                                }}
                                className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveReviewReply(rev.id)}
                                className={`px-4 py-1.5 ${currentTheme.bg} text-white font-bold text-[11px] rounded-lg shadow-xs cursor-pointer`}
                              >
                                Post Store Reply
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingReviewId(rev.id);
                              setReplyInputText('');
                            }}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Reply as Store Admin
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                ))}
            </div>

          </div>
        )}

        {/* COUPONS & PROMOS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Promo Codes</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                    {couponsList.filter(c => c.isActive).length}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Ticket className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Code Redemptions</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                    {couponsList.reduce((acc, c) => acc + c.usageCount, 0)}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discount Offers Active</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{couponsList.length}</span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Gift className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Controls Header */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search promo codes (e.g. SUMMER20)..."
                    value={couponSearch}
                    onChange={(e) => setCouponSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <select
                  value={couponStatusFilter}
                  onChange={(e) => setCouponStatusFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 w-full sm:w-auto"
                >
                  <option value="all">All Promo Codes</option>
                  <option value="active">Active Codes Only</option>
                  <option value="inactive">Inactive / Expired</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleOpenAddCoupon}
                className={`w-full md:w-auto px-5 py-2.5 ${currentTheme.bg} text-white font-extrabold text-xs rounded-xl shadow-md transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-2 shrink-0`}
              >
                <Plus className="w-4 h-4" /> Create Promo Code
              </button>
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {couponsList
                .filter(c => {
                  const query = couponSearch.toLowerCase();
                  const matchesSearch = !query || c.code.toLowerCase().includes(query) || c.description.toLowerCase().includes(query);
                  const matchesStatus = couponStatusFilter === 'all' || (couponStatusFilter === 'active' ? c.isActive : !c.isActive);
                  return matchesSearch && matchesStatus;
                })
                .map((cpn) => (
                  <div key={cpn.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden flex flex-col justify-between">
                    
                    <div>
                      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm px-3 py-1 bg-slate-900 text-amber-300 rounded-xl tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
                            <Tag className="w-3.5 h-3.5 text-amber-400" /> {cpn.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(cpn.code);
                              showToast(`Copied promo code "${cpn.code}" to clipboard!`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Copy code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Active Toggle Switch */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {cpn.isActive ? 'Active' : 'Disabled'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleCouponActive(cpn.id)}
                            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                              cpn.isActive ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              cpn.isActive ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>

                      <div className="pt-3 space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-slate-900">
                            {cpn.type === 'percentage' ? `${cpn.value}% OFF` :
                             cpn.type === 'fixed' ? `R${cpn.value.toFixed(2)} OFF` :
                             'FREE SHIPPING'}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">
                            (Min spend: R${cpn.minSpend.toFixed(2)})
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">{cpn.description}</p>

                        {/* Usage Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Redemptions</span>
                            <span>{cpn.usageCount} / {cpn.maxUsage} used</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                cpn.usageCount >= cpn.maxUsage ? 'bg-rose-500' : 'bg-blue-600'
                              }`} 
                              style={{ width: `${Math.min(100, (cpn.usageCount / cpn.maxUsage) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-[11px] text-slate-400 font-medium">Expires: {cpn.expiryDate}</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCoupon(cpn)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition cursor-pointer text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(cpn.id, cpn.code)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
            </div>

          </div>
        )}

        {/* TAB 5: SETTINGS (SITE SETTINGS & STORE SETTINGS) */}
        {(activeTab === 'settings' || activeTab === 'site-settings') && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Settings Sub-Navigation Tabs */}
            <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setSettingsSubTab('site')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    settingsSubTab === 'site'
                      ? 'bg-blue-600 text-white font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Sliders className="w-4 h-4" /> Site Settings
                </button>
                <button
                  onClick={() => setSettingsSubTab('store')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    settingsSubTab === 'store'
                      ? 'bg-blue-600 text-white font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Store className="w-4 h-4" /> Store Settings
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 text-xs text-slate-400 font-bold">
                <span>Settings Hub</span>
              </div>
            </div>

            {/* SUB-TAB 1: SITE SETTINGS */}
            {settingsSubTab === 'site' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Site Settings Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-extrabold mb-3">
                      <Sliders className="w-3.5 h-3.5" /> Website & System Infrastructure
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Site Settings</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                      Configure mail delivery servers (SMTP), preview and customize email layouts, manage system notification triggers, and access developer integration tools.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shrink-0 relative z-10">
                    <Server className="w-5 h-5 text-blue-400 shrink-0" />
                    <div className="text-xs">
                      <span className="font-extrabold text-slate-200 block">Mail Server (SMTP)</span>
                      <span className="font-extrabold text-emerald-400 text-xs flex items-center gap-1 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {smtpSettings.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Developer Integrations & Advanced Platform Tools */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        <Boxes className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Developer Integrations & Platform Tools</h3>
                        <p className="text-xs text-slate-500 font-medium">Inspect e-commerce SEO schema, preview structured data, and export full-stack Next.js project packages.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {onOpenSeoInspector && (
                      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Search className="w-4 h-4 text-emerald-600" /> SEO & Schema Inspector
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">JSON-LD</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal font-medium">
                            Inspect Next.js 15 E-commerce SEO meta tags, OpenGraph, and Schema.org.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={onOpenSeoInspector}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Launch SEO Inspector</span>
                        </button>
                      </div>
                    )}

                    {onOpenExportNextjs && (
                      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Boxes className="w-4 h-4 text-blue-600" /> Export Next.js Codebase
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-full">App Router</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal font-medium">
                            Export complete Next.js 15 App Router source code zip & files.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={onOpenExportNextjs}
                          className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Boxes className="w-3.5 h-3.5 text-blue-200" />
                          <span>Export Next.js Project</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SMTP SETTINGS & EMAIL LAYOUTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left 5 cols: SMTP Mail Server Settings & Notification Triggers */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                            <Server className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">SMTP Mail Server Config</h3>
                            <p className="text-xs text-slate-400">Configure mail delivery server credentials.</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Active
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">SMTP Host Server</label>
                          <input
                            type="text"
                            value={smtpSettings.host}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Port</label>
                            <input
                              type="text"
                              value={smtpSettings.port}
                              onChange={(e) => setSmtpSettings({ ...smtpSettings, port: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Encryption Protocol</label>
                            <select
                              value={smtpSettings.encryption}
                              onChange={(e) => setSmtpSettings({ ...smtpSettings, encryption: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                            >
                              <option value="TLS (STARTTLS)">TLS (STARTTLS)</option>
                              <option value="SSL (Port 465)">SSL (Port 465)</option>
                              <option value="None / Unencrypted">None / Unencrypted</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">SMTP Username / API Key</label>
                          <input
                            type="text"
                            value={smtpSettings.username}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">SMTP Secret Password</label>
                          <div className="relative">
                            <input
                              type={showSmtpPassword ? 'text' : 'password'}
                              value={smtpSettings.password}
                              onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                            >
                              {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">From Email Address</label>
                            <input
                              type="email"
                              value={smtpSettings.fromEmail}
                              onChange={(e) => setSmtpSettings({ ...smtpSettings, fromEmail: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Sender Name</label>
                            <input
                              type="text"
                              value={smtpSettings.fromName}
                              onChange={(e) => setSmtpSettings({ ...smtpSettings, fromName: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            onClick={() => showToast('SMTP Mail Server configuration saved successfully!')}
                            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" /> Save SMTP
                          </button>
                        </div>

                        {/* Send Test Email Connection */}
                        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Verify Server Connection</span>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              placeholder="Test recipient email..."
                              value={smtpTestRecipient}
                              onChange={(e) => setSmtpTestRecipient(e.target.value)}
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                            />
                            <button
                              type="button"
                              disabled={isTestingSmtp}
                              onClick={() => {
                                if (!smtpTestRecipient) {
                                  showToast('Please enter a test recipient email.');
                                  return;
                                }
                                setIsTestingSmtp(true);
                                setTimeout(() => {
                                  setIsTestingSmtp(false);
                                  showToast(`SMTP Connection Verified! Test email dispatched to ${smtpTestRecipient}`);
                                }, 800);
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1 disabled:opacity-50"
                            >
                              {isTestingSmtp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                              Test
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Automated Customer Notifications Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Automated Customer Notifications</h3>
                            <p className="text-xs text-slate-400">Manage transactional triggers sent to buyers and admins.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { key: 'orderConfirmation', label: 'Order Confirmation Email', desc: 'Sends itemized invoice instantly after purchase' },
                          { key: 'dispatchTracking', label: 'Order Dispatch & Tracking Alert', desc: 'Sends shipping courier tracking link when order is fulfilled' },
                          { key: 'lowStockAlert', label: 'Low Stock Inventory Trigger', desc: 'Alerts store admins when product stock drops below 5 units' },
                          { key: 'reviewInvites', label: 'Post-Purchase Review Invite', desc: 'Automatically invites buyers to submit verified reviews 7 days post-delivery' }
                        ].map((ntf) => (
                          <div key={ntf.key} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">{ntf.label}</span>
                              <span className="text-[10px] text-slate-400 block">{ntf.desc}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const next = !emailNotifications[ntf.key as keyof typeof emailNotifications];
                                setEmailNotifications({ ...emailNotifications, [ntf.key]: next });
                                showToast(`${ntf.label} ${next ? 'enabled' : 'disabled'}`);
                              }}
                              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                                emailNotifications[ntf.key as keyof typeof emailNotifications] ? 'bg-blue-600' : 'bg-slate-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                emailNotifications[ntf.key as keyof typeof emailNotifications] ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right 7 cols: Email Layouts Management & Inspector */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                            <Layout className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Email Layouts Management</h3>
                            <p className="text-xs text-slate-400">Preview & customize customer email theme templates.</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => showToast(`Sample "${selectedEmailTemplate}" template layout sent to ${smtpSettings.fromEmail}`)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                        >
                          <SendHorizontal className="w-3.5 h-3.5" /> Test Layout
                        </button>
                      </div>

                      {/* Template Picker Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                        {[
                          { id: 'welcome', label: '👋 Welcome Email' },
                          { id: 'order_created', label: '🛒 Order Receipt' },
                          { id: 'order_completed', label: '🚚 Order Shipped' },
                          { id: 'order_adjusted', label: '✏️ Order Adjusted' },
                          { id: 'password_reset', label: '🔑 Password Reset' },
                          { id: 'promo', label: '🏷️ VIP Promo' }
                        ].map((tpl) => (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => setSelectedEmailTemplate(tpl.id as any)}
                            className={`px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 ${
                              selectedEmailTemplate === tpl.id 
                                ? 'bg-blue-600 text-white shadow-xs' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {tpl.label}
                          </button>
                        ))}
                      </div>

                      {/* Subject Customizer Input */}
                      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Email Subject Line</label>
                          <input
                            type="text"
                            value={emailTemplateCustomizations[selectedEmailTemplate].subject}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEmailTemplateCustomizations({
                                ...emailTemplateCustomizations,
                                [selectedEmailTemplate]: {
                                  ...emailTemplateCustomizations[selectedEmailTemplate],
                                  subject: val
                                }
                              });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-blue-500 font-sans"
                          />
                        </div>
                      </div>

                      {/* Live Render Email Frame Simulator */}
                      <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-xs bg-slate-100">
                        
                        {/* Mail Client Header */}
                        <div className="bg-slate-800 text-slate-200 p-3 text-[11px] font-mono border-b border-slate-700 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">From: <strong className="text-white">{smtpSettings.fromName}</strong> &lt;{smtpSettings.fromEmail}&gt;</span>
                            <span className="text-[9px] bg-slate-700 text-emerald-400 px-2 py-0.5 rounded-full font-sans font-bold">HTML 5.0 Render</span>
                          </div>
                          <div><span className="text-slate-400">To:</span> customer@example.com</div>
                          <div className="text-blue-300 font-bold truncate"><span className="text-slate-400 font-normal">Subject:</span> {emailTemplateCustomizations[selectedEmailTemplate].subject}</div>
                        </div>

                        {/* Email Content Body Frame */}
                        <div className="p-6 sm:p-8 bg-white max-w-xl mx-auto my-4 rounded-2xl shadow-sm border border-slate-200/80 space-y-6 text-slate-800 text-xs">
                          
                          {/* Header Banner */}
                          <div 
                            className="p-5 rounded-2xl text-white text-center space-y-1 transition-colors"
                            style={{ backgroundColor: emailTemplateCustomizations[selectedEmailTemplate].accentColor }}
                          >
                            <div className="text-lg font-black tracking-wider uppercase font-serif">
                              {storeTitleInput || 'Mrbulk'}
                            </div>
                            <p className="text-[11px] font-medium opacity-90">
                              {emailTemplateCustomizations[selectedEmailTemplate].bannerText}
                            </p>
                          </div>

                          {/* Content Section based on selected template */}
                          {selectedEmailTemplate === 'welcome' && (
                            <div className="space-y-4">
                              <h4 className="text-sm font-extrabold text-slate-900">Welcome to Mrbulk!</h4>
                              <p className="text-slate-600 leading-relaxed">
                                {emailTemplateCustomizations.welcome.previewBody}
                              </p>
                              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold text-center">
                                Your Welcome Voucher: <span className="font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">WELCOME15</span>
                              </div>
                              <div className="text-center pt-2">
                                <span className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer">
                                  Explore Store Catalog →
                                </span>
                              </div>
                            </div>
                          )}

                          {selectedEmailTemplate === 'order_created' && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <span className="font-bold text-slate-900">Order #LX-9402</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Confirmed</span>
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {emailTemplateCustomizations.order_created.previewBody}
                              </p>
                              
                              {/* Itemized summary table preview */}
                              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                                <div className="flex justify-between font-bold text-slate-700 border-b border-slate-200 pb-1 text-[11px]">
                                  <span>Item</span>
                                  <span>Qty / Price</span>
                                </div>
                                <div className="flex justify-between text-slate-600 text-[11px]">
                                  <span>Handcrafted Leather Tote Bag</span>
                                  <span>1 × R450.00</span>
                                </div>
                                <div className="flex justify-between text-slate-600 text-[11px]">
                                  <span>Cashmere Silk Scarf</span>
                                  <span>2 × R120.00</span>
                                </div>
                                <div className="flex justify-between font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                                  <span>Total Paid</span>
                                  <span>R735.60</span>
                                </div>
                              </div>

                              <div className="text-center pt-2">
                                <span className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer">
                                  Track Order Status →
                                </span>
                              </div>
                            </div>
                          )}

                          {selectedEmailTemplate === 'order_completed' && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <span className="font-bold text-slate-900">Shipment Notice #LX-9402</span>
                                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">Shipped</span>
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {emailTemplateCustomizations.order_completed.previewBody}
                              </p>

                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs space-y-1">
                                <div><strong className="font-bold">Courier:</strong> FedEx Express</div>
                                <div><strong className="font-bold">Tracking #:</strong> <span className="font-mono font-bold">TRK-882910-US</span></div>
                              </div>

                              <div className="text-center pt-2">
                                <span className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer">
                                  View Live Delivery Tracking →
                                </span>
                              </div>
                            </div>
                          )}

                          {selectedEmailTemplate === 'order_adjusted' && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <span className="font-bold text-slate-900">Order Adjustment Notice</span>
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Updated</span>
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {emailTemplateCustomizations.order_adjusted.previewBody}
                              </p>

                              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold">
                                Partial Refund Credit: R450.00 applied to original payment card.
                              </div>

                              <div className="text-center pt-2">
                                <span className="inline-block px-6 py-2.5 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer">
                                  View Updated Order Details →
                                </span>
                              </div>
                            </div>
                          )}

                          {selectedEmailTemplate === 'password_reset' && (
                            <div className="space-y-4">
                              <h4 className="text-sm font-extrabold text-slate-900">Security Password Reset</h4>
                              <p className="text-slate-600 leading-relaxed">
                                {emailTemplateCustomizations.password_reset.previewBody}
                              </p>

                              <div className="text-center pt-2">
                                <span className="inline-block px-6 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer">
                                  Reset My Password Now →
                                </span>
                              </div>
                            </div>
                          )}

                          {selectedEmailTemplate === 'promo' && (
                            <div className="space-y-4">
                              <h4 className="text-sm font-extrabold text-blue-900">VIP Exclusive Preview Offer</h4>
                              <p className="text-slate-600 leading-relaxed">
                                {emailTemplateCustomizations.promo.previewBody}
                              </p>

                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 text-center space-y-1">
                                <div className="text-xs font-bold uppercase text-blue-700">Special Promo Code</div>
                                <div className="text-xl font-black font-mono tracking-wider text-blue-900">LUXE20</div>
                                <div className="text-[10px] text-blue-600">Save 20% on orders above R1,500</div>
                              </div>

                              <div className="text-center pt-2">
                                <span className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer">
                                  Claim VIP Offer →
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-1">
                            <div>© 2026 {storeTitleInput || 'Mrbulk'} • Operated by Mr Cheap General Dealer ZA.</div>
                            <div>150 Industrial Rd, Crown North, Johannesburg 2092 • <span className="underline cursor-pointer">Unsubscribe</span></div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* SUB-TAB 2: STORE SETTINGS */}
            {settingsSubTab === 'store' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Store Header Banner */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider block mb-1">Storefront & Catalog Configuration</span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Store Settings</h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                      Manage storefront identity, default currency, product markups, wholesale pricing rules, free shipping thresholds, and payment checkout methods.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 p-3.5 rounded-2xl shrink-0">
                    <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="text-xs">
                      <span className="font-extrabold text-slate-900 block">Free Shipping Threshold</span>
                      <span className="font-extrabold text-blue-600 font-mono text-sm">R{shippingPriceInput.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left 7 cols: Logistics, Payments & Announcements */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Free Shipping Settings Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 relative overflow-hidden">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Free Shipping Price Threshold</h3>
                          <p className="text-xs text-slate-400">Set the minimum cart subtotal required to unlock complimentary express shipping.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-800 block mb-2">
                            Free Shipping Threshold Price (R / ZAR) *
                          </label>
                          <div className="relative max-w-md">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-sm">R</span>
                            <input
                              type="number"
                              min="0"
                              step="5"
                              value={shippingPriceInput}
                              onChange={(e) => setShippingPriceInput(Math.max(0, parseFloat(e.target.value) || 0))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-sm font-extrabold text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition"
                            />
                          </div>
                        </div>

                        {/* Live Preview Bar inside Admin */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                          <span className="font-bold text-slate-700 block">Customer Experience Preview:</span>
                          <p className="text-slate-500 text-[11px]">
                            When a customer adds items, the shopping cart dropdown and cart page will render progress towards <strong className="text-blue-600 font-mono">R{shippingPriceInput.toFixed(2)}</strong>.
                          </p>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-emerald-500 h-full w-3/4 rounded-full" />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onUpdateFreeShippingThreshold) {
                                onUpdateFreeShippingThreshold(shippingPriceInput);
                              }
                              showToast(`Free shipping threshold updated to R${shippingPriceInput.toFixed(2)}!`);
                            }}
                            className={`px-6 py-3.5 ${currentTheme.bg} text-white font-extrabold text-xs rounded-xl shadow-md transition hover:scale-101 active:scale-99 cursor-pointer flex items-center gap-2`}
                          >
                            <Check className="w-4 h-4" /> Save Free Shipping Threshold
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Payment Gateway Configuration Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Payment Gateways & Checkout</h3>
                            <p className="text-xs text-slate-400">Enable or disable live merchant payment methods for buyers.</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full uppercase">
                          PCI-DSS Ready
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          { key: 'stripe', name: 'Stripe Credit & Debit Cards', desc: 'Visa, Mastercard, Amex via encrypted Stripe SDK', icon: CreditCard },
                          { key: 'bankPayment', name: 'Bank Payment (Direct EFT)', desc: 'Direct electronic funds transfer with South African bank details', icon: Building2 },
                          { key: 'paypal', name: 'PayPal Express Checkout', desc: 'Direct one-touch wallet authorization', icon: Globe },
                          { key: 'applePay', name: 'Apple Pay & Google Wallet', desc: 'Instant biometric mobile checkout', icon: Zap },
                          { key: 'klarna', name: 'Klarna Buy Now, Pay Later', desc: 'Split purchases into 4 interest-free payments', icon: Gift },
                          { key: 'cod', name: 'Cash on Delivery (COD)', desc: 'Collect cash payment upon physical package delivery', icon: Truck }
                        ].map((gw) => (
                          <div key={gw.key} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <gw.icon className="w-4 h-4 text-slate-500" />
                              <div>
                                <span className="text-xs font-bold text-slate-900 block">{gw.name}</span>
                                <span className="text-[10px] text-slate-400 block">{gw.desc}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const next = !paymentGateways[gw.key as keyof typeof paymentGateways];
                                setPaymentGateways({ ...paymentGateways, [gw.key]: next });
                                showToast(`${gw.name} ${next ? 'enabled' : 'disabled'}`);
                              }}
                              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                                paymentGateways[gw.key as keyof typeof paymentGateways] ? 'bg-blue-600' : 'bg-slate-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                paymentGateways[gw.key as keyof typeof paymentGateways] ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                        ))}

                        {/* Bank Details Card (Displayed when Bank Payment is ON) */}
                        {paymentGateways.bankPayment && (
                          <div className="mt-4 p-5 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white rounded-3xl border border-blue-700/50 shadow-md space-y-4">
                            <div className="flex items-center justify-between border-b border-blue-800/60 pb-3">
                              <div className="flex items-center gap-2.5">
                                <Building2 className="w-5 h-5 text-blue-400" />
                                <div>
                                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-200">EFT Bank Account Details</h4>
                                  <p className="text-[11px] text-slate-400">These banking details will be displayed to customers selecting Bank Payment at checkout.</p>
                                </div>
                              </div>
                              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black rounded-full uppercase">
                                EFT Active
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="text-[11px] font-extrabold uppercase text-blue-300 block mb-1">Bank Name *</label>
                                <input
                                  type="text"
                                  value={bankDetails.bankName}
                                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                  placeholder="e.g. First National Bank (FNB)"
                                  className="w-full bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-slate-500"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-extrabold uppercase text-blue-300 block mb-1">Account Holder / Name *</label>
                                <input
                                  type="text"
                                  value={bankDetails.accountName}
                                  onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                  placeholder="e.g. Mr Cheap General Dealer ZA (Mrbulk)"
                                  className="w-full bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-slate-500"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-extrabold uppercase text-blue-300 block mb-1">Account Number *</label>
                                <input
                                  type="text"
                                  value={bankDetails.accountNumber}
                                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                  placeholder="e.g. 62894102948"
                                  className="w-full bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white placeholder-slate-500"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-extrabold uppercase text-blue-300 block mb-1">Branch / Universal Code *</label>
                                <input
                                  type="text"
                                  value={bankDetails.branchCode}
                                  onChange={(e) => setBankDetails({ ...bankDetails, branchCode: e.target.value })}
                                  placeholder="e.g. 250655"
                                  className="w-full bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white placeholder-slate-500"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-extrabold uppercase text-blue-300 block mb-1">Account Type</label>
                                <input
                                  type="text"
                                  value={bankDetails.accountType}
                                  onChange={(e) => setBankDetails({ ...bankDetails, accountType: e.target.value })}
                                  placeholder="e.g. Cheque Account"
                                  className="w-full bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-slate-500"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-extrabold uppercase text-blue-300 block mb-1">EFT Payment Reference Rule</label>
                                <input
                                  type="text"
                                  value={bankDetails.referenceInstructions}
                                  onChange={(e) => setBankDetails({ ...bankDetails, referenceInstructions: e.target.value })}
                                  placeholder="e.g. Use Order Number as payment reference"
                                  className="w-full bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-medium text-white placeholder-slate-500"
                                />
                              </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => showToast('Bank details for EFT checkout saved successfully!')}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" /> Save Bank Details for EFT
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Announcement Bar Settings Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Promotional Banner Announcement</h3>
                            <p className="text-xs text-slate-400">Display an alert bar at the top of the storefront homepage.</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setEnableAnnouncement(!enableAnnouncement)}
                          className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                            enableAnnouncement ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            enableAnnouncement ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {enableAnnouncement && (
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-800 block">Announcement Banner Message</label>
                          <input
                            type="text"
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => showToast('Announcement bar message updated!')}
                            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition cursor-pointer"
                          >
                            Update Announcement
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Right 5 cols: Store Branding & Products Settings */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Branding & Identity Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Storefront Identity</h3>
                          <p className="text-xs text-slate-400">Basic website title and support contact info.</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Store Name / Brand Title</label>
                          <input
                            type="text"
                            value={storeTitleInput}
                            onChange={(e) => {
                              setStoreTitleInput(e.target.value);
                              if (onUpdateLogoText) onUpdateLogoText(e.target.value);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Store Contact Email</label>
                          <input
                            type="email"
                            value={storeSupportEmail}
                            onChange={(e) => setStoreSupportEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Store Currency</label>
                          <select
                            value={storeCurrency}
                            onChange={(e) => setStoreCurrency(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                          >
                            <option value="ZAR (R)">ZAR (R) — South African Rand (R)</option>
                            <option value="USD ($)">USD ($) — United States Dollar</option>
                            <option value="EUR (€)">EUR (€) — Eurozone</option>
                            <option value="GBP (£)">GBP (£) — British Pound</option>
                            <option value="CAD ($)">CAD ($) — Canadian Dollar</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Default Sales Tax Rate (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={defaultTaxRate}
                            onChange={(e) => setDefaultTaxRate(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => showToast('Store identity and currency settings saved!')}
                          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          Save Branding & Currency
                        </button>
                      </div>
                    </div>

                    {/* Google Tag Manager & GA4 Integration Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Google Tag Manager</h3>
                            <p className="text-xs text-slate-400">Head script & body iframe tag injection for GA4 tracking.</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded-full uppercase">
                          GA4 Ready
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Google Tag Manager ID</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={adminGtmId}
                              onChange={(e) => setAdminGtmId(e.target.value.toUpperCase())}
                              placeholder="e.g. GTM-XXXXXXX"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Injects the official GTM script into &lt;head&gt; and &lt;iframe&gt; fallback into &lt;body&gt; across all store pages.
                          </p>
                        </div>

                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSaveAdminGtmId}
                            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Save GTM ID
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('analytics');
                              setAnalyticsSubTab('google');
                            }}
                            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Open GA4 Hub</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Products Settings Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                          <Tag className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Products Settings</h3>
                          <p className="text-xs text-slate-400">Global markup %, wholesale pricing & min purchase rules.</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Global Retail Markup (%)</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={tempProductsSettings.globalRetailMarkup}
                              onChange={(e) => setTempProductsSettings({ ...tempProductsSettings, globalRetailMarkup: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">Percentage added to cost price to compute retail price.</p>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Global Wholesale Price (%)</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={tempProductsSettings.globalWholesalePrice}
                              onChange={(e) => setTempProductsSettings({ ...tempProductsSettings, globalWholesalePrice: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">Percentage added to cost price for wholesale price.</p>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Global Minimum Quantity for Wholesale (Pieces)</label>
                          <input
                            type="number"
                            min="1"
                            value={tempProductsSettings.minWholesaleQuantity}
                            onChange={(e) => setTempProductsSettings({ ...tempProductsSettings, minWholesaleQuantity: parseInt(e.target.value) || 1 })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">Minimum pieces required to trigger wholesale tier (default: 6 pieces).</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (onUpdateProductsSettings) {
                              onUpdateProductsSettings(tempProductsSettings);
                            }
                            showToast('Products Settings saved successfully!');
                          }}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Save Products Settings</span>
                        </button>
                      </div>
                    </div>

                    {/* System Status Summary Card */}
                    <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-3 relative overflow-hidden border border-slate-800">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">Live Storefront Engine</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        All store settings are active across product catalog cards, wholesale discounts, cart checkout flows, and tax calculations.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* MARKETING (EMAILS & GOOGLE) TAB */}
        {(activeTab === 'marketing' || activeTab === 'outreach') && (
          <div className="space-y-6 animate-fadeIn">

            {/* Marketing Sub-Navigation Tabs */}
            <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setMarketingMainTab('emails')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    marketingMainTab === 'emails'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Mail className="w-4 h-4" /> Emails
                </button>
                <button
                  onClick={() => setMarketingMainTab('google')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    marketingMainTab === 'google'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Globe className="w-4 h-4" /> Google
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 text-xs text-slate-400 font-bold">
                <span>Marketing Hub</span>
              </div>
            </div>

            {/* EMAILS SUB-TAB CONTENT */}
            {marketingMainTab === 'emails' && (
              <div className="space-y-6 animate-fadeIn">
            
            {/* Marketing Header Banner */}
            <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-amber-500/30">
                      <Megaphone className="w-3.5 h-3.5" /> Customer Marketing Hub
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
                      <Send className="w-3.5 h-3.5" /> Mail Engine Ready
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Email Marketing & Customer Broadcasts</h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                    Broadcast custom newsletters, welcome vouchers, and order notifications directly to your customer database.
                  </p>
                </div>

                {/* Sub-tab pills */}
                <div className="flex bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 shrink-0 self-start md:self-auto">
                  <button
                    onClick={() => setMarketingSubTab('emails')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                      marketingSubTab === 'emails' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" /> Emails Broadcaster
                  </button>
                  <button
                    onClick={() => setMarketingSubTab('campaigns')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                      marketingSubTab === 'campaigns' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Automated Sequences
                  </button>
                  <button
                    onClick={() => setMarketingSubTab('subscribers')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                      marketingSubTab === 'subscribers' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> Subscribers ({INITIAL_CUSTOMERS.length})
                  </button>
                </div>
              </div>

              {/* Quick Stat Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 relative z-10">
                <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Subscribers</span>
                  <span className="text-lg font-black text-white">1,240 <span className="text-xs font-normal text-emerald-400">+12%</span></span>
                </div>
                <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Emails Sent</span>
                  <span className="text-lg font-black text-amber-400">1,420</span>
                </div>
                <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Open Rate</span>
                  <span className="text-lg font-black text-emerald-400">71.4%</span>
                </div>
                <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Click-Through Rate</span>
                  <span className="text-lg font-black text-blue-400">28.6%</span>
                </div>
              </div>
            </div>

            {/* EMAILS BROADCASTER SUB-TAB */}
            {marketingSubTab === 'emails' && (
              <div className="space-y-6">
                
                {/* Grid: Composer (Left 7 cols) & Live Preview (Right 5 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left 7 cols: Composer Form */}
                  <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                          <SendHorizontal className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Email Broadcast Composer</h3>
                          <p className="text-xs text-slate-400">Draft and dispatch email campaigns to customers.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      
                      {/* Target Audience Dropdown */}
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Target Audience Segment</label>
                        <select
                          value={emailAudience}
                          onChange={(e) => setEmailAudience(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                        >
                          <option value="all">All Registered Customers (1,240 subscribers)</option>
                          <option value="vip">VIP Tier Customers Only (180 subscribers)</option>
                          <option value="active">Recent Buyers - Past 30 Days (340 subscribers)</option>
                          <option value="custom">Specific Email Recipient</option>
                        </select>
                      </div>

                      {emailAudience === 'custom' && (
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Recipient Email Address</label>
                          <input
                            type="email"
                            value={customRecipientEmail}
                            onChange={(e) => setCustomRecipientEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}

                      {/* Preset Layout Selector */}
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Preset Email Type / Layout</label>
                        <select
                          value={composerTemplate}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setComposerTemplate(val);
                            if (val === 'welcome') {
                              setComposerSubject('👋 Welcome to Mrbulk! Your Exclusive R150 Voucher');
                              setComposerBody('Dear Customer,\n\nWelcome to Mrbulk! Thank you for creating an account with us. Enjoy R150 off your inaugural purchase with code WELCOME15.');
                            } else if (val === 'order_created') {
                              setComposerSubject('🛒 Order Confirmation #MB-9402');
                              setComposerBody('Dear Customer,\n\nThank you for your order #MB-9402! We have received your purchase and are preparing it for express shipping.');
                            } else if (val === 'order_completed') {
                              setComposerSubject('🚚 Your Order #MB-9402 Has Been Fulfilled & Shipped');
                              setComposerBody('Dear Customer,\n\nYour order #MB-9402 has shipped via Express Courier (Tracking #TRK-882910-ZA). Delivery is estimated in 2 business days.');
                            } else if (val === 'order_adjusted') {
                              setComposerSubject('✏️ Notice: Order #MB-9402 Has Been Adjusted');
                              setComposerBody('Dear Customer,\n\nAn adjustment was applied to your order #MB-9402. A partial refund of R450.00 has been credited back to your account.');
                            } else if (val === 'password_reset') {
                              setComposerSubject('🔑 Password Reset Link for Your Mrbulk Account');
                              setComposerBody('Dear Customer,\n\nClick the secure button below to reset your account password. This security link expires in 30 minutes.');
                            } else if (val === 'promo') {
                              setComposerSubject('✨ Exclusive VIP Offer: 20% Off New Catalog Arrivals');
                              setComposerBody('Dear Valued Customer,\n\nEnjoy an exclusive 20% discount on all new arrivals over R1,500.\n\nUse Code: BULK20 at checkout.');
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                        >
                          <option value="promo">✨ Special VIP Offer / Coupon Campaign</option>
                          <option value="welcome">👋 Welcome Announcement Email</option>
                          <option value="order_created">🛒 Order Confirmation / Receipt</option>
                          <option value="order_completed">🚚 Order Status: Completed & Shipped</option>
                          <option value="order_adjusted">✏️ Order Status: Details Adjusted</option>
                          <option value="password_reset">🔑 Password Reset Link</option>
                          <option value="custom">📝 Custom Email Composition</option>
                        </select>
                      </div>

                      {/* Subject Line */}
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Subject Line</label>
                        <input
                          type="text"
                          value={composerSubject}
                          onChange={(e) => setComposerSubject(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Email Body */}
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Email Body Content</label>
                        <textarea
                          rows={6}
                          value={composerBody}
                          onChange={(e) => setComposerBody(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                        />
                      </div>

                      {/* Attach Promo Coupon */}
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Attach Promotional Discount Coupon</label>
                        <select
                          value={attachCouponCode}
                          onChange={(e) => setAttachCouponCode(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500 font-mono"
                        >
                          <option value="LUXE20">LUXE20 — 20% Off Orders &gt; R1,500</option>
                          <option value="WELCOME15">WELCOME15 — R150 Flat Welcome Voucher</option>
                          <option value="VIP30">VIP30 — 30% Off VIP Member Tier</option>
                          <option value="none">None — No Coupon Attachment</option>
                        </select>
                      </div>

                      {/* Dispatch Button */}
                      <button
                        type="button"
                        disabled={isSendingMarketingEmail}
                        onClick={() => {
                          setIsSendingMarketingEmail(true);
                          setTimeout(() => {
                            setIsSendingMarketingEmail(false);
                            const newLog = {
                              id: `eml-${Date.now().toString().slice(-4)}`,
                              subject: composerSubject,
                              audience: emailAudience === 'all' ? 'All Customers (1,240)' : emailAudience === 'vip' ? 'VIP Tier (180)' : emailAudience === 'active' ? 'Recent Buyers (340)' : `Single (${customRecipientEmail})`,
                              template: composerTemplate.toUpperCase(),
                              sentDate: 'Just now',
                              recipientCount: emailAudience === 'all' ? 1240 : emailAudience === 'vip' ? 180 : emailAudience === 'active' ? 340 : 1,
                              openRate: '0.0%',
                              clickRate: '0.0%',
                              status: 'Delivered'
                            };
                            setSentEmailLogs([newLog, ...sentEmailLogs]);
                            showToast(`Email campaign "${composerSubject}" dispatched successfully!`);
                          }, 900);
                        }}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSendingMarketingEmail ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Broadcasting Email Campaign...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Dispatch Email Campaign Now
                          </>
                        )}
                      </button>

                    </div>
                  </div>

                  {/* Right 5 cols: Live Preview */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-blue-600" /> Live Customer Inbox Preview
                        </span>
                        <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded-full text-slate-600">
                          Real-time
                        </span>
                      </div>

                      {/* Rendered Email Simulator */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 text-xs font-sans">
                        <div className="border-b border-slate-200 pb-2 space-y-1 text-[11px]">
                          <div><strong className="text-slate-700">From:</strong> {smtpSettings.fromName} &lt;{smtpSettings.fromEmail}&gt;</div>
                          <div><strong className="text-slate-700">To:</strong> {emailAudience === 'custom' ? customRecipientEmail : 'customer_segment@luxestore.com'}</div>
                          <div className="font-bold text-blue-700">{composerSubject}</div>
                        </div>

                        {/* Banner */}
                        <div className="bg-amber-600 text-white p-4 rounded-xl text-center">
                          <div className="font-serif text-base font-extrabold">{storeTitleInput || 'Mrbulk'}</div>
                          <div className="text-[10px] opacity-90">Official Customer Communication</div>
                        </div>

                        {/* Body */}
                        <div className="whitespace-pre-line text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200/80">
                          {composerBody}
                        </div>

                        {/* Attached Coupon */}
                        {attachCouponCode !== 'none' && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center text-blue-950 font-bold">
                            Attached Coupon Code: <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded text-xs ml-1">{attachCouponCode}</span>
                          </div>
                        )}

                        <div className="text-center pt-1">
                          <span className="inline-block px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs">
                            Shop Mrbulk Now →
                          </span>
                        </div>

                        <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                          © 2026 {storeTitleInput || 'Mrbulk'} • 150 Industrial Rd, Crown North, Johannesburg
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Sent Email History Logs Table */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Sent Email Logs & Analytics</h3>
                        <p className="text-xs text-slate-400">History of dispatched emails and delivery status.</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                          <th className="pb-3">Campaign Subject</th>
                          <th className="pb-3">Target Audience</th>
                          <th className="pb-3">Sent Date</th>
                          <th className="pb-3 text-center">Recipients</th>
                          <th className="pb-3 text-center">Open Rate</th>
                          <th className="pb-3 text-center">Click Rate</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {sentEmailLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 font-bold text-slate-900 max-w-xs truncate">{log.subject}</td>
                            <td className="py-3.5 text-slate-600">{log.audience}</td>
                            <td className="py-3.5 text-slate-500 text-[11px] font-mono">{log.sentDate}</td>
                            <td className="py-3.5 text-center font-bold text-slate-800">{log.recipientCount}</td>
                            <td className="py-3.5 text-center font-extrabold text-emerald-600">{log.openRate}</td>
                            <td className="py-3.5 text-center font-extrabold text-blue-600">{log.clickRate}</td>
                            <td className="py-3.5 text-right">
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full uppercase">
                                {log.status}
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

            {/* AUTOMATED SEQUENCES SUB-TAB */}
            {marketingSubTab === 'campaigns' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: '👋 Welcome Drip Workflow', trigger: 'Triggered upon new customer signup', conversion: '64.2%', status: 'Active (Automated)' },
                  { title: '🛒 Abandoned Cart Recovery', trigger: 'Triggered 2 hours post cart drop', conversion: '38.5%', status: 'Active (Automated)' },
                  { title: '👑 Post-Purchase VIP Loyalty', trigger: 'Triggered 7 days post order delivery', conversion: '42.0%', status: 'Active (Automated)' }
                ].map((seq, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full uppercase">
                        {seq.status}
                      </span>
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{seq.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{seq.trigger}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Conversion Rate:</span>
                      <span className="font-extrabold text-blue-600">{seq.conversion}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUBSCRIBERS SUB-TAB */}
            {marketingSubTab === 'subscribers' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900">Subscribed Customer Audience ({INITIAL_CUSTOMERS.length})</h3>
                  <span className="text-xs text-slate-400 font-bold">100% Opted-In (GDPR Compliant)</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {INITIAL_CUSTOMERS.map((cust) => (
                    <div key={cust.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <SafeImage src={cust.avatarUrl} alt={cust.name} className="w-8 h-8 rounded-full object-cover" placeholderType="avatar" fallbackTitle={cust.name} />
                        <div>
                          <span className="font-bold text-slate-900 block">{cust.name}</span>
                          <span className="text-[11px] text-slate-400">{cust.email}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full uppercase">
                        {cust.status} Member
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            </div>
          )}

          {/* GOOGLE SUB-TAB (GOOGLE SALES & MARKETING HUB) */}
          {marketingMainTab === 'google' && (
            <div className="space-y-6 animate-fadeIn">
              <GoogleMarketingHub 
                products={catalogProducts} 
                storeCurrency={storeCurrency} 
              />
            </div>
          )}

          </div>
        )}

        {/* SECURITY & THREAT CENTER TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header & Status Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-rose-500/30">
                      <ShieldAlert className="w-3.5 h-3.5" /> Threat Defense Active
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" /> WAF Protected
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Security & Moderation Center</h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                    Automated bad-word filtering for reviews, Web Application Firewall (WAF) hack attempt monitoring, and real-time user behavior fraud detection.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 shrink-0">
                  <div className="p-2 rounded-xl bg-slate-700 text-rose-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">WAF Strict Firewall</span>
                    <span className="text-[10px] text-slate-400 block">{wafStrictMode ? 'Active (Auto-Blocking Attack Vectors)' : 'Monitoring Mode Only'}</span>
                  </div>
                  <button
                    onClick={() => {
                      setWafStrictMode(!wafStrictMode);
                      showToast(wafStrictMode ? 'WAF switched to Monitoring Mode' : 'WAF switched to Strict Auto-Block Mode!');
                    }}
                    className={`ml-2 px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      wafStrictMode ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    }`}
                  >
                    {wafStrictMode ? 'Strict' : 'Standard'}
                  </button>
                </div>
              </div>
            </div>

            {/* 3 CORE SECURITY CARDS */}
            <div className="space-y-6">

              {/* CARD 1: LIKELY BAD WORDS FROM CUSTOMER REVIEWS */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 border border-rose-100 shrink-0">
                      <Ban className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">1. Prohibited Review Bad Words & Moderation</h3>
                      <p className="text-xs text-slate-500">
                        Automatically flag or block reviews containing profanity, fraud accusations, or defamatory words before publication.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full w-fit">
                    {badWordsList.length} Prohibited Patterns
                  </span>
                </div>

                {/* Add New Bad Word Form */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">Add Word / Phrase to Moderation Filter</span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <input
                      type="text"
                      placeholder="e.g. scam, fake, stolen..."
                      value={newBadWordInput}
                      onChange={(e) => setNewBadWordInput(e.target.value)}
                      className="sm:col-span-5 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={newBadWordCategory}
                      onChange={(e) => setNewBadWordCategory(e.target.value)}
                      className="sm:col-span-3 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Fraud Allegation">Fraud Allegation</option>
                      <option value="Defamation">Defamation</option>
                      <option value="Counterfeit Allegation">Counterfeit Allegation</option>
                      <option value="Abuse">Abuse</option>
                      <option value="Profanity">Profanity</option>
                    </select>
                    <select
                      value={newBadWordSeverity}
                      onChange={(e) => setNewBadWordSeverity(e.target.value as any)}
                      className="sm:col-span-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddBadWord}
                      className="sm:col-span-2 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Word
                    </button>
                  </div>
                </div>

                {/* Active Bad Words Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Prohibited Word Filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {badWordsList.map((bw) => (
                      <div
                        key={bw.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs"
                      >
                        <span className="font-extrabold text-rose-900">"{bw.word}"</span>
                        <span className="text-[10px] text-rose-600 font-bold bg-rose-100 px-1.5 py-0.5 rounded-md">
                          {bw.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({bw.count} matches)</span>
                        <button
                          onClick={() => handleDeleteBadWord(bw.id, bw.word)}
                          className="text-slate-400 hover:text-rose-700 transition cursor-pointer p-0.5"
                          title="Remove filter"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flagged Review Feed */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Recently Intercepted Reviews ({flaggedReviewSnippets.length})
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">Auto-moderated by keyword engine</span>
                  </div>

                  <div className="space-y-2.5">
                    {flaggedReviewSnippets.map((item) => (
                      <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{item.author}</span>
                            <span className="text-[10px] text-slate-400">{item.date}</span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase">
                              Matched: "{item.wordMatched}"
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 italic line-clamp-1">"{item.text}"</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setFlaggedReviewSnippets(flaggedReviewSnippets.filter(f => f.id !== item.id));
                              showToast('Review approved and published.');
                            }}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setFlaggedReviewSnippets(flaggedReviewSnippets.filter(f => f.id !== item.id));
                              showToast('Review permanently deleted.');
                            }}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* CARD 2: HACK ATTEMPTS & FIREWALL INTERCEPT LOG */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100 shrink-0">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">2. Website Hack Attempts & WAF Intercepts</h3>
                      <p className="text-xs text-slate-500">
                        Live intrusion prevention log recording SQL injections, XSS payloads, path traversals, and brute force login attempts.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                      5 Attacks Blocked Today
                    </span>
                  </div>
                </div>

                {/* Mobile Card View for Hack Attempts */}
                <div className="block md:hidden space-y-3">
                  {hackAttemptsList.map((hack) => (
                    <div key={hack.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg">
                          {hack.attackType}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{hack.timestamp}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Target URL Payload</span>
                        <code className="text-[11px] font-mono text-slate-800 bg-white p-2 rounded-xl border border-slate-200 block overflow-x-auto break-all">
                          {hack.targetUrl}
                        </code>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Origin IP</span>
                          <span className="font-mono font-bold text-slate-800">{hack.originIp}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Country</span>
                          <span className="font-semibold text-slate-700">{hack.country}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-2.5">
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {hack.status}
                        </span>
                        <button
                          onClick={() => handleBanIp(hack.originIp)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3 text-rose-400" /> Ban IP
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View for Hack Attempts */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/80 font-extrabold text-slate-400 uppercase tracking-wider text-[10px] bg-slate-50">
                        <th className="p-3">Time</th>
                        <th className="p-3">Attack Vector</th>
                        <th className="p-3">Target Payload / Route</th>
                        <th className="p-3">Origin IP & Location</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {hackAttemptsList.map((hack) => (
                        <tr key={hack.id} className="hover:bg-slate-50/60 transition">
                          <td className="p-3 font-medium text-slate-500 text-[11px] whitespace-nowrap">{hack.timestamp}</td>
                          <td className="p-3">
                            <span className="font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                              {hack.attackType}
                            </span>
                          </td>
                          <td className="p-3">
                            <code className="font-mono text-[11px] text-slate-800 bg-slate-100 px-2 py-1 rounded-md max-w-xs block truncate">
                              {hack.targetUrl}
                            </code>
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-bold text-slate-900 block">{hack.originIp}</span>
                            <span className="text-[10px] text-slate-400">{hack.country}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px] inline-flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> {hack.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleBanIp(hack.originIp)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-rose-600 text-white font-bold text-[11px] rounded-lg transition cursor-pointer"
                            >
                              Ban IP
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* CARD 3: SUSPICIOUS BEHAVIOR FROM WEBSITE USERS */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100 shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">3. Suspicious User Behavior & Fraud Detection</h3>
                      <p className="text-xs text-slate-500">
                        Behavioral telemetry flag for carding attacks, coupon brute forcing, impossible travel velocity, and scraping bots.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
                    {suspiciousBehaviorsList.length} Active Alerts
                  </span>
                </div>

                {/* Mobile & Desktop List of Suspicious Behaviors */}
                <div className="space-y-3">
                  {suspiciousBehaviorsList.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl">
                      <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
                      <p className="font-bold text-slate-700 text-sm">No suspicious user activity detected.</p>
                      <p className="text-xs text-slate-400 mt-0.5">All customer sessions and API activity are within normal parameters.</p>
                    </div>
                  ) : (
                    suspiciousBehaviorsList.map((susp) => (
                      <div key={susp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                              susp.riskScore >= 85 ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                              susp.riskScore >= 75 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              Risk Score: {susp.riskScore}/100
                            </span>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">{susp.behaviorType}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">{susp.timestamp}</span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                          {susp.details}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">User Account / Session</span>
                            <span className="font-bold text-slate-800">{susp.user}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">IP & Location</span>
                            <span className="font-mono text-slate-700">{susp.ip} ({susp.location})</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">System Defense Action</span>
                            <span className="font-bold text-blue-700">{susp.actionTaken}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => handleBanIp(susp.ip)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                          >
                            <Ban className="w-3.5 h-3.5" /> Ban IP / Lock User
                          </button>
                          <button
                            onClick={() => handleDismissSuspicious(susp.id)}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* VENDORS & COMPLIANCE HUB */}
        {activeTab === 'vendors' && (
          <VendorComplianceAdmin />
        )}

        {/* PAYLOAD CMS 3.88 ARCHITECTURE HUB */}
        {activeTab === 'payload' && (
          <PayloadHub />
        )}

          </main>
        </div>
      </div>

      {/* CUSTOMER DETAIL MODAL */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full z-10 overflow-hidden border border-slate-100 relative">
              
              <div className="bg-slate-900 text-white p-6 relative">
                <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-4">
                  <SafeImage src={selectedCustomer.avatarUrl} className="w-16 h-16 rounded-full object-cover border-2 border-blue-400" alt={selectedCustomer.name} placeholderType="avatar" fallbackTitle={selectedCustomer.name} />
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {selectedCustomer.name}
                      {selectedCustomer.status === 'vip' && <Crown className="w-4 h-4 text-amber-400" />}
                    </h3>
                    <span className="text-xs text-slate-400 block">{selectedCustomer.email}</span>
                    <span className="text-[10px] font-bold text-blue-400 uppercase mt-1 inline-block">ID: {selectedCustomer.id}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Lifetime Spent</span>
                    <span className="text-base font-extrabold text-slate-900">{formatCurrency(selectedCustomer.totalSpent)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed Orders</span>
                    <span className="text-base font-extrabold text-slate-900">{selectedCustomer.totalOrders}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" /> {selectedCustomer.phone || '+1 (555) 019-2834'}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" /> Member since: {selectedCustomer.joinedDate}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" /> Last Active: {selectedCustomer.lastActive}
                  </div>
                  {selectedCustomer.address && (
                    <div className="flex items-start gap-2 text-slate-600 pt-1">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> 
                      <span>{selectedCustomer.address.street}, {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zip}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    onClick={() => {
                      handleToggleCustomerStatus(selectedCustomer.id);
                      setSelectedCustomer(null);
                    }}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    Toggle VIP Status
                  </button>
                  <button 
                    onClick={() => setSelectedCustomer(null)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD CUSTOMER MODAL */}
      <AnimatePresence>
        {showAddCustomerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddCustomerModal(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl max-w-md w-full z-10 p-6 sm:p-8 space-y-5 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Add New Customer</h3>
              
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Adams"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rachel@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Initial Status</label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="active">Active Customer</option>
                    <option value="vip">VIP Customer</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomerModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer`}
                  >
                    Save Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure catalog details, pricing, categories, and tags.</p>
                </div>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wireless Noise-Cancelling Headphones"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  {/* Pricing Structure Group */}
                  <div className="sm:col-span-2 p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                      <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pricing Structure & Markups</span>
                      </label>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        Auto Markup Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Cost Price (R)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 80.00"
                          value={productForm.costPrice}
                          onChange={(e) => handleCostPriceChange(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">Unit cost to manufacture/buy</span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Retail Markup Price (R)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 120.00"
                          value={productForm.retailMarkupPrice}
                          onChange={(e) => setProductForm({ ...productForm, retailMarkupPrice: e.target.value, retailPrice: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">Retail price with markup</span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Wholesale Price (R) *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="e.g. 96.00"
                          value={productForm.wholesalePrice}
                          onChange={(e) => setProductForm({ ...productForm, wholesalePrice: e.target.value, price: e.target.value })}
                          className="w-full bg-blue-50/50 border border-blue-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-extrabold text-blue-900"
                        />
                        <span className="text-[9px] text-blue-600 font-bold mt-1 block">Displayed on product cards</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Selling Price (R) *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="e.g. 96.00"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Original / Comparison Price (R)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 149.99 (Optional)"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    >
                      {catalogCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Brand</label>
                    <select
                      value={productForm.brandId}
                      onChange={(e) => {
                        const bId = Number(e.target.value);
                        if (bId === 0) {
                          setProductForm({ ...productForm, brandId: 0, brand: 'No brand' });
                        } else {
                          const bObj = catalogBrands.find(b => b.id === bId);
                          setProductForm({ ...productForm, brandId: bId, brand: bObj?.name || 'No brand' });
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                    >
                      <option value={0}>No brand</option>
                      {catalogBrands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Stock Amount *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 25"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  {/* Main Product Image Upload / URL */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-slate-700 block">Main Product Image *</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <SafeImage src={productForm.imageUrl} className="w-full h-full object-cover" alt="Main preview" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg cursor-pointer transition flex items-center gap-1.5 border border-slate-200">
                            <Upload className="w-3.5 h-3.5 text-slate-600" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMainImageFileUpload}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-slate-400">or paste image URL above</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images Management */}
                  <div className="sm:col-span-2 space-y-2.5 p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                        <ImagePlus className="w-3.5 h-3.5 text-blue-600" />
                        <span>Product Gallery Images ({productForm.galleryImages.length})</span>
                      </label>
                      <label className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] rounded-lg cursor-pointer transition flex items-center gap-1 border border-blue-200/60">
                        <Upload className="w-3 h-3 text-blue-600" />
                        <span>Upload Gallery</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleGalleryFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Paste gallery image URL..."
                        value={productForm.newGalleryUrl}
                        onChange={(e) => setProductForm({ ...productForm, newGalleryUrl: e.target.value })}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryUrl}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>

                    {/* Gallery Thumbnails List */}
                    {productForm.galleryImages.length > 0 && (
                      <div className="flex items-center gap-2.5 overflow-x-auto pt-1 pb-1 scrollbar-thin">
                        {productForm.galleryImages.map((imgUrl, idx) => (
                          <div key={idx} className="relative group shrink-0 w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                            <SafeImage src={imgUrl} className="w-full h-full object-cover" alt={`Gallery ${idx + 1}`} />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 transition shadow-xs cursor-pointer"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Wireless, Audio, Premium, Popular"
                      value={productForm.tagsString}
                      onChange={(e) => setProductForm({ ...productForm, tagsString: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Enter detailed product description..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={productForm.isFeatured}
                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Featured Product ⭐</span>
                    </label>

                    <div className="text-[11px] font-semibold text-slate-500 bg-white/80 border border-slate-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Sale badge & % off badge are auto-calculated from Original Price</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  {editingProduct ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (editingProduct) {
                          handleDeleteProduct(editingProduct.id, editingProduct.name);
                          setShowProductModal(false);
                        }
                      }}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Product
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowProductModal(false)}
                      className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2.5 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer`}
                    >
                      Save Product
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT CATEGORY MODAL */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingCategory ? `Edit "${editingCategory.name}"` : 'Add New Category'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Home & Lighting"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Category Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description displayed on category pages and frontend shop filters..."
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Category Image</label>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                      {categoryForm.imageUrl ? (
                        <SafeImage src={categoryForm.imageUrl} alt="Category preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-slate-400 p-1">
                          <ImageIcon className="w-6 h-6 mx-auto mb-0.5 text-slate-300" />
                          <span className="text-[9px] block font-medium">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCategoryImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        {categoryForm.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setCategoryForm({ ...categoryForm, imageUrl: '' })}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs cursor-pointer transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Image</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">Upload a picture or paste an image URL below.</p>
                    </div>
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={categoryForm.imageUrl}
                    onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer`}
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT BRAND MODAL */}
        {showBrandModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingBrand ? `Edit "${editingBrand.name}"` : 'Add New Brand'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBrand} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Brand / Designer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bang & Olufsen"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Logo / Banner Image</label>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                      {brandForm.imageUrl ? (
                        <SafeImage src={brandForm.imageUrl} alt="Brand preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-slate-400 p-1">
                          <ImageIcon className="w-6 h-6 mx-auto mb-0.5 text-slate-300" />
                          <span className="text-[9px] block font-medium">No Logo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBrandImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        {brandForm.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setBrandForm({ ...brandForm, imageUrl: '' })}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs cursor-pointer transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Image</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">Upload a logo or enter an image URL.</p>
                    </div>
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={brandForm.imageUrl}
                    onChange={(e) => setBrandForm({ ...brandForm, imageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBrandModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer`}
                  >
                    Save Brand
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD TAG MODAL */}
        {showTagModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Add New Search Tag</h3>
                <button
                  onClick={() => setShowTagModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTag} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Tag Keyword *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ergonomic, Sustainable, Smart"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Tags are automatically prefixed with # and added to keyword indexing.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTagModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer`}
                  >
                    Register Tag
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD REVIEW MODAL */}
        {showAddReviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Add Verified Customer Review</h3>
                  <p className="text-xs text-slate-400">Post an official verified review directly to a catalog item.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateReview} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Catalog Product *</label>
                  <select
                    required
                    value={newReviewForm.productId}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, productId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="">-- Select Product --</option>
                    {catalogProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.price)})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Reviewer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jessica Miller"
                      value={newReviewForm.authorName}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, authorName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Reviewer Email</label>
                    <input
                      type="email"
                      placeholder="e.g. jessica@example.com"
                      value={newReviewForm.authorEmail}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, authorEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Star Rating (1 - 5) *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewForm({ ...newReviewForm, rating: star })}
                        className="p-1 cursor-pointer transition hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReviewForm.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200 fill-slate-100'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">{newReviewForm.rating} Out of 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Headline / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Exceeded my expectations!"
                    value={newReviewForm.title}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Review Body Comment *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Write detailed customer feedback..."
                    value={newReviewForm.comment}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReviewModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer`}
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT COUPON MODAL */}
        {showCouponModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingCoupon ? `Edit Promo Code "${editingCoupon.code}"` : 'Create New Promo Code'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure discount value, spend thresholds, and usages.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCoupon} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Promo Code Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AUTUMN25"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-blue-500 uppercase"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Discount Type *</label>
                    <select
                      value={couponForm.type}
                      onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="percentage">Percentage Off (%)</option>
                      <option value="fixed">Fixed Amount Off (R)</option>
                      <option value="shipping">Free Shipping</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {couponForm.type === 'percentage' ? 'Percentage Off (%)' : couponForm.type === 'fixed' ? 'Amount Off (R)' : 'Value (R)'}
                    </label>
                    <input
                      type="number"
                      step="1"
                      disabled={couponForm.type === 'shipping'}
                      value={couponForm.type === 'shipping' ? 0 : couponForm.value}
                      onChange={(e) => setCouponForm({ ...couponForm, value: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Min Order (R)</label>
                    <input
                      type="number"
                      step="5"
                      value={couponForm.minSpend}
                      onChange={(e) => setCouponForm({ ...couponForm, minSpend: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Max Usages</label>
                    <input
                      type="number"
                      value={couponForm.maxUsage}
                      onChange={(e) => setCouponForm({ ...couponForm, maxUsage: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Expiration Date</label>
                    <input
                      type="date"
                      value={couponForm.expiryDate}
                      onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Offer Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 20% discount on all orders over R1,000"
                    value={couponForm.description}
                    onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer`}
                  >
                    {editingCoupon ? 'Update Promo Code' : 'Save Promo Code'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* PRINTABLE TAX INVOICE MODAL */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8"
            >
              {/* Modal Control Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-extrabold text-slate-900">Tax Invoice #{showInvoiceModal.id}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Invoice
                  </button>
                  <button
                    onClick={() => setShowInvoiceModal(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Body */}
              <div className="space-y-6 text-slate-800">
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{logoText}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Official Tax Invoice & Receipt</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-700 block">INVOICE #{showInvoiceModal.id}</span>
                    <span className="text-xs text-slate-400 block">Date: {showInvoiceModal.orderDate}</span>
                    <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      showInvoiceModal.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {showInvoiceModal.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Billed To (Customer)</span>
                    <p className="font-extrabold text-slate-900 text-sm">{showInvoiceModal.customerName}</p>
                    <p className="text-slate-600">{showInvoiceModal.customerEmail}</p>
                    <p className="text-slate-600">{showInvoiceModal.customerPhone}</p>
                    <p className="text-slate-600 mt-2">{showInvoiceModal.shippingAddress.street}</p>
                    <p className="text-slate-600">{showInvoiceModal.shippingAddress.city}, {showInvoiceModal.shippingAddress.state} {showInvoiceModal.shippingAddress.zip}</p>
                    <p className="text-slate-600">{showInvoiceModal.shippingAddress.country}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Logistics Info</span>
                    <p className="text-slate-700"><strong>Payment Method:</strong> {showInvoiceModal.paymentMethod}</p>
                    <p className="text-slate-700"><strong>Fulfillment Status:</strong> {showInvoiceModal.status}</p>
                    <p className="text-slate-700"><strong>Carrier:</strong> {showInvoiceModal.shippingCarrier || 'Standard Express'}</p>
                    <p className="text-slate-700"><strong>Tracking #:</strong> {showInvoiceModal.trackingNumber || 'N/A'}</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        <th className="py-2.5 px-4">Item Description</th>
                        <th className="py-2.5 px-4">SKU</th>
                        <th className="py-2.5 px-4 text-right">Price</th>
                        <th className="py-2.5 px-4 text-center">Qty</th>
                        <th className="py-2.5 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {showInvoiceModal.items.map(i => (
                        <tr key={i.id}>
                          <td className="py-3 px-4 font-bold text-slate-900">{i.name}</td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">{i.sku || 'N/A'}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(i.price)}</td>
                          <td className="py-3 px-4 text-center">{i.quantity}</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(i.price * i.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end text-xs">
                  <div className="w-64 space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(showInvoiceModal.subtotal)}</span>
                    </div>
                    {showInvoiceModal.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount</span>
                        <span>-{formatCurrency(showInvoiceModal.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Tax</span>
                      <span>{formatCurrency(showInvoiceModal.tax)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span>{showInvoiceModal.shippingCost === 0 ? 'FREE' : formatCurrency(showInvoiceModal.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                      <span>Total Paid</span>
                      <span>{formatCurrency(showInvoiceModal.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                  Thank you for shopping with {logoText}! Contact support if you need assistance with this tax receipt.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
