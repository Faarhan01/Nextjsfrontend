# Frontend Audit & Improvement Plan

> Status: Frontend-only mode active. Backend removed. Implementation pending approval.

This document captures the deep architecture audit of the Mrbulk frontend against the MedusaJS starter storefront, with prioritized improvements to make the codebase production-grade while preserving the existing Mrbulk design system.

---

## 1. Executive Summary

The Mrbulk frontend has a strong design system and rich feature set, but its architecture still behaves like a single-page React app inside Next.js App Router. The MedusaJS starter storefront shows a cleaner pattern: thin server routes, real data layer, reusable modules, and proper metadata/loading/error boundaries.

**Current direction:** Frontend-only mode. The Express backend has been removed. All data comes from local mock presets (`frontend/src/data/presets.ts`) and in-memory storage. The Medusa client is configured for offline/mock mode by default.

**Bottom line:** The design is good. The plumbing is not. The fastest path is to keep the current UI/components and refactor the routing/data/state layer to match Next.js best practices.

---

## 2. Codebase Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Frontend src size | ~2.5 MB | 126 `.ts/.tsx` files |
| Backend src size | ~66 KB | REMOVED — frontend-only mode |
| Largest file | `StoreContext.tsx` | 1,377 lines — single context mixing 10+ domains |
| Dead SPA shell | `App.tsx` | REMOVED |
| Inline mock data | `presets.ts` | 914 lines, 42 KB of hardcoded catalog — now the primary data source |
| GTM/analytics | `gtm.ts` | 505 lines of GA4 ecommerce tracking |
| Medusa client | `lib/medusa/client.ts` | 542 lines, offline/mock mode by default |
| Lint warnings | 356 | 0 errors; mostly pre-existing unused imports |

---

## 3. Architecture Comparison

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

## 4. Backend Analysis

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

## 5. Medusa Integration Layer

| Area | Current State | Assessment |
|------|---------------|------------|
| **Client** | `frontend/src/lib/medusa/client.ts` — offline/mock mode by default (`NEXT_PUBLIC_FRONTEND_ONLY=true`) | Solid dual-mode design; auto-falls back to local presets |
| **Types** | `frontend/src/lib/medusa/types.ts` | Complete Medusa v2 Store API shapes |
| **Transformers** | `frontend/src/lib/medusa/transformers.ts` | Bidirectional adapters between Medusa ↔ UI models |
| **Hook** | `frontend/src/hooks/useMedusa.ts` | Provides `cart`, `addToCart`, `isLiveBackend` |
| **Env** | `NEXT_PUBLIC_MEDUSA_BACKEND_URL=` (empty) + `NEXT_PUBLIC_FRONTEND_ONLY=true` | Frontend-only mode |
| **Status badge** | `frontend/src/components/medusa/MedusaStatusBadge.tsx` | Dev-only health indicator |

**Assessment:** The Medusa integration layer is well-architected and ready. In frontend-only mode, it uses local mock data exclusively. The main gap is that the rest of the frontend doesn’t use it yet — most pages still read from `StoreContext`/localStorage instead of the Medusa client.

---

## 6. Configuration & Deployment

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

## 7. What’s Already Good

- Design system is strong: consistent Tailwind, theme tokens, dark mode, animations
- Feature set is rich: quick view, AI concierge, admin/exporter, wishlists, vendor ecosystem, GTM, SEO inspector
- `frontend/src/lib/data/` created with `home.ts`, `products.ts`, `categories.ts`, `brands.ts`
- `/`, `/shop`, `/product/[id]`, `/cart` split into server + client with proper metadata
- Medusa client layer is complete with dual-mode live/design fallback
- Dev server is stable; all major routes return 200
- No Payload CMS remnants; clean dependency tree
- Backend Express API is functional for AI, feeds, orders, auth

---

## 8. Recommended Improvements

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

## 9. Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Breaking existing UI during refactor | High | Medium | Keep all components/styles intact; change routing/data layer only |
| `App.tsx` removal hides hidden dependencies | Medium | Low | Audit all imports of `App.tsx` first; it is not imported anywhere in `src/app/` |
| StoreContext split causes prop drilling | Medium | Medium | Use nested providers at layout level, not deep prop drilling |
| Medusa backend schema mismatch | Medium | Medium | Use transformers (`lib/medusa/transformers.ts`) as adapter layer |
| Deployment URL hardcoding breaks previews | High | High | Fix env config before any deploy changes |

---

## 10. Recommended Execution Order

### Phase 1: Foundation (Week 1)
1. Remove dead `App.tsx`
2. Fix `next.config.mjs` — enable strict mode, remove `ignoreBuildErrors`
3. Remove hardcoded deployment URL from `layout.tsx`
4. Add path aliases to `tsconfig.json`
5. Standardize remaining routes to server + client split with metadata

### Phase 2: State & Data (Week 2)
6. Split `StoreContext` into `CartContext`, `WishlistContext`, `AuthContext`, `UIContext`
7. Migrate all pages to use new contexts + `lib/data/` layer
8. Add `notFound()` to server pages
9. Add per-route `loading.tsx` and `error.tsx`

### Phase 3: Medusa Integration (Week 3-4)
10. Replace `presets.ts` data with calls to Express `/api/*` routes
11. Wire up Medusa client in server components
12. Add `generateStaticParams` for categories and policies
13. Connect cart/checkout to Medusa Store API

### Phase 4: Polish (Week 5+)
14. Move feature blocks into `src/modules/**`
15. Add route groups for layout sharing
16. Bundle audit and performance optimization
17. Add CI/CD and Docker

---

## 11. Quick Wins (< 1 day each)

1. Delete `App.tsx`
2. Fix `next.config.mjs`
3. Remove hardcoded URL from `layout.tsx`
4. Add path aliases
5. Add `notFound()` to `/product/[id]`
6. Add `loading.tsx` skeletons for `/shop`, `/product/[id]`, `/cart`

---

## 12. Next Steps

1. Confirm this plan aligns with priorities
2. Approve which phase to start with
3. Proceed with Phase 1 quick wins first, then page-by-page refactor keeping all existing UI/styles intact

---

## 13. Frontend-Only Mode Notes

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
