'use client';

/**
 * MedusaJS Storefront Shop Page Template
 * Re-exports the modular StoreTemplate from @modules/store/templates
 * adhering to MedusaJS storefront architecture while preserving all styling and features.
 */
import { StoreTemplate, StoreTemplateProps } from '@modules/store/templates';

export type ShopPageProps = StoreTemplateProps;
export const ShopTemplate = StoreTemplate;
export const ShopPage = StoreTemplate;

export * from '@modules/store/templates';
export * from '@modules/store/components/refinement-list';
export * from '@modules/store/components/product-preview';
export * from '@modules/store/components/store-banner';

export default StoreTemplate;
