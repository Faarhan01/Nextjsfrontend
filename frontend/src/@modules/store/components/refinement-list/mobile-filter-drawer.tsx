'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { ThemeClasses } from '@/providers/theme-provider';

export interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
  currentTheme: ThemeClasses;
  children: React.ReactNode;
}

/**
 * Medusa-style MobileFilterDrawer Component
 * Off-canvas slide-in modal drawer for catalog filters on mobile devices.
 */
export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = React.memo(({
  isOpen,
  onClose,
  resultCount,
  currentTheme,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden" 
            onClick={onClose} 
            aria-hidden="true"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-800 shadow-2xl p-5 overflow-y-auto lg:hidden flex flex-col justify-between border-l border-slate-200 dark:border-slate-700"
            role="dialog"
            aria-modal="true"
            aria-label="Filter Catalog"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Filter Catalog
                </h3>
                <button 
                  type="button"
                  onClick={onClose} 
                  className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {children}
            </div>

            <button 
              type="button"
              onClick={onClose} 
              className={`w-full py-3 text-white font-bold text-xs rounded-xl mt-6 shadow-md cursor-pointer ${currentTheme.bg}`}
            >
              Apply & View ({resultCount}) Results
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

MobileFilterDrawer.displayName = 'MobileFilterDrawer';
export default MobileFilterDrawer;
