import React from 'react';

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Checkout Header Skeleton */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="h-8 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Form and Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="h-5 w-44 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="h-5 w-36 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-12 rounded-xl bg-blue-600/30 dark:bg-blue-500/20 mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
