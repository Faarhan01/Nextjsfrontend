# Plan: Adopt Medusa Storefront Architecture (without changing design)

> **Goal.** Bring our codebase's *structure* in line with the official Medusa Next.js Starter storefront while keeping the existing visual design pixel-for-pixel identical. No new features, no UI tweaks, no dependency on `@medusajs/js-sdk` (we already talk to a Medusa-shaped `/api/store/*` backend).
>
> **Non-goals.** Rewriting styles, swapping Tailwind v4 for something else, replacing localStorage mock data with a real Medusa server, changing any user-visible behaviour.

---

## 0. Executive Summary

The Mrbulk frontend has a strong design system and rich feature set, but its architecture still behaves like a single-page React app inside Next.js App Router. The MedusaJS starter storefront shows a cleaner pattern: thin server routes, real data layer, reusable modules, and proper metadata/loading/error boundaries.

**Current direction:** Frontend-only mode. The Express backend has been removed. All data comes from local mock presets (`frontend/src/data/presets.ts`) and in-memory storage. The Medusa client is configured for offline/mock mode by default.

**Bottom line:** The design is good. The plumbing is not. The fastest path is to keep the current UI/components and refactor the routing/data/state layer to match Next.js best practices.

**Status:** Phase 1–3 complete. Phase 4 partially complete. Phase 5–6 pending.

---

## 1. Reference architecture (what we're matching)

Based on the official starter (`medusajs/nextjs-starter-medusa`) and the published Medusa storefront guides:

```
src/
├── app/
│   ├── (main)/                     # pages that share the storefront chrome
│   │   ├── products/[handle]/
│   │   ├── collections/[handle]/
│   │   ├── categories/[...category]/
│   │   ├── cart/
│   │   ├── account/(dashboard|orders|addresses)/...
│   │   ├── search/
│   │   ├── store/[handle]/
│   │   └── ...
│   ├── (checkout)/checkout/        # own layout, no nav
│   ├── (admin)/admin/              # existing admin section, untouched
│   └── api/revalidate/route.ts     # cache revalidation webhook (phase 5)
├── lib/
│   ├── sdk.ts                      # ONE Medusa SDK/client instance
│   ├── data/                       # server-only fetchers, one file per domain
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── collections.ts
│   │   ├── regions.ts
│   │   ├── carts.ts
│   │   ├── customers.ts
│   │   ├── orders.ts
│   │   └── fulfillment.ts
│   ├── utils/                      # pure helpers (seo, pricing, money)
│   └── constants.ts
├── modules/                        # feature-grouped UI, the heart of the storefront
│   ├── products/
│   │   ├── components/
│   │   ├── templates/
│   │   └── actions.ts              # "use server" mutations
│   ├── cart/                       # components, templates, actions, plus a provider
│   ├── checkout/
│   ├── account/
│   ├── search/
│   ├── home/
│   ├── layout/                     # header / footer / nav components
│   ├── common/                     # button, input, modal, badge primitives
│   └── ai/
├── providers/                      # thin React contexts (region, cart, toast)
│   ├── region.tsx
│   ├── cart.tsx
│   ├── toast.tsx
│   └── theme.tsx
├── styles/                         # currently `src/index.css`
├── types/                          # global TS types
└── middleware.ts                   # (optional, later)
```

Key principles taken directly from the official starter:

1. **One SDK file, one folder of data fetchers.** All Medusa calls live in `lib/sdk.ts` and `lib/data/*.ts`. UI never imports the SDK directly.
2. **`modules/<feature>/{components,templates,actions}.tsx`.** Each feature owns its UI.
3. **`actions.ts` for mutations** ("use server" functions), one folder per feature.
4. **Provider contexts in `providers/`.** Region and Cart are the canonical examples; they consume the data fetchers and expose typed hooks (`useRegion`, `useCart`).
5. **Server components fetch; client components mutate.** Server pages `await` `lib/data/*` and pass the result to client templates.

---

## 2. Current state (audit highlights)

- **Shared components extracted:** `PageBanner`, `CategoryBarCarousel`, `RecentlyViewedSection` moved to `frontend/src/components/shared/` and adopted across product templates.
- **Header/footer split:** `StoreHeader` and `StoreFooter` refactored into composable sub-components under `@modules/layout/`.
- **Frontend-only mode:** Express backend removed. App runs as standalone Next.js app.
- **Provider architecture:** Thin providers created for region, cart, theme, toast, auth, wishlist, ui, catalog, and recently-viewed.
- **StoreContext refactored:** Converted from a 1,377-line monolith into a lightweight facade that delegates to the new providers.
- **Module structure started:** Feature folders created under `@modules/` for account, ai, cart, checkout, common, content, home, layout, products, seller.
- **SDK/constants/types established:** `lib/sdk.ts`, `lib/constants.ts`, and `types/medusa.ts` are in place.
- **Dead SPA shell removed:** `App.tsx` deleted.
- **Lint:** 0 errors, 252 warnings (mostly pre-existing unused imports).
- **Typecheck:** passing.

### What remains

- `StoreContext.tsx` and dead sub-contexts (`auth/`, `cart/`, `catalog/`, `ui/`, `vendor/`, `wishlist/` under `context/`) still exist but are unused facades/dead code.
- `hooks/useMedusa.ts` is orphaned.
- `components/medusa/` contains orphan files.
- No route groups (`(main)`, `(checkout)`) yet.
- No per-route `loading.tsx` or `error.tsx`.
- No server actions or `unstable_cache`.
- No `api/revalidate/route.ts`.

---

## 3. Target end state

- `lib/sdk.ts` exports a single `sdk` (our existing `MedusaClient`, kept under the name `sdk` per convention).
- `lib/data/<domain>.ts` re-exports server-safe async fetchers (`listProducts`, `getProduct`, `listCategories`, etc.) that delegate to `sdk`. Server pages `await` them; client code does not import them.
- `providers/{region,cart,theme,toast}.tsx` are the only React contexts. Each is < 100 lines. They consume the SDK and expose typed hooks.
- `modules/<feature>/` owns every UI surface for that feature: `components/`, `templates/`, and (where mutations are needed) `actions.ts`.
- `components/` is renamed/split: `components/ui/*` becomes `modules/common/components/*`; `components/{auth,cart,products,account,seller,home,layout,ai,admin,pages,medusa}/*` are reassigned to the appropriate `modules/<feature>/` subfolders.
- `app/` keeps current URLs but routes that should not show the chrome (checkout) move into the `(checkout)` route group, matching the starter convention.
- `context/` is deleted (along with the 6 dead contexts).
- `hooks/` is deleted (only `useMedusa` lived there, and it's replaced by `useCart`, `useRegion`, etc.).
- `data/presets.ts` is kept *as the seed backend data*, not as a frontend import. The server fetchers in `lib/data/*` import from it; client code never does.
- All existing visual output (Tailwind classes, motion variants, component composition) stays byte-for-byte the same. Renaming files ≠ changing classes.

---

## 4. Migration phases

Each phase ends with the dev server green, the lint/typecheck clean, and the same UI rendering. No phase touches `index.css`, Tailwind tokens, or any component's class strings.

### Phase 1 — Foundations (rename, no behaviour change)

| Goal | Status | Notes |
|---|---|---|
| Establish canonical SDK import | ✅ Done | `lib/sdk.ts` exists; `lib/medusa/client.ts` still present but `lib/sdk.ts` is canonical. |
| Establish canonical data fetcher location | ✅ Done | `lib/data/` exists with `products.ts`, `categories.ts`, `brands.ts`, `home.ts`. |
| Establish canonical types | ✅ Done | `types/medusa.ts` exists alongside `types/index.ts`. |
| Establish constants file | ✅ Done | `lib/constants.ts` exists. |
| Rename barrel | ✅ Done | `lib/sdk/` index re-exports `sdk` and types. |

**Verification:** dev server green, all call sites work, typecheck + lint clean. UI byte-identical.

---

### Phase 2 — Provider contexts (still no UI change)

Create thin providers mirroring the starter's `region` and `cart` patterns.

| New file | Status | Replaces | Purpose |
|---|---|---|---|
| `frontend/src/providers/region.tsx` | ✅ Done | `StoreContext.themeColor`, regions logic | `RegionProvider` + `useRegion()` hook |
| `frontend/src/providers/cart.tsx` | ✅ Done | `StoreContext.cart` + `MedusaClient.carts.*` | `CartProvider` + `useCart()` hook |
| `frontend/src/providers/theme.tsx` | ✅ Done | `StoreContext.themeColor`, `darkMode`, `getThemeClasses` | `ThemeProvider` + `useTheme()` |
| `frontend/src/providers/toast.tsx` | ✅ Done | `StoreContext.toasts`, `showToast` | `ToastProvider` + `useToast()` |
| `frontend/src/providers/auth.tsx` | ✅ Done | Auth state | `AuthProvider` + `useAuth()` |
| `frontend/src/providers/wishlist.tsx` | ✅ Done | Wishlist state | `WishlistProvider` + `useWishlist()` |
| `frontend/src/providers/ui.tsx` | ✅ Done | UI chrome state | `UIProvider` + `useUI()` |
| `frontend/src/providers/catalog.tsx` | ✅ Done | Catalog data state | `CatalogProvider` + `useCatalog()` |
| `frontend/src/providers/recently-viewed.tsx` | ✅ Done | Recently viewed state | `RecentlyViewedProvider` + `useRecentlyViewed()` |
| `frontend/src/providers/search.tsx` | ⏳ Pending | `StoreContext.searchQuery`, `handlePerformSearch` | Later, when wiring search-as-you-type. |

Mount order in `app/layout.tsx`:

```
<ThemeProvider>
  <RegionProvider>
    <CartProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </CartProvider>
  </RegionProvider>
</ThemeProvider>
```

**Internal mechanics:** the providers start as **thin pass-throughs** that simply call into the existing `StoreContext` so no behaviour changes. The actual splitting happens in Phase 3.

**Verification:** dev server green, all `useStore()` call sites still work, the layout still renders the same HTML.

---

### Phase 3 — Split `StoreContext` into feature providers

Slowly peel slices off the monolith and give them to the new providers. Order matters: least-coupled slices first.

1. **Theme + branding** → `ThemeProvider`. Delete the equivalent slice from `StoreContext`. Keep the existing `getThemeClasses()` helper but relocate it to `providers/theme.tsx`. ✅ Done
2. **Toasts** → `ToastProvider`. Delete equivalent slice. ✅ Done
3. **Recently viewed / search query** → new `useRecentlyViewed` hook + (later) `SearchProvider`. Move out of `StoreContext`. ✅ Done
4. **Modals** (quickView, cart drawer, mobile menu, ai concierge, nextjs modal, seo modal) → already tightly coupled to layout/admin. Keep in `StoreContext` for now (admin chrome); just rename to `useUiChrome()` in Phase 4. ⏳ Pending
5. **Cart** → move cart *state* to `CartProvider`; keep `handleAddToCart` etc. as compatibility wrappers that delegate. Once all callers are migrated, delete the cart slice from `StoreContext`. ✅ Done
6. **Wishlists** → small new `useWishlists()` hook (Zustand-style or local Context) — only the components that own wishlist actions should touch it. ✅ Done
7. **Auth / user** → small `useCurrentUser()` hook. The auth modal still calls `sdk.customers.login/register` and stores the token, but current user state lives in the provider. ✅ Done
8. **Vendor apps / seller accounts / product submissions / offers** — these are admin-only and stay inside the admin module (they don't need a global context). Move them to `modules/account/components/vendorComplianceStore.ts` (Zustand-style, scoped to admin). Delete from `StoreContext`. ⏳ Pending
9. **Catalog (products/categories/brands/slides/settings)** — these are the props that server pages already pass down. Migrate them out of `StoreContext` into per-page props or a `useCatalog()` provider that lazily reads from `lib/data/*` on the client only when an admin mutation is needed. After migration, delete from `StoreContext`. ✅ Done

By the end of Phase 3 `StoreContext` is empty and deleted, alongside `context/index.ts` and the 6 dead contexts. **No component is rewritten during this phase** — the consumer-facing API of each provider matches what was previously accessed via `useStore()`.

**Verification at each sub-step:** dev server + visual diff.

---

### Phase 4 — Modules folder (UI regrouping, still no design change)

Move files into `modules/<feature>/` while preserving every JSX byte.

| Current location | Status | New location |
|---|---|---|
| `components/home/*` | ✅ Done | `modules/home/components/*` |
| `components/layout/*` (header, footer, footer trust, header/*) | ✅ Done | `modules/layout/components/*` |
| `components/layout/StorefrontLayout.tsx` | ✅ Done | `modules/layout/templates/storefront-layout.tsx` |
| `components/products/{ShopPage,CategoriesPage,CategoryDetailPage,ProductDetailPage,SearchResultsPage,WishlistPage,ProductReviews,VendorOffersBuyBox,QuickViewModal,RecentlyViewedSection,FlashDealsSection,CategoryProductCarousel,BestsellersTabSection,HomeLivingShowcase,TechElectronicsShowcase}.tsx` | ⏳ Partial | `modules/products/{components,templates}/*` |
| `components/cart/{CartPage,CartDrawer}.tsx` | ✅ Done | `modules/cart/{components,templates}/*` |
| `components/cart/CheckoutPage.tsx` | ✅ Done | `modules/checkout/templates/checkout-page.tsx` (+ `actions.ts`) |
| `components/auth/AuthModal.tsx` | ✅ Done | `modules/account/components/auth-modal.tsx` (auth is an account feature in the starter) |
| `components/account/{MyAccountPage,OrderTrackingPage}.tsx` | ✅ Done | `modules/account/{components,templates}/*` |
| `components/seller/{SellerDashboard,StorefrontView}.tsx` | ✅ Done | `modules/seller/{components,templates}/*` |
| `components/ai/AiConciergeModal.tsx` | ✅ Done | `modules/ai/components/*` |
| `components/admin/*` (untouched in this migration) | ⏳ Keep | `components/admin/*` (keep — admin is its own surface, not part of the storefront starter) |
| `components/pages/*` (about/contact/faq/policies) | ✅ Done | `modules/content/templates/*` |
| `components/ui/{SafeImage,Toast,StockBadge,ThemeToggle,ErrorBoundary}.tsx` | ✅ Done | `modules/common/components/*` |
| `components/ui/CodeViewer.tsx` (admin dev tool) | ⏳ Keep | stays in `components/admin/` |
| `components/medusa/MedusaStatusBadge.tsx` | ⏳ Delete | orphan |

Each `modules/<feature>/` folder then gets:

- `actions.ts` (where mutations are needed) — `"use server"` functions that call `sdk` or call a provider action. Examples:
  - `modules/products/actions.ts` → `addProductToCart`, `getProductByHandle`
  - `modules/cart/actions.ts` → `addToCart`, `updateLineItem`, `removeLineItem`, `refreshCart`
  - `modules/checkout/actions.ts` → `placeOrder` (delegates to `sdk.carts.complete`)
  - `modules/account/actions.ts` → `loginCustomer`, `registerCustomer`, `logoutCustomer`
  - `modules/ai/actions.ts` → `askConcierge` (calls `sdk.ai.concierge`)
- `templates/` — the existing top-level page components (renamed, no class changes).

Pages in `app/` become almost pass-through — they await server data, render a template:

```tsx
// app/(main)/shop/page.tsx
import { listProducts, listCategories } from "@lib/data"
import ShopTemplate from "@modules/products/templates/shop-template"

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ])
  return <ShopTemplate products={products} categories={categories} />
}
```

Add the route group `(main)` around current storefront routes and `(checkout)` around the checkout page, mirroring the starter's layout split.

**Verification after each module move:** dev server green, screenshots/visual diff.

---

### Phase 5 — Server actions + cache tags (background infra)

Adopt the starter's caching pattern from the blog post "Building a Medusa Storefront in Next.js".

- Wrap each `lib/data/*` server fetcher in `unstable_cache(...)` with named tags: `products`, `product-${handle}`, `categories`, `collections`, `regions`, `cart`.
- Convert mutating client code (`AuthModal`, `CheckoutPage`, `AiConciergeModal`, `OrderTrackingPage`, `CartDrawer`) to call Server Actions from `modules/<feature>/actions.ts` instead of importing `sdk` directly.
- Add `app/api/revalidate/route.ts` (secret-protected) that calls `revalidateTag(...)`. Wire it from a later backend hook (out of scope for this plan).
- Migrate the cart `cart_id` storage from `localStorage` to an **httpOnly cookie** in a server-action cookie helper (this is a *data-architecture* change, not a visual one — UI doesn't care where the id lives).

**Verification:** dev server green, mutating flows still succeed end-to-end (smoke-test cart create / add / complete, login, concierge, order track).

---

### Phase 6 — Dead code removal & repo hygiene

Now safe to delete:

| Item | Status | Reason |
|---|---|---|
| `frontend/src/context/` (entire folder) | ⏳ Partial | replaced by `providers/`; `StoreContext.tsx` is now a facade, sub-contexts are dead |
| `frontend/src/hooks/useMedusa.ts` | ⏳ Pending | replaced by `useCart`, `useRegion`, etc. |
| `frontend/src/services/` (was already removed) | ✅ Done | `sdk` is the only client |
| `frontend/src/components/medusa/` | ⏳ Pending | orphan |
| `frontend/src/utils/templateGenerator.ts`, `nextjsCodeGenerator.ts`, `frontendExportGenerator.ts` | ⏳ Pending | orphan |
| `frontend/src/utils/safeStorage.ts` | ⏳ Pending | orphan (we'll use a tiny new helper in `lib/utils/cookie.ts` and `lib/utils/safeLocalStorage.ts`) |
| Any local fallback paths inside `MedusaClient` that became dead once we always hit our backend | ⏳ Pending | server fetchers return real data now |

Final typecheck + lint should drop the 252 warnings down to <30 (genuine design-file-only warnings).

---

## 5. Visual-design preservation checklist (apply at every phase)

- `frontend/src/index.css` is **read-only** — no edits.
- `frontend/postcss.config.mjs`, `frontend/tailwind` config — no edits.
- No class strings change in any moved file. Renames happen at the *file* level, not the JSX level.
- No motion/animation prop changes (`motion/react` `whileHover`, `transition`, `AnimatePresence` props stay identical).
- No icon imports change (`lucide-react`).
- Image sources stay identical (`unsplash.com` URLs, placeholder images).

To prove "no visual change" we keep a single manual check after each phase:
- `bun run dev` → hit `/`, `/shop`, `/cart`, `/checkout`, `/product/prod-1`, `/account`, `/order-tracking`, `/admin`.
- Spot-check header dropdown, hero, product grid, cart drawer, checkout summary, account tabs.

---

## 6. Per-phase deliverables & validation

| Phase | Deliverable | Status | Validation |
|---|---|---|---|
| 1 | `lib/sdk.ts` + `lib/data/*` + `types/medusa.ts` + `lib/constants.ts` | ✅ Done | typecheck, lint, dev server |
| 2 | `providers/{region,cart,theme,toast,auth,wishlist,ui,catalog,recently-viewed}.tsx` | ✅ Done | dev server, manual UI spot-check |
| 3 | Granular provider hooks export & facade integration | ✅ Done | typecheck, lint, dev server, all consumers resolve |
| 4 | `modules/<feature>/{components,templates,actions}.ts` folders | ⏳ Partial | dev server, route verification |
| 5 | Server actions + cache tags + cookie-based cart id + `unstable_cache` | ⏳ Pending | end-to-end smoke tests (login, cart add/checkout, concierge, track order) |
| 6 | Dead code removal & repo hygiene | ⏳ Pending | typecheck + build pass, 200 OK across all routes |

---

## 7. Codebase Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Frontend src size | ~2.5 MB | 126 `.ts/.tsx` files |
| Backend src size | ~66 KB | REMOVED — frontend-only mode |
| Largest file | `StoreContext.tsx` | ~1,377 lines — now a lightweight facade |
| Dead SPA shell | `App.tsx` | REMOVED |
| Inline mock data | `presets.ts` | 914 lines, 42 KB of hardcoded catalog — primary data source |
| GTM/analytics | `gtm.ts` | 505 lines of GA4 ecommerce tracking |
| Medusa client | `lib/medusa/client.ts` | 542 lines, offline/mock mode by default |
| Lint warnings | 252 | 0 errors; mostly pre-existing unused imports |

---

## 8. Architecture Comparison

| Area | Medusa storefront | Mrbulk current | Gap / risk |
|------|-------------------|----------------|------------|
| **App structure** | Thin route handlers in `src/app/...`, real UI in `src/modules/**` | Many routes are still client wrappers; heavy UI lives under `src/components/**` | Mrbulk should migrate reusable blocks into `src/modules/**` |
| **Modules** | `src/modules/{home,products,cart,account,layout,...}` with `components/`, `templates/`, sometimes own data | `src/modules/home/` exists, but most features remain in `src/components/` | Inconsistent module ownership; harder to discover feature boundaries |
| **Path aliases** | `@lib/*`, `@modules/*`, `@pages/*` in `tsconfig.json` | Only `@/*` → `src/*` exists; no `@lib/*`, `@modules/*`, `@components/*` | Relative imports become brittle as the tree grows |
| **Data layer** | Central `src/lib/data/**` with real API calls, caching, cookies | `src/lib/data/**` now exists, but mostly wraps in-memory presets | Structure is good; content needs to move from `StoreContext`/localStorage |
| **Routing pattern** | Server components fetch data; client components only for interactivity | Mixed: some server pages, many client pages, plus dead `App.tsx` SPA | Still part SPA, part Next.js |
| **Metadata** | `metadata`, `generateMetadata`, `generateStaticParams` used consistently | Only newly refactored pages have metadata; most pages share root metadata | SEO/social previews are incomplete |
| **Error handling** | Uses `notFound()`, `error.tsx`, `not-found.tsx` | Custom `404/page.tsx` and `not-found.tsx`; `notFound()` now fixed with Express interceptor | HTTP 404 status fixed for `notFound()` calls |
| **Loading states** | Skeleton UIs per route/module | Single `loading.tsx` returning `null` | No perceived-performance loading UI |
| **State management** | Lightweight; mostly server-driven + minimal client state | Large `StoreContext` mixing catalog, cart, wishlist, auth, UI, theme, vendor logic | One context doing too much; hard to test/extend |

---

## 9. Backend Analysis

| Area | Current State | Gap / risk |
|------|---------------|------------|
| **Framework** | REMOVED — frontend-only mode | N/A |
| **Data stores** | In-memory TS objects via `presets.ts` | No persistence; data resets on restart |
| **Auth** | Simple Bearer token verification in `authMiddleware.ts` | REMOVED — no auth in frontend-only mode |
| **AI integration** | Gemini service with 5 endpoints (`/api/ai/*`) | REMOVED — frontend-only mode |
| **Feed generation** | Google Shopping feed route under `/api/feeds` | REMOVED — frontend-only mode |
| **Rate limiting** | Basic in-memory rate limiter | REMOVED — frontend-only mode |
| **Database** | None | No PostgreSQL/SQLite; using in-memory presets |
| **Type safety** | Basic interfaces in `backend/src/types/index.ts` | Limited; no shared types with frontend |

---

## 10. Medusa Integration Layer

| Area | Current State | Assessment |
|------|---------------|------------|
| **Client** | `frontend/src/lib/medusa/client.ts` — offline/mock mode by default (`NEXT_PUBLIC_FRONTEND_ONLY=true`) | Solid dual-mode design; auto-falls back to local presets |
| **Types** | `frontend/src/lib/medusa/types.ts` | Complete Medusa v2 Store API shapes |
| **Transformers** | `frontend/src/lib/medusa/transformers.ts` | Bidirectional adapters between Medusa ↔ UI models |
| **Hook** | `frontend/src/hooks/useMedusa.ts` | Provides `cart`, `addToCart`, `isLiveBackend` — **orphaned** |
| **Env** | `NEXT_PUBLIC_MEDUSA_BACKEND_URL=` (empty) + `NEXT_PUBLIC_FRONTEND_ONLY=true` | Frontend-only mode |
| **Status badge** | `frontend/src/components/medusa/MedusaStatusBadge.tsx` | Dev-only health indicator — **orphaned** |

**Assessment:** The Medusa integration layer is well-architected and ready. In frontend-only mode, it uses local mock data exclusively. The main gap is that the rest of the frontend doesn't use it yet — most pages still read from `StoreContext`/localStorage instead of the Medusa client.

---

## 11. Configuration & Deployment

| File | Current State | Issue |
|------|---------------|-------|
| `next.config.mjs` | `typescript.ignoreBuildErrors: true`, `reactStrictMode: false`, `images.unoptimized: true` | Dangerous in production — TypeScript errors are hidden |
| `frontend/tsconfig.json` | `strict: false` | Type safety is optional |
| `server.ts` | Express + Next.js custom server with 404 interceptor | Works for dev; can run `next start` directly for production |
| `.env.example` | Has `NEXT_PUBLIC_MEDUSA_BACKEND_URL` but missing `NEXT_PUBLIC_SITE_URL` fallback logic | Layout.tsx has hardcoded Google Cloud Run URL |
| `layout.tsx` | Hardcoded `https://ais-dev-6gn5ggip67oqekkhfx7fhc-396079311886.europe-west1.run.app` | Should use `NEXT_PUBLIC_SITE_URL` only |
| Docker/CI | No `Dockerfile`, no `.github/workflows` | No automated builds or containerization |
| `manifest.ts` | Exists | Good — PWA manifest is present |

---

## 12. What's Already Good

- Design system is strong: consistent Tailwind, theme tokens, dark mode, animations
- Feature set is rich: quick view, AI concierge, admin/exporter, wishlists, vendor ecosystem, GTM, SEO inspector
- `frontend/src/lib/data/` created with `home.ts`, `products.ts`, `categories.ts`, `brands.ts`
- `/`, `/shop`, `/product/[id]`, `/cart` split into server + client with proper metadata
- Medusa client layer is complete with dual-mode live/design fallback
- Dev server is stable; all major routes return 200
- No Payload CMS remnants; clean dependency tree
- Backend Express API is functional for AI, feeds, orders, auth

---

## 13. Recommended Improvements

### Critical — Fix First

| # | Improvement | Effort | Impact | Rationale |
|---|-------------|--------|--------|-----------|
| 1 | **Remove dead `App.tsx`** | Small | High | 1,400-line SPA shell that Next.js ignores; confusing and risky |
| 2 | **Fix `next.config.mjs`** | Small | High | `ignoreBuildErrors: true` hides real problems; `reactStrictMode: false` masks bugs |
| 3 | **Remove hardcoded deployment URL** | Small | High | Layout.tsx has a hardcoded Google Cloud Run URL; should use env only |
| 4 | **Standardize all routes to server + client split** | Medium | High | Only 4 of ~20 routes are properly refactored; others share root metadata |

### High Priority

| # | Improvement | Effort | Impact | Rationale |
|---|-------------|--------|--------|-----------|
| 5 | **Split `StoreContext` into 3 contexts** | Medium | High | 1,377-line blob mixing catalog, cart, wishlist, auth, UI, vendor logic |
| 6 | **Add path aliases** (`@lib/*`, `@modules/*`, `@components/*`) | Small | Medium | Relative imports are brittle across 126 files |
| 7 | **Add per-route `loading.tsx` and `error.tsx`** | Medium | Medium | Better UX and correct Next.js error semantics |
| 8 | **Use `notFound()` in server pages** | Small | Medium | Correct HTTP 404 behavior instead of custom “Not Found” divs |
| 9 | **Replace presets with backend calls** | Large | High | 42 KB of inline mock data should come from Express/Medusa APIs |
| 10 | **Add `generateStaticParams` for semi-static routes** | Medium | Medium | Categories, policies, and static pages can be ISR/SSG |

### Medium Priority

| # | Improvement | Effort | Impact | Rationale |
|---|-------------|--------|--------|-----------|
| 11 | **Move feature blocks into `src/modules/**`** | Medium | High | Mirrors Medusa pattern; clearer ownership |
| 12 | **Add route groups (`(main)`, `(checkout)`)** | Medium | Low | Cleaner layout sharing for account/sell/store families |
| 13 | **Bundle/performance audit** | Medium | Medium | Frontend is 2.5 MB; shrink after `App.tsx` removal and code splitting |
| 14 | **Add ESLint + Prettier config** | Small | Low | Enforce code style; already have lint running |
| 15 | **Add CI/CD pipeline** | Medium | Low | No Dockerfile or GitHub Actions; manual deploys only |

### Lower Priority / Longer Term

| # | Improvement | Effort | Impact | Rationale |
|---|-------------|--------|--------|-----------|
| 16 | **Migrate backend to MedusaJS** | Large | High | Replace Express with Medusa; gain DB, admin, plugins |
| 17 | **Add database layer** | Large | High | Backend has no persistence; SQLite/PostgreSQL needed |
| 18 | **Implement proper auth** | Medium | High | JWT expiry, refresh tokens, password hashing |
| 19 | **Add distributed rate limiting** | Small | Medium | Current in-memory limiter fails on multi-instance deploys |
| 20 | **Add E2E tests** | Medium | Medium | Critical flows: browse → cart → checkout → order |

---

## 14. Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Breaking existing UI during refactor | High | Medium | Keep all components/styles intact; change routing/data layer only |
| `App.tsx` removal hides hidden dependencies | Medium | Low | Audit all imports of `App.tsx` first; it is not imported anywhere in `src/app/` |
| StoreContext split causes prop drilling | Medium | Medium | Use nested providers at layout level, not deep prop drilling |
| Medusa backend schema mismatch | Medium | Medium | Use transformers (`lib/medusa/transformers.ts`) as adapter layer |
| Deployment URL hardcoding breaks previews | High | High | Fix env config before any deploy changes |

---

## 15. Recommended Execution Order

### Phase 1: Foundation (Week 1)
1. Remove dead `App.tsx` ✅ Done
2. Fix `next.config.mjs` — enable strict mode, remove `ignoreBuildErrors`
3. Remove hardcoded deployment URL from `layout.tsx`
4. Add path aliases to `tsconfig.json`
5. Standardize remaining routes to server + client split with metadata

### Phase 2: State & Data (Week 2)
6. Split `StoreContext` into `CartContext`, `WishlistContext`, `AuthContext`, `UIContext` ✅ Done (via providers)
7. Migrate all pages to use new contexts + `lib/data/` layer ⏳ Partial
8. Add `notFound()` to server pages
9. Add per-route `loading.tsx` and `error.tsx`

### Phase 3: Medusa Integration (Week 3-4)
10. Replace `presets.ts` data with calls to Express `/api/*` routes
11. Wire up Medusa client in server components
12. Add `generateStaticParams` for categories and policies
13. Connect cart/checkout to Medusa Store API

### Phase 4: Polish (Week 5+)
14. Move feature blocks into `src/modules/**` ⏳ Partial
15. Add route groups for layout sharing
16. Bundle audit and performance optimization
17. Add CI/CD and Docker

---

## 16. Quick Wins (< 1 day each)

1. ✅ Delete `App.tsx`
2. Fix `next.config.mjs`
3. Remove hardcoded URL from `layout.tsx`
4. Add path aliases
5. Add `notFound()` to `/product/[id]`
6. Add `loading.tsx` skeletons for `/shop`, `/product/[id]`, `/cart`

---

## 17. Next Steps

1. Confirm this plan aligns with priorities
2. Approve which phase to start with
3. Proceed with Phase 1 quick wins first, then page-by-page refactor keeping all existing UI/styles intact

---

## 18. Frontend-Only Mode Notes

**Status:** Active since commit `cdedf7b`

The site now runs as a frontend-only Next.js application:
- **Express backend removed** from `server.ts` — only Next.js is served
- **Medusa client** defaults to offline/mock mode via `NEXT_PUBLIC_FRONTEND_ONLY=true`
- **Data source:** `frontend/src/data/presets.ts` (42 KB of mock catalog data)
- **No external API calls** — all data is local
- **Deployable:** Build with `npm run build`, start with `npm start`
- **Database sync:** `data/db.json` still exists for future backend reconnection

To reconnect a backend later:
1. Set `NEXT_PUBLIC_MEDUSA_BACKEND_URL` to your Medusa/Express URL
2. Set `NEXT_PUBLIC_FRONTEND_ONLY=false` (or unset it)
3. The Medusa client will automatically detect the live backend and use it

---

**When approved, start with the pending items in Phase 4–6.** Each phase ends with a green dev server, a clean `tsc --noEmit`, and a clean `eslint .` run.
