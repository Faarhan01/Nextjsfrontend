# Site Sections & Pages Styling Architecture

This directory contains comprehensive styling, layout, typography, and interactive documentation for every major page, section, and component in the **Mrbulk / LuxeStore** storefront. It serves as the primary technical reference for how design tokens, Tailwind CSS utility layers, Medusa UI standards, and responsive geometry are applied throughout the platform.

---

## 📑 Section & Page Directory

### Core Global Shell & Layout
| Documentation File | Target Section / Feature | Primary Components |
| :--- | :--- | :--- |
| **[`header.md`](./header.md)** | Store Header & Sticky Navigation Bar | `StoreHeader`, `DesktopNavLinks`, `HeaderActions`, `MobileNavDrawer` |
| **[`header-dropdowns.md`](./header-dropdowns.md)** | Dropdowns, Megamenus & Search Overlays | `CategoriesDropdown`, `CompanyDropdown`, `UserMenuDropdown`, `HeaderSearch`, `SearchMegamenuOverlay`, `CountrySelect` |
| **[`footer.md`](./footer.md)** | Store Footer & Customer Trust Section | `Footer`, `FooterTrustCarousel`, `FooterBrandCard`, `FooterLinksGrid`, `FooterNewsletter`, `FooterBottomBar` |

### Primary Shopping & Catalog Pages
| Documentation File | Route / Section | Primary Components |
| :--- | :--- | :--- |
| **[`home-page.md`](./home-page.md)** | `/` (Home Showcase) | `HomePageClient`, `HeroBanner`, `PromoBannersGrid`, `TestimonialsSection`, Featured Deals |
| **[`shop-catalog-page.md`](./shop-catalog-page.md)** | `/shop` (Product Catalog) | `ShopPageTemplate`, `PaginatedProducts`, Filter Sidebar, Sort Controls, View Mode Switcher |
| **[`product-detail-page.md`](./product-detail-page.md)** | `/product/[id]` (Product Details) | `ProductDetailPage`, Image Gallery, Variant Selector, Tier Pricing, Mobile Sticky Action Bar |
| **[`categories-page.md`](./categories-page.md)** | `/categories` (Department Directory) | `CategoriesPageTemplate`, Category Bento Grid, Department Cards, Item Count Badges |
| **[`category-detail-page.md`](./category-detail-page.md)** | `/category/[slug]` (Category Detail) | `CategoryDetailPage`, Subcategory Filter Chips, Breadcrumb Trails, Curated Grids |

### E-Commerce Flow & Conversion Pages
| Documentation File | Route / Section | Primary Components |
| :--- | :--- | :--- |
| **[`cart-and-drawer.md`](./cart-and-drawer.md)** | `/cart` & Slide-over Drawer | `CartPageTemplate`, Slide-over Cart Drawer, Line Items, Free Shipping Progress Bar |
| **[`checkout-page.md`](./checkout-page.md)** | `/checkout` (Multi-Step Checkout) | `CheckoutPage`, Step Cards, Address Forms, Shipping Radio Cards, Payment Tabs, Order Summary |
| **[`wishlist-page.md`](./wishlist-page.md)** | `/wishlist` (Saved Products) | `WishlistPageTemplate`, Saved Item Cards, Batch Add-to-Cart, Stock Alerts |
| **[`search-page.md`](./search-page.md)** | `/search` (Dedicated Search) | `SearchResultsPage`, Live Search Input, Faceted Filters, Autocomplete Chips |

### Customer Account & Logistics Pages
| Documentation File | Route / Section | Primary Components |
| :--- | :--- | :--- |
| **[`account-page.md`](./account-page.md)** | `/account` (User Dashboard) | `MyAccountPage`, Account Sidebar, Order History, Address Book, Security Forms |
| **[`order-tracking-page.md`](./order-tracking-page.md)** | `/order-tracking` (Live Delivery) | `OrderTrackingPage`, Tracking Input Form, 4-Stage Stepper, Live Courier Status Card |

### Content & Informational Pages
| Documentation File | Route / Section | Primary Components |
| :--- | :--- | :--- |
| **[`about-page.md`](./about-page.md)** | `/about` (Company Story) | `AboutTemplate`, Stats Grid, Core Mission Cards, Leadership Highlights |
| **[`contact-page.md`](./contact-page.md)** | `/contact` (Support & Inquiries) | `ContactTemplate`, Support Contact Cards, Interactive Message Form |
| **[`faq-page.md`](./faq-page.md)** | `/faq` (Help & Questions) | `FaqTemplate`, Category Accordions, Expandable Questions, Search Bar |
| **[`policy-pages.md`](./policy-pages.md)** | `/terms-and-conditions`, `/privacy-policy`, `/returns-policy`, `/seller-policy` | Legal Markdown Templates, Constrained Reading Width (`65-75ch`), Structured Lists |

---

## 🎨 Global Styling Conventions Quick Reference

Across all pages and sections, the storefront enforces strict architectural standards:

1. **Tailwind Layer Encapsulation**: Custom rules belong to `@layer base`, `@layer components`, or `@layer utilities` in `/frontend/src/app/globals.css`.
2. **Medusa Class Utility (`clx`)**: All dynamic classes are combined using `clx` (or `cn`) from `@/lib/util/clx` with `tailwind-merge` conflict prevention.
3. **Card & Surface Standardization**: All primary cards, sheets, and modal surfaces standardize on `rounded-2xl` (`16px`), `.card-base` or `.surface-card`, and `var(--card-shadow)`.
4. **Golden Button Padding**: Button horizontal padding is strictly twice vertical padding (`px-3 py-1.5`, `px-4 py-2`, `px-6 py-3`).
5. **No Layout Shift**: Live numerical updates (stock counters, countdown timers, prices, cart totals) use tabular numbers (`font-variant-numeric: tabular-nums` or `.price-tag`).
6. **Accessible Contrast**: Foreground and background combinations strictly pass WCAG AA standards in both light (`:root`) and dark (`.dark`) modes.
