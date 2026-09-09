import React from 'react';

export default function ProductLoading() {
  return (
    <div className="w-full min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square w-full rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60" />
            ))}
          </div>
        </div>

        {/* Product Info & Buy Box Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-4/5" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
          </div>

          <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60" />

          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="flex gap-2">
              <div className="h-10 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-10 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-10 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200/60 dark:border-slate-700/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
