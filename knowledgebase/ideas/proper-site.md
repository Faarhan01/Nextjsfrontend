# How to Build a Proper Site in 2025-2026

> **Core principle:** A proper site is not built by prompting an AI once and publishing the output. It is built by combining modern tooling, a real design system, performance discipline, and content written for humans.

---

## 1. Technology Stack

| Layer | Recommended | Why |
|-------|-------------|-----|
| **Frontend framework** | Next.js 14+ (App Router) | Server Components, SSR/ISR, built-in image optimization, edge runtime |
| **Language** | TypeScript | Type safety, better DX, fewer runtime errors |
| **Styling** | Tailwind CSS v4 | Utility-first, design tokens via `@theme`, CSS custom properties, no config file needed |
| **Icons** | Lucide React | Consistent, tree-shakeable, same icon set used by v0.dev and major design systems |
| **Fonts** | Variable fonts (Inter, Playfair Display) | Single file, multiple weights, smaller bundle |
| **Hosting** | Vercel, Cloudflare Pages, or Netlify | Edge deployment, automatic CI/CD, preview deploys |
| **Database / CMS** | Sanity, Contentful, Supabase, or Prisma + Postgres | Structured content, not hardcoded in components |
| **Analytics** | Plausible, Mixpanel, or PostHog | Privacy-first, no cookie banners required |

### What to Avoid
- Client-side rendering for marketing/content pages
- Global state management for simple static content
- `localStorage` for auth tokens
- Monolithic single-page components with no module structure

---

## 2. Project Architecture

### Next.js App Router Structure (2026 Standard)

```
app/
  layout.tsx          # Root layout + metadata
  page.tsx            # Homepage
  about/
    page.tsx
  shop/
    page.tsx
    [slug]/
      page.tsx
  api/
    contact/
      route.ts
components/
  ui/                 # Atomic components (Button, Input, Card)
  sections/           # Page sections (Hero, FeaturedProducts, Testimonials)
  layout/             # Navbar, Footer, MobileMenu
lib/
  utils.ts
  constants.ts
  api.ts
public/
  images/
  fonts/
```

### Key Rules
- **Server Components by default** — zero client JS unless you add `'use client'`
- **Route groups** for organization: `(marketing)/`, `(shop)/`, `(auth)/`
- **Co-locate data fetching** with the component that needs it
- **Keep business logic in `/lib`** — not buried in components

---

## 3. Design System

A proper site has constraints. The difference between a v0.dev demo and a production site is a **design system**, not just utility classes.

### 3.1 Design Tokens (Tailwind v4)

```css
/* app/globals.css */
@theme {
  /* Colors — semantic, not decorative */
  --color-primary: #4F46E5;
  --color-secondary: #0F172A;
  --color-accent: #10B981;
  --color-background: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-text: #1E293B;
  --color-muted: #64748B;

  /* Typography scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* Spacing scale */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-24: 6rem;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

### 3.2 Typography System

| Role | Font | Weight | Size | Line Height |
|------|------|--------|------|-------------|
| Display / Hero | Serif or Display | 700-900 | 3xl-6xl | 1.1 |
| H1 | Sans-serif | 700-800 | 2xl-4xl | 1.2 |
| H2 | Sans-serif | 600-700 | xl-2xl | 1.3 |
| H3 | Sans-serif | 600 | lg-xl | 1.4 |
| Body | Sans-serif | 400-500 | base-lg | 1.6 |
| Caption | Sans-serif | 400-500 | xs-sm | 1.5 |

**Rules:**
- Max 2 typefaces per site (1 sans + 1 serif max)
- Use system font stack as fallback
- Set `font-feature-settings` for numerals if using variable fonts

### 3.3 Color System

| Token | Usage | WCAG Contrast (min) |
|-------|-------|---------------------|
| `primary` | CTAs, links, active states | 4.5:1 on background |
| `text` | Body text, headings | 4.5:1 on background |
| `muted` | Secondary text, captions | 4.5:1 on background |
| `surface` | Cards, modals, dropdowns | 3:1 against background |
| `border` | Dividers, outlines | 3:1 against background |

**Rules:**
- Never use color as the only indicator of state
- Test with [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- Support dark mode via CSS variables, not hardcoded values

---

## 4. Component Patterns

### 4.1 Atomic Design

```
components/
  atoms/
    Button.tsx
    Input.tsx
    Badge.tsx
    Icon.tsx
  molecules/
    SearchBar.tsx
    ProductCard.tsx
    TestimonialCard.tsx
  organisms/
    Navbar.tsx
    Footer.tsx
    Hero.tsx
    ProductGrid.tsx
  templates/
    PageLayout.tsx
    MarketingPage.tsx
    ShopPage.tsx
```

### 4.2 Component Rules

| Rule | Good | Bad |
|------|------|-----|
| **Single responsibility** | `ProductCard` renders one product | `ProductCard` handles cart, wishlist, compare, AND analytics |
| **Composition over props** | `<ProductCard><Badge>Sale</Badge></ProductCard>` | `<ProductCard badge="Sale" showBadge={true} />` |
| **Variant props** | `<Button variant="primary" size="md" />` | `<PrimaryButton />`, `<SecondaryButton />`, `<LargeButton />` |
| **No div soup** | `<section><nav>...</nav></section>` | `<div><div><div>...</div></div></div>` |
| **Accessible by default** | `<button aria-label="Close menu">` | `<div onClick={...}>` |

---

## 5. Performance Budgets

### Core Web Vitals Targets (2026)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | Time until biggest image/text renders |
| **INP** (Interaction to Next Paint) | ≤ 200ms | Responsiveness to user input |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Visual stability |

### Budget Rules

| Resource | Budget |
|----------|--------|
| Total JS (gzipped) | ≤ 400KB per page |
| Total CSS (gzipped) | ≤ 100KB per page |
| Images (total per page) | ≤ 2MB, use WebP/AVIF |
| Fonts | ≤ 200KB, subset if possible |
| Third-party scripts | ≤ 50KB, defer non-critical |

### Optimization Checklist

- [ ] Use `next/image` with `priority` for LCP image
- [ ] Lazy load below-the-fold images (`loading="lazy"`)
- [ ] Use `font-display: swap` for web fonts
- [ ] Preload critical fonts
- [ ] Enable Turbopack or Webpack bundle analysis
- [ ] Set `Cache-Control` headers for static assets
- [ ] Use `react.lazy` for heavy client components
- [ ] Avoid layout shifts: always set `width` and `height` on images

---

## 6. SEO & Content

### Essential SEO Features

| Feature | Implementation |
|---------|---------------|
| **Meta tags** | Next.js `Metadata` API in `layout.tsx` / `page.tsx` |
| **Canonical URLs** | `<link rel="canonical">` or `metadata.alternates.canonical` |
| **Open Graph** | `metadata.openGraph` for social sharing |
| **Structured data** | JSON-LD for Product, Organization, FAQ, Breadcrumb |
| **Sitemap** | `app/sitemap.ts` |
| **Robots.txt** | `app/robots.ts` |
| **Semantic HTML** | `<main>`, `<nav>`, `<article>`, `<section>`, proper heading hierarchy |
| **Internal linking** | Contextual links between related content |
| **Image alt text** | Descriptive, not decorative |

### Content Rules

| Rule | Good | Bad |
|------|------|-----|
| **Headings** | One H1 per page, logical hierarchy | Multiple H1s, skipped levels |
| **Paragraphs** | 1-3 sentences, focused topic | Walls of text, multiple ideas per paragraph |
| **Lists** | Used for scannable content | Dense prose where bullets work better |
| **Links** | Descriptive anchor text | "Click here", "Read more" |
| **Product descriptions** | Specific features, materials, dimensions | "Premium quality", "Best in class" |

### AI Content Detection Red Flags

Search engines and users can spot AI-generated content. Avoid these patterns:

- **Overused superlatives**: "cutting-edge", "state-of-the-art", "revolutionary", "game-changer"
- **Generic value statements**: "Premium curated selection", "Trusted by customers"
- **Templated lists**: Identical bullet patterns across every feature
- **Persona matrices**: "Plumbers & Electricians / Quote a job, send a professional invoice..."
- **Empty padding**: Sections that say nothing meaningful just to fill space
- **AI stock phrases**: "we build for your reality, not a Silicon Valley one"

**Write for humans.** If a sentence could appear on any other site in your industry, rewrite it.

---

## 7. Accessibility (WCAG 2.2 AA Minimum)

### Quick Checklist

| Requirement | Implementation |
|-------------|---------------|
| **Color contrast** | 4.5:1 for text, 3:1 for large text/UI |
| **Touch targets** | Minimum 24×24px, 48×48px preferred |
| **Focus indicators** | Visible outline, ≥ 3:1 contrast |
| **Keyboard navigation** | All interactive elements reachable via Tab |
| **Screen reader text** | `sr-only` for icon-only buttons |
| **Image alt text** | Descriptive for meaningful images, `alt=""` for decorative |
| **Form labels** | Every input has an associated `<label>` |
| **Error messages** | Linked to fields via `aria-describedby` |
| **Skip links** | "Skip to main content" for keyboard users |
| **Semantic HTML** | Use `<button>`, `<a>`, `<nav>`, `<main>`, not `<div>` soup |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Clickable `<div>` | Use `<button>` or `<a>` |
| Missing form labels | Add `<label htmlFor="email">` |
| Low contrast gray text | Use `--color-muted` that meets 4.5:1 |
| Auto-playing media | Never auto-play video/audio |
| Drag-only interactions | Add button alternative |

---

## 8. Security Essentials

| Area | Requirement |
|------|-------------|
| **HTTPS** | TLS 1.3, HSTS header, valid certificate |
| **CSP** | Content-Security-Policy header (even if permissive) |
| **Authentication** | HttpOnly secure cookies, short-lived tokens, refresh rotation |
| **Input validation** | Server-side validation, sanitize all user input |
| **Rate limiting** | On API routes, login, contact forms |
| **Dependencies** | `npm audit`, Dependabot, lock files committed |
| **Secrets** | Environment variables only, never in client code |
| **OWASP Top 10** | Review annually, especially injection, XSS, broken auth |

---

## 9. Internationalization (i18n) — If Needed

| Feature | Implementation |
|---------|---------------|
| **Routing** | `[lang]/` route groups or subdomains |
| **Content** | Locale JSON files or CMS with locale fields |
| **Dates/currency** | `Intl.DateTimeFormat`, `Intl.NumberFormat` |
| **Typography** | Allow for text expansion (German ~30% longer than English) |
| **RTL support** | `dir="rtl"` + logical CSS properties if targeting Arabic/Hebrew |

---

## 10. Testing Strategy

| Layer | Tool | What to Test |
|-------|------|-------------|
| **Unit** | Vitest / Jest | Utilities, helpers, pure functions |
| **Component** | Testing Library + Vitest | Rendering, user interactions, accessibility |
| **E2E** | Playwright / Cypress | Critical user flows (checkout, signup, search) |
| **Visual regression** | Playwright screenshots / Chromatic | Design consistency across breakpoints |
| **Performance** | Lighthouse CI, WebPageTest | Core Web Vitals in CI pipeline |
| **Accessibility** | axe-core, Lighthouse | WCAG compliance in CI |

---

## 11. Deployment & CI/CD

### Recommended Pipeline

1. **Push to branch** → Vercel/Netlify preview deploy
2. **Automated checks** → Lint, typecheck, test, Lighthouse
3. **PR review** → Human review required
4. **Merge to main** → Production deploy
5. **Post-deploy** → Smoke test, monitoring alerts

### Hosting Comparison

| Platform | Best For | Edge Runtime | Preview Deploys | Price |
|----------|----------|--------------|-----------------|-------|
| **Vercel** | Next.js apps, startups | ✅ Yes | ✅ Yes | Free tier, $20/mo pro |
| **Cloudflare Pages** | Static + edge functions | ✅ Yes | ✅ Yes | Free tier, $0-5/mo |
| **Netlify** | JAMstack, enterprise | ✅ Yes | ✅ Yes | Free tier, $19/mo pro |
| **Coolify** | Self-hosted, privacy | ❌ No | ❌ No | Free (self-hosted) |

**Rule:** Never deploy directly from a local machine. Use CI/CD.

---

## 12. Maintenance & Observability

| Practice | Tool/Approach |
|----------|---------------|
| **Error tracking** | Sentry, LogRocket |
| **Uptime monitoring** | UptimeRobot, Better Uptime |
| **Performance monitoring** | Vercel Analytics, SpeedCurve |
| **Real User Monitoring** | Plausible, PostHog |
| **Dependency updates** | Dependabot, Renovate |
| **Tech debt tracking** | Linear, GitHub Issues with `tech-debt` label |
| **Documentation** | README, CONTRIBUTING, inline code comments for complex logic |

---

## 13. Content Strategy

### Page Types Every Site Needs

| Page | Purpose | Minimum Content |
|------|---------|-----------------|
| **Homepage** | Value proposition, primary CTA | Hero, 3-4 feature highlights, social proof, CTA |
| **About** | Trust, story, team | Mission, history, team photos, values |
| **Services/Products** | What you sell | Categorized list, individual detail pages, pricing |
| **Contact** | Conversion point | Form, email, phone, address, map |
| **FAQ** | Reduce support burden | 8-12 questions addressing real objections |
| **Legal** | Compliance | Privacy policy, terms, refund policy |
| **404** | Error recovery | Navigation back to safety, search |

### Content Quality Checklist

- [ ] Every page has a unique `<title>` and `<meta description>`
- [ ] Headings follow logical hierarchy (H1 → H2 → H3)
- [ ] Images have descriptive `alt` text
- [ ] CTAs are action-oriented ("Get Started", not "Submit")
- [ ] Contact information is on every page (footer minimum)
- [ ] No placeholder content in production
- [ ] No Lorem Ipsum, no "123 Main Street" addresses

---

## 14. AI-Assisted Development (Proper Use)

AI tools are legitimate productivity multipliers **when used correctly**.

### What AI Is Good For

| Task | Tool | Prompt Strategy |
|------|------|-----------------|
| **Boilerplate** | Cursor, Copilot, Claude Code | "Create a Next.js 14 app router page with Tailwind for a product listing" |
| **Component variants** | v0.dev, Cursor | "Generate 3 card variants: default, featured, compact" |
| **Refactoring** | Cursor, Copilot | "Convert this to a Server Component" |
| **Tests** | Claude Code, Copilot | "Write Playwright tests for this checkout flow" |
| **Debugging** | Claude Code, Codex | Paste error + relevant code, ask for fix |

### What AI Is NOT Good For

| Task | Why | What to Do Instead |
|------|-----|-------------------|
| **Brand copy** | AI default copy is generic, detectable, and identical to competitors | Write it yourself or hire a copywriter |
| **Product descriptions** | AI generates "Premium quality", "Exceptional value" filler | Use actual specs, materials, dimensions |
| **About page** | AI origin stories all sound the same | Write your actual story with specific details |
| **Legal pages** | AI hallucinates incorrect legal language | Use a template from a lawyer or regulated source |
| **SEO content** | AI content is being devalued by search engines | Write E-E-A-T content from real experience |

### The Proper Workflow

```
Human: Defines requirements, writes copy, approves design
   ↓
AI: Generates boilerplate, component structure, test scaffolding
   ↓
Human: Reviews, refines, adds business logic, writes content
   ↓
AI: Suggests refactors, writes tests, finds bugs
   ↓
Human: Final review, accessibility check, performance audit
   ↓
Ship
```

---

## 15. Checklist: Is Your Site "Proper"?

Use this checklist before considering a site complete.

### Technical
- [ ] TypeScript with no `any` types
- [ ] Server Components used correctly (no unnecessary `'use client'`)
- [ ] Design tokens in `@theme`, not arbitrary values everywhere
- [ ] `next/image` used with proper `sizes` and `priority` attributes
- [ ] Fonts preloaded, no FOIT
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95
- [ ] Mobile-first responsive design tested on real devices
- [ ] Forms have labels, error states, and accessible validation

### Content
- [ ] Every page has unique meta title and description
- [ ] No AI-generated filler content
- [ ] Product descriptions include actual specifications
- [ ] About page has specific, human-written details
- [ ] Contact information visible on every page
- [ ] Legal pages are complete and accurate

### SEO
- [ ] Sitemap.xml and robots.txt configured
- [ ] Structured data (JSON-LD) for key pages
- [ ] Canonical URLs set
- [ ] Open Graph images configured
- [ ] Internal linking between related pages

### Security
- [ ] HTTPS enforced
- [ ] CSP header configured
- [ ] No secrets in client-side code
- [ ] Forms have CSRF protection
- [ ] Dependencies up to date, no critical vulnerabilities

### Operations
- [ ] Deployed via CI/CD, not manually
- [ ] Error monitoring configured
- [ ] Analytics installed
- [ ] Backup strategy in place
- [ ] Team has access to all services

---

## Summary: What Separates a Demo from a Production Site

| Demo (v0.dev without refinement) | Production Site |
|----------------------------------|-----------------|
| Generic placeholder content | Specific, brand-aligned copy |
| No design system | Centralized tokens + component library |
| All components client-side | Server-first rendering |
| No accessibility testing | WCAG 2.2 AA verified |
| Deployed once, forgotten | CI/CD, monitoring, updates |
| AI-generated everything | AI-assisted, human-approved |
| Works on desktop | Works on all devices, all browsers |
| Looks good for 5 minutes | Fast, stable, and secure for years |

**The sites that look "made with AI" are the ones where AI did the whole job. The sites that look professional are the ones where AI was a tool in the hands of someone who knew what they were building.**
