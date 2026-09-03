import {
  PayloadProductDoc,
  PayloadCategoryDoc,
  PayloadOrderDoc,
  PayloadCouponDoc,
  PayloadReviewDoc,
  PayloadCustomerDoc,
  PayloadPageDoc,
  PayloadGlobalSettings,
  PayloadPaginatedResponse,
  PayloadFacetsResponse,
  PayloadAddress,
  PayloadAccessRule,
  PayloadAccessEvaluation,
  PayloadRole,
  PayloadHookExecutionLog,
  PayloadHookStage,
  PayloadVersionDoc,
  PayloadApiKeyDoc,
  PayloadWebhookEvent,
  PayloadSecurityStatus,
  PayloadMediaDoc,
  PayloadMediaSize,
  PayloadWhereQuery,
  PayloadBulkOperationResult,
  PayloadFormDoc,
  PayloadFormSubmissionDoc,
  PayloadRedirectDoc,
  PayloadSEOSettings
} from './types.js';

// Initial Media Assets aligned with Payload 3.88 media collection schema
export const INITIAL_PAYLOAD_MEDIA: PayloadMediaDoc[] = [
  {
    id: 'media-1',
    alt: 'Wireless Noise Canceling Headphones Obsidian Black',
    caption: 'Studio product photography on velvet backdrop',
    filename: 'headphones-obsidian-black.webp',
    mimeType: 'image/webp',
    filesize: 348200,
    width: 1920,
    height: 1280,
    focalX: 0.5,
    focalY: 0.5,
    url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300',
    sizes: {
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300',
        width: 300,
        height: 200,
        mimeType: 'image/webp',
        filesize: 35000,
        filename: 'headphones-obsidian-black-300x200.webp'
      },
      card: {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600',
        width: 600,
        height: 400,
        mimeType: 'image/webp',
        filesize: 95000,
        filename: 'headphones-obsidian-black-600x400.webp'
      },
      tablet: {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1024',
        width: 1024,
        height: 682,
        mimeType: 'image/webp',
        filesize: 180000,
        filename: 'headphones-obsidian-black-1024x682.webp'
      },
      full: {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1920',
        width: 1920,
        height: 1280,
        mimeType: 'image/webp',
        filesize: 348200,
        filename: 'headphones-obsidian-black.webp'
      }
    },
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-08-20T12:00:00.000Z'
  },
  {
    id: 'media-2',
    alt: 'Luxury 18K Gold Chronograph Watch Detail',
    caption: 'Macro dial photograph highlighting sapphire crystal',
    filename: 'gold-chronograph-watch.webp',
    mimeType: 'image/webp',
    filesize: 412000,
    width: 2000,
    height: 1333,
    focalX: 0.52,
    focalY: 0.48,
    url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=300',
    sizes: {
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=300',
        width: 300,
        height: 200,
        mimeType: 'image/webp',
        filesize: 42000,
        filename: 'gold-chronograph-watch-300x200.webp'
      },
      card: {
        url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600',
        width: 600,
        height: 400,
        mimeType: 'image/webp',
        filesize: 115000,
        filename: 'gold-chronograph-watch-600x400.webp'
      },
      tablet: {
        url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1024',
        width: 1024,
        height: 682,
        mimeType: 'image/webp',
        filesize: 210000,
        filename: 'gold-chronograph-watch-1024x682.webp'
      },
      full: {
        url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2000',
        width: 2000,
        height: 1333,
        mimeType: 'image/webp',
        filesize: 412000,
        filename: 'gold-chronograph-watch.webp'
      }
    },
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-08-22T14:30:00.000Z'
  },
  {
    id: 'media-3',
    alt: 'Haute Couture Mulberry Silk Gown Milan',
    caption: 'Atelier craftsmanship editorial portrait',
    filename: 'silk-evening-gown.webp',
    mimeType: 'image/webp',
    filesize: 295000,
    width: 1600,
    height: 2400,
    focalX: 0.5,
    focalY: 0.35,
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300',
    sizes: {
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300',
        width: 300,
        height: 450,
        mimeType: 'image/webp',
        filesize: 32000,
        filename: 'silk-evening-gown-300x450.webp'
      },
      card: {
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600',
        width: 600,
        height: 900,
        mimeType: 'image/webp',
        filesize: 88000,
        filename: 'silk-evening-gown-600x900.webp'
      },
      tablet: {
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1024',
        width: 1024,
        height: 1536,
        mimeType: 'image/webp',
        filesize: 175000,
        filename: 'silk-evening-gown-1024x1536.webp'
      },
      full: {
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600',
        width: 1600,
        height: 2400,
        mimeType: 'image/webp',
        filesize: 295000,
        filename: 'silk-evening-gown.webp'
      }
    },
    createdAt: '2026-03-01T11:00:00.000Z',
    updatedAt: '2026-08-21T09:15:00.000Z'
  }
];

// Initial Categories aligned with Payload 3.88 schema
export const INITIAL_PAYLOAD_CATEGORIES: PayloadCategoryDoc[] = [
  {
    id: 1,
    title: 'Acoustic Instruments',
    slug: 'acoustic-instruments',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600',
    icon: 'Music',
    description: 'Handcrafted guitars, violins, and precision acoustic instruments',
    featured: true,
    itemCount: 18,
    breadcrumbs: [{ id: 1, title: 'Acoustic Instruments', slug: 'acoustic-instruments' }]
  },
  {
    id: 2,
    title: 'Studio Audio & Electronics',
    slug: 'studio-audio-electronics',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600',
    icon: 'Headphones',
    description: 'High-fidelity headphones, studio monitors, DACs, and micro-electronics',
    featured: true,
    itemCount: 24,
    breadcrumbs: [{ id: 2, title: 'Studio Audio & Electronics', slug: 'studio-audio-electronics' }]
  },
  {
    id: 3,
    title: 'Luxury Timepieces',
    slug: 'luxury-timepieces',
    imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600',
    icon: 'Watch',
    description: 'Precision surgical steel, automatic chronographs & 18K gold watches',
    featured: true,
    itemCount: 12,
    breadcrumbs: [{ id: 3, title: 'Luxury Timepieces', slug: 'luxury-timepieces' }]
  },
  {
    id: 4,
    title: 'Haute Apparel & Suits',
    slug: 'haute-apparel-suits',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600',
    icon: 'Shirt',
    description: 'Italian silk suiting, bespoke evening gowns, and tailored outerwear',
    featured: true,
    itemCount: 16,
    breadcrumbs: [{ id: 4, title: 'Haute Apparel & Suits', slug: 'haute-apparel-suits' }]
  },
  {
    id: 5,
    title: 'Design Furniture',
    slug: 'design-furniture',
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600',
    icon: 'Armchair',
    description: 'Ergonomic oak lounge chairs, travertine tables & minimalist lighting',
    featured: true,
    itemCount: 15,
    breadcrumbs: [{ id: 5, title: 'Design Furniture', slug: 'design-furniture' }]
  }
];

// Initial Products aligned with Payload 3.88 schema
export const INITIAL_PAYLOAD_PRODUCTS: PayloadProductDoc[] = [
  {
    id: 'prod-1',
    slug: 'premium-wireless-noise-canceling-headphones',
    title: 'Premium Wireless Noise-Canceling Headphones',
    price: 199.00,
    compareAtPrice: 249.00,
    numericPrice: 199.00,
    isSale: true,
    saleBadgeText: '20% OFF',
    isFeatured: true,
    inventory: 45,
    lowStockThreshold: 10,
    allowBackorder: false,
    images: [
      { id: 'img-1a', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800', alt: 'Wireless Headphones front' },
      { id: 'img-1b', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800', alt: 'Wireless Headphones angled' }
    ],
    category: {
      id: 2,
      title: 'Studio Audio & Electronics',
      slug: 'studio-audio-electronics'
    },
    brand: {
      id: 1,
      title: 'Nova Acoustic',
      slug: 'nova-acoustic'
    },
    tags: ['Audio', 'Wireless', 'Noise Cancelling', 'Bluetooth 5.3', 'Studio Gear'],
    description: 'High-fidelity acoustic drivers, hybrid active noise cancellation, and memory foam earcups delivering up to 40 hours of lossless audio playback.',
    specs: [
      { name: 'Driver Size', value: '45mm Titanium Aperture' },
      { name: 'Battery Life', value: 'Up to 40 Hours (ANC on)' },
      { name: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm Aux' },
      { name: 'Weight', value: '254 grams' }
    ],
    variants: [
      { id: 'var-1a', sku: 'NOVA-H1-BLK', title: 'Matte Obsidian Black', price: 199.00, inventory: 25, options: { color: 'Obsidian Black' } },
      { id: 'var-1b', sku: 'NOVA-H1-SLV', title: 'Platinum Silver', price: 199.00, inventory: 20, options: { color: 'Platinum Silver' } }
    ],
    rating: 4.9,
    reviewsCount: 128,
    status: 'published',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-08-20T12:00:00.000Z'
  },
  {
    id: 'prod-2',
    slug: 'luxury-18k-gold-chronograph-watch',
    title: 'Luxury 18K Gold Chronograph Watch',
    price: 450.00,
    compareAtPrice: 550.00,
    numericPrice: 450.00,
    isSale: true,
    saleBadgeText: 'SALE',
    isFeatured: true,
    inventory: 14,
    lowStockThreshold: 5,
    allowBackorder: true,
    images: [
      { id: 'img-2a', url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800', alt: 'Gold Chronograph Watch' }
    ],
    category: {
      id: 3,
      title: 'Luxury Timepieces',
      slug: 'luxury-timepieces'
    },
    brand: {
      id: 2,
      title: 'Vance & Co.',
      slug: 'vance-co'
    },
    tags: ['Watches', 'Minimalist', 'Italian Leather', 'Luxury', 'Surgical Steel'],
    description: 'Ultra-thin 316L surgical stainless steel case plated with 18K yellow gold, scratch-resistant double-domed sapphire crystal, and genuine Italian calfskin strap.',
    specs: [
      { name: 'Case Diameter', value: '41mm' },
      { name: 'Movement', value: 'Swiss Ronda 5030.D Quartz' },
      { name: 'Water Resistance', value: '5 ATM / 50 Meters' },
      { name: 'Strap', value: 'Full-Grain Italian Leather' }
    ],
    rating: 4.8,
    reviewsCount: 94,
    status: 'published',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-08-22T14:30:00.000Z'
  },
  {
    id: 'prod-3',
    slug: 'haute-couture-silk-evening-gown',
    title: 'Haute Couture Silk Evening Gown',
    price: 320.00,
    numericPrice: 320.00,
    isSale: false,
    isFeatured: true,
    inventory: 8,
    lowStockThreshold: 10,
    allowBackorder: false,
    images: [
      { id: 'img-3a', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800', alt: 'Silk Evening Gown' }
    ],
    category: {
      id: 4,
      title: 'Haute Apparel & Suits',
      slug: 'haute-apparel-suits'
    },
    brand: {
      id: 3,
      title: 'Atelier Maison',
      slug: 'atelier-maison'
    },
    tags: ['Apparel', 'Silk', 'Evening', 'Haute Couture'],
    description: '100% Mulberry raw silk gown featuring hand-draped silhouette and delicate French lace trims.',
    specs: [
      { name: 'Material', value: '100% Mulberry Silk (22 Momme)' },
      { name: 'Care', value: 'Specialist Dry Clean Only' },
      { name: 'Origin', value: 'Handmade in Milan, Italy' }
    ],
    rating: 5.0,
    reviewsCount: 42,
    status: 'published',
    createdAt: '2026-03-01T11:00:00.000Z',
    updatedAt: '2026-08-21T09:15:00.000Z'
  },
  {
    id: 'prod-4',
    slug: 'scandinavian-solid-oak-lounge-chair',
    title: 'Scandinavian Solid Oak Lounge Chair',
    price: 280.00,
    compareAtPrice: 340.00,
    numericPrice: 280.00,
    isSale: true,
    saleBadgeText: 'SAVE $60',
    isFeatured: false,
    inventory: 19,
    lowStockThreshold: 5,
    allowBackorder: true,
    images: [
      { id: 'img-4a', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800', alt: 'Oak Lounge Chair' }
    ],
    category: {
      id: 5,
      title: 'Design Furniture',
      slug: 'design-furniture'
    },
    brand: {
      id: 4,
      title: 'Nordic Craft',
      slug: 'nordic-craft'
    },
    tags: ['Furniture', 'Nordic', 'Solid Oak', 'Interior'],
    description: 'Sculptural lounge chair crafted from sustainably harvested European white oak with natural organic oil finish.',
    specs: [
      { name: 'Dimensions', value: '78cm W x 82cm D x 74cm H' },
      { name: 'Timber', value: 'FSC-Certified White Oak' },
      { name: 'Upholstery', value: 'Kvadrat Wool Blend' }
    ],
    rating: 4.7,
    reviewsCount: 65,
    status: 'published',
    createdAt: '2026-03-15T15:00:00.000Z',
    updatedAt: '2026-08-19T17:00:00.000Z'
  },
  {
    id: 'prod-5',
    slug: 'handcrafted-concert-acoustic-guitar',
    title: 'Handcrafted Concert Acoustic Guitar',
    price: 590.00,
    numericPrice: 590.00,
    isSale: false,
    isFeatured: true,
    inventory: 6,
    lowStockThreshold: 4,
    allowBackorder: false,
    images: [
      { id: 'img-5a', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800', alt: 'Concert Acoustic Guitar' }
    ],
    category: {
      id: 1,
      title: 'Acoustic Instruments',
      slug: 'acoustic-instruments'
    },
    brand: {
      id: 5,
      title: 'Sonora Luthier',
      slug: 'sonora-luthier'
    },
    tags: ['Music', 'Acoustic', 'Handmade', 'Solid Wood', 'Luthier'],
    description: 'Master-grade solid Sitka spruce top with East Indian rosewood back and sides, bone nut and saddle, producing breathtaking acoustic projection.',
    specs: [
      { name: 'Top Wood', value: 'Solid AAA Sitka Spruce' },
      { name: 'Back & Sides', value: 'Solid East Indian Rosewood' },
      { name: 'Scale Length', value: '25.4 inches' },
      { name: 'Finish', value: 'Nitrocellulose High Gloss Lacquer' }
    ],
    rating: 4.9,
    reviewsCount: 51,
    status: 'published',
    createdAt: '2026-04-02T12:00:00.000Z',
    updatedAt: '2026-08-25T11:00:00.000Z'
  }
];

// Initial Coupons aligned with Payload 3.88 schema
export const INITIAL_PAYLOAD_COUPONS: PayloadCouponDoc[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    description: '10% off your entire first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderSubtotal: 50,
    validFrom: '2026-01-01T00:00:00.000Z',
    validUntil: '2027-01-01T00:00:00.000Z',
    usageLimit: 1000,
    usedCount: 142,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'LUXE50',
    description: '$50 instant savings on orders over $300',
    discountType: 'fixed',
    discountValue: 50,
    minOrderSubtotal: 300,
    validFrom: '2026-01-01T00:00:00.000Z',
    validUntil: '2027-01-01T00:00:00.000Z',
    usageLimit: 500,
    usedCount: 88,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'FREESHIP',
    description: 'Complimentary Express Air Delivery on any order',
    discountType: 'free_shipping',
    discountValue: 15,
    minOrderSubtotal: 0,
    validFrom: '2026-01-01T00:00:00.000Z',
    validUntil: '2027-01-01T00:00:00.000Z',
    usageLimit: 2000,
    usedCount: 319,
    isActive: true
  }
];

// Initial Reviews aligned with Payload 3.88 schema
export const INITIAL_PAYLOAD_REVIEWS: PayloadReviewDoc[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    rating: 5,
    title: 'Exquisite soundstage and build quality',
    comment: 'The active noise cancellation is whisper silent and the titanium drivers reproduce deep sub-bass without muddying the upper registers.',
    author: {
      name: 'Alexander Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
    },
    isVerifiedBuyer: true,
    status: 'published',
    likesCount: 14,
    createdAt: '2026-07-10T14:22:00.000Z',
    updatedAt: '2026-07-10T14:22:00.000Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    rating: 5,
    title: 'Flawless 40-hour battery life',
    comment: 'Took these on an international flight from NY to Tokyo. Extremely comfortable memory foam and flawless wireless stability.',
    author: {
      name: 'Sophia Laurent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
    },
    isVerifiedBuyer: true,
    status: 'published',
    likesCount: 9,
    createdAt: '2026-08-01T09:40:00.000Z',
    updatedAt: '2026-08-01T09:40:00.000Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    rating: 5,
    title: 'A true collector timepiece',
    comment: 'The 18K gold finishing and double-domed sapphire crystal catch the light wonderfully. Excellent weight and wrist presence.',
    author: {
      name: 'Julian Montgomery',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'
    },
    isVerifiedBuyer: true,
    status: 'published',
    likesCount: 22,
    createdAt: '2026-08-12T11:15:00.000Z',
    updatedAt: '2026-08-12T11:15:00.000Z'
  }
];

// Initial Payload Layout Blocks for dynamic home/page rendering
export const INITIAL_PAYLOAD_HOME_PAGE: PayloadPageDoc = {
  id: 'page-home',
  slug: 'home',
  title: 'LuxeStore Flagship Home',
  layout: [
    {
      blockType: 'hero',
      heading: 'Pure Craftsmanship & Precision Engineering',
      subheading: 'Explore our curated collection of artisanal acoustic instruments, studio acoustics, Swiss-movement timepieces, and haute apparel.',
      buttonText: 'Explore Collections',
      buttonLink: '/catalog',
      badgeText: 'Payload CMS 3.88 Architecture',
      bgImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200'
    },
    {
      blockType: 'features',
      title: 'The LuxeStore Standard',
      subtitle: 'Engineered with uncompromising precision and verified provenance',
      items: [
        { icon: 'truck', title: 'Complimentary Express Air', description: 'Insured worldwide courier delivery with live real-time milestone tracking on all orders.' },
        { icon: 'shield', title: 'Verified Authenticity', description: 'Every item is individually inspected and accompanied by an authenticated certificate.' },
        { icon: 'rotateccw', title: '30-Day White Glove Returns', description: 'Effortless prepaid returns with doorstep courier pickup and rapid full reimbursement.' },
        { icon: 'award', title: 'Lifetime Craft Warranty', description: 'Comprehensive coverage against all manufacturing irregularities and precision calibration.' }
      ]
    },
    {
      blockType: 'banner',
      title: 'Seasonal Collector Privilege',
      subtitle: 'Enjoy 10% off your inaugural order with code WELCOME10 or $50 off orders over $300 with LUXE50.',
      code: 'WELCOME10',
      linkUrl: '/catalog',
      accentColor: 'indigo'
    },
    {
      blockType: 'productCarousel',
      title: 'Featured Masterpieces',
      subtitle: 'Hand-selected by our master curators this week',
      filter: 'featured',
      limit: 4
    },
    {
      blockType: 'testimonials',
      title: 'Patron Accolades',
      items: [
        {
          author: 'Alexander Vance',
          role: 'Architect & Collector, New York',
          quote: 'The level of craftsmanship and rapid insured delivery surpassed every expectation. The headphones have transformed my studio sessions.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
        },
        {
          author: 'Elena Rostova',
          role: 'Creative Director, Zurich',
          quote: 'Seamless checkout experience and pristine packaging. Finding authentic pieces with full provenance is why I return.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200'
        }
      ]
    },
    {
      blockType: 'cta',
      title: 'Experience The Future of Luxury Commerce',
      description: 'Subscribe to our private salon for preview access to limited artisan drops and private exhibitions.',
      primaryBtn: { text: 'Join The Private Salon', link: '/catalog' },
      secondaryBtn: { text: 'Learn More', link: '/about' }
    }
  ]
};

// Initial Global Settings aligned with Payload 3.88 schema
let globalSettings: PayloadGlobalSettings = {
  storeName: 'LuxeStore Official',
  storeTagline: 'Curated Artisan Goods & Precision Electronics',
  currency: {
    code: 'USD',
    symbol: '$',
    position: 'before'
  },
  shipping: {
    freeShippingThreshold: 150.00,
    standardShippingRate: 9.99,
    expressShippingRate: 19.99
  },
  taxRatePercent: 8.0,
  announcementBar: {
    enabled: true,
    text: 'Complimentary FedEx Priority Shipping on all orders over $150',
    highlightText: 'Use code WELCOME10 for 10% off',
    linkUrl: '/catalog'
  },
  features: {
    enableCoupons: true,
    enableReviews: true,
    enableLiveStock: true,
    enableWishlists: true,
    enableFastCheckout: true
  }
};

// In-Memory Database instances simulating Payload CMS 3.88 Collections
const productsDb = new Map<string, PayloadProductDoc>();
const categoriesDb = new Map<string | number, PayloadCategoryDoc>();
const couponsDb = new Map<string, PayloadCouponDoc>();
const ordersDb = new Map<string, PayloadOrderDoc>();
const reviewsDb = new Map<string, PayloadReviewDoc>();
const pagesDb = new Map<string, PayloadPageDoc>();
const mediaDb = new Map<string, PayloadMediaDoc>();
const formsDb = new Map<string, PayloadFormDoc>();
const formSubmissionsDb = new Map<string, PayloadFormSubmissionDoc>();
const redirectsDb = new Map<string, PayloadRedirectDoc>();

let seoSettingsState: PayloadSEOSettings = {
  metaTitleTemplate: '%s | LUXE Atelier & Payload 3.88 Headless',
  defaultMetaDescription: 'Curated luxury lifestyle, high-fidelity acoustics, and haute couture engineered with Payload CMS 3.88 architecture.',
  ogImageDefault: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200',
  twitterHandle: '@luxeatelier',
  twitterCardType: 'summary_large_image',
  enableStructuredData: true,
  canonicalBaseUrl: 'https://luxeatelier.example.com'
};

// Initial Seed Form (Contact Concierge)
export const INITIAL_PAYLOAD_FORMS: PayloadFormDoc[] = [
  {
    id: 'form-contact',
    title: 'Client Concierge & Inquiries',
    slug: 'contact-concierge',
    submitButtonLabel: 'Transmit Inquiry',
    confirmationType: 'message',
    confirmationMessage: 'Thank you for contacting our client concierge. A luxury advisor will reach out within 2 business hours.',
    emails: [
      {
        emailTo: 'concierge@luxestore.com',
        subject: 'New Client Concierge Inquiry'
      }
    ],
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        blockType: 'text',
        required: true,
        placeholder: 'e.g. Eleanor Vance',
        width: 50
      },
      {
        name: 'emailAddress',
        label: 'Private Email Address',
        blockType: 'email',
        required: true,
        placeholder: 'eleanor@domain.com',
        width: 50
      },
      {
        name: 'inquiryCategory',
        label: 'Inquiry Specialty',
        blockType: 'select',
        required: true,
        defaultValue: 'custom_curation',
        options: [
          { label: 'Private Atelier Curation', value: 'custom_curation' },
          { label: 'High-Fidelity Audio Consulting', value: 'audio_consulting' },
          { label: 'Order Tracking & White-Glove Delivery', value: 'order_status' },
          { label: 'Corporate & VIP Gifting', value: 'corporate_gifting' }
        ],
        width: 100
      },
      {
        name: 'message',
        label: 'Message & Specifications',
        blockType: 'textarea',
        required: true,
        placeholder: 'Please describe your request in detail...',
        width: 100
      },
      {
        name: 'subscribeVip',
        label: 'Receive exclusive invitations to private salon viewings',
        blockType: 'checkbox',
        required: false,
        defaultValue: true,
        width: 100
      }
    ],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-08-20T12:00:00.000Z'
  },
  {
    id: 'form-vip-newsletter',
    title: 'Private Salon VIP Newsletter',
    slug: 'vip-newsletter',
    submitButtonLabel: 'Request Private Invitation',
    confirmationType: 'message',
    confirmationMessage: 'Welcome to the Private Salon. Check your inbox for your bespoke welcome pass.',
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        blockType: 'email',
        required: true,
        placeholder: 'your.name@private.com',
        width: 70
      },
      {
        name: 'preferredCategory',
        label: 'Primary Focus',
        blockType: 'select',
        required: false,
        defaultValue: 'all',
        options: [
          { label: 'All Collections', value: 'all' },
          { label: 'Horology & Fine Jewelry', value: 'watches' },
          { label: 'Acoustic Engineering', value: 'audio' },
          { label: 'Haute Couture Fashion', value: 'apparel' }
        ],
        width: 30
      }
    ],
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-08-22T15:00:00.000Z'
  }
];

// Initial Seed Submissions
export const INITIAL_PAYLOAD_SUBMISSIONS: PayloadFormSubmissionDoc[] = [
  {
    id: 'sub-101',
    formId: 'form-contact',
    formTitle: 'Client Concierge & Inquiries',
    submissionData: {
      fullName: 'Lady Beatrice Sterling',
      emailAddress: 'b.sterling@mayfair.co.uk',
      inquiryCategory: 'custom_curation',
      message: 'Inquiring regarding private viewing of the 18K Gold Chronograph collection for our Geneva estate.',
      subscribeVip: true
    },
    submittedAt: '2026-08-25T14:32:10.000Z',
    ipAddress: '194.230.145.22',
    status: 'new'
  },
  {
    id: 'sub-102',
    formId: 'form-vip-newsletter',
    formTitle: 'Private Salon VIP Newsletter',
    submissionData: {
      email: 'marcus.vance@techventures.io',
      preferredCategory: 'audio'
    },
    submittedAt: '2026-08-26T01:15:00.000Z',
    ipAddress: '66.249.70.1',
    status: 'reviewed'
  }
];

// Initial Seed Redirects
export const INITIAL_PAYLOAD_REDIRECTS: PayloadRedirectDoc[] = [
  {
    id: 'red-1',
    from: '/deals',
    to: {
      type: 'custom',
      url: '/shop?isSale=true'
    },
    statusCode: 301,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'red-2',
    from: '/audio',
    to: {
      type: 'custom',
      url: '/category/electronics'
    },
    statusCode: 301,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'red-3',
    from: '/vip-collection',
    to: {
      type: 'custom',
      url: '/shop?isFeatured=true'
    },
    statusCode: 302,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z'
  }
];

// Bootstrap initial seed data
INITIAL_PAYLOAD_CATEGORIES.forEach(c => categoriesDb.set(c.id, c));
INITIAL_PAYLOAD_PRODUCTS.forEach(p => productsDb.set(p.id, p));
INITIAL_PAYLOAD_COUPONS.forEach(cp => couponsDb.set(cp.code.toUpperCase(), cp));
INITIAL_PAYLOAD_REVIEWS.forEach(r => reviewsDb.set(r.id, r));
INITIAL_PAYLOAD_MEDIA.forEach(m => mediaDb.set(m.id, m));
INITIAL_PAYLOAD_FORMS.forEach(f => formsDb.set(f.id, f));
INITIAL_PAYLOAD_SUBMISSIONS.forEach(s => formSubmissionsDb.set(s.id, s));
INITIAL_PAYLOAD_REDIRECTS.forEach(r => redirectsDb.set(r.id, r));
pagesDb.set('home', INITIAL_PAYLOAD_HOME_PAGE);

// Nested property resolver for Payload dot notation paths (e.g. 'category.slug', 'financials.total')
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr === null || curr === undefined) return undefined;
    curr = curr[p];
  }
  return curr;
}

// Payload CMS 3.88 Universal Where Query Evaluator
export function evaluateWhereClause(doc: any, where: Record<string, any>): boolean {
  if (!where || typeof where !== 'object') return true;

  // 1. Boolean Combinator: OR
  if (Array.isArray(where.or) || Array.isArray(where.$or)) {
    const orList = where.or || where.$or;
    if (orList.length > 0 && !orList.some((subWhere: any) => evaluateWhereClause(doc, subWhere))) {
      return false;
    }
  }

  // 2. Boolean Combinator: AND
  if (Array.isArray(where.and) || Array.isArray(where.$and)) {
    const andList = where.and || where.$and;
    if (andList.length > 0 && !andList.every((subWhere: any) => evaluateWhereClause(doc, subWhere))) {
      return false;
    }
  }

  for (const [key, condition] of Object.entries(where)) {
    if (key === 'or' || key === 'and' || key === '$or' || key === '$and') continue;

    // Direct search helper shortcut
    if (key === 'search' || key === 'q') {
      const q = String(condition).toLowerCase();
      const title = String(doc.title || doc.name || doc.alt || doc.orderNumber || '').toLowerCase();
      const desc = String(doc.description || doc.caption || doc.comment || '').toLowerCase();
      const tags = Array.isArray(doc.tags) ? doc.tags.map((t: string) => String(t).toLowerCase()) : [];
      if (!title.includes(q) && !desc.includes(q) && !tags.some((t: string) => t.includes(q))) {
        return false;
      }
      continue;
    }

    // Direct category slug/id shortcut
    if (key === 'category') {
      const catSlug = String(condition).toLowerCase();
      const docCatSlug = String(doc.category?.slug || doc.category?.id || '').toLowerCase();
      if (docCatSlug !== catSlug) return false;
      continue;
    }

    // Direct brand shortcut
    if (key === 'brand') {
      const brandStr = String(condition).toLowerCase();
      const docBrand = String(doc.brand?.slug || doc.brand?.title || '').toLowerCase();
      if (docBrand !== brandStr) return false;
      continue;
    }

    // Direct price bounds shortcut
    if (key === 'minPrice') {
      const price = Number(doc.numericPrice ?? doc.price ?? doc.financials?.total ?? 0);
      if (price < Number(condition)) return false;
      continue;
    }
    if (key === 'maxPrice') {
      const price = Number(doc.numericPrice ?? doc.price ?? doc.financials?.total ?? 0);
      if (price > Number(condition)) return false;
      continue;
    }
    if (key === 'inStockOnly') {
      if (condition && Number(doc.inventory ?? 0) <= 0) return false;
      continue;
    }

    const val = getNestedValue(doc, key);

    // If condition is primitive value, test direct equality
    if (condition === null || typeof condition !== 'object' || Array.isArray(condition)) {
      if (Array.isArray(condition)) {
        if (!condition.includes(val) && !condition.some(c => String(c) === String(val))) return false;
      } else if (val !== condition && String(val) !== String(condition)) {
        return false;
      }
      continue;
    }

    // Condition is an operator dictionary: { equals, not_equals, greater_than, in, like, etc. }
    const op = condition as any;
    if (op.equals !== undefined) {
      if (val !== op.equals && String(val) !== String(op.equals)) return false;
    }
    if (op.not_equals !== undefined) {
      if (val === op.not_equals || String(val) === String(op.not_equals)) return false;
    }
    if (op.greater_than !== undefined) {
      if (Number(val) <= Number(op.greater_than)) return false;
    }
    if (op.greater_than_equal !== undefined) {
      if (Number(val) < Number(op.greater_than_equal)) return false;
    }
    if (op.less_than !== undefined) {
      if (Number(val) >= Number(op.less_than)) return false;
    }
    if (op.less_than_equal !== undefined) {
      if (Number(val) > Number(op.less_than_equal)) return false;
    }
    if (op.like !== undefined) {
      if (!String(val || '').toLowerCase().includes(String(op.like).toLowerCase())) return false;
    }
    if (op.contains !== undefined) {
      if (Array.isArray(val)) {
        if (!val.includes(op.contains)) return false;
      } else if (!String(val || '').toLowerCase().includes(String(op.contains).toLowerCase())) {
        return false;
      }
    }
    if (op.in !== undefined) {
      const arr = Array.isArray(op.in) ? op.in : [op.in];
      if (!arr.includes(val) && !arr.some(a => String(a) === String(val))) return false;
    }
    if (op.not_in !== undefined) {
      const arr = Array.isArray(op.not_in) ? op.not_in : [op.not_in];
      if (arr.includes(val) || arr.some(a => String(a) === String(val))) return false;
    }
    if (op.exists !== undefined) {
      const exists = val !== undefined && val !== null;
      if (exists !== Boolean(op.exists)) return false;
    }
  }

  return true;
}

// Add initial seed orders for immediate live tracking demo
const SEED_ORDER_1: PayloadOrderDoc = {
  id: 'ord-1001',
  orderNumber: 'LX-9901',
  customer: {
    id: 'usr-1',
    name: 'Alexander Vance',
    email: 'alexander.vance@example.com',
    phone: '+1 (555) 992-1083'
  },
  items: [
    {
      id: 'item-1',
      product: {
        id: 'prod-1',
        title: 'Premium Wireless Noise-Canceling Headphones',
        slug: 'premium-wireless-noise-canceling-headphones',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400',
        sku: 'NOVA-H1-BLK'
      },
      variant: { id: 'var-1a', title: 'Matte Obsidian Black' },
      price: 199.00,
      quantity: 1,
      subtotal: 199.00
    }
  ],
  financials: {
    subtotal: 199.00,
    discount: 19.90,
    shippingFee: 0,
    tax: 14.33,
    total: 193.43,
    currency: 'USD'
  },
  couponApplied: {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountAmount: 19.90
  },
  shippingAddress: {
    id: 'addr-1',
    label: 'Primary Residence',
    name: 'Alexander Vance',
    street: '1 Executive Plaza, Suite 40B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    phone: '+1 (555) 992-1083',
    isDefaultShipping: true
  },
  fulfillmentStatus: 'in_transit',
  paymentStatus: 'paid',
  paymentMethod: 'Apple Pay Express',
  shippingCarrier: 'FedEx Priority Air',
  trackingNumber: 'FX-9830219842',
  trackingUrl: 'https://www.fedex.com',
  timeline: [
    {
      title: 'Order Confirmed & Payment Authorized',
      description: 'Transaction captured via Apple Pay Express.',
      date: 'Aug 24, 2026 — 09:14 AM',
      location: 'New York, NY',
      completed: true
    },
    {
      title: 'Artisan Inspection & Custom Boxing',
      description: 'Quality verified and packed in custom protective velvet casket.',
      date: 'Aug 24, 2026 — 02:30 PM',
      location: 'Manhattan Fulfillment Atelier',
      completed: true
    },
    {
      title: 'Departed Carrier Sorting Facility',
      description: 'Package scanned and boarded onto FedEx Air Flight 448.',
      date: 'Aug 25, 2026 — 08:45 PM',
      location: 'JFK International Cargo Terminal',
      completed: true,
      current: true
    },
    {
      title: 'Out for Final Delivery',
      description: 'Courier assigned for white-glove signature delivery.',
      date: 'Estimated Aug 27, 2026',
      location: 'New York Metro Area',
      completed: false
    }
  ],
  createdAt: '2026-08-24T09:14:00.000Z',
  updatedAt: '2026-08-25T20:45:00.000Z'
};
ordersDb.set(SEED_ORDER_1.id, SEED_ORDER_1);
ordersDb.set(SEED_ORDER_1.orderNumber, SEED_ORDER_1);

// --- PAYLOAD 3.88 RBAC & ACCESS RULES REGISTRY ---
const PAYLOAD_ACCESS_RULES: PayloadAccessRule[] = [
  { collection: 'products', operation: 'read', allowedRoles: ['admin', 'editor', 'customer', 'guest'], conditionDescription: 'Public read access for published documents; drafts require editor or admin role.' },
  { collection: 'products', operation: 'create', allowedRoles: ['admin', 'editor'], conditionDescription: 'Admin or authenticated catalog editor.' },
  { collection: 'products', operation: 'update', allowedRoles: ['admin', 'editor'], conditionDescription: 'Admin or authenticated catalog editor.' },
  { collection: 'products', operation: 'delete', allowedRoles: ['admin'], conditionDescription: 'Super Admin only to prevent orphaned references.' },
  { collection: 'orders', operation: 'read', allowedRoles: ['admin', 'editor', 'customer'], conditionDescription: 'Admins read all; customers read only documents where customer.email matches auth token.' },
  { collection: 'orders', operation: 'create', allowedRoles: ['admin', 'editor', 'customer', 'guest'], conditionDescription: 'Open for guest and authenticated checkout with inventory validation.' },
  { collection: 'orders', operation: 'update', allowedRoles: ['admin', 'editor'], conditionDescription: 'Admins and fulfillment handlers for order status updates.' },
  { collection: 'orders', operation: 'delete', allowedRoles: ['admin'], conditionDescription: 'Super Admin only (soft-archive preferred).' },
  { collection: 'reviews', operation: 'read', allowedRoles: ['admin', 'editor', 'customer', 'guest'], conditionDescription: 'Public read for approved verified reviews.' },
  { collection: 'reviews', operation: 'create', allowedRoles: ['admin', 'editor', 'customer'], conditionDescription: 'Authenticated patron with anti-spam check.' },
  { collection: 'reviews', operation: 'update', allowedRoles: ['admin'], conditionDescription: 'Admin moderation.' },
  { collection: 'coupons', operation: 'read', allowedRoles: ['admin', 'editor', 'customer', 'guest'], conditionDescription: 'Public validation by promo code; full coupon listing restricted to admin.' },
  { collection: 'coupons', operation: 'create', allowedRoles: ['admin'], conditionDescription: 'Admin marketing manager.' },
  { collection: 'globals', operation: 'read', allowedRoles: ['admin', 'editor', 'customer', 'guest'], conditionDescription: 'Public store configuration & announcement bar.' },
  { collection: 'globals', operation: 'update', allowedRoles: ['admin'], conditionDescription: 'Super Admin only.' },
  { collection: 'webhooks', operation: 'admin', allowedRoles: ['admin'], conditionDescription: 'Stripe & carrier signature verification.' },
  { collection: 'apiKeys', operation: 'admin', allowedRoles: ['admin'], conditionDescription: 'Scoped API key generation & rotation.' }
];

// In-Memory Storage for Payload 3.88 Architecture Features
const versionsDb = new Map<string, PayloadVersionDoc[]>();
const hookLogs: PayloadHookExecutionLog[] = [
  {
    id: 'hook-init-1',
    collection: 'products',
    hookName: 'afterRead',
    operation: 'read',
    durationMs: 4,
    status: 'success',
    summary: 'Calculated dynamic stock badges and formatted currency values.',
    timestamp: new Date(Date.now() - 120000).toISOString()
  },
  {
    id: 'hook-init-2',
    collection: 'orders',
    hookName: 'beforeValidate',
    operation: 'create',
    durationMs: 12,
    status: 'success',
    summary: 'Validated cart inventory levels and applied promotional discounts.',
    timestamp: new Date(Date.now() - 60000).toISOString()
  },
  {
    id: 'hook-init-3',
    collection: 'orders',
    hookName: 'afterChange',
    operation: 'create',
    durationMs: 18,
    status: 'success',
    summary: 'Triggered automated inventory decrement & customer confirmation dispatch.',
    timestamp: new Date(Date.now() - 30000).toISOString()
  }
];

const apiKeysDb = new Map<string, PayloadApiKeyDoc>([
  [
    'pk_live_sec_991823a8f1',
    {
      id: 'key-1',
      name: 'Production Storefront Client',
      keyPrefix: 'pk_live_sec_991823...',
      role: 'admin',
      scopes: ['read:products', 'write:orders', 'read:categories', 'read:reviews', 'admin:globals'],
      createdAt: '2026-08-01T00:00:00.000Z',
      lastUsedAt: new Date().toISOString(),
      isActive: true
    }
  ],
  [
    'pk_test_dev_441209b3c2',
    {
      id: 'key-2',
      name: 'CI/CD Automated Integration Tester',
      keyPrefix: 'pk_test_dev_441209...',
      role: 'editor',
      scopes: ['read:products', 'write:products', 'read:orders'],
      createdAt: '2026-08-15T00:00:00.000Z',
      lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
      isActive: true
    }
  ]
]);

const webhookEventsDb: PayloadWebhookEvent[] = [
  {
    id: 'wh-evt-1',
    provider: 'stripe',
    event: 'payment_intent.succeeded',
    payload: { id: 'pi_3Pz9810291', amount: 19343, currency: 'usd', status: 'succeeded', metadata: { orderId: 'LX-9901' } },
    verified: true,
    signature: 't=1787593200,v1=9f83a8b27c194e82',
    status: 'processed',
    processedAt: '2026-08-24T09:14:05.000Z',
    responseSummary: 'Order LX-9901 marked as payment verified and queued for fulfillment.'
  },
  {
    id: 'wh-evt-2',
    provider: 'fedex',
    event: 'shipment.in_transit',
    payload: { trackingNumber: 'FX-9830219842', status: 'IN_TRANSIT', location: 'JFK Cargo Terminal' },
    verified: true,
    signature: 'sha256=a1b2c3d4e5f6',
    status: 'processed',
    processedAt: '2026-08-25T20:45:10.000Z',
    responseSummary: 'FedEx Air status updated to IN_TRANSIT with milestone appended.'
  }
];

export const payloadStore = {
  // --- PRODUCTS ---
  findProducts(params: {
    where?: Record<string, any>;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}): PayloadPaginatedResponse<PayloadProductDoc> {
    const { where = {}, sort = '-createdAt', page = 1, limit = 20 } = params;
    
    // Evaluate through Universal Where Engine
    let docs = Array.from(productsDb.values()).filter(p => {
      // If status is explicitly provided in where query, respect it, otherwise default to published
      if (!where.status && p.status !== 'published') {
        return false;
      }
      return evaluateWhereClause(p, where);
    });

    // Sort logic
    if (sort === 'price' || sort === '+price') {
      docs.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (sort === '-price') {
      docs.sort((a, b) => b.numericPrice - a.numericPrice);
    } else if (sort === 'rating' || sort === '-rating') {
      docs.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'title') {
      docs.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default newest
      docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const totalDocs = docs.length;
    const totalPages = Math.ceil(totalDocs / limit) || 1;
    const currPage = Math.max(1, Math.min(page, totalPages));
    const offset = (currPage - 1) * limit;
    const paginatedDocs = docs.slice(offset, offset + limit);

    return {
      docs: paginatedDocs,
      totalDocs,
      limit,
      totalPages,
      page: currPage,
      pagingCounter: offset + 1,
      hasPrevPage: currPage > 1,
      hasNextPage: currPage < totalPages,
      prevPage: currPage > 1 ? currPage - 1 : null,
      nextPage: currPage < totalPages ? currPage + 1 : null
    };
  },

  findProductByIdOrSlug(idOrSlug: string): PayloadProductDoc | null {
    if (!idOrSlug) return null;
    const doc = productsDb.get(idOrSlug);
    if (doc) return doc;
    for (const p of productsDb.values()) {
      if (p.slug === idOrSlug || p.id === idOrSlug) return p;
    }
    return null;
  },

  saveProduct(product: Partial<PayloadProductDoc> & { title: string; price: number }): PayloadProductDoc {
    const isNew = !product.id || !productsDb.has(product.id);
    const id = product.id || `prod-${Date.now()}`;
    const slug = product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const numericPrice = Number(product.price);

    // Lifecycle hook: beforeValidate
    this.logHookExecution(
      'products',
      'beforeValidate',
      isNew ? 'create' : 'update',
      id,
      4,
      'success',
      `Validated product schema and constraints for "${product.title}".`
    );

    const doc: PayloadProductDoc = {
      id,
      slug,
      title: product.title,
      price: numericPrice,
      compareAtPrice: product.compareAtPrice,
      numericPrice,
      isSale: product.isSale ?? (product.compareAtPrice ? product.compareAtPrice > numericPrice : false),
      saleBadgeText: product.saleBadgeText,
      isFeatured: product.isFeatured ?? false,
      inventory: product.inventory ?? 10,
      lowStockThreshold: product.lowStockThreshold ?? 5,
      allowBackorder: product.allowBackorder ?? false,
      images: product.images && product.images.length > 0 ? product.images : [
        { id: `img-${id}`, url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800', alt: product.title }
      ],
      category: product.category || { id: 1, title: 'Acoustic Instruments', slug: 'acoustic-instruments' },
      brand: product.brand,
      tags: product.tags || ['Curated'],
      description: product.description || 'Artisan item crafted with meticulous precision.',
      richDescription: product.richDescription,
      specs: product.specs || [],
      variants: product.variants || [],
      rating: product.rating ?? 5.0,
      reviewsCount: product.reviewsCount ?? 1,
      status: product.status || 'published',
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    productsDb.set(id, doc);
    if (doc.slug) productsDb.set(doc.slug, doc);

    // Lifecycle hook: afterChange
    this.logHookExecution(
      'products',
      'afterChange',
      isNew ? 'create' : 'update',
      id,
      12,
      'success',
      `Product "${doc.title}" persisted. Search indexes and cache updated.`
    );

    return doc;
  },

  deleteProduct(id: string): boolean {
    const existing = productsDb.get(id);
    if (!existing) return false;

    // Lifecycle hook: beforeDelete
    this.logHookExecution(
      'products',
      'beforeDelete',
      'delete',
      id,
      5,
      'success',
      `Checking relations and media attachments before deleting product "${existing.title}".`
    );

    productsDb.delete(id);
    if (existing.slug) productsDb.delete(existing.slug);

    // Lifecycle hook: afterDelete
    this.logHookExecution(
      'products',
      'afterDelete',
      'delete',
      id,
      6,
      'success',
      `Purged product "${existing.title}" from catalog database and cache.`
    );

    return true;
  },

  // --- FACETS & SEARCH AGGREGATIONS ---
  getFacets(): PayloadFacetsResponse {
    const allProducts = Array.from(productsDb.values()).filter(p => p.status === 'published');
    const totalProducts = allProducts.length;

    // Category aggregation
    const catMap = new Map<string, { id: string | number; title: string; slug: string; count: number }>();
    const brandMap = new Map<string, { id: string | number; title: string; count: number }>();

    let minPrice = Infinity;
    let maxPrice = 0;
    let inStockCount = 0;
    let saleCount = 0;

    for (const p of allProducts) {
      if (p.numericPrice < minPrice) minPrice = p.numericPrice;
      if (p.numericPrice > maxPrice) maxPrice = p.numericPrice;
      if (p.inventory > 0) inStockCount++;
      if (p.isSale) saleCount++;

      // Category
      const c = p.category;
      if (c) {
        const exist = catMap.get(c.slug) || { id: c.id, title: c.title, slug: c.slug, count: 0 };
        exist.count++;
        catMap.set(c.slug, exist);
      }

      // Brand
      if (p.brand) {
        const b = p.brand;
        const exist = brandMap.get(b.title) || { id: b.id, title: b.title, count: 0 };
        exist.count++;
        brandMap.set(b.title, exist);
      }
    }

    return {
      totalProducts,
      categories: Array.from(catMap.values()),
      brands: Array.from(brandMap.values()),
      priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice },
      inStockCount,
      saleCount
    };
  },

  // --- LOW STOCK & INVENTORY ALERTS ---
  getLowStockProducts(): PayloadProductDoc[] {
    return Array.from(productsDb.values()).filter(p => p.inventory <= (p.lowStockThreshold ?? 5));
  },

  // --- CATEGORIES ---
  findCategories(): PayloadCategoryDoc[] {
    return Array.from(categoriesDb.values());
  },

  findCategoryByIdOrSlug(idOrSlug: string | number): PayloadCategoryDoc | null {
    if (!idOrSlug) return null;
    const byId = categoriesDb.get(idOrSlug);
    if (byId) return byId;
    for (const c of categoriesDb.values()) {
      if (String(c.slug).toLowerCase() === String(idOrSlug).toLowerCase()) return c;
    }
    return null;
  },

  // --- REVIEWS COLLECTION ---
  findReviews(productId?: string): { docs: PayloadReviewDoc[]; totalDocs: number; averageRating: number; ratingDistribution: Record<number, number> } {
    let docs = Array.from(reviewsDb.values()).filter(r => r.status === 'published');
    if (productId) {
      docs = docs.filter(r => r.productId === productId);
    }
    docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sumRating = 0;
    for (const r of docs) {
      const rounded = Math.round(r.rating);
      if (dist[rounded] !== undefined) dist[rounded]++;
      sumRating += r.rating;
    }

    const averageRating = docs.length > 0 ? Number((sumRating / docs.length).toFixed(1)) : 5.0;

    return {
      docs,
      totalDocs: docs.length,
      averageRating,
      ratingDistribution: dist
    };
  },

  createReview(data: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
    authorName?: string;
    authorEmail?: string;
  }): PayloadReviewDoc {
    const id = `rev-${Date.now()}`;
    const rating = Math.max(1, Math.min(5, Number(data.rating) || 5));

    const review: PayloadReviewDoc = {
      id,
      productId: data.productId,
      rating,
      title: data.title || 'Verified Patron Review',
      comment: data.comment,
      author: {
        name: data.authorName || 'Verified Patron',
        email: data.authorEmail,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + (reviewsDb.size * 1000)}?q=80&w=200`
      },
      isVerifiedBuyer: true,
      status: 'published',
      likesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reviewsDb.set(id, review);

    // Update product rating summary
    const prod = productsDb.get(data.productId);
    if (prod) {
      const revs = this.findReviews(data.productId);
      prod.rating = revs.averageRating;
      prod.reviewsCount = revs.totalDocs;
      productsDb.set(prod.id, prod);
    }

    return review;
  },

  // --- PROMOTIONS & COUPONS ---
  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: PayloadCouponDoc; discountAmount: number; message?: string } {
    if (!code) return { valid: false, discountAmount: 0, message: 'Promo code is required.' };
    const clean = code.trim().toUpperCase();
    const cp = couponsDb.get(clean);

    if (!cp || !cp.isActive) {
      return { valid: false, discountAmount: 0, message: 'Invalid or inactive promotional code.' };
    }

    const now = new Date();
    if (new Date(cp.validFrom) > now || new Date(cp.validUntil) < now) {
      return { valid: false, discountAmount: 0, message: 'This promotion code has expired.' };
    }

    if (cp.usageLimit && cp.usedCount >= cp.usageLimit) {
      return { valid: false, discountAmount: 0, message: 'Promotional usage limit reached.' };
    }

    if (subtotal < cp.minOrderSubtotal) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Order subtotal must be at least $${cp.minOrderSubtotal} to use code ${cp.code}.`
      };
    }

    let discountAmount = 0;
    if (cp.discountType === 'percentage') {
      discountAmount = Number(((subtotal * cp.discountValue) / 100).toFixed(2));
      if (cp.maxDiscount && discountAmount > cp.maxDiscount) {
        discountAmount = cp.maxDiscount;
      }
    } else if (cp.discountType === 'fixed') {
      discountAmount = Math.min(subtotal, cp.discountValue);
    } else if (cp.discountType === 'free_shipping') {
      discountAmount = globalSettings.shipping.standardShippingRate;
    }

    return {
      valid: true,
      coupon: cp,
      discountAmount,
      message: `Code ${cp.code} applied: ${cp.description}`
    };
  },

  // --- ORDERS ---
  createOrder(data: {
    customer: { id?: string; name: string; email: string; phone?: string };
    items: Array<{ id: string; quantity: number; variantId?: string }>;
    shippingAddress: PayloadAddress;
    billingAddress?: PayloadAddress;
    couponCode?: string;
    paymentMethod?: string;
    shippingType?: 'standard' | 'express';
    notes?: string;
  }): PayloadOrderDoc {
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `LX-${Math.floor(10000 + Math.random() * 90000)}`;

    let subtotal = 0;
    const items = data.items.map(item => {
      const prod = this.findProductByIdOrSlug(item.id);
      const unitPrice = prod?.numericPrice || 100.00;
      const qty = Math.max(1, item.quantity || 1);
      const lineSubtotal = unitPrice * qty;
      subtotal += lineSubtotal;

      // Decrement inventory on order placement
      if (prod && prod.inventory >= qty) {
        prod.inventory -= qty;
        productsDb.set(prod.id, prod);
      }

      return {
        id: `line-${item.id}-${Date.now()}`,
        product: {
          id: prod?.id || item.id,
          title: prod?.title || 'Luxe Product',
          slug: prod?.slug || 'luxe-product',
          image: prod?.images?.[0] ? (typeof prod.images[0] === 'string' ? prod.images[0] : prod.images[0].url) : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400',
          sku: prod?.variants?.[0]?.sku || `LX-${prod?.id || 'SKU'}`
        },
        price: unitPrice,
        quantity: qty,
        subtotal: lineSubtotal
      };
    });

    let discount = 0;
    let couponApplied = undefined;
    if (data.couponCode) {
      const validation = this.validateCoupon(data.couponCode, subtotal);
      if (validation.valid && validation.coupon) {
        discount = validation.discountAmount;
        couponApplied = {
          code: validation.coupon.code,
          discountType: validation.coupon.discountType,
          discountAmount: discount
        };
        validation.coupon.usedCount++;
        couponsDb.set(validation.coupon.code, validation.coupon);
      }
    }

    const shippingFee = (couponApplied?.discountType === 'free_shipping') || (subtotal >= globalSettings.shipping.freeShippingThreshold)
      ? 0
      : (data.shippingType === 'express' ? globalSettings.shipping.expressShippingRate : globalSettings.shipping.standardShippingRate);

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * (globalSettings.taxRatePercent / 100)).toFixed(2));
    const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const trackingNumber = `FX-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const order: PayloadOrderDoc = {
      id: orderId,
      orderNumber,
      customer: data.customer,
      items,
      financials: {
        subtotal: Number(subtotal.toFixed(2)),
        shippingFee,
        tax,
        discount,
        total,
        currency: 'USD'
      },
      couponApplied,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress || data.shippingAddress,
      fulfillmentStatus: 'processing',
      paymentStatus: 'paid',
      paymentMethod: data.paymentMethod || 'Credit Card Express',
      shippingCarrier: 'FedEx Priority Air',
      trackingNumber,
      trackingUrl: 'https://www.fedex.com',
      timeline: [
        {
          title: 'Order Confirmed & Authorized',
          description: 'Payment verified and order queued for packaging.',
          date: `${dateStr} — ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          location: 'Payload Order Processing Engine',
          completed: true,
          current: true
        },
        {
          title: 'Artisan Inspection & Custom Boxing',
          description: 'Items inspected and packed into signature velvet casket.',
          date: 'In Progress',
          location: 'Manhattan Fulfillment Atelier',
          completed: false
        },
        {
          title: 'Carrier Handover to FedEx Air',
          description: 'Dispatched to FedEx Priority Air for express flight.',
          date: 'Scheduled',
          location: 'JFK Cargo Logistics',
          completed: false
        },
        {
          title: 'Delivered',
          description: 'Recipient signature delivery.',
          date: '3-5 Business Days',
          location: data.shippingAddress.city || 'Recipient Location',
          completed: false
        }
      ],
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    ordersDb.set(orderId, order);
    ordersDb.set(orderNumber, order);
    return order;
  },

  updateOrderStatus(idOrNumber: string, status: PayloadOrderDoc['fulfillmentStatus']): PayloadOrderDoc | null {
    const order = this.findOrderById(idOrNumber);
    if (!order) return null;

    order.fulfillmentStatus = status;
    order.updatedAt = new Date().toISOString();

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Update timeline steps dynamically
    if (status === 'shipped' || status === 'in_transit') {
      order.timeline.forEach((t, i) => {
        if (i <= 2) t.completed = true;
        if (i === 2) {
          t.current = true;
          t.date = `${dateStr} — ${timestamp}`;
        } else {
          t.current = false;
        }
      });
    } else if (status === 'out_for_delivery') {
      order.timeline.forEach((t, i) => {
        if (i <= 2) t.completed = true;
        if (i === 3) {
          t.current = true;
          t.title = 'Out for Delivery';
          t.description = 'Courier en route to recipient location.';
          t.date = `${dateStr} — ${timestamp}`;
        }
      });
    } else if (status === 'delivered') {
      order.timeline.forEach(t => {
        t.completed = true;
        t.current = false;
      });
      const last = order.timeline[order.timeline.length - 1];
      if (last) {
        last.date = `${dateStr} — ${timestamp}`;
        last.description = 'Package safely signed and handed to recipient.';
      }
    }

    ordersDb.set(order.id, order);
    ordersDb.set(order.orderNumber, order);
    return order;
  },

  findOrderById(idOrNumber: string): PayloadOrderDoc | null {
    if (!idOrNumber) return null;
    const clean = idOrNumber.trim().toUpperCase();
    return ordersDb.get(clean) || ordersDb.get(idOrNumber.toLowerCase()) || null;
  },

  findOrdersByCustomer(email?: string, customerId?: string): PayloadOrderDoc[] {
    const all = Array.from(new Set(ordersDb.values()));
    return all.filter(o => {
      if (customerId && o.customer.id === customerId) return true;
      if (email && o.customer.email.toLowerCase() === email.toLowerCase()) return true;
      return false;
    });
  },

  // --- PAGES & DYNAMIC LAYOUT BLOCKS ---
  getPage(slug: string): PayloadPageDoc | null {
    return pagesDb.get(slug) || null;
  },

  savePage(page: PayloadPageDoc): PayloadPageDoc {
    pagesDb.set(page.slug, page);
    return page;
  },

  // --- GLOBALS ---
  getGlobalSettings(): PayloadGlobalSettings {
    return globalSettings;
  },

  updateGlobalSettings(patch: Partial<PayloadGlobalSettings>): PayloadGlobalSettings {
    globalSettings = { ...globalSettings, ...patch };
    return globalSettings;
  },

  // --- ACCESS CONTROL & RBAC ---
  getAccessRules(): PayloadAccessRule[] {
    return PAYLOAD_ACCESS_RULES;
  },

  evaluateAccess(collection: string, operation: 'read' | 'create' | 'update' | 'delete', role: PayloadRole, userEmail?: string): PayloadAccessEvaluation {
    const rule = PAYLOAD_ACCESS_RULES.find(r => r.collection === collection && (r.operation === operation || r.operation === 'admin'));
    const isAllowed = rule ? rule.allowedRoles.includes(role) : role === 'admin';
    let reason = isAllowed 
      ? `Role "${role}" possesses explicit ${operation.toUpperCase()} permission for "${collection}".`
      : `Role "${role}" does not meet required access privilege for ${operation.toUpperCase()} on "${collection}".`;

    if (collection === 'orders' && operation === 'read' && role === 'customer') {
      reason = userEmail 
        ? `Scoped patron query granted for documents matching ${userEmail}.`
        : `Patron query permitted for verified session holder.`;
    }

    return {
      allowed: isAllowed,
      collection,
      operation,
      role,
      userEmail,
      reason,
      timestamp: new Date().toISOString()
    };
  },

  // --- LIFECYCLE HOOKS AUDIT TRAIL ---
  logHookExecution(
    collection: string,
    hookName: PayloadHookStage,
    operation: 'create' | 'read' | 'update' | 'delete',
    docId: string | undefined,
    durationMs: number,
    status: 'success' | 'warn' | 'error',
    summary: string,
    details?: Record<string, any>
  ): PayloadHookExecutionLog {
    const entry: PayloadHookExecutionLog = {
      id: `hook-log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      collection,
      hookName,
      documentId: docId,
      operation,
      durationMs,
      status,
      summary,
      details,
      timestamp: new Date().toISOString()
    };

    hookLogs.unshift(entry);
    if (hookLogs.length > 100) hookLogs.pop();
    return entry;
  },

  getHookLogs(limit: number = 30): PayloadHookExecutionLog[] {
    return hookLogs.slice(0, limit);
  },

  clearHookLogs(): void {
    hookLogs.length = 0;
  },

  // --- DRAFTS & VERSIONS ---
  getProductVersions(productId: string): PayloadVersionDoc<PayloadProductDoc>[] {
    return versionsDb.get(productId) || [];
  },

  saveProductVersion(productId: string, versionData: PayloadProductDoc, author?: { email: string; name?: string }, autosave: boolean = false): PayloadVersionDoc<PayloadProductDoc> {
    const versions = versionsDb.get(productId) || [];
    const versionEntry: PayloadVersionDoc<PayloadProductDoc> = {
      id: `ver-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      parent: productId,
      version: { ...versionData },
      autosave,
      status: versionData.status || 'published',
      author: author || { email: 'admin@luxestore.com', name: 'Store Administrator' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    versions.unshift(versionEntry);
    if (versions.length > 25) versions.pop();
    versionsDb.set(productId, versions);
    return versionEntry;
  },

  restoreProductVersion(productId: string, versionId: string): PayloadProductDoc | null {
    const versions = versionsDb.get(productId) || [];
    const targetVer = versions.find(v => v.id === versionId);
    if (!targetVer) return null;

    const restoredDoc: PayloadProductDoc = {
      ...targetVer.version,
      updatedAt: new Date().toISOString()
    };

    productsDb.set(productId, restoredDoc);
    if (restoredDoc.slug) productsDb.set(restoredDoc.slug, restoredDoc);

    this.logHookExecution(
      'products',
      'afterChange',
      'update',
      productId,
      8,
      'success',
      `Restored product "${restoredDoc.title}" to version snapshot ${versionId}.`
    );

    return restoredDoc;
  },

  saveProductDraft(data: Partial<PayloadProductDoc>, author?: { email: string; name?: string }): PayloadProductDoc {
    const id = data.id || `prod-${Date.now()}`;
    const draftDoc: PayloadProductDoc = {
      id,
      slug: data.slug || `draft-${id}`,
      title: data.title || 'Untitled Draft Product',
      price: data.price || 0,
      numericPrice: data.numericPrice || data.price || 0,
      inventory: data.inventory ?? 10,
      images: data.images || [],
      category: data.category || { id: 1, title: 'Acoustic Instruments', slug: 'acoustic-instruments' },
      tags: data.tags || ['Draft'],
      description: data.description || 'Draft product documentation.',
      rating: 5.0,
      reviewsCount: 0,
      status: 'draft',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    productsDb.set(id, draftDoc);
    if (draftDoc.slug) productsDb.set(draftDoc.slug, draftDoc);
    this.saveProductVersion(id, draftDoc, author, false);

    this.logHookExecution(
      'products',
      'beforeChange',
      'create',
      id,
      6,
      'success',
      `Draft document for "${draftDoc.title}" persisted to version store.`
    );

    return draftDoc;
  },

  publishProduct(productId: string): PayloadProductDoc | null {
    const prod = productsDb.get(productId);
    if (!prod) return null;

    prod.status = 'published';
    prod.updatedAt = new Date().toISOString();
    productsDb.set(productId, prod);
    if (prod.slug) productsDb.set(prod.slug, prod);

    this.saveProductVersion(productId, prod, undefined, false);
    this.logHookExecution(
      'products',
      'afterChange',
      'update',
      productId,
      14,
      'success',
      `Published live catalog document "${prod.title}". Search indexes updated.`
    );

    return prod;
  },

  // --- API KEYS & SCOPED SECURITY ---
  getApiKeys(): PayloadApiKeyDoc[] {
    return Array.from(apiKeysDb.values());
  },

  createApiKey(name: string, role: PayloadRole, scopes: string[]): { doc: PayloadApiKeyDoc; secretKey: string } {
    const rawSecret = `pk_${role === 'admin' ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const keyDoc: PayloadApiKeyDoc = {
      id: `key-${Date.now()}`,
      name,
      keyPrefix: `${rawSecret.substring(0, 16)}...`,
      role,
      scopes,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    apiKeysDb.set(rawSecret, keyDoc);
    return { doc: keyDoc, secretKey: rawSecret };
  },

  revokeApiKey(id: string): boolean {
    for (const [key, doc] of apiKeysDb.entries()) {
      if (doc.id === id) {
        doc.isActive = false;
        apiKeysDb.delete(key);
        return true;
      }
    }
    return false;
  },

  validateApiKey(tokenOrKey: string): PayloadApiKeyDoc | null {
    const doc = apiKeysDb.get(tokenOrKey);
    if (doc && doc.isActive) {
      doc.lastUsedAt = new Date().toISOString();
      return doc;
    }
    return null;
  },

  // --- WEBHOOKS & PAYMENT INTEGRATION ---
  processWebhook(
    provider: 'stripe' | 'fedex' | 'resend' | 'custom',
    event: string,
    payloadData: Record<string, any>,
    signature?: string
  ): PayloadWebhookEvent {
    const isVerified = Boolean(signature && signature.length > 5);
    const eventId = `wh-evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let summary = `Received webhook ${event} from ${provider}.`;

    if (provider === 'stripe' && event === 'payment_intent.succeeded') {
      const orderId = payloadData?.metadata?.orderId;
      if (orderId) {
        const ord = this.findOrderById(orderId);
        if (ord) {
          ord.paymentStatus = 'paid';
          ordersDb.set(ord.id, ord);
          ordersDb.set(ord.orderNumber, ord);
          summary = `Stripe verified payment for order ${ord.orderNumber}. Transitioned status to PAID.`;
        }
      }
    }

    const eventRecord: PayloadWebhookEvent = {
      id: eventId,
      provider,
      event,
      payload: payloadData,
      verified: isVerified,
      signature: signature || 'simulated-hmac-sha256-signature',
      status: 'processed',
      processedAt: new Date().toISOString(),
      responseSummary: summary
    };

    webhookEventsDb.unshift(eventRecord);
    if (webhookEventsDb.length > 50) webhookEventsDb.pop();

    this.logHookExecution(
      'webhooks',
      'afterOperation',
      'create',
      eventId,
      10,
      'success',
      `Webhook processed from ${provider}: ${event}`
    );

    return eventRecord;
  },

  getWebhookEvents(limit: number = 20): PayloadWebhookEvent[] {
    return webhookEventsDb.slice(0, limit);
  },

  getSecurityStatus(): PayloadSecurityStatus {
    return {
      rateLimitingEnabled: true,
      csrfProtectionEnabled: true,
      apiKeyAuthEnabled: true,
      jwtSessionActive: true,
      corsOriginPolicy: 'Same-Origin Strict + Configured External Hosts',
      activeApiKeysCount: Array.from(apiKeysDb.values()).filter(k => k.isActive).length,
      totalWebhooksProcessed: webhookEventsDb.length,
      lastAuditTimestamp: new Date().toISOString()
    };
  },

  // --- MEDIA COLLECTION (PAYLOAD 3.88 ASSET MANAGEMENT) ---
  findMedia(params: {
    where?: Record<string, any>;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}): PayloadPaginatedResponse<PayloadMediaDoc> {
    const { where = {}, sort = '-createdAt', page = 1, limit = 20 } = params;
    
    let docs = Array.from(mediaDb.values()).filter(m => evaluateWhereClause(m, where));

    // Sort logic
    if (sort === 'filename' || sort === '+filename') {
      docs.sort((a, b) => a.filename.localeCompare(b.filename));
    } else if (sort === 'filesize' || sort === '-filesize') {
      docs.sort((a, b) => (sort === 'filesize' ? a.filesize - b.filesize : b.filesize - a.filesize));
    } else {
      // Default newest
      docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const totalDocs = docs.length;
    const totalPages = Math.ceil(totalDocs / limit) || 1;
    const currPage = Math.max(1, Math.min(page, totalPages));
    const offset = (currPage - 1) * limit;
    const paginatedDocs = docs.slice(offset, offset + limit);

    return {
      docs: paginatedDocs,
      totalDocs,
      limit,
      totalPages,
      page: currPage,
      pagingCounter: offset + 1,
      hasPrevPage: currPage > 1,
      hasNextPage: currPage < totalPages,
      prevPage: currPage > 1 ? currPage - 1 : null,
      nextPage: currPage < totalPages ? currPage + 1 : null
    };
  },

  findMediaById(id: string): PayloadMediaDoc | null {
    if (!id) return null;
    return mediaDb.get(id) || null;
  },

  createMedia(data: {
    alt: string;
    caption?: string;
    filename: string;
    mimeType?: string;
    filesize?: number;
    width?: number;
    height?: number;
    url: string;
    focalX?: number;
    focalY?: number;
  }): PayloadMediaDoc {
    const id = `media-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const mimeType = data.mimeType || (data.filename.endsWith('.webp') ? 'image/webp' : data.filename.endsWith('.png') ? 'image/png' : 'image/jpeg');
    const width = data.width || 1920;
    const height = data.height || 1280;
    const filesize = data.filesize || 350000;
    const focalX = data.focalX !== undefined ? data.focalX : 0.5;
    const focalY = data.focalY !== undefined ? data.focalY : 0.5;

    // Lifecycle hook: beforeValidate
    this.logHookExecution(
      'media',
      'beforeValidate',
      'create',
      id,
      3,
      'success',
      `Validated asset format (${mimeType}) and dimensions (${width}x${height}) for "${data.filename}".`
    );

    const baseUrl = data.url;
    const cleanFilename = data.filename.replace(/\.[^/.]+$/, "");

    const mediaDoc: PayloadMediaDoc = {
      id,
      alt: data.alt || data.filename,
      caption: data.caption,
      filename: data.filename,
      mimeType,
      filesize,
      width,
      height,
      focalX,
      focalY,
      url: baseUrl,
      thumbnailUrl: `${baseUrl}&w=300`,
      sizes: {
        thumbnail: {
          url: `${baseUrl}&w=300`,
          width: 300,
          height: Math.round((300 / width) * height),
          mimeType,
          filesize: Math.round(filesize * 0.1),
          filename: `${cleanFilename}-300x${Math.round((300 / width) * height)}.${mimeType.split('/')[1] || 'webp'}`
        },
        card: {
          url: `${baseUrl}&w=600`,
          width: 600,
          height: Math.round((600 / width) * height),
          mimeType,
          filesize: Math.round(filesize * 0.28),
          filename: `${cleanFilename}-600x${Math.round((600 / width) * height)}.${mimeType.split('/')[1] || 'webp'}`
        },
        tablet: {
          url: `${baseUrl}&w=1024`,
          width: 1024,
          height: Math.round((1024 / width) * height),
          mimeType,
          filesize: Math.round(filesize * 0.55),
          filename: `${cleanFilename}-1024x${Math.round((1024 / width) * height)}.${mimeType.split('/')[1] || 'webp'}`
        },
        full: {
          url: baseUrl,
          width,
          height,
          mimeType,
          filesize,
          filename: data.filename
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mediaDb.set(id, mediaDoc);

    // Lifecycle hook: afterChange
    this.logHookExecution(
      'media',
      'afterChange',
      'create',
      id,
      8,
      'success',
      `Media document registered and responsive size derivatives generated for "${data.filename}".`
    );

    return mediaDoc;
  },

  deleteMedia(id: string): boolean {
    const existing = mediaDb.get(id);
    if (!existing) return false;

    // Lifecycle hook: beforeDelete
    this.logHookExecution(
      'media',
      'beforeDelete',
      'delete',
      id,
      4,
      'success',
      `Checking document attachments and references for media "${existing.filename}".`
    );

    mediaDb.delete(id);

    // Lifecycle hook: afterDelete
    this.logHookExecution(
      'media',
      'afterDelete',
      'delete',
      id,
      5,
      'success',
      `Purged asset "${existing.filename}" and its responsive image size derivatives.`
    );

    return true;
  },

  // --- BULK OPERATIONS ENGINE ---
  bulkUpdateProductPrices(params: {
    percentageChange?: number;
    fixedAdjustment?: number;
    categorySlug?: string;
    status?: string;
  }): PayloadBulkOperationResult {
    const { percentageChange = 0, fixedAdjustment = 0, categorySlug, status = 'published' } = params;
    const modifiedIds: string[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    const allProducts = Array.from(productsDb.values());

    for (const prod of allProducts) {
      if (status && prod.status !== status) continue;
      if (categorySlug && prod.category.slug !== categorySlug && String(prod.category.id) !== categorySlug) continue;

      try {
        let currentPrice = prod.numericPrice;
        if (percentageChange !== 0) {
          currentPrice = currentPrice * (1 + percentageChange / 100);
        }
        if (fixedAdjustment !== 0) {
          currentPrice = currentPrice + fixedAdjustment;
        }
        const updatedPrice = Math.max(0.01, Number(currentPrice.toFixed(2)));

        prod.numericPrice = updatedPrice;
        prod.price = updatedPrice;
        prod.updatedAt = new Date().toISOString();

        productsDb.set(prod.id, prod);
        if (prod.slug) productsDb.set(prod.slug, prod);
        modifiedIds.push(prod.id);
      } catch (err: any) {
        errors.push({ id: prod.id, error: err.message || 'Failed to recalculate price' });
      }
    }

    this.logHookExecution(
      'products',
      'afterOperation',
      'update',
      undefined,
      15,
      errors.length === 0 ? 'success' : 'warn',
      `Bulk price adjustment executed across ${modifiedIds.length} catalog items (${percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`}).`
    );

    return {
      success: errors.length === 0,
      totalCount: modifiedIds.length + errors.length,
      modifiedCount: modifiedIds.length,
      affectedCount: modifiedIds.length,
      affectedIds: modifiedIds,
      errors,
      message: `Adjusted prices for ${modifiedIds.length} items.`
    };
  },

  bulkUpdateOrderStatus(params: {
    orderIds: string[];
    fulfillmentStatus?: PayloadOrderDoc['fulfillmentStatus'];
    paymentStatus?: PayloadOrderDoc['paymentStatus'];
  }): PayloadBulkOperationResult {
    const { orderIds = [], fulfillmentStatus, paymentStatus } = params;
    const modifiedIds: string[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const id of orderIds) {
      const order = this.findOrderById(id);
      if (!order) {
        errors.push({ id, error: 'Order not found' });
        continue;
      }

      try {
        if (fulfillmentStatus) {
          this.updateOrderStatus(order.id, fulfillmentStatus);
        }
        if (paymentStatus) {
          order.paymentStatus = paymentStatus;
          order.updatedAt = new Date().toISOString();
          ordersDb.set(order.id, order);
          ordersDb.set(order.orderNumber, order);
        }
        modifiedIds.push(order.id);
      } catch (err: any) {
        errors.push({ id, error: err.message });
      }
    }

    this.logHookExecution(
      'orders',
      'afterOperation',
      'update',
      undefined,
      12,
      errors.length === 0 ? 'success' : 'warn',
      `Bulk order transition executed across ${modifiedIds.length} orders.`
    );

    return {
      success: errors.length === 0,
      totalCount: orderIds.length,
      modifiedCount: modifiedIds.length,
      affectedCount: modifiedIds.length,
      affectedIds: modifiedIds,
      errors,
      message: `Updated status for ${modifiedIds.length} orders.`
    };
  },

  bulkDeleteDrafts(): PayloadBulkOperationResult {
    const drafts = Array.from(productsDb.values()).filter(p => p.status === 'draft');
    const modifiedIds: string[] = [];

    for (const d of drafts) {
      productsDb.delete(d.id);
      if (d.slug) productsDb.delete(d.slug);
      modifiedIds.push(d.id);
    }

    this.logHookExecution(
      'products',
      'afterOperation',
      'delete',
      undefined,
      8,
      'success',
      `Purged ${modifiedIds.length} draft product documents from catalog collection.`
    );

    return {
      success: true,
      totalCount: drafts.length,
      modifiedCount: modifiedIds.length,
      affectedCount: modifiedIds.length,
      affectedIds: modifiedIds,
      errors: [],
      message: `Purged ${modifiedIds.length} draft documents.`
    };
  },

  // --- FORM BUILDER PLUGIN (PAYLOAD 3.88) ---
  findForms(): PayloadFormDoc[] {
    return Array.from(formsDb.values());
  },

  findFormById(idOrSlug: string): PayloadFormDoc | null {
    if (!idOrSlug) return null;
    const direct = formsDb.get(idOrSlug);
    if (direct) return direct;
    return Array.from(formsDb.values()).find(f => f.slug === idOrSlug) || null;
  },

  saveForm(formData: Partial<PayloadFormDoc> & { title: string; fields: any[] }): PayloadFormDoc {
    const isNew = !formData.id || !formsDb.has(formData.id);
    const id = formData.id || `form-${Date.now()}`;
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const doc: PayloadFormDoc = {
      id,
      title: formData.title,
      slug,
      fields: formData.fields || [],
      submitButtonLabel: formData.submitButtonLabel || 'Submit',
      confirmationType: formData.confirmationType || 'message',
      confirmationMessage: formData.confirmationMessage || 'Thank you. Your submission has been received.',
      redirectUrl: formData.redirectUrl,
      emails: formData.emails || [],
      createdAt: (isNew ? new Date() : new Date(formsDb.get(id)?.createdAt || Date.now())).toISOString(),
      updatedAt: new Date().toISOString()
    };

    formsDb.set(id, doc);

    this.logHookExecution(
      'forms',
      'afterChange',
      isNew ? 'create' : 'update',
      id,
      6,
      'success',
      `Form schema "${doc.title}" persisted with ${doc.fields.length} dynamic input blocks.`
    );

    return doc;
  },

  deleteForm(id: string): boolean {
    const existing = formsDb.get(id);
    if (!existing) return false;
    formsDb.delete(id);

    this.logHookExecution(
      'forms',
      'afterDelete',
      'delete',
      id,
      4,
      'success',
      `Deleted form definition "${existing.title}".`
    );

    return true;
  },

  submitForm(formId: string, submissionData: Record<string, any>, ipAddress?: string): { success: boolean; submission: PayloadFormSubmissionDoc; form: PayloadFormDoc } {
    const form = this.findFormById(formId);
    if (!form) {
      throw new Error(`Form not found for identifier: ${formId}`);
    }

    // Validate required fields
    for (const field of form.fields) {
      if (field.required) {
        const val = submissionData[field.name];
        if (val === undefined || val === null || val === '') {
          throw new Error(`Field "${field.label || field.name}" is required.`);
        }
      }
    }

    const subId = `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const submission: PayloadFormSubmissionDoc = {
      id: subId,
      formId: form.id,
      formTitle: form.title,
      submissionData,
      submittedAt: new Date().toISOString(),
      ipAddress: ipAddress || '127.0.0.1',
      status: 'new'
    };

    formSubmissionsDb.set(subId, submission);

    this.logHookExecution(
      'form-submissions',
      'afterChange',
      'create',
      subId,
      9,
      'success',
      `Captured incoming submission for form "${form.title}" from ${submissionData.email || submissionData.emailAddress || 'client'}.`
    );

    return {
      success: true,
      submission,
      form
    };
  },

  getFormSubmissions(formId?: string, limit: number = 50): PayloadFormSubmissionDoc[] {
    let subs = Array.from(formSubmissionsDb.values());
    if (formId) {
      subs = subs.filter(s => s.formId === formId);
    }
    subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return subs.slice(0, limit);
  },

  // --- REDIRECTS PLUGIN (PAYLOAD 3.88) ---
  findRedirects(): PayloadRedirectDoc[] {
    return Array.from(redirectsDb.values());
  },

  saveRedirect(data: { id?: string; from: string; to: { type: 'custom' | 'reference'; url?: string; reference?: any }; statusCode?: 301 | 302 }): PayloadRedirectDoc {
    const isNew = !data.id || !redirectsDb.has(data.id);
    const id = data.id || `red-${Date.now()}`;

    const doc: PayloadRedirectDoc = {
      id,
      from: data.from.startsWith('/') ? data.from : `/${data.from}`,
      to: data.to,
      statusCode: data.statusCode || 301,
      createdAt: (isNew ? new Date() : new Date(redirectsDb.get(id)?.createdAt || Date.now())).toISOString(),
      updatedAt: new Date().toISOString()
    };

    redirectsDb.set(id, doc);

    this.logHookExecution(
      'redirects',
      'afterChange',
      isNew ? 'create' : 'update',
      id,
      4,
      'success',
      `Registered HTTP ${doc.statusCode} redirect from "${doc.from}" -> "${doc.to.url || doc.to.reference?.value}".`
    );

    return doc;
  },

  deleteRedirect(id: string): boolean {
    const existing = redirectsDb.get(id);
    if (!existing) return false;
    redirectsDb.delete(id);

    this.logHookExecution(
      'redirects',
      'afterDelete',
      'delete',
      id,
      3,
      'success',
      `Removed redirect rule from "${existing.from}".`
    );

    return true;
  },

  lookupRedirect(pathname: string): PayloadRedirectDoc | null {
    if (!pathname) return null;
    const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    for (const r of redirectsDb.values()) {
      if (r.from.toLowerCase() === cleanPath.toLowerCase()) {
        return r;
      }
    }
    return null;
  },

  // --- SEO PLUGIN & GLOBAL METADATA (PAYLOAD 3.88) ---
  getSEOSettings(): PayloadSEOSettings {
    return { ...seoSettingsState };
  },

  updateSEOSettings(patch: Partial<PayloadSEOSettings>): PayloadSEOSettings {
    seoSettingsState = {
      ...seoSettingsState,
      ...patch
    };

    this.logHookExecution(
      'globals',
      'afterChange',
      'update',
      'seo-settings',
      5,
      'success',
      `Updated Payload 3.88 SEO meta templates and structured data rules.`
    );

    return { ...seoSettingsState };
  }
};
