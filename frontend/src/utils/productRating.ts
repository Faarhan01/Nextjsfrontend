// Centralized Product Rating & Review helper
// Accurately computes ratings from real approved store reviews

export interface StoreReviewItem {
  id: string;
  productId: string;
  productName?: string;
  productImage?: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'spam';
  verifiedPurchase?: boolean;
  storeReply?: string;
  storeReplyDate?: string;
}

export const DEFAULT_STORE_REVIEWS: StoreReviewItem[] = [
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

export interface ProductRatingInfo {
  rating: number;
  reviewCount: number;
  ratingFormatted: string;
  hasReviews: boolean;
}

export function getProductRatingDetails(productOrId?: { id: string; rating?: number; reviewCount?: number } | string | null): ProductRatingInfo {
  if (!productOrId) {
    return { rating: 0, reviewCount: 0, ratingFormatted: '0.0', hasReviews: false };
  }

  const prodId = typeof productOrId === 'string' ? productOrId : productOrId?.id;
  if (!prodId) {
    return { rating: 0, reviewCount: 0, ratingFormatted: '0.0', hasReviews: false };
  }

  let realReviews: Array<{ productId: string; rating: number; status: string }> = [];

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('luxestore_admin_reviews');
      if (raw) {
        const all = JSON.parse(raw);
        if (Array.isArray(all)) {
          realReviews = all.filter((r: any) => r.productId === prodId && r.status === 'approved');
        }
      } else {
        realReviews = DEFAULT_STORE_REVIEWS.filter((r) => r.productId === prodId && r.status === 'approved');
      }
    } catch (e) {
      realReviews = DEFAULT_STORE_REVIEWS.filter((r) => r.productId === prodId && r.status === 'approved');
    }
  } else {
    realReviews = DEFAULT_STORE_REVIEWS.filter((r) => r.productId === prodId && r.status === 'approved');
  }

  if (realReviews.length > 0) {
    const sum = realReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const avg = sum / realReviews.length;
    return {
      rating: parseFloat(avg.toFixed(1)),
      reviewCount: realReviews.length,
      ratingFormatted: avg.toFixed(1),
      hasReviews: true,
    };
  }

  // If explicit product property exists
  if (typeof productOrId === 'object' && productOrId !== null) {
    if (typeof productOrId.rating === 'number' && productOrId.rating > 0) {
      return {
        rating: productOrId.rating,
        reviewCount: productOrId.reviewCount || 0,
        ratingFormatted: productOrId.rating.toFixed(1),
        hasReviews: (productOrId.reviewCount || 0) > 0,
      };
    }
  }

  // By default, for new products with no real reviews, return 0 / no reviews
  return {
    rating: 0,
    reviewCount: 0,
    ratingFormatted: '0.0',
    hasReviews: false,
  };
}

export function getProductRating(productOrId?: { id: string; rating?: number; reviewCount?: number } | string | null): number {
  return getProductRatingDetails(productOrId).rating;
}


