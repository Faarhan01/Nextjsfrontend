export default function SearchResultsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
              <div className="skeleton h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="skeleton h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
