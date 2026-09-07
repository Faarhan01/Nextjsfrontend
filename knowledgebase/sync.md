# Frontend Sync & Deployment Guide

This guide explains how to sync the Mrbulk Next.js frontend to GitHub and set it up in Google AI Studio or any other environment.

## 1. What This Is

This repository is a **standalone Next.js frontend** for the Mrbulk e-commerce storefront.

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Tailwind CSS v4 + Motion
- **Data mode:** Frontend-only by default with rich mock catalog data, or connect to a MedusaJS backend
- **Package manager:** npm
- **Port:** 3000

### Key Principle

The frontend is fully functional without a backend. When `NEXT_PUBLIC_FRONTEND_ONLY=true` (or when no backend is available), it falls back to local mock data stored in `frontend/src/data/presets.ts`. Cart, wishlist, and checkout state are persisted in `localStorage`.

If you set `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, the frontend connects to a live MedusaJS Store API instead.

## 2. Syncing to GitHub

### Step 1: Commit Your Changes

```bash
git status
git add .
git commit -m "chore(frontend): update storefront"
```

### Step 2: Push to GitHub

```bash
git push origin main
```

### Step 3: Pull in Google AI Studio (or any other environment)

In your target environment, pull the latest code:

```bash
git pull origin main
```

## 3. Setting Up the Frontend

### Prerequisites

- Node.js 18+
- npm

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_FRONTEND_ONLY=true
```

Optional MedusaJS backend connection:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.com
```

Optional payments/email:

```env
# STRIPE_SECRET_KEY=...
# STRIPE_WEBHOOKS_SIGNING_SECRET=...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
# RESEND_API_KEY=...
```

### Build

```bash
npm run build
```

This creates an optimized production build in `frontend/.next/`.

**Note:** The build script also tries to run `esbuild` to bundle the optional Express server (`server.ts`). On Windows, `esbuild.exe` may be blocked by Device Guard/Defender. This does NOT affect the frontend—the Next.js build still succeeds. If `esbuild` is blocked, you can ignore it or use the alternative start method below.

### Start

```bash
npm start
```

This starts the production server at `http://localhost:3000`.

**Alternative start (no esbuild required):**

If `esbuild` is blocked on your machine, you can run the Next.js server directly:

```bash
cd frontend
npx next start -p 3000
```

This serves the built frontend without needing the custom Express wrapper.

### Deploy to Google AI Studio

Google AI Studio runs on Linux, so `esbuild` is not an issue there. To deploy:

1. Push your code to GitHub
2. In Google AI Studio, pull the latest code
3. Run `npm install`
4. Run `npm run build`
   - The Next.js build will succeed
   - The optional esbuild step may fail on Windows but is not needed for deployment
5. Run `cd frontend && npx next start -p 3000`
6. The app will be available at the AI Studio URL

**Alternatively**, you can deploy to Vercel, Netlify, or Railway, which support Next.js natively and don't require the custom server.

## 4. Development Mode

```bash
npm run dev
```

This starts the Next.js dev server with hot reloading.

## 5. Connecting to a MedusaJS Backend

If you want to connect to a live MedusaJS backend instead of using mock data:

1. Set `NEXT_PUBLIC_MEDUSA_BACKEND_URL` to your Medusa server URL (e.g. `https://medusa.your-domain.com`)
2. Set `NEXT_PUBLIC_FRONTEND_ONLY=false` or remove it
3. Rebuild and restart

The frontend will automatically try the live backend first and fall back to mock data if the backend is unreachable.

## 6. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 7. Project Structure (MedusaJS Storefront Architecture)

```
.
├── frontend/               # Next.js 16 storefront
│   ├── src/
│   │   ├── app/           # Next.js App Router (clean Server Components & route groups)
│   │   │   ├── (main)/    # Storefront pages (shop, product, category, cart, wishlist, etc.)
│   │   │   ├── (checkout)/# Dedicated checkout funnel
│   │   │   └── (admin)/   # Store and marketplace management
│   │   ├── @modules/      # MedusaJS-style feature modules
│   │   │   ├── account/   # Auth, orders, profile components, templates & actions
│   │   │   ├── ai/        # AI Concierge assistant & actions
│   │   │   ├── cart/      # Cart drawer, line items, cart template & actions
│   │   │   ├── checkout/  # Multi-step checkout templates & actions
│   │   │   ├── common/    # Shared UI (SafeImage, StockBadge, ThemeToggle, ErrorBoundary)
│   │   │   ├── content/   # Static content templates (about, faq, policies)
│   │   │   ├── home/      # Hero banners, carousels, home template
│   │   │   ├── layout/    # Store header, footer, navigation drawers
│   │   │   ├── products/  # Product detail, shop grid, reviews, search, actions
│   │   │   └── seller/    # Multi-vendor onboarding, storefronts, seller actions
│   │   ├── components/    # Shared and Admin UI components
│   │   │   ├── admin/     # Admin hub, compliance, marketing tools
│   │   │   └── medusa/    # MedusaStatusBadge dev monitor
│   │   ├── hooks/         # Custom React hooks (useMedusa, etc.)
│   │   ├── lib/           # Data fetchers, SDK, constants, and utilities
│   │   │   ├── data/      # Server data layer (cached products, categories, carts)
│   │   │   ├── medusa/    # Medusa Store API client, types & transformers
│   │   │   └── sdk/       # SDK bridge & client
│   │   ├── providers/     # Modular React Context providers (cart, theme, catalog, etc.)
│   │   ├── types/         # Domain and Medusa v2 Storefront types
│   │   └── utils/         # Pricing, SEO, and rating utilities
│   ├── public/            # Static assets and icons
│   └── next.config.mjs    # Next.js configuration
├── knowledgebase/         # Architecture guides, sync plans, rules, and notes
├── package.json           # Project dependencies and scripts
└── tsconfig.json          # TypeScript configuration with @modules/* and @lib/* aliases
```

## 8. Best Practices

1. **Pull before editing:** If you make changes on one machine, pull them in AI Studio before making edits there to avoid conflicts.
2. **Environment variables:** Never commit `.env` or `.env.local` to Git. Use `.env.example` as a template.
3. **Frontend-only first:** Design and test the frontend using `NEXT_PUBLIC_FRONTEND_ONLY=true` for fastest iteration.
4. **Medusa integration later:** When ready, connect to a live Medusa backend by setting `NEXT_PUBLIC_MEDUSA_BACKEND_URL`.

## 9. Troubleshooting

### Build fails with TypeScript errors

Make sure you have the latest dependencies:

```bash
npm install
```

### Port 3000 is already in use

Set a different port in `.env`:

```env
PORT=3001
```

### Cart/wishlist data not persisting

Check that the browser allows `localStorage`. The frontend stores cart and wishlist data in the browser's local storage when running in frontend-only mode.

### Images not loading

The Next.js config allows all remote image hosts by default. If you add custom image domains, update `next.config.mjs`.
