import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../index.css';
import { StoreProvider } from '@/context/StoreContext';
import { AppProviders } from '@/providers/app-providers';
import { StorefrontLayout } from '@modules/layout/templates/storefront-layout';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mrbulk — Online E-Commerce & Marketplace South Africa',
    template: '%s | Mrbulk',
  },
  description: 'Shop retail and wholesale products or discover verified independent marketplace sellers on Mrbulk. Operated by Mr Cheap General Dealer ZA, South Africa.',
  keywords: [
    'Mrbulk',
    'mrbulk.co.za',
    'South Africa ecommerce',
    'wholesale marketplace',
    'retail shopping',
    'marketplace sellers',
    'Johannesburg online store',
  ],
  authors: [{ name: 'Mrbulk' }],
  creator: 'Mrbulk',
  publisher: 'Mr Cheap General Dealer ZA',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: siteUrl,
    siteName: 'Mrbulk',
    title: 'Mrbulk — Online E-Commerce & Marketplace South Africa',
    description: 'Shop retail and wholesale products or buy from verified independent marketplace sellers on Mrbulk (mrbulk.co.za).',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Mrbulk Online Storefront and Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mrbulk — Online E-Commerce & Marketplace South Africa',
    description: 'Shop retail and wholesale products or buy from verified independent marketplace sellers on Mrbulk (mrbulk.co.za).',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Mrbulk',
      legalName: 'Mr Cheap General Dealer ZA',
      url: 'https://mrbulk.co.za',
      logo: `${siteUrl}/favicon.svg`,
      email: 'support@mrbulk.co.za',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '150 Industrial Rd, Crown North',
        addressLocality: 'Johannesburg',
        addressCountry: 'South Africa',
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: 'https://mrbulk.co.za',
      name: 'Mrbulk',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Store',
      '@id': `${siteUrl}/#store`,
      name: 'Mrbulk',
      url: 'https://mrbulk.co.za',
      description: 'Online retail & wholesale marketplace operated by Mr Cheap General Dealer ZA.',
      priceRange: '$$',
      currenciesAccepted: 'ZAR',
      paymentAccepted: 'Credit Card, Debit Card, EFT, Instant Pay',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white font-sans" suppressHydrationWarning>
        <script
          id="dark-mode-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('mrbulk_dark_mode');
                  if (saved === null) {
                    saved = localStorage.getItem('luxestore_dark_mode');
                  }
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved === 'true' || (saved === null && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                    if (document.body) document.body.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                    if (document.body) document.body.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        {/* Google Tag Manager Initializer Script */}
        <Script
          id="gtm-inline-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var gtmId = localStorage.getItem('luxestore_gtm_id') || '${process.env.NEXT_PUBLIC_GTM_ID || ''}';
                  if (gtmId && gtmId.startsWith('GTM-')) {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
                    var f = document.getElementsByTagName('script')[0],
                        j = document.createElement('script');
                    j.id = 'gtm-script-tag';
                    j.setAttribute('data-gtm-id', gtmId);
                    j.async = true;
                    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(gtmId);
                    f.parentNode.insertBefore(j, f);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <noscript id="gtm-noscript-fallback">
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-STORE"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AppProviders>
          <StoreProvider>
            <StorefrontLayout>{children}</StorefrontLayout>
          </StoreProvider>
        </AppProviders>
      </body>
    </html>
  );
}
