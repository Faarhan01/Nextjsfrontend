import type { MetadataRoute } from 'next';
import { MOCK_PRODUCTS } from '../data/presets';
import { slugify } from '../utils/seoUtils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ais-dev-6gn5ggip67oqekkhfx7fhc-396079311886.europe-west1.run.app';
  const now = new Date();

  // Primary static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/returns-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic Product routes
  const productRoutes: MetadataRoute.Sitemap = MOCK_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/product/${prod.id}-${slugify(prod.name)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: prod.isFeatured ? 0.9 : 0.7,
  }));

  // Dynamic Category routes
  const categories = ['Electronics', 'Watches', 'Audio', 'Accessories', 'Fashion', 'Home Decor'];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${slugify(cat)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
