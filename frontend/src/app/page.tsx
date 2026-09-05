import type { Metadata } from 'next';
import { getHomeData } from '../lib/data/home';
import HomePageClient from '@modules/home/templates/home-page-client';

export const metadata: Metadata = {
  title: 'Mrbulk — Online E-Commerce & Marketplace South Africa',
  description: 'Shop retail and wholesale products or discover verified independent marketplace sellers on Mrbulk. Operated by Mr Cheap General Dealer ZA, South Africa.',
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://mrbulk.co.za',
    siteName: 'Mrbulk',
    title: 'Mrbulk — Online E-Commerce & Marketplace South Africa',
    description: 'Shop retail and wholesale products or buy from verified independent marketplace sellers on Mrbulk.',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <HomePageClient
      _initialProducts={data.products}
      _initialCategories={data.categories}
      _initialBrands={data.brands}
      _initialSlides={data.slides}
    />
  );
}
