export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="skeleton h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-14 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="skeleton h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse mt-6" />
        </div>
      </div>
    </div>
  );
}
