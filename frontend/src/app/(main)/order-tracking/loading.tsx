export default function OrderTrackingLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="skeleton h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="skeleton h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="skeleton h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="skeleton h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mt-6" />
        </div>
      </div>
    </div>
  );
}
