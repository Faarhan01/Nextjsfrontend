export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          <div className="w-64 space-y-4 shrink-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="flex-1 space-y-6">
            <div className="skeleton h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="skeleton h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
