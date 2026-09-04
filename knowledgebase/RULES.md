# Editing Rules — Mrbulk Codebase

These rules ensure safe, production-ready changes without breaking the hybrid Express + Next.js architecture or the Mrbulk design system.

---

## Golden Rules

### 1. Never Break the Mrbulk Design System

All colors, radii, shadows, and typography are defined in `frontend/src/index.css` and `frontend/src/app/layout.tsx`. Never inline brand colors or hardcode theme values in components. Always use `currentTheme` from `StoreContext` or CSS custom properties.

### 2. MedusaJS-Ready Frontend Architecture

The frontend is structured cleanly to prepare for a headless MedusaJS backend:
- Store operations (products, cart, checkout, categories) map to Medusa Store API conventions.
- A typed Medusa client abstraction layer (`frontend/src/lib/medusa`) provides standard endpoints (`/store/*`) with instant fallback to local presets for rapid UI/UX frontend iteration.

### 3. Server Components First, Client Components Second

Next.js 16 App Router defaults to Server Components. Only add `'use client'` when you need:
- React state (`useState`, `useEffect`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)

Never mark a Server Component `async` — only client components can use hooks. Never mark a Client Component `async` — it returns a Promise, not JSX.

### 4. Use Relative API Paths

Client-side API calls must use relative URLs (`/api/...`), not hardcoded origins. Server-side code must use `process.env.NEXT_PUBLIC_SITE_URL` or auto-detection.

### 5. Code Style & Architecture

- Import ordering: React → third-party → internal → types.
- Indentation: 2 spaces.
- No explanatory comments in code unless explicitly requested.
- Use `cn()` utility for conditional class composition (when available).
- Use `async/await` consistently. No `.then()` chains in new code.

### 6. Keep `StoreContext` Lean

`StoreContext` holds UI state and Medusa store synchronization:
- Cart, wishlist, modals, auth session, theme preference, toast notifications.

### 7. Data Persistence

- Theme preference (`darkMode`)
- Recently viewed IDs
- UI customization state
- Cart contents and orders (handled via Medusa client or local storage fallback)

### 8. Security

- Validate all input.
- Keep secrets (`JWT_SECRET`, `STRIPE_SECRET_KEY`) in `.env` only.
- Add CORS headers if the frontend and backend will be served from different origins.

### 10. Testing & Verification

- Run `npx tsc --noEmit` after every TypeScript change.
- Run `npm run dev` and manually verify the route you changed.
- Use `curl -i http://localhost:3000/api/products` to verify API responses.
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
