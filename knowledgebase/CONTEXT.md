# Mrbulk — Project Context

## Overview

Mrbulk is an e-commerce storefront combining retail and wholesale products with verified independent marketplace sellers, operated by **Mr Cheap General Dealer ZA** (150 Industrial Rd, Crown North, Johannesburg).

The application is structured as a **frontend-first storefront designed for seamless headless integration with MedusaJS**:
- **Frontend Framework:** Next.js 16 (App Router) + Tailwind CSS v3 + Motion (Framer Motion)
- **UI Architecture:** React 19 Client & Server Components, custom design tokens, Lucide icons, responsive mobile/desktop layouts
- **Headless Backend Target:** MedusaJS (Medusa v2 Store API conventions: `/store/*` endpoints)
- **Integration Layer:** MedusaJS typed client with local preset fallback emulation for friction-free frontend designing and prototyping
- **Package Manager:** npm (bun also available via bun.lock)
- **Bundler:** Webpack (explicit `--webpack` flag; Turbopack not used)
- **Runtime:** Node.js v26 (Next.js App Router on Port 3000)
- **Backend:** Express/Medusa server on Port 9001 (connected via API rewrites)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.4 (App Router) |
| UI | React 19 + Tailwind CSS v3.4.17 + Motion |
| PostCSS | v8.5.28 |
| Icons | Lucide React |
| Tailwind PostCSS Plugin | `tailwindcss` (v3 PostCSS plugin, NOT `@tailwindcss/postcss`) |
| Headless Commerce Target | MedusaJS v2 (`@medusajs/medusa` / Store API) |
| Client SDK | `frontend/src/lib/medusa` (typed store client + hooks) |
| AI | Google Generative AI (`@google/genai`) |
| Utilities | Recharts, JSZip |
| Language | TypeScript ~5.8 |
| Dev Server | `npx next dev --webpack` (webpack bundler, not Turbopack) |

---

## Environment Compatibility

### Termux / Proot Distro

This project is developed on Android via Termux (proot distro environment). Key considerations:

- **Node.js**: v26.4.0 installed via `nvm` or native package manager
- **npm**: v11.19.1 (primary package manager)
- **bun**: v1.x available at `/root/.bun/bin/bun` (alternative package manager, `bun.lock` present)
- **Tailwind CSS**: v3.4.17 installed in `node_modules` (NOT v4 — `@tailwindcss/postcss` is NOT installed)
- **CSS Syntax**: Use Tailwind v3 directives (`@tailwind base; @tailwind components; @tailwind utilities;`) — NOT v4 (`@import "tailwindcss"`)
- **Port 3000**: May be occupied by previous server instances; use `fuser -k 3000/tcp` to free it
- **File system**: Termux root at `/data/data/com.termux/files/home/`; workspace accessible at `/root/workspace/`

### Local Development (Non-Termux)

- **Node.js**: v20+ recommended
- **npm**: v10+
- **Standard Linux/macOS/Windows**

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
