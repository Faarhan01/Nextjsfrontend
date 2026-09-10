'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
        shadow: 'shadow-emerald-500/25',
        ring: 'focus:ring-emerald-500/30'
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
        shadow: 'shadow-rose-500/25',
        ring: 'focus:ring-rose-500/30'
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
        shadow: 'shadow-amber-500/25',
        ring: 'focus:ring-amber-500/30'
      };
    case 'slate':
      return {
        bg: 'bg-slate-800 hover:bg-slate-900',
        text: 'text-slate-800',
        border: 'border-slate-300 focus:border-slate-600 focus:ring-slate-600/20',
        lightBg: 'bg-slate-100 text-slate-900',
        badge: 'bg-slate-800',
        accent: 'slate',
        primaryHex: '#1e293b',
        shadow: 'shadow-slate-500/25',
        ring: 'focus:ring-slate-500/30'
      };
    case 'blue':
    case 'indigo':
    default:
      return {
        bg: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-600',
        border: 'border-blue-200 focus:border-blue-500 focus:ring-blue-500/20',
        lightBg: 'bg-blue-50 text-blue-700',
        badge: 'bg-blue-600',
        accent: 'blue',
        primaryHex: '#2563eb',
        shadow: 'shadow-blue-500/25',
        ring: 'focus:ring-blue-500/30'
      };
  }
}

interface ThemeContextValue {
  logoText: string;
  setLogoText: (name: string) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  toggleDarkMode: () => void;
  freeShippingThreshold: number;
  setFreeShippingThreshold: (val: number) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [logoText, setLogoText] = useState<string>('Mrbulk');
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(1000);
  const [hydrated, setHydrated] = useState(false);

  const setDarkMode = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setDarkModeState((prev) => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      try {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add('disable-transitions');

          if (nextVal) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
            document.body?.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
            document.body?.classList.remove('dark');
          }

          if (document.body) {
            void window.getComputedStyle(document.body).opacity;
          }

          setTimeout(() => {
            document.documentElement.classList.remove('disable-transitions');
          }, 80);
        }
        localStorage.setItem('mrbulk_dark_mode', nextVal ? 'true' : 'false');
        localStorage.setItem('luxestore_dark_mode', nextVal ? 'true' : 'false');
      } catch {}
      return nextVal;
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, [setDarkMode]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem('mrbulk_logo_text') || localStorage.getItem('luxestore_logo_text');
      if (savedLogo && savedLogo !== 'LuxeStore') {
        setLogoText(savedLogo);
      } else {
        setLogoText('Mrbulk');
        try {
          localStorage.setItem('mrbulk_logo_text', 'Mrbulk');
          localStorage.removeItem('luxestore_logo_text');
        } catch {}
      }

      const savedDarkMode = localStorage.getItem('mrbulk_dark_mode') ?? localStorage.getItem('luxestore_dark_mode');
      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === 'true';
        setDarkModeState(isDark);
        if (typeof document !== 'undefined') {
          if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
            document.body?.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
            document.body?.classList.remove('dark');
          }
        }
      } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkModeState(true);
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
          document.body?.classList.add('dark');
        }
      }

      const savedTheme = localStorage.getItem('mrbulk_theme_color') || localStorage.getItem('luxestore_theme_color');
      if (savedTheme === 'indigo') {
        setThemeColor('blue');
      } else if (savedTheme && ['blue', 'emerald', 'rose', 'amber', 'slate'].includes(savedTheme)) {
        setThemeColor(savedTheme as ThemeColor);
      }

      const savedFreeShipping = localStorage.getItem('mrbulk_free_shipping_threshold') || localStorage.getItem('luxestore_free_shipping_threshold');
      if (savedFreeShipping) setFreeShippingThreshold(Number(savedFreeShipping));

      setHydrated(true);
    } catch (e) {
      console.error('[ThemeProvider] failed to hydrate:', e);
      setHydrated(true);
    }
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('mrbulk_logo_text', logoText);
      localStorage.setItem('mrbulk_theme_color', themeColor);
      localStorage.setItem('mrbulk_free_shipping_threshold', freeShippingThreshold.toString());
    } catch {}
  }, [logoText, themeColor, freeShippingThreshold, hydrated]);

  // Sync runtime CSS variables for theme color
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const theme = getThemeClasses(themeColor);
    const root = document.documentElement;
    root.style.setProperty('--text-accent', theme.primaryHex);
    root.style.setProperty('--border-focus', theme.primaryHex);
    root.style.setProperty('--btn-primary-bg', theme.primaryHex);
    root.style.setProperty('--focus-ring', `${theme.primaryHex}40`);
    root.style.setProperty('--input-ring', `${theme.primaryHex}33`);
    root.style.setProperty('--badge-new-text', theme.primaryHex);
    root.style.setProperty('--badge-new-bg', `${theme.primaryHex}20`);
  }, [themeColor]);

  return (
    <ThemeContext.Provider
      value={{
        logoText,
        setLogoText,
        themeColor,
        setThemeColor,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        freeShippingThreshold,
        setFreeShippingThreshold
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}