export interface PayloadMedia {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  mimeType?: string;
  filesize?: number;
  thumbnailUrl?: string;
}

export interface PayloadProductVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  options: {
    color?: string;
    size?: string;
    material?: string;
    edition?: string;
    [key: string]: string | undefined;
  };
  image?: PayloadMedia | string;
}

export interface PayloadProductSpec {
  name: string;
  value: string;
}

export interface PayloadProductSEO {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
}

export interface PayloadProductDoc {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  numericPrice: number;
  isSale?: boolean;
  saleBadgeText?: string;
  isFeatured?: boolean;
  inventory: number;
  lowStockThreshold?: number;
  allowBackorder?: boolean;
  images: Array<PayloadMedia | string>;
  category: {
    id: number | string;
    title: string;
    slug: string;
  };
  brand?: {
    id: number | string;
    title: string;
    slug?: string;
    logo?: string;
  };
  tags: string[];
  description: string;
  richDescription?: any[];
  specs?: PayloadProductSpec[];
  variants?: PayloadProductVariant[];
  rating: number;
  reviewsCount: number;
  seo?: PayloadProductSEO;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
}

export interface PayloadCategoryDoc {
  id: number | string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  parent?: string | number | null;
  breadcrumbs?: Array<{
    id: string | number;
    title: string;
    slug: string;
  }>;
  subcategories?: Array<{
    id: number | string;
    title: string;
    slug: string;
    itemCount?: number;
  }>;
  featured?: boolean;
  itemCount?: number;
}

export interface PayloadAddress {
  id: string;
  label?: string;
  name: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface PayloadOrderItem {
  id: string;
  product: {
    id: string;
    title: string;
    slug: string;
    image: string;
    sku?: string;
  };
  variant?: {
    id: string;
    title: string;
    sku?: string;
  };
  price: number;
  quantity: number;
  subtotal: number;
}

export interface PayloadOrderTimelineStep {
  title: string;
  description: string;
  date: string;
  location?: string;
  completed: boolean;
  current?: boolean;
}

export interface PayloadOrderDoc {
  id: string;
  orderNumber: string;
  customer: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: PayloadOrderItem[];
  financials: {
    subtotal: number;
    shippingFee: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
  };
  couponApplied?: {
    code: string;
    discountType: 'percentage' | 'fixed' | 'free_shipping';
    discountAmount: number;
  };
  shippingAddress: PayloadAddress;
  billingAddress?: PayloadAddress;
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingCarrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  timeline: PayloadOrderTimelineStep[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadCouponDoc {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderSubtotal: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface PayloadReviewDoc {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  author: {
    id?: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  isVerifiedBuyer: boolean;
  status: 'published' | 'pending' | 'flagged';
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadCustomerDoc {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses: PayloadAddress[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  rewardPoints: number;
  tier: 'silver' | 'gold' | 'platinum' | 'diamond';
  createdAt: string;
  updatedAt: string;
}

export interface PayloadHeroBlock {
  blockType: 'hero';
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  bgImage?: string;
  badgeText?: string;
}

export interface PayloadFeaturesBlock {
  blockType: 'features';
  title?: string;
  subtitle?: string;
  items: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface PayloadBannerBlock {
  blockType: 'banner';
  title: string;
  subtitle: string;
  code?: string;
  linkUrl: string;
  accentColor?: string;
}

export interface PayloadCallToActionBlock {
  blockType: 'cta';
  title: string;
  description: string;
  primaryBtn: { text: string; link: string };
  secondaryBtn?: { text: string; link: string };
}

export interface PayloadProductCarouselBlock {
  blockType: 'productCarousel';
  title: string;
  subtitle?: string;
  categorySlug?: string;
  filter?: 'featured' | 'sale' | 'newest';
  limit?: number;
}

export interface PayloadTestimonialsBlock {
  blockType: 'testimonials';
  title: string;
  items: Array<{
    author: string;
    role: string;
    quote: string;
    rating: number;
    avatar?: string;
  }>;
}

export interface PayloadCalloutBlock {
  blockType: 'callout';
  title?: string;
  message: string;
  theme?: 'info' | 'warning' | 'success' | 'danger';
}

export interface PayloadFAQBlock {
  blockType: 'faq';
  title?: string;
  subtitle?: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface PayloadRichTextBlock {
  blockType: 'richText';
  content: LexicalRoot | string;
}

export type PayloadPageBlock =
  | PayloadHeroBlock
  | PayloadFeaturesBlock
  | PayloadBannerBlock
  | PayloadCallToActionBlock
  | PayloadProductCarouselBlock
  | PayloadTestimonialsBlock
  | PayloadCalloutBlock
  | PayloadFAQBlock
  | PayloadRichTextBlock;

// --- LEXICAL RICH TEXT AST TYPES ---
export interface LexicalNode {
  type: string;
  version?: number;
  text?: string;
  children?: LexicalNode[];
  tag?: string;
  format?: number | string;
  style?: string;
  direction?: string | null;
  indent?: number;
  url?: string;
  rel?: string;
  target?: string;
  [key: string]: any;
}

export interface LexicalRoot {
  root: {
    children: LexicalNode[];
    direction: string | null;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

// --- PAYLOAD 3.88 RBAC & ACCESS CONTROL ---
export type PayloadRole = 'admin' | 'editor' | 'customer' | 'guest';

export interface PayloadAccessRule {
  collection: string;
  operation: 'read' | 'create' | 'update' | 'delete' | 'admin';
  allowedRoles: PayloadRole[];
  conditionDescription?: string;
}

export interface PayloadAccessEvaluation {
  allowed: boolean;
  collection: string;
  operation: 'read' | 'create' | 'update' | 'delete';
  role: PayloadRole;
  userEmail?: string;
  reason: string;
  timestamp: string;
}

// --- PAYLOAD 3.88 LIFECYCLE HOOKS AUDIT TRAIL ---
export type PayloadHookStage = 
  | 'beforeValidate'
  | 'beforeChange'
  | 'afterChange'
  | 'beforeRead'
  | 'afterRead'
  | 'beforeDelete'
  | 'afterDelete'
  | 'beforeOperation'
  | 'afterOperation';

export interface PayloadHookExecutionLog {
  id: string;
  collection: string;
  hookName: PayloadHookStage;
  documentId?: string;
  operation: 'create' | 'read' | 'update' | 'delete';
  durationMs: number;
  status: 'success' | 'warn' | 'error';
  summary: string;
  details?: Record<string, any>;
  timestamp: string;
}

// --- PAYLOAD 3.88 DRAFTS & VERSIONS ---
export interface PayloadVersionDoc<T = any> {
  id: string;
  parent: string;
  version: T;
  autosave: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  author?: {
    email: string;
    name?: string;
  };
}

// --- PAYLOAD 3.88 SECURITY & WEBHOOKS ---
export interface PayloadApiKeyDoc {
  id: string;
  name: string;
  keyPrefix: string;
  role: PayloadRole;
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
  isActive: boolean;
}

export interface PayloadWebhookEvent {
  id: string;
  provider: 'stripe' | 'fedex' | 'resend' | 'custom';
  event: string;
  payload: Record<string, any>;
  verified: boolean;
  signature?: string;
  status: 'processed' | 'failed' | 'ignored';
  processedAt: string;
  responseSummary: string;
}

export interface PayloadSecurityStatus {
  rateLimitingEnabled: boolean;
  csrfProtectionEnabled: boolean;
  apiKeyAuthEnabled: boolean;
  jwtSessionActive: boolean;
  corsOriginPolicy: string;
  activeApiKeysCount: number;
  totalWebhooksProcessed: number;
  lastAuditTimestamp: string;
}

export interface PayloadPageDoc {
  id: string;
  slug: string;
  title: string;
  layout: PayloadPageBlock[];
  meta?: {
    title?: string;
    description?: string;
  };
  publishedAt?: string;
}

export interface PayloadMediaSize {
  url: string;
  width: number;
  height: number;
  mimeType: string;
  filesize: number;
  filename: string;
}

export interface PayloadMediaDoc {
  id: string;
  alt: string;
  caption?: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX?: number;
  focalY?: number;
  sizes: {
    thumbnail?: PayloadMediaSize;
    card?: PayloadMediaSize;
    tablet?: PayloadMediaSize;
    full?: PayloadMediaSize;
  };
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadWhereOperator {
  equals?: any;
  not_equals?: any;
  greater_than?: any;
  greater_than_equal?: any;
  less_than?: any;
  less_than_equal?: any;
  like?: string;
  contains?: string;
  in?: any[];
  not_in?: any[];
  exists?: boolean;
}

export type PayloadWhereQuery = {
  [field: string]: PayloadWhereOperator | PayloadWhereQuery[] | any;
  and?: PayloadWhereQuery[];
  or?: PayloadWhereQuery[];
};

export interface PayloadBulkOperationResult {
  success: boolean;
  totalCount?: number;
  modifiedCount?: number;
  affectedCount: number;
  affectedIds?: string[];
  errors?: Array<string | { id: string; error: string }>;
  message?: string;
}

export interface PayloadGlobalSettings {
  storeName: string;
  storeTagline: string;
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingRate: number;
    expressShippingRate: number;
  };
  taxRatePercent: number;
  announcementBar: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
    highlightText?: string;
  };
  features: {
    enableCoupons: boolean;
    enableReviews: boolean;
    enableLiveStock: boolean;
    enableWishlists: boolean;
    enableFastCheckout: boolean;
  };
}

export interface PayloadPaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PayloadFacetsResponse {
  totalProducts: number;
  categories: Array<{ id: string | number; title: string; slug: string; count: number }>;
  brands: Array<{ id: string | number; title: string; count: number }>;
  priceRange: { min: number; max: number };
  inStockCount: number;
  saleCount: number;
}

// --- FORM BUILDER PLUGIN TYPES (PAYLOAD 3.88) ---
export interface PayloadFormField {
  name: string;
  label: string;
  blockType: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'checkbox' | 'country';
  required?: boolean;
  defaultValue?: string | number | boolean;
  placeholder?: string;
  width?: number; // percentage (50, 100)
  options?: Array<{ label: string; value: string }>;
}

export interface PayloadFormDoc {
  id: string;
  title: string;
  slug: string;
  fields: PayloadFormField[];
  submitButtonLabel: string;
  confirmationType: 'message' | 'redirect';
  confirmationMessage?: string;
  redirectUrl?: string;
  emails?: Array<{
    emailTo: string;
    subject: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadFormSubmissionDoc {
  id: string;
  formId: string;
  formTitle: string;
  submissionData: Record<string, any>;
  submittedAt: string;
  ipAddress?: string;
  status: 'new' | 'reviewed' | 'archived';
}

// --- REDIRECTS PLUGIN TYPES (PAYLOAD 3.88) ---
export interface PayloadRedirectDoc {
  id: string;
  from: string;
  to: {
    type: 'custom' | 'reference';
    url?: string;
    reference?: {
      relationTo: 'products' | 'categories' | 'pages';
      value: string;
    };
  };
  statusCode: 301 | 302;
  createdAt: string;
  updatedAt: string;
}

// --- SEO SETTINGS & PLUGIN TYPES (PAYLOAD 3.88) ---
export interface PayloadSEOSettings {
  metaTitleTemplate: string;
  defaultMetaDescription: string;
  ogImageDefault?: string;
  twitterHandle?: string;
  twitterCardType: 'summary' | 'summary_large_image';
  enableStructuredData: boolean;
  canonicalBaseUrl: string;
}
