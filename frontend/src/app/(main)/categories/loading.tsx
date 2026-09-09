import React from 'react';

export default function CategoriesLoading() {
  return (
    <div className="w-full min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-4 flex flex-col justify-end space-y-2">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
