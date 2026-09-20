'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { MockProduct } from '@/types';

export interface UIContextType {
  quickViewProduct: MockProduct | null;
  setQuickViewProduct: React.Dispatch<React.SetStateAction<MockProduct | null>>;
  quickViewOpen: boolean;
  setQuickViewOpen: (open: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  aiConciergeOpen: boolean;
  setAiConciergeOpen: (open: boolean) => void;
  nextjsModalOpen: boolean;
  setNextjsModalOpen: (open: boolean) => void;
  htmlExportModalOpen: boolean;
  setHtmlExportModalOpen: (open: boolean) => void;
  seoModalOpen: boolean;
  setSeoModalOpen: (open: boolean) => void;
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
  activeEditorTab: 'settings' | 'codebase';
  setActiveEditorTab: (tab: 'settings' | 'codebase') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handlePerformSearch: (queryToUse?: string) => void;
  navigateTo: (path: string) => void;
  handleOpenQuickView: (prod: MockProduct) => void;
  openQuickView: (prod: MockProduct) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [quickViewProduct, setQuickViewProduct] = useState<MockProduct | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [aiConciergeOpen, setAiConciergeOpen] = useState<boolean>(false);
  const [nextjsModalOpen, setNextjsModalOpen] = useState<boolean>(false);
  const [htmlExportModalOpen, setHtmlExportModalOpen] = useState<boolean>(false);
  const [seoModalOpen, setSeoModalOpen] = useState<boolean>(false);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'settings' | 'codebase'>('settings');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleOpenQuickView = (prod: MockProduct) => {
    setQuickViewProduct(prod);
    setQuickViewOpen(true);
  };

  const navigateTo = (path: string) => {
    setMobileMenuOpen(false);
    setCartOpen(false);
    router.push(path);
  };

  const handlePerformSearch = (queryToUse?: string) => {
    const q = queryToUse !== undefined ? queryToUse : searchQuery;
    setSearchQuery(q);
    setMobileMenuOpen(false);
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    else router.push('/shop');
  };

  const openQuickView = (prod: MockProduct) => handleOpenQuickView(prod);

  return (
    <UIContext.Provider value={{
      quickViewProduct, setQuickViewProduct, quickViewOpen, setQuickViewOpen,
      cartOpen, setCartOpen, authModalOpen, setAuthModalOpen, mobileMenuOpen, setMobileMenuOpen, aiConciergeOpen,
      setAiConciergeOpen, nextjsModalOpen, setNextjsModalOpen, htmlExportModalOpen, setHtmlExportModalOpen, seoModalOpen,
      setSeoModalOpen, editorOpen, setEditorOpen, activeEditorTab, setActiveEditorTab,
      searchQuery, setSearchQuery, handlePerformSearch, navigateTo, handleOpenQuickView, openQuickView
    }}>{children}</UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};

