import { Metadata } from 'next';
import LandingPageClient from '@/components/LandingPageClient';

export const metadata: Metadata = {
  title: 'My Legal Notice | #1 Accurate Legal AI for Indian Lawyers',
  description: 'Draft any legal document expertly in minutes and also get accurate comprehensive research done for you with My Legal Notice | Try it for free today—no credit card required.',
  openGraph: {
    title: 'My Legal Notice | #1 Accurate Legal AI for Indian Lawyers',
    description: 'Draft any legal document expertly in minutes and also get accurate comprehensive research done for you with My Legal Notice | Try it for free today—no credit card required.',
    url: 'https://mylegalnotice.in',
    siteName: 'My Legal Notice',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Legal Notice | #1 Accurate Legal AI for Indian Lawyers',
    description: 'Draft any legal document expertly in minutes and also get accurate comprehensive research done for you with My Legal Notice | Try it for free today—no credit card required.',
  },
};

export default function Page() {
  return <LandingPageClient />;
}
