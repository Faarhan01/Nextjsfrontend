'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useUI } from '@/providers/ui-provider';
import { useCatalog } from '@/providers/catalog-provider';
import AdminPageComponent from '@components/admin/AdminPage';

interface AdminDashboardTemplateProps {
  onNavigate?: (page: string) => void;
}

export default function AdminDashboardTemplate({ onNavigate: propOnNavigate }: AdminDashboardTemplateProps) {
  const router = useRouter();
  const { themeColor, logoText, setLogoText, freeShippingThreshold, setFreeShippingThreshold } = useThemeContext();
  const { showToast } = useToastContext();
  const { currentUser } = useAuthContext();
  const { setSeoModalOpen, setNextjsModalOpen } = useUI();
  const {
    products,
    setProducts,
    categories,
    setCategories,
    brands,
    setBrands,
    productsSettings,
    setProductsSettings
  } = useCatalog();

  const onNavigate = (page: string) => {
    if (propOnNavigate) {
      propOnNavigate(page);
      return;
    }
    if (page === 'home' || page === '') router.push('/');
    else if (page === 'shop') router.push('/shop');
    else router.push(page.startsWith('/') ? page : `/${page}`);
  };

  return (
    <div className="w-full">
      <AdminPageComponent
        themeColor={themeColor}
        getThemeClasses={defaultGetThemeClasses}
        onNavigate={onNavigate}
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
