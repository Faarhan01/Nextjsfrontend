import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResultsTemplate from '@modules/products/templates/search-results-page';

export const metadata: Metadata = {
  title: 'Search Results — Mrbulk',
  description: 'Search for products, brands, and categories at Mrbulk.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading search...</div>}>
      <SearchResultsTemplate />
    </Suspense>
  );
}

