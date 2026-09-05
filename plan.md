# Plan: Adopt Medusa Storefront Architecture (without changing design)

> **Goal.** Bring our codebase's *structure* in line with the official Medusa Next.js Starter storefront while keeping the existing visual design pixel-for-pixel identical. No new features, no UI tweaks, no dependency on `@medusajs/js-sdk` (we already talk to a Medusa-shaped `/api/store/*` backend).
>
> **Non-goals.** Rewriting styles, swapping Tailwind v4 for something else, replacing localStorage mock data with a real Medusa server, changing any user-visible behaviour.

---

## 0. Reference architecture (what we're matching)

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

## 1. Current state (audit highlights)

- **One monolithic context** owns everything: `frontend/src/context/StoreContext.tsx` (~1372 lines, 22+ consumers, 18+ slices, persists ~20 `localStorage` keys). Six other context files (`auth`, `cart`, `catalog`, `ui`, `vendor`, `wishlist`) exist but are dead code.
- **One mega-MEDUSA client** at `frontend/src/lib/medusa/client.ts` (~648 lines) that re-implements the entire Store API surface as a singleton, with a built-in `MOCK_*` fallback path that never executes in practice.
- **Server fetchers** at `frontend/src/lib/data/{products,categories,brands,home}.ts` return `MOCK_*` from `data/presets.ts`.
- **Hooks orphan:** `useMedusa` is exported but no component imports it.
- **Components orphans:** `components/medusa/MedusaStatusBadge.tsx`, three code generators, `safeStorage.ts`.
- **Pages mix props and `useStore`** — only `ProductDetailPage` and `CheckoutPage` currently deviate.
- **Coupling hotspots:** `StoreContext`, `components/products/ProductDetailPage.tsx` (2155 lines), `components/seller/StorefrontView.tsx` (1598), `components/admin/AdminPage.tsx` (~2500), `components/cart/CheckoutPage.tsx` (1173).
- **No Medusa SDK** is installed; we already hit our own `/api/store/*` endpoints shaped like Medusa.

---

## 2. Target end state

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

## 3. Migration phases

Each phase ends with the dev server green, the lint/typecheck clean, and the same UI rendering. No phase touches `index.css`, Tailwind tokens, or any component's class strings.

### Phase 1 — Foundations (rename, no behaviour change)

| Goal | Files |
|---|---|
| Establish canonical SDK import | Rename `frontend/src/lib/medusa/client.ts` to `frontend/src/lib/sdk.ts`; keep the same `MedusaClient` class but export it as `sdk` (named export + default singleton). Update the 5 import sites: `AuthModal`, `AiConciergeModal`, `CheckoutPage`, `OrderTrackingPage`, `useMedusa` (later deleted). |
| Establish canonical data fetcher location | Rename `frontend/src/lib/data/` → `frontend/src/lib/data/` (already correct), expand per-domain: `products.ts`, `categories.ts`, `collections.ts`, `regions.ts`, `carts.ts`, `customers.ts`, `orders.ts`, `fulfillment.ts`. Each wraps a `sdk.*` call with a uniform server-safe signature. Move existing helpers (`getProducts`, `getProductById`, `getCategories`, `getCategoryBySlug`, `getBrands`, `getHomeData`) here verbatim. |
| Establish canonical types | Move `frontend/src/lib/medusa/types.ts` → `frontend/src/types/medusa.ts` (matches starter convention). Update imports across the repo. Keep `MockProduct`/`CartItem`/etc. as `frontend/src/types/storefront.ts` (UI-domain types the starter doesn't have). |
| Establish constants file | Create `frontend/src/lib/constants.ts` for `DEFAULT_REGION = 'reg_za'`, `DEFAULT_CURRENCY = 'zar'`, cart storage keys, etc. (mostly extracted from `MedusaClient`). |
| Rename barrel | `frontend/src/lib/medusa/index.ts` → `frontend/src/lib/sdk/index.ts` re-exporting `sdk` and the types. |

**Verification:** dev server green, all five call sites still work, typecheck + lint clean. UI byte-identical.

---

### Phase 2 — Provider contexts (still no UI change)

Create thin providers mirroring the starter's `region` and `cart` patterns.

| New file | Replaces | Purpose |
|---|---|---|
| `frontend/src/providers/region.tsx` | `StoreContext.themeColor`, regions logic | `RegionProvider` + `useRegion()` hook; stores selected region id in `localStorage`. Exposes `{ region, regions, setRegion }`. |
| `frontend/src/providers/cart.tsx` | `StoreContext.cart` + `MedusaClient.carts.*` | `CartProvider` + `useCart()` hook; uses `sdk.carts.retrieve/create/lineItems.*/complete`; persists `cart_id` to `localStorage`. Exposes `{ cart, addItem, updateItem, removeItem, refreshCart }`. |
| `frontend/src/providers/theme.tsx` | `StoreContext.themeColor`, `darkMode`, `getThemeClasses`, runtime CSS vars | `ThemeProvider` + `useTheme()`. Owns theme color + dark mode + writes the runtime CSS variables (currently inline in `StoreContext` lines 651-663). |
| `frontend/src/providers/toast.tsx` | `StoreContext.toasts`, `showToast` | `ToastProvider` + `useToast()`. |
| `frontend/src/providers/search.tsx` (optional, phase 4) | `StoreContext.searchQuery`, `handlePerformSearch` | Later, when wiring search-as-you-type. |

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

1. **Theme + branding** → `ThemeProvider`. Delete the equivalent slice from `StoreContext`. Keep the existing `getThemeClasses()` helper but relocate it to `providers/theme.tsx`.
2. **Toasts** → `ToastProvider`. Delete equivalent slice.
3. **Recently viewed / search query** → new `useRecentlyViewed` hook + (later) `SearchProvider`. Move out of `StoreContext`.
4. **Modals** (quickView, cart drawer, mobile menu, ai concierge, nextjs modal, seo modal) → already tightly coupled to layout/admin. Keep in `StoreContext` for now (admin chrome); just rename to `useUiChrome()` in Phase 4.
5. **Cart** → move cart *state* to `CartProvider`; keep `handleAddToCart` etc. as compatibility wrappers that delegate. Once all callers are migrated, delete the cart slice from `StoreContext`.
6. **Wishlists** → small new `useWishlists()` hook (Zustand-style or local Context) — only the components that own wishlist actions should touch it.
7. **Auth / user** → small `useCurrentUser()` hook. The auth modal still calls `sdk.customers.login/register` and stores the token, but current user state lives in the provider.
8. **Vendor apps / seller accounts / product submissions / offers** — these are admin-only and stay inside the admin module (they don't need a global context). Move them to `modules/account/components/vendorComplianceStore.ts` (Zustand-style, scoped to admin). Delete from `StoreContext`.
9. **Catalog (products/categories/brands/slides/settings)** — these are the props that server pages already pass down. Migrate them out of `StoreContext` into per-page props or a `useCatalog()` provider that lazily reads from `lib/data/*` on the client only when an admin mutation is needed. After migration, delete from `StoreContext`.

By the end of Phase 3 `StoreContext` is empty and deleted, alongside `context/index.ts` and the 6 dead contexts. **No component is rewritten during this phase** — the consumer-facing API of each provider matches what was previously accessed via `useStore()`.

**Verification at each sub-step:** dev server + visual diff.

---

### Phase 4 — Modules folder (UI regrouping, still no design change)

Move files into `modules/<feature>/` while preserving every JSX byte.

| Current location | New location |
|---|---|
| `components/home/*` | `modules/home/components/*` |
| `components/layout/*` (header, footer, footer trust, header/*) | `modules/layout/components/*` |
| `components/layout/StorefrontLayout.tsx` | `modules/layout/templates/storefront-layout.tsx` |
| `components/products/{ShopPage,CategoriesPage,CategoryDetailPage,ProductDetailPage,SearchResultsPage,WishlistPage,ProductReviews,VendorOffersBuyBox,QuickViewModal,RecentlyViewedSection,FlashDealsSection,CategoryProductCarousel,BestsellersTabSection,HomeLivingShowcase,TechElectronicsShowcase}.tsx` | `modules/products/{components,templates}/*` |
| `components/cart/{CartPage,CartDrawer}.tsx` | `modules/cart/{components,templates}/*` |
| `components/cart/CheckoutPage.tsx` | `modules/checkout/templates/checkout-page.tsx` (+ `actions.ts`) |
| `components/auth/AuthModal.tsx` | `modules/account/components/auth-modal.tsx` (auth is an account feature in the starter) |
| `components/account/{MyAccountPage,OrderTrackingPage}.tsx` | `modules/account/{components,templates}/*` |
| `components/seller/{SellerDashboard,StorefrontView}.tsx` | `modules/seller/{components,templates}/*` |
| `components/ai/AiConciergeModal.tsx` | `modules/ai/components/*` |
| `components/admin/*` (untouched in this migration) | `components/admin/*` (keep — admin is its own surface, not part of the storefront starter) |
| `components/pages/*` (about/contact/faq/policies) | `modules/content/templates/*` |
| `components/ui/{SafeImage,Toast,StockBadge,ThemeToggle,ErrorBoundary}.tsx` | `modules/common/components/*` |
| `components/ui/CodeViewer.tsx` (admin dev tool) | stays in `components/admin/` |
| `components/medusa/MedusaStatusBadge.tsx` | **delete** (orphan) |

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

| Item | Reason |
|---|---|
| `frontend/src/context/` (entire folder) | replaced by `providers/` |
| `frontend/src/hooks/useMedusa.ts` | replaced by `useCart`, `useRegion`, etc. |
| `frontend/src/services/` (was already removed) | `sdk` is the only client |
| `frontend/src/components/medusa/` | orphan |
| `frontend/src/utils/templateGenerator.ts`, `nextjsCodeGenerator.ts`, `frontendExportGenerator.ts` | orphan |
| `frontend/src/utils/safeStorage.ts` | orphan (we'll use a tiny new helper in `lib/utils/cookie.ts` and `lib/utils/safeLocalStorage.ts`) |
| Any local fallback paths inside `MedusaClient` that became dead once we always hit our backend | server fetchers return real data now |

Final typecheck + lint should drop the 228 warnings down to <30 (genuine design-file-only warnings).

---

## 4. Visual-design preservation checklist (apply at every phase)

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

## 5. Per-phase deliverables & validation

| Phase | Deliverable | Validation |
|---|---|---|
| 1 | `lib/sdk.ts` + `lib/data/*` + `types/medusa.ts` | typecheck, lint, dev server |
| 2 | `providers/{region,cart,theme,toast}.tsx` (pass-through) | dev server, manual UI spot-check |
| 3 | `StoreContext` deleted; 6 dead contexts deleted | typecheck, lint, dev server, all consumers still resolve |
| 4 | `modules/<feature>/{components,templates,actions}.ts` folders, `(main)` and `(checkout)` route groups | dev server, page-by-page visual diff |
| 5 | Server actions + cache tags + cookie-based cart id | end-to-end smoke tests (login, cart add/checkout, concierge, track order) |
| 6 | Dead code removed | typecheck + lint drop below 30 warnings, dev server clean |

---

## 6. Open decisions to confirm before starting Phase 1

1. **State library for the new providers.** The starter uses raw `createContext` + `useState`. We can either match that (zero new deps) or use **Zustand** for the global cross-cutting providers (cart, theme, toast) and Context for things that need React-only features (recently-viewed, search). Recommendation: **Context, no new deps.** Zustand only if Phase 3 reveals Context ergonomics are painful.
2. **Region / currency scope.** The starter scopes everything under `[countryCode]`. Our existing routing is flat. Phase 4 needs a decision: introduce `[countryCode]` (more invasive) or keep flat routes and treat `reg_za` as the single default region (less invasive, matches current behaviour). **Recommendation: keep flat, default to `reg_za` in `lib/constants.ts`** — minimal disruption, behaviour-identical.
3. **Middleware.** Not needed for this migration. Skip.
4. **Search.** Migrate to a real client-side search-as-you-type using the SDK + `unstable_cache` in Phase 4? Or leave `MOCK_WOO_PRODUCTS` filtering as-is? **Recommendation: leave as-is** to keep scope tight. Search UX is unchanged.

---

## 7. Risk register

| Risk | Mitigation |
|---|---|
| Accidental visual change during module moves | Phase 4 uses a git diff that filters out class strings / motion props before review |
| `StoreContext` has hidden consumers beyond `useStore` | The audit found 22 known consumers; Phase 3 adds an ESLint rule `no-restricted-imports` blocking new ones |
| Server actions returning different shapes than the existing direct calls | Each phase's smoke test exercises login → cart → checkout end-to-end |
| Phase 5 cookie migration breaks the existing `localStorage` cart | Run a one-time migration helper that copies `medusa_cart_id` into the new cookie on first request |
| Backend `/api/store/*` surface is missing endpoints the new providers need (e.g. `GET /store/carts/mine`, `POST /store/carts/:id/payment-sessions`, `POST /store/shipping-options`) | Audit before Phase 5 — add any missing routes to `backend/src/routes/store.ts` and controllers |

---

## 8. Out of scope (explicit)

- Visual redesign, colour tweaks, typography changes, motion choreography.
- Replacing Tailwind v4 with something else.
- Adding a real Medusa Node server.
- Internationalisation beyond the existing ZAR/USD dual region.
- Multi-vendor backend persistence (still localStorage-backed).
- Algolia/Meili integration.
- Stripe / payments beyond the existing simulated checkout.
- Production deployment changes.

---

**When approved, start with Phase 1.** Each phase ends with a green dev server, a clean `tsc --noEmit`, and a clean `eslint .` run.