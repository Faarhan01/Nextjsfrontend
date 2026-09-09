import React from 'react';

export default function CategoryDetailLoading() {
  return (
    <div className="w-full min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      <div className="h-36 sm:h-48 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-6 flex flex-col justify-end space-y-3">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <div className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
