import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResultsPageClient from './SearchResultsPageClient';

export const metadata: Metadata = {
  title: 'Search Results — Mrbulk',
  description: 'Search for products, brands, and categories at Mrbulk.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading search...</div>}>
      <SearchResultsPageClient />
    </Suspense>
  );
}
