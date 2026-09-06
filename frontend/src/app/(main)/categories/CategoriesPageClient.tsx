'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CategoriesPage from '@modules/products/templates/categories-page';
import { getCategoryUrl } from '@/utils/seoUtils';

export default function CategoriesPageClient({
  categories,
  products,
}: {
  categories: any[]
  products: any[]
}) {
  const router = useRouter();

  return (
    <div className="w-full">
      <CategoriesPage
        themeColor="blue"
        getThemeClasses={() => ({
          bg: 'bg-blue-600',
          text: 'text-blue-600',
          border: 'border-blue-600',
          lightBg: 'bg-blue-50',
          shadow: 'shadow-blue-500/20',
        })}
        categories={categories}
        products={products}
        onSelectCategory={(catName) => router.push(getCategoryUrl(catName))}
      />
    </div>
  );
}
