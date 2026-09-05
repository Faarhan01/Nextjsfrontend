# Second-pass rewrite for modules/ files (and providers/).
# Adds patterns: PascalCase cross-folder imports, /header/ subfolder split,
# @/components alias, store-header imports, sibling PascalCase, 3-level deep ui imports.

$moduleFiles = Get-ChildItem -Path 'frontend/src/modules' -Recurse -Include *.tsx, *.ts
$providerFiles = Get-ChildItem -Path 'frontend/src/providers' -Recurse -Include *.tsx, *.ts
$files = @($moduleFiles + $providerFiles)
Write-Host "Processing $($files.Count) files"

$replacements = @(
  # --- @/components/... alias (old alias used in home-page-client.tsx) ---
  @{ From = "from '@/components/ui/SafeImage'";                To = "from '@modules/common/components/safe-image'" },
  @{ From = "from '@/components/ui/Toast'";                    To = "from '@modules/common/components/toast'" },
  @{ From = "from '@/components/ui/StockBadge'";               To = "from '@modules/common/components/stock-badge'" },
  @{ From = "from '@/components/ui/ThemeToggle'";              To = "from '@modules/common/components/theme-toggle'" },
  @{ From = "from '@/components/ui/ErrorBoundary'";            To = "from '@modules/common/components/error-boundary'" },
  @{ From = "from '@/components/home/CategoryBarCarousel'";    To = "from '@modules/home/components/category-bar-carousel'" },
  @{ From = "from '@/components/home/HeroBanner'";             To = "from '@modules/home/components/hero-banner'" },
  @{ From = "from '@/components/layout/PromoBannersGrid'";     To = "from '@modules/layout/components/promo-banners-grid'" },
  @{ From = "from '@/components/layout/FooterTrustCarousel'";  To = "from '@modules/layout/components/footer-trust-carousel'" },
  @{ From = "from '@/components/layout/StoreHeader'";          To = "from '@modules/layout/components/store-header'" },
  @{ From = "from '@/components/layout/StoreFooter'";          To = "from '@modules/layout/components/store-footer'" },
  @{ From = "from '@/components/layout/TestimonialsSection'";  To = "from '@modules/layout/components/testimonials-section'" },
  @{ From = "from '@/components/layout/NewsletterSection'";    To = "from '@modules/layout/components/newsletter-section'" },
  @{ From = "from '@/components/layout/TrustBadgesBar'";       To = "from '@modules/layout/components/trust-badges-bar'" },
  @{ From = "from '@/components/cart/CartDrawer'";             To = "from '@modules/cart/components/cart-drawer'" },
  @{ From = "from '@/components/cart/CheckoutPage'";           To = "from '@modules/checkout/templates/checkout-page'" },
  @{ From = "from '@/components/products/FlashDealsSection'";   To = "from '@modules/products/components/flash-deals-section'" },
  @{ From = "from '@/components/products/BestsellersTabSection'"; To = "from '@modules/products/components/bestsellers-tab-section'" },
  @{ From = "from '@/components/products/CategoryProductCarousel'"; To = "from '@modules/products/components/category-product-carousel'" },
  @{ From = "from '@/components/products/TechElectronicsShowcase'"; To = "from '@modules/products/components/tech-electronics-showcase'" },
  @{ From = "from '@/components/products/HomeLivingShowcase'";  To = "from '@modules/products/components/home-living-showcase'" },
  @{ From = "from '@/components/products/QuickViewModal'";     To = "from '@modules/products/components/quick-view-modal'" },
  @{ From = "from '@/components/products/ProductReviews'";      To = "from '@modules/products/components/product-reviews'" },
  @{ From = "from '@/components/products/VendorOffersBuyBox'"; To = "from '@modules/products/components/vendor-offers-buy-box'" },
  @{ From = "from '@/components/products/RecentlyViewedSection'"; To = "from '@modules/products/components/recently-viewed-section'" },
  @{ From = "from '@/components/account/AuthModal'";           To = "from '@modules/account/components/auth-modal'" },
  @{ From = "from '@/components/account/MyAccountPage'";       To = "from '@modules/account/templates/my-account-page'" },
  @{ From = "from '@/components/account/OrderTrackingPage'";   To = "from '@modules/account/templates/order-tracking-page'" },
  @{ From = "from '@/components/seller/SellerDashboard'";      To = "from '@modules/seller/templates/seller-dashboard'" },
  @{ From = "from '@/components/seller/StorefrontView'";       To = "from '@modules/seller/templates/storefront-view'" },
  @{ From = "from '@/components/seller/VendorOnboardingClient'"; To = "from '@modules/seller/templates/vendor-onboarding-client'" },
  @{ From = "from '@/components/ai/AiConciergeModal'";         To = "from '@modules/ai/components/ai-concierge-modal'" },
  @{ From = "from '@/components/pages/AboutPage'";             To = "from '@modules/content/templates/about-page'" },
  @{ From = "from '@/components/pages/ContactPage'";           To = "from '@modules/content/templates/contact-page'" },
  @{ From = "from '@/components/pages/FaqPage'";               To = "from '@modules/content/templates/faq-page'" },
  @{ From = "from '@/components/pages/MarketplaceSellerPolicyPage'"; To = "from '@modules/content/templates/marketplace-seller-policy-page'" },
  @{ From = "from '@/components/pages/NotFoundPage'";          To = "from '@modules/content/templates/not-not-found-page'" },
  @{ From = "from '@/components/pages/PrivacyPolicyPage'";     To = "from '@modules/content/templates/privacy-policy-page'" },
  @{ From = "from '@/components/pages/ReturnsPolicyPage'";     To = "from '@modules/content/templates/returns-policy-page'" },
  @{ From = "from '@/components/pages/TermsAndConditionsPage'"; To = "from '@modules/content/templates/terms-and-conditions-page'" },

  # --- 3-level deep ui imports (modules/layout/components/*.tsx imports ../../ui) ---
  @{ From = "from '../../ui/SafeImage'";    To = "from '@modules/common/components/safe-image'" },
  @{ From = "from '../../ui/Toast'";        To = "from '@modules/common/components/toast'" },
  @{ From = "from '../../ui/StockBadge'";   To = "from '@modules/common/components/stock-badge'" },
  @{ From = "from '../../ui/ThemeToggle'";  To = "from '@modules/common/components/theme-toggle'" },
  @{ From = "from '../../ui/ErrorBoundary'"; To = "from '@modules/common/components/error-boundary'" },

  # --- Cross-folder PascalCase imports inside modules/ ---
  # templates importing from sibling templates
  @{ From = "from '../home/CategoryBarCarousel'";     To = "from '@modules/home/components/category-bar-carousel'" },
  @{ From = "from '../products/QuickViewModal'";      To = "from '@modules/products/components/quick-view-modal'" },
  @{ From = "from '../products/ProductReviews'";      To = "from '@modules/products/components/product-reviews'" },
  @{ From = "from '../products/VendorOffersBuyBox'";  To = "from '@modules/products/components/vendor-offers-buy-box'" },
  @{ From = "from '../products/RecentlyViewedSection'"; To = "from '@modules/products/components/recently-viewed-section'" },
  @{ From = "from '../auth/AuthModal'";               To = "from '@modules/account/components/auth-modal'" },
  @{ From = "from '../ai/AiConciergeModal'";          To = "from '@modules/ai/components/ai-concierge-modal'" },
  @{ From = "from '../cart/CartDrawer'";              To = "from '@modules/cart/components/cart-drawer'" },

  # layout/templates importing from layout/components (kebab sibling)
  @{ From = "from './StoreHeader'";         To = "from '@modules/layout/components/store-header'" },
  @{ From = "from './StoreFooter'";         To = "from '@modules/layout/components/store-footer'" },
  @{ From = "from './FooterTrustCarousel'"; To = "from '@modules/layout/components/footer-trust-carousel'" },
  @{ From = "from './PromoBannersGrid'";    To = "from '@modules/layout/components/promo-banners-grid'" },
  @{ From = "from './TestimonialsSection'"; To = "from '@modules/layout/components/testimonials-section'" },
  @{ From = "from './NewsletterSection'";   To = "from '@modules/layout/components/newsletter-section'" },
  @{ From = "from './TrustBadgesBar'";      To = "from '@modules/layout/components/trust-badges-bar'" },

  # store-header importing from sub-folder header/ (now flattened as kebab-case)
  @{ From = "from './header/DesktopNavLinks'";      To = "from '@modules/layout/components/desktopnavlinks'" },
  @{ From = "from './header/SearchMegamenuOverlay'"; To = "from '@modules/layout/components/searchmegamenuoverlay'" },
  @{ From = "from './header/MobileNavDrawer'";      To = "from '@modules/layout/components/mobilenavdrawer'" },

  # products/templates importing sibling template kebabs
  @{ From = "from './RecentlyViewedSection'";  To = "from '@modules/products/components/recently-viewed-section'" },
  @{ From = "from './ProductReviews'";         To = "from '@modules/products/components/product-reviews'" },
  @{ From = "from './VendorOffersBuyBox'";     To = "from '@modules/products/components/vendor-offers-buy-box'" },

  # providers/ files: '../components/ui/Toast' is the only stale pattern (from when Toast lived in components/ui)
  @{ From = "from '../components/ui/Toast'";   To = "from '@modules/common/components/toast'" }
)

foreach ($file in $files) {
  $orig = Get-Content $file.FullName -Raw
  $new = $orig
  foreach ($r in $replacements) {
    $new = $new.Replace($r.From, $r.To)
  }
  if ($new -ne $orig) {
    Set-Content -Path $file.FullName -Value $new -NoNewline
    Write-Host "Updated: $($file.FullName.Replace('frontend/src/', ''))"
  }
}

Write-Host "Done"