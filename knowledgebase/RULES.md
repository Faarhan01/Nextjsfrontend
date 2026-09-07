# Editing Rules — Mrbulk Codebase

These rules ensure safe, production-ready changes without breaking the Next.js architecture or the Mrbulk design system.

---

## Golden Rules

### 1. Never Break the Mrbulk Design System

All colors, radii, shadows, and typography are defined in `frontend/src/index.css` and `frontend/src/app/layout.tsx`. Never inline brand colors or hardcode theme values in components. Always use `currentTheme` from context or CSS custom properties.

### 2. MedusaJS-Ready Frontend Architecture

The frontend is structured cleanly to prepare for a headless MedusaJS backend:
- Store operations (products, cart, checkout, categories) map to Medusa Store API conventions.
- A typed Medusa client abstraction layer (`frontend/src/lib/medusa`) provides standard endpoints (`/store/*`) with instant fallback to local presets for rapid UI/UX frontend iteration.

### 3. Server Components First, Client Components Second

Next.js 16 App Router defaults to Server Components. Only add `'use client'` when you need:
- React state (`useState`, `useEffect`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)

Prefer Server Components for static content like footer links, policy pages, and about pages. Use Client Components only for interactive elements like cart, wishlist, search, and modals.

### 4. Use Static Data Wherever Possible

Before adding a new backend endpoint or schema change, ask: **Can this be static?**

Static content that does NOT require backend changes:
- Footer navigation links (Shopping, User, Company, Policies)
- Policy page content (Privacy Policy, Terms & Conditions, Returns Policy)
- About/Contact/FAQ pages
- Feature badges, trust carousels, payment method badges
- Newsletter signup (can use toast notification without backend)
- Seller policy page

Static content should be rendered as Server Components with hardcoded data. Only add backend/schema changes when content must be dynamic (e.g., user-specific data, real-time inventory, orders).

### 5. Follow MedusaJS Code Structure and Styling

When building or refactoring components, follow the MedusaJS storefront pattern:
- **Module structure:** Use `frontend/src/@modules/{feature}/{components,templates,actions}` for feature modules.
- **Component size:** Keep components small and focused. A component should do one thing well.
- **Naming:** Use descriptive names like `FooterBrandCard`, `FooterLinksGrid`, `HeaderSearch` instead of generic names.
- **Server vs Client:** Follow Medusa's pattern of Server Component shells with Client Component children for interactivity.
- **Tailwind classes:** Use Medusa's utility-first approach with semantic class names. Avoid overly custom CSS when Tailwind utilities suffice.
- **Data fetching:** Use Medusa's pattern of `async` Server Components for data fetching, with Suspense boundaries for loading states.

### 6. Keep Mrbulk Design, Use MedusaJS Code Style

You can adopt MedusaJS code structure and patterns while keeping the Mrbulk visual design:
- **Keep:** Mrbulk color scheme, theme system, typography, spacing, animations, and component styling.
- **Adopt:** MedusaJS folder structure, component composition patterns, Server Component first approach, and naming conventions.
- **Do NOT:** Change the Mrbulk design to match Medusa's default UI unless explicitly requested.

### 7. Use Relative API Paths

Client-side API calls must use relative URLs (`/api/...`), not hardcoded origins. Server-side code must use `process.env.NEXT_PUBLIC_SITE_URL` or auto-detection.

### 8. Code Style & Architecture

- Import ordering: React → third-party → internal → types.
- Indentation: 2 spaces.
- No explanatory comments in code unless explicitly requested.
- Use `cn()` utility for conditional class composition (when available).
- Use `async/await` consistently. No `.then()` chains in new code.

### 9. Backend Changes Only When Absolutely Necessary

Before modifying backend code or database schema:
1. Can the feature be implemented with static data or client-side state?
2. Can it use existing API endpoints with different parameters?
3. Is the change required for core functionality, or is it a nice-to-have?

Only modify backend code when:
- The feature requires persistent data storage
- The feature requires real-time data synchronization
- The feature requires server-side validation or processing
- Static/static alternatives are not feasible

### 10. Testing & Verification

- Run `node node_modules/typescript/bin/tsc --noEmit` after every TypeScript change.
- Run `npm run dev` and manually verify the route you changed.
- Do not ship `TODO` or `FIXME` comments. Record incomplete work in `BACKEND_IMPROVEMENTS.md` or `FRONTEND_IMPROVEMENTS.md`.

### 11. Git Workflow

- Use terminal git commands (VS Code Source Control panel may stale on OneDrive).
- Commit messages: `feat:`, `fix:`, `refactor:`, `audit:`, `docs:`.
- Never commit `.env` or `node_modules`.
- Keep commits under 200 lines when possible.

### 12. Revert Failed Changes Immediately

If a change breaks the build or dev server, revert it before trying a different approach. Do not layer fixes on top of broken state.

### 13. Dark Mode Uses `data-theme`, Not `.dark`

All dark mode styles target `[data-theme="dark"]`. Do not use Tailwind's `.dark:` prefix. The site does not use the `.dark` class on `<html>`.

### 14. Use CSS Variables for Theme Colors

Components must use `currentTheme` from context or CSS variables (`bg-background`, `text-foreground`). Never hardcode `bg-blue-600` or `text-slate-900` in reusable components.

### 15. Keep the Multi-Vendor Model

Mrbulk is a marketplace, not a single-vendor store. All schema changes must support:
- Multiple sellers per product
- Seller-specific offers/pricing
- Commission tracking
- Seller verification workflows

Do not simplify to a single-vendor model even if it seems easier.

---

## Knowledgebase as Source of Truth

Before making any change, read the relevant knowledgebase files:
- `AUDIT.md` — current state and gaps
- `CONTEXT.md` — tech stack, key routes, env vars
- `BACKEND_IMPROVEMENTS.md` / `FRONTEND_IMPROVEMENTS.md` — planned work
- `site-structure/` — how components, collections, and routes are organized

Record fixes in `BACKEND_FIXES.md` / `FRONTEND_FIXES.md` (create if missing). Record improvements in `BACKEND_IMPROVEMENTS.md` / `FRONTEND_IMPROVEMENTS.md`.
