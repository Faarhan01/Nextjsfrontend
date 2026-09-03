'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import CategoriesPage from '../../components/products/CategoriesPage';
import { getCategoryUrl } from '../../utils/seoUtils';

export default function CategoriesRoute() {
  const router = useRouter();
  const {
    themeColor,
    getThemeClasses,
    categories,
    products
  } = useStore();

  return (
    <div className="w-full">
      <CategoriesPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        categories={categories}
        products={products}
        onSelectCategory={(catName) => router.push(getCategoryUrl(catName))}
      />
    </div>
  );
}
