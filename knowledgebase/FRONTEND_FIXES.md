# Frontend Fixes

> Status: Tracking fixes applied during the initial audit and cleanup.

| ID | Title | Status | Root Cause | Fix Applied | Source |
|---|---|---|---|---|---|
| FIX-001 | Remove loading shimmers / skeleton components | done | Incomplete rebrand from LuxeStore | Deleted `PageSkeleton.tsx`, removed shimmer CSS utilities, removed unused `Suspense` wrappers | Custom fix |
| FIX-002 | Fix Next.js 500 error on `/shop` route | done | Missing `loading.tsx` module | Removed `import ShopLoading from './loading'` and `Suspense` fallback from `shop/page.tsx` | Custom fix |
| FIX-003 | Remove page-transition skeleton overlay | done | Leftover `isPageTransitioning` state | Removed state, `useEffect`, and `<PageSkeleton page={currentPage} />` render from `App.tsx` | Custom fix |
| FIX-004 | Remove inline loading spinner from seller storefront | done | Unused `Suspense` wrapper in `store/[sellerId]/page.tsx` | Removed `Suspense` import and spinner JSX fallback | Custom fix |
| FIX-005 | Complete Mrbulk rebrand (LuxeStore → Mrbulk) | done | Partial rebrand left hardcoded LuxeStore strings | Replaced hardcoded emails, ZIP readme, and fallback values in `App.tsx`, `AdminPage.tsx`, `AuthModal.tsx`, `OrderTrackingPage.tsx`, `StoreContext.tsx` | Custom fix |
| FIX-006 | Clean up unused skeleton/loading imports | done | Dead imports after skeleton removal | Removed `HomePageSkeleton`, `CategoryDetailPageSkeleton`, `SearchResultsPageSkeleton` imports from their respective page files | Custom fix |
| FIX-007 | Fix JSX structure after skeleton removal | done | Orphaned fragments from bad merge | Removed stray `<>` / `</>` fragments in `App.tsx` main content block | Custom fix |
| FIX-008 | Run TypeScript type check | done | Type checking caught structural issues | `npx tsc --noEmit` passes with zero errors | Custom fix |
| FIX-009 | Verify dev server compiles and routes work | done | Build errors from missing modules | `npm run dev` compiles successfully; `/`, `/shop`, `/sell`, `/about` all return 200 | Custom fix |
