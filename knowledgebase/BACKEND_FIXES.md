# Backend Fixes

> Status: Tracking fixes applied during the initial audit and cleanup.

| ID | Title | Status | Root Cause | Fix Applied | Source |
|---|---|---|---|---|---|
| FIX-001 | Remove hardcoded `admin@luxestore.com` fallback emails | done | Rebrand from LuxeStore to Mrbulk | Replaced with `admin@mrbulk.co.za` / `customer@mrbulk.co.za` across AdminPage, AuthModal, OrderTrackingPage | Custom fix |
| FIX-002 | Fix Next.js module not found for `shop/loading` | done | Missing `loading.tsx` file in `app/shop/` | Removed `import ShopLoading from './loading'` and `Suspense` wrapper from `shop/page.tsx` | Custom fix |
| FIX-003 | Remove page-transition skeleton from `App.tsx` | done | Leftover from previous skeleton removal attempt | Removed `isPageTransitioning` state, `useEffect`, and `<PageSkeleton>` render block | Custom fix |
| FIX-004 | Remove inline spinner from `store/[sellerId]/page.tsx` | done | Leftover `Suspense` wrapper with spinner | Removed `Suspense` import and wrapper, returning `<StorefrontContent />` directly | Custom fix |
| FIX-005 | Complete Mrbulk rebrand (LuxeStore → Mrbulk) | done | Incomplete rebrand after initial rename | Replaced hardcoded strings in `App.tsx` (ZIP export), `StoreContext.tsx` (logo check), `AdminPage.tsx` (emails), `AuthModal.tsx` (admin email + placeholder), `OrderTrackingPage.tsx` (fallback email) | Custom fix |
| FIX-006 | Remove unused `Suspense` / skeleton imports from app pages | done | Dead imports after skeleton removal | Removed unused imports from `shop/page.tsx`, `product/[id]/page.tsx`, `category/[slug]/page.tsx`, `search/page.tsx` | Custom fix |
| FIX-007 | Fix stray JSX fragments after skeleton removal | done | Bad merge during refactor | Removed orphaned `<>` / `</>` fragments in `App.tsx` around the main content block | Custom fix |
| FIX-008 | Delete unused `PageSkeleton.tsx` component | done | 1620-line file no longer used | Deleted `frontend/src/components/ui/PageSkeleton.tsx` and removed shimmer/skeleton CSS from `index.css` | Custom fix |
| FIX-009 | Run TypeScript type check and fix errors | done | Type checking caught JSX issues after refactor | `npx tsc --noEmit` passes with zero errors | Custom fix |
