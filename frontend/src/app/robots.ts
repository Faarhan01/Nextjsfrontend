import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ais-dev-6gn5ggip67oqekkhfx7fhc-396079311886.europe-west1.run.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/checkout'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
