export interface GradientPreset {
  name: string;
  value: string;
}

export interface ImagePreset {
  name: string;
  url: string;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  { name: 'Ocean Breeze', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
  { name: 'Cyberpunk Neon', value: 'linear-gradient(135deg, #f107a3 0%, #7b2ff7 100%)' },
  { name: 'Emerald Forest', value: 'linear-gradient(135deg, #051937 0%, #004d7a 40%, #008793 70%, #00bf72 100%)' },
  { name: 'Warm Sunset', value: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)' },
  { name: 'Deep Space', value: 'linear-gradient(135deg, #000000 0%, #150050 45%, #3f0071 85%, #610094 100%)' },
  { name: 'Minimal Charcoal', value: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' },
  { name: 'Misty Blue', value: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)' },
  { name: 'Solaris Flare', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' }
];

export const IMAGE_PRESETS: ImagePreset[] = [
  { name: 'Modern Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop&fm=webp' },
  { name: 'Minimal Workspace', url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1400&auto=format&fit=crop&fm=webp' },
  { name: 'Abstract Wavy Mesh', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1400&auto=format&fit=crop&fm=webp' },
  { name: 'Lush Forest Foliage', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1400&auto=format&fit=crop&fm=webp' },
  { name: 'Cosmic Sky', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1400&auto=format&fit=crop&fm=webp' },
  { name: 'Abstract Light Lines', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1400&auto=format&fit=crop&fm=webp' }
];

export const ANIMATION_TYPES = [
  { value: 'fadeInUp', label: 'Fade In Up (Smooth Lift)' },
  { value: 'slideInLeft', label: 'Slide In Left (Dynamic Swipe)' },
  { value: 'zoomIn', label: 'Zoom In (Elegant Pop)' },
  { value: 'fadeIn', label: 'Fade In (Classic)' }
];

import { MockProduct, SlideConfig, VendorOffer, VendorApplication, SellerAccount, UserProfile, VendorProductSubmission } from '../types';

export interface MockCategoryPreset {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  icon?: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'prod-1',
    name: 'Premium Wireless Headphones',
    price: 'R1,999.00',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop&fm=webp',
    url: '/product/premium-wireless-headphones',
    brand: 'Nova',
    brandId: 2,
    categoryId: 2,
    tags: ['Audio', 'Wireless', 'Noise Cancelling', 'Bluetooth 5.3', 'Premium Gadgets'],
    description: 'High-fidelity acoustic drivers, active noise cancellation, and lightweight plush ergonomic memory foam cushions.',
    primarySellerId: '592834',
    primarySellerName: 'Apex Tech Direct',
    offers: [
      {
        offerId: 'off-101',
        sellerId: '592834',
        sellerName: 'Apex Tech Direct',
        price: 1899,
        originalPrice: 1999,
        stockCount: 12,
        condition: 'Brand New',
        shippingDays: 2,
        rating: 4.8,
        reviewsCount: 64,
        isFeatured: true
      },
      {
        offerId: 'off-102',
        sellerId: '849201',
        sellerName: 'Nova Official Store',
        price: 1999,
        stockCount: 45,
        condition: 'Brand New',
        shippingDays: 2,
        rating: 4.9,
        reviewsCount: 182
      },
      {
        offerId: 'off-103',
        sellerId: '710492',
        sellerName: 'Cape Audio & Gadgets',
        price: 1650,
        originalPrice: 1999,
        stockCount: 5,
        condition: 'Like New',
        shippingDays: 4,
        rating: 4.6,
        reviewsCount: 29,
        notes: 'Opened box return, verified by tech team with full 12-month warranty.'
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Minimalist White Watch',
    price: 'R1,499.00',
    originalPrice: 'R1,899.00',
    isSale: true,
    saleBadgeText: '20% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop&fm=webp',
    url: '/product/minimalist-white-watch',
    brand: 'Reddison',
    brandId: 1,
    categoryId: 3,
    tags: ['Watches', 'Minimalist', 'Italian Leather', 'Luxury', 'Surgical Steel'],
    description: 'Ultra-thin surgical stainless steel case with genuine Italian leather strap and scratch-resistant sapphire crystal.',
    primarySellerId: '592834',
    primarySellerName: 'Apex Tech Direct',
    offers: [
      {
        offerId: 'off-201',
        sellerId: '592834',
        sellerName: 'Apex Tech Direct',
        price: 1399,
        originalPrice: 1899,
        stockCount: 7,
        condition: 'Brand New',
        shippingDays: 3,
        rating: 4.8,
        reviewsCount: 43,
        isFeatured: true
      },
      {
        offerId: 'off-202',
        sellerId: '385920',
        sellerName: 'Sandton Timepieces SA',
        price: 1499,
        originalPrice: 1899,
        stockCount: 18,
        condition: 'Brand New',
        shippingDays: 2,
        rating: 4.9,
        reviewsCount: 91
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Retro Film Camera',
    price: 'R2,999.00',
    originalPrice: 'R3,499.00',
    isSale: true,
    saleBadgeText: 'SALE',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=600&auto=format&fit=crop&fm=webp',
    url: '/product/retro-film-camera',
    brand: 'Wetell',
    brandId: 4,
    categoryId: 2,
    tags: ['Vintage', 'Photography', '35mm Film', 'Analog', 'Collector Edition'],
    description: 'Classic analog mechanical rangefinder with 35mm fixed prime lens and vintage tactical brass shutter dials.',
    primarySellerId: '710492',
    primarySellerName: 'Cape Audio & Gadgets',
    offers: [
      {
        offerId: 'off-301',
        sellerId: '710492',
        sellerName: 'Cape Audio & Gadgets',
        price: 2750,
        originalPrice: 3499,
        stockCount: 3,
        condition: 'Refurbished',
        shippingDays: 3,
        rating: 4.7,
        reviewsCount: 18,
        notes: 'Factory recertified mint condition with pristine optical lens elements.'
      },
      {
        offerId: 'off-302',
        sellerId: '924183',
        sellerName: 'Joburg Camera Exchange',
        price: 2999,
        originalPrice: 3499,
        stockCount: 8,
        condition: 'Brand New',
        shippingDays: 2,
        rating: 4.9,
        reviewsCount: 52,
        isFeatured: true
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Smart Thermal Bottle',
    price: 'R450.00',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop&fm=webp',
    url: '/product/smart-thermal-bottle',
    brand: 'Apex Labs',
    brandId: 6,
    categoryId: 3,
    tags: ['Smart Tech', 'Hydration', 'Thermal LED', 'Eco-Friendly', 'BPA Free'],
    description: 'Double-wall vacuum insulated stainless steel flask with integrated digital touch LED lid for live liquid temperature tracking.',
    primarySellerId: '849201',
    primarySellerName: 'Nova Official Store',
    offers: [
      {
        offerId: 'off-401',
        sellerId: '849201',
        sellerName: 'Nova Official Store',
        price: 420,
        originalPrice: 450,
        stockCount: 25,
        condition: 'Brand New',
        shippingDays: 2,
        rating: 4.8,
        reviewsCount: 35
      },
      {
        offerId: 'off-402',
        sellerId: '592834',
        sellerName: 'Apex Tech Direct',
        price: 450,
        stockCount: 60,
        condition: 'Brand New',
        shippingDays: 2,
        rating: 4.9,
        reviewsCount: 110,
        isFeatured: true
      }
    ]
  },
  {
    id: 'prod-5',
    name: 'Designer Retro Sunglasses',
    price: 'R890.00',
    originalPrice: 'R1,200.00',
    isSale: true,
    saleBadgeText: 'HOT DEAL',
    imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=600&auto=format&fit=crop&fm=webp',
    url: '/product/designer-retro-sunglasses',
    brand: 'Condere',
    brandId: 3,
    categoryId: 4,
    tags: ['Eyewear', 'Polarized', 'UV400', 'Italian Acetate', 'Summer Essentials'],
    description: 'Handcrafted Italian acetate frames with 100% UV400 polarized anti-reflective lenses for crisp visual clarity.',
    primarySellerId: '461952',
    primarySellerName: 'Durban Optical Hub',
    offers: [
      {
        offerId: 'off-501',
        sellerId: '461952',
        sellerName: 'Durban Optical Hub',
        price: 820,
        originalPrice: 1200,
        stockCount: 6,
        condition: 'Brand New',
        shippingDays: 3,
        rating: 4.7,
        reviewsCount: 21
      },
      {
        offerId: 'off-502',
        sellerId: '385920',
        sellerName: 'Sandton Timepieces SA',
        price: 890,
        originalPrice: 1200,
        stockCount: 14,
        condition: 'Brand New',
        shippingDays: 2,
        rating: 4.8,
        reviewsCount: 47,
        isFeatured: true
      }
    ]
  },
  {
    id: 'prod-6',
    name: 'Premium Leather Sneakers',
    price: 'R1,250.00',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop&fm=webp',
    url: '/product/premium-leather-sneakers',
    brand: 'Sunlight',
    brandId: 5,
    categoryId: 4,
    tags: ['Footwear', 'Full-Grain Leather', 'Casual Chic', 'Craftsmanship', 'Memory Foam'],
    description: 'Hand-burnished full-grain calfskin leather low-top sneakers featuring cushioned memory insoles and stitched rubber outsoles.',
    primarySellerId: '849201',
    primarySellerName: 'Nova Official Store',
    offers: [
      {
        offerId: 'off-601',
        sellerId: '849201',
        sellerName: 'Nova Official Store',
        price: 1199,
        originalPrice: 1250,
        stockCount: 9,
        condition: 'Brand New',
        shippingDays: 3,
        rating: 4.8,
        reviewsCount: 30
      },
      {
        offerId: 'off-602',
        sellerId: '638205',
        sellerName: 'Artisan Footwear ZA',
        price: 1250,
        stockCount: 22,
        condition: 'Brand New',
        shippingDays: 2,
        rating: 4.9,
        reviewsCount: 88,
        isFeatured: true
      }
    ]
  }
];

export const INITIAL_SELLER_ACCOUNTS: SellerAccount[] = [
  {
    id: '849201',
    userId: 'usr-seller-01',
    storeName: 'Nova Official Store',
    contactName: 'Liam Botha',
    contactEmail: 'liam@novaofficial.co.za',
    phone: '+27 82 459 1029',
    accountType: 'sa_business',
    taxOrRegistrationId: '2019/482910/07',
    description: 'Direct manufacturer and licensed distributor for Nova acoustics, studio electronics, and audio accessories in South Africa. Guaranteed authentic with official manufacturer warranties.',
    logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop',
    location: 'Cape Town, Western Cape',
    dispatchSla: 'Same-day to 1 business day',
    returnPolicyDays: 30,
    verifiedBadgeText: 'Official Brand Partner',
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
  },
  {
    id: '592834',
    userId: 'usr-seller-02',
    storeName: 'Apex Tech Direct',
    contactName: 'Amara Khumalo',
    contactEmail: 'amara@apextech.co.za',
    phone: '+27 71 883 4019',
    accountType: 'sa_business',
    taxOrRegistrationId: '2021/399102/07',
    description: 'Premier supplier of consumer technology, smart home essentials, and wireless computing devices across Southern Africa. Express dispatch from our Johannesburg fulfillment center.',
    logoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    location: 'Midrand, Gauteng',
    dispatchSla: '1 - 2 business days',
    returnPolicyDays: 30,
    verifiedBadgeText: 'Top Rated Tech Merchant',
    status: 'active',
    rating: 4.8,
    totalSales: 98200,
    ordersCount: 56,
    activeListingsCount: 14,
    commissionRate: 10,
    joinedDate: 'Mar 2025',
    bankDetails: {
      bankName: 'Standard Bank',
      accountNumber: '10148829102',
      branchCode: '051001',
      accountHolder: 'Apex Tech Direct CC',
      accountType: 'Current'
    }
  },
  {
    id: '710492',
    userId: 'usr-seller-03',
    storeName: 'Cape Audio & Gadgets',
    contactName: 'Gareth van der Merwe',
    contactEmail: 'gareth@capeaudio.co.za',
    phone: '+27 83 291 0944',
    accountType: 'sole_proprietor',
    taxOrRegistrationId: '9840291039088',
    description: 'Boutique audiovisual specialists dealing in certified refurbished cameras, analog gear, and studio sound equipment. Each unit is rigorously bench-tested by certified sound engineers.',
    logoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop',
    location: 'Stellenbosch, Western Cape',
    dispatchSla: '2 - 3 business days',
    returnPolicyDays: 14,
    verifiedBadgeText: 'Certified Refurbisher',
    status: 'active',
    rating: 4.6,
    totalSales: 34100,
    ordersCount: 19,
    activeListingsCount: 8,
    commissionRate: 10,
    joinedDate: 'May 2025',
    bankDetails: {
      bankName: 'Nedbank',
      accountNumber: '1987391028',
      branchCode: '198765',
      accountHolder: 'G van der Merwe',
      accountType: 'Savings'
    }
  },
  {
    id: '385920',
    userId: 'usr-seller-04',
    storeName: 'Sandton Timepieces SA',
    contactName: 'Thabo Mokoena',
    contactEmail: 'thabo@sandtontime.co.za',
    phone: '+27 11 902 4410',
    accountType: 'sa_business',
    taxOrRegistrationId: '2018/109283/07',
    description: 'Luxury horology boutique based in Sandton City, providing certified authentic watches, fine leather accessories, and optical sunglasses with certificates of authenticity.',
    logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop',
    location: 'Sandton, Johannesburg',
    dispatchSla: '1 - 2 business days',
    returnPolicyDays: 30,
    verifiedBadgeText: 'Luxury Goods Certified',
    status: 'active',
    rating: 4.9,
    totalSales: 215000,
    ordersCount: 42,
    activeListingsCount: 11,
    commissionRate: 12,
    joinedDate: 'Nov 2024',
    bankDetails: {
      bankName: 'Investec Private Bank',
      accountNumber: '1001928374',
      branchCode: '580105',
      accountHolder: 'Sandton Timepieces Pty Ltd',
      accountType: 'Corporate'
    }
  },
  {
    id: '924183',
    userId: 'usr-seller-05',
    storeName: 'Joburg Camera Exchange',
    contactName: 'Kagiso Dlamini',
    contactEmail: 'kagiso@joburgcamera.co.za',
    phone: '+27 11 482 9910',
    accountType: 'sa_business',
    taxOrRegistrationId: '2020/554812/07',
    description: 'South Africa’s premier community hub for vintage photographic equipment, 35mm rangefinders, medium format bodies, and premium accessories.',
    logoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=1200&auto=format&fit=crop',
    location: 'Rosebank, Johannesburg',
    dispatchSla: '1 - 2 business days',
    returnPolicyDays: 30,
    verifiedBadgeText: 'Camera Guild Verified',
    status: 'active',
    rating: 4.9,
    totalSales: 89400,
    ordersCount: 31,
    activeListingsCount: 9,
    commissionRate: 10,
    joinedDate: 'Jul 2024',
    bankDetails: {
      bankName: 'Capitec Business',
      accountNumber: '1092847291',
      branchCode: '470010',
      accountHolder: 'Joburg Camera Exchange Pty Ltd',
      accountType: 'Current'
    }
  },
  {
    id: '461952',
    userId: 'usr-seller-06',
    storeName: 'Durban Optical Hub',
    contactName: 'Farhana Patel',
    contactEmail: 'farhana@durbanoptics.co.za',
    phone: '+27 84 920 1192',
    accountType: 'sa_business',
    taxOrRegistrationId: '2022/991029/07',
    description: 'Specialist eyewear distributors with official manufacturer partnerships for polarized sports and fashion sunglasses, UV protective optics, and designer eyewear.',
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1200&auto=format&fit=crop',
    location: 'Umhlanga, Durban',
    dispatchSla: '2 - 3 business days',
    returnPolicyDays: 30,
    verifiedBadgeText: 'Authorized Optical Partner',
    status: 'active',
    rating: 4.7,
    totalSales: 54200,
    ordersCount: 26,
    activeListingsCount: 7,
    commissionRate: 10,
    joinedDate: 'Aug 2024',
    bankDetails: {
      bankName: 'First National Bank (FNB)',
      accountNumber: '62991028471',
      branchCode: '250655',
      accountHolder: 'Durban Optical Hub CC',
      accountType: 'Business Cheque'
    }
  },
  {
    id: '638205',
    userId: 'usr-seller-07',
    storeName: 'Artisan Footwear ZA',
    contactName: 'Pieter Erasmus',
    contactEmail: 'pieter@artisanfootwear.co.za',
    phone: '+27 72 401 8832',
    accountType: 'sole_proprietor',
    taxOrRegistrationId: '8904125029081',
    description: 'Handcrafted genuine leather shoes, sneakers, and bespoke accessories created in South Africa with vegetable-tanned full-grain leather and timeless artisanal stitching.',
    logoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1200&auto=format&fit=crop',
    location: 'Franschhoek, Western Cape',
    dispatchSla: '1 - 2 business days',
    returnPolicyDays: 30,
    verifiedBadgeText: 'Master Artisan Guild',
    status: 'active',
    rating: 4.9,
    totalSales: 112000,
    ordersCount: 49,
    activeListingsCount: 12,
    commissionRate: 8,
    joinedDate: 'Feb 2025',
    bankDetails: {
      bankName: 'Standard Bank',
      accountNumber: '1098273618',
      branchCode: '051001',
      accountHolder: 'P Erasmus Artisan',
      accountType: 'Current'
    }
  }
];

export const INITIAL_VENDOR_APPLICATIONS: VendorApplication[] = [
  {
    id: 'app-901',
    userId: 'usr-applicant-01',
    accountType: 'sa_business',
    storeName: 'Durban Optical Hub',
    contactName: 'Farhana Patel',
    contactEmail: 'farhana@durbanoptics.co.za',
    phone: '+27 84 920 1192',
    taxOrRegistrationId: '2022/991029/07',
    description: 'Specialist eyewear distributors with official manufacturer partnerships for polarized sports and fashion sunglasses.',
    status: 'approved',
    createdAt: '2026-08-15T10:30:00.000Z',
    reviewedAt: '2026-08-16T14:20:00.000Z',
    reviewedBy: 'Alexander Vance (Admin)',
    documents: [
      {
        name: 'CIPC_Registration_Certificate_2022.pdf',
        size: '1.4 MB',
        type: 'cipc_certificate',
        uploadedAt: '2026-08-15T10:28:00.000Z'
      },
      {
        name: 'SARS_Tax_Clearance_Pin.pdf',
        size: '420 KB',
        type: 'other',
        uploadedAt: '2026-08-15T10:29:00.000Z'
      }
    ]
  },
  {
    id: 'app-902',
    userId: 'usr-applicant-02',
    accountType: 'sole_proprietor',
    storeName: 'Protea Leather Works',
    contactName: 'Pieter Erasmus',
    contactEmail: 'pieter@protealeather.co.za',
    phone: '+27 72 401 8832',
    taxOrRegistrationId: '8904125029081',
    description: 'Handcrafted genuine leather wallets, belts, and bespoke footwear handcrafted in the Western Cape Winelands.',
    status: 'pending_approval',
    createdAt: '2026-08-28T09:15:00.000Z',
    documents: [
      {
        name: 'South_African_ID_SmartCard_PErasmus.pdf',
        size: '890 KB',
        type: 'sa_id_passport',
        uploadedAt: '2026-08-28T09:12:00.000Z'
      },
      {
        name: 'WesternCape_Proof_Of_Address.pdf',
        size: '610 KB',
        type: 'proof_of_address',
        uploadedAt: '2026-08-28T09:14:00.000Z'
      }
    ]
  },
  {
    id: 'app-903',
    userId: 'usr-applicant-03',
    accountType: 'sa_business',
    storeName: 'SolarPower & Gadgets SA',
    contactName: 'Nandi Sithole',
    contactEmail: 'nandi@solargadgets.co.za',
    phone: '+27 60 552 1980',
    taxOrRegistrationId: '2024/110294/07',
    description: 'Supplying portable power stations, solar charging hubs, and emergency lighting solutions for South African households.',
    status: 'pending_approval',
    createdAt: '2026-08-29T16:45:00.000Z',
    documents: [
      {
        name: 'CIPC_COR14.3_Certificate_2024.pdf',
        size: '2.1 MB',
        type: 'cipc_certificate',
        uploadedAt: '2026-08-29T16:40:00.000Z'
      }
    ]
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr-admin-01',
    name: 'Alexander Sterling',
    email: 'admin@mrbulk.co.za',
    role: 'admin',
    status: 'active',
    totalOrders: 28,
    totalSpent: 45200,
    joinedDate: 'Jan 2024',
    lastActive: 'Just now'
  },
  {
    id: 'usr-seller-01',
    name: 'Liam Botha (Nova Store)',
    email: 'liam@novaofficial.co.za',
    role: 'seller',
    sellerId: '849201',
    status: 'active',
    totalOrders: 6,
    totalSpent: 12400,
    joinedDate: 'Jan 2025',
    lastActive: 'Just now'
  },
  {
    id: 'usr-vip-02',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@lifestyle.co.za',
    role: 'customer',
    status: 'vip',
    totalOrders: 14,
    totalSpent: 18950,
    joinedDate: 'Mar 2024',
    lastActive: '2 hours ago'
  },
  {
    id: 'usr-cust-03',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    status: 'active',
    totalOrders: 3,
    totalSpent: 3450,
    joinedDate: 'Jun 2024',
    lastActive: 'Yesterday'
  }
];

export const MOCK_WOO_PRODUCTS = MOCK_PRODUCTS;

export const MOCK_CATEGORIES: MockCategoryPreset[] = [
  { 
    id: 1, 
    name: 'Sale Items', 
    imageUrl: 'https://hyper-theme-demo.myshopify.com/cdn/shop/files/collection-sales.webp?v=1735029716&width=800',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FEF2F2"/><path d="M30 25h25L80 50 55 75 30 50V25z" fill="none" stroke="%23EF4444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="42" cy="37" r="4" fill="%23EF4444"/><path d="M48 58l8-8M48 50l8 8" stroke="%23EF4444" stroke-width="3.5" stroke-linecap="round"/></svg>'
  },
  { 
    id: 2, 
    name: 'Electronics', 
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23EFF6FF"/><rect x="25" y="30" width="50" height="32" rx="4" fill="none" stroke="%232563EB" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 62h60M40 62v8M60 62v8M35 70h30" stroke="%232563EB" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  { 
    id: 3, 
    name: 'Home & Kitchen', 
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FFFBEB"/><path d="M25 45L50 25l25 20v30a5 5 0 0 1-5 5H30a5 5 0 0 1-5-5V45z" fill="none" stroke="%23D97706" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 80V55h16v25" stroke="%23D97706" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  { 
    id: 4, 
    name: 'Apparel & Fashion', 
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23F5F3FF"/><path d="M50 35a7 7 0 1 1-7-7" fill="none" stroke="%237C3AED" stroke-width="4" stroke-linecap="round"/><path d="M20 62l27-18a5 5 0 0 1 6 0l27 18c2 1 1 4-2 4H22c-3 0-4-3-2-4z" fill="none" stroke="%237C3AED" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  { 
    id: 5, 
    name: 'Personal Care & Wellness', 
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FDF2F8"/><path d="M35 45h30v25c0 5-4 9-9 9H44c-5 0-9-4-9-9V45z" fill="none" stroke="%23DB2777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 45v-10a4 4 0 0 1 8 0v10" stroke="%23DB2777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 30h40" stroke="%23DB2777" stroke-width="4" stroke-linecap="round"/></svg>'
  },
  { 
    id: 10, 
    name: 'Beauty & Accessories', 
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FCE7F3"/><path d="M38 75h24M50 75V55" stroke="%23DB2777" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="38" r="15" fill="none" stroke="%23DB2777" stroke-width="4"/><path d="M42 38a8 8 0 0 1 8-8" stroke="%23DB2777" stroke-width="2" stroke-linecap="round"/></svg>'
  },
  { 
    id: 11, 
    name: 'Pest Control', 
    imageUrl: 'https://images.unsplash.com/photo-1587334206496-114272446ecd?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FFF1F2"/><circle cx="50" cy="50" r="22" fill="none" stroke="%23E11D48" stroke-width="4"/><path d="M34 34l32 32" stroke="%23E11D48" stroke-width="4" stroke-linecap="round"/><path d="M45 42a5 5 0 1 1 10 0v16a5 5 0 1 1-10 0V42z" fill="none" stroke="%23E11D48" stroke-width="3"/><path d="M38 45h6M56 45h6M38 55h6M56 55h6" stroke="%23E11D48" stroke-width="3" stroke-linecap="round"/></svg>'
  },
  {
    id: 12,
    name: 'Automotive',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23F1F5F9"/><circle cx="50" cy="50" r="25" fill="none" stroke="%23334155" stroke-width="5"/><circle cx="50" cy="50" r="10" fill="none" stroke="%23334155" stroke-width="4"/><path d="M50 15v10M50 75v10M15 50h10M75 50h10" stroke="%23334155" stroke-width="4" stroke-linecap="round"/></svg>'
  },
  {
    id: 13,
    name: 'Stationery & Office',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23ECFDF5"/><path d="M30 30h40v45H30z" fill="none" stroke="%23047857" stroke-width="4" stroke-linejoin="round"/><path d="M40 45h20M40 55h20M40 65h10" stroke="%23047857" stroke-width="4" stroke-linecap="round"/><path d="M75 25L65 35M70 20l5 5" stroke="%23047857" stroke-width="4" stroke-linecap="round"/></svg>'
  },
  {
    id: 14,
    name: 'Appliances',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23EFF6FF"/><rect x="30" y="25" width="40" height="50" rx="5" fill="none" stroke="%231E40AF" stroke-width="4"/><path d="M30 48h40M45 35h10M50 60v10" stroke="%231E40AF" stroke-width="4" stroke-linecap="round"/></svg>'
  },
  {
    id: 15,
    name: 'Pet Supplies',
    imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FFFBEB"/><path d="M35 55c5-10 15-10 20 0s15 10 10 20-25 15-30 0-5-10 0-20z" fill="none" stroke="%23B45309" stroke-width="4"/><circle cx="35" cy="35" r="7" fill="%23B45309"/><circle cx="50" cy="27" r="7" fill="%23B45309"/><circle cx="65" cy="35" r="7" fill="%23B45309"/><circle cx="50" cy="55" r="8" fill="none" stroke="%23B45309" stroke-width="4"/></svg>'
  },
  { 
    id: 6, 
    name: 'Sports & Outdoors', 
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23ECFDF5"/><path d="M20 70l20-30 12 15 18-25 18 40H20z" fill="none" stroke="%23059669" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="75" cy="30" r="6" fill="none" stroke="%23059669" stroke-width="4"/></svg>'
  },
  { 
    id: 7, 
    name: 'Toys & Games', 
    imageUrl: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23F0F9FF"/><rect x="25" y="32" width="50" height="36" rx="10" fill="none" stroke="%230284C7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 50h10M43 45v10M62 47v.1M57 52v.1" stroke="%230284C7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  {
    id: 8,
    name: 'Tools & Hardware',
    imageUrl: 'https://images.unsplash.com/photo-1581147036324-c17da419a9a2?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23F0FDF4"/><path d="M35 65l25-25" stroke="%2316A34A" stroke-width="5" stroke-linecap="round"/><path d="M55 45l15-15a4 4 0 0 0 0-5.6l-5.6-5.6a4 4 0 0 0-5.6 0l-15 15" fill="none" stroke="%2316A34A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M45 23l12 12" stroke="%2316A34A" stroke-width="5"/></svg>'
  },
  {
    id: 9,
    name: 'Food & Groceries',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&fm=webp',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FEF2F2"/><path d="M50 38c-3-6-11-8-17-4a15 15 0 0 0-3 21c4 6 12 15 20 20 8-5 16-14 20-20a15 15 0 0 0-3-21c-6-4-14-2-17 4z" fill="none" stroke="%23EF4444" stroke-width="4.5" stroke-linejoin="round"/><path d="M50 38c0-6 4-12 10-14" stroke="%23EF4444" stroke-width="4" stroke-linecap="round"/><path d="M56 24c4 0 6 3 6 3s-3 3-6 3-6-3-6-3" fill="%23EF4444"/></svg>'
  }
];

export interface MockBrandPreset {
  id: number;
  name: string;
  imageUrl: string;
}

export const MOCK_BRANDS: MockBrandPreset[] = [
  { 
    id: 1, 
    name: 'Reddison', 
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80"><g transform="translate(10, 48)"><text x="0" y="0" font-family="%27Inter%27, %27Helvetica Neue%27, Arial, sans-serif" font-weight="900" font-size="32" fill="%230F172A" letter-spacing="-0.5">REDDISON</text><text x="172" y="-18" font-family="sans-serif" font-weight="bold" font-size="10" fill="%230F172A">®</text></g></svg>' 
  },
  { 
    id: 2, 
    name: 'Nova', 
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80"><ellipse cx="100" cy="40" rx="85" ry="30" fill="none" stroke="%231E1B4B" stroke-width="3" /><text x="100" y="47" text-anchor="middle" font-family="%27Inter%27, %27Helvetica Neue%27, Arial, sans-serif" font-weight="600" font-size="36" fill="%231E1B4B" letter-spacing="-1">nova</text><text x="146" y="28" font-family="sans-serif" font-weight="bold" font-size="8" fill="%231E1B4B">®</text><g transform="translate(100, 68)"><g transform="rotate(0)"><ellipse cx="0" cy="-8" rx="3.5" ry="8.5" fill="%23FFFFFF" stroke="%231E1B4B" stroke-width="1.5" /></g><g transform="rotate(45)"><ellipse cx="0" cy="-8" rx="3.5" ry="8.5" fill="%23FFFFFF" stroke="%231E1B4B" stroke-width="1.5" /></g><g transform="rotate(90)"><ellipse cx="0" cy="-8" rx="3.5" ry="8.5" fill="%23FFFFFF" stroke="%231E1B4B" stroke-width="1.5" /></g><g transform="rotate(135)"><ellipse cx="0" cy="-8" rx="3.5" ry="8.5" fill="%23FFFFFF" stroke="%231E1B4B" stroke-width="1.5" /></g><g transform="rotate(180)"><ellipse cx="0" cy="-8" rx="3.5" ry="8.5" fill="%23FFFFFF" stroke="%231E1B4B" stroke-width="1.5" /></g><g transform="rotate(225)"><ellipse cx="0" cy="-8" rx="3.5" ry="8.5" fill="%23FFFFFF" stroke="%231E1B4B" stroke-width="1.5" /></g><g transform="rotate(270)"><ellipse cx="0" cy="-8" rx="3.5" ry="8.5" fill="%23FFFFFF" stroke="%231E1B4B" stroke-width="1.5" /></g><g transform="rotate(315)"><ellipse cx="0" cy="-8" rx="3.5" ry="8.5" fill="%23FFFFFF" stroke="%231E1B4B" stroke-width="1.5" /></g><circle cx="0" cy="0" r="4.5" fill="%23DC2626" /></g></svg>' 
  },
  { 
    id: 3, 
    name: 'Condere', 
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80"><g transform="translate(15, 52)"><text x="0" y="0" font-family="%27Brush Script MT%27, %27Caveat%27, %27Playball%27, %27Lucida Handwriting%27, cursive" font-size="48" font-style="italic" font-weight="bold" fill="%23EF4444" letter-spacing="-0.5">Condere</text></g></svg>' 
  },
  { 
    id: 4, 
    name: 'Wetell', 
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80"><g transform="translate(15, 50) skewX(-12)"><text x="0" y="0" font-family="%27Impact%27, %27Arial Black%27, sans-serif" font-weight="900" font-size="40" fill="%23000000" letter-spacing="-1">WETELL</text></g><g transform="translate(168, 26)"><text font-family="sans-serif" font-weight="bold" font-size="10" fill="%23000000">®</text></g></svg>' 
  },
  { 
    id: 5, 
    name: 'Sunlight', 
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80"><g transform="translate(30, 40)"><circle cx="0" cy="0" r="14" fill="%23FBBF24" opacity="0.3" /><circle cx="0" cy="0" r="9" fill="%23F59E0B" /><path d="M0,-16 L0,-11 M0,11 L0,16 M-16,0 L-11,0 M11,0 L16,0 M-11,-11 L-8,-8 M8,8 L11,11 M-11,11 L-8,8 M8,-8 L11,-11" stroke="%23EA580C" stroke-width="2.5" stroke-linecap="round" /></g><text x="60" y="49" font-family="%27Arial Rounded MT Bold%27, %27Trebuchet MS%27, sans-serif" font-weight="900" font-size="30" fill="%231E3A8A">Sunlight</text></svg>' 
  },
  { 
    id: 6, 
    name: 'Apex Labs', 
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80"><g transform="translate(25, 40)"><polygon points="0,-16 14,12 -14,12" fill="none" stroke="%2316A34A" stroke-width="3" stroke-linejoin="round" /><polyline points="-6,0 0,-8 6,0" fill="none" stroke="%2316A34A" stroke-width="2.5" /></g><text x="60" y="47" font-family="%27Inter%27, system-ui, sans-serif" font-weight="800" font-size="22" fill="%230F172A" letter-spacing="-0.5">APEX LABS</text><text x="60" y="58" font-family="%27Inter%27, system-ui, sans-serif" font-weight="500" font-size="8" fill="%2364748B" letter-spacing="2.5">OUTDOOR</text></svg>' 
  }
];

export interface NavigationMenu {
  id: string;
  name: string;
  items: { name: string; url: string }[];
}

export const DEFAULT_SLIDES: SlideConfig[] = [
  {
    id: 1,
    title: "Explore Our Full Collection",
    subtitle: "Discover luxury furniture, modern electronics, and premium daily lifestyle essentials in our shop.",
    buttonText: "Explore Shop Page",
    buttonUrl: "shop",
    targetPage: "shop",
    backgroundType: "image",
    backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop&fm=webp",
    backgroundColor: "#1e1b4b",
    backgroundGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
    titleAnimation: "fadeInUp",
    subtitleAnimation: "fadeInUp",
    buttonStyle: "pill",
    buttonColor: "#2563eb",
    buttonTextColor: "#ffffff"
  },
  {
    id: 2,
    title: "Curated Product Categories",
    subtitle: "Find products organized by design styles, smart electronics, home décor, and top featured brands.",
    buttonText: "Browse Categories",
    buttonUrl: "categories",
    targetPage: "categories",
    backgroundType: "image",
    backgroundImage: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1400&auto=format&fit=crop&fm=webp",
    backgroundColor: "#051937",
    backgroundGradient: "linear-gradient(135deg, #051937 0%, #004d7a 40%, #008793 70%, #00bf72 100%)",
    titleAnimation: "slideInLeft",
    subtitleAnimation: "zoomIn",
    buttonStyle: "solid",
    buttonColor: "#10b981",
    buttonTextColor: "#ffffff"
  },
  {
    id: 3,
    title: "Shop Our Physical Flagship Store",
    subtitle: "Visit our showroom, get in touch with our dedicated team, or receive personalized interior consultations.",
    buttonText: "Contact & Store Location",
    buttonUrl: "contact",
    targetPage: "contact",
    backgroundType: "image",
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&auto=format&fit=crop&fm=webp",
    backgroundColor: "#065f46",
    backgroundGradient: "linear-gradient(135deg, #022c22 0%, #065f46 50%, #115e59 100%)",
    titleAnimation: "zoomIn",
    subtitleAnimation: "fadeIn",
    buttonStyle: "outline",
    buttonColor: "#ffffff",
    buttonTextColor: "#ffffff"
  }
];

export const INITIAL_PRODUCT_SUBMISSIONS: VendorProductSubmission[] = [
  {
    id: 'sub-701',
    sellerId: '849201',
    sellerName: 'Nova Official Store',
    sellerEmail: 'liam@novaofficial.co.za',
    name: 'Acoustic Sound ANC Pro Earbuds',
    brand: 'Nova Acoustics',
    categoryId: 2,
    categoryName: 'Tech & Audio',
    price: 1450,
    originalPrice: 1799,
    stockCount: 35,
    condition: 'Brand New',
    shippingDays: 2,
    description: 'True wireless stereo earbuds with active hybrid noise cancellation, dual beamforming microphones, and IPX5 water resistance.',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop&fm=webp',
    additionalImages: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop&fm=webp'
    ],
    tags: ['Audio', 'Earbuds', 'Wireless', 'ANC', 'Bluetooth 5.4'],
    sku: 'NOV-EAR-ANC-01',
    notes: 'Includes 12-month manufacturer direct warranty and sealed retail presentation box.',
    status: 'pending_approval',
    createdAt: '2026-08-29T14:30:00.000Z'
  },
  {
    id: 'sub-702',
    sellerId: '592834',
    sellerName: 'Apex Tech Direct',
    sellerEmail: 'amara@apextech.co.za',
    name: 'Aerospace Titanium Chronograph Watch',
    brand: 'Horology Works',
    categoryId: 3,
    categoryName: 'Watches & Jewelry',
    price: 3499,
    originalPrice: 4200,
    stockCount: 12,
    condition: 'Brand New',
    shippingDays: 1,
    description: 'Precision Japanese quartz movement housed in a lightweight brushed Grade 5 titanium chassis with anti-scratch sapphire crystal.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop&fm=webp',
    tags: ['Watches', 'Titanium', 'Luxury', 'Sapphire', 'Chronograph'],
    sku: 'APX-HORO-TITAN',
    notes: 'Certified authentic timepiece with warranty card included.',
    status: 'pending_approval',
    createdAt: '2026-08-30T10:15:00.000Z'
  }
];


