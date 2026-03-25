import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const APP_URL = 'https://mylegalnotice.in';
const APP_NAME = 'AI Legal Desk Pro | Advanced Legal Automation for Indian Advocates';
const APP_DESCRIPTION =
  'The pinnacle of AI-assisted legal drafting in India. Empower your law firm with automated BNS 2023 compliant legal notices, comprehensive case summaries, and precision criminal complaints. Built exclusively for Indian Advocates and Legal Professionals.';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'AI Legal Desk Pro — Advanced Legal Drafting Software for Advocates',
    template: '%s | AI Legal Desk Pro',
  },
  description: APP_DESCRIPTION,
  keywords: [
    'AI legal drafting software India',
    'AI for lawyers India',
    'advocate case management tool',
    'legal tech software for law firms',
    'BNS 2023 legal notice automation',
    'Bharatiya Nyaya Sanhita compliance tool',
    'legal automation for advocates',
    'consumer complaint draft automation',
    'law firm productivity software',
    'AI Legal Desk Pro',
    'legal drafting AI for Indian lawyers',
    'online legal research tool India',
    'automated legal workflow India',
    'legal tech B2B India'
  ],
  authors: [{ name: 'AI Legal Desk Pro' }],
  creator: 'AI Legal Desk Pro',
  publisher: 'AI Legal Desk Pro',
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
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    siteName: 'AI Legal Desk Pro',
    title: 'AI Legal Desk Pro — The Ultimate AI Co-pilot for Indian Advocates',
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 512,
        height: 512,
        alt: 'AI Legal Desk Pro — Advanced Legal Software for Advocates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Legal Desk Pro — Advanced Legal Drafting for Law Firms',
    description: APP_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@legalnoticeai',
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
    shortcut: '/icon.png',
  },
  manifest: '/manifest.json',
  category: 'legal',
  applicationName: APP_NAME,
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    // Add Google Search Console verification token when available
    // google: 'your-verification-token',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a237e' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d1a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Structured Data — JSON-LD for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: APP_NAME,
              url: APP_URL,
              description: APP_DESCRIPTION,
              applicationCategory: 'LegalApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
              featureList: [
                'Automated BNS 2023 compliant legal notices',
                'Precision criminal complaint drafting',
                'Comprehensive case summary generation',
                'Professional PDF downloads with Advocate letterheads',
                'Token-based AI drafting credit system',
                'Advanced legal research and argument building support',
                'Multi-language drafting for Indian jurisdictions',
              ],
              inLanguage: 'en-IN',
              isAccessibleForFree: false,
              keywords: 'law firm software India, advocate case management, legal AI, document automation for lawyers, BNS 2023, AI Legal Desk Pro',
            }),
          }}
        />
        {/* Google Noto Fonts — covers all major Indian scripts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Bengali:wght@400;700&family=Noto+Sans+Tamil:wght@400;700&family=Noto+Sans+Telugu:wght@400;700&family=Noto+Sans+Gujarati:wght@400;700&family=Noto+Sans+Kannada:wght@400;700&family=Noto+Sans+Gurmukhi:wght@400;700&family=Noto+Sans+Malayalam:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9S8612M9TH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9S8612M9TH');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
