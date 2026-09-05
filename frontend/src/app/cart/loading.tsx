export default function CartLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <div className="skeleton w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="skeleton h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
