import { redirect } from 'next/navigation';

// Root route redirects to dashboard — this is the entry point of the app
export default function RootPage() {
  redirect('/dashboard');
}
