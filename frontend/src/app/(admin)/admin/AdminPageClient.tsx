'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useUI } from '@/providers/ui-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import AdminPage from '@components/admin/AdminPage';

export default function AdminPageClient() {
  const router = useRouter();
  const { themeColor, logoText, setLogoText, freeShippingThreshold, setFreeShippingThreshold } = useThemeContext();
  const { showToast } = useToastContext();
  const { currentUser } = useAuthContext();
  const { setSeoModalOpen, setNextjsModalOpen } = useUI();
  const { products, setProducts, categories, setCategories, brands, setBrands, productsSettings, setProductsSettings } = useCatalog();

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
