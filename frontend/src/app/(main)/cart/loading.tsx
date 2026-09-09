import React from 'react';

export default function CartLoading() {
  return (
    <div className="w-full min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex gap-4"
            >
              <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
            </div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl w-full pt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
