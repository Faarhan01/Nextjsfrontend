export type UserRole = 'customer' | 'admin' | 'seller' | 'vip';
export type VendorAccountType = 'sole_proprietor' | 'sa_business';
export type VendorApplicationStatus = 'pending_approval' | 'approved' | 'rejected';
export type SellerStatus = 'active' | 'suspended' | 'pending';
export type ProductCondition = 'Brand New' | 'Like New' | 'Refurbished' | 'Open Box';
export type ProductSubmissionStatus = 'pending_approval' | 'approved' | 'rejected';

export interface VendorProductSubmission {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail?: string;
  name: string;
  brand: string;
  categoryId?: number;
  categoryName?: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  condition: ProductCondition;
  shippingDays: number;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  tags: string[];
  sku?: string;
  notes?: string;
  status: ProductSubmissionStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  approvedProductId?: string;
}

export interface VendorDocument {
  name: string;
  size?: string;
  dataUrl?: string;
  type: 'sa_id_passport' | 'cipc_certificate' | 'proof_of_address' | 'other';
  uploadedAt: string;
}

export interface VendorApplication {
  id: string;
  userId?: string;
  accountType: VendorAccountType;
  storeName: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  taxOrRegistrationId: string;
  description: string;
  documents: VendorDocument[];
  status: VendorApplicationStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  password?: string;
}

export interface SellerAccount {
  id: string;
  userId: string;
  storeName: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  accountType: VendorAccountType;
  taxOrRegistrationId: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  location?: string;
  dispatchSla?: string;
  returnPolicyDays?: number;
  verifiedBadgeText?: string;
  status: SellerStatus;
  rating: number;
  totalSales: number;
  ordersCount: number;
  activeListingsCount: number;
  commissionRate: number; // Percentage e.g. 10
  joinedDate: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branchCode: string;
    accountHolder: string;
    accountType: string;
  };
}

export interface VendorOffer {
  offerId: string;
  sellerId: string;
  sellerName: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  condition: ProductCondition;
  shippingDays: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  notes?: string;
}

export interface SlideConfig {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  backgroundType: 'gradient' | 'image' | 'color';
  backgroundColor: string;
  backgroundGradient: string;
  backgroundImage: string;
  titleAnimation: 'fadeInUp' | 'slideInLeft' | 'zoomIn' | 'fadeIn';
  subtitleAnimation: 'fadeInUp' | 'slideInLeft' | 'zoomIn' | 'fadeIn';
  buttonStyle: 'solid' | 'outline' | 'pill';
  buttonColor: string;
  buttonTextColor: string;
  targetPage?: string;
  slideType?: 'custom' | 'product' | 'category';
  productId?: string;
  categoryId?: string;
  productPrice?: string;
  productImage?: string;
  categoryImage?: string;
}

export interface SliderSettings {
  height: '400px' | '500px' | '600px' | '700px' | '100vh';
  autoplay: boolean;
  autoplaySpeed: number;
  dotStyle: 'expand' | 'bounce' | 'glow' | 'minimal';
  dotColor: string;
  activeDotColor: string;
  arrowStyle: 'rounded' | 'square' | 'minimal' | 'none';
  arrowColor: string;
  textColor: 'light' | 'dark';
  bannerType?: 'standard' | 'advanced';
}

export interface CategoryCarouselSettings {
  showCategories: boolean;
  showTitle?: boolean;
  title: string;
  subtitle: string;
  count: number;
  hoverEffect: 'zoom' | 'glow' | 'border' | 'none';
  titleColor: string;
  labelColor: string;
  columnsDesktop: number;
  useFirstAsSale?: boolean;
  displayStyle?: 'image' | 'icon' | 'both';
}

export interface BrandCarouselSettings {
  showBrands: boolean;
  showTitle?: boolean;
  title: string;
  subtitle: string;
  count: number;
  hoverEffect: 'zoom' | 'glow' | 'border' | 'none';
  titleColor: string;
  columnsDesktop: number;
  cardShape?: 'rectangular' | 'square' | 'circular' | 'squircle';
}

export interface MockSubCategory {
  id: number;
  name: string;
  imageUrl?: string;
  description?: string;
}

export interface MockCategory {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  subcategories?: MockSubCategory[];
  icon?: string;
}

export interface ProductsSettings {
  globalRetailMarkup: number;
  globalWholesalePrice: number;
  minWholesaleQuantity: number;
}

export interface MockProduct {
  id: string;
  name: string;
  price: string;
  costPrice?: string;
  retailPrice?: string;
  retailMarkupPrice?: string;
  wholesalePrice?: string;
  minWholesaleQuantity?: number;
  originalPrice?: string;
  isSale?: boolean;
  saleBadgeText?: string;
  isFeatured?: boolean;
  imageUrl: string;
  images?: string[];
  stock?: number;
  url: string;
  description?: string;
  brand?: string;
  brandId?: number;
  categoryId?: number;
  subcategoryId?: number;
  category?: string;
  sku?: string;
  barcode?: string;
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  offers?: VendorOffer[];
  primarySellerId?: string;
  primarySellerName?: string;
  bulkPricing?: Array<{ minQty: number; price: number }>;
  specifications?: Record<string, string>;
}

export interface MockBrand {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  icon?: string;
  svgLogo?: string;
}

export interface HeaderSettings {
  showHeader: boolean;
  logoText: string;
  selectedMenu: string;
  cartCount: number;
  wishlistUrl: string;
  accountUrl: string;
  shopUrl: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  status: 'active' | 'vip' | 'inactive' | 'pending_approval' | 'suspended';
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastActive: string;
  sellerId?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  retailPrice?: number;
  wholesalePrice?: number;
  minWholesaleQuantity?: number;
  selectedOfferId?: string;
  sellerId?: string;
  sellerName?: string;
  sellerPrice?: number;
  condition?: ProductCondition;
}

export interface CustomWishlist {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  productIds: string[];
  createdAt: string;
  isDefault?: boolean;
}

export interface RegionCountry {
  id: string;
  iso_2: string;
  iso_3?: string;
  name: string;
  display_name?: string;
}

export interface StoreRegion {
  id: string;
  name: string;
  currency_code: string;
  tax_rate: number;
  countries?: RegionCountry[];
}

