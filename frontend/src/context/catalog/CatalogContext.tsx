'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MockWooProduct, SlideConfig, SliderSettings, CategoryCarouselSettings, BrandCarouselSettings, MockCategoryPreset, MockBrandPreset, ProductsSettings } from '../types';
import { MOCK_WOO_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS, DEFAULT_SLIDES, MockCategoryPreset as MockCategoryPresetType, MockBrandPreset as MockBrandPresetType } from '../../data/presets';

export interface CatalogContextType {
  products: MockWooProduct[];
  setProducts: React.Dispatch<React.SetStateAction<MockWooProduct[]>>;
  categories: MockCategoryPreset[];
  setCategories: React.Dispatch<React.SetStateAction<MockCategoryPreset[]>>;
  brands: MockBrandPreset[];
  setBrands: React.Dispatch<React.SetStateAction<MockBrandPreset[]>>;
  slides: SlideConfig[];
  setSlides: React.Dispatch<React.SetStateAction<SlideConfig[]>>;
  sliderSettings: SliderSettings;
  setSliderSettings: React.Dispatch<React.SetStateAction<SliderSettings>>;
  categorySettings: CategoryCarouselSettings;
  setCategorySettings: React.Dispatch<React.SetStateAction<CategoryCarouselSettings>>;
  brandSettings: BrandCarouselSettings;
  setBrandSettings: React.Dispatch<React.SetStateAction<BrandCarouselSettings>>;
  recentlyViewedIds: string[];
  setRecentlyViewedIds: React.Dispatch<React.SetStateAction<string[]>>;
  trackProductView: (productId: string) => void;
  productsSettings: ProductsSettings;
  setProductsSettings: React.Dispatch<React.SetStateAction<ProductsSettings>>;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<MockWooProduct[]>([]);
  const [categories, setCategories] = useState<MockCategoryPreset[]>([]);
  const [brands, setBrands] = useState<MockBrandPreset[]>([]);
  const [slides, setSlides] = useState<SlideConfig[]>([]);
  const [sliderSettings, setSliderSettings] = useState<SliderSettings>({ enabled: true, autoplay: true, interval: 5000, effect: 'fade' });
  const [categorySettings, setCategorySettings] = useState<CategoryCarouselSettings>({ enabled: true, title: 'Shop by Category' });
  const [brandSettings, setBrandSettings] = useState<BrandCarouselSettings>({ enabled: true, title: 'Trusted Brands' });
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [productsSettings, setProductsSettings] = useState<ProductsSettings>({
    globalRetailMarkup: 50,
    globalWholesalePrice: 20,
    minWholesaleQuantity: 6,
  });

  useEffect(() => {
    setProducts(MOCK_WOO_PRODUCTS);
    setCategories(MOCK_CATEGORIES as MockCategoryPreset[]);
    setBrands(MOCK_BRANDS as MockBrandPreset[]);
    setSlides(DEFAULT_SLIDES);
  }, []);

  const trackProductView = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, 20);
      if (typeof window !== 'undefined') {
        localStorage.setItem('luxestore_recently_viewed', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  return (
    <CatalogContext.Provider
      value={{
        products,
        setProducts,
        categories,
        setCategories,
        brands,
        setBrands,
        slides,
        setSlides,
        sliderSettings,
        setSliderSettings,
        categorySettings,
        setCategorySettings,
        brandSettings,
        setBrandSettings,
        recentlyViewedIds,
        setRecentlyViewedIds,
        trackProductView,
        productsSettings,
        setProductsSettings,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
