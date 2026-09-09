import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="w-full h-36 sm:h-48 rounded-2xl sm:rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800" />

      {/* Filter / Category Bar Skeleton */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="h-9 w-24 rounded-full bg-slate-200/70 dark:bg-slate-800" />
        <div className="h-9 w-28 rounded-full bg-slate-200/70 dark:bg-slate-800" />
        <div className="h-9 w-24 rounded-full bg-slate-200/70 dark:bg-slate-800" />
        <div className="h-9 w-32 rounded-full bg-slate-200/70 dark:bg-slate-800" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-100/80 dark:bg-slate-850/60 rounded-2xl p-3 sm:p-4 border border-slate-200/60 dark:border-slate-800 space-y-3"
          >
            <div className="aspect-square w-full rounded-xl bg-slate-200/70 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-200/70 dark:bg-slate-800 rounded w-4/5" />
              <div className="h-3 bg-slate-200/70 dark:bg-slate-800 rounded w-1/2" />
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div className="h-4 bg-slate-200/70 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-7 w-7 rounded-lg bg-slate-200/70 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
