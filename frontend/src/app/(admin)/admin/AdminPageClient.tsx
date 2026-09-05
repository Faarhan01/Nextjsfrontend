'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import AdminPage from '@components/admin/AdminPage';

export default function AdminPageClient() {
  const router = useRouter();
  const {
    themeColor,
    getThemeClasses,
    showToast,
    currentUser,
    setSeoModalOpen,
    setNextjsModalOpen,
    freeShippingThreshold,
    setFreeShippingThreshold,
    logoText,
    setLogoText,
    products,
    setProducts,
    categories,
    setCategories,
    brands,
    setBrands,
    productsSettings,
    setProductsSettings
  } = useStore();

  return (
    <div className="w-full">
      <AdminPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        onNavigate={(page) => {
          if (page === 'home') router.push('/');
          else if (page === 'shop') router.push('/shop');
          else router.push(`/${page}`);
        }}
        showToast={(msg) => showToast(msg)}
        currentUser={currentUser}
        onOpenSeoInspector={() => setSeoModalOpen(true)}
        onOpenExportNextjs={() => setNextjsModalOpen(true)}
        freeShippingThreshold={freeShippingThreshold}
        onUpdateFreeShippingThreshold={(val) => setFreeShippingThreshold(val)}
        logoText={logoText}
        onUpdateLogoText={(txt) => setLogoText(txt)}
        products={products}
        categories={categories}
        brands={brands}
        productsSettings={productsSettings}
        onUpdateProductsSettings={(settings) => setProductsSettings(settings)}
        onUpdateProducts={(newProds) => setProducts(newProds)}
        onUpdateCategories={(newCats) => setCategories(newCats)}
        onUpdateBrands={(newBrands) => setBrands(newBrands)}
      />
    </div>
  );
}
