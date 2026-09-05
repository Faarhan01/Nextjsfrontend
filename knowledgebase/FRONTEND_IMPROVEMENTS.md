# Frontend Improvements

> Status: Planning phase. No improvements implemented yet.
> For the overall architecture plan and audit, see `plan.md`.

Use this file to track planned frontend work that is not a bug fix. Entries use `IMPROVE-NNN` numbering.

| ID | Title | Status | Priority | Notes |
|---|---|---|---|---|
| IMPROVE-001 | Split `App.tsx` into logical route segments | pending | Critical | 3728-line root component. Extract header, footer, modals, and each page into its own component. |
| IMPROVE-002 | Migrate catalog data to Server Components | pending | Critical | Products, categories, brands, slides should be fetched server-side, not from `StoreContext`. |
| IMPROVE-003 | Reduce `StoreContext` to ephemeral UI state only | pending | High | Keep cart, auth session, modals, toasts. Remove products, categories, brands, slides, settings. |
| IMPROVE-004 | Replace client-side routing with Next.js App Router | pending | High | `currentPage` state in `App.tsx` is redundant with Next.js routes. |
| IMPROVE-005 | Implement Server Actions for cart/checkout mutations | pending | High | Reduce client-side API calls and loading states. |
| IMPROVE-006 | Add proper loading skeletons (optional, lightweight) | pending | Low | If skeleton screens are desired, use minimal inline placeholders, not full page skeletons. |
| IMPROVE-007 | Add error boundaries per route section | pending | Medium | Prevent entire app crash from one component error. |
| IMPROVE-008 | Implement image optimization (next/image) | pending | Medium | Replace `<img>` with `next/image` for automatic WebP/AVIF and lazy loading. |
| IMPROVE-009 | Add `SafeImage` component as wrapper | pending | Medium | Handle broken images, fallbacks, and lazy loading consistently. |
| IMPROVE-010 | Extract theme system into reusable hook | pending | Medium | `getThemeClasses` logic in `StoreContext` should be a standalone hook. |
| IMPROVE-011 | Add `cn()` utility for class merging | pending | Low | Use `clsx` + `tailwind-merge` for conditional classes. |
| IMPROVE-012 | Consolidate duplicate `handleX` / `onX` function pairs | pending | Medium | `StoreContext` exports aliases like `handleAddToCart` + `onAddToCart`. Keep one. |
| IMPROVE-013 | Add TypeScript strict mode | pending | Medium | Enable `strict: true` in `tsconfig.json` and fix errors. |
| IMPROVE-014 | Add ESLint + Prettier config | pending | Medium | Enforce code style automatically. |
| IMPROVE-015 | Add unit tests for utilities | pending | Medium | `pricing.ts`, `seoUtils.ts`, `productRating.ts`. |
| IMPROVE-016 | Add E2E tests for critical flows | pending | Medium | Browse → Add to cart → Checkout → Order confirmation. |
| IMPROVE-017 | Implement offline detection + retry | pending | Low | Show banner when offline, retry failed requests. |
| IMPROVE-018 | Add PWA manifest + service worker | pending | Low | `manifest.webmanifest` exists but no SW. |
| IMPROVE-019 | Add skeleton screens for AI concierge | pending | Low | Show loading state while waiting for Gemini response. |
| IMPROVE-020 | Optimize `presets.ts` bundle size | pending | Medium | 913 lines of inline mock data. Move to JSON or fetch from API. |

---

## Frontend Fixes

| ID | Title | Status | Root Cause | Fix Applied | Source |
|---|---|---|---|---|---|
| FIX-001 | Remove loading shimmers / skeleton components | done | Incomplete rebrand from LuxeStore | Deleted `PageSkeleton.tsx`, removed shimmer CSS, removed unused `Suspense` wrappers | Custom fix |
| FIX-002 | Fix Next.js module not found for `shop/loading` | done | Missing `loading.tsx` file | Removed import and `Suspense` wrapper from `shop/page.tsx` | Custom fix |
| FIX-003 | Remove page-transition skeleton from App.tsx | done | Leftover from previous skeleton system | Removed `isPageTransitioning` state and `PageSkeleton` render | Custom fix |
| FIX-004 | Remove inline spinner from store/[sellerId]/page.tsx | done | Leftover loading state | Removed `Suspense` wrapper and spinner JSX | Custom fix |
| FIX-005 | Complete Mrbulk rebrand (luxestore → mrbulk) | done | Incomplete rebrand | Replaced hardcoded emails, strings, and fallbacks across 6 files | Custom fix |
| FIX-006 | Remove stray JSX fragments from App.tsx refactor | done | Bad merge during skeleton removal | Removed orphaned `<>` and `</>` fragments | Custom fix |
| FIX-007 | Fix TypeScript errors in App.tsx after skeleton removal | done | Type checking caught JSX issues | `npx tsc --noEmit` passes clean | Custom fix |
