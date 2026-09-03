# Payload CMS 3.88.0 E-Commerce Architecture & Integration Reference

## 1. Version & Build Specification
- **Payload CMS Version**: `v3.88.0` (Payload 3.x Next.js 15+ Native App Router E-Commerce Architecture).
- **Runtime Environment**: Node.js 22 LTS / Next.js App Router with Express API layer.
- **Reference Starter**: Payload 3.x Official E-Commerce Template & Schema Specification (`@payloadcms/plugin-ecommerce` & Next.js 15 Server/Client patterns).

---

## 2. Core Collections Architecture

### A. Products Collection (`/api/payload/products`)
```typescript
export interface PayloadProductDoc {
  id: string;
  slug: string;
  title: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  numericPrice: number;
  isSale?: boolean;
  saleBadgeText?: string;
  isFeatured?: boolean;
  inventory: number;
  lowStockThreshold?: number;
  allowBackorder?: boolean;
  images: Array<{ id: string; url: string; alt: string } | string>;
  image?: string;
  category: { id: number | string; title: string; slug: string; name?: string };
  brand?: { id: number | string; title: string; slug?: string; logo?: string; name?: string };
  tags: string[];
  description: string;
  specs?: Array<{ name: string; value: string }>;
  variants?: Array<{
    id: string;
    sku: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    inventory: number;
    options: Record<string, string | undefined>;
  }>;
  rating: number;
  reviewsCount: number;
  status: 'published' | 'draft';
  _status?: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}
```

### B. Categories Collection (`/api/payload/categories`)
- Hierarchical category documents with `slug`, `breadcrumbs`, `imageUrl`, `icon`, `itemCount`, and `featured` flags.

### C. Orders Collection (`/api/payload/orders`)
- Comprehensive order lifecycle records containing:
  - `orderNumber` (e.g. `LX-1001`, `LX-9901`)
  - Snapshot line items with variants & prices
  - Financial breakdown (`subtotal`, `discount`, `shippingFee`, `tax`, `total`)
  - Applied coupon details
  - Shipping & billing addresses (`PayloadAddress`)
  - Fulfillment status: `'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled'`
  - Payment status: `'paid' | 'pending' | 'failed' | 'refunded'`
  - Carrier tracking (`shippingCarrier`, `trackingNumber`, `trackingUrl`)
  - Step-by-step progress timeline events with completion flags and physical locations.

### D. Reviews & Ratings Collection (`/api/payload/reviews`)
- Verified customer reviews with:
  - `rating`: 1 to 5 stars
  - `title`: Review headline
  - `comment`: Full review description
  - `author`: Name, email, and avatar
  - `isVerifiedBuyer`: Boolean verification flag
  - `likesCount`: Patron helpful votes
  - Dynamic aggregation helper calculating average rating and star distribution breakdown.

### E. Promotions & Coupons Collection (`/api/payload/promotions`)
- Structured discount codes:
  - `discountType`: `'percentage' | 'fixed' | 'free_shipping'`
  - `discountValue`: Numerical amount or percentage
  - `minOrderSubtotal`: Threshold required for activation
  - `usageLimit` & `usedCount`: Real-time redemption tracking
  - `validFrom` / `validUntil`: Temporal constraints.

### F. Dynamic Page Layout Blocks (`/api/payload/pages`)
- Block-based visual layout schemas supporting:
  - `hero`: Heading, subheading, badge text, CTA buttons, background styling
  - `features`: Feature matrix with customizable icons and copy
  - `banner`: Promotional highlight strip with coupon code integration
  - `testimonials`: Verified patron quotes and star ratings
  - `cta`: Call-to-action blocks with primary and secondary routes.

### G. Globals (`/api/payload/globals`)
- Singletons for store settings, multi-currency display, threshold rules (`freeShippingThreshold`), tax rates, and announcement banner messages.

---

## 3. Standardized Payload REST API Reference

All list endpoints return Payload's official pagination envelope (`docs`, `totalDocs`, `limit`, `totalPages`, `page`):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/payload/products` | Paginated product queries (`?category=...&brand=...&sort=...&minPrice=...&maxPrice=...&page=1&limit=20`) |
| `GET` | `/api/payload/products/:idOrSlug` | Retrieve product by ID or Slug |
| `POST` | `/api/payload/products` | Create product (Admin) |
| `PATCH` | `/api/payload/products/:id` | Update product (Admin) |
| `DELETE` | `/api/payload/products/:id` | Delete product (Admin) |
| `GET` | `/api/payload/categories` | Retrieve all category records |
| `GET` | `/api/payload/categories/:idOrSlug` | Retrieve single category |
| `GET` | `/api/payload/facets` | Compute faceted search counts for categories, brands, and price bands |
| `GET` | `/api/payload/inventory/low-stock` | Monitor products below their `lowStockThreshold` |
| `GET` | `/api/payload/reviews` | Retrieve verified reviews and rating distribution (`?productId=...`) |
| `POST` | `/api/payload/reviews` | Submit new verified review |
| `POST` | `/api/payload/promotions/validate` | Live coupon code verification and calculated savings |
| `POST` | `/api/payload/cart/validate` | Server-side cart inventory check & tax/shipping calculation |
| `POST` | `/api/payload/orders` | Place verified order record in Payload orders collection |
| `GET` | `/api/payload/orders` | Query customer orders by email or customer ID |
| `GET` | `/api/payload/orders/:idOrNumber` | Retrieve order with fulfillment tracking timeline |
| `PATCH` | `/api/payload/orders/:idOrNumber/status` | Advance order lifecycle (`processing`, `in_transit`, `out_for_delivery`, `delivered`) |
| `GET` | `/api/payload/pages/:slug` | Retrieve dynamic layout block configuration for page |
| `GET` | `/api/payload/globals` | Global store configurations |
| `PATCH` | `/api/payload/globals` | Update global store thresholds and settings |

---

## 4. Frontend Integration & Client SDK

The frontend interacts via `payloadClient` in `frontend/src/services/payloadClient.ts`:

```typescript
import { payload } from '../services/payloadClient';

// 1. Query products with faceted filtering
const { docs } = await payload.products.find({
  category: 'electronics',
  isFeatured: true,
  sort: '-price'
});

// 2. Validate coupon code
const validation = await payload.promotions.validate('PAYLOAD20', 250.00);

// 3. Create order
const order = await payload.orders.create({
  customer: { name: 'Alexander Vance', email: 'vance@example.com' },
  items: [{ id: 'prod-1', quantity: 1 }],
  shippingAddress: {
    id: 'addr-1',
    name: 'Alexander Vance',
    street: '1 Executive Plaza',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  },
  couponCode: 'PAYLOAD20'
});

// 4. Track and advance order lifecycle
const orderRecord = await payload.orders.findByID('LX-9901');
await payload.orders.updateStatus('LX-9901', 'in_transit');

// 5. Query verified reviews and submit ratings
const reviewsData = await payload.reviews.find('prod-1');
await payload.reviews.create({
  productId: 'prod-1',
  rating: 5,
  title: 'Exceptional build quality',
  comment: 'Superb artisan piece with rich acoustic resonance.'
});
```

---

## 5. UI Components Showcase

- **`PayloadBlocksRenderer`**: Dynamically renders block-based layouts (`hero`, `features`, `banner`, `testimonials`, `cta`).
- **`PayloadReviews`**: Verified reviews module featuring aggregate score, star distribution breakdown, star filtering, and review submission.
- **`PayloadStockBadge`**: Real-time stock status badge with low-stock alerts and backorder indicators.
- **`PayloadCouponInput`**: Real-time coupon validator with instant savings breakdown and quick code suggestions (`WELCOME10`, `LUXE50`, `FREESHIP`).
- **`PayloadAddressBook`**: Customer address management with default shipping/billing selection.
- **`PayloadOrderTimeline`**: Milestone timeline rendering with real fulfillment stages, carrier links, and status progression controls.
- **`PayloadHub`**: Admin dashboard panel for real-time inspection and testing of all Payload CMS collections, low stock alerts, search facets, promo codes, and globals.
- **`CheckoutPage`**: Synchronizes order creation with the Payload CMS 3.88 orders collection.
- **`OrderTrackingPage`**: Live queries and interactive stage progression against Payload CMS `/api/payload/orders/:idOrNumber`.
