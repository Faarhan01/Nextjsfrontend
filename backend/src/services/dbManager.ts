import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_BRANDS,
  MockCategoryPreset
} from '../../../frontend/src/data/presets.ts';
import type { MockProduct } from '../../../frontend/src/types/index.ts';

const __dirname_cwd = typeof __dirname !== "undefined" ? __dirname : path.dirname(__filename ? __filename : ".");
// Root directory of the project
const PROJECT_ROOT = path.resolve(__dirname_cwd, '../../../');
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const DB_FILE_PATH = path.join(DATA_DIR, 'db.json');

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  numericPrice?: number;
  originalPrice?: string;
  isSale?: boolean;
  saleBadgeText?: string;
  isFeatured?: boolean;
  imageUrl: string;
  images?: string[];
  stock?: number;
  url?: string;
  description?: string;
  brand?: string;
  brandId?: number;
  categoryId?: number;
  categoryName?: string;
  subcategoryId?: number;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  primarySellerId?: string;
  primarySellerName?: string;
  offers?: any[];
  bulkPricing?: any[];
  specifications?: Record<string, string>;
}

export interface ProductCategory {
  id: number;
  name: string;
  imageUrl: string;
  icon?: string;
  description?: string;
  itemCount?: number;
  subcategories?: Array<{ id: number; name: string; description?: string }>;
}

export interface OrderRecord {
  id: string;
  userId?: string;
  email: string;
  status: 'Processing' | 'Shipped' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  orderDate: string;
  estimatedDelivery: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
    sellerId?: string;
    sellerName?: string;
    selectedOfferId?: string;
    condition?: string;
  }>;
  timeline: Array<{
    title: string;
    description: string;
    date: string;
    location?: string;
    completed: boolean;
    current?: boolean;
  }>;
}

export interface UserAccount {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer' | 'seller' | 'vip';
    avatarUrl?: string;
    status?: string;
    totalOrders?: number;
    totalSpent?: number;
    joinedDate?: string;
    lastActive?: string;
    sellerId?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country?: string;
    };
  };
  passwordHash: string;
}

export interface AppDatabase {
  _version: string;
  lastSyncedAt: string;
  syncInstructions: string;
  categories: ProductCategory[];
  products: ProductItem[];
  brands: any[];
  orders: OrderRecord[];
  users: UserAccount[];
}

function mockToProductItem(m: MockProduct): ProductItem {
  const numPrice = typeof m.price === 'number'
    ? m.price
    : parseFloat(String(m.price || '0').replace(/[^0-9.]/g, '')) || 0;
  const priceStr = typeof m.price === 'number' ? `R${Number(m.price).toFixed(2)}` : (m.price || 'R0.00');
  return {
    id: m.id,
    name: m.name,
    price: priceStr,
    numericPrice: numPrice,
    originalPrice: m.originalPrice,
    isSale: m.isSale ?? false,
    saleBadgeText: m.saleBadgeText,
    isFeatured: m.isFeatured ?? false,
    imageUrl: m.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
    images: m.images && m.images.length > 0 ? m.images : [m.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600'],
    stock: m.stock ?? 25,
    url: m.url || `/product/${m.id}`,
    description: m.description || 'Premium quality marketplace product from verified suppliers.',
    brand: m.brand || 'Mrbulk Marketplace',
    brandId: m.brandId,
    categoryId: m.categoryId,
    categoryName: m.category,
    subcategoryId: m.subcategoryId,
    tags: m.tags || ['Marketplace', 'Featured'],
    rating: m.rating ?? 4.8,
    reviewsCount: m.reviewsCount ?? 16,
    inStock: (m.stock ?? 25) > 0,
    primarySellerId: m.primarySellerId,
    primarySellerName: m.primarySellerName,
    offers: m.offers || [],
    bulkPricing: m.bulkPricing || [],
    specifications: m.specifications || {}
  };
}

const DEFAULT_ORDERS: OrderRecord[] = [
  {
    id: 'MB-9901',
    userId: 'usr-admin-01',
    email: 'admin@mrbulk.co.za',
    status: 'Delivered',
    carrier: 'The Courier Guy Priority Express',
    trackingNumber: 'TCG-990188231',
    trackingUrl: 'https://portal.thecourierguy.co.za/track',
    orderDate: 'July 24, 2026',
    estimatedDelivery: 'July 26, 2026 (Delivered)',
    shippingAddress: {
      name: 'Alexander Sterling',
      street: '150 Industrial Rd, Crown North',
      city: 'Johannesburg',
      state: 'Gauteng',
      zip: '2092',
      country: 'South Africa'
    },
    paymentMethod: 'Instant EFT / PayFast',
    subtotal: 2849.00,
    shippingFee: 0.00,
    tax: 427.35,
    total: 3276.35,
    items: [
      {
        id: 'prod-1',
        name: 'Premium Wireless Headphones',
        price: 1899.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400',
        variant: 'Default'
      },
      {
        id: 'prod-8',
        name: 'High-Impact Drill Driver Kit',
        price: 950.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400',
        variant: 'Default'
      }
    ],
    timeline: [
      { title: 'Order Placed', description: 'Payment verified via PayFast.', date: 'July 24, 2026 â€” 08:00 AM', location: 'Mrbulk Online Store', completed: true },
      { title: 'Packed', description: 'Inspected and packaged in Crown North warehouse.', date: 'July 24, 2026 â€” 01:00 PM', location: 'Crown North Hub â€” Johannesburg', completed: true },
      { title: 'In Transit', description: 'Handed to The Courier Guy driver.', date: 'July 25, 2026 â€” 09:30 AM', location: 'The Courier Guy JHB Depot', completed: true },
      { title: 'Out for Delivery', description: 'Courier out on local delivery route.', date: 'July 26, 2026 â€” 08:15 AM', location: 'Central JHB Delivery Van', completed: true },
      { title: 'Delivered', description: 'Signed and delivered at warehouse gate.', date: 'July 26, 2026 â€” 11:20 AM', location: 'Crown North, Johannesburg', completed: true, current: true }
    ]
  },
  {
    id: 'MB-9402',
    userId: 'usr-cust-01',
    email: 'customer@mrbulk.co.za',
    status: 'Delivered',
    carrier: 'The Courier Guy Standard Delivery',
    trackingNumber: 'TCG-8839201923',
    trackingUrl: 'https://portal.thecourierguy.co.za/track',
    orderDate: 'July 20, 2026',
    estimatedDelivery: 'July 23, 2026 (Delivered)',
    shippingAddress: {
      name: 'Thabo Mokoena',
      street: '45 Oxford Road, Rosebank',
      city: 'Johannesburg',
      state: 'Gauteng',
      zip: '2196',
      country: 'South Africa'
    },
    paymentMethod: 'Credit Card / Visa',
    subtotal: 1899.00,
    shippingFee: 99.00,
    tax: 284.85,
    total: 2282.85,
    items: [
      {
        id: 'prod-1',
        name: 'Premium Wireless Headphones',
        price: 1899.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400',
        variant: 'Space Black'
      }
    ],
    timeline: [
      { title: 'Order Placed', description: 'Payment authorized and order confirmed.', date: 'July 20, 2026 â€” 09:30 AM', location: 'Mrbulk Store System', completed: true },
      { title: 'Order Processed & Packed', description: 'Items verified and packaged.', date: 'July 20, 2026 â€” 02:15 PM', location: 'Distribution Hub â€” Crown North, JHB', completed: true },
      { title: 'In Transit via The Courier Guy', description: 'Package sorted at main hub.', date: 'July 21, 2026 â€” 08:45 AM', location: 'The Courier Guy Gauteng Hub', completed: true },
      { title: 'Out for Delivery', description: 'Courier loaded package onto delivery van.', date: 'July 23, 2026 â€” 07:10 AM', location: 'Rosebank Distribution Route', completed: true },
      { title: 'Delivered', description: 'Package handed to recipient at reception.', date: 'July 23, 2026 â€” 11:42 AM', location: 'Rosebank, Johannesburg', completed: true, current: true }
    ]
  }
];

const DEFAULT_USERS: UserAccount[] = [
  {
    user: {
      id: 'usr-admin-01',
      name: 'Alexander Sterling',
      email: 'admin@mrbulk.co.za',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      status: 'active',
      totalOrders: 28,
      totalSpent: 45200.00,
      joinedDate: 'Jan 2024',
      lastActive: 'Active Now',
      phone: '+27 11 837 2000',
      address: {
        street: '150 Industrial Rd, Crown North',
        city: 'Johannesburg',
        state: 'Gauteng',
        zip: '2092',
        country: 'South Africa'
      }
    },
    passwordHash: 'admin123'
  },
  {
    user: {
      id: 'usr-seller-01',
      name: 'Liam Botha (Nova Store)',
      email: 'liam@novaofficial.co.za',
      role: 'seller',
      sellerId: '849201',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      status: 'active',
      totalOrders: 84,
      totalSpent: 148500.00,
      joinedDate: 'Jan 2025',
      lastActive: 'Just now',
      phone: '+27 82 459 1029',
      address: {
        street: '22 Long Street',
        city: 'Cape Town',
        state: 'Western Cape',
        zip: '8001',
        country: 'South Africa'
      }
    },
    passwordHash: 'seller123'
  },
  {
    user: {
      id: 'usr-cust-01',
      name: 'Thabo Mokoena',
      email: 'customer@mrbulk.co.za',
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      status: 'active',
      totalOrders: 8,
      totalSpent: 12450.00,
      joinedDate: 'Feb 2025',
      lastActive: 'Just now',
      phone: '+27 71 884 9210',
      address: {
        street: '45 Oxford Road, Rosebank',
        city: 'Johannesburg',
        state: 'Gauteng',
        zip: '2196',
        country: 'South Africa'
      }
    },
    passwordHash: 'customer123'
  }
];

class DatabaseManager {
  private db: AppDatabase;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.db = this.initDatabase();
  }

  private buildDefaultDatabase(): AppDatabase {
    const categories: ProductCategory[] = MOCK_CATEGORIES.map(c => ({
      id: c.id,
      name: c.name,
      imageUrl: c.imageUrl,
      icon: c.icon,
      description: c.description || `Browse quality ${c.name.toLowerCase()} products in bulk and save.`,
      itemCount: c.itemCount || 20,
      subcategories: c.subcategories || []
    }));

    const products: ProductItem[] = MOCK_PRODUCTS.map(mockToProductItem);

    return {
      _version: '1.0.0',
      lastSyncedAt: new Date().toISOString(),
      syncInstructions: 'Committed to git repository. Syncs across Google AI Studio and local GitHub clones automatically.',
      categories,
      products,
      brands: MOCK_BRANDS,
      orders: DEFAULT_ORDERS,
      users: DEFAULT_USERS
    };
  }

  private initDatabase(): AppDatabase {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<AppDatabase>;
        if (parsed && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
          // Fill any missing collections
          const fallback = this.buildDefaultDatabase();
          return {
            _version: parsed._version || fallback._version,
            lastSyncedAt: parsed.lastSyncedAt || fallback.lastSyncedAt,
            syncInstructions: parsed.syncInstructions || fallback.syncInstructions,
            categories: parsed.categories.length > 0 ? parsed.categories : fallback.categories,
            products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : fallback.products,
            brands: Array.isArray(parsed.brands) && parsed.brands.length > 0 ? parsed.brands : fallback.brands,
            orders: Array.isArray(parsed.orders) && parsed.orders.length > 0 ? parsed.orders : fallback.orders,
            users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : fallback.users
          };
        }
      }
    } catch (e) {
      console.warn('[DatabaseManager] Error reading existing db.json, generating default database:', e);
    }

    // Default bootstrap
    const defaultDb = this.buildDefaultDatabase();
    this.persistToDiskSync(defaultDb);
    return defaultDb;
  }

  public persistToDiskSync(database: AppDatabase = this.db): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      database.lastSyncedAt = new Date().toISOString();
      const content = JSON.stringify(database, null, 2);
      fs.writeFileSync(DB_FILE_PATH, content, 'utf-8');
    } catch (err) {
      console.error('[DatabaseManager] Failed to write db.json:', err);
    }
  }

  public schedulePersist(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.persistToDiskSync();
      this.saveTimeout = null;
    }, 500);
  }

  public reloadFromDisk(): { success: boolean; message: string; data: AppDatabase } {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.categories)) {
          this.db = parsed;
          return { success: true, message: 'Database successfully reloaded from data/db.json', data: this.db };
        }
      }
      return { success: false, message: 'data/db.json not found or corrupted', data: this.db };
    } catch (e: any) {
      return { success: false, message: `Failed to reload: ${e?.message}`, data: this.db };
    }
  }

  public getDb(): AppDatabase {
    return this.db;
  }

  public getProducts(): ProductItem[] {
    return this.db.products;
  }

  public getProductById(id: string): ProductItem | null {
    return this.db.products.find(p => p.id === id) || null;
  }

  public saveProduct(product: Partial<ProductItem>): ProductItem {
    const id = product.id || `prod-${Date.now().toString().slice(-6)}`;
    const numericPrice = typeof product.price === 'number'
      ? product.price
      : parseFloat(String(product.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const formattedPrice = `R${numericPrice.toFixed(2)}`;

    const existingIndex = this.db.products.findIndex(p => p.id === id);
    const existing = existingIndex >= 0 ? this.db.products[existingIndex] : null;

    const item: ProductItem = {
      id,
      name: product.name || existing?.name || 'Untitled Marketplace Item',
      price: formattedPrice,
      numericPrice,
      originalPrice: product.originalPrice || existing?.originalPrice,
      isSale: product.isSale ?? existing?.isSale ?? false,
      saleBadgeText: product.saleBadgeText || existing?.saleBadgeText,
      isFeatured: product.isFeatured ?? existing?.isFeatured ?? false,
      imageUrl: product.imageUrl || existing?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
      images: product.images || existing?.images || [product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600'],
      stock: product.stock ?? existing?.stock ?? 10,
      url: product.url || `/product/${id}`,
      description: product.description || existing?.description || 'Quality product from Mrbulk marketplace catalog.',
      brand: product.brand || existing?.brand || 'Mrbulk Marketplace',
      brandId: product.brandId || existing?.brandId,
      categoryId: product.categoryId || existing?.categoryId || 2,
      categoryName: product.categoryName || existing?.categoryName || 'Electronics',
      tags: product.tags || existing?.tags || ['Marketplace', 'Featured'],
      rating: product.rating || existing?.rating || 4.8,
      reviewsCount: product.reviewsCount || existing?.reviewsCount || 12,
      inStock: (product.stock ?? existing?.stock ?? 10) > 0,
      offers: product.offers || existing?.offers || [],
      bulkPricing: product.bulkPricing || existing?.bulkPricing || [],
      specifications: product.specifications || existing?.specifications || {}
    };

    if (existingIndex >= 0) {
      this.db.products[existingIndex] = item;
    } else {
      this.db.products.push(item);
    }

    this.schedulePersist();
    return item;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.db.products.findIndex(p => p.id === id);
    if (idx >= 0) {
      this.db.products.splice(idx, 1);
      this.schedulePersist();
      return true;
    }
    return false;
  }

  public getCategories(): ProductCategory[] {
    return this.db.categories;
  }

  public saveCategories(cats: ProductCategory[]): void {
    this.db.categories = cats;
    this.schedulePersist();
  }

  public getBrands(): any[] {
    return this.db.brands;
  }

  public getOrders(): OrderRecord[] {
    return this.db.orders;
  }

  public getOrderById(id: string): OrderRecord | null {
    const clean = id.trim().toUpperCase();
    return this.db.orders.find(o => o.id.toUpperCase() === clean) || null;
  }

  public saveOrder(order: OrderRecord): OrderRecord {
    const existingIndex = this.db.orders.findIndex(o => o.id === order.id);
    if (existingIndex >= 0) {
      this.db.orders[existingIndex] = order;
    } else {
      this.db.orders.unshift(order);
    }
    this.schedulePersist();
    return order;
  }

  public getUsers(): UserAccount[] {
    return this.db.users;
  }

  public saveUser(account: UserAccount): UserAccount {
    const existingIndex = this.db.users.findIndex(u => u.user.email.toLowerCase() === account.user.email.toLowerCase());
    if (existingIndex >= 0) {
      this.db.users[existingIndex] = account;
    } else {
      this.db.users.push(account);
    }
    this.schedulePersist();
    return account;
  }

  public importDatabase(data: Partial<AppDatabase>): { success: boolean; message: string; data?: AppDatabase } {
    try {
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid database payload provided.' };
      }
      if (!Array.isArray(data.categories) && !Array.isArray(data.products)) {
        return { success: false, message: 'Payload must contain products or categories array.' };
      }

      const fallback = this.buildDefaultDatabase();
      const newDb: AppDatabase = {
        _version: data._version || this.db._version || '1.0.0',
        lastSyncedAt: new Date().toISOString(),
        syncInstructions: data.syncInstructions || this.db.syncInstructions || fallback.syncInstructions,
        categories: Array.isArray(data.categories) && data.categories.length > 0 ? (data.categories as ProductCategory[]) : this.db.categories,
        products: Array.isArray(data.products) && data.products.length > 0 ? (data.products as ProductItem[]) : this.db.products,
        brands: Array.isArray(data.brands) && data.brands.length > 0 ? data.brands : this.db.brands,
        orders: Array.isArray(data.orders) && data.orders.length > 0 ? (data.orders as OrderRecord[]) : this.db.orders,
        users: Array.isArray(data.users) && data.users.length > 0 ? (data.users as UserAccount[]) : this.db.users,
      };

      this.db = newDb;
      this.persistToDiskSync(this.db);
      return { success: true, message: 'Database imported and saved to data/db.json successfully.', data: this.db };
    } catch (e: any) {
      return { success: false, message: `Import failed: ${e?.message}` };
    }
  }

  public getSyncStatus() {
    return {
      synced: true,
      filePath: 'data/db.json',
      absolutePath: DB_FILE_PATH,
      lastSyncedAt: this.db.lastSyncedAt,
      version: this.db._version,
      entityCounts: {
        products: this.db.products.length,
        categories: this.db.categories.length,
        brands: this.db.brands.length,
        orders: this.db.orders.length,
        users: this.db.users.length
      },
      gitInfo: {
        trackedFile: 'data/db.json',
        instructions: 'Push your repository to GitHub to sync to other PCs. On your other PC, pull from GitHub, and data/db.json will contain all your synchronized data.'
      }
    };
  }
}

export const dbManager = new DatabaseManager();

