export interface GeneratedFile {
  path: string;
  code: string;
}

export function generateNextjsProject(storeName: string = 'Mrbulk'): GeneratedFile[] {
  return [
    {
      path: 'package.json',
      code: JSON.stringify(
        {
          name: storeName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          version: '1.0.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
            lint: 'next lint'
          },
          dependencies: {
            next: '^15.0.0',
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            'lucide-react': '^0.475.0',
            motion: '^12.0.0',
            tailwindcss: '^4.0.0'
          }
        },
        null,
        2
      )
    },
    {
      path: 'app/layout.tsx',
      code: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${storeName} - Premium Storefront',
  description: 'Welcome to ${storeName}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
`
    },
    {
      path: 'app/page.tsx',
      code: `export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="py-6 border-b border-slate-200 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">${storeName}</h1>
      </header>
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome to ${storeName}</h2>
        <p className="text-slate-600 max-w-lg mx-auto">Explore our curated collections of luxury items and premium goods.</p>
      </section>
    </main>
  );
}
`
    },
    {
      path: 'app/globals.css',
      code: `@import "tailwindcss";
`
    }
  ];
}
