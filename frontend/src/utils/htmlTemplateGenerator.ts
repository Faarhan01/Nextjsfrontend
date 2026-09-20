import { GenerateTemplateOptions } from './html-generator/types';
import {
  generateMultiPageSite,
  downloadMultiPageSiteZip,
  generateCompleteHtmlTemplate,
  getCleanProducts,
  getCleanCategories
} from './html-generator';

export type { GenerateTemplateOptions };
export {
  generateMultiPageSite,
  downloadMultiPageSiteZip,
  generateCompleteHtmlTemplate,
  getCleanProducts,
  getCleanCategories
};

/**
 * Returns the primary index.html for backward compatibility
 */
export function generateHtmlTemplate(options: GenerateTemplateOptions = {}): string {
  return generateCompleteHtmlTemplate(options);
}

/**
 * Downloads the full multi-page static site as a ZIP archive.
 * Includes index.html, shop.html, categories.html, about.html, contact.html,
 * cart.html, checkout.html, order-tracking.html, faq.html, privacy-policy.html,
 * terms-and-conditions.html, and README.txt with exact styling, header, and footer!
 */
export function downloadHtmlTemplate(options: GenerateTemplateOptions = {}): void {
  downloadMultiPageSiteZip(options).catch(err => {
    console.error('Failed to generate multi-page zip:', err);
    // Fallback: download single index.html
    const htmlContent = generateHtmlTemplate(options);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedName = (options.storeName || 'mrbulk-storefront')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    link.href = url;
    link.download = `${sanitizedName || 'mrbulk'}-multipage-site.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
