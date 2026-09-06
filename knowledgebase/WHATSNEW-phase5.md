Phase 5 refactor: split StoreContext into CatalogProvider + UIProvider + facade.

## What Changed
- **Created `providers/catalog-provider.tsx`**: Owns catalog state (products, categories, brands, slides, settings) + multi-vendor admin state (vendorApplications, sellerAccounts, productSubmissions) + all admin mutation handlers + localStorage hydration/persistence + GTM init.
- **Created `providers/ui-provider.tsx`**: Owns UI state (modals/drawers: quickView, cart, mobileMenu, aiConcierge, nextjsModal, seoModal; customizer panel; search query + navigation).
- **Refactored `context/StoreContext.tsx`**: Now 330 lines (was 750) — pure facade. `StoreProvider` composes `useCatalog()` + `useUI()` + theme/toast/cart/wishlist/recentlyViewed/auth providers, re-exports the unified `useStore()` interface. No interface change for 24 consumers.
- **Updated `providers/app-providers.tsx`**: Composes new provider tree: Theme→Toast→Cart→Wishlist→RecentlyViewed→Auth→Catalog→UI.
- **Simplified `providers/auth.ts`**: Removed unused `openAuthModal`/`closeAuthModal` from `UseAuthReturn` — replaced with raw `setAuthModalOpen`/`setAuthModalTab` (no consumers used the old methods).
- **Updated `providers/auth-provider.tsx`**: Exposes `setAuthModalOpen`/`setAuthModalTab` directly on context value.
- Also fixes:
  - Hardcoded Google Cloud Run URL removed from `sitemap.ts` and `robots.ts` (→ `http://localhost:3000` fallback per env).
  - All `app/*` routes now use `app/(main)/` group transparently (URLs unchanged).
  - Normalized all `app/*` imports to absolute aliases.

## Verification
- `tsc --noEmit`: clean
- `bun run lint`: 0 errors, 227 warnings (down from 231 — refactored code has fewer unused imports)
- All 22 valid routes return 200. `/404` route intentionally errors (conflicts with Next.js built-in `not-found.tsx`; should be removed per plan #8)

## Next
- Phase 6 (or plan #11-12): loading.tsx/error.tsx per route + route groups for admin
- Plan #8: Remove `app/404` directory (conflicts with `app/not-found.tsx`)
- Optionally add `loading.tsx` skeleton components per plan #7