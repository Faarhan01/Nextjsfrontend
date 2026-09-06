import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black">404</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">Page not found</p>
        <Link href="/" className="text-blue-600 dark:text-blue-400 font-semibold">Return to Mrbulk homepage</Link>
      </div>
    </div>
  );
}
