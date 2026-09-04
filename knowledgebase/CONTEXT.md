# Mrbulk — Project Context

## Overview

Mrbulk is an e-commerce storefront combining retail and wholesale products with verified independent marketplace sellers, operated by **Mr Cheap General Dealer ZA** (150 Industrial Rd, Crown North, Johannesburg).

The application is structured as a **frontend-first storefront designed for seamless headless integration with MedusaJS**:
- **Frontend Framework:** Next.js 16 (App Router) + Tailwind CSS v4 + Motion (Framer Motion)
- **UI Architecture:** React 19 Client & Server Components, custom design tokens, Lucide icons, responsive mobile/desktop layouts
- **Headless Backend Target:** MedusaJS (Medusa v2 Store API conventions: `/store/*` endpoints)
- **Integration Layer:** MedusaJS typed client with local preset fallback emulation for friction-free frontend designing and prototyping
- **Package Manager:** npm
- **Runtime:** Node.js (Next.js App Router on Port 3000)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 + Motion |
| Icons | Lucide React |
| Headless Commerce Target | MedusaJS v2 (`@medusajs/medusa` / Store API) |
| Client SDK | `frontend/src/lib/medusa` (typed store client + hooks) |
| AI | Google Generative AI (`@google/genai`) |
| Utilities | Recharts, JSZip |
| Language | TypeScript ~5.8 |

---

## Architecture & MedusaJS Readiness

1. **Clean Frontend Focus**:
   - The frontend is decoupled from proprietary CMS dependencies.
   - All catalog data, categories, products, cart line items, pricing, and variants are structured around MedusaJS conventions (`Product`, `ProductVariant`, `Cart`, `LineItem`, `Region`).

2. **Dual-Mode Medusa Client**:
   - In production or when connected to a live Medusa server (`NEXT_PUBLIC_MEDUSA_BACKEND_URL`), requests go directly to Medusa's Store API.
   - When developing/designing the frontend standalone, the client seamlessly provides rich mock/preset catalog data and handles carts, wishlists, and checkout locally.

3. **Design System**:
   - 6 dynamic theme accents (Blue, Indigo, Emerald, Rose, Amber, Slate)
   - Dark/Light mode support with WCAG AA contrast standards
   - High-craft product showcases, flash deals, category carousels, and responsive checkout flows.
