'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '@/context/StoreContext';

interface ThemeToggleProps {
  variant?: 'icon-button' | 'pill' | 'menu-item';
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon-button',
  className = '',
  showLabel = false,
}) => {
  const { darkMode, toggleDarkMode, currentTheme } = useStore();

  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors duration-200 ${className}`}
        role="group"
        aria-label="Color theme switcher"
      >
        <button
          type="button"
          onClick={() => {
            if (darkMode) toggleDarkMode();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            !darkMode
              ? 'bg-white text-amber-600 shadow-xs border border-amber-200/60'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          aria-pressed={!darkMode}
          title="Switch to Light Mode"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (!darkMode) toggleDarkMode();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            darkMode
              ? 'bg-slate-900 text-blue-400 shadow-xs border border-blue-500/30'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          aria-pressed={darkMode}
          title="Switch to Dark Mode"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  if (variant === 'menu-item') {
    return (
      <button
        type="button"
        onClick={toggleDarkMode}
        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
        aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              darkMode
                ? 'bg-blue-950/80 text-blue-400 border border-blue-800/60'
                : 'bg-amber-50 text-amber-600 border border-amber-200/80'
            }`}
          >
            {darkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </div>
          <div>
            <div className="font-extrabold">{darkMode ? 'Dark Mode Active' : 'Light Mode Active'}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {darkMode ? 'Click for daytime display' : 'Click for nighttime display'}
            </div>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
            darkMode
              ? 'bg-blue-950 text-blue-300 border-blue-800'
              : 'bg-amber-100 text-amber-700 border-amber-300'
          }`}
        >
          {darkMode ? 'DARK' : 'LIGHT'}
        </span>
      </button>
    );
  }

  // Default: icon-button
  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={`w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer relative hover:scale-105 active:scale-95 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/90 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 ${className}`}
      aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        key={darkMode ? 'dark' : 'light'}
        initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 45, scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {darkMode ? (
          <Moon className="w-4 h-4 text-blue-400 fill-blue-400/20" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
        )}
      </motion.div>
      {showLabel && (
        <span className="text-xs font-semibold ml-1.5 hidden sm:inline">
          {darkMode ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
