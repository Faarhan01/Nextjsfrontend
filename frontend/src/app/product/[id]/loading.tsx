export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="skeleton h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="skeleton h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="skeleton h-10 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="skeleton h-24 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
