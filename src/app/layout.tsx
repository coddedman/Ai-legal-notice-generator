import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';

const APP_URL = 'https://mylegalnotice.in';
const APP_NAME = 'My Legal Notice India';
const APP_DESCRIPTION =
  'My Legal Notice is India’s leading AI-powered legal notice generator. Draft professional legal notices, WhatsApp demand messages, and consumer complaint drafts in seconds. Compliant with Bharatiya Nyaya Sanhita (BNS) 2023.';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'My Legal Notice India — Free AI BNS 2023 Compliant Notices',
    template: '%s | My Legal Notice India',
  },
  description: APP_DESCRIPTION,
  keywords: [
    'legal notice generator India',
    'AI legal notice',
    'free legal notice format',
    'BNS 2023 legal notice',
    'Bharatiya Nyaya Sanhita notice',
    'consumer complaint draft India',
    'legal notice for cheating',
    'legal notice for fraud',
    'legal notice for property dispute',
    'legal notice for service delay',
    'advocate legal notice template',
    'online legal notice India',
    'legal notice generator Hindi',
    'demand notice India',
  ],
  authors: [{ name: 'AI Legal Notice Generator' }],
  creator: 'AI Legal Notice Generator',
  publisher: 'AI Legal Notice Generator',
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
    siteName: APP_NAME,
    title: 'My Legal Notice India — Free AI & BNS 2023 Compliant',
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 512,
        height: 512,
        alt: 'AI Legal Notice Generator India — Scales of Justice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Legal Notice India — AI Legal Drafting',
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
                'AI-powered legal notice drafting',
                'BNS 2023 compliant notices',
                'Consumer complaint drafts',
                'WhatsApp demand messages',
                'PDF download with letterhead',
                'Word document download',
                'Advocate branding support',
              ],
              inLanguage: 'en-IN',
              isAccessibleForFree: true,
              keywords: 'legal notice, India, BNS 2023, AI, advocate, consumer complaint',
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
      </head>
      <body suppressHydrationWarning>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
