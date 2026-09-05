import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mrbulk — Online E-Commerce & Marketplace South Africa',
    short_name: 'Mrbulk',
    description: 'Shop retail and wholesale products or discover verified independent marketplace sellers on Mrbulk.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#1d4ed8',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
