'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ThemeColor = 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';

export interface ThemeClasses {
  bg: string;
  text: string;
  border: string;
  lightBg: string;
  badge: string;
  accent: string;
  primaryHex: string;
  shadow: string;
  ring: string;
}

export interface UIContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  toggleDarkMode: () => void;
  logoText: string;
  setLogoText: (name: string) => void;
  freeShippingThreshold: number;
  setFreeShippingThreshold: (val: number) => void;
  quickViewOpen: boolean;
  setQuickViewOpen: (open: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  aiConciergeOpen: boolean;
  setAiConciergeOpen: (open: boolean) => void;
  nextjsModalOpen: boolean;
  setNextjsModalOpen: (open: boolean) => void;
  seoModalOpen: boolean;
  setSeoModalOpen: (open: boolean) => void;
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
  activeEditorTab: 'settings' | 'codebase';
  setActiveEditorTab: (tab: 'settings' | 'codebase') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getThemeClasses: (color: string) => ThemeClasses;
  currentTheme: ThemeClasses;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function getThemeClasses(color: string): ThemeClasses {
  switch (color) {
    case 'emerald':
      return {
        bg: 'bg-emerald-600 hover:bg-emerald-700',
        text: 'text-emerald-600',
        border: 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20',
        lightBg: 'bg-emerald-50 text-emerald-700',
        badge: 'bg-emerald-500',
        accent: 'emerald',
        primaryHex: '#10b981',
        shadow: 'shadow-emerald-500/20',
        ring: 'ring-emerald-500/30',
      };
    case 'indigo':
      return {
        bg: 'bg-indigo-600 hover:bg-indigo-700',
        text: 'text-indigo-600',
        border: 'border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500/20',
        lightBg: 'bg-indigo-50 text-indigo-700',
        badge: 'bg-indigo-500',
        accent: 'indigo',
        primaryHex: '#6366f1',
        shadow: 'shadow-indigo-500/20',
        ring: 'ring-indigo-500/30',
      };
    case 'rose':
      return {
        bg: 'bg-rose-600 hover:bg-rose-700',
        text: 'text-rose-600',
        border: 'border-rose-200 focus:border-rose-500 focus:ring-rose-500/20',
        lightBg: 'bg-rose-50 text-rose-700',
        badge: 'bg-rose-500',
        accent: 'rose',
        primaryHex: '#f43f5e',
        shadow: 'shadow-rose-500/20',
        ring: 'ring-rose-500/30',
      };
    case 'amber':
      return {
        bg: 'bg-amber-600 hover:bg-amber-700',
        text: 'text-amber-600',
        border: 'border-amber-200 focus:border-amber-500 focus:ring-amber-500/20',
        lightBg: 'bg-amber-50 text-amber-700',
        badge: 'bg-amber-500',
        accent: 'amber',
        primaryHex: '#f59e0b',
        shadow: 'shadow-amber-500/20',
        ring: 'ring-amber-500/30',
      };
    case 'slate':
      return {
        bg: 'bg-slate-600 hover:bg-slate-700',
        text: 'text-slate-600',
        border: 'border-slate-200 focus:border-slate-500 focus:ring-slate-500/20',
        lightBg: 'bg-slate-100 text-slate-700',
        badge: 'bg-slate-500',
        accent: 'slate',
        primaryHex: '#475569',
        shadow: 'shadow-slate-500/20',
        ring: 'ring-slate-500/30',
      };
    case 'blue':
    default:
      return {
        bg: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-600',
        border: 'border-blue-200 focus:border-blue-500 focus:ring-blue-500/20',
        lightBg: 'bg-blue-50 text-blue-700',
        badge: 'bg-blue-500',
        accent: 'blue',
        primaryHex: '#2563eb',
        shadow: 'shadow-blue-500/20',
        ring: 'ring-blue-500/30',
      };
  }
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [logoText, setLogoText] = useState<string>('Mrbulk');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(1000);
  const [quickViewOpen, setQuickViewOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [aiConciergeOpen, setAiConciergeOpen] = useState<boolean>(false);
  const [nextjsModalOpen, setNextjsModalOpen] = useState<boolean>(false);
  const [seoModalOpen, setSeoModalOpen] = useState<boolean>(false);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'settings' | 'codebase'>('settings');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setDarkMode = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setDarkModeState((prev) => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      if (typeof window !== 'undefined') {
        localStorage.setItem('luxestore_dark_mode', JSON.stringify(nextVal));
      }
      return nextVal;
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, [setDarkMode]);

  const currentTheme = getThemeClasses(themeColor);

  return (
    <UIContext.Provider
      value={{
        themeColor,
        setThemeColor,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        logoText,
        setLogoText,
        freeShippingThreshold,
        setFreeShippingThreshold,
        quickViewOpen,
        setQuickViewOpen,
        cartOpen,
        setCartOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        aiConciergeOpen,
        setAiConciergeOpen,
        nextjsModalOpen,
        setNextjsModalOpen,
        seoModalOpen,
        setSeoModalOpen,
        editorOpen,
        setEditorOpen,
        activeEditorTab,
        setActiveEditorTab,
        searchQuery,
        setSearchQuery,
        getThemeClasses,
        currentTheme,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
