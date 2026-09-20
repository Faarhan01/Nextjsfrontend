import JSZip from 'jszip';
import { GenerateTemplateOptions, SerializedProduct, serializeProduct } from './types';
import { renderPageLayout } from './layout';
import {
  renderHomeContent,
  renderShopContent,
  renderCategoriesContent,
  renderAboutContent,
  renderContactContent,
  renderCartContent,
  renderCheckoutContent,
  renderOrderTrackingContent,
  renderFaqContent,
  renderPrivacyContent,
  renderTermsContent,
  renderReadme,
} from './pages';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/data/presets';

export function getCleanProducts(options: GenerateTemplateOptions): SerializedProduct[] {
  const sourceProducts = options.products && options.products.length > 0 ? options.products : MOCK_PRODUCTS;
  return sourceProducts.map((p, idx) => serializeProduct(p, idx));
}

export function getCleanCategories(options: GenerateTemplateOptions): any[] {
  return options.categories && options.categories.length > 0 ? options.categories : MOCK_CATEGORIES;
}

/**
 * Generates the full set of standalone static HTML pages + README for the website.
 */
export function generateMultiPageSite(options: GenerateTemplateOptions = {}): Record<string, string> {
  const products = getCleanProducts(options);
  const categories = getCleanCategories(options);
  const storeName = options.storeName || 'Mrbulk';

  const files: Record<string, string> = {};

  // 1. Home Page
  files['index.html'] = renderPageLayout({
    title: 'Wholesale & Retail Marketplace',
    description: `Shop bulk discounts, direct supplier wholesale, and retail merchandise across South Africa on ${storeName}.`,
    activeNav: 'home',
    content: renderHomeContent(options, products, categories),
    options,
    products,
    categories,
  });

  // 2. Shop Page
  files['shop.html'] = renderPageLayout({
    title: 'Shop Catalog & Products',
    description: `Browse verified wholesale and retail products with nationwide delivery across South Africa.`,
    activeNav: 'shop',
    content: renderShopContent(options, products, categories),
    options,
    products,
    categories,
  });

  // 3. Categories Page
  files['categories.html'] = renderPageLayout({
    title: 'Product Categories',
    description: `Explore all wholesale and retail categories on ${storeName}.`,
    activeNav: 'categories',
    content: renderCategoriesContent(options, products, categories),
    options,
    products,
    categories,
  });

  // 4. About Us Page
  files['about.html'] = renderPageLayout({
    title: 'About Us',
    description: `Learn more about ${storeName} and our Johannesburg logistics hub.`,
    activeNav: 'about',
    content: renderAboutContent(options),
    options,
    products,
    categories,
  });

  // 5. Contact Us Page
  files['contact.html'] = renderPageLayout({
    title: 'Contact Support',
    description: `Get in touch with the ${storeName} team via WhatsApp, phone, or email.`,
    activeNav: 'contact',
    content: renderContactContent(options),
    options,
    products,
    categories,
  });

  // 6. Cart Page
  files['cart.html'] = renderPageLayout({
    title: 'Your Shopping Cart',
    description: `Review your selected items and calculate free nationwide delivery.`,
    activeNav: 'cart',
    content: renderCartContent(),
    options,
    products,
    categories,
  });

  // 7. Checkout Page
  files['checkout.html'] = renderPageLayout({
    title: 'Secure Checkout',
    description: `Fast South African checkout with PayFast, Ozow Instant EFT, and Cash on Delivery.`,
    activeNav: 'checkout',
    content: renderCheckoutContent(),
    options,
    products,
    categories,
  });

  // 8. Order Tracking Page
  files['order-tracking.html'] = renderPageLayout({
    title: 'Track Order',
    description: `Track your courier delivery across South Africa in real time.`,
    activeNav: 'tracking',
    content: renderOrderTrackingContent(),
    options,
    products,
    categories,
  });

  // 9. FAQ Page
  files['faq.html'] = renderPageLayout({
    title: 'Help & FAQs',
    description: `Common questions and answers regarding shipping, returns, and wholesale pricing.`,
    activeNav: 'faq',
    content: renderFaqContent(),
    options,
    products,
    categories,
  });

  // 10. Privacy Policy
  files['privacy-policy.html'] = renderPageLayout({
    title: 'Privacy Policy (POPIA)',
    description: `POPIA-compliant data protection and privacy policy for ${storeName}.`,
    activeNav: 'policies',
    content: renderPrivacyContent(options),
    options,
    products,
    categories,
  });

  // 11. Terms and Conditions
  files['terms-and-conditions.html'] = renderPageLayout({
    title: 'Terms & Conditions',
    description: `Consumer Protection Act terms and conditions for ${storeName}.`,
    activeNav: 'policies',
    content: renderTermsContent(options),
    options,
    products,
    categories,
  });

  // 12. README documentation
  files['README.txt'] = renderReadme(options);

  return files;
}

/**
 * Downloads a ZIP package of the entire multi-page static site.
 */
export async function downloadMultiPageSiteZip(
  options: GenerateTemplateOptions = {},
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const pages = generateMultiPageSite(options);

  for (const [filename, content] of Object.entries(pages)) {
    zip.file(filename, content);
  }

  const storeName = options.storeName || 'Mrbulk';
  const slug = storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const zipFilename = `${slug}-multipage-website.zip`;

  const blob = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 } },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Backward-compatible single-file generator returning the primary index.html
 */
export function generateCompleteHtmlTemplate(options: GenerateTemplateOptions = {}): string {
  const pages = generateMultiPageSite(options);
  return pages['index.html'];
}
