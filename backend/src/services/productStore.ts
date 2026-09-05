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
}

export interface ProductCategory {
  id: number;
  name: string;
  imageUrl: string;
  icon?: string;
  description?: string;
  itemCount?: number;
}

const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 1, name: 'Acoustic Instruments', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600', icon: 'Music', description: 'Handcrafted guitars & vintage violins', itemCount: 18 },
  { id: 2, name: 'Studio Audio & Electronics', imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600', icon: 'Headphones', description: 'High-fidelity audio & studio gear', itemCount: 24 },
  { id: 3, name: 'Luxury Timepieces', imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600', icon: 'Watch', description: 'Precision surgical steel & gold watches', itemCount: 12 },
  { id: 4, name: 'Haute Apparel & Suits', imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600', icon: 'Shirt', description: 'Italian silk suiting & evening wear', itemCount: 16 },
  { id: 5, name: 'Design Furniture', imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600', icon: 'Armchair', description: 'Ergonomic oak lounge chairs & chandeliers', itemCount: 15 }
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Premium Wireless Noise-Canceling Headphones',
    price: '$199.00',
    numericPrice: 199.00,
    originalPrice: '$249.00',
    isSale: true,
    saleBadgeText: '20% OFF',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600'
    ],
    stock: 45,
    url: '/product/premium-wireless-headphones',
    brand: 'Nova Acoustic',
    categoryId: 2,
    categoryName: 'Studio Audio & Electronics',
    tags: ['Audio', 'Wireless', 'Noise Cancelling', 'Bluetooth 5.3', 'Studio Gear'],
    description: 'High-fidelity acoustic drivers, active noise cancellation, and lightweight plush ergonomic memory foam cushions.',
    rating: 4.9,
    reviewsCount: 128,
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Luxury 18K Gold Chronograph Watch',
    price: '$450.00',
    numericPrice: 450.00,
    originalPrice: '$550.00',
    isSale: true,
    saleBadgeText: 'SALE',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600',
    stock: 14,
    url: '/product/luxury-18k-gold-chronograph-watch',
    brand: 'Vance & Co.',
    categoryId: 3,
    categoryName: 'Luxury Timepieces',
    tags: ['Watches', 'Minimalist', 'Italian Leather', 'Luxury', 'Surgical Steel'],
    description: 'Ultra-thin surgical stainless steel case with genuine Italian leather strap and scratch-resistant sapphire crystal.',
    rating: 4.8,
    reviewsCount: 94,
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'Haute Couture Silk Evening Gown',
    price: '$1,200.00',
    numericPrice: 1200.00,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600',
    stock: 8,
    url: '/product/silk-evening-gown',
    brand: 'Laurent Atelier',
    categoryId: 4,
    categoryName: 'Haute Apparel & Suits',
    tags: ['Apparel', 'Haute Couture', 'Silk', 'Luxury', 'Evening Wear'],
    description: 'Bespoke hand-tailored emerald silk evening gown crafted in Paris.',
    rating: 5.0,
    reviewsCount: 42,
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'Italian Silk Business Suit',
    price: '$850.00',
    numericPrice: 850.00,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600',
    stock: 22,
    url: '/product/italian-silk-suit',
    brand: 'Vance & Co.',
    categoryId: 4,
    categoryName: 'Haute Apparel & Suits',
    tags: ['Suits', 'Italian Silk', 'Formal', 'Business'],
    description: 'Midnight navy 100% fine Italian wool-silk blend suit with horn buttons.',
    rating: 4.9,
    reviewsCount: 88,
    inStock: true
  },
  {
    id: 'prod-5',
    name: 'Nordic Solid Oak Lounge Chair',
    price: '$450.00',
    numericPrice: 450.00,
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600',
    stock: 19,
    url: '/product/nordic-solid-oak-lounge-chair',
    brand: 'Minimalist Home',
    categoryId: 5,
    categoryName: 'Design Furniture',
    tags: ['Furniture', 'Nordic', 'Solid Oak', 'Lounge Chair'],
    description: 'Ergonomic solid oak lounge chair with high-density wool upholstery.',
    rating: 4.7,
    reviewsCount: 35,
    inStock: true
  },
  {
    id: 'prod-6',
    name: 'Handcrafted Acoustic Dreadnought Guitar',
    price: '$1,350.00',
    numericPrice: 1350.00,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600',
    stock: 6,
    url: '/product/handcrafted-dreadnought-guitar',
    brand: 'Nova Acoustic',
    categoryId: 1,
    categoryName: 'Acoustic Instruments',
    tags: ['Instruments', 'Guitar', 'Acoustic', 'Handmade'],
    description: 'Solid Sitka spruce top with solid East Indian rosewood back and sides for rich resonant acoustic resonance.',
    rating: 5.0,
    reviewsCount: 67,
    inStock: true
  }
];

const productsDb = new Map<string, ProductItem>(INITIAL_PRODUCTS.map(p => [p.id, p]));
const categoriesDb = new Map<number, ProductCategory>(INITIAL_CATEGORIES.map(c => [c.id, c]));

export function getProducts(query?: {
  categoryId?: number;
  search?: string;
  brand?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}) {
  let list = Array.from(productsDb.values());

  if (query) {
    if (query.categoryId) {
      list = list.filter(p => p.categoryId === Number(query.categoryId));
    }
    if (query.brand) {
      list = list.filter(p => p.brand?.toLowerCase() === query.brand?.toLowerCase());
    }
    if (query.isFeatured !== undefined) {
      list = list.filter(p => p.isFeatured === query.isFeatured);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.brand?.toLowerCase().includes(s) ||
        p.tags?.some(t => t.toLowerCase().includes(s))
      );
    }
    if (query.minPrice !== undefined) {
      list = list.filter(p => (p.numericPrice || 0) >= query.minPrice!);
    }
    if (query.maxPrice !== undefined) {
      list = list.filter(p => (p.numericPrice || 0) <= query.maxPrice!);
    }
    if (query.sortBy) {
      if (query.sortBy === 'price_asc') {
        list.sort((a, b) => (a.numericPrice || 0) - (b.numericPrice || 0));
      } else if (query.sortBy === 'price_desc') {
        list.sort((a, b) => (b.numericPrice || 0) - (a.numericPrice || 0));
      } else if (query.sortBy === 'rating') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    }
  }

  return list;
}

export function getProductById(id: string): ProductItem | null {
  return productsDb.get(id) || null;
}

export function saveProduct(productData: Partial<ProductItem>): ProductItem {
  const id = productData.id || `prod-${Date.now().toString().slice(-6)}`;
  const numericPrice = typeof productData.price === 'number' 
    ? productData.price 
    : parseFloat(String(productData.price || '0').replace(/[^0-9.]/g, '')) || 0;

  const formattedPrice = `$${numericPrice.toFixed(2)}`;

  const existing = productsDb.get(id);
  const updatedProduct: ProductItem = {
    id,
    name: productData.name || existing?.name || 'Untitled Luxury Item',
    price: formattedPrice,
    numericPrice: numericPrice,
    originalPrice: productData.originalPrice || existing?.originalPrice,
    isSale: productData.isSale ?? existing?.isSale ?? false,
    saleBadgeText: productData.saleBadgeText || existing?.saleBadgeText,
    isFeatured: productData.isFeatured ?? existing?.isFeatured ?? false,
    imageUrl: productData.imageUrl || existing?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
    images: productData.images || existing?.images || [productData.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600'],
    stock: productData.stock ?? existing?.stock ?? 10,
    url: productData.url || `/product/${id}`,
    description: productData.description || existing?.description || 'Exclusive luxury item from our signature catalog collection.',
    brand: productData.brand || existing?.brand || 'LuxeStore Signature',
    categoryId: productData.categoryId || existing?.categoryId || 2,
    categoryName: productData.categoryName || existing?.categoryName || 'Studio Audio & Electronics',
    tags: productData.tags || existing?.tags || ['Luxury', 'Featured'],
    rating: productData.rating || existing?.rating || 4.9,
    reviewsCount: productData.reviewsCount || existing?.reviewsCount || 12,
    inStock: (productData.stock ?? existing?.stock ?? 10) > 0
  };

  productsDb.set(id, updatedProduct);
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  return productsDb.delete(id);
}

export function getCategories(): ProductCategory[] {
  return Array.from(categoriesDb.values());
}
