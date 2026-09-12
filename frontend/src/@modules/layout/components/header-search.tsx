'use client';

import React, { useCallback } from 'react';
import { Search } from 'lucide-react';

interface HeaderSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setShowSearchResults: (show: boolean) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  searchQuery,
  setSearchQuery,
  setShowSearchResults,
  onKeyDown,
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  }, [setSearchQuery, setShowSearchResults]);

  const handleFocus = useCallback(() => {
    setShowSearchResults(true);
  }, [setShowSearchResults]);

  return (
    <div className="relative hidden lg:block flex-1 max-w-[200px] lg:max-w-xs xl:max-w-md mx-2 lg:mx-3">
      <input
        type="text"
        placeholder="Search products, brands, tags..."
        value={searchQuery}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        className="w-full text-xs pl-8.5 pr-3.5 py-1.5 bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 rounded-full transition-all font-medium placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
    </div>
  );
};
