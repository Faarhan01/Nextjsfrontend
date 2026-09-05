import type { Metadata } from 'next';
import SearchResultsPageClient from './SearchResultsPageClient';

export const metadata: Metadata = {
  title: 'Search Results — Mrbulk',
  description: 'Search for products, brands, and categories at Mrbulk.',
};

export default function SearchPage() {
  return <SearchResultsPageClient />;
}
