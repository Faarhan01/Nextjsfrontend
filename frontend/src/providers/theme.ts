'use client';

import { useThemeContext } from './theme-provider';
import { getThemeClasses, type ThemeClasses, type ThemeColor } from './theme-provider';

export interface UseThemeReturn {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  toggleDarkMode: () => void;
  logoText: string;
  setLogoText: (name: string) => void;
  freeShippingThreshold: number;
  setFreeShippingThreshold: (val: number) => void;
  getThemeClasses: (color: string) => ThemeClasses;
  currentTheme: ThemeClasses;
}

export function useTheme(): UseThemeReturn {
  const ctx = useThemeContext();
  return {
    themeColor: ctx.themeColor,
    setThemeColor: ctx.setThemeColor,
    darkMode: ctx.darkMode,
    setDarkMode: ctx.setDarkMode,
    toggleDarkMode: ctx.toggleDarkMode,
    logoText: ctx.logoText,
    setLogoText: ctx.setLogoText,
    freeShippingThreshold: ctx.freeShippingThreshold,
    setFreeShippingThreshold: ctx.setFreeShippingThreshold,
    getThemeClasses,
    currentTheme: getThemeClasses(ctx.themeColor)
  };
}

export { getThemeClasses, ThemeProvider, useThemeContext } from './theme-provider';
export type { ThemeClasses, ThemeColor } from './theme-provider';