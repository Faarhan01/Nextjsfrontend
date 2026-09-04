# MedusaJS Storefront Architecture & Frontend Guide

This document outlines the architecture, data contracts, and workflow for developing and designing the frontend with seamless MedusaJS backend readiness.

---

## 1. Architectural Overview

The storefront is built on **Next.js 16 (App Router)** with a clean, decoupled headless architecture. The frontend data contracts strictly mirror standard **Medusa v2 / v1 Store API** models.

### Key Directory Structure:
```
frontend/src/
├── lib/
│   └── medusa/
│       ├── types.ts          # Complete Medusa v2 / v1 Storefront entity types
│       ├── transformers.ts   # Lossless bidirectional adapters between Medusa & UI models
│       ├── client.ts         # Typed Medusa client with local Design Mode fallback
│       └── index.ts          # Barrel export for lib/medusa
├── hooks/
│   └── useMedusa.ts          # React hook for Medusa cart, products, and connection state
├── components/
│   └── medusa/
│       └── MedusaStatusBadge.tsx  # Interactive dev/design badge with health pings & API specs
```

---

## 2. Medusa Store API Contract Mapping

| Medusa Store API Route | Purpose | Frontend Client Method | Fallback in Design Mode |
|---|---|---|---|
| `GET /store/products` | Retrieve published products & variants | `medusa.products.list()` | Returns local product presets in Medusa schema |
| `GET /store/products/:id` | Fetch single product by ID or handle | `medusa.products.retrieve()` | Matches preset product by ID or slug handle |
| `GET /store/product-categories` | List hierarchical product categories | `medusa.categories.list()` | Returns category preset hierarchy |
| `GET /store/collections` | Fetch curated collections | `medusa.collections.list()` | Returns Bestsellers, Flash Deals, Bulk presets |
| `GET /store/regions` | Retrieve regions, currencies & tax rates | `medusa.regions.list()` | Returns South Africa (ZAR, 15% VAT) & USD |
| `POST /store/carts` | Initialize a new shopping cart session | `medusa.carts.create()` | Creates local cart session with localStorage |
| `GET /store/carts/:id` | Retrieve active cart with line items | `medusa.carts.retrieve()` | Reads cart state from localStorage |
| `POST /store/carts/:id/line-items` | Add product variant to cart | `medusa.carts.lineItems.create()` | Appends/increments variant line item |
| `POST /store/carts/:id/line-items/:line_id` | Update line item quantity | `medusa.carts.lineItems.update()` | Updates quantity & recalculates totals |
| `DELETE /store/carts/:id/line-items/:line_id`| Remove line item from cart | `medusa.carts.lineItems.delete()` | Removes item & updates totals |
| `POST /store/carts/:id/complete` | Complete order from cart | `medusa.carts.complete()` | Generates confirmed Medusa order structure |

---

## 3. Local Design Mode vs. Live Backend Mode

### Design Mode (Default when no Medusa backend is running)
- When starting or designing the frontend without a Medusa server running, the storefront automatically operates in **Design Mode**.
- Products, variants, options, prices, and categories are populated via local presets adhering 100% to Medusa's object shapes.
- Carts and line items are emulated in `localStorage` following exact Medusa calculations (unit prices, tax totals, subtotal).
- This allows rapid visual design and component prototyping without backend blockers.

### Live Medusa Mode (When backend is connected)
- Set `NEXT_PUBLIC_MEDUSA_BACKEND_URL` in `.env`:
  ```bash
  NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
  ```
- The client automatically checks backend availability via non-blocking health checks.
- Once connected, all requests seamlessly route to the live Medusa instance.

---

## 4. How to Use in Components

### Using the `useMedusa` Hook:
```tsx
import { useMedusa } from '@/hooks/useMedusa';

export function MyComponent() {
  const { cart, addToCart, isLiveBackend, backendUrl } = useMedusa();

  const handleAdd = async (variantId: string) => {
    await addToCart(variantId, 1);
  };

  return (
    <div>
      <p>Backend: {backendUrl} ({isLiveBackend ? 'Connected' : 'Design Mode'})</p>
      <p>Cart Items: {cart?.items.length || 0}</p>
    </div>
  );
}
```

### Using Transformers:
```tsx
import { medusaProductToUiProduct, uiProductToMedusaProduct } from '@/lib/medusa';

// Convert Medusa Product to UI Card
const uiCardData = medusaProductToUiProduct(medusaProduct);

// Convert UI Product to Medusa Product
const medusaProductData = uiProductToMedusaProduct(uiProduct);
```
